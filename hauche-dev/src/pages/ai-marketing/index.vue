<template>
  <View class="page">
    <!-- Header -->
    <View class="page-header">
      <Text class="page-title">AI营销中心</Text>
      <Text class="page-subtitle">全自动内容生产 · 零人工运营</Text>
    </View>

    <!-- Today Stats -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">12</Text>
        <Text class="stat-label">今日生成</Text>
        <Text class="stat-trend up">+3条</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">1,280</Text>
        <Text class="stat-label">触达客户</Text>
        <Text class="stat-trend up">+15%</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">36</Text>
        <Text class="stat-label">转化线索</Text>
        <Text class="stat-trend up">+8条</Text>
      </View>
    </View>

    <!-- AI Content Tools -->
    <View class="section">
      <Text class="section-header">AI 内容生产工具</Text>
      <View class="tool-grid">
        <View class="tool-card" v-for="tool in tools" :key="tool.label" @tap="onGenerate(tool.type)">
          <View class="tool-icon-wrap" :style="{ backgroundColor: tool.bg }">
            <Text class="tool-icon">{{ tool.icon }}</Text>
          </View>
          <Text class="tool-label">{{ tool.label }}</Text>
          <Text class="tool-desc">{{ tool.desc }}</Text>
        </View>
      </View>
    </View>

    <!-- Customer Tier Grouping -->
    <View class="section">
      <Text class="section-header">客户分层群发</Text>
      <View class="tier-list">
        <View class="tier-card" v-for="tier in tiers" :key="tier.label">
          <View class="tier-header">
            <Text class="tier-name">{{ tier.label }}</Text>
            <Text class="tier-count">{{ tier.count }}人</Text>
          </View>
          <Text class="tier-desc">{{ tier.desc }}</Text>
          <View class="tier-action">
            <Text class="tier-action-text">AI已生成内容</Text>
            <Text class="tier-action-arrow">></Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Festival Auto-Reach -->
    <View class="section">
      <Text class="section-header">节日自动触达</Text>
      <View class="festival-list">
        <View class="festival-item" v-for="f in festivals" :key="f.name">
          <View class="festival-left">
            <Text class="festival-name">{{ f.name }}</Text>
            <Text class="festival-date">{{ f.date }}</Text>
          </View>
          <View class="festival-right">
            <Text class="festival-status" :class="f.statusClass">{{ f.status }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Today's AI Preview -->
    <View class="section">
      <Text class="section-header">今日AI生成预览</Text>
      <View class="preview-card">
        <View class="preview-type-row">
          <Text class="preview-type-tag">短视频脚本</Text>
          <Text class="preview-car-name">迈巴赫S480</Text>
        </View>
        <Text class="preview-content">「在繁忙的深圳CBD，一辆迈巴赫S480静静等候。它的主人，是一位白手起家的企业家…」</Text>
        <View class="preview-actions">
          <View class="preview-btn primary" @tap="onPublish">
            <Text class="preview-btn-text">一键发布到抖音</Text>
          </View>
          <View class="preview-btn outline" @tap="onSync">
            <Text class="preview-btn-text-outline">同步朋友圈</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Performance -->
    <View class="section">
      <Text class="section-header">本周营销数据</Text>
      <View class="perf-row" v-for="day in weeklyData" :key="day.label">
        <Text class="perf-label">{{ day.label }}</Text>
        <View class="perf-bar-wrap">
          <View class="perf-bar" :style="{ width: day.pct + '%', backgroundColor: day.isToday ? '#DA291C' : '#CCCCCC' }" />
        </View>
        <Text class="perf-value">{{ day.value }}条</Text>
      </View>
      <View class="perf-summary">
        <Text class="perf-summary-text">本周共 84 条 · 较上周 +23%</Text>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const tools = ref([
  { icon: '📹', label: '短视频文案', desc: 'AI自动生成抖音/视频号脚本', type: 'video', bg: 'rgba(218,41,28,0.06)' },
  { icon: '📱', label: '朋友圈素材', desc: '每日自动生成9宫格素材', type: 'wechat', bg: 'rgba(232,184,0,0.08)' },
  { icon: '🖼', label: '活动海报文案', desc: '一键生成活动宣传文案', type: 'poster', bg: 'rgba(3,144,74,0.06)' },
  { icon: '✨', label: '车型卖点提炼', desc: 'AI提炼每台车核心卖点', type: 'selling', bg: 'rgba(76,152,185,0.06)' },
])

const tiers = ref([
  { label: 'VIP客户', count: 32, desc: '个性化高端推荐 · 最新到店车型优先通知', status: '已生成' },
  { label: '意向客户', count: 128, desc: '车型匹配 + 优惠推送 · 促进到店试驾', status: '已生成' },
  { label: '沉睡客户', count: 456, desc: '节日关怀 + 降价通知 · 唤醒购车意愿', status: '已生成' },
])

const festivals = ref([
  { name: '中秋节', date: '9月17日', status: '已生成文案 ✓', statusClass: 'done' },
  { name: '国庆节', date: '10月1日', status: '待触发', statusClass: 'pending' },
  { name: '年终购车季', date: '12月', status: '提前7天自动触达', statusClass: 'scheduled' },
])

const weeklyData = ref([
  { label: '周一', value: 14, pct: 70, isToday: false },
  { label: '周二', value: 11, pct: 55, isToday: false },
  { label: '周三', value: 16, pct: 80, isToday: false },
  { label: '周四', value: 13, pct: 65, isToday: false },
  { label: '周五', value: 18, pct: 90, isToday: false },
  { label: '周六', value: 8, pct: 40, isToday: false },
  { label: '周日', value: 4, pct: 20, isToday: true },
])

const onGenerate = (type) => Taro.showToast({ title: `正在生成${type}...`, icon: 'none' })
const onPublish = () => Taro.showToast({ title: '已发布到抖音', icon: 'none' })
const onSync = () => Taro.showToast({ title: '已同步朋友圈', icon: 'none' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page {
  min-height: 100vh;
  background: $color-background;
}

.page-header {
  padding: 100rpx 32rpx 24rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $color-text-primary;
  display: block;
}

.page-subtitle {
  font-size: 24rpx;
  color: $color-text-tertiary;
  display: block;
  margin-top: 8rpx;
}

.stats-row {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx 32rpx;
}

.stat-card {
  flex: 1;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-sm;
  padding: 24rpx 16rpx;
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

.stat-trend {
  font-size: 20rpx;
  margin-top: 4rpx;
  &.up {
    color: $color-success;
  }
}

.section {
  padding: 0 32rpx;
  margin-bottom: 40rpx;
}

.section-header {
  font-size: 22rpx;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-text-tertiary;
  margin-bottom: 20rpx;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.tool-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.tool-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-icon {
  font-size: 32rpx;
}

.tool-label {
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-primary;
}

.tool-desc {
  font-size: 20rpx;
  color: $color-text-tertiary;
}

.tier-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tier-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
}

.tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.tier-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-primary;
}

.tier-count {
  font-size: 24rpx;
  font-weight: 500;
  color: $color-primary;
}

.tier-desc {
  font-size: 22rpx;
  color: $color-text-secondary;
  margin-bottom: 12rpx;
}

.tier-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4rpx;
}

.tier-action-text {
  font-size: 22rpx;
  color: $color-success;
}

.tier-action-arrow {
  font-size: 22rpx;
  color: $color-text-tertiary;
}

.festival-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.festival-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
}

.festival-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
}

