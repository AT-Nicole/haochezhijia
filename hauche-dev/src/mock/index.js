/**
 * 豪车之家 - Mock 数据统一导出
 * 
 * 演示模式使用，生产环境走云函数
 */

export { mockVehicles, vehiclesByCity, brands, priceRanges, conditions } from './vehicles'
export { mockVIPMembers, mockDealers, mockButlers, mockCreators, mockBuyers, currentUser, mockAdmin } from './users'
export { mockLeads, leadFunnelStats, leadStatusMap } from './leads'
export { mockOrders, orderStats, orderStatusMap } from './orders'
export { mockCommissions, commissionStats } from './commissions'
export { mockContents, todayAISuggestions, marketingTemplates } from './contents'
export { mockEvents, eventTypes } from './events'
export { butlerServiceCategories, mockServiceOrders, serviceStats } from './services'
export { mockChatHistory, quickReplies, mockKeywordResponses, chatScenarios } from './chat'
export { mockMonthlyFinance, nationalPricing, inventoryAlerts } from './finances'

// 是否使用Mock数据
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development'
