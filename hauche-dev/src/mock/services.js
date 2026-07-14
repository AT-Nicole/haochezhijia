/**
 * 豪车之家 - 管家服务 Mock 数据
 */

// 管家服务分类
export const butlerServiceCategories = [
  {
    id: 'cat001',
    name: '车辆服务',
    icon: 'car',
    services: [
      { id: 's001', name: '年检代办', price: 2000, priceDisplay: '¥2,000/次', description: '全程代办车辆年检，上门取送车' },
      { id: 's002', name: '保险续保', price: 0, priceDisplay: '免费咨询', description: '多家保险公司比价，最优方案推荐' },
      { id: 's003', name: '违章处理', price: 500, priceDisplay: '¥500/次', description: '代办违章查询与处理' },
      { id: 's004', name: '加油优惠', price: 0, priceDisplay: 'VIP专属折扣', description: '大湾区核心加油站9折优惠' },
      { id: 's005', name: '充电桩安装', price: 8000, priceDisplay: '¥8,000起', description: '私人充电桩上门安装，含线路改造' },
      { id: 's006', name: '代驾服务', price: 300, priceDisplay: '¥300/次起', description: '专业豪车代驾，严格培训认证' }
    ]
  },
  {
    id: 'cat002',
    name: '维保服务',
    icon: 'tools',
    services: [
      { id: 's007', name: '保养提醒', price: 0, priceDisplay: '免费', description: 'AI智能保养提醒，基于行驶里程和车况' },
      { id: 's008', name: '原厂保养', price: 0, priceDisplay: '按车型报价', description: '预约原厂4S店保养，VIP通道免排队' },
      { id: 's009', name: '美容养护', price: 3000, priceDisplay: '¥3,000起', description: '漆面保护膜+内饰精洗+发动机舱养护' },
      { id: 's010', name: '轮胎服务', price: 1500, priceDisplay: '¥1,500/条起', description: '米其林/马牌/倍耐力正品轮胎供应安装' },
      { id: 's011', name: '事故维修', price: 0, priceDisplay: '按实际情况报价', description: '合作维修厂，保险公司直赔' },
      { id: 's012', name: '救援服务', price: 0, priceDisplay: 'VIP免费', description: '24小时道路救援，大湾区2小时内到达' }
    ]
  },
  {
    id: 'cat003',
    name: '生活服务',
    icon: 'diamond',
    services: [
      { id: 's013', name: '高尔夫预订', price: 0, priceDisplay: 'VIP优惠价', description: '大湾区顶级球场优先预订' },
      { id: 's014', name: '高端餐饮预订', price: 0, priceDisplay: 'VIP通道', description: '米其林餐厅、私人会所优先预订' },
      { id: 's015', name: '机场接送', price: 800, priceDisplay: '¥800/次起', description: '豪华商务车机场接送机服务' },
      { id: 's016', name: '旅行定制', price: 5000, priceDisplay: '¥5,000/次起', description: '私人定制旅行方案，含酒店与行程规划' },
      { id: 's017', name: '商务用车', price: 1500, priceDisplay: '¥1,500/天起', description: '奔驰S级/埃尔法商务用车' },
      { id: 's018', name: '秘书服务', price: 0, priceDisplay: '会员专享', description: '专属管家秘书，日程管理与提醒' }
    ]
  },
  {
    id: 'cat004',
    name: '金融法务',
    icon: 'bank',
    services: [
      { id: 's019', name: '贷款咨询', price: 0, priceDisplay: '免费', description: '豪车专属低息贷款方案，多家银行比价' },
      { id: 's020', name: '融资租赁', price: 0, priceDisplay: '按方案报价', description: '灵活融资方案，月供低至车价0.5%' },
      { id: 's021', name: '车辆抵押', price: 0, priceDisplay: '按评估价', description: '豪车抵押贷款，最快当天放款' },
      { id: 's022', name: '合同审查', price: 2000, priceDisplay: '¥2,000/份', description: '购车合同法律审查，规避交易风险' },
      { id: 's023', name: '资产评估', price: 3000, priceDisplay: '¥3,000/次', description: '专业车辆资产评估报告' },
      { id: 's024', name: '税务筹划', price: 5000, priceDisplay: '¥5,000/次起', description: '企业购车税务筹划，合法节税' }
    ]
  }
]

