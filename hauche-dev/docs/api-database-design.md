# 豪车之家 (HaoChe Home) 技术开发文档

> 版本: v1.0.0
> 更新日期: 2026-07-11
> 数据库: SQLite / MySQL 兼容
> 接口协议: RESTful API (JSON)

---

# 第一部分: 数据库设计

## 设计说明

- 所有表使用 `id` 作为主键,采用自增长整型 (SQLite) 或 `BIGINT AUTO_INCREMENT` (MySQL)。
- 时间字段统一使用 `DATETIME` 类型,默认值为当前时间。
- 枚举类型字段在注释中标注可选值,建表时使用 `VARCHAR` 存储。
- `JSON` 类型字段使用 `TEXT` 存储 (SQLite),MySQL 环境可改为原生 `JSON`。
- 字符集统一使用 `utf8mb4`,排序规则 `utf8mb4_general_ci`。

---

## 1. 用户与会员模块

### 1.1 users 表 — 用户基础信息

```sql
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname        VARCHAR(100)    NOT NULL DEFAULT ''           COMMENT '用户昵称',
    avatar          VARCHAR(500)    NOT NULL DEFAULT ''           COMMENT '头像URL',
    phone           VARCHAR(20)     NOT NULL DEFAULT ''           COMMENT '手机号(加密存储)',
    wechat_openid   VARCHAR(128)    NOT NULL DEFAULT ''           COMMENT '微信OpenID',
    role            VARCHAR(20)     NOT NULL DEFAULT 'user'       COMMENT '角色: user/admin/super_admin',
    status          TINYINT         NOT NULL DEFAULT 1             COMMENT '状态: 1=正常, 0=禁用',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_wechat_openid ON users(wechat_openid);
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | INTEGER/BIGINT | 自动 | 用户唯一标识 |
| nickname | VARCHAR(100) | 否 | 昵称,微信授权后自动填充 |
| avatar | VARCHAR(500) | 否 | 头像图片CDN地址 |
| phone | VARCHAR(20) | 否 | 手机号,绑定后写入 |
| wechat_openid | VARCHAR(128) | 是 | 微信小程序登录唯一标识 |
| role | VARCHAR(20) | 是 | `user`=普通用户, `admin`=管理员, `super_admin`=超级管理员 |
| status | TINYINT | 是 | `1`=正常, `0`=禁用 |
| created_at | DATETIME | 自动 | 注册时间 |
| updated_at | DATETIME | 自动 | 最后更新时间 |

---

### 1.2 members 表 — 会员信息

```sql
CREATE TABLE IF NOT EXISTS members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER         NOT NULL                     COMMENT '关联用户ID',
    level           VARCHAR(20)     NOT NULL DEFAULT 'BASIC'     COMMENT '会员等级: BASIC/STANDARD/PREMIUM',
    expire_date     DATE            NOT NULL                     COMMENT '到期日期',
    status          VARCHAR(20)     NOT NULL DEFAULT 'active'     COMMENT '状态: active/expired',
    auto_renew      TINYINT         NOT NULL DEFAULT 0            COMMENT '自动续费: 1=是, 0=否',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_level ON members(level);
