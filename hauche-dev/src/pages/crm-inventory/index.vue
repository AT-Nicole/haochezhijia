<template>
  <view class="page">

    <!-- Custom Nav Bar -->
    <view class="nav-bar">
      <view class="nav-back" @tap="handleBack">
        <text class="icon-chevron-left">&lt;</text>
      </view>
      <text class="nav-title">库存台账</text>
      <view class="nav-action" @tap="handleFilter">
        <text class="icon-filter">&#9776;</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-area" :enhanced="true" :show-scrollbar="false">

      <!-- Summary Bar -->
      <view class="summary-bar">
        <view class="stat-box">
          <text class="stat-value gold">23</text>
          <text class="stat-label">在售车辆</text>
        </view>
        <view class="stat-box">
          <text class="stat-value green">5</text>
          <text class="stat-label">已售出</text>
        </view>
        <view class="stat-box">
          <text class="stat-value gold">¥820万</text>
          <text class="stat-label">库存总值</text>
          <text class="stat-sub red">-¥12万贬值</text>
        </view>
      </view>

      <!-- Filter / Sort Row -->
      <scroll-view scroll-x class="filter-row" :enhanced="true" :show-scrollbar="false">
        <view
          v-for="(tab, idx) in filterTabs"
          :key="idx"
          :class="['pill-btn', { active: activeTab === idx }]"
          @tap="activeTab = idx"
        >
          <text>{{ tab }}</text>
        </view>
        <view class="sort-btn" @tap="handleSort">
          <text>贬值最多</text>
          <text class="sort-arrow">▾</text>
        </view>
      </scroll-view>

      <!-- Inventory Cards -->
      <view class="inventory-list">

        <!-- Card 1: 迈巴赫 S480 -->
        <view class="car-card">
          <view class="car-image-placeholder">
            <text class="car-icon">🚗</text>
            <view class="status-badge on-sale">
              <text>在售</text>
            </view>
          </view>
          <view class="car-card-body">
            <text class="car-title">迈巴赫 S480</text>
            <text class="car-meta">2024款 | 0.8万公里</text>
            <view class="car-pricing">
              <view class="pricing-item">
                <text class="pricing-label">收购价</text>
                <text class="pricing-value secondary">¥158万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">在售价</text>
                <text class="pricing-value primary-gold">¥168万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">利润</text>
                <text class="pricing-value profit-green">+¥10万</text>
              </view>
            </view>
            <view class="car-indicators">
              <view class="indicator">
                <view class="dot red" />
                <text class="ind-text">库龄</text>
                <text class="badge-days warning">92天</text>
              </view>
              <view class="indicator">
                <view class="dot red" />
                <text class="ind-text">月贬值</text>
                <text class="ind-value red">¥8万</text>
              </view>
            </view>
            <view class="car-tags">
              <text class="car-tag">S级</text>
              <text class="car-tag">黑色</text>
              <text class="car-tag">四驱</text>
            </view>
          </view>
        </view>

        <!-- Card 2: 保时捷 911 Turbo S -->
        <view class="car-card">
          <view class="car-image-placeholder">
            <text class="car-icon">🚗</text>
            <view class="status-badge on-sale">
              <text>在售</text>
            </view>
          </view>
          <view class="car-card-body">
            <text class="car-title">保时捷 911 Turbo S</text>
            <text class="car-meta">2024款 | 0.3万公里</text>
            <view class="car-pricing">
              <view class="pricing-item">
                <text class="pricing-label">收购价</text>
                <text class="pricing-value secondary">¥228万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">在售价</text>
                <text class="pricing-value primary-gold">¥258万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">利润</text>
                <text class="pricing-value profit-green">+¥30万</text>
              </view>
            </view>
            <view class="car-indicators">
              <view class="indicator">
                <view class="dot green" />
                <text class="ind-text">库龄</text>
                <text class="badge-days good">28天</text>
              </view>
              <view class="indicator">
                <view class="dot red" />
                <text class="ind-text">月贬值</text>
                <text class="ind-value red">¥12万</text>
              </view>
            </view>
            <view class="car-tags">
              <text class="car-tag">跑车</text>
              <text class="car-tag">白色</text>
              <text class="car-tag">PDK</text>
            </view>
          </view>
        </view>

        <!-- Card 3: 宝马 740Li (已预定) -->
        <view class="car-card">
          <view class="car-image-placeholder">
            <text class="car-icon">🚗</text>
            <view class="status-badge presold">
              <text>已预定</text>
            </view>
          </view>
          <view class="car-card-body">
            <text class="car-title">宝马 740Li</text>
            <text class="car-meta">2023款 | 2.1万公里</text>
            <view class="car-pricing">
              <view class="pricing-item">
                <text class="pricing-label">收购价</text>
                <text class="pricing-value secondary">¥68万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">成交价</text>
                <text class="pricing-value primary-gold">¥72万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">利润</text>
                <text class="pricing-value profit-green">+¥4万</text>
              </view>
            </view>
            <view class="buyer-info">
              <text class="buyer-label">买家:</text>
              <text class="buyer-name">张先生</text>
            </view>
          </view>
        </view>

        <!-- Card 4: 奔驰 G63 AMG -->
        <view class="car-card">
          <view class="car-image-placeholder">
            <text class="car-icon">🚗</text>
            <view class="status-badge on-sale">
              <text>在售</text>
            </view>
          </view>
          <view class="car-card-body">
            <text class="car-title">奔驰 G63 AMG</text>
            <text class="car-meta">2024款 | 0.5万公里</text>
            <view class="car-pricing">
              <view class="pricing-item">
                <text class="pricing-label">收购价</text>
                <text class="pricing-value secondary">¥198万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">在售价</text>
                <text class="pricing-value primary-gold">¥228万</text>
              </view>
              <view class="pricing-item">
                <text class="pricing-label">利润</text>
                <text class="pricing-value profit-green">+¥30万</text>
              </view>
            </view>
            <view class="car-indicators">
              <view class="indicator">
                <view class="dot green" />
                <text class="ind-text">库龄</text>
                <text class="badge-days good">15天</text>
              </view>
            </view>
            <view class="car-tags">
              <text class="car-tag">SUV</text>
              <text class="car-tag">白色</text>
              <text class="car-tag">AMG</text>
            </view>
          </view>
        </view>

      </view>
      <!-- bottom spacer -->
      <view style="height: 40rpx;" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const activeTab = ref(0)
