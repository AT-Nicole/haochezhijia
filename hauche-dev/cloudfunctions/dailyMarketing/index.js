// dailyMarketing 云函数 - 每日营销内容推送
// 定时触发：每天09:00执行
// 为活跃经销商自动生成营销内容建议，保存草稿并推送通知
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// 节假日/营销日历数据
const MARKETING_CALENDAR = {
  // 月份 -> 日期 -> 营销主题
  '1': { '1': '元旦新年', '25': '春节预热' },
  '2': { '14': '情人节' },
  '3': { '8': '妇女节', '15': '消费者权益日' },
  '4': { '5': '清明出行', '22': '地球日·新能源' },
  '5': { '1': '劳动节', '10': '母亲节', '20': '520预热' },
  '6': { '1': '儿童节·家庭出行', '18': '父亲节' },
  '7': { '1': '建党节·红色主题' },
  '8': { '1': '建军节', '18': '七夕情人节' },
  '9': { '10': '教师节', '17': '中秋节' },
  '10': { '1': '国庆节', '31': '万圣节' },
  '11': { '11': '双十一', '27': '感恩节' },
  '12': { '12': '双十二', '25': '圣诞节·年终盛典' }
}

// 获取今天的营销主题
function getTodayOccasion() {
  const now = new Date()
  const month = String(now.getMonth() + 1)
  const day = String(now.getDate())

  // 检查是否是特殊日期
  const monthCalendar = MARKETING_CALENDAR[month] || {}
  if (monthCalendar[day]) {
    return {
      hasSpecial: true,
      occasion: monthCalendar[day],
      type: 'special_date'
    }
  }

  // 检查是否是周末
  const weekDay = now.getDay()
  if (weekDay === 0 || weekDay === 6) {
    return {
      hasSpecial: false,
      occasion: '周末赏车',
      type: 'weekend'
    }
  }

  return {
    hasSpecial: false,
    occasion: '日常营销',
    type: 'daily'
  }
}

// 根据主题生成营销文案模板
function generateMarketingTemplate(occasion, dealerInfo) {
  const templates = {
    special_date: `【${occasion}专场】${dealerInfo.name || '尊贵客户'}专属好礼！
在这个${occasion}，为您甄选心仪座驾，尊享专属礼遇。
到店即享精致茶歇，更有专属金融方案等您品鉴。
限量名额，先到先得！`,

    weekend: `【周末好时光】${dealerInfo.name || '欢迎光临'}邀您赏车
这个周末，何不来一场说走就走的试驾体验？
店内全系车型恭候品鉴，专业顾问一对一服务。
周末到店客户即赠精美礼品一份！`,

    daily: `【今日推荐】${dealerInfo.name || '豪华座驾'}精选
每日为您甄选优质好车，一手车源，品质保障。
专业检测认证，购车无忧。
欢迎随时到店品鉴或预约上门试驾。`
  }

  return templates[occasion.type] || templates.daily
}

exports.main = async (event, context) => {
  const today = new Date()
  console.log(`每日营销任务开始执行: ${today.toLocaleString()}`)

  const results = {
    date: today.toISOString().split('T')[0],
    processedDealers: 0,
    generatedContents: 0,
    errors: []
  }

  try {
    // 获取今天的营销主题
    const occasionInfo = getTodayOccasion()

    // 查询所有活跃的经销商
    const dealersRes = await db.collection('dealers')
      .where({ status: 'active' })
      .limit(100)
      .get()

    const dealers = dealersRes.data || []
    console.log(`找到 ${dealers.length} 个活跃经销商`)

    for (const dealer of dealers) {
      try {
        // 检查该经销商今天是否已经有营销内容
        const existingContent = await db.collection('contents')
          .where({
            dealerId: dealer._id,
            scheduledDate: today.toISOString().split('T')[0]
          })
          .count()

        if (existingContent.total > 0) {
          console.log(`经销商 ${dealer.name} 今日已有营销内容，跳过`)
          continue
        }

        // 生成营销内容
        const template = generateMarketingTemplate(occasionInfo, dealer)

        // 保存营销内容为草稿
        const contentData = {
          dealerId: dealer._id,
          dealerName: dealer.name,
          title: `${occasionInfo.occasion} - ${dealer.name || '豪车之家'}营销推送`,
          content: template,
          type: occasionInfo.type,
          occasion: occasionInfo.occasion,
          status: 'draft', // 草稿状态，需经销商确认后发送
          scheduledDate: today.toISOString().split('T')[0],
          targetTier: 'all', // 全部客户
          platform: 'wechat',
          createTime: db.serverDate()
        }

        await db.collection('contents').add({ data: contentData })
        results.generatedContents++

        // 尝试推送通知给经销商（通过微信消息推送）
        try {
          // 查询经销商关联的openid
          if (dealer.openid) {
            await cloud.openapi.subscribeMessage.send({
              touser: dealer.openid,
              templateId: process.env.MARKETING_TEMPLATE_ID || '',
              page: 'pages/marketing/index',
              data: {
                thing1: { value: occasionInfo.occasion },
                thing2: { value: '营销内容已生成' },
                time3: { value: `${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')}` }
              }
            })
          }
        } catch (notifyErr) {
          console.warn(`通知推送失败: ${notifyErr.message}`)
          // 通知失败不影响主流程
        }

        results.processedDealers++
      } catch (dealerErr) {
        console.error(`处理经销商 ${dealer._id} 时出错:`, dealerErr.message)
        results.errors.push({
          dealerId: dealer._id,
          error: dealerErr.message
        })
      }
    }

    // 记录本次执行日志
    await db.collection('cron_logs').add({
      data: {
        function: 'dailyMarketing',
        executeDate: today.toISOString().split('T')[0],
        processedDealers: results.processedDealers,
        generatedContents: results.generatedContents,
        occasion: occasionInfo.occasion,
        createTime: db.serverDate()
      }
    })

    console.log(`每日营销任务完成: 处理 ${results.processedDealers} 个经销商, 生成 ${results.generatedContents} 条内容`)
  } catch (err) {
    console.error('每日营销任务执行失败:', err)
    results.errors.push({ global: err.message })
  }

  return { code: 0, message: 'ok', data: results }
}