CREATE INDEX idx_members_status ON members(status);
```

**会员等级定价体系:**

| 等级 | 年费价格 | 权益说明 |
|------|----------|----------|
| BASIC | 免费 | 基础浏览、在线咨询、活动报名 |
| STANDARD | ¥9,800/年 | AI智能推荐、专属顾问、优先看车、佣金分成10% |
| PREMIUM | ¥19,800/年 | 全部STANDARD权益 + 深度AI评估、私人管家、佣金分成15%、高端活动优先 |

---

### 1.3 level_pricing 配置表

```sql
CREATE TABLE IF NOT EXISTS level_pricing (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    level           VARCHAR(20)     NOT NULL UNIQUE               COMMENT '等级标识',
    name            VARCHAR(50)     NOT NULL                     COMMENT '等级名称',
    price_yearly    DECIMAL(10,2)   NOT NULL DEFAULT 0.00         COMMENT '年费价格(元)',
    commission_rate DECIMAL(5,2)    NOT NULL DEFAULT 0.00         COMMENT '佣金分成比例(%)',
    features_json   TEXT            NOT NULL DEFAULT '[]'         COMMENT '权益列表JSON',
    sort_order      INT             NOT NULL DEFAULT 0            COMMENT '排序权重',
    status          TINYINT         NOT NULL DEFAULT 1            COMMENT '是否启用: 1=是, 0=否',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据
INSERT INTO level_pricing (level, name, price_yearly, commission_rate, features_json, sort_order) VALUES
('BASIC', '基础会员', 0.00, 0.00, '["基础浏览","在线咨询","活动报名"]', 1),
('STANDARD', '标准会员', 9800.00, 10.00, '["AI智能推荐","专属顾问","优先看车","佣金分成10%","库存查看"]', 2),
('PREMIUM', '至尊会员', 19800.00, 15.00, '["全部标准权益","深度AI评估","私人管家","佣金分成15%","高端活动优先","数据看板"]', 3);
```

---

## 2. 车辆与展厅模块

### 2.1 vehicles 表 — 车辆信息

```sql
CREATE TABLE IF NOT EXISTS vehicles (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    brand                   VARCHAR(50)     NOT NULL DEFAULT ''           COMMENT '品牌: Porsche/Benz/BMW/Rolls-Royce等',
    model                   VARCHAR(100)    NOT NULL DEFAULT ''           COMMENT '车型: 如 911 Turbo S / Maybach S680',
    year                    INT             NOT NULL DEFAULT 0             COMMENT '年款: 2024',
    mileage                 INT             NOT NULL DEFAULT 0             COMMENT '行驶里程(公里)',
    price                   DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '售价(元)',
    cost_price              DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '成本价(元)',
    exterior_color          VARCHAR(50)     NOT NULL DEFAULT ''           COMMENT '外观颜色',
    interior_color          VARCHAR(50)     NOT NULL DEFAULT ''           COMMENT '内饰颜色',
    engine                  VARCHAR(100)    NOT NULL DEFAULT ''           COMMENT '发动机型号',
    transmission            VARCHAR(50)     NOT NULL DEFAULT ''           COMMENT '变速箱类型',
    drive_type              VARCHAR(50)     NOT NULL DEFAULT ''           COMMENT '驱动方式: AWD/RWD/FWD',
    vehicle_type            VARCHAR(30)     NOT NULL DEFAULT 'sedan'      COMMENT '车辆类型: sedan/suv/coupe/convertible/super_car',
    status                  VARCHAR(20)     NOT NULL DEFAULT 'in_stock'   COMMENT '状态: in_stock/reserved/sold',
    days_in_stock           INT             NOT NULL DEFAULT 0             COMMENT '在库天数',
    depreciation_monthly    DECIMAL(10,2)   NOT NULL DEFAULT 0.00           COMMENT '月贬值金额(元)',
    cover_image             VARCHAR(500)    NOT NULL DEFAULT ''           COMMENT '封面图URL',
    images                  TEXT            NOT NULL DEFAULT '[]'          COMMENT '图片列表JSON数组',
    specs_json              TEXT            NOT NULL DEFAULT '{}'          COMMENT '详细参数JSON',
    ai_score                DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT 'AI综合评分(0-100)',
    ai_evaluation           TEXT            NOT NULL DEFAULT ''            COMMENT 'AI评估摘要',
    source                  VARCHAR(30)     NOT NULL DEFAULT 'trade_in'   COMMENT '来源: trade_in/consignment/purchase/auction',
    source_owner_id         INTEGER         NOT NULL DEFAULT 0             COMMENT '来源会员ID(寄售场景)',
    created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_vehicle_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_year ON vehicles(year);
```

**specs_json 示例结构:**

```json
{
    "horsepower": 650,
    "torque": 800,
    "displacement": 4.0,
    "fuel_type": "汽油",
    "acceleration": "3.2s (0-100km/h)",
    "top_speed": 330,
    "body_material": "碳纤维复合材料",
    "chassis": "空气悬挂",
    "wheels": "21寸锻造轮毂",
    "interior": "全Nappa真皮内饰",
    "advanced_features": [
        "夜视系统",
        "360度全景影像",
        "自适应巡航",
        "Burmester顶级音响"
    ]
}
```

---

### 2.2 vehicle_favorites 表 — 车辆收藏

```sql
CREATE TABLE IF NOT EXISTS vehicle_favorites (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER         NOT NULL,
    vehicle_id      INTEGER         NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE(user_id, vehicle_id)
);

-- 索引
CREATE INDEX idx_favorites_user_id ON vehicle_favorites(user_id);
CREATE INDEX idx_favorites_vehicle_id ON vehicle_favorites(vehicle_id);
```

---

### 2.3 vehicle_views 表 — 浏览记录

```sql
CREATE TABLE IF NOT EXISTS vehicle_views (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER         NOT NULL                     COMMENT '浏览用户(0=游客)',
    vehicle_id      INTEGER         NOT NULL,
    viewed_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_views_user_id ON vehicle_views(user_id);
CREATE INDEX idx_views_vehicle_id ON vehicle_views(vehicle_id);
CREATE INDEX idx_views_viewed_at ON vehicle_views(viewed_at);
```

---

## 3. AI智能模块

### 3.1 ai_recommendations 表 — AI推荐记录

```sql
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER         NOT NULL,
    vehicle_id      INTEGER         NOT NULL,
    match_score     DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '匹配度评分(0-100)',
    reason          TEXT            NOT NULL DEFAULT ''            COMMENT '推荐理由',
    recommendation_type VARCHAR(30) NOT NULL DEFAULT 'preference'   COMMENT '推荐类型: preference/history/ai_analysis',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE(user_id, vehicle_id, recommendation_type)
);

-- 索引
CREATE INDEX idx_ai_rec_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_rec_score ON ai_recommendations(match_score DESC);
```

---

### 3.2 ai_chat_logs 表 — AI聊天记录

```sql
CREATE TABLE IF NOT EXISTS ai_chat_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER         NOT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'user'       COMMENT '角色: user/assistant',
    content         TEXT            NOT NULL DEFAULT ''            COMMENT '消息内容',
    message_type    VARCHAR(30)     NOT NULL DEFAULT 'text'       COMMENT '消息类型: text/card_product/card_finance/card_appointment/system',
    metadata_json   TEXT            NOT NULL DEFAULT '{}'          COMMENT '消息元数据JSON(卡片数据等)',
    session_id      VARCHAR(64)     NOT NULL DEFAULT ''            COMMENT '会话标识',
    context_type    VARCHAR(30)     NOT NULL DEFAULT 'general'    COMMENT '对话场景: general/vehicle_detail/finance/consultation',
    vehicle_id      INTEGER         NOT NULL DEFAULT 0             COMMENT '关联车辆ID(可选)',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_chat_user_id ON ai_chat_logs(user_id);
CREATE INDEX idx_chat_session_id ON ai_chat_logs(session_id);
CREATE INDEX idx_chat_created_at ON ai_chat_logs(created_at);
```

**message_type 说明:**

| 类型 | 说明 | metadata_json 示例 |
|------|------|---------------------|
| text | 纯文本消息 | `{}` |
| card_product | 车辆产品卡片 | `{"vehicle_id": 1, "brand": "Porsche", "model": "911"}` |
| card_finance | 金融方案卡片 | `{"loan_amount": 1500000, "monthly": 25800, "term": 60}` |
| card_appointment | 预约卡片 | `{"appointment_id": "A20260711001", "time": "2026-07-15 14:00"}` |
| system | 系统消息 | `{"action": "session_start"}` |

---

### 3.3 ai_evaluations 表 — AI车辆评估

```sql
CREATE TABLE IF NOT EXISTS ai_evaluations (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id              INTEGER         NOT NULL UNIQUE,
    condition_score         DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '车况评分(0-100)',
    price_score             DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '价格合理性评分(0-100)',
    rarity_score            DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '稀缺性评分(0-100)',
    value_retention_score   DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '保值率评分(0-100)',
    overall_score           DECIMAL(3,2)    NOT NULL DEFAULT 0.00           COMMENT '综合评分(0-100)',
    insight_text            TEXT            NOT NULL DEFAULT ''            COMMENT 'AI洞察分析文本',
    comparable_prices_json  TEXT            NOT NULL DEFAULT '[]'          COMMENT '同款比价数据JSON',
    market_trend            VARCHAR(20)     NOT NULL DEFAULT 'stable'      COMMENT '市场趋势: rising/stable/declining',
    updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_ai_eval_overall ON ai_evaluations(overall_score DESC);
```

**comparable_prices_json 示例:**

```json
[
    {
        "source": "瓜子二手车",
        "price": 2150000,
        "mileage": 12000,
        "year": 2024,
        "url": "https://..."
    },
    {
        "source": "懂车帝",
        "price": 2080000,
        "mileage": 15000,
        "year": 2024,
        "url": "https://..."
    }
]
```

---

## 4. 订单与交易模块

### 4.1 orders 表 — 订单

```sql
CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no        VARCHAR(32)     NOT NULL UNIQUE                COMMENT '订单编号: HC20260711000001',
    user_id         INTEGER         NOT NULL,
    vehicle_id      INTEGER         NOT NULL DEFAULT 0             COMMENT '关联车辆ID(购车订单)',
    type            VARCHAR(30)     NOT NULL DEFAULT 'membership'  COMMENT '订单类型: purchase/membership/course/event',
    title           VARCHAR(200)    NOT NULL DEFAULT ''           COMMENT '订单标题',
    amount          DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '订单金额(元)',
    discount_amount DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '优惠金额(元)',
    pay_amount      DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '实付金额(元)',
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'     COMMENT '状态: pending/paid/completed/refunded/cancelled',
    payment_method  VARCHAR(30)     NOT NULL DEFAULT ''            COMMENT '支付方式: wechat/alipay/bank_transfer',
    payment_no      VARCHAR(64)     NOT NULL DEFAULT ''            COMMENT '第三方支付流水号',
    paid_at         DATETIME        NOT NULL DEFAULT NULL           COMMENT '支付时间',
    expire_at       DATETIME        NOT NULL DEFAULT NULL           COMMENT '订单过期时间',
    remark          TEXT            NOT NULL DEFAULT ''            COMMENT '备注',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- 索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

### 4.2 transactions 表 — 交易流水

```sql
CREATE TABLE IF NOT EXISTS transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id        INTEGER         NOT NULL,
    type            VARCHAR(20)     NOT NULL DEFAULT 'income'      COMMENT '类型: income/refund',
    amount          DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '金额(元)',
    description     VARCHAR(200)    NOT NULL DEFAULT ''            COMMENT '交易描述',
    split_ratio     DECIMAL(5,2)    NOT NULL DEFAULT 0.00           COMMENT '分账比例(%)',
    platform_share  DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '平台分账金额(元)',
    owner_share     DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '车主/推荐人分账金额(元)',
    payment_no      VARCHAR(64)     NOT NULL DEFAULT ''            COMMENT '支付流水号',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

---

## 5. 活动模块

### 5.1 activities 表 — 活动

```sql
CREATE TABLE IF NOT EXISTS activities (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               VARCHAR(200)    NOT NULL                     COMMENT '活动标题',
    description         TEXT            NOT NULL DEFAULT ''           COMMENT '活动描述',
    start_time          DATETIME        NOT NULL                     COMMENT '开始时间',
    end_time            DATETIME        NOT NULL                     COMMENT '结束时间',
    location            VARCHAR(300)    NOT NULL DEFAULT ''           COMMENT '活动地点',
    max_participants    INT             NOT NULL DEFAULT 0             COMMENT '最大参与人数(0=不限)',
    current_count       INT             NOT NULL DEFAULT 0             COMMENT '当前报名人数',
    status              VARCHAR(20)     NOT NULL DEFAULT 'upcoming'   COMMENT '状态: upcoming/ongoing/ended/cancelled',
    cover_image         VARCHAR(500)    NOT NULL DEFAULT ''           COMMENT '封面图URL',
    level_requirement   VARCHAR(20)     NOT NULL DEFAULT 'BASIC'      COMMENT '会员等级要求: BASIC/STANDARD/PREMIUM',
    fee                 DECIMAL(10,2)   NOT NULL DEFAULT 0.00         COMMENT '活动费用(元,0=免费)',
    organizer           VARCHAR(100)    NOT NULL DEFAULT ''           COMMENT '主办方',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_start_time ON activities(start_time);
```

---

### 5.2 activity_registrations 表 — 活动报名

```sql
CREATE TABLE IF NOT EXISTS activity_registrations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id     INTEGER         NOT NULL,
    user_id         INTEGER         NOT NULL,
    registered_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(20)     NOT NULL DEFAULT 'registered'   COMMENT '状态: registered/checked_in/cancelled',
    note            VARCHAR(200)    NOT NULL DEFAULT ''            COMMENT '备注',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(activity_id, user_id)
);

-- 索引
CREATE INDEX idx_registrations_user_id ON activity_registrations(user_id);
CREATE INDEX idx_registrations_activity_id ON activity_registrations(activity_id);
```

---

## 6. 佣金模块

### 6.1 commissions 表 — 佣金记录

```sql
CREATE TABLE IF NOT EXISTS commissions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id       INTEGER         NOT NULL                     COMMENT '推荐会员ID',
    vehicle_id      INTEGER         NOT NULL                     COMMENT '成交车辆ID',
    order_id        INTEGER         NOT NULL DEFAULT 0             COMMENT '关联订单ID',
    buyer_name      VARCHAR(100)    NOT NULL DEFAULT ''           COMMENT '买家姓名',
    amount          DECIMAL(12,2)   NOT NULL DEFAULT 0.00           COMMENT '佣金金额(元)',
    rate            DECIMAL(5,2)    NOT NULL DEFAULT 0.00           COMMENT '佣金比例(%)',
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'     COMMENT '状态: pending/settled/cancelled',
    settled_at      DATETIME        NOT NULL DEFAULT NULL           COMMENT '结算时间',
    remark          VARCHAR(500)    NOT NULL DEFAULT ''            COMMENT '备注',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- 索引
CREATE INDEX idx_commissions_member_id ON commissions(member_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_vehicle_id ON commissions(vehicle_id);
```

---

## 7. 内容发布模块

### 7.1 content_posts 表 — 内容发布

```sql
CREATE TABLE IF NOT EXISTS content_posts (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               VARCHAR(200)    NOT NULL DEFAULT ''           COMMENT '内容标题',
    content             TEXT            NOT NULL DEFAULT ''            COMMENT '正文内容(Markdown)',
    platforms_json      TEXT            NOT NULL DEFAULT '[]'          COMMENT '发布平台列表: douyin/wechat/xiaohongshu',
    platform_post_ids_json TEXT         NOT NULL DEFAULT '{}'          COMMENT '各平台发布后的ID映射JSON',
    status              VARCHAR(20)     NOT NULL DEFAULT 'draft'       COMMENT '状态: draft/generating/published/scheduled/failed',
    publish_time        DATETIME        NOT NULL DEFAULT NULL           COMMENT '计划发布时间',
    published_at        DATETIME        NOT NULL DEFAULT NULL           COMMENT '实际发布时间',
    vehicle_id          INTEGER         NOT NULL DEFAULT 0             COMMENT '关联车辆ID',
    ai_generated        TINYINT         NOT NULL DEFAULT 0             COMMENT '是否AI生成: 1=是, 0=否',
    ai_prompt           TEXT            NOT NULL DEFAULT ''            COMMENT 'AI生成提示词',
    topic               VARCHAR(100)    NOT NULL DEFAULT ''            COMMENT '内容主题',
    tags                TEXT            NOT NULL DEFAULT '[]'          COMMENT '标签JSON数组',
    cover_image         VARCHAR(500)    NOT NULL DEFAULT ''            COMMENT '封面图URL',
    video_url           VARCHAR(500)    NOT NULL DEFAULT ''            COMMENT '视频URL(如有)',
    views_count         INT             NOT NULL DEFAULT 0             COMMENT '总浏览量',
    likes_count         INT             NOT NULL DEFAULT 0             COMMENT '总点赞量',
    comments_count      INT             NOT NULL DEFAULT 0             COMMENT '总评论量',
    shares_count        INT             NOT NULL DEFAULT 0             COMMENT '总分享量',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- 索引
CREATE INDEX idx_content_status ON content_posts(status);
CREATE INDEX idx_content_vehicle_id ON content_posts(vehicle_id);
CREATE INDEX idx_content_publish_time ON content_posts(publish_time);
```

**platforms_json 示例:**

```json
["douyin", "wechat", "xiaohongshu"]
```

**platform_post_ids_json 示例:**

```json
{
    "douyin": "7234567890123456789",
    "wechat": "wx_article_20260711_001",
    "xiaohongshu": "xhs_note_20260711_001"
}
```

---

## 8. ER关系总览

```
users (1) ──────< members (1)
  │
  ├──< vehicle_favorites >── vehicles
  ├──< vehicle_views     >── vehicles
  ├──< ai_recommendations >── vehicles
  ├──< ai_chat_logs
  ├──< orders >── vehicles
  ├──< activity_registrations >── activities
  └──< commissions >── vehicles, orders

vehicles (1) ──────< ai_evaluations
vehicles (1) ──────< content_posts

orders (1) ──────< transactions
```

---

# 第二部分: API接口文档

## 通用约定

### 请求格式

- Content-Type: `application/json`
- 认证方式: Bearer Token (Authorization: `Bearer <token>`)
- 分页参数: `page` (从1开始), `size` (默认20, 最大100)

### 响应格式

```json
{
    "code": 200,
    "message": "success",
    "data": { ... },
    "timestamp": 1752230400000
}
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权(未登录或Token过期) |
| 403 | 无权限(角色不足) |
| 404 | 资源不存在 |
| 409 | 资源冲突(如重复收藏) |
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |

### 分页响应格式

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 156,
            "total_pages": 8
        }
    }
}
```

---

## 1. 用户认证 API

### 1.1 微信登录

**接口:** `POST /api/auth/login`

**描述:** 通过微信小程序 `wx.login()` 获取的 `code` 换取系统 Token,实现静默登录。

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信 `wx.login()` 返回的临时登录凭证 |

**请求示例:**

```json
{
    "code": "0a1B2c3D4e5F6g"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_in": 604800,
        "is_new_user": true,
        "user": {
            "id": 10086,
            "nickname": "",
            "avatar": "",
            "phone": "",
            "role": "user",
            "member_level": "BASIC",
            "member_status": "active"
        }
    }
}
```

---

### 1.2 手机号绑定

**接口:** `POST /api/auth/phone`

**描述:** 绑定用户手机号,用于短信通知和身份验证。需先登录获取Token。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| code | string | 是 | 短信验证码 |

**请求示例:**

```json
{
    "phone": "13800138000",
    "code": "123456"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "phone": "138****8000",
        "bound": true
    }
}
```

---

### 1.3 获取个人信息

**接口:** `GET /api/user/profile`

**描述:** 获取当前登录用户的详细信息,包括会员状态。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:** 无

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 10086,
        "nickname": "张先生",
        "avatar": "https://cdn.haoche.com/avatars/10086.jpg",
        "phone": "138****8000",
        "role": "user",
        "member": {
            "level": "STANDARD",
            "level_name": "标准会员",
            "expire_date": "2027-03-15",
            "status": "active",
            "auto_renew": true,
            "commission_rate": 10.0
        },
        "stats": {
            "favorites_count": 12,
            "views_count": 86,
            "orders_count": 3,
            "commissions_total": 128500.00
        },
        "created_at": "2026-01-15T10:30:00Z"
    }
}
```