const filterTabs = ['全部', '在售', '已预定', '已售出']

const handleBack = () => {
  Taro.navigateBack({ delta: 1 })
}

const handleFilter = () => {
  Taro.showToast({ title: '筛选', icon: 'none' })
}

const handleSort = () => {
  Taro.showToast({ title: '排序: 贬值最多', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

$font-mono: 'JetBrains Mono', 'Menlo', 'Consolas', monospace;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $color-background;
}

/* === Nav Bar === */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background-color: $color-background;
  border-bottom: 1px solid rgba(200, 164, 92, 0.4);
  flex-shrink: 0;
}

.nav-back,
.nav-action {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-chevron-left {
  font-size: 36rpx;
  color: $color-text-primary;
  font-weight: bold;
}

.icon-filter {
  font-size: 32rpx;
  color: $color-text-secondary;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: 0.04em;
}

/* === Scroll Area === */
.scroll-area {
  flex: 1;
  height: 0;
}

/* === Summary Bar === */
.summary-bar {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
}

.stat-box {
  flex-shrink: 0;
  background-color: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: 20rpx 24rpx;
  min-width: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 700;
  font-family: $font-mono;
  line-height: 1.2;
  &.gold { color: $color-primary; }
  &.green { color: $color-success; }
}

.stat-label {
  font-size: 22rpx;
  color: $color-text-secondary;
  margin-top: 4rpx;
}

.stat-sub {
  font-size: 22rpx;
  margin-top: 4rpx;
  font-family: $font-mono;
  &.red { color: $color-error; }
}

/* === Filter / Sort === */
.filter-row {
  display: flex;
  align-items: center;
  padding: 12rpx 32rpx;
  gap: 12rpx;
  white-space: nowrap;
}

.pill-btn {
  flex-shrink: 0;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 500;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-secondary;
  &.active {
    background: rgba(200, 164, 92, 0.1);
    border-color: $color-primary;
    color: $color-primary;
  }
}

.sort-btn {
  flex-shrink: 0;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: $color-surface;
  color: $color-text-secondary;
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-left: auto;
}

.sort-arrow {
  font-size: 22rpx;
}

/* === Inventory List === */
.inventory-list {
  padding: 16rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* === Car Card === */
.car-card {
  background-color: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
}

.car-image-placeholder {
  width: 100%;
  height: 280rpx;
  background: linear-gradient(135deg, $color-surface-elevated 0%, $color-surface 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid $color-border;
}

.car-icon {
  font-size: 72rpx;
  opacity: 0.3;
}

.status-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  &.on-sale {
    background: rgba(52, 211, 153, 0.1);
    color: $color-success;
  }
  &.presold {
    background: rgba(200, 164, 92, 0.1);
    color: $color-primary;
  }
}

.car-card-body {
  padding: 24rpx;
}

.car-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: 4rpx;
  display: block;
}

.car-meta {
  font-size: 26rpx;
  color: $color-text-secondary;
  margin-bottom: 20rpx;
  display: block;
}

/* Pricing Grid */
.car-pricing {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
  margin-bottom: 20rpx;
}

.pricing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.pricing-label {
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-bottom: 4rpx;
}

.pricing-value {
  font-size: 28rpx;
  font-weight: 600;
  font-family: $font-mono;
  &.primary-gold { color: $color-primary; }
  &.secondary { color: $color-text-secondary; }
  &.profit-green { color: $color-success; }
}

/* Indicators */
.car-indicators {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
}

.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  &.green { background-color: $color-success; }
  &.red { background-color: $color-error; }
  &.warning { background-color: $color-warning; }
}

.ind-text {
  color: $color-text-secondary;
  font-size: 24rpx;
}

.ind-value {
  font-weight: 600;
  font-family: $font-mono;
  &.green { color: $color-success; }
  &.red { color: $color-error; }
  &.warning { color: $color-warning; }
}

.badge-days {
  display: inline-flex;
  align-items: center;
  padding: 2rpx 12rpx;
  border-radius: $radius-sm;
  font-size: 22rpx;
  font-weight: 600;
  font-family: $font-mono;
  &.warning {
    background: rgba(251, 191, 36, 0.1);
    color: $color-warning;
  }
  &.good {
    background: rgba(52, 211, 153, 0.1);
    color: $color-success;
  }
}

/* Tags */
.car-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.car-tag {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  background: $color-surface-elevated;
  color: $color-text-secondary;
  border: 1px solid $color-border;
}

/* Buyer Info */
.buyer-info {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1px solid $color-border;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.buyer-label {
  font-size: 22rpx;
  color: $color-text-tertiary;
}

.buyer-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $color-primary;
}
</style>
