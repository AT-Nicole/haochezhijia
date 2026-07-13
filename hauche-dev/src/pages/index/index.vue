<template>
  <ScrollView scroll-y class="page">
    <!-- App Header -->
    <View class="app-header">
      <Text class="header-title">豪车之家</Text>
      <View class="header-actions" @tap="onNotification">
        <Text class="bell-icon">🔔</Text>
        <View class="notification-dot" />
      </View>
    </View>
    <View class="gold-separator" />

    <!-- Welcome Section -->
    <View class="section">
      <Text class="greeting">豪哥，下午好</Text>
      <Text class="greeting-sub">今日新增 2 位会员，3 辆车入库</Text>

      <!-- Stat Cards -->
      <View class="stats-row">
        <View class="stat-card">
          <Text class="stat-value">128</Text>
          <Text class="stat-label">车友会员</Text>
        </View>
        <View class="stat-card">
          <Text class="stat-value">23</Text>
          <Text class="stat-label">在售车辆</Text>
        </View>
        <View class="stat-card">
          <Text class="stat-value">¥86万</Text>
          <Text class="stat-label">本月成交</Text>
        </View>
      </View>
    </View>

    <!-- Quick Actions -->
    <View class="section">
      <View class="section-heading">
        <Text class="section-title">快捷操作</Text>
      </View>
      <View class="actions-grid">
        <View class="action-item" v-for="action in quickActions" :key="action.label" @tap="onAction(action.label)">
          <View class="action-icon-circle" :class="action.color">
            <Text class="action-icon">{{ action.icon }}</Text>
          </View>
          <Text class="action-label">{{ action.label }}</Text>
        </View>
      </View>
    </View>

    <!-- Recent Activities -->
    <View class="section">
      <View class="section-heading">
        <Text class="section-title">近期活动</Text>
        <Text class="section-link" @tap="onViewAll">查看全部 ></Text>
      </View>
      <View class="activity-card" v-for="(act, idx) in activities" :key="idx">
        <View class="activity-title-row">
          <Text class="activity-name">{{ act.title }}</Text>
          <View class="status-badge" :class="act.badgeClass">
            <Text class="status-badge-text">{{ act.status }}</Text>
          </View>
        </View>
        <View class="activity-meta">
          <View class="meta-row">
            <Text class="meta-icon">📅</Text>
            <Text class="meta-text">{{ act.date }}</Text>
          </View>
          <View class="meta-row">
            <Text class="meta-icon">📍</Text>
            <Text class="meta-text">{{ act.location }}</Text>
          </View>
        </View>
        <View class="activity-progress">
          <View class="progress-label-row">
            <Text class="progress-label">{{ act.progressText }}</Text>
            <Text class="progress-pct">{{ act.progressPct }}%</Text>
          </View>
          <View class="progress-track">
            <View class="progress-fill" :style="{ width: act.progressPct + '%' }" />
          </View>
        </View>
      </View>
    </View>

    <!-- Pending Tasks -->
    <View class="section">
      <View class="section-heading">
        <Text class="section-title">待处理</Text>
      </View>
      <View class="card">
        <View class="task-item" v-for="(task, idx) in tasks" :key="idx" @tap="onTask(task)">
          <View class="task-dot" :style="{ backgroundColor: task.dotColor }" />
          <View class="task-content">
            <Text class="task-text" :style="{ color: task.textColor || '' }">{{ task.text }}</Text>
            <Text class="task-date">{{ task.sub }}</Text>
          </View>
          <Text class="task-arrow">›</Text>
        </View>
      </View>
    </View>

    <!-- Revenue Overview -->
    <View class="section">
      <View class="section-heading">
        <Text class="section-title">本月收入概览</Text>
      </View>
      <View class="revenue-card">
        <Text class="revenue-total">¥186,800</Text>
        <View class="revenue-rows">
          <View class="revenue-row" v-for="(row, idx) in revenueRows" :key="idx">
            <Text class="revenue-row-label">{{ row.label }}</Text>
            <Text class="revenue-row-value">{{ row.value }}</Text>
          </View>
        </View>
        <View class="revenue-chart">
          <View class="chart-row" v-for="(bar, idx) in chartBars" :key="idx">
            <Text class="chart-label">{{ bar.label }}</Text>
            <View class="chart-track">
              <View class="chart-fill" :class="bar.color" :style="{ width: bar.width }" />
            </View>
            <Text class="chart-value">{{ bar.display }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Bottom spacing for tab bar -->
    <View class="bottom-spacer" />
  </ScrollView>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// ---- Mock Data ----
const quickActions = ref([
  { icon: '👥', label: '会员管理', color: 'gold' },
  { icon: '📦', label: '库存台账', color: 'blue' },
  { icon: '📅', label: '活动报名', color: 'green' },
  { icon: '🧮', label: '佣金核算', color: 'orange' },
])

const activities = ref([
  {
    title: '高尔夫联谊赛',
    status: '报名中',
    badgeClass: 'badge-active',
    date: '7月15日 周二 14:00',
    location: '深圳观澜湖高尔夫球会',
    progressText: '已报名 18/30 人',
    progressPct: 60,
  },
  {
    title: '超跑品鉴晚宴',
    status: '报名中',
    badgeClass: 'badge-active',
    date: '7月20日 周日 19:00',
    location: '深圳柏悦酒店宴会厅',
    progressText: '已报名 8/20 人',
    progressPct: 40,
  },
  {
    title: '新车交付仪式',
    status: '已结束',
    badgeClass: 'badge-ended',
    date: '7月5日 周六 10:00',
    location: '深圳湾壹号展厅',
    progressText: '参与 15/15 人',
    progressPct: 100,
  },
])

const tasks = ref([
  {
    text: '3位会员年费即将到期',
    sub: '截止日期：7月20日',
    dotColor: '#F87171',
    textColor: '',
  },
  {
    text: '迈巴赫S480 库存超过90天',
    sub: '入库：2026年4月8日',
    dotColor: '#FBBF24',
    textColor: '#FBBF24',
  },
  {
    text: '张先生佣金结算待确认',
    sub: '金额：¥12,800',
    dotColor: '#60A5FA',
    textColor: '',
  },
])

const revenueRows = ref([
  { label: '会员费', value: '¥128,000' },
  { label: '课程收入', value: '¥38,400' },
  { label: '其他', value: '¥7,900' },
])

const chartBars = ref([
  { label: '会员费', width: '100%', display: '128K', color: 'fill-gold' },
  { label: '课程', width: '30%', display: '38.4K', color: 'fill-green' },
  { label: '其他', width: '6%', display: '7.9K', color: 'fill-blue' },
])

// ---- Event Handlers ----
const onNotification = () => Taro.navigateTo({ url: '/pages/ai-chat/index' })
const onAction = (label) => Taro.showToast({ title: label, icon: 'none' })
const onViewAll = () => Taro.showToast({ title: '查看全部活动', icon: 'none' })
const onTask = (task) => Taro.showToast({ title: task.text, icon: 'none' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page {
  height: 100vh;
  background-color: $color-background;
}

/* ---- Header ---- */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  padding: 0 32rpx;
  background-color: #111119;
  position: relative;
}
.header-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $color-text-primary;
  letter-spacing: 0.04em;
}
.header-actions {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
}
.bell-icon {
  font-size: 36rpx;
}
.notification-dot {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 14rpx;
  height: 14rpx;
  background-color: $color-error;
  border-radius: 50%;
  border: 2rpx solid #111119;
}
.gold-separator {
  height: 2rpx;
  background: linear-gradient(90deg, transparent, $color-primary, transparent);
}

/* ---- Section Common ---- */
.section {
  margin-bottom: 40rpx;
  padding: 0 32rpx;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-primary;
}
.section-link {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 500;
}

/* ---- Welcome & Stats ---- */
.greeting {
  font-size: 40rpx;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: 4rpx;
}
.greeting-sub {
  font-size: 26rpx;
  color: $color-text-secondary;
  margin-bottom: 32rpx;
}
.stats-row {
  display: flex;
  gap: 16rpx;
}
.stat-card {
  flex: 1;
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-md;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: $color-primary;
  line-height: 1.2;
}
.stat-label {
  font-size: 22rpx;
  color: $color-text-secondary;
  margin-top: 4rpx;
}

/* ---- Quick Actions ---- */
.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.action-item {
  width: calc(50% - 10rpx);
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-md;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}
.action-icon-circle {
  width: 88rpx;
  height: 88rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-icon {
  font-size: 36rpx;
}
.action-icon-circle.gold {
  background-color: rgba(200, 164, 92, 0.15);
}
.action-icon-circle.blue {
  background-color: rgba(96, 165, 250, 0.1);
}
.action-icon-circle.green {
  background-color: rgba(52, 211, 153, 0.1);
}
.action-icon-circle.orange {
  background-color: rgba(251, 191, 36, 0.1);
}
.action-label {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text-primary;
}

/* ---- Activity Cards ---- */
.activity-card {
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-md;
  padding: 24rpx 28rpx;
  margin-bottom: 16rpx;
  &:last-child { margin-bottom: 0; }
}
.activity-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.activity-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-primary;
}
.status-badge {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
}
.status-badge-text {
  font-size: 22rpx;
  font-weight: 600;
}
.badge-active {
  background-color: rgba(200, 164, 92, 0.15);
  .status-badge-text { color: $color-primary; }
}
.badge-ended {
  background-color: rgba(138, 134, 126, 0.15);
  .status-badge-text { color: $color-text-tertiary; }
}
.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 24rpx;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.meta-icon {
  font-size: 24rpx;
}
.meta-text {
  font-size: 22rpx;
  color: $color-text-secondary;
}
.activity-progress {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.progress-label-row {
  display: flex;
  justify-content: space-between;
}
.progress-label {
  font-size: 22rpx;
  color: $color-text-secondary;
}
.progress-pct {
  font-size: 22rpx;
  color: $color-text-secondary;
}
.progress-track {
  height: 8rpx;
  background-color: rgba(200, 164, 92, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #A6893F, $color-primary);
  border-radius: 4rpx;
}

/* ---- Pending Tasks ---- */
.card {
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-md;
  padding: 0 24rpx;
}
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid $color-border;
  min-height: 88rpx;
  &:last-child { border-bottom: none; }
}
.task-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 10rpx;
}
.task-content {
  flex: 1;
}
.task-text {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text-primary;
  line-height: 1.4;
}
.task-date {
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-top: 4rpx;
}
.task-arrow {
  font-size: 32rpx;
  color: $color-text-tertiary;
  flex-shrink: 0;
  margin-top: 4rpx;
}

/* ---- Revenue Overview ---- */
.revenue-card {
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-md;
  padding: 28rpx;
}
.revenue-total {
  font-size: 56rpx;
  font-weight: 700;
  color: $color-primary;
  text-align: center;
  margin-bottom: 24rpx;
}
.revenue-rows {
  margin-bottom: 24rpx;
}
.revenue-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 2rpx solid $color-border;
  &:last-child { border-bottom: none; }
}
.revenue-row-label {
  font-size: 28rpx;
  color: $color-text-secondary;
}
.revenue-row-value {
  font-size: 28rpx;
  color: $color-text-primary;
  font-weight: 600;
}
.revenue-chart {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.chart-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.chart-label {
  width: 80rpx;
  font-size: 22rpx;
  color: $color-text-secondary;
  text-align: right;
  flex-shrink: 0;
}
.chart-track {
  flex: 1;
  height: 16rpx;
  background-color: rgba(200, 164, 92, 0.08);
  border-radius: 8rpx;
  overflow: hidden;
}
.chart-fill {
  height: 100%;
  border-radius: 8rpx;
}
.fill-gold {
  background: linear-gradient(90deg, #A6893F, $color-primary);
}
.fill-green {
  background: linear-gradient(90deg, rgba(52, 211, 153, 0.7), $color-success);
}
.fill-blue {
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.7), #60A5FA);
}
.chart-value {
  width: 80rpx;
  font-size: 22rpx;
  color: $color-text-tertiary;
  flex-shrink: 0;
}

/* ---- Bottom Spacer ---- */
.bottom-spacer {
  height: 160rpx;
}
</style>
