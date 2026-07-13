// monthlyFinance 云函数 - 月度财务报表
// 定时触发：每月1日00:00执行
// 汇总上月各经销商的经营数据，生成财务摘要报告并推送
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// 获取上个月的时间范围
function getLastMonthRange() {
  const now = new Date()
  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfLastMonth = new Date(firstDayOfThisMonth.getTime() - 24 * 60 * 60 * 1000)
  const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1)

  return {
    startDate: firstDayOfLastMonth,
    endDate: lastDayOfLastMonth,
    label: `${lastDayOfLastMonth.getFullYear()}年${lastDayOfLastMonth.getMonth() + 1}月`
  }
}

// 计算毛利率
function calcGrossMargin(revenue, cost) {
  if (revenue <= 0) return 0
  return ((revenue - cost) / revenue * 100).toFixed(1)
}

exports.main = async (event, context) => {
  const today = new Date()
  console.log(`月度财务报表开始执行: ${today.toLocaleString()}`)

  const { startDate, endDate, label } = getLastMonthRange()

  const results = {
    period: label,
    processedDealers: 0,
    totalSystemRevenue: 0,
    totalOrders: 0,
    errors: []
  }

  try {
    // 查询所有活跃经销商
    const dealersRes = await db.collection('dealers')
      .where({ status: _.in(['active', 'trial']) })
      .limit(100)
      .get()

    const dealers = dealersRes.data || []
    console.log(`找到 ${dealers.length} 个经销商需要生成财务报告`)

    for (const dealer of dealers) {
      try {
        // 查询上月订单
        const ordersRes = await db.collection('orders')
          .where({
            dealerId: dealer._id,
            status: 'completed',
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const orders = ordersRes.data || []

        // 查询上月佣金记录
        const commissionsRes = await db.collection('commissions')
          .where({
            dealerId: dealer._id,
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const commissions = commissionsRes.data || []

        // 查询上月服务记录（售后等）
        const servicesRes = await db.collection('services')
          .where({
            dealerId: dealer._id,
            type: 'after_sale',
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const services = servicesRes.data || []

        // 计算财务数据
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
        const totalCost = orders.reduce((sum, o) => sum + (parseFloat(o.cost) || 0), 0)
        const totalCommission = commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
        const serviceRevenue = services.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
        const grossMargin = calcGrossMargin(totalRevenue, totalCost)
        const orderCount = orders.length

        // 品牌销售分布
        const brandDistribution = {}
        orders.forEach(o => {
          const brand = o.brand || '其他'
          brandDistribution[brand] = (brandDistribution[brand] || 0) + 1
        })

        // 排序品牌
        const topBrands = Object.entries(brandDistribution)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([brand, count]) => ({ brand, count }))

        // 生成财务摘要
        const financeData = {
          dealerId: dealer._id,
          dealerName: dealer.name,
          period: label,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          // 销售数据
          orderCount,
          totalRevenue,
          totalCost,
          grossMargin: parseFloat(grossMargin),
          // 佣金数据
          totalCommission,
          commissionCount: commissions.length,
          // 售后数据
          serviceRevenue,
          serviceCount: services.length,
          // 品牌分布
          topBrands,
          // 计算净利润（简化）
          netProfit: totalRevenue - totalCost - totalCommission,
          // AI洞察（预留字段，可后续由AI生成）
          insights: generateSimpleInsights({
            orderCount,
            totalRevenue,
            grossMargin: parseFloat(grossMargin),
            serviceRevenue,
            totalCommission,
            topBrands
          }),
          createTime: db.serverDate()
        }

        // 保存财务报告
        await db.collection('finances').add({ data: financeData })

        // 更新经销商月度统计
        await db.collection('dealers').doc(dealer._id).update({
          data: {
            lastMonthRevenue: totalRevenue,
            lastMonthOrders: orderCount,
            lastMonthFinanceDate: today.toISOString().split('T')[0],
            updateTime: db.serverDate()
          }
        })

        // 累计系统总计
        results.totalSystemRevenue += totalRevenue
        results.totalOrders += orderCount

        // 推送通知给经销商
        try {
          if (dealer.openid) {
            await cloud.openapi.subscribeMessage.send({
              touser: dealer.openid,
              templateId: process.env.FINANCE_TEMPLATE_ID || '',
              page: 'pages/finance/index',
              data: {
                thing1: { value: label + '财务报告' },
                thing2: { value: `成交${orderCount}单` },
                amount3: { value: `¥${totalRevenue.toLocaleString()}` },
                thing4: { value: `毛利率${grossMargin}%` }
              }
            })
          }
        } catch (notifyErr) {
          console.warn(`财务报告通知推送失败: ${notifyErr.message}`)
        }

        results.processedDealers++
      } catch (dealerErr) {
        console.error(`处理经销商 ${dealer._id} 财务数据时出错:`, dealerErr.message)
        results.errors.push({
          dealerId: dealer._id,
          error: dealerErr.message
        })
      }
    }

    // 生成系统整体月度报告
    const systemReport = {
      function: 'monthlyFinance',
      period: label,
      totalDealers: results.processedDealers,
      totalOrders: results.totalOrders,
      totalRevenue: results.totalSystemRevenue,
      createTime: db.serverDate()
    }

    await db.collection('system_reports').add({ data: systemReport })

    // 记录执行日志
    await db.collection('cron_logs').add({
      data: {
        function: 'monthlyFinance',
        period: label,
        processedDealers: results.processedDealers,
        totalOrders: results.totalOrders,
        totalRevenue: results.totalSystemRevenue,
        createTime: db.serverDate()
      }
    })

    console.log(`月度财务报表完成: 处理 ${results.processedDealers} 个经销商, 总收入 ¥${results.totalSystemRevenue.toLocaleString()}`)
  } catch (err) {
    console.error('月度财务报表执行失败:', err)
    results.errors.push({ global: err.message })
  }

  return { code: 0, message: 'ok', data: results }
}

// 简单的数据洞察生成（不依赖AI，基于规则）
function generateSimpleInsights(data) {
  const insights = []

  if (data.orderCount > 10) {
    insights.push('本月成交量表现优异，建议继续保持当前营销策略')
  } else if (data.orderCount > 0 && data.orderCount <= 3) {
    insights.push('本月成交量偏低，建议加强线索跟进和营销推广')
  } else if (data.orderCount === 0) {
    insights.push('本月无成交记录，建议排查原因并调整经营策略')
  }

  if (parseFloat(data.grossMargin) < 5) {
    insights.push('毛利率偏低，建议关注采购成本和定价策略')
  } else if (parseFloat(data.grossMargin) > 15) {
    insights.push('毛利率表现优秀，说明定价策略和成本控制良好')
  }

  if (data.serviceRevenue > 0) {
    insights.push(`售后收入¥${data.serviceRevenue.toLocaleString()}，建议加大售后业务拓展`)
  }

  if (data.topBrands.length > 0) {
    insights.push(`热销品牌: ${data.topBrands.slice(0, 3).map(b => `${b.brand}(${b.count}单)`).join('、')}`)
  }

  return insights
}