---

## 2. 展厅/车辆 API

### 2.1 车辆列表

**接口:** `GET /api/vehicles`

**描述:** 分页获取展厅车辆列表,支持多维度筛选与排序。

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量(最大100) |
| brand | string | 否 | - | 品牌筛选,如 `Porsche` |
| vehicle_type | string | 否 | - | 车辆类型: `sedan/suv/coupe/convertible/super_car` |
| sort | string | 否 | `created_at DESC` | 排序: `price_asc/price_desc/newest/ai_score` |
| price_min | decimal | 否 | - | 最低价格(元) |
| price_max | decimal | 否 | - | 最高价格(元) |
| keyword | string | 否 | - | 关键词搜索(品牌/车型) |
| status | string | 否 | `in_stock` | 车辆状态 |

**请求示例:**

```
GET /api/vehicles?page=1&size=10&brand=Porsche&sort=price_desc&price_min=1000000
```

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "brand": "Porsche",
                "model": "911 Turbo S (992)",
                "year": 2024,
                "mileage": 5200,
                "price": 2358000.00,
                "exterior_color": "GT银",
                "interior_color": "黑色真皮/红缝线",
                "engine": "3.7T H6 双涡轮增压",
                "transmission": "8速PDK双离合",
                "vehicle_type": "coupe",
                "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg",
                "ai_score": 92.50,
                "status": "in_stock",
                "tags": ["限量", "高保值"]
            },
            {
                "id": 2,
                "brand": "Mercedes-Benz",
                "model": "Maybach S680",
                "year": 2024,
                "mileage": 12000,
                "price": 3280000.00,
                "exterior_color": "铱银色",
                "interior_color": "爱马仕驼色/黑色",
                "engine": "6.0T V12 双涡轮增压",
                "transmission": "9速AT",
                "vehicle_type": "sedan",
                "cover_image": "https://cdn.haoche.com/vehicles/002_cover.jpg",
                "ai_score": 88.30,
                "status": "in_stock",
                "tags": ["V12", "尊享"]
            }
        ],
        "pagination": {
            "page": 1,
            "size": 10,
            "total": 35,
            "total_pages": 4
        }
    }
}
```

---

### 2.2 车辆详情

**接口:** `GET /api/vehicles/:id`

**描述:** 获取车辆完整详情,包括AI评估数据、比价信息。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "brand": "Porsche",
        "model": "911 Turbo S (992)",
        "year": 2024,
        "mileage": 5200,
        "price": 2358000.00,
        "cost_price": 2100000.00,
        "exterior_color": "GT银",
        "interior_color": "黑色真皮/红缝线",
        "engine": "3.7T H6 双涡轮增压 650马力",
        "transmission": "8速PDK双离合",
        "drive_type": "AWD",
        "vehicle_type": "coupe",
        "status": "in_stock",
        "days_in_stock": 28,
        "depreciation_monthly": 38000.00,
        "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg",
        "images": [
            "https://cdn.haoche.com/vehicles/001_01.jpg",
            "https://cdn.haoche.com/vehicles/001_02.jpg",
            "https://cdn.haoche.com/vehicles/001_03.jpg",
            "https://cdn.haoche.com/vehicles/001_04.jpg",
            "https://cdn.haoche.com/vehicles/001_05.jpg"
        ],
        "specs_json": {
            "horsepower": 650,
            "torque": 800,
            "displacement": 3.7,
            "fuel_type": "汽油",
            "acceleration": "2.7s (0-100km/h)",
            "top_speed": 330,
            "body_material": "铝合金+碳纤维",
            "wheels": "前20寸/后21寸锻造轮毂",
            "interior": "全Nappa真皮,BOSE环绕音响",
            "advanced_features": [
                "PASM主动悬挂管理系统",
                "Sport Chrono组件",
                "夜视辅助系统",
                "360度全景影像"
            ]
        },
        "ai_score": 92.50,
        "ai_evaluation": "这台992代911 Turbo S是当前市场上极具收藏价值的跑车。3.7T双涡轮H6引擎输出650马力,配合PDK变速箱实现2.7秒破百。极低里程(5200km)意味着车辆近乎全新状态。作为Porsche旗舰性能车型,保值率在同级别中名列前茅。",
        "source": "trade_in",
        "is_favorited": false,
        "view_count": 1256,
        "created_at": "2026-06-13T08:00:00Z",
        "updated_at": "2026-07-10T16:30:00Z"
    }
}
```

---

### 2.3 AI推荐列表

**接口:** `GET /api/vehicles/ai-recommend`

**描述:** 基于用户浏览历史、偏好和AI分析,返回个性化推荐车辆列表。

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| user_id | int | 否 | 当前登录用户 | 用户ID |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 10 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "vehicle_id": 5,
                "brand": "Rolls-Royce",
                "model": "Ghost Black Badge",
                "year": 2024,
                "price": 5680000.00,
                "cover_image": "https://cdn.haoche.com/vehicles/005_cover.jpg",
                "match_score": 95.20,
                "reason": "根据您的浏览偏好(超豪华轿车、V12引擎),这台Ghost Black Badge高度匹配。车辆配置为定制星空顶+劳斯莱斯 bespoke 音响,与您之前关注的幻影系列定位一致。",
                "recommendation_type": "ai_analysis"
            },
            {
                "vehicle_id": 12,
                "brand": "Bentley",
                "model": "Continental GT Speed",
                "year": 2025,
                "price": 3890000.00,
                "cover_image": "https://cdn.haoche.com/vehicles/012_cover.jpg",
                "match_score": 87.60,
                "reason": "基于您对豪华GT车型的兴趣推荐。6.0T W12引擎,极速335km/h,英伦奢华内饰手工缝制。",
                "recommendation_type": "preference"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 10,
            "total": 8,
            "total_pages": 1
        }
    }
}
```

---

### 2.4 AI评估详情

**接口:** `GET /api/vehicles/:id/ai-evaluation`

**描述:** 获取车辆的AI深度评估报告,包含车况、价格、稀缺性、保值率等多维度分析及市场比价数据。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "vehicle_id": 1,
        "vehicle_name": "Porsche 911 Turbo S (992) 2024款",
        "condition_score": 96.50,
        "price_score": 85.00,
        "rarity_score": 88.00,
        "value_retention_score": 90.20,
        "overall_score": 92.50,
        "market_trend": "rising",
        "insight_text": "## 综合评估\n\n**车况评分 96.5/100** — 车辆近乎全新状态,仅5200公里行驶里程,无明显磨损痕迹。外观漆面完好,内饰无使用痕迹。\n\n**价格合理性 85/100** — 当前售价235.8万,市场同款均价在228-245万区间,定价处于中高位。考虑到极低里程和完整配置,价格合理。\n\n**稀缺性 88/100** — 992代Turbo S在国内配额有限,GT银配色+红色缝线内饰组合相对少见。\n\n**保值率 90.2/100** — 911 Turbo S历史保值率优秀,年折损率约8-10%,远低于同价位超跑。预计12个月后残值仍可维持在210万以上。\n\n**市场趋势: 上升** — 受益于Porsche品牌力增强和超跑市场回暖,911系列二手价格近三个月稳步上升约3%。",
        "comparable_prices": [
            {
                "source": "瓜子二手车",
                "price": 2280000,
                "mileage": 8000,
                "year": 2024,
                "region": "上海"
            },
            {
                "source": "懂车帝",
                "price": 2420000,
                "mileage": 3000,
                "year": 2024,
                "region": "北京"
            },
            {
                "source": "Cars.com",
                "price": 2450000,
                "mileage": 4500,
                "year": 2024,
                "region": "深圳"
            }
        ],
        "depreciation_forecast": {
            "3_months": 2301000,
            "6_months": 2214000,
            "12_months": 2100000,
            "24_months": 1920000
        },
        "updated_at": "2026-07-10T16:30:00Z"
    }
}
```

