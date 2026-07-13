<template>
  <View class="page">
    <!-- Header -->
    <View class="header">
      <Text class="header-title">创作中心</Text>
      <View class="bell-wrap" @tap="onNotification">
        <Text class="bell">🔔</Text>
        <View class="bell-dot" />
      </View>
    </View>

    <!-- Stats Cards -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">42</Text>
        <Text class="stat-label">内容发布</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">12,800</Text>
        <Text class="stat-label">粉丝</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">¥8,600</Text>
        <Text class="stat-label">本月收入</Text>
      </View>
    </View>

    <!-- Quick Actions -->
    <View class="section">
      <Text class="section-header">快捷操作</Text>
      <View class="action-grid">
        <View class="action-btn" @tap="goTo('/pages/publish-article/index')">
          <View class="action-icon-wrap" style="background:rgba(218,41,28,0.06)">
            <Text class="action-icon">📝</Text>
          </View>
          <Text class="action-label">发布图文</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/record-video/index')">
          <View class="action-icon-wrap" style="background:rgba(232,184,0,0.08)">
            <Text class="action-icon">🎬</Text>
          </View>
          <Text class="action-label">录制视频</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/ai-create/index')">
          <View class="action-icon-wrap" style="background:rgba(76,152,185,0.06)">
            <Text class="action-icon">🤖</Text>
          </View>
          <Text class="action-label">AI辅助创作</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/data-analysis/index')">
          <View class="action-icon-wrap" style="background:rgba(3,144,74,0.06)">
            <Text class="action-icon">📊</Text>
          </View>
          <Text class="action-label">数据分析</Text>
        </View>
      </View>
    </View>

    <!-- Content Performance -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">内容表现</Text>
        <Text class="section-link">全部 ></Text>
      </View>
      <View class="content-list">
        <View class="content-item" v-for="item in contents" :key="item.title">
          <View class="content-info">
            <Text class="content-title">{{ item.title }}</Text>
            <Text class="content-date">{{ item.date }}</Text>
          </View>
          <View class="content-metrics">
            <View class="metric">
              <Text class="metric-num">{{ item.views }}</Text>
              <Text class="metric-label">阅读</Text>
            </View>
            <View class="metric">
              <Text class="metric-num">{{ item.likes }}</Text>
              <Text class="metric-label">点赞</Text>
            </View>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Suggestion -->
    <View class="section">
      <View class="ai-card">
        <View class="ai-card-header">
          <Text class="ai-icon">🤖</Text>
          <Text class="ai-label">AI建议</Text>
        </View>
        <Text class="ai-text">本周豪车评测内容热度上升，建议发布相关内容</Text>
      </View>
    </View>

    <!-- Primary Button -->
    <View class="section publish-section">
      <View class="btn-primary" @tap="onPublish">
        <Text class="btn-primary-text">+ 发布新内容</Text>
      </View>
    </View>

    <!-- Bottom spacer -->
    <View style="height: 120rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const contents = ref([
  { title: '2024款法拉利Roma Spider深度评测', views: '3.2万', likes: '1,280', date: '07-12' },
  { title: '劳斯莱斯幻影 vs 宾利飞驰 对比体验', views: '2.8万', likes: '960', date: '07-10' },
  { title: '超跑保养指南：从入门到精通', views: '1.5万', likes: '640', date: '07-08' }
])

const onNotification = () => {
  Taro.navigateTo({ url: '/pages/notifications/index' })
}

const onPublish = () => {
  Taro.navigateTo({ url: '/pages/publish-article/index' })
}

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
.bell-wrap {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bell {
  font-size: 36rpx;
}
.bell-dot {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: $radius-full;
  background: $color-primary;
}

// Stats
.stats-row {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx 32rpx;
}
.stat-card {
  flex: 1;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: 22rpx;
  color: $color-text-tertiary;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 8rpx;
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

// Quick Actions
.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.action-btn {
  width: calc(50% - 10rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 28rpx 0;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
}
.action-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-icon {
  font-size: 36rpx;
}
.action-label {
  font-size: 24rpx;
  color: $color-text-secondary;
  font-weight: 500;
}

// Content Performance
.content-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.content-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
}
.content-info {
  flex: 1;
  min-width: 0;
  margin-right: 24rpx;
}
.content-title {
  font-size: 26rpx;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-date {
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-top: 8rpx;
  display: block;
}
.content-metrics {
  display: flex;
  gap: 24rpx;
  flex-shrink: 0;
}
.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.metric-num {
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-primary;
}
.metric-label {
  font-size: 20rpx;
  color: $color-text-tertiary;
  margin-top: 4rpx;
}

// AI Card
.ai-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-left: 6rpx solid $color-primary;
  border-radius: $radius-lg;
  padding: 24rpx;
}
.ai-card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.ai-icon {
  font-size: 28rpx;
}
.ai-label {
  font-size: 24rpx;
  font-weight: 600;
  color: $color-primary;
}
.ai-text {
  font-size: 26rpx;
  color: $color-text-secondary;
  line-height: 1.6;
}

// Publish Button
.publish-section {
  padding-top: 8rpx;
}
.btn-primary {
  background: $color-primary;
  border-radius: $radius-sm;
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-primary-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
