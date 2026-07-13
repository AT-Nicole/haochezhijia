<template>
  <View class="page">
    <View class="page-header">
      <Text class="page-title">AI活动运营</Text>
      <Text class="page-subtitle">全自动策划 · 执行 · 复盘</Text>
    </View>

    <!-- Stats -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">4</Text>
        <Text class="stat-label">本月活动</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">1,280</Text>
        <Text class="stat-label">总报名</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">72%</Text>
        <Text class="stat-label">平均到场率</Text>
        <Text class="stat-trend up">+5%</Text>
      </View>
    </View>

    <!-- AI Auto-Planning -->
    <View class="section">
      <Text class="section-header">AI自动策划方案</Text>
      <View class="plan-card">
        <View class="plan-header">
          <Text class="plan-title">大湾区超跑嘉年华</Text>
          <Text class="plan-status">筹备中</Text>
        </View>
        <View class="plan-checks">
          <Text class="plan-check done">活动方案 ✓</Text>
          <Text class="plan-check done">海报设计 ✓</Text>
          <Text class="plan-check done">邀请函 ✓</Text>
          <Text class="plan-check done">预算规划 ✓</Text>
        </View>
        <View class="plan-timeline">
          <View class="timeline-step done" v-for="(step, idx) in timelineSteps" :key="idx">
            <View class="timeline-dot" :class="step.status" />
            <Text class="timeline-text">{{ step.label }}</Text>
            <Text class="timeline-status">{{ step.statusText }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Poster Generation -->
    <View class="section">
      <Text class="section-header">AI海报生成</Text>
      <View class="poster-grid">
        <View class="poster-thumb" v-for="p in posters" :key="p.title" :style="{ backgroundColor: p.bg }">
          <Text class="poster-thumb-title">{{ p.title }}</Text>
        </View>
      </View>
      <Text class="poster-note">AI一键生成活动海报、邀请函、宣传物料</Text>
      <View class="btn-primary-full" style="margin-top: 16rpx" @tap="onBatchGenerate">
        <Text class="btn-text">批量生成</Text>
      </View>
    </View>

    <!-- Attendance Tracking -->
    <View class="section">
      <Text class="section-header">报名追踪</Text>
      <View class="tracking-card">
        <View class="tracking-header">
          <Text class="tracking-title">2026超跑嘉年华</Text>
          <Text class="tracking-count">2,360 / 3,000</Text>
        </View>
        <View class="progress-bar-wrap">
          <View class="progress-bar" :style="{ width: '78%' }" />
        </View>
        <Text class="progress-label">已完成 78%</Text>
        <View class="channel-grid">
          <View class="channel-item" v-for="ch in channels" :key="ch.label">
            <Text class="channel-value">{{ ch.count }}</Text>
            <Text class="channel-label">{{ ch.label }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Post-Event Report -->
    <View class="section">
      <Text class="section-header">活动复盘</Text>
      <View class="report-card">
        <Text class="report-title">端午自驾游</Text>
        <View class="report-metrics">
          <View class="report-metric">
            <Text class="metric-value">68%</Text>
            <Text class="metric-label">到场率</Text>
          </View>
          <View class="report-metric">
            <Text class="metric-value">186</Text>
            <Text class="metric-label">新线索</Text>
          </View>
          <View class="report-metric">
            <Text class="metric-value">12辆</Text>
            <Text class="metric-label">成交</Text>
          </View>
          <View class="report-metric">
            <Text class="metric-value highlight">1:8.6</Text>
            <Text class="metric-label">ROI</Text>
          </View>
        </View>
        <Text class="report-ai">AI已生成完整复盘报告 >></Text>
      </View>
    </View>

    <!-- Quick Actions -->
    <View class="section">
      <View class="action-grid">
        <View class="btn-primary-full" @tap="onCreateEvent">
          <Text class="btn-text">创建新活动</Text>
        </View>
        <View class="btn-outline-sm" @tap="onCalendar">
          <Text class="btn-outline-text-sm">活动日历</Text>
        </View>
        <View class="btn-outline-sm" @tap="onReport">
          <Text class="btn-outline-text-sm">复盘报告</Text>
        </View>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const timelineSteps = [
  { label: '方案策划', status: 'done', statusText: '已完成' },
  { label: '海报设计', status: 'done', statusText: '已完成' },
  { label: '报名推广', status: 'active', statusText: '进行中' },
  { label: '活动执行', status: 'pending', statusText: '待启动' },
]

const posters = [
  { title: '超跑嘉年华', bg: '#DA291C' },
  { title: '中秋品鉴会', bg: '#1a1a2e' },
  { title: '年终购车节', bg: '#E8B800' },
]

const channels = [
  { label: '朋友圈', count: 820 },
  { label: '小程序', count: 680 },
  { label: '老客推荐', count: 540 },
  { label: '自然流量', count: 320 },
]

const onCreateEvent = () => Taro.showToast({ title: 'AI正在策划...', icon: 'none' })
const onCalendar = () => Taro.showToast({ title: '活动日历', icon: 'none' })
const onReport = () => Taro.showToast({ title: '查看复盘报告', icon: 'none' })
const onBatchGenerate = () => Taro.showToast({ title: '批量生成中...', icon: 'none' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.page-header { padding: 100rpx 32rpx 24rpx; }
.page-title { font-size: 40rpx; font-weight: 700; color: $color-text-primary; display: block; }
.page-subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }

.stats-row { display: flex; gap: 16rpx; padding: 0 32rpx 32rpx; }
.stat-card { flex: 1; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; padding: 24rpx 16rpx; display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 44rpx; font-weight: 700; color: $color-text-primary; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 22rpx; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8rpx; }
.stat-trend { font-size: 20rpx; &.up { color: $color-success; } }

.section { padding: 0 32rpx; margin-bottom: 40rpx; }
.section-header { font-size: 22rpx; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $color-text-tertiary; margin-bottom: 20rpx; }

.plan-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx; }
.plan-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16rpx; }
.plan-title { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.plan-status { font-size: 20rpx; font-weight: 600; color: $color-primary; background: rgba(218,41,28,0.06); padding: 4rpx 12rpx; border-radius: $radius-sm; }
.plan-checks { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 20rpx; }
.plan-check { font-size: 22rpx; color: $color-success; font-weight: 500; }
.plan-timeline { display: flex; flex-direction: column; gap: 16rpx; }
.timeline-step { display: flex; align-items: center; gap: 16rpx; }
.timeline-dot { width: 20rpx; height: 20rpx; border-radius: 50%; border: 4rpx solid $color-border; &.done { background: $color-success; border-color: $color-success; } &.active { background: $color-primary; border-color: $color-primary; } }
.timeline-text { flex: 1; font-size: 24rpx; color: $color-text-primary; }
.timeline-status { font-size: 22rpx; color: $color-text-tertiary; }

.poster-grid { display: flex; gap: 16rpx; margin-bottom: 16rpx; }
.poster-thumb { width: 200rpx; height: 120rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; }
.poster-thumb-title { font-size: 20rpx; color: #fff; font-weight: 600; }
.poster-note { font-size: 22rpx; color: $color-text-tertiary; }
.btn-primary-full { height: 80rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.btn-text { font-size: 26rpx; font-weight: 600; color: #fff; }

.tracking-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx; }
.tracking-header { display: flex; justify-content: space-between; margin-bottom: 16rpx; }
.tracking-title { font-size: 26rpx; font-weight: 600; color: $color-text-primary; }
.tracking-count { font-size: 24rpx; font-weight: 500; color: $color-primary; }
.progress-bar-wrap { height: 16rpx; background: $color-background-secondary; border-radius: 8rpx; overflow: hidden; margin-bottom: 8rpx; }
.progress-bar { height: 100%; background: $color-primary; border-radius: 8rpx; }
.progress-label { font-size: 22rpx; color: $color-text-tertiary; margin-bottom: 20rpx; }
.channel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12rpx; }
.channel-item { text-align: center; padding: 16rpx; background: $color-background-secondary; border-radius: $radius-md; }
.channel-value { font-size: 28rpx; font-weight: 700; color: $color-text-primary; display: block; }
.channel-label { font-size: 20rpx; color: $color-text-tertiary; margin-top: 4rpx; }

.report-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx; }
.report-title { font-size: 26rpx; font-weight: 600; color: $color-text-primary; margin-bottom: 20rpx; }
.report-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16rpx; margin-bottom: 16rpx; }
.report-metric { text-align: center; padding: 16rpx; background: $color-background-secondary; border-radius: $radius-md; }
.metric-value { font-size: 28rpx; font-weight: 700; color: $color-text-primary; display: block; &.highlight { color: $color-primary; } }
.metric-label { font-size: 20rpx; color: $color-text-tertiary; margin-top: 4rpx; }
.report-ai { font-size: 22rpx; color: $color-primary; font-weight: 500; }

.action-grid { display: flex; gap: 16rpx; }
.btn-outline-sm { flex: 1; height: 80rpx; display: flex; align-items: center; justify-content: center; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.btn-outline-text-sm { font-size: 24rpx; font-weight: 500; color: $color-text-secondary; }
</style>
