// aiService 云函数 - 统一AI服务
// 提供AI对话、车型推荐、营销文案生成等10种AI能力
const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-api-key'

// 各AI功能的系统提示词
const SYSTEM_PROMPTS = {
  chat: `你是豪车之家平台的AI顾问，专精于豪华汽车领域的知识。
你熟悉各大豪华品牌（奔驰、宝马、奥迪、保时捷、路虎、雷克萨斯、玛莎拉蒂、宾利、劳斯莱斯等）的车型参数、配置、市场行情和购车建议。
回答时请专业、准确、友好，必要时给出具体数据支撑。
如果是非汽车类问题，礼貌告知你的专长范围。`,

  recommend: `你是豪华汽车领域的资深选车顾问。
根据客户的预算、偏好和用车场景，从候选车型中推荐最合适的车辆。
推荐时需要给出每款车的推荐理由，包括性能、舒适度、保值率、品牌价值等维度的分析。
请给出排名和综合评分（满分100分）。`,

  generateContent: `你是豪华汽车领域的营销文案专家。
擅长为豪华汽车品牌创作各类营销内容，包括朋友圈文案、公众号文章、短视频脚本、海报文案等。
文案风格可以灵活调整：高端大气、亲和接地气、专业权威、激情热血等。
请确保内容专业准确，同时具有吸引力和传播力。`,

  tierContent: `你是豪车之家的客户分层运营专家。
根据客户等级（高价值客户、普通客户、潜在客户）生成差异化的营销内容。
高价值客户：强调专属权益、尊贵体验、个性化服务。
普通客户：强调性价比、实用价值、活动优惠。
潜在客户：强调品牌故事、产品亮点、引导到店体验。
内容需要符合微信生态的传播特点。`,

  eventPlan: `你是豪华汽车品牌活动策划专家。
擅长策划高端汽车品牌的市场活动，包括新车发布会、试驾体验日、客户答谢会、品牌沙龙等。
方案需要包含完整的时间安排、场地建议、餐饮方案、活动流程、预算分配等。
目标客户群体为高净值人群，体验感和品质感是核心。`,

  priceAnalysis: `你是豪华汽车市场的价格分析专家。
擅长分析各品牌各车型的市场价格走势，对比不同城市、不同渠道的价格差异。
分析时需要给出市场均价、价格区间、谈价空间、最佳购买时机等建议。
数据来源可靠，分析客观公正。`,

  financeReport: `你是豪车之家经销商的财务分析顾问。
擅长分析汽车经销商的经营数据，包括销售收入、成本结构、利润率、库存周转等。
报告需要清晰展示关键财务指标，识别经营亮点和风险点，给出改进建议。
请用专业但易懂的语言，方便经销商管理层理解。`,

  followUp: `你是豪华汽车销售领域的客户跟进专家。
根据客户的购车意向阶段和历史互动记录，生成个性化的跟进建议。
建议需要包含：跟进时机、跟进渠道（电话/微信/到店）、跟进话术要点、预期目标。
要确保跟进频率适中，不会给客户造成压力。`,

  referralPoster: `你是豪华汽车转介绍运营专家。
帮助客户生成转介绍海报的文案内容，让客户愿意分享给身边的朋友。
文案需要体现分享者的品味和身份，同时突出车辆的卖点和转介绍奖励。
语言要高端大气但不失亲和力。`,

  businessMatch: `你是豪车之家的商务资源匹配专家。
根据用户的需求和行业背景，在平台资源中找到最合适的商业合作伙伴。
匹配维度包括：业务互补性、地域便利性、合作潜力、信誉评级等。
推荐时给出合作建议和对接方式。`
}

// HTTPS POST 请求封装（使用 Node.js 原生 https 模块）
function httpsPost(url, headers, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const postData = JSON.stringify(body)
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.path,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(new Error('API返回数据格式错误'))
        }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

// 调用 DeepSeek API 的通用方法
async function callDeepSeek(systemPrompt, userPrompt, options = {}) {
  const requestBody = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 2000
  }

  const response = await httpsPost(
    DEEPSEEK_API_URL,
    {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    requestBody
  )

  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content
  }

  throw new Error(response.error?.message || 'AI服务调用失败')
}

// ==================== 10个AI处理器 ====================