.festival-date {
  font-size: 22rpx;
  color: $color-text-tertiary;
}

.festival-status {
  font-size: 22rpx;
  font-weight: 500;
  &.done {
    color: $color-success;
  }
  &.pending {
    color: $color-text-tertiary;
  }
  &.scheduled {
    color: $color-info;
  }
}

.preview-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
}

.preview-type-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.preview-type-tag {
  font-size: 20rpx;
  font-weight: 600;
  color: $color-primary;
  background: rgba(218,41,28,0.06);
  padding: 4rpx 12rpx;
  border-radius: $radius-xs;
}

.preview-car-name {
  font-size: 22rpx;
  color: $color-text-secondary;
}

.preview-content {
  font-size: 24rpx;
  color: $color-text-primary;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.preview-actions {
  display: flex;
  gap: 16rpx;
}

.preview-btn {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;
  &.primary {
    flex: 2;
    background: $color-primary;
  }
  &.outline {
    flex: 1;
    border: 1rpx solid $color-primary;
  }
}

.preview-btn-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.preview-btn-text-outline {
  font-size: 24rpx;
  font-weight: 500;
  color: $color-primary;
}

.perf-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.perf-label {
  width: 64rpx;
  font-size: 22rpx;
  color: $color-text-tertiary;
}

.perf-bar-wrap {
  flex: 1;
  height: 16rpx;
  background: $color-background-secondary;
  border-radius: 8rpx;
  overflow: hidden;
}

.perf-bar {
  height: 100%;
  border-radius: 8rpx;
}

.perf-value {
  width: 80rpx;
  font-size: 22rpx;
  color: $color-text-primary;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.perf-summary {
  margin-top: 8rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid $color-divider;
}

.perf-summary-text {
  font-size: 22rpx;
  color: $color-text-secondary;
}
</style>
