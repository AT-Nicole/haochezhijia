# 豪车之家 — 产品原型设计

> 基于 TRAE AI 独立设计的豪车之家全链路产品原型，涵盖桌面端管理后台 + 移动端小程序。

## 项目结构

```
├── hauche-prototype-desktop/    # 桌面端原型（5页）
│   ├── pages/
│   │   ├── content-workspace.html    # AI内容发布工作台
│   │   ├── digital-human.html        # 数字人视频工具
│   │   ├── payment-dashboard.html    # 付费结算后台
│   │   ├── data-analytics.html       # 数据分析仪表盘
│   │   └── showroom-manage.html      # 展厅管理
│   ├── assets/                       # 视觉素材
│   ├── colors_and_type.css           # 设计系统 Token
│   └── hauche-prototype-desktop.design
│
├── hauche-prototype-mobile/      # 移动端原型（6页）
│   ├── pages/
│   │   ├── crm-home.html             # CRM首页
│   │   ├── crm-members.html          # 会员管理
│   │   ├── crm-inventory.html        # 库存台账
│   │   ├── ai-chat.html              # AI客服对话
│   │   ├── showroom.html             # 豪车展厅列表
│   │   └── car-detail.html           # 车辆详情页
│   ├── assets/                       # 视觉素材
│   ├── colors_and_type.css           # 设计系统 Token
│   └── hauche-prototype-mobile.design
│
├── luxury-car-showcase/           # 桌面端路演展示（5页）
│   ├── pages/
│   │   ├── index.html                # 首页
│   │   ├── market-pain.html          # 市场痛点
│   │   ├── ai-solutions.html         # AI解决方案
│   │   ├── business-model.html       # 商业模式
│   │   └── tech-team.html            # 技术实力
│   └── ...
│
└── luxury-car-showcase-mobile/     # 移动端路演展示（5页）
    ├── pages/
    │   ├── index.html
    │   ├── market-pain.html
    │   ├── ai-solutions.html
    │   ├── business-model.html
    │   └── tech-team.html
    └── ...
```

## 设计规格

| 项目 | 设备 | 页面数 | 设计风格 |
|---|---|---|---|
| 桌面端原型 | Desktop (1440px) | 5 | SaaS Dashboard，深色+金色，Inter字体 |
| 移动端原型 | Mobile (375px) | 6 | 微信小程序风格，深色+金色，底部Tab导航 |
| 路演展示(桌面) | Desktop | 5 | 黑金奢华风，Playfair Display标题 |
| 路演展示(移动) | Mobile | 5 | 同上，底部Tab导航 |

## 核心AI差异化功能

- **AI智能推荐**：基于用户画像的车型匹配度推荐（98%/95%/91%）
- **AI智能评估**：车辆综合评分（车况/价格/稀缺度/保值率四维）
- **AI定价助手**：同类成交对比分析+智能定价建议
- **AI库存健康度**：库龄预警+曝光优化建议
- **AI客服对话**：自动回复+自动打标签+预约安排
- **AI内容发布**：一键生成多平台营销文案

## 技术栈

- HTML5 + Tailwind CSS v4 + Lucide Icons
- CSS Custom Properties 设计系统
- 纯前端原型，无后端依赖

## 预览方式

使用任意本地HTTP服务器打开 `.design` 文件或在浏览器中直接打开 `pages/` 目录下的HTML文件：

```bash
# 进入任意项目目录后
python -m http.server 8080
```

## 版权

全部原型基于字节跳动 TRAE AI 平台独立设计开发。