---

### 2.5 收藏车辆

**接口:** `POST /api/vehicles/:id/favorite`

**描述:** 将车辆加入用户收藏列表。

**请求头:**

```
Authorization: Bearer <token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**请求参数:** 无 (Body可为空)

**响应示例:**

```json
{
    "code": 200,
    "message": "收藏成功",
    "data": {
        "vehicle_id": 1,
        "favorited": true,
        "favorites_count": 13
    }
}
```

---

### 2.6 取消收藏

**接口:** `DELETE /api/vehicles/:id/favorite`

**描述:** 将车辆从用户收藏列表移除。

**请求头:**

```
Authorization: Bearer <token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "已取消收藏",
    "data": {
        "vehicle_id": 1,
        "favorited": false,
        "favorites_count": 12
    }
}
```

---

### 2.7 我的收藏列表

**接口:** `GET /api/vehicles/favorites`

**描述:** 获取当前用户的车辆收藏列表。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "vehicle_id": 1,
                "brand": "Porsche",
                "model": "911 Turbo S (992)",
                "year": 2024,
                "price": 2358000.00,
                "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg",
                "status": "in_stock",
                "favorited_at": "2026-07-08T20:15:00Z"
            },
            {
                "id": 2,
                "vehicle_id": 5,
                "brand": "Rolls-Royce",
                "model": "Ghost Black Badge",
                "year": 2024,
                "price": 5680000.00,
                "cover_image": "https://cdn.haoche.com/vehicles/005_cover.jpg",
                "status": "in_stock",
                "favorited_at": "2026-07-09T14:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 12,
            "total_pages": 1
        }
    }
}
```

---

## 3. AI客服 API

### 3.1 发送消息

**接口:** `POST /api/chat/send`

**描述:** 向AI客服发送消息,支持文本和车辆上下文场景对话。AI可返回文本、车辆卡片、金融方案卡片、预约卡片等消息类型。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 用户发送的消息内容 |
| context_type | string | 否 | 对话场景: `general`(默认)/`vehicle_detail`/`finance`/`consultation` |
| vehicle_id | int | 否 | 关联车辆ID(车辆相关咨询时传入) |
| session_id | string | 否 | 会话ID(首次对话可不传,系统自动生成) |

**请求示例:**

```json
{
    "message": "这台911 Turbo S能做按揭吗?首付大概多少?",
    "context_type": "finance",
    "vehicle_id": 1,
    "session_id": "sess_20260711_abc123"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "session_id": "sess_20260711_abc123",
        "messages": [
            {
                "role": "user",
                "content": "这台911 Turbo S能做按揭吗?首付大概多少?",
                "message_type": "text",
                "created_at": "2026-07-11T10:30:00Z"
            },
            {
                "role": "assistant",
                "content": "当然可以!这台Porsche 911 Turbo S售价 **235.8万元**,我们提供灵活的金融方案:",
                "message_type": "text",
                "created_at": "2026-07-11T10:30:01Z"
            },
            {
                "role": "assistant",
                "content": "已为您生成金融方案卡片",
                "message_type": "card_finance",
                "metadata": {
                    "vehicle_id": 1,
                    "vehicle_name": "Porsche 911 Turbo S (992)",
                    "total_price": 2358000,
                    "plans": [
                        {
                            "name": "标准方案",
                            "down_payment_ratio": 0.30,
                            "down_payment": 707400,
                            "loan_amount": 1650600,
                            "term": 36,
                            "monthly_payment": 50800,
                            "interest_rate": 3.8,
                            "total_interest": 178200
                        },
                        {
                            "name": "低月供方案",
                            "down_payment_ratio": 0.20,
                            "down_payment": 471600,
                            "loan_amount": 1886400,
                            "term": 60,
                            "monthly_payment": 36200,
                            "interest_rate": 4.2,
                            "total_interest": 285600
                        }
                    ]
                },
                "created_at": "2026-07-11T10:30:02Z"
            }
        ]
    }
}
```

---

### 3.2 聊天记录

**接口:** `GET /api/chat/history`

**描述:** 获取与AI客服的历史聊天记录,支持按会话或车辆筛选。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| user_id | int | 否 | 当前用户 | 用户ID(管理员可查其他用户) |
| vehicle_id | int | 否 | - | 按车辆ID筛选 |
| session_id | string | 否 | - | 按会话ID筛选 |
| limit | int | 否 | 50 | 返回条数(最大200) |
| before | string | 否 | - | 加载此时间之前的记录 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "session_id": "sess_20260711_abc123",
        "messages": [
            {
                "id": 101,
                "role": "assistant",
                "content": "您好!我是豪车之家AI管家,请问有什么可以帮您?您可以问我关于车辆详情、价格、金融方案、预约看车等问题。",
                "message_type": "system",
                "created_at": "2026-07-11T10:25:00Z"
            },
            {
                "id": 102,
                "role": "user",
                "content": "想了解一下你们店里有没有保时捷911?",
                "message_type": "text",
                "created_at": "2026-07-11T10:25:30Z"
            },
            {
                "id": 103,
                "role": "assistant",
                "content": "为您找到了以下保时捷911车型",
                "message_type": "text",
                "created_at": "2026-07-11T10:25:31Z"
            },
            {
                "id": 104,
                "role": "assistant",
                "content": "已为您推荐车辆",
                "message_type": "card_product",
                "metadata": {
                    "vehicle_id": 1,
                    "brand": "Porsche",
                    "model": "911 Turbo S (992)",
                    "price": 2358000,
                    "mileage": 5200,
                    "year": 2024,
                    "ai_score": 92.50,
                    "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg"
                },
                "created_at": "2026-07-11T10:25:32Z"
            }
        ],
        "has_more": true
    }
}
```

---

### 3.3 AI自动标签

**接口:** `GET /api/chat/tags`

**描述:** 基于用户与AI的交互历史,自动生成用户画像标签(如预算区间、品牌偏好、购车意向等)。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| user_id | int | 否 | 当前用户 | 用户ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "user_id": 10086,
        "tags": {
            "budget_range": "200万-500万",
            "preferred_brands": ["Porsche", "Rolls-Royce", "Mercedes-Benz"],
            "preferred_types": ["coupe", "sedan"],
            "purchase_intent": "high",
            "interest_vehicles": ["911 Turbo S", "Ghost Black Badge"],
            "price_sensitivity": "low",
            "decision_speed": "medium",
            "communication_style": "professional",
            "last_active": "2026-07-11T10:30:00Z"
        },
        "updated_at": "2026-07-11T10:30:05Z"
    }
}
```

---

## 4. 会员管理 API

### 4.1 会员列表 (管理员)

**接口:** `GET /api/members/list`

**描述:** 获取平台会员列表,支持按等级和关键词筛选。需要管理员权限。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| level | string | 否 | - | 会员等级筛选 |
| keyword | string | 否 | - | 搜索昵称/手机号 |
| status | string | 否 | - | 状态筛选: `active/expired` |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "user_id": 10086,
                "nickname": "张先生",
                "phone": "138****8000",
                "avatar": "https://cdn.haoche.com/avatars/10086.jpg",
                "level": "STANDARD",
                "level_name": "标准会员",
                "expire_date": "2027-03-15",
                "status": "active",
                "auto_renew": true,
                "commissions_total": 128500.00,
                "referrals_count": 5,
                "created_at": "2026-03-15T10:00:00Z"
            },
            {
                "id": 2,
                "user_id": 10023,
                "nickname": "李女士",
                "phone": "139****6789",
                "avatar": "https://cdn.haoche.com/avatars/10023.jpg",
                "level": "PREMIUM",
                "level_name": "至尊会员",
                "expire_date": "2027-01-20",
                "status": "active",
                "auto_renew": true,
                "commissions_total": 356000.00,
                "referrals_count": 12,
                "created_at": "2025-07-20T14:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 156,
            "total_pages": 8
        }
    }
}
```

---

### 4.2 会员详情

**接口:** `GET /api/members/:id`

**描述:** 获取单个会员的详细信息,包括权益使用情况、佣金记录等。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 会员ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "user_id": 10086,
        "nickname": "张先生",
        "phone": "138****8000",
        "avatar": "https://cdn.haoche.com/avatars/10086.jpg",
        "level": "STANDARD",
        "level_name": "标准会员",
        "expire_date": "2027-03-15",
        "status": "active",
        "auto_renew": true,
        "commission_rate": 10.0,
        "features": ["AI智能推荐", "专属顾问", "优先看车", "佣金分成10%", "库存查看"],
        "stats": {
            "favorites_count": 12,
            "views_count": 86,
            "ai_chats_count": 34,
            "commissions_total": 128500.00,
            "commissions_pending": 38500.00,
            "commissions_settled": 90000.00,
            "referrals_count": 5,
            "referrals_converted": 3
        },
        "recent_commissions": [
            {
                "id": 15,
                "vehicle_name": "Mercedes-AMG GT 63 S",
                "buyer_name": "王总",
                "amount": 28500.00,
                "status": "settled",
                "created_at": "2026-07-05T16:00:00Z"
            }
        ],
        "created_at": "2026-03-15T10:00:00Z"
    }
}
```

