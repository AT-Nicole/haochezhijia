/**
 * 豪车之家 - 内容营销 Mock 数据
 */

export const mockContents = [
  // 营销文案（AI生成）
  { _id: 'ct001', type: 'social_post', title: '深圳首发！2024款法拉利SF90到店', content: '独家现车！法拉利SF90 Stradale，V8双涡轮+三电机混动，1000匹马力。全车原漆，碳纤维套件+JBL音响。预约试驾享专属优惠！#法拉利 #深圳超跑 #SF90', platform: '朋友圈', status: 'published', views: 4500, likes: 234, shares: 89, generatedBy: 'AI', dealerId: 'd001', createdAt: '2026-07-10 09:00' },
  { _id: 'ct002', type: 'social_post', title: '迈巴赫S680限时特价！', content: '原价302万，现价268万！月岩灰外观，爱马仕双色内饰，V12动力。仅此一台，先到先得！#迈巴赫 #行政座驾 #特价', platform: '朋友圈', status: 'published', views: 6200, likes: 312, shares: 156, generatedBy: 'AI', dealerId: 'd002', createdAt: '2026-07-10 09:00' },
  { _id: 'ct003', type: 'wechat_article', title: '2024大湾区超跑选购指南：从保时捷到布加迪', content: '全面解析大湾区在售超跑，从性价比之选保时捷911到顶级超跑布加迪Chiron。价格、性能、保值率一网打尽。', platform: '公众号', status: 'published', views: 12000, likes: 678, shares: 345, generatedBy: 'AI', dealerId: 'd001', createdAt: '2026-07-08' },
  { _id: 'ct004', type: 'short_video_script', title: '迈凯伦Artura V6混动超跑深度评测脚本', content: '【开场】3秒破百的混动超跑！迈凯伦Artura深度评测\n【第一段】外观设计 - 蝴蝶门+碳纤维\n【第二段】混动系统 - V6+电机700匹\n【第三段】驾驶体验 - 轻量化+赛道表现\n【结尾】预订通道+关注领取试驾名额', platform: '视频号', status: 'draft', views: 0, likes: 0, shares: 0, generatedBy: 'AI', dealerId: 'd002', createdAt: '2026-07-11' },
  { _id: 'ct005', type: 'social_post', title: '路虎揽胜创世加长版到店实拍', content: '尊享加长轴距，四轮转向+后排行政座椅。与奔驰GLS深度对比评测，路虎赢在哪？#路虎揽胜 #SUV之王 #对比评测', platform: '朋友圈', status: 'published', views: 3800, likes: 178, shares: 67, generatedBy: 'AI', dealerId: 'd003', createdAt: '2026-07-12' },
  { _id: 'ct006', type: 'live_stream_script', title: '周末直播：大湾区超跑嘉年华回顾', content: '【开场】欢迎来到豪车之家直播间！\n【第一环节】超跑嘉年华精彩回顾 - 15台超跑巡游\n【第二环节】法拉利SF90 vs 迈凯伦720S 性能对比\n【第三环节】观众问答 + 抽奖送限量周边\n【结尾】下周预告：豪车管家服务上线', platform: '视频号', status: 'published', views: 28000, likes: 1560, shares: 420, generatedBy: 'AI', dealerId: 'd001', createdAt: '2026-07-09' },
  { _id: 'ct007', type: 'wechat_article', title: '300万预算，迈巴赫S680 vs 宾利飞驰怎么选？', content: '同为顶级行政座驾，迈巴赫S680和宾利飞驰各有千秋。本文从动力、空间、品牌、保值率四个维度深度对比，帮你做出最佳选择。', platform: '公众号', status: 'published', views: 8500, likes: 423, shares: 198, generatedBy: 'AI', dealerId: 'd002', createdAt: '2026-07-06' },
  { _id: 'ct008', type: 'social_post', title: '保时捷911 GT3 RS 全国稀缺车型到店', content: '保时捷911 GT3 RS 4.0L自然吸气，525马力！全国在售不足20台，深圳唯一现车。赛道利器，收藏投资两不误！#保时捷 #GT3RS #收藏级', platform: '朋友圈', status: 'published', views: 5600, likes: 289, shares: 112, generatedBy: 'AI', dealerId: 'd001', createdAt: '2026-07-13' },
  { _id: 'ct009', type: 'short_video_script', title: '兰博基尼Huracán EVO 开箱仪式', content: '【开场】500万级超跑开箱！兰博基尼Huracán EVO\n【第一段】交付仪式 - 香槟+鲜花+客户惊喜\n【第二段】外观 walkthrough - 亮黄色+黑色套件\n【第三段】点火启动 - V10自吸声浪', platform: '抖音', status: 'draft', views: 0, likes: 0, shares: 0, generatedBy: 'AI', dealerId: 'd002', createdAt: '2026-07-14' },
  { _id: 'ct010', type: 'car_review', title: '法拉利SF90 Stradale深度测评：混动超跑的标杆', content: '1000匹马力的混动超跑，法拉利SF90 Stradale究竟有多强？从设计、性能、科技三个维度全面解读这台V8混动旗舰。', platform: '全网', status: 'published', views: 15000, likes: 890, shares: 567, generatedBy: 'AI', dealerId: 'd001', createdAt: '2026-07-05' }
]

// 内容统计
export const contentStats = {
  total: 10,
  thisMonth: { posts: 6, articles: 2, videos: 2, totalViews: 84600 },
  totalViews: 94600,
  totalLikes: 4764,
  totalShares: 1974,
  aiGenerated: 10,
  avgEngagementRate: '5.6%',
  topPerforming: [
    { title: '周末直播：大湾区超跑嘉年华回顾', views: 28000, engagement: '7.1%' },
    { title: '法拉利SF90 Stradale深度测评', views: 15000, engagement: '9.7%' },
    { title: '2024大湾区超跑选购指南', views: 12000, engagement: '8.5%' }
  ]
}

// 内容类型映射
export const contentTypeMap = {
  social_post: { label: '朋友圈文案', color: '#03904A' },
  wechat_article: { label: '公众号文章', color: '#4C98B9' },
  short_video_script: { label: '短视频脚本', color: '#DA291C' },
  live_stream_script: { label: '直播脚本', color: '#E8A838' },
  car_review: { label: '车评内容', color: '#004B87' }
}

// 内容状态映射
export const contentStatusMap = {
  draft: { label: '草稿', color: '#8F8F8F' },
  review: { label: '待审核', color: '#E8A838' },
  published: { label: '已发布', color: '#03904A' },
  archived: { label: '已归档', color: '#4C98B9' }
}