// 1. AI对话
async function chat(data) {
  const { message, userId, context } = data
  if (!message) throw new Error('请输入您的问题')

  // 获取用户的对话历史（最近5条）
  let historyContext = ''
  if (userId) {
    const historyRes = await db.collection('chat_history')
      .where({ userId })
      .orderBy('createTime', 'desc')
      .limit(5)
      .get()
    if (historyRes.data && historyRes.data.length > 0) {
      const history = historyRes.data.reverse()
      historyContext = '\n\n最近的对话历史：\n' +
        history.map(h => `${h.role === 'user' ? '客户' : '顾问'}：${h.content}`).join('\n')
    }
  }

  // 构建完整用户消息
  const fullPrompt = `${historyContext}\n\n客户当前问题：${message}`

  // 调用AI
  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.chat, fullPrompt)

  // 保存对话记录
  if (userId) {
    await db.collection('chat_history').add({
      data: {
        userId,
        role: 'user',
        content: message,
        createTime: db.serverDate()
      }
    })
    await db.collection('chat_history').add({
      data: {
        userId,
        role: 'assistant',
        content: aiResponse,
        createTime: db.serverDate()
      }
    })
  }

  return { reply: aiResponse }
}

// 2. 车型推荐
async function recommend(data) {
  const { budget, preference, usage, userId } = data
  if (!budget) throw new Error('请提供购车预算')

  // 查询在库车辆
  const vehiclesRes = await db.collection('vehicles')
    .where({ status: 'active' })
    .limit(50)
    .get()
  const vehicles = vehiclesRes.data || []

  // 根据预算筛选
  const budgetNum = parseFloat(budget.replace(/[^\d.]/g, ''))
  const filteredVehicles = vehicles.filter(v => {
    const price = parseFloat((v.price || '0').replace(/[^\d.]/g, ''))
    return price <= budgetNum * 1.2 // 留20%弹性空间
  })

  // 构建推荐提示
  const vehicleInfo = filteredVehicles.length > 0
    ? filteredVehicles.slice(0, 10).map(v =>
        `${v.brand || ''} ${v.model || ''} - 价格: ${v.price || '面议'}, 年份: ${v.year || '未知'}, 里程: ${v.mileage || '未知'}, 类型: ${v.vehicleType || '未知'}`
      ).join('\n')
    : '暂无匹配的在库车辆'

  const userPrompt = `客户需求：
- 预算：${budget}
- 品牌偏好：${preference || '不限'}
- 用途：${usage || '日常通勤'}

在库候选车型：
${vehicleInfo}

请根据客户需求，从候选车型中推荐最合适的3-5款车，给出排名、评分和推荐理由。如果候选车型不理想，也可以推荐同价位其他值得关注的车型。`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.recommend, userPrompt, {
    temperature: 0.5,
    maxTokens: 2500
  })

  // 保存推荐记录
  if (userId) {
    await db.collection('recommendations').add({
      data: {
        userId,
        budget,
        preference,
        usage,
        result: aiResponse,
        createTime: db.serverDate()
      }
    })
  }

  return { recommendations: aiResponse }
}

// 3. 营销文案生成
async function generateContent(data) {
  const { type, brand, model, tone, platform } = data
  if (!type || !brand) throw new Error('请提供文案类型和品牌信息')

  // 文案类型映射
  const typeMap = {
    social_post: '朋友圈/社交媒体文案',
    wechat_article: '微信公众号文章',
    short_video_script: '短视频脚本',
    poster_text: '海报文案'
  }

  const typeName = typeMap[type] || type
  const toneDesc = tone || '高端大气'
  const platformDesc = platform || '微信'

  const userPrompt = `请生成以下营销文案：
- 文案类型：${typeName}
- 车辆品牌：${brand}
- 车型：${model || '通用品牌文案'}
- 语气风格：${toneDesc}
- 发布平台：${platformDesc}

要求：
1. 内容专业且具有吸引力
2. 突出品牌价值和产品亮点
3. 符合${platformDesc}平台的传播特点
4. 包含引导行动的Call to Action
5. 长度控制在300字以内（文章类型可适当加长）`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.generateContent, userPrompt, {
    temperature: 0.8,
    maxTokens: 1500
  })

  return {
    type,
    platform: platformDesc,
    tone: toneDesc,
    content: aiResponse
  }
}

