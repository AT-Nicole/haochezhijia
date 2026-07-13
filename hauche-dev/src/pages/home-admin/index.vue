<template>
  <View class="page">
    <!-- Header -->
    <View class="header">
      <Text class="header-title">管理后台</Text>
      <Text class="header-date">2026-07-13</Text>
    </View>

    <!-- Key Metrics -->
    <View class="stats-grid">
      <View class="stat-card">
        <Text class="stat-label">注册用户</Text>
        <Text class="stat-value">2,386</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-label">今日活跃</Text>
        <Text class="stat-value">156</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-label">月成交额</Text>
        <Text class="stat-value">¥1,280万</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-label">平台收入</Text>
        <Text class="stat-value">¥38.6万</Text>
      </View>
    </View>

    <!-- Daily Active Trend -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">本月日活趋势</Text>
        <Text class="section-link">详情 ></Text>
      </View>
      <View class="chart-card">
        <View class="chart-labels">
          <Text class="chart-label">30天前</Text>
          <Text class="chart-label">今天</Text>
        </View>
        <View class="chart-bars">
          <View
            class="bar"
            v-for="(val, idx) in dailyActive"
            :key="idx"
            :style="{ height: val + '%' }"
          />
        </View>
      </View>
    </View>

    <!-- Quick Nav -->
    <View class="section">
      <Text class="section-header">快捷导航</Text>
      <View class="nav-grid">
        <View class="nav-btn" @tap="goTo('/pages/admin-users/index')">
          <View class="nav-icon-wrap" style="background:rgba(218,41,28,0.06)">
            <Text class="nav-icon">👥</Text>
          </View>
          <Text class="nav-label">用户管理</Text>
        </View>
        <View class="nav-btn" @tap="goTo('/pages/admin-car-review/index')">
          <View class="nav-icon-wrap" style="background:rgba(232,184,0,0.08)">
            <Text class="nav-icon">🚗</Text>
          </View>
          <Text class="nav-label">车辆审核</Text>
        </View>
        <View class="nav-btn" @tap="goTo('/pages/admin-orders/index')">
          <View class="nav-icon-wrap" style="background:rgba(76,152,185,0.06)">
            <Text class="nav-icon">📋</Text>
          </View>
          <Text class="nav-label">订单管理</Text>
        </View>
        <View class="nav-btn" @tap="goTo('/pages/admin-finance/index')">
          <View class="nav-icon-wrap" style="background:rgba(3,144,74,0.06)">
            <Text class="nav-icon">💰</Text>
          </View>
          <Text class="nav-label">财务报表</Text>
        </View>
        <View class="nav-btn" @tap="goTo('/pages/admin-content-review/index')">
          <View class="nav-icon-wrap" style="background:rgba(218,41,28,0.04)">
            <Text class="nav-icon">📑</Text>
          </View>
          <Text class="nav-label">内容审核</Text>
        </View>
        <View class="nav-btn" @tap="goTo('/pages/admin-settings/index')">
          <View class="nav-icon-wrap" style="background:rgba(0,0,0,0.04)">
            <Text class="nav-icon">⚙️</Text>
          </View>
          <Text class="nav-label">系统设置</Text>
        </View>
      </View>
    </View>

    <!-- Recent Alerts -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">系统告警</Text>
        <Text class="section-link">全部 ></Text>
      </View>
      <View class="alert-list">
        <View class="alert-item" v-for="alert in alerts" :key="alert.text">
          <View class="alert-dot" :class="alert.level" />
          <Text class="alert-text">{{ alert.text }}</Text>
          <Text class="alert-time">{{ alert.time }}</Text>
        </View>
      </View>
    </View>

    <!-- Bottom spacer -->
    <View style="height: 120rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// Simulated 30-day daily active data (percentage heights for bars)
const dailyActive = ref([
  40, 45, 42, 50, 55, 48, 38, 52, 58, 62,
  60, 55, 68, 72, 65, 70, 78, 75, 80, 72,
  85, 78, 82, 88, 90, 85, 92, 88, 95, 100
])

const alerts = ref([
  { text: '3条车辆信息待审核超过24小时', time: '10分钟前', level: 'high' },
  { text: '本月新增用户增长放缓，环比下降8%', time: '1小时前', level: 'medium' },
  { text: '数据库备份已完成', time: '3小时前', level: 'low' }
])

const goTo = (url) => {
  Taro.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page {
  min-height: 100vh;
  background: $color-background;
  padding-bottom: 120rpx;
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
}
.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: $color-text-primary;
}
.header-date {
  font-size: 24rpx;
  color: $color-text-tertiary;
  font-weight: 500;
}

// Stats Grid (2x2)
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 0 32rpx 32rpx;
}
.stat-card {
  width: calc(50% - 8rpx);
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
  margin-top: 8rpx;
}
.stat-label {
  font-size: 22rpx;
  color: $color-text-tertiary;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Section
.section {
  padding: 0 32rpx;
  margin-bottom: 40rpx;
}
.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.section-link {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 500;
}

// Bar Chart
.chart-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
}
.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.chart-label {
  font-size: 20rpx;
  color: $color-text-tertiary;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
  height: 160rpx;
}
.bar {
  flex: 1;
  background: $color-primary;
  border-radius: $radius-xs 2rpx 0 0;
  min-height: 8rpx;
  transition: height 0.3s;
}

// Quick Nav (3x2)
.nav-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.nav-btn {
  width: calc(33.33% - 14rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 0;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
}
.nav-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-icon {
  font-size: 32rpx;
}
.nav-label {
  font-size: 22rpx;
  color: $color-text-secondary;
  font-weight: 500;
}

// Alerts
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
}
.alert-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  border-bottom: 1rpx solid $color-divider;
  &:last-child {
    border-bottom: none;
  }
}
.alert-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: $radius-full;
  flex-shrink: 0;
  &.high { background: $color-error; }
  &.medium { background: $color-warning; }
  &.low { background: $color-success; }
}
.alert-text {
  flex: 1;
  font-size: 24rpx;
  color: $color-text-primary;
  line-height: 1.4;
}
.alert-time {
  font-size: 20rpx;
  color: $color-text-tertiary;
  flex-shrink: 0;
}
</style>
