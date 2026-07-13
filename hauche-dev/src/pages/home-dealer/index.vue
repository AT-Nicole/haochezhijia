<template>
  <View class="page">
    <!-- Welcome Header -->
    <View class="header">
      <View class="header-left">
        <Text class="greeting">上午好，陈经理</Text>
        <Text class="sub-greeting">深圳尊享名车</Text>
      </View>
      <View class="avatar">
        <Text class="avatar-text">陈</Text>
      </View>
    </View>

    <!-- Today Stats -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">28</Text>
        <Text class="stat-label">本月新增</Text>
        <Text class="stat-trend up">+12%</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">156</Text>
        <Text class="stat-label">活跃客户</Text>
        <Text class="stat-trend up">+8%</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">34%</Text>
        <Text class="stat-label">转化率</Text>
        <Text class="stat-trend down">-2%</Text>
      </View>
    </View>

    <!-- Quick Actions -->
    <View class="section">
      <Text class="section-header">快捷操作</Text>
      <View class="action-grid">
        <View class="action-btn" @tap="goTo('/pages/national-pricing/index')">
          <View class="action-icon-wrap" style="background:rgba(218,41,28,0.06)">
            <Text class="action-icon">🌍</Text>
          </View>
          <Text class="action-label">全国比价</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/ai-marketing/index')">
          <View class="action-icon-wrap" style="background:rgba(232,184,0,0.08)">
            <Text class="action-icon">⚡</Text>
          </View>
          <Text class="action-label">AI营销</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/service-tracking/index')">
          <View class="action-icon-wrap" style="background:rgba(3,144,74,0.06)">
            <Text class="action-icon">📍</Text>
          </View>
          <Text class="action-label">8步追踪</Text>
        </View>
        <View class="action-btn" @tap="goTo('/pages/referral-system/index')">
          <View class="action-icon-wrap" style="background:rgba(76,152,185,0.06)">
            <Text class="action-icon">🤝</Text>
          </View>
          <Text class="action-label">裂变分佣</Text>
        </View>
      </View>
    </View>

    <!-- AI Auto Tasks -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">AI 今日已自动完成</Text>
        <Text class="ai-badge">自动</Text>
      </View>
      <View class="ai-task-list">
        <View class="ai-task-item" v-for="task in aiTasks" :key="task.text">
          <Text class="ai-dot" :class="task.status">●</Text>
          <Text class="ai-task-text">{{ task.text }}</Text>
          <Text class="ai-task-result">{{ task.result }}</Text>
        </View>
      </View>
    </View>

    <!-- Recent Leads -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">近期线索</Text>
        <Text class="section-link" @tap="goTo('/pages/crm-inventory/index')">查看全部 ></Text>
      </View>
      <View class="lead-list">
        <View class="lead-item" v-for="lead in leads" :key="lead.name">
          <View class="lead-avatar" :style="{ background: lead.avatarBg }">
            <Text class="lead-avatar-text">{{ lead.avatarText }}</Text>
          </View>
          <View class="lead-info">
            <View class="lead-name-row">
              <Text class="lead-name">{{ lead.name }}</Text>
              <Text class="lead-status" :class="lead.statusClass">{{ lead.status }}</Text>
            </View>
            <Text class="lead-detail">{{ lead.detail }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Bottom spacer -->
    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const aiTasks = ref([
  { text: '生成朋友圈素材', result: '3套 ✓', status: 'done' },
  { text: '客户到期保养提醒', result: '2条已发', status: 'done' },
  { text: '滞销车型降价建议', result: '1条待确认', status: 'pending' },
  { text: '新线索AI评分', result: '8条已评分', status: 'done' }
])

const leads = ref([
  { name: '王思远', avatarText: '王', avatarBg: 'rgba(232,184,0,0.10)', status: '跟进中', statusClass: 'status-warning', detail: '迈巴赫S480 · 预算300万内' },
  { name: '李明哲', avatarText: '李', avatarBg: 'rgba(218,41,28,0.03)', status: '已到店', statusClass: 'status-success', detail: '保时捷卡宴 · 二手置换' },
  { name: '张婉清', avatarText: '张', avatarBg: 'rgba(76,152,185,0.06)', status: '新线索', statusClass: 'status-info', detail: 'AMG G63 · 全款购车' }
])

const goTo = (url) => {
  Taro.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page { min-height: 100vh; background: $color-background; padding-bottom: 120rpx; }

// Header
.header { display: flex; align-items: center; justify-content: space-between; padding: 80rpx 32rpx 32rpx; }
.greeting { font-size: 36rpx; font-weight: 600; color: $color-text-primary; display: block; }
.sub-greeting { font-size: 24rpx; color: $color-text-secondary; display: block; margin-top: 4rpx; }
.avatar { width: 72rpx; height: 72rpx; border-radius: $radius-sm; border: 1rpx solid $color-primary; background: rgba(218,41,28,0.06); display: flex; align-items: center; justify-content: center; }
.avatar-text { font-size: 28rpx; font-weight: 600; color: $color-primary; }

// Stats
.stats-row { display: flex; gap: 16rpx; padding: 0 32rpx 32rpx; }
.stat-card { flex: 1; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; padding: 24rpx 16rpx; display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 48rpx; font-weight: 700; color: $color-text-primary; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 22rpx; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8rpx; }
.stat-trend { font-size: 20rpx; margin-top: 4rpx; &.up { color: $color-success; } &.down { color: $color-error; } }

// Section
.section { padding: 0 32rpx; margin-bottom: 40rpx; }
.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.ai-badge { font-size: 20rpx; font-weight: 600; color: $color-primary; background: rgba(218,41,28,0.06); padding: 4rpx 16rpx; border-radius: $radius-sm; }
.section-link { font-size: 22rpx; color: $color-primary; font-weight: 500; }

// Quick Actions
.action-grid { display: flex; gap: 20rpx; }
.action-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12rpx; padding: 24rpx 0; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.action-icon-wrap { width: 72rpx; height: 72rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; }
.action-icon { font-size: 32rpx; }
.action-label { font-size: 22rpx; color: $color-text-secondary; font-weight: 500; }

// AI Tasks
.ai-task-list { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 0 24rpx; }
.ai-task-item { display: flex; align-items: center; gap: 16rpx; padding: 24rpx 0; border-bottom: 1rpx solid $color-divider; &:last-child { border-bottom: none; } }
.ai-dot { font-size: 16rpx; &.done { color: $color-success; } &.pending { color: $color-warning; } }
.ai-task-text { flex: 1; font-size: 26rpx; color: $color-text-primary; }
.ai-task-result { font-size: 22rpx; color: $color-text-tertiary; white-space: nowrap; }

// Leads
.lead-list { display: flex; flex-direction: column; gap: 16rpx; }
.lead-item { display: flex; align-items: center; gap: 20rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.lead-avatar { width: 64rpx; height: 64rpx; border-radius: $radius-sm; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lead-avatar-text { font-size: 24rpx; font-weight: 600; }
.lead-info { flex: 1; min-width: 0; }
.lead-name-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4rpx; }
.lead-name { font-size: 26rpx; font-weight: 500; color: $color-text-primary; }
.lead-status { font-size: 20rpx; font-weight: 500; padding: 4rpx 12rpx; border-radius: $radius-sm; }
.status-warning { background: $color-warning-bg; color: $color-warning; }
.status-success { background: $color-success-bg; color: $color-success; }
.status-info { background: $color-info-bg; color: $color-info; }
.lead-detail { font-size: 22rpx; color: $color-text-tertiary; }
</style>