// 4. 分层群发内容
async function tierContent(data) {
  const { tier, occasion } = data
  if (!tier) throw new Error('请指定客户层级')

  const tierMap = {
    high_value: '高价值客户（VIP）',
    regular: '普通客户',
    potential: '潜在客户'
  }

  const tierName = tierMap[tier] || tier
  const occasionDesc = occasion || '日常关怀'

  const userPrompt = `请为${tierName}生成营销群发内容：
- 场合：${occasionDesc}
- 客户层级：${tierName}

要求：
1. 内容符合该层级客户的期望和调性
2. 适合微信消息群发（简洁明了）
3. 包含个性化的称呼建议
4. 提供行动引导
5. 生成2-3个版本供选择`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.tierContent, userPrompt, {
    temperature: 0.7,
    maxTokens: 1500
  })

  return {
    tier,
    occasion: occasionDesc,
    content: aiResponse
  }
}

// 5. 活动方案
async function eventPlan(data) {
  const { eventType, budget, expectedAttendees, theme } = data
  if (!eventType) throw new Error('请指定活动类型')

  const userPrompt = `请为豪华汽车经销商策划一份完整的活动方案：
- 活动类型：${eventType}
- 活动预算：${budget || '待定'}
- 预计参与人数：${expectedAttendees || '20-30人'}
- 活动主题：${theme || '与车型相关'}

请包含以下内容：
1. 活动概述和目标
2. 时间安排（详细流程表）
3. 场地建议和布置方案
4. 餐饮方案
5. 互动环节设计
6. 预算分配明细
7. 预期效果和KPI
8. 注意事项和备选方案`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.eventPlan, userPrompt, {
    temperature: 0.6,
    maxTokens: 3000
  })

  return {
    eventType,
    theme: theme || '通用',
    plan: aiResponse
  }
}

// 6. 比价分析
async function priceAnalysis(data) {
  const { vehicleId, city } = data
  if (!vehicleId) throw new Error('请提供车辆ID')

  // 查询目标车辆
  const vehicleRes = await db.collection('vehicles').doc(vehicleId).get()
  const vehicle = vehicleRes.data

  // 查询同品牌同车型的其他车辆记录
  const sameModelRes = await db.collection('vehicles')
    .where({
      status: 'active',
      brand: vehicle.brand,
      model: vehicle.model
    })
    .limit(20)
    .get()
  const sameModelVehicles = sameModelRes.data || []

  // 构建价格分析提示
  const priceList = sameModelVehicles.map(v =>
    `${v.year || '未知'}款 ${v.trim || ''} - 售价: ${v.price || '面议'}, 城市: ${v.city || '未知'}`
  ).join('\n')

  const userPrompt = `请对以下豪华汽车进行比价分析：
- 目标车辆：${vehicle.brand} ${vehicle.model} ${vehicle.year || ''}款 ${vehicle.trim || ''}
- 目标城市：${city || '全国'}
- 目标售价：${vehicle.price || '面议'}

同车型在库记录：
${priceList || '暂无同车型记录'}

请分析：
1. 当前售价是否合理
2. 同城/全国价格对比
3. 市场行情走势判断
4. 谈价空间评估
5. 最佳购买时机建议
6. 综合购买建议（买/不买/再等等）`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.priceAnalysis, userPrompt, {
    temperature: 0.4,
    maxTokens: 2000
  })

  return {
    vehicleId,
    vehicle: { brand: vehicle.brand, model: vehicle.model, price: vehicle.price },
    analysis: aiResponse
  }
}

