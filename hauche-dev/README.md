# 豪车之家 — 大湾区豪车服务智能平台

> TRAE AI 创意大赛参赛项目

## 项目简介

豪车之家是面向粤港澳大湾区的高端汽车服务智能平台，通过 AI 驱动实现豪车行业全链路数字化：

- **0库存代理模式** — 无需囤货，1%服务费即可开展豪车交易
- **AI 全自动运营** — 10 项 AI 自动化，替代传统 6 人团队全部工作
- **26 项管家服务** — 从购车到生活的一站式 VIP 体验
- **裂变分佣体系** — 社交裂变驱动增长，推荐赚佣金

## 技术架构

```
┌─────────────────────────────────────────┐
│           微信小程序 (Taro 4 + Vue 3)     │
│  35 页面 · 5 角色 · 自定义 TabBar       │
├─────────────────────────────────────────┤
│        服务层 (Services + Pinia Store)   │
│  AI服务 · 云函数调用 · 支付 · 状态管理    │
├─────────────────────────────────────────┤
│      微信云开发 (Serverless 后端)         │
│  13 云函数 · 10 集合 · 5 定时触发器      │
├─────────────────────────────────────────┤
│           外部服务                        │
│  DeepSeek AI · 微信支付 · 订阅消息       │
└─────────────────────────────────────────┘
```

## 五大角色

| 角色 | 核心功能 | 页面数 |
|------|---------|--------|
| 买家 | 选车、比价、社区、金融 | 10 |
| VIP会员 | 管家服务、礼宾、资源圈 | 5 |
| 经销商 | 车源、CRM、营销、分佣 | 8 |
| 创作者 | 内容创作、活动运营 | 2 |
| 管理员 | 数据看板、用户审核、财务 | 3 |

## AI 能力矩阵 (10项)

| AI 功能 | 自动化内容 | 频率 |
|---------|-----------|------|
| 智能对话 | 车型咨询、购车建议 | 实时 |
| 车型推荐 | 基于画像的个性化推荐 | 实时 |
| 营销文案 | 自动生成营销内容 | 每日 |
| 分层群发 | 客户分级差异化触达 | 每日 |
| 活动方案 | 完整策划方案生成 | 按需 |
| 比价分析 | 全国车源智能比价 | 实时 |
| 财务报告 | 月度 P&L 自动生成 | 每月 |
| 跟进建议 | 销售线索智能跟进 | 每日 |
| 转介绍海报 | 海报文案自动生成 | 按需 |
| 资源匹配 | 企业家资源智能匹配 | 实时 |

## 快速开始

### 前置要求

- Node.js >= 18
- 微信开发者工具 >= 1.06
- 微信小程序账号（已开通云开发）

### 安装

```bash
cd hauche-dev
npm install
```

### 配置

```bash
node scripts/create-cloud-env.js
# 编辑 .env 填入真实配置
```

### 开发

```bash
# 微信小程序开发模式
npm run dev:weapp

# H5 预览（浏览器）
npm run dev:h5
```

### 部署

```bash
# 构建生产版本
npm run build:weapp

# 验证云函数
node scripts/deploy-functions.js
```

然后在微信开发者工具中：
1. 导入项目，选择 `dist/` 目录
2. 开通云开发
3. 上传全部 13 个云函数
4. 配置环境变量

## 项目结构

```
hauche-dev/
├── cloudfunctions/          # 云函数 (13个)
│   ├── login/               # 微信登录
│   ├── userService/         # 用户服务
│   ├── dealerService/       # 经销商服务
│   ├── vehicleService/      # 车辆服务
│   ├── leadService/         # 线索服务
│   ├── orderService/        # 订单服务
│   ├── serviceService/      # 管家服务
│   ├── aiService/           # AI服务 (10个action)
│   ├── paymentService/      # 支付服务
│   ├── dailyMarketing/      # 每日营销 (定时)
│   ├── dailyFollowUp/       # 每日跟进 (定时)
│   ├── dailyInventory/      # 每日库存 (定时)
│   ├── monthlyFinance/      # 月度财务 (定时)
│   └── weeklyReport/        # 周报 (定时)
├── src/
│   ├── pages/               # 页面 (35个)
│   ├── components/          # 组件
│   │   ├── custom-tabbar/   # 自定义 TabBar
│   │   ├── skeleton/        # 骨架屏
│   │   ├── empty-state/     # 空状态
│   │   ├── error-boundary/  # 错误边界
│   │   ├── pull-refresh/    # 下拉刷新
│   │   ├── car-card/        # 车辆卡片
│   │   └── ai-float-btn/    # AI悬浮按钮
│   ├── services/            # 服务层
│   │   ├── cloud.js         # 云开发封装
│   │   ├── ai.js            # AI服务
│   │   ├── vehicle.js       # 车辆业务
│   │   ├── chat.js          # 对话管理
│   │   ├── member.js        # 会员管理
│   │   └── payment.js       # 支付服务
│   ├── stores/              # Pinia 状态管理
│   │   ├── user.js          # 用户状态
│   │   ├── vehicle.js       # 车辆状态
│   │   └── app.js           # 应用状态
│   ├── utils/               # 工具函数
│   │   ├── format.js        # 格式化
│   │   ├── request.js       # HTTP请求
│   │   ├── validate.js      # 表单验证
│   │   ├── auth.js          # 权限控制
│   │   └── navigation.js    # 导航工具
│   ├── app.js               # 入口
│   ├── app.config.js        # 路由配置
│   └── app.scss             # 设计令牌
├── docs/                    # 文档
│   ├── database-design.md   # 数据库设计
│   ├── technical-architecture.md  # 技术架构
│   ├── api-database-design.md    # API设计
│   └── competition-brief.md      # 参赛简介
├── scripts/                 # 脚本
│   ├── deploy-functions.js  # 部署验证
│   └── create-cloud-env.js  # 环境配置
└── config/                  # 构建配置
```

## 设计系统

**Ferrari Rosso Corsa**
- 主色: `#DA291C` (法拉利红)
- 强调色: `#E8B800` (金色)
- 圆角: 2px / 4px / 8px 层级
- 风格: 零阴影，纯边框，极致精准

## 成本估算

| 项目 | 月费用 |
|------|--------|
| 微信云开发基础版 | ¥0 |
| 云数据库 (2GB) | ¥7 |
| 云存储 (5GB) | ¥5 |
| 云函数调用 | ¥3 |
| DeepSeek API | ¥30 |
| **合计** | **~¥45/月** |

## License

MIT
