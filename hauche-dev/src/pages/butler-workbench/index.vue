<template>
  <View class="page">
    <View class="page-header">
      <Text class="page-title">管家工作台</Text>
      <Text class="page-subtitle">26项高端私董服务 · 数字化管理</Text>
    </View>

    <!-- Stats -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">86</Text>
        <Text class="stat-label">活跃会员</Text>
      </View>
      <View class="stat-card accent">
        <Text class="stat-value">328</Text>
        <Text class="stat-label">本月服务</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">99.2%</Text>
        <Text class="stat-label">满意度</Text>
      </View>
    </View>

    <!-- Service Categories -->
    <View class="section">
      <Text class="section-header">26项服务分类</Text>
      <View class="service-grid">
        <View class="service-card" v-for="svc in topServices" :key="svc.label" @tap="goTo(svc.url)">
          <View class="service-icon-wrap" :style="{ backgroundColor: svc.bg }">
            <Text class="service-icon">{{ svc.icon }}</Text>
          </View>
          <Text class="service-label">{{ svc.label }}</Text>
          <Text class="service-count">{{ svc.count }}</Text>
        </View>
      </View>
      <View class="view-all-btn" @tap="Taro.showToast({title:'全部26项服务',icon:'none'})">
        <Text class="view-all-text">查看全部26项 ></Text>
      </View>
    </View>

    <!-- Today Schedule -->
    <View class="section">
      <Text class="section-header">今日服务日程</Text>
      <View class="schedule-list">
        <View class="schedule-item" v-for="item in todaySchedule" :key="item.time + item.name">
          <View class="schedule-time">
            <Text class="schedule-time-text">{{ item.time }}</Text>
          </View>
          <View class="schedule-content">
            <View class="schedule-header-row">
              <Text class="schedule-name">{{ item.name }}</Text>
              <Text class="schedule-status" :class="item.statusClass">{{ item.statusText }}</Text>
            </View>
            <Text class="schedule-desc">{{ item.desc }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Auto Tracking -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">AI 自动跟进</Text>
        <Text class="ai-tag">自动</Text>
      </View>
      <View class="ai-tracking-card">
        <View class="track-item" v-for="track in aiTracking" :key="track.label">
          <View class="track-icon-wrap" :style="{ backgroundColor: track.bg }">
            <Text class="track-icon-text">{{ track.icon }}</Text>
          </View>
          <View class="track-info">
            <Text class="track-label">{{ track.label }}</Text>
            <Text class="track-count">{{ track.count }}</Text>
          </View>
        </View>
        <View class="ai-confirmed">
          <Text class="ai-confirmed-text">AI已自动发送提醒通知给客户 ✓</Text>
        </View>
      </View>
    </View>

    <!-- Recent Feedback -->
    <View class="section">
      <Text class="section-header">服务质量反馈</Text>
      <View class="feedback-list">
        <View class="feedback-item" v-for="fb in feedbacks" :key="fb.name">
          <View class="feedback-avatar" :style="{ background: fb.bg }">
            <Text class="feedback-avatar-text">{{ fb.avatar }}</Text>
          </View>
          <View class="feedback-info">
            <Text class="feedback-name">{{ fb.name }}</Text>
            <Text class="feedback-stars">{{ fb.stars }}</Text>
            <Text class="feedback-text">{{ fb.text }}</Text>
          </View>
        </View>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const topServices = [
  { icon: '🚗', label: '上门送车', count: '本月 23 次', bg: 'rgba(218,41,28,0.06)', url: '' },
  { icon: '✈️', label: '机场接送', count: '本月 18 次', bg: 'rgba(76,152,185,0.06)', url: '' },
  { icon: '🔔', label: '保养提醒', count: '待执行 5 项', bg: 'rgba(232,168,56,0.06)', url: '' },
  { icon: '🎁', label: '节日礼品', count: '中秋已备', bg: 'rgba(232,184,0,0.08)', url: '' },
  { icon: '📋', label: '代客年检', count: '本月 8 次', bg: 'rgba(3,144,74,0.06)', url: '' },
  { icon: '🛡', label: '保险续费', count: '待续费 3 项', bg: 'rgba(218,41,28,0.06)', url: '' },
  { icon: '✨', label: '洗车保洁', count: '本月 45 次', bg: 'rgba(76,152,185,0.06)', url: '' },
  { icon: '🚨', label: '道路救援', count: '本月 2 次', bg: 'rgba(241,58,44,0.06)', url: '' },
]

const todaySchedule = [
  { time: '09:00', name: '王先生', desc: '迈巴赫S480 · 年检代办', statusText: '进行中', statusClass: 'active' },
  { time: '11:30', name: '李女士', desc: '保时捷911 · 机场接机', statusText: '待执行', statusClass: 'pending' },
  { time: '14:00', name: '张总', desc: '奔驰G63 · 保养提醒', statusText: '待执行', statusClass: 'pending' },
  { time: '16:30', name: '陈总', desc: '迈巴赫S680 · 节日礼品送达', statusText: '待执行', statusClass: 'pending' },
]

const aiTracking = [
  { icon: '🔔', label: '保养到期提醒', count: '3辆 (自动检测)', bg: 'rgba(232,168,56,0.06)' },
  { icon: '🛡', label: '保险到期提醒', count: '2辆 (自动检测)', bg: 'rgba(218,41,28,0.03)' },
  { icon: '📋', label: '年检到期提醒', count: '1辆 (自动检测)', bg: 'rgba(3,144,74,0.06)' },
]

const feedbacks = [
  { name: '王先生', avatar: '王', bg: 'rgba(218,41,28,0.03)', stars: '★★★★★', text: '送车准时，服务非常专业' },
  { name: '李女士', avatar: '李', bg: 'rgba(232,184,0,0.08)', stars: '★★★★★', text: '机场接送很贴心，下次还找你们' },
]

const goTo = (url) => { if (url) Taro.navigateTo({ url }) }
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.page-header { padding: 100rpx 32rpx 24rpx; }
.page-title { font-size: 40rpx; font-weight: 700; color: $color-text-primary; display: block; }
.page-subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }

