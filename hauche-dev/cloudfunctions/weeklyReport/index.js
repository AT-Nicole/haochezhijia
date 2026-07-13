// weeklyReport 云函数 - 周报生成
// 定时触发：每周一09:00执行
// 汇总上周各经销商的经营数据，生成周报并推送
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// 获取上周的时间范围
function getLastWeekRange() {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // 周日为7
  const mondayOfThisWeek = new Date(now)
  mondayOfThisWeek.setDate(now.getDate() - dayOfWeek + 1)
  mondayOfThisWeek.setHours(0, 0, 0, 0)

  const sundayOfLastWeek = new Date(mondayOfThisWeek.getTime() - 24 * 60 * 60 * 1000)
  const mondayOfLastWeek = new Date(sundayOfLastWeek)
  mondayOfLastWeek.setDate(sundayOfLastWeek.getDate() - 6)

  return {
    startDate: mondayOfLastWeek,
    endDate: sundayOfLastWeek,
    label: `${mondayOfLastWeek.getMonth() + 1}/${mondayOfLastWeek.getDate()} - ${sundayOfLastWeek.getMonth() + 1}/${sundayOfLastWeek.getDate()}`
  }
}

// 计算转化率
function calcConversionRate(leadsCount, ordersCount) {
  if (leadsCount <= 0) return 0
  return (ordersCount / leadsCount * 100).toFixed(1)
}

