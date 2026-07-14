/**
 * 豪车之家 - 财务 Mock 数据
 */

// 月度财务报表
export const mockMonthlyFinance = {
  year: 2026,
  month: 7,
  summary: {
    totalRevenue: 8560000,       // 本月总收入
    serviceFeeIncome: 113100,    // 服务费收入
    commissionExpense: 56500,    // 佣金支出
    operatingCost: 320000,       // 运营成本
    netProfit: 7978600,         // 净利润
    profitRate: '93.2%',
    monthOverMonth: '+12.5%'    // 环比增长
  },
  revenueBreakdown: [
    { category: '车辆交易服务费', amount: 7460000, ratio: '87.1%', color: '#03904A' },
    { category: '管家服务收入', amount: 23300, ratio: '0.3%', color: '#4C98B9' },
    { category: '佣金返佣收入', amount: 56500, ratio: '0.7%', color: '#E8A838' },
    { category: '广告与合作收入', amount: 156000, ratio: '1.8%', color: '#DA291C' },
    { category: 'VIP会员费', amount: 864200, ratio: '10.1%', color: '#004B87' }
  ],
  expenseBreakdown: [
    { category: '佣金支出', amount: 56500, ratio: '14.2%', color: '#E8A838' },
    { category: 'AI服务费用', amount: 45000, ratio: '11.3%', color: '#4C98B9' },
    { category: '服务器与云服务', amount: 28000, ratio: '7.0%', color: '#004B87' },
    { category: '营销推广', amount: 120000, ratio: '30.1%', color: '#DA291C' },
    { category: '人员成本', amount: 92000, ratio: '23.0%', color: '#166534' },
    { category: '其他', amount: 55500, ratio: '14.4%', color: '#8F8F8F' }
  ],
  monthlyTrend: [
    { month: '1月', revenue: 4200000, profit: 3800000 },
    { month: '2月', revenue: 3100000, profit: 2750000 },
    { month: '3月', revenue: 5800000, profit: 5200000 },
    { month: '4月', revenue: 6500000, profit: 5900000 },
    { month: '5月', revenue: 7200000, profit: 6500000 },
    { month: '6月', revenue: 7600000, profit: 7100000 },
    { month: '7月', revenue: 8560000, profit: 7978600 }
  ]
}

// 全国行情数据（AI采集）
export const nationalPricing = {
  lastUpdated: '2026-07-14 08:00',
  hotModels: [
    {
      brand: '保时捷',
      model: '911 GT3 RS',
      nationalAvg: 2980000,
      lowPrice: 2650000,
      highPrice: 3280000,
      trend: 'up',
      trendValue: '+2.3%',
      shenzhenPrice: 2880000,
      deltaVsNational: '-3.4%',
      source: '全国300+经销商数据'
    },
    {
      brand: '法拉利',
      model: 'SF90 Stradale',
      nationalAvg: 4950000,
      lowPrice: 4600000,
      highPrice: 5300000,
      trend: 'stable',
      trendValue: '+0.1%',
      shenzhenPrice: 4980000,
      deltaVsNational: '+0.6%',
      source: '全国180+经销商数据'
    },
    {
      brand: '迈巴赫',
      model: 'S680',
      nationalAvg: 2750000,
      lowPrice: 2500000,
      highPrice: 2980000,
      trend: 'down',
      trendValue: '-1.8%',
      shenzhenPrice: 2680000,
      deltaVsNational: '-2.5%',
      source: '全国200+经销商数据'
    },
    {
      brand: '兰博基尼',
      model: 'Huracán EVO',
      nationalAvg: 3200000,
      lowPrice: 2900000,
      highPrice: 3550000,
      trend: 'up',
      trendValue: '+3.1%',
      shenzhenPrice: 3280000,
      deltaVsNational: '+2.5%',
      source: '全国150+经销商数据'
    },
    {
      brand: '劳斯莱斯',
      model: '古思特',
      nationalAvg: 4800000,
      lowPrice: 4500000,
      highPrice: 5200000,
      trend: 'stable',
      trendValue: '+0.5%',
      shenzhenPrice: 4750000,
      deltaVsNational: '-1.0%',
      source: '全国120+经销商数据'
    },
    {
      brand: '宾利',
      model: '飞驰',
      nationalAvg: 2600000,
      lowPrice: 2350000,
      highPrice: 2850000,
      trend: 'down',
      trendValue: '-0.8%',
      shenzhenPrice: 2580000,
      deltaVsNational: '-0.8%',
      source: '全国130+经销商数据'
    }
  ],
  marketInsights: [
    { type: 'alert', text: '保时捷911 GT3 RS 全国库存降至历史低位，预计价格持续上涨' },
    { type: 'info', text: '迈巴赫S680 新一批到港车辆即将释放，7月下旬价格或有回落' },
    { type: 'opportunity', text: '兰博基尼Huracán EVO 大湾区需求旺盛，深圳价格低于全国均价，存在套利空间' }
  ]
}

// 库存预警
export const inventoryAlerts = [
  { _id: 'ia001', dealerId: 'd001', dealerName: '深圳超跑名车汇', vehicleId: 'v001', vehicle: '法拉利 SF90 Stradale', daysInStock: 62, alertType: 'long_inventory', message: '在库62天，超过行业平均45天，建议调整定价', suggestion: 'AI建议降价3-5%加速去化，或增加曝光推广', aiScore: 78 },
  { _id: 'ia002', dealerId: 'd002', dealerName: '广州鼎豪车行', vehicleId: 'v005', vehicle: '迈巴赫 S680', daysInStock: 38, alertType: 'price_change', message: '周边同款车型降价5万，建议关注定价竞争力', suggestion: '可维持当前定价但增加附加价值（保养套餐等）', aiScore: 65 },
  { _id: 'ia003', dealerId: 'd003', dealerName: '深圳尊享豪车中心', vehicleId: 'v011', vehicle: '路虎揽胜 创世加长版', daysInStock: 15, alertType: 'hot_model', message: '近7天咨询量上升40%，建议加快成交跟进', suggestion: 'AI识别到3个高意向线索，建议48小时内跟进', aiScore: 92 },
  { _id: 'ia004', dealerId: 'd001', dealerName: '深圳超跑名车汇', vehicleId: 'v007', vehicle: '保时捷 911 GT3 RS', daysInStock: 8, alertType: 'short_supply', message: '全国库存稀缺，当前定价低于市场均价3.4%', suggestion: '可适当上调价格2-3%，或维持定价锁定成交', aiScore: 88 }
]

// 财务指标映射
export const financeMetrics = {
  revenue: { label: '总收入', color: '#03904A', unit: '万元' },
  profit: { label: '净利润', color: '#004B87', unit: '万元' },
  serviceFee: { label: '服务费', color: '#4C98B9', unit: '万元' },
  commission: { label: '佣金', color: '#E8A838', unit: '万元' },
  cost: { label: '运营成本', color: '#DA291C', unit: '万元' }
}
