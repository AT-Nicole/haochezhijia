<template>
  <View class="page">
    <!-- Butler Profile Card -->
    <View class="profile-card">
      <View class="profile-top">
        <View class="avatar">
          <Text class="avatar-text">陈</Text>
        </View>
        <View class="profile-info">
          <Text class="profile-name">陈管家</Text>
          <Text class="profile-phone">📞 138-0000-8888</Text>
        </View>
      </View>
      <View class="profile-meta">
        <View class="meta-item">
          <Text class="meta-value">4.9</Text>
          <Text class="meta-label">评分</Text>
        </View>
        <View class="meta-divider" />
        <View class="meta-item">
          <Text class="meta-value">6年</Text>
          <Text class="meta-label">服务年限</Text>
        </View>
        <View class="meta-divider" />
        <View class="meta-item">
          <Text class="meta-value">152</Text>
          <Text class="meta-label">服务客户</Text>
        </View>
      </View>
    </View>

    <!-- Service Timeline -->
    <View class="section">
      <Text class="section-title">服务记录</Text>
      <View class="timeline">
        <View class="timeline-item" v-for="(item, idx) in timeline" :key="idx">
          <View class="timeline-dot-wrap">
            <View :class="['timeline-dot', item.done ? 'dot-done' : 'dot-pending']" />
            <View v-if="idx < timeline.length - 1" class="timeline-line" />
          </View>
          <View class="timeline-content">
            <View class="timeline-header">
              <Text class="timeline-date">{{ item.date }}</Text>
              <Text v-if="item.done" class="timeline-status">✓</Text>
            </View>
            <Text class="timeline-text">{{ item.content }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Assistant Section -->
    <View class="ai-section">
      <View class="ai-row">
        <Text class="ai-icon">🤖</Text>
        <View class="ai-content">
          <Text class="ai-title">AI管家</Text>
          <Text class="ai-text">AI管家已为您自动完成本月3项例行检查：车辆年检到期提醒、保险续保提醒、保养里程检查。</Text>
        </View>
      </View>
    </View>

    <!-- Contact Button -->
    <View class="action-area">
      <View class="contact-btn" @tap="handleCall">
        <Text class="contact-btn-text">📞 一键呼叫管家</Text>
      </View>
    </View>
  </View>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const timeline = ref([
  { date: '7月10日', content: '代办年检完成', done: true },
  { date: '7月5日', content: '机场接送（深圳宝安 → 柏悦酒店）', done: true },
  { date: '6月28日', content: '迈巴赫保养提醒已发送', done: true },
  { date: '6月15日', content: '保险理赔协助完成', done: true }
])

const handleCall = () => {
  Taro.makePhoneCall({ phoneNumber: '13800008888' })
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  min-height: 100vh;
  background-color: #FAFAFA;
  padding: 24rpx 32rpx;
  padding-bottom: 160rpx;
}

/* Profile Card */
.profile-card {
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.profile-top {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.avatar-text {
  font-size: 36rpx;
  color: #E8B800;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #181818;
  margin-bottom: 6rpx;
}

.profile-phone {
  font-size: 26rpx;
  color: #666666;
}

.profile-meta {
  display: flex;
  align-items: center;
  border-top: 1px solid #CCCCCC;
  padding-top: 24rpx;
}

.meta-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meta-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #DA291C;
  margin-bottom: 4rpx;
}

.meta-label {
  font-size: 22rpx;
  color: #8F8F8F;
}

.meta-divider {
  width: 1px;
  height: 56rpx;
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

/* Timeline */
.timeline {
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 28rpx 32rpx;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
}

.timeline-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24rpx;
  width: 32rpx;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-done {
  background-color: #DA291C;
}

.dot-pending {
  background-color: #CCCCCC;
}

.timeline-line {
  width: 2rpx;
  flex: 1;
  background-color: #CCCCCC;
  min-height: 40rpx;
}

.timeline-content {
  flex: 1;
  padding-bottom: 28rpx;
}

.timeline-item:last-child .timeline-content {
  padding-bottom: 0;
}

.timeline-header {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.timeline-date {
  font-size: 24rpx;
  color: #8F8F8F;
  margin-right: 12rpx;
}

.timeline-status {
  font-size: 24rpx;
  color: #DA291C;
}

.timeline-text {
  font-size: 28rpx;
  color: #181818;
  line-height: 1.5;
}

/* AI Section */
.ai-section {
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 28rpx 32rpx;
  margin-bottom: 32rpx;
}

.ai-row {
  display: flex;
  align-items: flex-start;
}

.ai-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.ai-content {
  flex: 1;
}

.ai-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #181818;
  margin-bottom: 10rpx;
}

.ai-text {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}

/* Contact Button */
.action-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #FAFAFA;
}

.contact-btn {
  background-color: #DA291C;
  border-radius: 8px;
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-btn-text {
  font-size: 30rpx;
  color: #FFFFFF;
  font-weight: 600;
}
</style>
