/**
 * 豪车之家 - 用户 Mock 数据
 */

// VIP会员数据
export const mockVIPMembers = [
  { _id: 'u001', nickname: '张总', avatar: '', phone: '138****1234', role: 'vip', tier: '黑金卡', points: 28600, joinDate: '2025-03-15', expiry: '2027-03-15', butlerId: 'butler001', butlerName: '陈管家', totalSpent: 1280000, recentService: '迈巴赫S680年检代办', lastActive: '2026-07-14' },
  { _id: 'u002', nickname: '李董', avatar: '', phone: '139****5678', role: 'vip', tier: '白金卡', points: 15600, joinDate: '2025-06-20', expiry: '2027-06-20', butlerId: 'butler002', butlerName: '王管家', totalSpent: 680000, recentService: '机场贵宾接送', lastActive: '2026-07-13' },
  { _id: 'u003', nickname: '王先生', avatar: '', phone: '136****9012', role: 'vip', tier: '金卡', points: 8900, joinDate: '2025-09-01', expiry: '2027-09-01', butlerId: 'butler003', butlerName: '赵管家', totalSpent: 350000, recentService: '高尔夫联谊赛报名', lastActive: '2026-07-12' },
  { _id: 'u004', nickname: '陈女士', avatar: '', phone: '135****3456', role: 'vip', tier: '黑金卡', points: 22000, joinDate: '2025-02-10', expiry: '2027-02-10', butlerId: 'butler001', butlerName: '陈管家', totalSpent: 980000, recentService: '米其林餐厅预订', lastActive: '2026-07-14' },
  { _id: 'u005', nickname: '刘总', avatar: '', phone: '133****7890', role: 'vip', tier: '白金卡', points: 12000, joinDate: '2025-08-15', expiry: '2027-08-15', butlerId: 'butler002', butlerName: '王管家', totalSpent: 520000, recentService: '保险理赔协助', lastActive: '2026-07-10' },
]

// 经销商数据
export const mockDealers = [
  { _id: 'd001', name: '深圳超跑名车汇', logo: '', address: '深圳市南山区深圳湾壹号T7栋1层', phone: '0755-8888-1001', owner: '周总', status: 'active', joinDate: '2025-01-15', vehiclesCount: 8, monthlyDeal: 12, monthlyRevenue: 2860000, rating: 4.9, description: '深圳顶级超跑经销，专注法拉利/兰博基尼/迈凯伦', specialBrands: ['法拉利', '兰博基尼', '迈凯伦', '阿斯顿马丁', '玛莎拉蒂'] },
  { _id: 'd002', name: '广州鼎豪车行', logo: '', address: '广州市天河区珠江新城华夏路38号', phone: '020-6666-2002', owner: '梁总', status: 'active', joinDate: '2025-03-01', vehiclesCount: 6, monthlyDeal: 8, monthlyRevenue: 1680000, rating: 4.8, description: '广州综合豪车展厅，品牌齐全价格透明', specialBrands: ['保时捷', '奔驰', '兰博基尼', '迈凯伦'] },
  { _id: 'd003', name: '深圳尊享豪车中心', logo: '', address: '深圳市福田区卓越中心1号', phone: '0755-8888-3003', owner: '林总', status: 'active', joinDate: '2025-02-20', vehiclesCount: 5, monthlyDeal: 6, monthlyRevenue: 3200000, rating: 4.9, description: '深圳高端豪华车中心，专注劳斯莱斯/宾利/迈巴赫', specialBrands: ['劳斯莱斯', '宾利', '迈巴赫', '路虎', '布加迪'] },
  { _id: 'd004', name: '珠海海湾名车', logo: '', address: '珠海市香洲区吉大九洲大道1008号', phone: '0756-3333-4004', owner: '何总', status: 'active', joinDate: '2025-04-10', vehiclesCount: 3, monthlyDeal: 4, monthlyRevenue: 860000, rating: 4.7, description: '珠海滨海豪车展厅，旅游+购车体验', specialBrands: ['保时捷', '宾利', '法拉利', '奥迪'] },
  { _id: 'd005', name: '佛山臻豪车行', logo: '', address: '佛山市禅城区魁奇二路佛山世纪车城', phone: '0757-8222-5005', owner: '陈总', status: 'active', joinDate: '2025-05-01', vehiclesCount: 2, monthlyDeal: 3, monthlyRevenue: 520000, rating: 4.6, description: '佛山豪车新锐经销商，服务湾区高端客户', specialBrands: ['保时捷', '宾利', '宝马'] },
  { _id: 'd006', name: '东莞恒通车行', logo: '', address: '东莞市南城区鸿福路108号', phone: '0769-2222-6006', owner: '张总', status: 'active', joinDate: '2025-06-15', vehiclesCount: 2, monthlyDeal: 2, monthlyRevenue: 380000, rating: 4.5, description: '东莞综合豪车展厅，性价比之选', specialBrands: ['保时捷', '奔驰'] },
]

// 管家数据
export const mockButlers = [
  { _id: 'butler001', name: '陈志明', phone: '186****1001', avatar: '', rating: 4.9, totalService: 356, years: 6, specialties: ['年检代办', '保险理赔', '维修保养'], assignedMembers: 15, todaySchedule: ['09:00 张总 迈巴赫年检', '14:00 陈女士 机场接机', '16:30 李董 车辆保养跟进'] },
  { _id: 'butler002', name: '王浩然', phone: '186****2002', avatar: '', rating: 4.8, totalService: 289, years: 4, specialties: ['机场接送', '酒店预订', '球会预约'], assignedMembers: 12, todaySchedule: ['08:00 刘总 机场贵宾接送', '11:00 新会员接待', '15:00 游艇租赁安排'] },
  { _id: 'butler003', name: '赵雅琪', phone: '186****3003', avatar: '', rating: 4.9, totalService: 245, years: 5, specialties: ['生活服务', '医疗通道', '税务筹划'], assignedMembers: 10, todaySchedule: ['10:00 王先生 高尔夫球会预约', '13:00 医疗绿色通道预约', '16:00 月度服务报告'] },
]

// 创作者数据
export const mockCreators = [
  { _id: 'c001', nickname: '超跑阿杰', avatar: '', followers: 128000, posts: 86, monthlyIncome: 28600, specialty: '超跑评测', latestPost: '2026款法拉利SF90深度试驾', latestPostViews: 45000, latestPostLikes: 2800 },
  { _id: 'c002', nickname: '豪车毒老王', avatar: '', followers: 86000, posts: 42, monthlyIncome: 15600, specialty: '行业分析', latestPost: '大湾区豪车市场6月报告', latestPostViews: 32000, latestPostLikes: 1800 },
]

// 普通买家
export const mockBuyers = [
  { _id: 'b001', nickname: '豪哥', avatar: '', phone: '137****4567', role: 'buyer', interests: ['保时捷', '法拉利'], budget: 3000000, viewedVehicles: 12, followDealers: 3, lastActive: '2026-07-14' },
]

// 当前登录用户（演示用）
export const currentUser = {
  _id: 'demo_001',
  openid: 'demo_openid_001',
  nickname: '豪哥',
  avatar: '',
  phone: '137****4567',
  role: 'buyer',
  memberInfo: null
}

// 管理员数据
export const mockAdmin = {
  _id: 'admin001',
  nickname: '管理员',
  role: 'admin',
  permissions: ['user_manage', 'vehicle_audit', 'order_manage', 'finance_view', 'content_audit', 'system_config']
}
