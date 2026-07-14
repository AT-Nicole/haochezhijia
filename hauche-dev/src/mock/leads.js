/**
 * 豪车之家 - 线索 Mock 数据
 */

export const mockLeads = [
  // === 新线索 ===
  { _id: 'l001', customerName: '张先生', phone: '138****1234', vehicle: '保时捷 911 GT3 RS', vehicleId: 'v007', dealerId: 'd001', dealerName: '深圳超跑名车汇', source: 'AI推荐', status: 'new', priority: 'high', budget: '300万内', notes: '对GT3 RS非常感兴趣，已到店看车一次', followUpHistory: [{ date: '2026-07-10', type: '到店', content: '客户到店体验，试驾GT3 RS，表示满意', nextAction: '3天内电话跟进' }], nextFollowUpDate: '2026-07-13', createdBy: 'AI', createdAt: '2026-07-10' },
  { _id: 'l002', customerName: '刘女士', phone: '139****5678', vehicle: '兰博基尼 Huracán EVO', vehicleId: 'v002', dealerId: 'd002', dealerName: '广州鼎豪车行', source: '转介绍', status: 'new', priority: 'medium', budget: '350万内', notes: '张总推荐，对Huracán感兴趣', followUpHistory: [], nextFollowUpDate: '2026-07-14', createdBy: 'l001', referrer: '张总', createdAt: '2026-07-12' },
  { _id: 'l003', customerName: '王总', phone: '136****9012', vehicle: '迈巴赫 S680', vehicleId: 'v005', dealerId: 'd002', dealerName: '广州鼎豪车行', source: '小程序', status: 'new', priority: 'high', budget: '280万以内', notes: '企业用车需求，需开发票', followUpHistory: [{ date: '2026-07-11', type: '在线咨询', content: '通过AI客服咨询迈巴赫S680配置和交付周期' }], nextFollowUpDate: '2026-07-14', createdBy: 'system', createdAt: '2026-07-11' },
  // === 跟进中 ===
  { _id: 'l004', customerName: '赵先生', phone: '135****3456', vehicle: '法拉利 SF90 Stradale', vehicleId: 'v001', dealerId: 'd001', dealerName: '深圳超跑名车汇', source: '车展', status: 'following', priority: 'high', budget: '500万以内', notes: '已试驾两次，对混动系统满意', followUpHistory: [{ date: '2026-06-20', type: '到店', content: '首次到店看车' }, { date: '2026-07-01', type: '电话', content: '电话沟通选配方案，客户倾向红色+碳纤维套件' }, { date: '2026-07-08', type: '到店', content: '第二次试驾，确认选配方案' }], nextFollowUpDate: '2026-07-15', aiSuggestion: '客户决策接近成熟，建议提供金融方案促进成交', createdBy: 'manual', createdAt: '2026-06-20' },
  { _id: 'l005', customerName: '孙总', phone: '133****7890', vehicle: '路虎揽胜 创世加长版', vehicleId: 'v011', dealerId: 'd003', dealerName: '深圳尊享豪车中心', source: 'AI推荐', status: 'following', priority: 'medium', budget: '240万', notes: '对比奔驰GLS和路虎揽胜', followUpHistory: [{ date: '2026-07-05', type: '在线咨询', content: 'AI推荐路虎揽胜，客户同时在看奔驰GLS' }], nextFollowUpDate: '2026-07-14', aiSuggestion: '建议安排两款车对比试驾，突出路虎的四轮转向和后排座椅优势', createdBy: 'AI', createdAt: '2026-07-05' },
  // === 谈判中 ===
  { _id: 'l006', customerName: '周先生', phone: '132****2345', vehicle: '宾利 飞驰', vehicleId: 'v006', dealerId: 'd004', dealerName: '珠海海湾名车', source: '老客户介绍', status: 'negotiation', priority: 'high', budget: '290万内', notes: '价格谈判中，客户期望优惠30万', followUpHistory: [{ date: '2026-06-15', type: '到店', content: '首次看车，对双色内饰满意' }, { date: '2026-06-28', type: '电话', content: '报价268万，客户还价238万' }, { date: '2026-07-05', type: '面谈', content: '协商至258万，客户考虑中' }], nextFollowUpDate: '2026-07-14', aiSuggestion: '价格差距缩小中，建议提供保养套餐促进成交', createdBy: 'manual', createdAt: '2026-06-15' },
  // === 已成交 ===
  { _id: 'l007', customerName: '吴总', phone: '131****6789', vehicle: '保时捷 Cayenne Turbo GT', vehicleId: 'v008', dealerId: 'd002', dealerName: '广州鼎豪车行', source: '转介绍', status: 'won', priority: 'low', budget: '250万', notes: '成交价248万', followUpHistory: [{ date: '2026-06-10', type: '到店', content: '老客户带新客户到店' }, { date: '2026-06-18', type: '面谈', content: '确定购买，签署意向书' }, { date: '2026-06-25', type: '签约', content: '合同签订，全款支付' }, { date: '2026-07-01', type: '交付', content: '车辆交付完成，客户非常满意' }], nextFollowUpDate: null, orderId: 'o001', createdBy: 'l007_ref', createdAt: '2026-06-10', closedAt: '2026-07-01' },
  { _id: 'l008', customerName: '黄先生', phone: '130****0123', vehicle: '迈凯伦 720S Spider', vehicleId: 'v003', dealerId: 'd001', dealerName: '深圳超跑名车汇', source: 'AI推荐', status: 'won', priority: 'low', budget: '400万', notes: '成交价385万，AI全流程跟进', followUpHistory: [{ date: '2026-06-05', type: 'AI匹配', content: 'AI根据客户画像推荐720S Spider' }, { date: '2026-06-12', type: '到店', content: '试驾，确认购买意向' }, { date: '2026-06-20', type: '签约', content: '合同签订' }, { date: '2026-06-28', type: '交付', content: '交付完成' }], nextFollowUpDate: null, orderId: 'o002', createdBy: 'AI', createdAt: '2026-06-05', closedAt: '2026-06-28' },
  // === 已流失 ===
  { _id: 'l009', customerName: '林先生', phone: '188****4567', vehicle: '劳斯莱斯 幻影', vehicleId: 'v004', dealerId: 'd003', dealerName: '深圳尊享豪车中心', source: '车展', status: 'lost', priority: 'low', budget: '1300万', notes: '预算不足，转购古思特', followUpHistory: [{ date: '2026-05-20', type: '到店', content: '客户对幻影感兴趣但超预算' }], nextFollowUpDate: null, createdBy: 'manual', createdAt: '2026-05-20', closedAt: '2026-06-01', lostReason: '预算不足，转购其他品牌' },
]

// 线索统计（漏斗）
export const leadFunnelStats = {
  total: 9,
  byStatus: { new: 3, following: 2, negotiation: 1, won: 2, lost: 1 },
  conversionRate: '22.2%',
  avgFollowUpDays: 5,
  thisMonthNew: 6,
  aiGenerated: 4,
  referralGenerated: 2
}

// 跟进状态映射
export const leadStatusMap = {
  new: { label: '新线索', color: '#4C98B9', bg: 'rgba(76,152,185,0.06)' },
  contacted: { label: '已联系', color: '#4C98B9', bg: 'rgba(76,152,185,0.06)' },
  following: { label: '跟进中', color: '#E8A838', bg: 'rgba(232,168,56,0.06)' },
  negotiation: { label: '谈判中', color: '#DA291C', bg: 'rgba(218,41,28,0.06)' },
  won: { label: '已成交', color: '#03904A', bg: 'rgba(3,144,74,0.06)' },
  lost: { label: '已流失', color: '#8F8F8F', bg: 'rgba(143,143,143,0.06)' }
}
