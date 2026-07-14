/**
 * 豪车之家 - 佣金 Mock 数据
 */

export const mockCommissions = [
  { _id: 'cm001', orderId: 'o001', orderNo: 'HC20260701001', referrerName: '张总', referrerPhone: '138****1234', customerName: '吴总', vehicle: '保时捷 Cayenne Turbo GT', amount: 2480000, rate: 0.005, commission: 12400, status: 'paid', paidDate: '2026-07-05', createdAt: '2026-07-01' },
  { _id: 'cm002', orderId: 'o002', orderNo: 'HC20260628002', referrerName: 'AI客服', referrerPhone: 'system', customerName: '黄先生', vehicle: '迈凯伦 720S Spider', amount: 3850000, rate: 0.005, commission: 19250, status: 'paid', paidDate: '2026-07-03', createdAt: '2026-06-28' },
  { _id: 'cm003', orderId: 'o003', orderNo: 'HC20260710003', referrerName: '超跑阿杰', referrerPhone: '186****8001', customerName: '赵先生', vehicle: '法拉利 SF90 Stradale', amount: 4980000, rate: 0.005, commission: 24900, status: 'pending', paidDate: null, createdAt: '2026-07-10' },
]

export const commissionStats = {
  totalEarned: 56500,
  thisMonth: 37300,
  pending: 24900,
  totalReferrals: 12,
  conversionRate: '41.7%',
  topReferrers: [
    { name: '张总', referrals: 5, earned: 62000, tier: '黑金卡' },
    { name: '超跑阿杰', referrals: 3, earned: 48500, tier: '创作者' },
    { name: '李董', referrals: 2, earned: 28000, tier: '白金卡' }
  ]
}
