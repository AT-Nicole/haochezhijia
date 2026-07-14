<template>
  <View class="page">
    <!-- Welcome Header -->
    <View class="header">
      <View class="header-row">
        <Text class="header-title">尊享服务</Text>
        <View class="tier-badge">
          <Text class="tier-badge-text">黑金卡</Text>
        </View>
      </View>
      <Text class="header-subtitle">欢迎回来，尊贵的黑金卡会员</Text>
    </View>

    <!-- Stats Row -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">28</Text>
        <Text class="stat-label">服务次数</Text>
      </View>
      <View class="stat-divider" />
      <View class="stat-card">
        <Text class="stat-value">¥12.5万</Text>
        <Text class="stat-label">本月消费</Text>
      </View>
      <View class="stat-divider" />
      <View class="stat-card">
        <Text class="stat-value">8,600</Text>
        <Text class="stat-label">积分</Text>
      </View>
    </View>

    <!-- Quick Entry Grid -->
    <View class="section">
      <Text class="section-title">快捷服务</Text>
      <View class="grid">
        <View class="grid-item" v-for="(item, idx) in quickEntries" :key="idx">
          <Text class="grid-icon">{{ item.icon }}</Text>
          <Text class="grid-label">{{ item.label }}</Text>
        </View>
      </View>
    </View>

    <!-- Recent Services -->
    <View class="section">
      <Text class="section-title">最近服务</Text>
      <View class="service-list">
        <View class="service-item" v-for="(item, idx) in recentServices" :key="idx">
          <View class="service-info">
            <Text class="service-name">{{ item.name }}</Text>
            <Text class="service-date">{{ item.date }}</Text>
          </View>
          <View :class="['service-tag', item.statusClass]">
            <Text class="service-tag-text">{{ item.status }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Alert Card -->
    <View class="ai-card">
      <View class="ai-card-header">
        <Text class="ai-icon">🤖</Text>
        <Text class="ai-card-title">AI管家提醒</Text>
      </View>
      <Text class="ai-card-content">您的迈巴赫S480年检将于8月15日到期，建议尽快安排代办年检服务。</Text>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const quickEntries = ref([
  { icon: '🤵', label: '专属管家' },
  { icon: '📋', label: '代办年检' },
  { icon: '🛡️', label: '保险理赔' },
  { icon: '🚨', label: '道路救援' },
  { icon: '✈️', label: '机场接送' },
  { icon: '🏨', label: '酒店预订' },
  { icon: '🏌️', label: '球会预约' },
  { icon: '🔧', label: '维修保养' }
])

const recentServices = ref([
  { name: '迈巴赫S480常规保养', date: '2026-07-08', status: '已完成', statusClass: 'tag-done' },
  { name: '机场贵宾接送服务', date: '2026-07-05', status: '已完成', statusClass: 'tag-done' },
  { name: '代办车辆年检', date: '2026-07-10', status: '进行中', statusClass: 'tag-progress' }
])
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  min-height: 100vh;
  background-color: #FAFAFA;
  padding: 24rpx 32rpx;
}

.header {
  margin-bottom: 32rpx;
}

.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.header-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #181818;
  margin-right: 16rpx;
}

.tier-badge {
  background-color: #181818;
  border-radius: 4px;
  padding: 4rpx 16rpx;
}

.tier-badge-text {
  font-size: 22rpx;
  color: #E8B800;
  font-weight: 500;
}

.header-subtitle {
  font-size: 26rpx;
  color: #666666;
}

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 32rpx 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #DA291C;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #8F8F8F;
}

.stat-divider {
  width: 1px;
  height: 64rpx;
  background-color: #CCCCCC;
}

/* Section */
.section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #181818;
  margin-bottom: 20rpx;
}

/* Grid */
.grid {
  display: flex;
  flex-wrap: wrap;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 16rpx 0;
}

.grid-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
}

.grid-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.grid-label {
  font-size: 24rpx;
  color: #181818;
}

/* Service List */
.service-list {
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  overflow: hidden;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1px solid #CCCCCC;
}

.service-item:last-child {
  border-bottom: none;
}

.service-info {
  display: flex;
  flex-direction: column;
}

.service-name {
  font-size: 28rpx;
  color: #181818;
  margin-bottom: 6rpx;
}

.service-date {
  font-size: 22rpx;
  color: #8F8F8F;
}

.service-tag {
  border-radius: 4px;
  padding: 4rpx 16rpx;
  border: 1px solid #CCCCCC;
}

.tag-done {
  background-color: #FAFAFA;
}

.tag-done .service-tag-text {
  color: #666666;
}

.tag-progress {
  background-color: #FFF8F0;
  border-color: #E8B800;
}

.tag-progress .service-tag-text {
  color: #E8B800;
}

.service-tag-text {
  font-size: 22rpx;
}

/* AI Card */
.ai-card {
  background-color: #FFFFFF;
  border: 1px solid #DA291C;
  border-radius: 8px;
  padding: 28rpx 32rpx;
  margin-bottom: 32rpx;
}

.ai-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.ai-icon {
  font-size: 36rpx;
  margin-right: 12rpx;
}

.ai-card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #DA291C;
}

.ai-card-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}
</style>