---

### 4.3 新增会员 (管理员)

**接口:** `POST /api/members`

**描述:** 管理员手动创建或升级会员记录。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | int | 是 | 用户ID |
| level | string | 是 | 会员等级: `BASIC`/`STANDARD`/`PREMIUM` |
| expire_date | string | 否 | 到期日期(默认1年后) |
| auto_renew | bool | 否 | 是否自动续费 |

**请求示例:**

```json
{
    "user_id": 10050,
    "level": "STANDARD",
    "expire_date": "2027-07-11",
    "auto_renew": true
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "会员创建成功",
    "data": {
        "id": 23,
        "user_id": 10050,
        "level": "STANDARD",
        "expire_date": "2027-07-11",
        "status": "active",
        "auto_renew": true
    }
}
```

---

### 4.4 更新会员

**接口:** `PUT /api/members/:id`

**描述:** 更新会员信息,如等级变更、续费等。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 会员ID |

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| level | string | 否 | 新的会员等级 |
| expire_date | string | 否 | 新的到期日期 |
| auto_renew | bool | 否 | 自动续费设置 |
| status | string | 否 | 状态变更 |

**请求示例:**

```json
{
    "level": "PREMIUM",
    "expire_date": "2027-07-11"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "会员信息更新成功",
    "data": {
        "id": 1,
        "level": "PREMIUM",
        "level_name": "至尊会员",
        "expire_date": "2027-07-11",
        "status": "active"
    }
}
```

---

### 4.5 检查会员状态

**接口:** `GET /api/membership/check`

**描述:** 检查当前用户的会员状态和权益信息。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:** 无

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "is_member": true,
        "level": "STANDARD",
        "level_name": "标准会员",
        "expire_date": "2027-03-15",
        "remaining_days": 246,
        "status": "active",
        "auto_renew": true,
        "features": [
            "AI智能推荐",
            "专属顾问",
            "优先看车",
            "佣金分成10%",
            "库存查看"
        ],
        "upgrade_options": [
            {
                "target_level": "PREMIUM",
                "target_level_name": "至尊会员",
                "price_yearly": 19800,
                "prorated_price": 11200,
                "additional_features": ["深度AI评估", "私人管家", "佣金分成15%", "高端活动优先", "数据看板"]
            }
        ]
    }
}
```

---

## 5. 库存管理 API

### 5.1 库存列表

**接口:** `GET /api/inventory/list`

**描述:** 获取库存车辆列表,支持状态筛选和排序。管理员和STANDARD以上会员可访问。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 状态: `in_stock/reserved/sold` |
| brand | string | 否 | - | 品牌筛选 |
| sort | string | 否 | `created_at DESC` | 排序: `price_asc/price_desc/days_asc/days_desc/ai_score` |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "brand": "Porsche",
                "model": "911 Turbo S (992)",
                "year": 2024,
                "price": 2358000.00,
                "cost_price": 2100000.00,
                "profit": 258000.00,
                "status": "in_stock",
                "days_in_stock": 28,
                "depreciation_monthly": 38000.00,
                "total_depreciation": 35500.00,
                "ai_score": 92.50,
                "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg",
                "source": "trade_in",
                "updated_at": "2026-07-10T16:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 45,
            "total_pages": 3
        }
    }
}
```

---

### 5.2 库存统计

**接口:** `GET /api/inventory/stats`

**描述:** 获取库存整体统计数据,包括总价值、在售数量、贬值总额等。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:** 无

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "overview": {
            "total_vehicles": 45,
            "in_stock_count": 38,
            "reserved_count": 4,
            "sold_count": 3,
            "total_value": 98560000.00,
            "total_cost": 88200000.00,
            "total_profit": 10360000.00
        },
        "depreciation": {
            "total_monthly_depreciation": 1580000.00,
            "avg_depreciation_rate": 1.6,
            "highest_depreciation_vehicle": {
                "id": 18,
                "brand": "Maserati",
                "model": "MC20",
                "depreciation_monthly": 85000.00
            }
        },
        "by_brand": [
            {
                "brand": "Porsche",
                "count": 12,
                "total_value": 35600000.00,
                "avg_price": 2966666.67
            },
            {
                "brand": "Mercedes-Benz",
                "count": 8,
                "total_value": 22400000.00,
                "avg_price": 2800000.00
            },
            {
                "brand": "Rolls-Royce",
                "count": 5,
                "total_value": 28500000.00,
                "avg_price": 5700000.00
            }
        ],
        "by_type": [
            {
                "type": "sedan",
                "count": 20,
                "total_value": 52000000.00
            },
            {
                "type": "suv",
                "count": 15,
                "total_value": 28500000.00
            },
            {
                "type": "coupe",
                "count": 7,
                "total_value": 15600000.00
            },
            {
                "type": "super_car",
                "count": 3,
                "total_value": 2460000.00
            }
        ],
        "alerts": [
            {
                "type": "overstock",
                "vehicle_id": 22,
                "brand": "BMW",
                "model": "760Li",
                "days_in_stock": 92,
                "message": "BMW 760Li已入库92天,建议调价促销"
            }
        ]
    }
}
```

---

### 5.3 新增车辆 (管理员)

**接口:** `POST /api/inventory`

**描述:** 管理员新增车辆入库。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| brand | string | 是 | 品牌 |
| model | string | 是 | 车型 |
| year | int | 是 | 年款 |
| mileage | int | 是 | 里程(公里) |
| price | decimal | 是 | 售价(元) |
| cost_price | decimal | 否 | 成本价 |
| exterior_color | string | 否 | 外观颜色 |
| interior_color | string | 否 | 内饰颜色 |
| engine | string | 否 | 发动机 |
| transmission | string | 否 | 变速箱 |
| drive_type | string | 否 | 驱动方式 |
| vehicle_type | string | 否 | 车辆类型 |
| source | string | 否 | 来源 |
| source_owner_id | int | 否 | 来源会员ID |
| cover_image | string | 否 | 封面图 |
| images | array | 否 | 图片列表 |
| specs_json | object | 否 | 详细参数 |

**请求示例:**

```json
{
    "brand": "Lamborghini",
    "model": "Huracán EVO",
    "year": 2024,
    "mileage": 3200,
    "price": 3280000.00,
    "cost_price": 2950000.00,
    "exterior_color": "Verde Mantis (荧光绿)",
    "interior_color": "黑色Alcantara/绿色缝线",
    "engine": "5.2L V10 自然吸气 640马力",
    "transmission": "7速LDF双离合",
    "drive_type": "AWD",
    "vehicle_type": "super_car",
    "source": "trade_in",
    "cover_image": "https://cdn.haoche.com/vehicles/new_001_cover.jpg",
    "images": [
        "https://cdn.haoche.com/vehicles/new_001_01.jpg",
        "https://cdn.haoche.com/vehicles/new_001_02.jpg"
    ]
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "车辆入库成功",
    "data": {
        "id": 46,
        "brand": "Lamborghini",
        "model": "Huracán EVO",
        "status": "in_stock",
        "created_at": "2026-07-11T11:00:00Z"
    }
}
```

---

### 5.4 更新车辆信息 (管理员)

**接口:** `PUT /api/inventory/:id`

**描述:** 更新车辆基本信息。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**请求参数:** 与新增接口相同,所有字段均可选,仅传入需要更新的字段。

**请求示例:**

```json
{
    "mileage": 5400,
    "price": 2280000.00
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "车辆信息更新成功",
    "data": {
        "id": 1,
        "updated_fields": ["mileage", "price"]
    }
}
```

---

### 5.5 调整价格 (管理员)

**接口:** `PUT /api/inventory/:id/price`

**描述:** 专门用于调整车辆售价,记录调价原因和审批流程。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| new_price | decimal | 是 | 新售价(元) |
| reason | string | 否 | 调价原因 |

**请求示例:**

```json
{
    "new_price": 2280000.00,
    "reason": "入库超30天,加速去化"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "调价成功",
    "data": {
        "vehicle_id": 1,
        "old_price": 2358000.00,
        "new_price": 2280000.00,
        "adjustment": -78000.00,
        "reason": "入库超30天,加速去化",
        "updated_at": "2026-07-11T11:15:00Z"
    }
}
```

---

### 5.6 贬值预测

**接口:** `GET /api/inventory/:id/depreciation`

**描述:** 获取指定车辆的AI贬值预测曲线数据。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 车辆ID |

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| months | int | 否 | 12 | 预测月数(最大36) |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "vehicle_id": 1,
        "vehicle_name": "Porsche 911 Turbo S (992)",
        "current_price": 2358000.00,
        "monthly_depreciation": 38000.00,
        "depreciation_rate_monthly": 1.61,
        "market_trend": "rising",
        "forecast": [
            {
                "month": 1,
                "date": "2026-08-11",
                "estimated_price": 2320000.00,
                "depreciation": 38000.00,
                "confidence": 0.92
            },
            {
                "month": 3,
                "date": "2026-10-11",
                "estimated_price": 2244000.00,
                "depreciation": 114000.00,
                "confidence": 0.85
            },
            {
                "month": 6,
                "date": "2027-01-11",
                "estimated_price": 2130000.00,
                "depreciation": 228000.00,
                "confidence": 0.78
            },
            {
                "month": 12,
                "date": "2027-07-11",
                "estimated_price": 1902000.00,
                "depreciation": 456000.00,
                "confidence": 0.65
            }
        ],
        "recommendation": "建议在3个月内成交以获得最佳利润空间。当前市场趋势为上升,可适当维持价格。"
    }
}
```

