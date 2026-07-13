/**
 * AI 服务层
 * 统一封装所有AI功能调用
 * 当前使用大模型API（DeepSeek/通义千问）
 *
 * 使用方式：
 * - 直接调用（云函数中转，避免暴露API Key）
 * - 提示词模板化，传入变量即可
 */

const CLOUD_FUNCTION = 'aiService' // 云函数名称

const USE_MOCK = process.env.NODE_ENV === 'development' || !Taro.cloud?.callFunction

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 通用AI调用（通过云函数中转，开发环境自动降级为Mock）
 * @param {string} action - AI功能标识
 * @param {object} params - 参数
 * @returns {Promise<object>}
 */
async function callAI(action, params = {}) {
  if (USE_MOCK) {
    await sleep(800) // 模拟网络延迟
    return mockResponse(action, params)
  }
  try {
    const res = await Taro.cloud.callFunction({
      name: 'aiService',
      data: { action, data: params }
    })
    return res.result?.data || res.result
  } catch (err) {
    console.error('AI service error:', err)
    // 降级到Mock数据
    return mockResponse(action, params)
  }
}

/**
 * AI功能：智能客服对话
 * @param {string} message - 用户消息
 * @param {string} context - 上下文（车型/预算等）
 */
export async function chatWithAI(message, context = {}) {
  return callAI('chat', { message, context })
}

/**
 * AI功能：车型推荐
 * @param {object} params - { budget, purpose, brand, bodyType }
 */
export async function getCarRecommendation(params) {
  return callAI('recommend', params)
}

/**
 * AI功能：生成营销文案
 * @param {string} type - 'short-video' | 'wechat-post' | 'poster' | 'selling-point'
 * @param {object} carInfo - 车辆信息
 */
export async function generateMarketingContent(type, carInfo) {
  return callAI('generateContent', { type, carInfo })
}

/**
 * AI功能：客户分层群发内容
 * @param {string} tier - 'vip' | 'intent' | 'dormant'
 * @param {string} scenario - 'holiday' | 'new-arrival' | 'price-drop'
 */
export async function generateTierContent(tier, scenario) {
  return callAI('tierContent', { tier, scenario })
}

/**
 * AI功能：活动策划方案
 * @param {string} theme - 活动主题
 * @param {string} type - 活动类型
 */
export async function generateEventPlan(theme, type) {
  return callAI('eventPlan', { theme, type })
}

/**
 * AI功能：车辆比价分析
 * @param {string} brand - 品牌
 * @param {string} model - 车型
 */
export async function getCarPriceAnalysis(brand, model) {
  return callAI('priceAnalysis', { brand, model })
}

/**
 * AI功能：财务分析报告
 * @param {string} dealerId - 车行ID
 * @param {string} period - 会计期间
 */
export async function getFinancialReport(dealerId, period) {
  return callAI('financeReport', { dealerId, period })
}

/**
 * AI功能：客户跟进建议
 * @param {string} leadId - 线索ID
 */
export async function getFollowUpSuggestion(leadId) {
  return callAI('followUp', { leadId })
}

/**
 * AI功能：生成转介绍海报文案
 * @param {object} referrerInfo - 推荐人信息
 */
export async function generateReferralPoster(referrerInfo) {
  return callAI('referralPoster', referrerInfo)
}

/**
 * AI功能：企业家资源匹配
 * @param {string} userId - 用户ID
 * @param {string} industry - 行业
 */
export async function getBusinessMatch(userId, industry) {
  return callAI('businessMatch', { userId, industry })
}

// ============ Mock 数据（MVP阶段使用）============

function mockResponse(action, params) {
  const mocks = {
    chat: {
      reply: `您好！根据您的需求，我为您推荐以下车型：
1. 迈巴赫S480 ¥288万 - 商务首选，舒适性行业标杆
2. 奔驰G63 ¥258万 - 动力强悍，兼顾城市与越野
需要了解哪款车的详细信息？`,
      suggestedCars: ['maybach-s480', 'benz-g63']
    },
    recommend: {
      cars: [
        { name: '迈巴赫S480', price: 288, match: 96, reason: '商务出行首选' },
        { name: '奔驰G63', price: 258, match: 92, reason: '动力与实用兼备' },
        { name: '保时捷911', price: 198, match: 85, reason: '操控体验出色' }
      ]
    },
    generateContent: {
      type: params.type,
      title: `【${params.carInfo?.brand || '豪华'} ${params.carInfo?.model || '座驾'}】`,
      content: '尊贵不凡，驾驭未来。限时尊享优惠，私信了解详情。',
      hashtags: ['#豪车之家', '#深圳豪车', '#豪华座驾']
    },
    tierContent: {
      title: params.scenario === 'holiday' ? '节日问候' : '专属推荐',
      content: '尊敬的VIP客户，为您精选...'
    },
    eventPlan: {
      title: params.theme,
      timeline: ['场地确认', '嘉宾邀约', '物料准备', '现场执行', '活动复盘'],
      budget: '¥50,000 - ¥100,000',
      expectedAttendees: 30
    },
    priceAnalysis: {
      nationalAvg: 291.3,
      cities: [
        { city: '深圳', price: 288, dealer: '尊享名车' },
        { city: '广州', price: 292, dealer: '粤淘名车' },
        { city: '成都', price: 285, dealer: '锦晟名车' }
      ],
      suggestion: '深圳报价低于全国均价，建议从深圳采购'
    },
    financeReport: {
      revenue: 3280000,
      expense: 2860000,
      netProfit: 420000,
      costPerLead: 2800,
      topExpense: { category: '车辆采购', amount: 2180000 }
    },
    followUp: {
      suggestion: '建议今天联系，客户正在对比竞品',
      priority: 'high',
      suggestedAction: '发送车型对比报告 + 邀请到店试驾'
    },
    referralPoster: {
      headline: '尊享名车 · 值得信赖',
      subtext: '扫码享专属优惠',
      shareCode: 'HC2026'
    },
    businessMatch: {
      matches: [
        { name: '张总', industry: '科技', commonFriends: 3 },
        { name: '刘总', industry: '地产', budget: 2000 }
      ]
    }
  }
  return mocks[action] || { message: 'AI功能开发中' }
}
