# 豪车之家 云数据库设计

## 集合清单（10个核心集合）

### 1. users — 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| _openid | string | 微信openid（自动注入） |
| nickName | string | 昵称 |
| avatarUrl | string | 头像URL |
| phone | string | 手机号（加密存储） |
| role | string | 角色：buyer/dealer/creator/vip/admin |
| roleStatus | string | 角色状态：pending/active/suspended |
| createdAt | date | 注册时间 |
| updatedAt | date | 更新时间 |

索引：_openid(唯一), role, phone

### 2. dealers — 车行表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| _openid | string | 车行负责人openid |
| name | string | 车行名称 |
| shortName | string | 简称（用于头像） |
| logo | string | Logo URL |
| city | string | 城市 |
| address | string | 详细地址 |
| description | string | 车行介绍 |
| rating | number | 评分(1-5) |
| stockCount | number | 在售车辆数 |
| totalSold | number | 累计销售 |
| status | string | pending/active/suspended |
| businessLicense | string | 营业执照URL |
| contactName | string | 联系人 |
| contactPhone | string | 联系电话 |
| verifiedAt | date | 认证时间 |
| createdAt | date | 创建时间 |
| updatedAt | date | 更新时间 |

索引：city, status, rating, _openid

### 3. vehicles — 车辆表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| dealerId | string | 所属车行ID |
| brand | string | 品牌 |
| model | string | 车型 |
| year | number | 年份 |
| price | number | 售价（万元） |
| originalPrice | number | 新车指导价 |
| mileage | number | 里程（km，0=新车） |
| condition | string | 新车/准新/二手 |
| color | string | 外观颜色 |
| interior | string | 内饰颜色 |
| engine | string | 发动机参数 |
| horsepower | number | 马力 |
| acceleration | number | 百公里加速(秒) |
| fuel | string | 油耗(L/100km) |
| seats | number | 座位数 |
| drive | string | 驱动方式 |
| transmission | string | 变速箱 |
| images | array[string] | 图片URL列表 |
| coverImage | string | 封面图URL |
| tags | array[string] | 标签：VIP/热销/新到/降价 |
| status | string | 在售/预售/已售/下架 |
| viewCount | number | 浏览量 |
| createdAt | date | 上架时间 |
| updatedAt | date | 更新时间 |
| daysInStock | number | 库存天数（AI计算） |

索引：dealerId, brand, model, price, status, condition, daysInStock

### 4. leads — 线索/客户表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| dealerId | string | 关联车行ID |
| userId | string | 买家用户ID |
| vehicleId | string | 意向车型ID |
| status | string | 新线索/跟进中/已到店/已成交/已流失 |
| source | string | 来源：AI推荐/展厅/朋友圈/老客推荐/活动 |
| budget | number | 预算（万元） |
| notes | string | 备注 |
| followUpCount | number | 跟进次数 |
| lastFollowUpAt | date | 最后跟进时间 |
| nextFollowUpAt | date | 下次跟进时间（AI计算） |
| closedAt | date | 成交/流失时间 |
| referrerId | string | 推荐人ID（裂变追踪） |
| createdAt | date | 创建时间 |
| updatedAt | date | 更新时间 |

索引：dealerId, userId, status, source, referrerId

### 5. orders — 订单表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| orderNo | string | 订单号 |
| buyerId | string | 买家ID |
| dealerId | string | 车行ID |
| vehicleId | string | 车辆ID |
| type | string | 销售/置换/金融 |
| amount | number | 金额（万元） |
| status | string | 待确认/已签约/已付款/交付中/已完成/已取消 |
| stage | number | 交付阶段(1-8，豪车毒8步) |
| stageHistory | array[object] | 阶段历史记录 |
| financeAmount | number | 贷款金额 |
| commission | number | 佣金金额 |
| commissionStatus | string | 待结算/已结算 |
| createdAt | date | 创建时间 |
| updatedAt | date | 更新时间 |

索引：buyerId, dealerId, status, orderNo(唯一)