// 服务订单
export const mockServiceOrders = [
  {
    _id: 'so001',
    orderId: 'SV20260710001',
    memberId: 'm001',
    memberName: '吴总',
    serviceId: 's001',
    serviceName: '年检代办',
    category: '车辆服务',
    vehicleId: 'v008',
    vehicle: '保时捷 Cayenne Turbo GT',
    plateNumber: '粤B·8A888',
    status: 'completed',
    fee: 2000,
    assignedButler: '管家小陈',
    butlerPhone: '177****9001',
    createdAt: '2026-07-10',
    scheduledDate: '2026-07-12',
    completedDate: '2026-07-12',
    rating: 5,
    review: '非常专业，全程不用操心，下次还找小陈！'
  },
  {
    _id: 'so002',
    orderId: 'SV20260708002',
    memberId: 'm002',
    memberName: '黄先生',
    serviceId: 's009',
    serviceName: '美容养护',
    category: '维保服务',
    vehicleId: 'v003',
    vehicle: '迈凯伦 720S Spider',
    plateNumber: '粤B·6K666',
    status: 'in_progress',
    fee: 8500,
    assignedButler: '管家小李',
    butlerPhone: '177****9002',
    createdAt: '2026-07-08',
    scheduledDate: '2026-07-14',
    completedDate: null,
    timeline: [
      { date: '2026-07-08', event: '提交申请', status: 'done' },
      { date: '2026-07-09', event: '管家确认', status: 'done' },
      { date: '2026-07-10', event: '车辆入库', status: 'done' },
      { date: '2026-07-14', event: '预计完成', status: 'pending' }
    ]
  },
  {
    _id: 'so003',
    orderId: 'SV20260705003',
    memberId: 'm001',
    memberName: '吴总',
    serviceId: 's013',
    serviceName: '高尔夫预订',
    category: '生活服务',
    vehicleId: null,
    vehicle: null,
    plateNumber: null,
    status: 'completed',
    fee: 0,
    assignedButler: '管家小陈',
    butlerPhone: '177****9001',
    createdAt: '2026-07-05',
    scheduledDate: '2026-07-15',
    completedDate: '2026-07-05',
    rating: 4,
    review: '预订很顺利，球场不错'
  },
  {
    _id: 'so004',
    orderId: 'SV20260712004',
    memberId: 'm003',
    memberName: '赵先生',
    serviceId: 's019',
    serviceName: '贷款咨询',
    category: '金融法务',
    vehicleId: 'v001',
    vehicle: '法拉利 SF90 Stradale',
    plateNumber: null,
    status: 'pending',
    fee: 0,
    assignedButler: null,
    butlerPhone: null,
    createdAt: '2026-07-12',
    scheduledDate: '2026-07-14',
    completedDate: null,
    notes: '客户购车需贷款方案，预计贷款金额300万'
  },
  {
    _id: 'so005',
    orderId: 'SV20260625005',
    memberId: 'm004',
    memberName: '张总',
    serviceId: 's008',
    serviceName: '原厂保养',
    category: '维保服务',
    vehicleId: 'v007',
    vehicle: '保时捷 911 GT3 RS',
    plateNumber: '粤B·9T999',
    status: 'completed',
    fee: 12800,
    assignedButler: '管家小王',
    butlerPhone: '177****9003',
    createdAt: '2026-06-25',
    scheduledDate: '2026-06-28',
    completedDate: '2026-06-28',
    rating: 5,
    review: '保养专业，还给洗了车，点赞'
  }
]

// 服务状态映射
export const serviceStatusMap = {
  pending: { label: '待确认', color: '#4C98B9', bg: 'rgba(76,152,185,0.06)' },
  confirmed: { label: '已确认', color: '#E8A838', bg: 'rgba(232,168,56,0.06)' },
  in_progress: { label: '进行中', color: '#DA291C', bg: 'rgba(218,41,28,0.06)' },
  completed: { label: '已完成', color: '#03904A', bg: 'rgba(3,144,74,0.06)' },
  cancelled: { label: '已取消', color: '#8F8F8F', bg: 'rgba(143,143,143,0.06)' }
}

// 服务统计
export const serviceStats = {
  totalOrders: 5,
  thisMonth: { count: 4, revenue: 23300 },
  completedRate: '60%',
  avgRating: 4.7,
  popularServices: [
    { name: '年检代办', count: 8, satisfaction: '98%' },
    { name: '美容养护', count: 6, satisfaction: '95%' },
    { name: '原厂保养', count: 5, satisfaction: '100%' },
    { name: '贷款咨询', count: 4, satisfaction: '92%' }
  ]
}
