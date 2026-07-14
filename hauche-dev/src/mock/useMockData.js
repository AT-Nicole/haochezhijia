/**
 * 豪车之家 - Mock 数据 Hook
 *
 * 开发/H5演示模式下使用 mock 数据
 * 生产模式走真实云函数
 *
 * 用法：
 *   import { useMockData } from '@/mock/useMockData'
 *   const { getVehicles, getLeads, getOrders } = useMockData()
 *   const vehicles = await getVehicles({ brand: '保时捷' })
 */

import { mockVehicles } from './vehicles'
import { mockDealers, mockVIPMembers, mockButlers } from './users'
import { mockLeads } from './leads'
import { mockOrders } from './orders'
import { mockCommissions } from './commissions'
import { mockContents } from './contents'
import { mockEvents } from './events'
import { mockServiceOrders, butlerServiceCategories } from './services'
import { mockMonthlyFinance, nationalPricing, inventoryAlerts } from './finances'
import { mockChatHistory, mockKeywordResponses, quickReplies } from './chat'

const IS_MOCK = process.env.NODE_ENV === 'development' || typeof Taro === 'undefined'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function filterByFields(data, filters) {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === '全部') return true
      if (typeof value === 'string') return String(item[key]).toLowerCase().includes(value.toLowerCase())
      if (typeof value === 'number') return item[key] === value
      return true
    })
  })
}

function paginate(data, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    list: data.slice(start, start + pageSize),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize)
  }
}

function sortByField(data, field, order = 'desc') {
  return [...data].sort((a, b) => {
    if (order === 'desc') return (b[field] || 0) - (a[field] || 0)
    return (a[field] || 0) - (b[field] || 0)
  })
}

export function useMockData() {

  // 获取车辆列表
  async function getVehicles(options = {}) {
    await sleep(300)
    let result = [...mockVehicles]

    if (options.brand) result = result.filter(v => v.brand === options.brand)
    if (options.city) result = result.filter(v => v.city === options.city)
    if (options.condition) result = result.filter(v => v.conditionType === options.condition)
    if (options.minPrice) result = result.filter(v => v.price >= options.minPrice)
    if (options.maxPrice) result = result.filter(v => v.price <= options.maxPrice)
    if (options.dealerId) result = result.filter(v => v.dealerId === options.dealerId)
    if (options.keyword) {
      const kw = options.keyword.toLowerCase()
      result = result.filter(v => v.brand.toLowerCase().includes(kw) || v.model.toLowerCase().includes(kw))
    }

    if (options.sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (options.sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (options.sort === 'newest') result.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate))
    if (options.sort === 'ai_score') result.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))

    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取车辆详情
  async function getVehicleDetail(vehicleId) {
    await sleep(200)
    const vehicle = mockVehicles.find(v => v._id === vehicleId)
    return vehicle
      ? { code: 0, data: vehicle }
      : { code: -1, message: '车辆不存在', data: null }
  }

  // 获取经销商列表
  async function getDealers(options = {}) {
    await sleep(200)
    return { code: 0, data: paginate(filterByFields(mockDealers, options), options.page, options.pageSize) }
  }

  // 获取线索列表
  async function getLeads(options = {}) {
    await sleep(200)
    let result = [...mockLeads]
    if (options.status) result = result.filter(l => l.status === options.status)
    if (options.dealerId) result = result.filter(l => l.dealerId === options.dealerId)
    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取订单列表
  async function getOrders(options = {}) {
    await sleep(200)
    let result = [...mockOrders]
    if (options.status) result = result.filter(o => o.status === options.status)
    if (options.dealerId) result = result.filter(o => o.dealerId === options.dealerId)
    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取佣金列表
  async function getCommissions(options = {}) {
    await sleep(200)
    return { code: 0, data: paginate(mockCommissions, options.page, options.pageSize) }
  }

  // 获取VIP会员列表
  async function getMembers(options = {}) {
    await sleep(200)
    return { code: 0, data: paginate(mockVIPMembers, options.page, options.pageSize) }
  }

  // 获取内容列表
  async function getContents(options = {}) {
    await sleep(200)
    let result = [...mockContents]
    if (options.status) result = result.filter(c => c.status === options.status)
    if (options.type) result = result.filter(c => c.type === options.type)
    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取活动列表
  async function getEvents(options = {}) {
    await sleep(200)
    let result = [...mockEvents]
    if (options.type) result = result.filter(e => e.type === options.type)
    if (options.status) result = result.filter(e => e.status === options.status)
    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取管家服务订单
  async function getServiceOrders(options = {}) {
    await sleep(200)
    let result = [...mockServiceOrders]
    if (options.status) result = result.filter(s => s.status === options.status)
    return { code: 0, data: paginate(result, options.page, options.pageSize) }
  }

  // 获取月度财务数据
  async function getMonthlyFinance() {
    await sleep(200)
    return { code: 0, data: mockMonthlyFinance }
  }

  // 获取全国比价数据
  async function getNationalPricing(vehicleId) {
    await sleep(200)
    return { code: 0, data: nationalPricing }
  }

  // 获取管家服务分类
  async function getButlerServiceCategories() {
    return { code: 0, data: butlerServiceCategories }
  }

  // AI对话
  async function chatWithAI(message) {
    await sleep(800)
    // 关键词匹配
    for (const [keyword, response] of Object.entries(mockKeywordResponses)) {
      if (message.includes(keyword)) {
        return { code: 0, data: { content: response, timestamp: new Date().toISOString().slice(0, 16) } }
      }
    }
    // 默认回复
    return { code: 0, data: { content: '感谢您的咨询！我正在为您查询相关信息，请稍候...\n\n如需紧急服务，请拨打24小时管家热线：400-888-0001', timestamp: new Date().toISOString().slice(0, 16) } }
  }

  // 获取聊天历史和快捷回复
  function getChatData() {
    return { history: mockChatHistory, quickReplies }
  }

  return {
    getVehicles, getVehicleDetail, getDealers,
    getLeads, getOrders, getCommissions,
    getMembers, getContents, getEvents,
    getServiceOrders, getMonthlyFinance, getNationalPricing,
    getButlerServiceCategories,
    chatWithAI, getChatData,
    isMock: IS_MOCK
  }
}