// 7. 财务报告
async function financeReport(data) {
  const { dealerId, period } = data
  if (!dealerId) throw new Error('请提供经销商ID')

  // 计算查询时间范围
  const now = new Date()
  let startDate
  const periodStr = period || '本月'

  if (period === '本月') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (period === '上月') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  } else if (period === '本季度') {
    startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  }
  const endDate = new Date()

  // 查询订单数据
  const ordersRes = await db.collection('orders')
    .where({
      dealerId,
      createTime: _.gte(startDate).and(_.lte(endDate))
    })
    .get()
  const orders = ordersRes.data || []

  // 查询佣金数据
  const commissionsRes = await db.collection('commissions')
    .where({
      dealerId,
      createTime: _.gte(startDate).and(_.lte(endDate))
    })
    .get()
  const commissions = commissionsRes.data || []

  // 汇总数据
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
  const totalCommission = commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
  const totalOrders = orders.length

  const userPrompt = `请为豪华汽车经销商生成${periodStr}财务分析报告：

基础数据：
- 统计周期：${startDate.toISOString().split('T')[0]} 至 ${endDate.toISOString().split('T')[0]}
- 成交订单数：${totalOrders}
- 销售总额：¥${totalRevenue.toLocaleString()}
- 佣金总额：¥${totalCommission.toLocaleString()}

订单明细摘要：
${orders.slice(0, 20).map(o => `  ${o.brand || ''} ${o.model || ''} - ¥${o.amount || 0} - ${o.createTime ? new Date(o.createTime).toLocaleDateString() : '未知日期'}`).join('\n')}

请分析：
1. 收入概况和趋势
2. 成本结构分析
3. 利润率分析
4. 同比/环比变化（如有参考数据）
5. 经营亮点和风险点
6. 下阶段经营建议`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.financeReport, userPrompt, {
    temperature: 0.3,
    maxTokens: 2500
  })

  // 保存报告
  await db.collection('finances').add({
    data: {
      dealerId,
      period: periodStr,
      startDate,
      endDate,
      totalRevenue,
      totalCommission,
      totalOrders,
      report: aiResponse,
      createTime: db.serverDate()
    }
  })

  return {
    dealerId,
    period: periodStr,
    totalRevenue,
    totalCommission,
    totalOrders,
    report: aiResponse
  }
}

// 8. 跟进建议
async function followUp(data) {
  const { leadId } = data
  if (!leadId) throw new Error('请提供线索ID')

  // 查询线索信息
  const leadRes = await db.collection('leads').doc(leadId).get()
  const lead = leadRes.data

  // 查询跟进历史
  const followRes = await db.collection('services')
    .where({
      leadId,
      type: 'follow_up'
    })
    .orderBy('createTime', 'desc')
    .limit(10)
    .get()
  const followHistory = followRes.data || []

  // 构建跟进建议提示
  const historyInfo = followHistory.length > 0
    ? followHistory.map(f => `  ${new Date(f.createTime).toLocaleDateString()} - ${f.result || f.content || '跟进记录'}（方式：${f.channel || '未记录'}）`).join('\n')
    : '暂无跟进记录'

  const daysSinceLastContact = followHistory.length > 0
    ? Math.floor((Date.now() - new Date(followHistory[0].createTime).getTime()) / (1000 * 60 * 60 * 24))
    : '无记录'

  const userPrompt = `请为以下购车客户生成跟进建议：

客户信息：
- 姓名：${lead.name || '未知'}
- 意向车型：${lead.brand || '未知'} ${lead.model || '未知'}
- 预算：${lead.budget || '未知'}
- 当前状态：${lead.status || '未知'}
- 来源渠道：${lead.source || '未知'}
- 上次跟进距今：${daysSinceLastContact}天

跟进历史：
${historyInfo}

请提供：
1. 当前客户意向评估
2. 建议的跟进时机（具体到某一天）
3. 建议的跟进渠道（电话/微信/到店）
4. 跟进话术要点（3-5个关键话题）
5. 本次跟进的预期目标
6. 如果客户无响应的备选方案`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.followUp, userPrompt, {
    temperature: 0.5,
    maxTokens: 1500
  })

  // 自动创建跟进任务
  const taskDate = new Date()
  taskDate.setDate(taskDate.getDate() + 1) // 默认明天跟进

  await db.collection('services').add({
    data: {
      leadId,
      dealerId: lead.dealerId,
      type: 'follow_up',
      status: 'pending',
      suggestion: aiResponse,
      scheduledDate: taskDate,
      createTime: db.serverDate()
    }
  })

  return {
    leadId,
    suggestion: aiResponse,
    taskCreated: true,
    scheduledDate: taskDate.toISOString().split('T')[0]
  }
}