.stats-row { display: flex; gap: 16rpx; padding: 0 32rpx 32rpx; }
.stat-card { flex: 1; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; padding: 24rpx 16rpx; display: flex; flex-direction: column; align-items: center; &.accent .stat-value { color: $color-primary; } }
.stat-value { font-size: 44rpx; font-weight: 700; color: $color-text-primary; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 22rpx; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8rpx; }

.section { padding: 0 32rpx; margin-bottom: 40rpx; }
.section-header { font-size: 22rpx; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $color-text-tertiary; margin-bottom: 20rpx; }
.section-header-row { display: flex; align-items: center; gap: 8rpx; margin-bottom: 20rpx; }
.ai-tag { font-size: 20rpx; font-weight: 600; color: $color-primary; background: rgba(218,41,28,0.06); padding: 4rpx 12rpx; border-radius: $radius-sm; }

.service-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.service-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 20rpx 12rpx; display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.service-icon-wrap { width: 64rpx; height: 64rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; }
.service-icon { font-size: 28rpx; }
.service-label { font-size: 22rpx; font-weight: 500; color: $color-text-primary; }
.service-count { font-size: 18rpx; color: $color-text-tertiary; }
.view-all-btn { text-align: center; margin-top: 20rpx; }
.view-all-text { font-size: 24rpx; color: $color-primary; font-weight: 500; }

.schedule-list { display: flex; flex-direction: column; gap: 12rpx; }
.schedule-item { display: flex; gap: 16rpx; padding: 20rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.schedule-time { width: 100rpx; display: flex; align-items: flex-start; justify-content: center; padding-top: 4rpx; }
.schedule-time-text { font-size: 24rpx; font-weight: 600; color: $color-text-primary; font-variant-numeric: tabular-nums; }
.schedule-content { flex: 1; }
.schedule-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4rpx; }
.schedule-name { font-size: 26rpx; font-weight: 500; color: $color-text-primary; }
.schedule-status { font-size: 20rpx; font-weight: 500; padding: 4rpx 12rpx; border-radius: $radius-sm; &.active { color: $color-primary; background: rgba(218,41,28,0.06); } &.pending { color: $color-text-tertiary; background: $color-background-secondary; } }
.schedule-desc { font-size: 22rpx; color: $color-text-tertiary; }

.ai-tracking-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 20rpx; }
.track-item { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid $color-divider; &:last-of-type { border-bottom: none; } }
.track-icon-wrap { width: 48rpx; height: 48rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; }
.track-icon-text { font-size: 22rpx; }
.track-info { flex: 1; display: flex; justify-content: space-between; }
.track-label { font-size: 24rpx; color: $color-text-primary; }
.track-count { font-size: 22rpx; color: $color-text-secondary; }
.ai-confirmed { padding-top: 16rpx; }
.ai-confirmed-text { font-size: 22rpx; color: $color-success; font-weight: 500; }

.feedback-list { display: flex; flex-direction: column; gap: 12rpx; }
.feedback-item { display: flex; gap: 16rpx; padding: 20rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.feedback-avatar { width: 56rpx; height: 56rpx; border-radius: $radius-sm; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.feedback-avatar-text { font-size: 22rpx; font-weight: 600; color: $color-text-primary; }
.feedback-info { flex: 1; }
.feedback-name { font-size: 24rpx; font-weight: 500; color: $color-text-primary; }
.feedback-stars { font-size: 20rpx; color: $color-accent; margin: 4rpx 0; }
.feedback-text { font-size: 22rpx; color: $color-text-secondary; }
</style>
