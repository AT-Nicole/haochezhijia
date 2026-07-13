# 豪车之家小程序 — 开发指南

## 项目概述
基于 Taro + Vue3 的跨端小程序，服务大湾区高端豪车车主圈层。

## 技术栈
- **框架**: Taro 4.0 + Vue 3 (Composition API)
- **样式**: SCSS + 全局设计变量
- **UI**: 自研暗色主题组件库
- **状态管理**: Vue3 reactive (按需升级 Pinia)
- **HTTP**: 封装 Taro.request
- **多端**: 微信小程序 + H5

## 快速开始
```bash
# 1. 安装依赖
npm install

# 2. 微信小程序开发
npm run dev:weapp
# 用微信开发者工具打开 dist/ 目录

# 3. H5 开发
npm run dev:h5

# 4. 生产构建
npm run build:weapp
npm run build:h5
```

## 目录结构
```
src/
├── app.config.js          # 应用配置（页面路由+TabBar）
├── app.js                 # 应用入口
├── app.scss               # 全局样式变量
├── assets/tab/            # TabBar 图标
├── components/            # 公共组件
├── pages/
│   ├── index/            # 首页 (CRM工作台)
│   ├── showroom/         # 豪车展厅
│   ├── car-detail/       # 车辆详情
│   ├── crm-members/      # 会员管理
│   ├── crm-inventory/    # 库存台账
│   ├── ai-chat/          # AI客服对话
│   └── profile/          # 个人中心
├── services/              # API 服务层
├── stores/                # 状态管理
└── utils/                 # 工具函数
```

## 页面说明
| 页面 | 路径 | 功能 |
|---|---|---|
| 首页 | /pages/index | CRM工作台：数据概览、快捷操作、活动、待办、收入 |
| 展厅 | /pages/showroom | 豪车浏览：AI推荐、筛选、车辆列表 |
| 车辆详情 | /pages/car-detail | 沉浸式看车：AI评估、参数、推荐 |
| 会员管理 | /pages/crm-members | 分层会员列表、搜索筛选、佣金管理 |
| 库存台账 | /pages/crm-inventory | 车辆库存：财务数据、贬值预警 |
| AI顾问 | /pages/ai-chat | AI客服：对话、产品卡、预约、自动标签 |
| 个人中心 | /pages/profile | 个人设置（待开发） |

## API 对接
所有 API 接口定义见: docs/api-database-design.md

当前页面使用内联 mock 数据，接入后端时：
1. 修改 src/services/*.js 中的 BASE_URL
2. 将组件中的 mock 数据替换为 API 调用
3. 参考 API 文档中的请求/响应格式

## 设计规范
- 主色: #C8A45C (金色)
- 背景: #0C0C14 (深色)
- 卡片: #16161F
- 文字: #F0ECE4 / #8A867E / #5A5750
- 字体: Inter + Noto Sans SC
- 圆角: 6px / 8px / 12px
- 最小触控: 44px (88rpx)

## 后续开发计划
- [ ] 接入真实 API
- [ ] 个人中心页面
- [ ] 内容发布工具（桌面端）
- [ ] 数字人视频工具（桌面端）
- [ ] 数据分析仪表盘（桌面端）
- [ ] 微信支付集成
- [ ] 用户权限系统

## 参赛信息
字节跳动 TRAE AI 创造力大赛参赛作品
项目估值: 6600万
对标: 汽车之家