// 9. 转介绍海报
async function referralPoster(data) {
  const { userId, vehicleId, customText } = data
  if (!userId) throw new Error('请提供用户ID')

  // 查询用户信息
  let userInfo = {}
  try {
    const userRes = await db.collection('users').doc(userId).get()
    userInfo = userRes.data || {}
  } catch (e) {
    // 用户不存在时使用默认值
  }

  // 查询车辆信息
  let vehicleInfo = {}
  if (vehicleId) {
    try {
      const vehicleRes = await db.collection('vehicles').doc(vehicleId).get()
      vehicleInfo = vehicleRes.data || {}
    } catch (e) {
      // 车辆不存在时使用默认值
    }
  }

  const userPrompt = `请为豪华汽车客户生成转介绍海报文案：

客户信息：
- 昵称：${userInfo.nickName || '尊贵车主'}
- 已购/意向车型：${vehicleInfo.brand || ''} ${vehicleInfo.model || '豪华座驾'}

${customText ? `客户自定义文案：${customText}` : ''}

请生成：
1. 海报主标题（简洁有力，不超过10个字）
2. 海报副标题（描述性文字，不超过20个字）
3. 正文推荐语（50-80字，体现分享者的用车体验和推荐理由）
4. 底部引导语（如"扫码了解更多"等）
5. 海报整体风格建议（配色、排版方向）
6. 3个适合分享到朋友圈的短文案版本（每条不超过30字）`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.referralPoster, userPrompt, {
    temperature: 0.8,
    maxTokens: 1500
  })

  // 保存转介绍记录
  await db.collection('referrals').add({
    data: {
      userId,
      vehicleId: vehicleId || null,
      posterContent: aiResponse,
      customText: customText || '',
      createTime: db.serverDate()
    }
  })

  return {
    userId,
    vehicleId,
    posterContent: aiResponse,
    note: '文案已生成，海报图片制作需配合图片生成服务使用'
  }
}

// 10. 资源匹配
async function businessMatch(data) {
  const { userId, needs, industry } = data
  if (!userId) throw new Error('请提供用户ID')

  // 查询商业合作伙伴
  const partnersRes = await db.collection('business_partner')
    .where({ status: 'active' })
    .limit(30)
    .get()
  const partners = partnersRes.data || []

  // 查询经销商数据
  const dealersRes = await db.collection('dealers')
    .where({ status: 'active' })
    .limit(20)
    .get()
  const dealers = dealersRes.data || []

  // 构建资源池描述
  const partnerInfo = partners.map(p =>
    `${p.name || '未知'} - 行业: ${p.industry || '未知'}, 类型: ${p.type || '未知'}, 地区: ${p.city || '未知'}, 优势: ${p.strengths || '未知'}`
  ).join('\n')

  const dealerInfo = dealers.map(d =>
    `${d.name || '未知'} - 品牌: ${d.brands ? d.brands.join(',') : '未知'}, 地区: ${d.city || '未知'}, 评级: ${d.rating || '未知'}`
  ).join('\n')

  // 查询用户信息
  let userInfo = {}
  try {
    const userRes = await db.collection('users').doc(userId).get()
    userInfo = userRes.data || {}
  } catch (e) {
    // 忽略
  }

  const userPrompt = `请为以下用户匹配最适合的商业资源：

用户信息：
- 姓名/公司：${userInfo.name || userInfo.nickName || '未知'}
- 行业：${industry || userInfo.industry || '未知'}
- 需求描述：${needs || '未提供具体需求'}

平台商业合作伙伴：
${partnerInfo || '暂无合作伙伴数据'}

平台经销商：
${dealerInfo || '暂无经销商数据'}

请提供：
1. 最匹配的3-5个推荐对象（按匹配度排序）
2. 每个推荐对象的匹配理由
3. 建议的合作方式
4. 对接时需要注意的事项
5. 合作可能带来的价值预估`

  const aiResponse = await callDeepSeek(SYSTEM_PROMPTS.businessMatch, userPrompt, {
    temperature: 0.5,
    maxTokens: 2000
  })

  return {
    userId,
    needs: needs || '',
    industry: industry || '',
    recommendations: aiResponse
  }
}

// ==================== 云函数入口 ====================
exports.main = async (event, context) => {
  const { action, data } = event

  // action 和 data 参数校验
  if (!action) {
    return { code: -1, message: '缺少action参数', data: null }
  }

  // 处理器映射
  const handlers = {
    chat,              // AI对话
    recommend,        // 车型推荐
    generateContent,   // 营销文案
    tierContent,       // 分层群发
    eventPlan,         // 活动方案
    priceAnalysis,     // 比价分析
    financeReport,     // 财务报告
    followUp,          // 跟进建议
    referralPoster,    // 转介绍海报
    businessMatch      // 资源匹配
  }

  // 检查 action 是否合法
  if (!handlers[action]) {
    return { code: -1, message: `未知的action: ${action}`, data: null }
  }

  try {
    // 执行对应的处理器
    const result = await handlers[action](data || {})
    return { code: 0, message: 'ok', data: result }
  } catch (err) {
    console.error(`aiService [${action}] 错误:`, err)
    return { code: -1, message: err.message, data: null }
  }
}
