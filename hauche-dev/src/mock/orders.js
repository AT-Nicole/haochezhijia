/**
 * 豪车之家 - 订单 Mock 数据
 */

export const mockOrders = [
  {
    _id: 'o001',
    orderNo: 'HC20260701001',
    customerName: '吴总',
    phone: '131****6789',
    vehicle: { brand: '保时捷', model: 'Cayenne Turbo GT', vehicleId: 'v008' },
    dealerId: 'd002',
    dealerName: '广州鼎豪车行',
    amount: 2480000,
    serviceFee: 24800, // 1%
    commissionRate: 0.005,
    commission: 12400,
    status: 'delivered',
    paymentMethod: '全款',
    paymentStatus: 'paid',
    contractDate: '2026-06-25',
    paymentDate: '2026-06-25',
    deliveryDate: '2026-07-01',
    createdAt: '2026-06-25',
    timeline: [
      { date: '2026-06-25', event: '签订合同', status: 'done' },
      { date: '2026-06-25', event: '收到全款', status: 'done' },
      { date: '2026-06-26', event: '开始过户', status: 'done' },
      { date: '2026-06-28', event: '过户完成', status: 'done' },
      { date: '2026-07-01', event: '车辆交付', status: 'done' }
    ]
  },
  {
    _id: 'o002',
    orderNo: 'HC20260628002',
    customerName: '黄先生',
    phone: '130****0123',
    vehicle: { brand: '迈凯伦', model: '720S Spider', vehicleId: 'v003' },
    dealerId: 'd001',
    dealerName: '深圳超跑名车汇',
    amount: 3850000,
    serviceFee: 38500,
    commissionRate: 0.005,
    commission: 19250,
    status: 'delivered',
    paymentMethod: '全款',
    paymentStatus: 'paid',
    contractDate: '2026-06-20',
    paymentDate: '2026-06-22',
    deliveryDate: '2026-06-28',
    createdAt: '2026-06-20',
    timeline: [
      { date: '2026-06-20', event: '签订合同', status: 'done' },
      { date: '2026-06-22', event: '收到全款', status: 'done' },
      { date: '2026-06-24', event: '开始过户', status: 'done' },
      { date: '2026-06-27', event: '过户完成', status: 'done' },
      { date: '2026-06-28', event: '车辆交付', status: 'done' }
    ]
  },
  {
    _id: 'o003',
    orderNo: 'HC20260710003',
    customerName: '赵先生',
    phone: '135****3456',
    vehicle: { brand: '法拉利', model: 'SF90 Stradale', vehicleId: 'v001' },
    dealerId: 'd001',
    dealerName: '深圳超跑名车汇',
    amount: 4980000,
    serviceFee: 49800,
    commissionRate: 0.005,
    commission: 24900,
    status: 'contract_signed',
    paymentMethod: '定金+尾款',
    paymentStatus: 'deposit_paid',
    depositAmount: 500000,
    remainingAmount: 4480000,
    contractDate: '2026-07-10',
    paymentDate: null,
    deliveryDate: null,
    createdAt: '2026-07-10',
    timeline: [
      { date: '2026-07-10', event: '签订合同', status: 'done' },
      { date: '2026-07-10', event: '收到定金50万', status: 'done' },
      { date: '2026-07-15', event: '预计支付尾款', status: 'pending' },
      { date: '2026-07-18', event: '预计过户', status: 'pending' },
      { date: '2026-07-22', event: '预计交付', status: 'pending' }
    ]
  }
]

// 订单统计
export const orderStats = {
  total: 3,
  thisMonth: { count: 2, amount: 6330000 },
  thisYear: { count: 28, amount: 85600000 },
  avgDealSize: 3770000,
  avgDealDays: 8,
  byStatus: { pending_contract: 0, contract_signed: 1, payment_received: 0, preparing: 0, delivered: 2, completed: 0 },
  topBrands: [
    { brand: '保时捷', count: 10, amount: 25600000 },
    { brand: '法拉利', count: 5, amount: 24500000 },
    { brand: '兰博基尼', count: 4, amount: 13200000 },
    { brand: '迈巴赫', count: 5, amount: 13400000 },
    { brand: '劳斯莱斯', count: 3, amount: 38400000 }
  ]
}

// 订单状态映射
export const orderStatusMap = {
  pending_contract: { label: '待签约', color: '#4C98B9' },
  contract_signed: { label: '已签约', color: '#E8A838' },
  payment_received: { label: '已付款', color: '#E8B800' },
  preparing: { label: '准备交付', color: '#DA291C' },
  delivered: { label: '已交付', color: '#03904A' },
  completed: { label: '已完成', color: '#03904A' },
  cancelled: { label: '已取消', color: '#8F8F8F' }
}