---

## 6. 订单与支付 API

### 6.1 创建订单

**接口:** `POST /api/orders/create`

**描述:** 创建订单,支持购车、会员购买、课程、活动等类型。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 订单类型: `purchase/membership/course/event` |
| vehicle_id | int | 否 | 车辆ID(购车订单必填) |
| membership_level | string | 否 | 会员等级(会员订单必填) |
| activity_id | int | 否 | 活动ID(活动订单必填) |
| remark | string | 否 | 备注 |

**请求示例(购车订单):**

```json
{
    "type": "purchase",
    "vehicle_id": 1,
    "remark": "需要办理按揭,首付30%"
}
```

**请求示例(会员订单):**

```json
{
    "type": "membership",
    "membership_level": "STANDARD"
}
```

**响应示例(购车订单):**

```json
{
    "code": 200,
    "message": "订单创建成功",
    "data": {
        "order_id": 101,
        "order_no": "HC20260711000001",
        "type": "purchase",
        "title": "购买 Porsche 911 Turbo S (992)",
        "amount": 2358000.00,
        "discount_amount": 0.00,
        "pay_amount": 2358000.00,
        "status": "pending",
        "expire_at": "2026-07-11T19:00:00Z",
        "created_at": "2026-07-11T11:30:00Z"
    }
}
```

**响应示例(会员订单):**

```json
{
    "code": 200,
    "message": "订单创建成功",
    "data": {
        "order_id": 102,
        "order_no": "HC20260711000002",
        "type": "membership",
        "title": "升级至标准会员",
        "amount": 9800.00,
        "discount_amount": 0.00,
        "pay_amount": 9800.00,
        "status": "pending",
        "expire_at": "2026-07-11T19:00:00Z",
        "created_at": "2026-07-11T11:31:00Z"
    }
}
```

---

### 6.2 发起支付

**接口:** `POST /api/orders/:id/pay`

**描述:** 对已创建的订单发起微信支付,返回支付参数。

**请求头:**

```
Authorization: Bearer <token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 订单ID |

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| payment_method | string | 是 | 支付方式: `wechat/alipay/bank_transfer` |

**请求示例:**

```json
{
    "payment_method": "wechat"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "order_id": 102,
        "order_no": "HC20260711000002",
        "pay_amount": 9800.00,
        "payment": {
            "provider": "wechat",
            "timestamp": "20260711113100",
            "nonce_str": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
            "package": "prepay_id=wx11y7saasdfasdfasdfasdfasdf0",
            "sign_type": "RSA",
            "pay_sign": "oR9d8PuhnIc+YZ8cBJ9j7yQPt...."
        }
    }
}
```

---

### 6.3 订单列表

**接口:** `GET /api/orders`

**描述:** 获取当前用户的订单列表。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| type | string | 否 | - | 订单类型筛选 |
| status | string | 否 | - | 状态筛选 |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 102,
                "order_no": "HC20260711000002",
                "type": "membership",
                "title": "升级至标准会员",
                "amount": 9800.00,
                "pay_amount": 9800.00,
                "status": "paid",
                "payment_method": "wechat",
                "paid_at": "2026-07-11T11:32:15Z",
                "created_at": "2026-07-11T11:31:00Z"
            },
            {
                "id": 98,
                "order_no": "HC20260705000015",
                "type": "event",
                "title": "2026超跑品鉴之夜",
                "amount": 0.00,
                "pay_amount": 0.00,
                "status": "completed",
                "created_at": "2026-07-05T09:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 5,
            "total_pages": 1
        }
    }
}
```

---

### 6.4 订单详情

**接口:** `GET /api/orders/:id`

**描述:** 获取订单详细信息。

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 订单ID |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 101,
        "order_no": "HC20260711000001",
        "type": "purchase",
        "title": "购买 Porsche 911 Turbo S (992)",
        "vehicle": {
            "id": 1,
            "brand": "Porsche",
            "model": "911 Turbo S (992)",
            "year": 2024,
            "price": 2358000.00,
            "cover_image": "https://cdn.haoche.com/vehicles/001_cover.jpg"
        },
        "amount": 2358000.00,
        "discount_amount": 0.00,
        "pay_amount": 2358000.00,
        "status": "pending",
        "payment_method": "",
        "remark": "需要办理按揭,首付30%",
        "expire_at": "2026-07-11T19:00:00Z",
        "transactions": [],
        "created_at": "2026-07-11T11:30:00Z",
        "updated_at": "2026-07-11T11:30:00Z"
    }
}
```

---

## 7. 佣金管理 API

### 7.1 佣金列表

**接口:** `GET /api/commissions/list`

**描述:** 获取佣金记录列表,支持按状态筛选。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 状态: `pending/settled/cancelled` |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 15,
                "member_id": 1,
                "member_name": "张先生",
                "vehicle_id": 8,
                "vehicle_name": "Mercedes-AMG GT 63 S",
                "order_id": 95,
                "buyer_name": "王总",
                "sale_amount": 2850000.00,
                "rate": 10.0,
                "amount": 28500.00,
                "status": "settled",
                "settled_at": "2026-07-05T18:00:00Z",
                "created_at": "2026-07-05T16:00:00Z"
            },
            {
                "id": 16,
                "member_id": 2,
                "member_name": "李女士",
                "vehicle_id": 12,
                "vehicle_name": "Bentley Continental GT Speed",
                "order_id": 99,
                "buyer_name": "赵总",
                "sale_amount": 3890000.00,
                "rate": 15.0,
                "amount": 58350.00,
                "status": "pending",
                "settled_at": null,
                "created_at": "2026-07-10T14:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 23,
            "total_pages": 2
        },
        "summary": {
            "total_amount": 485000.00,
            "pending_amount": 142000.00,
            "settled_amount": 343000.00
        }
    }
}
```

---

### 7.2 创建佣金记录

**接口:** `POST /api/commissions`

**描述:** 车辆成交后创建佣金记录,自动关联推荐会员。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| member_id | int | 是 | 推荐会员ID |
| vehicle_id | int | 是 | 成交车辆ID |
| order_id | int | 是 | 关联订单ID |
| buyer_name | string | 否 | 买家姓名 |
| amount | decimal | 否 | 佣金金额(不传则自动计算) |
| rate | decimal | 否 | 佣金比例(不传则取会员等级默认比例) |

**请求示例:**

```json
{
    "member_id": 1,
    "vehicle_id": 8,
    "order_id": 95,
    "buyer_name": "王总"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "佣金记录创建成功",
    "data": {
        "id": 15,
        "member_id": 1,
        "vehicle_id": 8,
        "order_id": 95,
        "buyer_name": "王总",
        "sale_amount": 2850000.00,
        "rate": 10.0,
        "amount": 28500.00,
        "status": "pending",
        "created_at": "2026-07-05T16:00:00Z"
    }
}
```

---

### 7.3 确认结算

**接口:** `PUT /api/commissions/:id/settle`

**描述:** 管理员确认佣金结算。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 佣金记录ID |

**请求参数:** 无 (Body可为空)

**响应示例:**

```json
{
    "code": 200,
    "message": "佣金结算成功",
    "data": {
        "id": 16,
        "amount": 58350.00,
        "status": "settled",
        "settled_at": "2026-07-11T14:30:00Z"
    }
}
```

---

## 8. 活动管理 API

### 8.1 活动列表

**接口:** `GET /api/activities`

**描述:** 获取平台活动列表。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 状态筛选: `upcoming/ongoing/ended` |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 10 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "title": "2026超跑品鉴之夜",
                "description": "齐聚顶级超跑,感受速度与奢华的极致碰撞。特邀F1冠军车手现场分享赛道经验,限量50席。",
                "start_time": "2026-07-20T18:30:00Z",
                "end_time": "2026-07-20T22:00:00Z",
                "location": "上海外滩半岛酒店 宴会厅",
                "max_participants": 50,
                "current_count": 38,
                "status": "upcoming",
                "cover_image": "https://cdn.haoche.com/activities/001_cover.jpg",
                "level_requirement": "STANDARD",
                "fee": 0.00,
                "organizer": "豪车之家",
                "is_registered": false
            },
            {
                "id": 2,
                "title": "劳斯莱斯Bespoke定制体验日",
                "description": "深入体验劳斯莱斯Bespoke高级定制服务,与世界级工匠面对面交流个性化定制方案。",
                "start_time": "2026-08-05T10:00:00Z",
                "end_time": "2026-08-05T17:00:00Z",
                "location": "北京劳斯莱斯中心 三里屯",
                "max_participants": 20,
                "current_count": 12,
                "status": "upcoming",
                "cover_image": "https://cdn.haoche.com/activities/002_cover.jpg",
                "level_requirement": "PREMIUM",
                "fee": 0.00,
                "organizer": "豪车之家 x Rolls-Royce",
                "is_registered": true
            }
        ],
        "pagination": {
            "page": 1,
            "size": 10,
            "total": 6,
            "total_pages": 1
        }
    }
}
```

---

### 8.2 活动报名

**接口:** `POST /api/activities/:id/register`

**描述:** 用户报名参加活动,系统自动检查会员等级是否满足要求。

**请求头:**

```
Authorization: Bearer <token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 活动ID |

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| note | string | 否 | 报名备注 |

**请求示例:**

```json
{
    "note": "希望试驾Ghost Black Badge"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "报名成功",
    "data": {
        "registration_id": 25,
        "activity_id": 1,
        "activity_title": "2026超跑品鉴之夜",
        "status": "registered",
        "registered_at": "2026-07-11T12:00:00Z",
        "current_count": 39,
        "remaining_slots": 11
    }
}
```

**错误响应示例(等级不足):**

```json
{
    "code": 403,
    "message": "该活动仅限PREMIUM会员参加",
    "data": {
        "required_level": "PREMIUM",
        "current_level": "BASIC",
        "upgrade_link": "/pages/membership/upgrade"
    }
}
```

