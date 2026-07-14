/**
 * 豪车之家 - 活动 Mock 数据
 */

export const mockEvents = [
  {
    _id: 'e001',
    title: '高尔夫联谊赛',
    type: 'golf',
    description: '大湾区豪车车主高尔夫联谊赛，18洞比杆赛+晚宴交流',
    date: '2026-07-15',
    time: '14:00 - 21:00',
    location: '深圳观澜湖高尔夫球会',
    address: '深圳市龙华区观澜湖大道1号',
    fee: 0,
    feeDisplay: 'VIP免费',
    maxAttendees: 30,
    currentAttendees: 18,
    status: '报名中',
    statusType: 'active',
    host: '豪车之家 x 观澜湖',
    aiGenerated: true,
    imageColor: '#166534',
    tags: ['高尔夫', '社交', 'VIP专属'],
    attendees: ['张总', '李董', '王先生', '陈女士', '刘总'],
    highlights: ['18洞比杆赛', '颁奖晚宴', '品牌交流']
  },
  {
    _id: 'e002',
    title: '超跑品鉴晚宴',
    type: 'supercar_showcase',
    description: '2026款超跑新车品鉴，法拉利SF90 + 迈凯伦Artura现场体验',
    date: '2026-07-20',
    time: '19:00 - 22:00',
    location: '深圳柏悦酒店宴会厅',
    address: '深圳市南山区海德一道88号',
    fee: 2800,
    feeDisplay: '¥2,800/人',
    maxAttendees: 20,
    currentAttendees: 8,
    status: '报名中',
    statusType: 'active',
    host: '豪车之家 x 深圳超跑名车汇',
    aiGenerated: true,
    imageColor: '#7C3AED',
    tags: ['超跑', '品鉴', '晚宴'],
    attendees: ['赵先生', '黄先生'],
    highlights: ['新车品鉴', '试乘试驾', '米其林晚宴']
  },
  {
    _id: 'e003',
    title: '大湾区豪车车主私享会',
    type: 'private_club',
    description: '豪车之家年度VIP车主聚会，行业大咖分享+资源对接',
    date: '2026-07-25',
    time: '18:00 - 22:00',
    location: '广州瑰丽酒店',
    address: '广州市天河区珠江东路6号',
    fee: 0,
    feeDisplay: '黑金卡以上免费',
    maxAttendees: 50,
    currentAttendees: 32,
    status: '报名中',
    statusType: 'active',
    host: '豪车之家',
    aiGenerated: false,
    imageColor: '#004B87',
    tags: ['私享会', '社交', '资源对接'],
    attendees: ['吴总', '张总', '李董', '孙总', '周先生'],
    highlights: ['大咖分享', '资源对接', '年度颁奖']
  },
  {
    _id: 'e004',
    title: '超跑赛道体验日',
    type: 'track_day',
    description: '珠海国际赛车场超跑体验日，专业赛道教练指导',
    date: '2026-08-02',
    time: '09:00 - 17:00',
    location: '珠海国际赛车场',
    address: '珠海市金湾区珠海大道南',
    fee: 5000,
    feeDisplay: '¥5,000/人',
    maxAttendees: 25,
    currentAttendees: 5,
    status: '报名中',
    statusType: 'upcoming',
    host: '豪车之家 x 珠海国际赛车场',
    aiGenerated: true,
    imageColor: '#DA291C',
    tags: ['赛道', '超跑', '体验'],
    attendees: [],
    highlights: ['赛道体验', '专业教练', '影像跟拍']
  },
  {
    _id: 'e005',
    title: '车主自驾游：大理-丽江',
    type: 'road_trip',
    description: '豪车车主大理-丽江精品自驾游，全程五星级酒店',
    date: '2026-08-15',
    time: '全天（5天4晚）',
    location: '大理-丽江',
    address: '云南大理古城出发',
    fee: 28000,
    feeDisplay: '¥28,000/人（含酒店餐饮）',
    maxAttendees: 15,
    currentAttendees: 9,
    status: '报名中',
    statusType: 'upcoming',
    host: '豪车之家',
    aiGenerated: false,
    imageColor: '#166534',
    tags: ['自驾游', '旅行', '社交'],
    attendees: ['吴总', '黄先生', '王总'],
    highlights: ['精品路线', '五星级酒店', '专业摄影']
  },
  {
    _id: 'e006',
    title: '法拉利车主俱乐部聚会',
    type: 'brand_club',
    description: '大湾区法拉利车主月度聚会，咖啡+试驾+交流',
    date: '2026-07-06',
    time: '10:00 - 16:00',
    location: '深圳超跑名车汇展厅',
    address: '深圳市南山区科技园南区',
    fee: 0,
    feeDisplay: '法拉利车主免费',
    maxAttendees: 20,
    currentAttendees: 20,
    status: '已结束',
    statusType: 'ended',
    host: '深圳超跑名车汇',
    aiGenerated: false,
    imageColor: '#DA291C',
    tags: ['法拉利', '俱乐部', '聚会'],
    attendees: ['赵先生', '黄先生', '张总', '李董', '林先生', '陈总'],
    highlights: ['新车品鉴', '技术交流', '下午茶']
  }
]

// 活动统计
export const eventStats = {
  total: 6,
  thisMonth: 3,
  upcoming: 3,
  totalAttendees: 72,
  avgSatisfaction: 4.8,
  aiPlannedEvents: 3,
  revenueFromEvents: 156000
}

// 活动类型映射
export const eventTypeMap = {
  golf: { label: '高尔夫', icon: 'golf', color: '#166534' },
  supercar_showcase: { label: '超跑品鉴', icon: 'car', color: '#7C3AED' },
  private_club: { label: '私享会', icon: 'diamond', color: '#004B87' },
  track_day: { label: '赛道体验', icon: 'flag', color: '#DA291C' },
  road_trip: { label: '自驾游', icon: 'map', color: '#166534' },
  brand_club: { label: '品牌聚会', icon: 'users', color: '#E8A838' }
}

// 活动状态映射
export const eventStatusMap = {
  upcoming: { label: '即将开始', color: '#4C98B9', bg: 'rgba(76,152,185,0.06)' },
  active: { label: '报名中', color: '#03904A', bg: 'rgba(3,144,74,0.06)' },
  full: { label: '已满员', color: '#DA291C', bg: 'rgba(218,41,28,0.06)' },
  ended: { label: '已结束', color: '#8F8F8F', bg: 'rgba(143,143,143,0.06)' },
  cancelled: { label: '已取消', color: '#8F8F8F', bg: 'rgba(143,143,143,0.06)' }
}