### 6. services — 管家服务记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| userId | string | 会员ID |
| dealerId | string | 服务车行ID |
| type | string | 服务类型（26种之一） |
| typeName | string | 服务名称 |
| status | string | 待执行/进行中/已完成/已取消 |
| scheduledAt | date | 预约时间 |
| completedAt | date | 完成时间 |
| assignedTo | string | 负责人 |
| rating | number | 评分(1-5) |
| feedback | string | 反馈 |
| autoTriggered | boolean | 是否AI自动触发 |
| triggerReason | string | 触发原因（如：保养到期） |
| createdAt | date | 创建时间 |

索引：userId, dealerId, type, status, scheduledAt

### 7. contents — 内容表（资讯/短视频/素材）

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| authorId | string | 作者/创作者ID |
| type | string | article/video/material/poster |
| title | string | 标题 |
| content | string | 内容 |
| coverImage | string | 封面图 |
| videoUrl | string | 视频URL |
| images | array[string] | 图片列表 |
| tags | array[string] | 标签 |
| viewCount | number | 浏览量 |
| likeCount | number | 点赞数 |
| shareCount | number | 分享数 |
| aiGenerated | boolean | 是否AI生成 |
| aiPrompt | string | AI生成提示词 |
| status | string | draft/published/archived |
| publishedAt | date | 发布时间 |
| createdAt | date | 创建时间 |

索引：authorId, type, status, publishedAt

### 8. commissions — 佣金/分佣表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| referrerId | string | 推荐人ID |
| refereeId | string | 被推荐人ID |
| orderId | string | 关联订单ID |
| amount | number | 佣金金额 |
| level | number | 1=直接推荐 2=二级推荐 |
| rate | number | 佣金比例 |
| status | string | 待结算/已结算/已到账 |
| settledAt | date | 结算时间 |
| createdAt | date | 创建时间 |

索引：referrerId, refereeId, orderId, status

### 9. events — 活动表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| title | string | 活动名称 |
| description | string | 活动描述 |
| type | string | 类型：品鉴/试驾/晚宴/自驾/车展 |
| coverImage | string | 封面图 |
| posterUrl | string | 海报URL |
| location | string | 地点 |
| address | string | 详细地址 |
| startDate | date | 开始时间 |
| endDate | date | 结束时间 |
| maxParticipants | number | 最大参与人数 |
| currentParticipants | number | 当前报名人数 |
| status | string | 筹备中/报名中/进行中/已结束 |
| aiGenerated | boolean | 是否AI策划 |
| registrationList | array[string] | 报名用户ID列表 |
| report | object | 复盘数据 |
| createdAt | date | 创建时间 |

索引：status, startDate, type

### 10. finances — 财务记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| dealerId | string | 车行ID |
| type | string | income/expense |
| category | string | 收入：sale/service/commission/membership | 支出：purchase/operation/salary/marketing |
| amount | number | 金额（元） |
| relatedOrderId | string | 关联订单ID |
| description | string | 描述 |
| autoGenerated | boolean | AI自动记账 |
| period | string | 会计期间：2026-07 |
| createdAt | date | 创建时间 |

索引：dealerId, type, category, period, createdAt

---

## 云数据库权限规则

| 集合 | 读权限 | 写权限 |
|------|--------|--------|
| users | 仅创建者可读自己的记录，admin可读全部 | 仅创建者可写自己的记录 |
| dealers | 所有用户可读 | 仅创建者/管理员可写 |
| vehicles | 所有用户可读 | 仅关联车行/管理员可写 |
| leads | 仅关联车行可读 | 仅关联车行可写 |
| orders | 买卖双方可读 | 车行可写状态 |
| services | 买卖双方可读 | 服务车行可写 |
| contents | 所有用户可读已发布内容 | 创作者可写自己的 |
| commissions | 仅相关方可读 | 系统自动写 |
| events | 所有用户可读 | 管理员/创作者可写 |
| finances | 仅关联车行可读 | 仅关联车行可写 |

---

## 数据量预估（MVP阶段）

| 集合 | 预估条数 | 说明 |
|------|---------|------|
| users | 500 | 初期用户 |
| dealers | 20 | 深圳地区车行 |
| vehicles | 200 | 平均每车行10辆 |
| leads | 2000 | 平均每车行100条 |
| orders | 100 | 月均 |
| services | 500 | 月均 |
| contents | 200 | 月均 |
| commissions | 50 | 月均 |
| events | 10 | 月均 |
| finances | 1000 | 月均 |
