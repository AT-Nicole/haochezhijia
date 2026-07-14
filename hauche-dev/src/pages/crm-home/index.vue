<template>
  <View class="page">
    <!-- Header -->
    <View class="header">
      <Text class="header-title">客户管理</Text>
      <View class="search-wrap" @tap="goTo('/pages/crm-members/index')">
        <Text class="search-icon">🔍</Text>
      </View>
    </View>

    <!-- Funnel Stats -->
    <View class="section">
      <Text class="section-header">销售漏斗</Text>
      <View class="funnel">
        <View class="funnel-step" v-for="(step, idx) in funnel" :key="step.label">
          <View class="step-card" :class="step.cls">
            <Text class="step-value">{{ step.value }}</Text>
            <Text class="step-label">{{ step.label }}</Text>
          </View>
          <View class="funnel-arrow" v-if="idx < funnel.length - 1">
            <Text class="arrow-text">→</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Today's Tasks -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">今日任务</Text>
        <Text class="section-link">全部 ></Text>
      </View>
      <View class="task-list">
        <View class="task-item" v-for="task in tasks" :key="task.customer">
          <View class="task-time-col">
            <Text class="task-time">{{ task.time }}</Text>
          </View>
          <View class="task-body">
            <Text class="task-customer">{{ task.customer }}</Text>
            <Text class="task-action">{{ task.action }}</Text>
          </View>
          <View class="task-tag" :class="task.tagCls">
            <Text class="tag-text">{{ task.tag }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Recent Deals -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">近期成交</Text>
        <Text class="section-link">全部 ></Text>
      </View>
      <View class="deal-list">
        <View class="deal-card" v-for="deal in deals" :key="deal.customer">
          <View class="deal-top">
            <View class="deal-info">
              <Text class="deal-customer">{{ deal.customer }}</Text>
              <Text class="deal-car">{{ deal.car }}</Text>
            </View>
            <View class="deal-amount-wrap">
              <Text class="deal-amount">{{ deal.amount }}</Text>
            </View>
          </View>
          <View class="deal-bottom">
            <View class="deal-status" :class="deal.statusCls">
              <Text class="status-text">{{ deal.status }}</Text>
            </View>
            <Text class="deal-date">{{ deal.date }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Insight -->
    <View class="section">
      <View class="ai-card">
        <View class="ai-card-header">
          <Text class="ai-icon">🤖</Text>
          <Text class="ai-label">AI分析</Text>
        </View>
        <Text class="ai-text">本周意向客户转化率下降15%，建议加强跟进口径</Text>
      </View>
    </View>

    <!-- Bottom spacer -->
    <View style="height: 120rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const funnel = ref([
  { label: '线索', value: 86, cls: 'step-lead' },
  { label: '意向', value: 42, cls: 'step-intent' },
  { label: '报价', value: 18, cls: 'step-quote' },
  { label: '成交', value: 8, cls: 'step-deal' }
])

const tasks = ref([
  { time: '09:00', customer: '王思远', action: '回访电话 - 迈巴赫S480意向跟进', tag: '电话', tagCls: 'tag-phone' },
  { time: '10:30', customer: '李明哲', action: '发送报价方案 - 保时捷卡宴', tag: '报价', tagCls: 'tag-quote' },
  { time: '13:00', customer: '张婉清', action: '安排试驾 - AMG G63', tag: '试驾', tagCls: 'tag-drive' },
  { time: '15:00', customer: '刘浩宇', action: '合同签署 - 法拉利Roma', tag: '签约', tagCls: 'tag-sign' },
  { time: '16:30', customer: '陈嘉怡', action: '金融方案确认 - 宾利添越', tag: '金融', tagCls: 'tag-finance' }
])

const deals = ref([
  { customer: '刘浩宇', car: '法拉利 Roma Spider', amount: '¥328万', status: '已签约', statusCls: 'status-signed', date: '07-12' },
  { customer: '赵天佑', car: '兰博基尼 Huracán', amount: '¥286万', status: '待付款', statusCls: 'status-pending', date: '07-11' },
  { customer: '孙雅琪', car: '迈凯伦 720S', amount: '¥412万', status: '审批中', statusCls: 'status-review', date: '07-10' }
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
.search-wrap {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-icon {
  font-size: 32rpx;
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

// Funnel
.funnel {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.funnel-step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.step-card {
  flex: 1;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 20rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 4rpx solid $color-border;
  &.step-lead { border-top-color: $color-info; }
  &.step-intent { border-top-color: $color-accent; }
  &.step-quote { border-top-color: $color-warning; }
  &.step-deal { border-top-color: $color-success; }
}
.step-value {
  font-size: 40rpx;
  font-weight: 700;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}
.step-label {
  font-size: 20rpx;
  color: $color-text-tertiary;
  margin-top: 4rpx;
}
.funnel-arrow {
  flex-shrink: 0;
}
.arrow-text {
  font-size: 24rpx;
  color: $color-text-quaternary;
  font-weight: 600;
}

// Tasks
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
}
.task-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-bottom: 1rpx solid $color-divider;
  &:last-child {
    border-bottom: none;
  }
}
.task-time-col {
  flex-shrink: 0;
  width: 80rpx;
}
.task-time {
  font-size: 24rpx;
  font-weight: 600;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}
.task-body {
  flex: 1;
  min-width: 0;
}
.task-customer {
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text-primary;
  display: block;
}
.task-action {
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-top: 4rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-tag {
  flex-shrink: 0;
  padding: 6rpx 16rpx;
  border-radius: $radius-sm;
  &.tag-phone { background: $color-info-bg; }
  &.tag-quote { background: rgba(232,184,0,0.08); }
  &.tag-drive { background: $color-success-bg; }
  &.tag-sign { background: rgba(218,41,28,0.06); }
  &.tag-finance { background: $color-warning-bg; }
}
.tag-text {
  font-size: 20rpx;
  font-weight: 500;
  color: $color-text-secondary;
}

// Deals
.deal-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.deal-card {
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
}
.deal-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.deal-info {
  flex: 1;
  min-width: 0;
}
.deal-customer {
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text-primary;
  display: block;
}
.deal-car {
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-top: 6rpx;
  display: block;
}
.deal-amount-wrap {
  flex-shrink: 0;
  margin-left: 24rpx;
}
.deal-amount {
  font-size: 30rpx;
  font-weight: 700;
  color: $color-primary;
}
.deal-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.deal-status {
  padding: 6rpx 20rpx;
  border-radius: $radius-sm;
  &.status-signed { background: $color-success-bg; }
  &.status-pending { background: $color-warning-bg; }
  &.status-review { background: rgba(218,41,28,0.06); }
}
.status-text {
  font-size: 20rpx;
  font-weight: 500;
}
.deal-date {
  font-size: 20rpx;
  color: $color-text-tertiary;
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
</style>