---

### 8.3 我的活动

**接口:** `GET /api/activities/my`

**描述:** 获取当前用户已报名的活动列表。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 报名状态: `registered/checked_in/cancelled` |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "registration_id": 25,
                "activity_id": 1,
                "title": "2026超跑品鉴之夜",
                "start_time": "2026-07-20T18:30:00Z",
                "location": "上海外滩半岛酒店 宴会厅",
                "cover_image": "https://cdn.haoche.com/activities/001_cover.jpg",
                "registration_status": "registered",
                "registered_at": "2026-07-11T12:00:00Z",
                "activity_status": "upcoming"
            },
            {
                "registration_id": 18,
                "activity_id": 3,
                "title": "AMG驾驶学院体验日",
                "start_time": "2026-06-28T09:00:00Z",
                "location": "上海国际赛车场",
                "cover_image": "https://cdn.haoche.com/activities/003_cover.jpg",
                "registration_status": "checked_in",
                "registered_at": "2026-06-20T15:00:00Z",
                "activity_status": "ended"
            }
        ]
    }
}
```

---

## 9. 数据分析 API

### 9.1 概览KPI

**接口:** `GET /api/analytics/overview`

**描述:** 获取平台核心KPI数据,包括总曝光量、线索数、成交量、GMV等。需要管理员权限。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| period | string | 否 | `month` | 统计周期: `today/week/month/quarter/year` |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "period": "month",
        "period_label": "2026年7月",
        "kpis": {
            "total_exposure": 1285600,
            "total_exposure_delta": 18.5,
            "total_views": 85600,
            "total_views_delta": 12.3,
            "total_leads": 425,
            "total_leads_delta": 8.2,
            "total_conversions": 12,
            "total_conversions_delta": -7.7,
            "total_gmv": 35680000.00,
            "total_gmv_delta": 22.1,
            "avg_deal_price": 2973333.00,
            "conversion_rate": 2.82,
            "conversion_rate_delta": -0.3
        },
        "inventory_metrics": {
            "total_vehicles": 45,
            "avg_days_in_stock": 32,
            "total_depreciation": 1580000.00,
            "turnover_rate": 26.7
        },
        "membership_metrics": {
            "total_members": 156,
            "new_members_this_period": 18,
            "premium_count": 23,
            "standard_count": 68,
            "basic_count": 65,
            "revenue": 528000.00
        },
        "commission_metrics": {
            "total_commissions": 485000.00,
            "pending_commissions": 142000.00,
            "settled_commissions": 343000.00
        }
    }
}
```

---

### 9.2 流量趋势

**接口:** `GET /api/analytics/traffic`

**描述:** 获取平台流量趋势数据,支持按日期范围和平台维度筛选。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| start_date | string | 否 | 30天前 | 开始日期 (YYYY-MM-DD) |
| end_date | string | 否 | 今天 | 结束日期 (YYYY-MM-DD) |
| platform | string | 否 | - | 平台筛选: `mini_program/official_account/total` |
| granularity | string | 否 | `day` | 粒度: `hour/day/week` |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "start_date": "2026-06-11",
        "end_date": "2026-07-11",
        "granularity": "day",
        "series": [
            {
                "date": "2026-07-01",
                "page_views": 42500,
                "unique_visitors": 8900,
                "new_users": 320,
                "avg_session_duration": 285,
                "bounce_rate": 32.5
            },
            {
                "date": "2026-07-02",
                "page_views": 38200,
                "unique_visitors": 8100,
                "new_users": 280,
                "avg_session_duration": 276,
                "bounce_rate": 34.1
            }
        ],
        "summary": {
            "total_page_views": 1285600,
            "total_unique_visitors": 256000,
            "total_new_users": 8500,
            "avg_session_duration": 292,
            "avg_bounce_rate": 33.2
        },
        "top_pages": [
            {
                "page": "/pages/showroom/index",
                "views": 456000,
                "title": "展厅首页"
            },
            {
                "page": "/pages/car-detail/index",
                "views": 312000,
                "title": "车辆详情"
            },
            {
                "page": "/pages/ai-chat/index",
                "views": 198000,
                "title": "AI客服"
            }
        ]
    }
}
```

---

### 9.3 高净值客户画像

**接口:** `GET /api/analytics/customers`

**描述:** 获取高净值客户群体画像分析数据,用于精准运营决策。需要管理员权限。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数:** 无

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total_high_net_worth": 86,
        "demographics": {
            "age_distribution": {
                "25-35": 28,
                "36-45": 42,
                "46-55": 12,
                "55+": 4
            },
            "gender_ratio": {
                "male": 78,
                "female": 22
            },
            "top_cities": [
                {"city": "上海", "count": 28, "percentage": 32.6},
                {"city": "北京", "count": 22, "percentage": 25.6},
                {"city": "深圳", "count": 15, "percentage": 17.4},
                {"city": "杭州", "count": 10, "percentage": 11.6},
                {"city": "成都", "count": 6, "percentage": 7.0}
            ]
        },
        "preferences": {
            "top_brands": [
                {"brand": "Porsche", "count": 35, "percentage": 40.7},
                {"brand": "Mercedes-Benz", "count": 22, "percentage": 25.6},
                {"brand": "Rolls-Royce", "count": 12, "percentage": 14.0},
                {"brand": "Bentley", "count": 10, "percentage": 11.6},
                {"brand": "Lamborghini", "count": 7, "percentage": 8.1}
            ],
            "price_range_distribution": [
                {"range": "100-300万", "count": 38, "percentage": 44.2},
                {"range": "300-500万", "count": 28, "percentage": 32.6},
                {"range": "500-1000万", "count": 15, "percentage": 17.4},
                {"range": "1000万以上", "count": 5, "percentage": 5.8}
            ],
            "avg_budget": 3580000.00,
            "avg_decision_days": 14.5
        },
        "behavior": {
            "avg_views_before_purchase": 8.6,
            "avg_ai_interactions": 12.3,
            "peak_active_hours": ["10:00-12:00", "20:00-23:00"],
            "avg_session_duration": 420,
            "wechat_share_rate": 35.2
        },
        "segmentation": [
            {
                "segment": "超高净值(VIP)",
                "description": "单次消费500万以上,年消费2次以上",
                "count": 12,
                "avg_lifetime_value": 8500000.00,
                "retention_rate": 95.0
            },
            {
                "segment": "高净值(核心)",
                "description": "单次消费200-500万,年消费1-2次",
                "count": 35,
                "avg_lifetime_value": 3200000.00,
                "retention_rate": 82.0
            },
            {
                "segment": "新贵(潜力)",
                "description": "首次购车,预算100-300万",
                "count": 39,
                "avg_lifetime_value": 1800000.00,
                "retention_rate": 65.0
            }
        ]
    }
}
```

---

### 9.4 库存健康度

**接口:** `GET /api/analytics/inventory-health`

**描述:** 获取库存健康度分析,包括滞销预警、品牌分布、周转率等。需要管理员权限。

**请求头:**

```
Authorization: Bearer <admin_token>
```