exports.main = async (event, context) => {
  const today = new Date()
  console.log(`周报生成任务开始执行: ${today.toLocaleString()}`)

  const { startDate, endDate, label } = getLastWeekRange()

  const results = {
    period: label,
    processedDealers: 0,
    systemTotalLeads: 0,
    systemTotalOrders: 0,
    errors: []
  }

  // 用于排名统计
  const dealerRankings = []

  try {
    // 查询所有活跃经销商
    const dealersRes = await db.collection('dealers')
      .where({ status: 'active' })
      .limit(100)
      .get()

    const dealers = dealersRes.data || []
    console.log(`找到 ${dealers.length} 个活跃经销商`)

    for (const dealer of dealers) {
      try {
        // 查询上周新增线索
        const leadsRes = await db.collection('leads')
          .where({
            dealerId: dealer._id,
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const newLeads = leadsRes.data || []

        // 查询上周成交订单
        const ordersRes = await db.collection('orders')
          .where({
            dealerId: dealer._id,
            status: 'completed',
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const orders = ordersRes.data || []

        // 查询上周服务记录
        const servicesRes = await db.collection('services')
          .where({
            dealerId: dealer._id,
            createTime: _.gte(startDate).and(_.lte(endDate))
          })
          .get()
        const services = servicesRes.data || []

        // 计算统计数据
        const newLeadCount = newLeads.length
        const orderCount = orders.length
        const serviceCount = services.length
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
        const conversionRate = calcConversionRate(newLeadCount, orderCount)

        // 线索来源分布
        const sourceDistribution = {}
        newLeads.forEach(l => {
          const source = l.source || '其他'
          sourceDistribution[source] = (sourceDistribution[source] || 0) + 1
        })

        // 线索状态分布
        const statusDistribution = {}
        newLeads.forEach(l => {
          const status = l.status || '未知'
          statusDistribution[status] = (statusDistribution[status] || 0) + 1
        })

        // 生成周报数据
        const weekReportData = {
          dealerId: dealer._id,
          dealerName: dealer.name,
          period: label,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          // 线索数据
          newLeadCount,
          sourceDistribution,
          statusDistribution,
          // 订单数据
          orderCount,
          totalRevenue,
          // 服务数据
          serviceCount,
          // 核心指标
          conversionRate: parseFloat(conversionRate),
          // 简要分析
          summary: generateWeeklySummary({
            newLeadCount,
            orderCount,
            serviceCount,
            totalRevenue,
            conversionRate: parseFloat(conversionRate),
            dealerName: dealer.name
          }),
          createTime: db.serverDate()
        }

        // 保存周报
        await db.collection('weekly_reports').add({ data: weekReportData })

        // 累计系统统计
        results.systemTotalLeads += newLeadCount
        results.systemTotalOrders += orderCount

        // 收集排名数据
        dealerRankings.push({
          dealerId: dealer._id,
          dealerName: dealer.name,
          orderCount,
          totalRevenue,
          newLeadCount,
          conversionRate: parseFloat(conversionRate)
        })

        // 推送通知给经销商
        try {
          if (dealer.openid) {
            await cloud.openapi.subscribeMessage.send({
              touser: dealer.openid,
              templateId: process.env.WEEKLY_TEMPLATE_ID || '',
              page: 'pages/report/index',
              data: {
                thing1: { value: '周报已生成' },
                thing2: { value: `新增${newLeadCount}条线索` },
                thing3: { value: `成交${orderCount}单` },
                amount4: { value: `¥${totalRevenue.toLocaleString()}` },
                thing5: { value: `转化率${conversionRate}%` }
              }
            })
          }
        } catch (notifyErr) {
          console.warn(`周报通知推送失败: ${notifyErr.message}`)
        }

        results.processedDealers++
      } catch (dealerErr) {
        console.error(`处理经销商 ${dealer._id} 周报时出错:`, dealerErr.message)
        results.errors.push({
          dealerId: dealer._id,
          error: dealerErr.message
        })
      }
    }

    // 生成系统整体周报
    const systemConversionRate = calcConversionRate(results.systemTotalLeads, results.systemTotalOrders)

    // 排名统计
    const topByOrders = [...dealerRankings].sort((a, b) => b.orderCount - a.orderCount).slice(0, 5)
    const topByRevenue = [...dealerRankings].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5)
    const topByConversion = [...dealerRankings]
      .filter(d => d.newLeadCount > 0)
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5)

    const systemReport = {
      function: 'weeklyReport',
      period: label,
      totalDealers: results.processedDealers,
      totalLeads: results.systemTotalLeads,
      totalOrders: results.systemTotalOrders,
      conversionRate: parseFloat(systemConversionRate),
      topPerformers: {
        byOrders: topByOrders,
        byRevenue: topByRevenue,
        byConversion: topByConversion
      },
      createTime: db.serverDate()
    }

    await db.collection('system_reports').add({ data: systemReport })

    // 记录执行日志
    await db.collection('cron_logs').add({
      data: {
        function: 'weeklyReport',
        period: label,
        processedDealers: results.processedDealers,
        totalLeads: results.systemTotalLeads,
        totalOrders: results.systemTotalOrders,
        conversionRate: systemConversionRate,
        createTime: db.serverDate()
      }
    })

    console.log(`周报生成完成: 处理 ${results.processedDealers} 个经销商, 总线索 ${results.systemTotalLeads}, 总成交 ${results.systemTotalOrders}`)
  } catch (err) {
    console.error('周报生成任务执行失败:', err)
    results.errors.push({ global: err.message })
  }

  return { code: 0, message: 'ok', data: results }
}

// 生成周报简要分析
function generateWeeklySummary(data) {
  const summaries = []
  const { newLeadCount, orderCount, serviceCount, totalRevenue, conversionRate, dealerName } = data

  // 线索分析
  if (newLeadCount >= 20) {
    summaries.push(`本周新增线索${newLeadCount}条，获客表现强劲`)
  } else if (newLeadCount >= 10) {
    summaries.push(`本周新增线索${newLeadCount}条，获客量稳定`)
  } else if (newLeadCount > 0) {
    summaries.push(`本周新增线索仅${newLeadCount}条，建议加大引流力度`)
  } else {
    summaries.push('本周无新增线索，需重点关注获客渠道')
  }

  // 成交分析
  if (orderCount >= 5) {
    summaries.push(`成交${orderCount}单，销售业绩优秀`)
  } else if (orderCount > 0) {
    summaries.push(`成交${orderCount}单，继续保持跟进`)
  } else {
    summaries.push('本周暂无成交，需加强转化工作')
  }

  // 转化率分析
  if (conversionRate >= 20) {
    summaries.push(`转化率${conversionRate}%，表现优异`)
  } else if (conversionRate >= 10) {
    summaries.push(`转化率${conversionRate}%，处于正常水平`)
  } else if (newLeadCount > 0) {
    summaries.push(`转化率${conversionRate}%，偏低，建议优化跟进流程`)
  }

  // 服务分析
  if (serviceCount > 0) {
    summaries.push(`完成${serviceCount}项售后服务，客户满意度持续维护`)
  }

  // 收入分析
  if (totalRevenue > 0) {
    summaries.push(`本周销售额¥${totalRevenue.toLocaleString()}`)
  }

  return summaries
}