**请求参数:** 无

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "health_score": 78.5,
        "health_level": "good",
        "health_levels": {
            "excellent": "90-100分",
            "good": "70-89分",
            "warning": "50-69分",
            "danger": "0-49分"
        },
        "metrics": {
            "avg_days_in_stock": 32,
            "target_days_in_stock": 45,
            "turnover_rate": 26.7,
            "target_turnover_rate": 30.0,
            "total_depreciation_loss": 1580000.00,
            "depreciation_ratio": 1.6
        },
        "alerts": [
            {
                "level": "warning",
                "vehicle_id": 22,
                "brand": "BMW",
                "model": "760Li",
                "days_in_stock": 92,
                "depreciation_loss": 128800.00,
                "suggestion": "建议降价8-10%加速去化,或通过AI推荐匹配潜在买家"
            },
            {
                "level": "danger",
                "vehicle_id": 31,
                "brand": "Audi",
                "model": "RS7 Sportback",
                "days_in_stock": 105,
                "depreciation_loss": 189000.00,
                "suggestion": "已严重超期,建议立即调价15%以上或考虑批发处理"
            }
        ],
        "fast_movers": [
            {
                "vehicle_id": 1,
                "brand": "Porsche",
                "model": "911 Turbo S",
                "views_count": 1256,
                "favorites_count": 45,
                "inquiries_count": 28,
                "days_in_stock": 28
            },
            {
                "vehicle_id": 5,
                "brand": "Rolls-Royce",
                "model": "Ghost Black Badge",
                "views_count": 2180,
                "favorites_count": 68,
                "inquiries_count": 35,
                "days_in_stock": 15
            }
        ],
        "brand_health": [
            {
                "brand": "Porsche",
                "count": 12,
                "avg_days": 22,
                "turnover_rate": 45.0,
                "health": "excellent"
            },
            {
                "brand": "Mercedes-Benz",
                "count": 8,
                "avg_days": 30,
                "turnover_rate": 33.3,
                "health": "good"
            },
            {
                "brand": "Rolls-Royce",
                "count": 5,
                "avg_days": 38,
                "turnover_rate": 31.6,
                "health": "good"
            },
            {
                "brand": "BMW",
                "count": 6,
                "avg_days": 65,
                "turnover_rate": 18.5,
                "health": "warning"
            }
        ]
    }
}
```

---

## 10. 内容发布 API

### 10.1 AI生成内容

**接口:** `POST /api/content/generate`

**描述:** 调用AI为指定车辆生成营销内容,支持同时为多个社交平台生成不同风格的内容。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| vehicle_id | int | 是 | 车辆ID |
| topic | string | 否 | 内容主题(如"新品首发"、"限时优惠"),不传则AI自动生成 |
| platforms | array | 否 | 目标平台: `["douyin","wechat","xiaohongshu"]`,默认全部 |
| style | string | 否 | 风格: `professional/lifestyle/emotional/storytelling` |
| keywords | array | 否 | 关键词列表,如 `["V12","手工定制","极致奢华"]` |

**请求示例:**

```json
{
    "vehicle_id": 1,
    "topic": "911 Turbo S: 钢铁猛兽的优雅力量",
    "platforms": ["douyin", "wechat", "xiaohongshu"],
    "style": "emotional",
    "keywords": ["911 Turbo S", "650马力", "2.7秒破百", "收藏级"]
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "内容生成成功",
    "data": {
        "content_id": 15,
        "title": "911 Turbo S: 钢铁猛兽的优雅力量",
        "status": "generating",
        "vehicle_id": 1,
        "vehicle_name": "Porsche 911 Turbo S (992)",
        "generated_content": {
            "douyin": {
                "title": "2.7秒破百!这台保时捷911 Turbo S让人窒息",
                "content": "当3.7T双涡轮H6引擎爆发出650匹马力,你会明白什么叫一骑绝尘。这台992代911 Turbo S,仅行驶5200公里,GT银外观配黑色真皮红缝线内饰,每一处细节都在诉说着Porsche对极致的追求。展厅实车,预约品鉴\n\n#保时捷 #911TurboS #超跑 #豪车推荐 #SpeedDemon",
                "hashtags": ["保时捷", "911TurboS", "超跑", "豪车推荐", "SpeedDemon"],
                "suggested_music": "热血激昂BGM推荐",
                "duration": "60秒视频脚本"
            },
            "wechat": {
                "title": "经典永不过时: Porsche 911 Turbo S 深度品鉴",
                "content": "## 从赛道到公路,不变的是那颗躁动的心\n\n保时捷911,一个写满传奇的名字。而Turbo S,则是这个传奇中最锋利的那把剑。\n\n**动力总成**\n3.7升水平对置六缸双涡轮增压发动机,最大功率650马力,峰值扭矩800N·m。配合8速PDK双离合变速箱,0-100km/h仅需2.7秒——这个数字背后,是Porsche数十年的工程积淀。\n\n**设计美学**\n992代911 Turbo S的外观设计完美融合了空气动力学与经典比例。GT银色漆面在不同光线下呈现出微妙的色泽变化,犹如液态金属流动于车身之上。宽体翼子板、主动式尾翼、中置双出排气,每一处都彰显着性能基因。\n\n**内饰工艺**\n打开车门,黑色Nappa真皮包裹的座舱扑面而来的质感让人沉醉。红色缝线贯穿方向盘、座椅和中控台,这是Porsche Racing精神的视觉表达。Burmester环绕音响系统则为日常驾驶带来了音乐厅般的听觉享受。\n\n**市场价值**\n作为Porsche旗舰性能车型,911 Turbo S的保值率远超同级别超跑。当前这台仅行驶5200公里的准新车,状态近乎出厂,是收藏与驾驶的完美选择。\n\n> 展厅地址: 上海市静安区南京西路1788号\n> 预约品鉴: 点击下方「立即咨询」",
                "word_count": 520,
                "cover_suggestion": "使用车辆侧面45度动态拍摄图"
            },
            "xiaohongshu": {
                "title": "2.7秒破百的浪漫 | 保时捷911 Turbo S实拍",
                "content": "OMG家人们谁懂啊!今天在豪车之家展厅看到这台保时捷911 Turbo S,我真的走不动路了!\n\n首先说外观: GT银色漆面真的绝了,阳光下那个质感,像流动的液态金属,高级感拉满!\n\n然后是动力: 3.7T H6双涡轮650马力,0-100只要2.7秒!推背感想象一下就知道有多上头!\n\n内饰也是没得说,全Nappa真皮+红色缝线,坐进去就有一种赛道王的既视感\n\n重点是: 这台车才跑了5200公里!相当于准新车状态!\n\n想去试驾的姐妹们冲鸭!\n\n#保时捷911 #豪车日常 #上海看车 #超跑女孩 #TurboS #保时捷车主 #汽车博主 #保时捷911TurboS",
                "image_count": 6,
                "image_suggestions": [
                    "正面45度外观",
                    "内饰全景(驾驶位视角)",
                    "方向盘细节(红色缝线)",
                    "中控台+排挡杆",
                    "车尾(尾翼展开状态)",
                    "侧面流线全身照"
                ]
            }
        },
        "created_at": "2026-07-11T14:00:00Z"
    }
}
```

---

### 10.2 内容列表

**接口:** `GET /api/content/list`

**描述:** 获取已生成/已发布的内容列表。

**请求头:**

```
Authorization: Bearer <token>
```

**请求参数 (Query String):**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 状态: `draft/generating/published/scheduled/failed` |
| page | int | 否 | 1 | 页码 |
| size | int | 否 | 20 | 每页数量 |

**响应示例:**

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 15,
                "title": "911 Turbo S: 钢铁猛兽的优雅力量",
                "vehicle_name": "Porsche 911 Turbo S (992)",
                "platforms": ["douyin", "wechat", "xiaohongshu"],
                "status": "published",
                "publish_time": "2026-07-11T18:00:00Z",
                "views_count": 12500,
                "likes_count": 890,
                "ai_generated": true,
                "created_at": "2026-07-11T14:00:00Z"
            },
            {
                "id": 14,
                "title": "Mercedes-Maybach S680: 尊贵不张扬的奢华",
                "vehicle_name": "Mercedes-Maybach S680",
                "platforms": ["wechat", "xiaohongshu"],
                "status": "scheduled",
                "publish_time": "2026-07-12T10:00:00Z",
                "views_count": 0,
                "likes_count": 0,
                "ai_generated": true,
                "created_at": "2026-07-10T16:00:00Z"
            },
            {
                "id": 13,
                "title": "Rolls-Royce Ghost Black Badge: 暗夜君王",
                "vehicle_name": "Rolls-Royce Ghost Black Badge",
                "platforms": ["douyin", "wechat", "xiaohongshu"],
                "status": "published",
                "publish_time": "2026-07-09T20:00:00Z",
                "views_count": 45000,
                "likes_count": 3200,
                "ai_generated": true,
                "created_at": "2026-07-09T15:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 28,
            "total_pages": 2
        }
    }
}
```

---

### 10.3 发布到平台

**接口:** `POST /api/content/:id/publish`

**描述:** 将已生成的内容发布到指定社交平台,调用各平台API完成实际发布。

**请求头:**

```
Authorization: Bearer <token>
```

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | int | 内容ID |

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platforms | array | 否 | 指定发布平台(不传则发布到全部已配置平台) |
| publish_time | string | 否 | 定时发布时间(ISO 8601格式),不传则立即发布 |
| cover_image | string | 否 | 覆盖封面图URL |

**请求示例(立即发布):**

```json
{
    "platforms": ["wechat", "xiaohongshu"]
}
```

**请求示例(定时发布):**

```json
{
    "platforms": ["douyin", "wechat", "xiaohongshu"],
    "publish_time": "2026-07-12T10:00:00Z"
}
```

**响应示例:**

```json
{
    "code": 200,
    "message": "发布任务已提交",
    "data": {
        "content_id": 15,
        "title": "911 Turbo S: 钢铁猛兽的优雅力量",
        "status": "published",
        "publish_results": [
            {
                "platform": "wechat",
                "status": "success",
                "post_id": "wx_article_20260711_002",
                "url": "https://mp.weixin.qq.com/s/xxxxx"
            },
            {
                "platform": "xiaohongshu",
                "status": "success",
                "post_id": "xhs_note_20260711_003",
                "url": "https://www.xiaohongshu.com/explore/xxxxx"
            }
        ],
        "published_at": "2026-07-11T18:00:00Z"
    }
}
```

---

# 附录

## A. 数据库建表执行顺序

由于存在外键约束,建议按以下顺序执行建表语句:

1. `users` — 无外键依赖
2. `level_pricing` — 无外键依赖
3. `vehicles` — 无外键依赖
4. `members` — 依赖 `users`
5. `vehicle_favorites` — 依赖 `users`, `vehicles`
6. `vehicle_views` — 依赖 `users`, `vehicles`
7. `ai_recommendations` — 依赖 `users`, `vehicles`
8. `ai_chat_logs` — 依赖 `users`
9. `ai_evaluations` — 依赖 `vehicles`
10. `orders` — 依赖 `users`, `vehicles`
11. `transactions` — 依赖 `orders`
12. `activities` — 无外键依赖
13. `activity_registrations` — 依赖 `activities`, `users`
14. `commissions` — 依赖 `members`, `vehicles`, `orders`
15. `content_posts` — 依赖 `vehicles`

## B. MySQL适配说明

将上述SQL迁移至MySQL时需做以下调整:

- `INTEGER PRIMARY KEY AUTOINCREMENT` 改为 `BIGINT PRIMARY KEY AUTO_INCREMENT`
- `DATETIME DEFAULT CURRENT_TIMESTAMP` 改为 `DATETIME DEFAULT CURRENT_TIMESTAMP` (MySQL 5.6.5+ 兼容)
- `TEXT` 类型存储JSON的字段改为 `JSON` 原生类型 (MySQL 5.7.8+)
- 外键约束语法一致,但需确保引用表先创建
- 字符集在表级指定: `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`

## C. 微信小程序登录流程

```
1. 小程序端调用 wx.login() 获取 code
2. 将 code 发送到 POST /api/auth/login
3. 服务端使用 code 调用微信接口换取 openid + session_key
4. 查询或创建用户记录
5. 生成 JWT Token 返回小程序端
6. 小程序端存储 Token,后续请求携带 Authorization: Bearer <token>
```

## D. 佣金计算规则

| 会员等级 | 佣金比例 | 计算公式 |
|----------|----------|----------|
| BASIC | 0% | 无佣金资格 |
| STANDARD | 10% | 佣金 = 成交金额 x 10% |
| PREMIUM | 15% | 佣金 = 成交金额 x 15% |

佣金结算流程:
1. 车辆成交并确认收款
2. 系统自动创建佣金记录 (status: pending)
3. 管理员审核后调用结算接口
4. 佣金转入会员账户 (status: settled)

---

> 文档结束
> 豪车之家技术开发团队 | 版本 v1.0.0 | 2026-07-11
