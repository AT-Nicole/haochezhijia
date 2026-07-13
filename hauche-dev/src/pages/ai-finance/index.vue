<template>
  <View class="page">
    <View class="page-header">
      <Text class="page-title">AI财务报表</Text>
      <Text class="page-subtitle">全自动记账 · 告别手工做账</Text>
    </View>

    <!-- Monthly P&L -->
    <View class="pnl-card">
      <View class="pnl-row">
        <View class="pnl-item">
          <Text class="pnl-label">本月营收</Text>
          <Text class="pnl-value revenue">¥3,280,000</Text>
          <Text class="pnl-trend up">+12%</Text>
        </View>
        <View class="pnl-item">
          <Text class="pnl-label">本月支出</Text>
          <Text class="pnl-value">¥2,860,000</Text>
        </View>
        <View class="pnl-item highlight">
          <Text class="pnl-label">本月净利</Text>
          <Text class="pnl-value profit">¥420,000</Text>
        </View>
      </View>
    </View>

    <!-- Revenue Breakdown -->
    <View class="section">
      <Text class="section-header">营收构成</Text>
      <View class="breakdown-list">
        <View class="breakdown-item" v-for="item in revenue" :key="item.label">
          <Text class="breakdown-label">{{ item.label }}</Text>
          <View class="breakdown-bar-wrap">
            <View class="breakdown-bar" :style="{ width: item.pct + '%', backgroundColor: item.color }" />
          </View>
          <Text class="breakdown-value">¥{{ item.amount }} ({{ item.pct }}%)</Text>
        </View>
      </View>
    </View>

    <!-- Expense -->
    <View class="section">
      <Text class="section-header">支出明细</Text>
      <View class="expense-list">
        <View class="expense-item" v-for="item in expenses" :key="item.label">
          <View class="expense-dot" :style="{ backgroundColor: item.color }" />
          <Text class="expense-label">{{ item.label }}</Text>
          <Text class="expense-value">¥{{ item.amount }}</Text>
        </View>
      </View>
    </View>

    <!-- Cost Intelligence -->
    <View class="section">
      <Text class="section-header">成本智能</Text>
      <View class="cost-grid">
        <View class="cost-card" v-for="c in costs" :key="c.label">
          <Text class="cost-label">{{ c.label }}</Text>
          <Text class="cost-value">{{ c.value }}</Text>
          <Text class="cost-change" :class="c.trendClass">{{ c.change }}</Text>
        </View>
      </View>
    </View>

    <!-- Inventory Alerts -->
    <View class="section">
      <Text class="section-header">库存财务预警</Text>
      <View class="alert-list">
        <View class="alert-item warning" v-for="a in warnings" :key="a.car">
          <Text class="alert-icon">⚠</Text>
          <View class="alert-info">
            <Text class="alert-name">{{ a.car }} (库存{{ a.days }}天)</Text>
            <Text class="alert-suggestion">{{ a.suggestion }}</Text>
          </View>
        </View>
        <View class="alert-item success" v-for="a in hotCars" :key="a.car">
          <Text class="alert-icon success-icon">✓</Text>
          <View class="alert-info">
            <Text class="alert-name">{{ a.car }} (库存{{ a.days }}天)</Text>
            <Text class="alert-suggestion">利润率{{ a.margin }}</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Auto Settlement -->
    <View class="section">
      <Text class="section-header">自动结算</Text>
      <View class="settlement-card">
        <View class="settlement-row">
          <Text class="settlement-label">佣金结算</Text>
          <Text class="settlement-value">3笔待处理 (¥15,000)</Text>
        </View>
        <View class="settlement-row">
          <Text class="settlement-label">会员费</Text>
          <Text class="settlement-value done">已自动入账 ✓</Text>
        </View>
        <View class="btn-primary-full" style="margin-top: 24rpx" @tap="onExport">
          <Text class="btn-text">导出Excel报表</Text>
        </View>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const revenue = [
  { label: '车辆销售', amount: '2,680,000', pct: 82, color: '#DA291C' },
  { label: '服务收入', amount: '380,000', pct: 12, color: '#CCCCCC' },
  { label: '佣金收入', amount: '220,000', pct: 7, color: '#E8E8E8' },
]

const expenses = [
  { label: '车辆采购', amount: '2,180,000', color: '#DA291C' },
  { label: '门店运营', amount: '320,000', color: '#666666' },
  { label: '人员工资', amount: '240,000', color: '#666666' },
  { label: '营销推广', amount: '120,000', color: '#8F8F8F' },
]

const costs = [
  { label: '获客成本', value: '¥2,800/人', change: '-12.5%', trendClass: 'up' },
  { label: '佣金支出', value: '¥45,000', change: '3笔待结算', trendClass: 'neutral' },
  { label: '会员费收入', value: '¥86,000', change: '+12位新会员', trendClass: 'up' },
]

const warnings = [
  { car: '迈巴赫GLS600', days: 92, suggestion: '建议降价8%加速周转' },
  { car: '奔驰S450', days: 78, suggestion: '建议参加置换活动' },
]

const hotCars = [
  { car: '保时捷911', days: 3, margin: '28%' },
]

const onExport = () => Taro.showToast({ title: '报表已导出', icon: 'none' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.page-header { padding: 100rpx 32rpx 24rpx; }
.page-title { font-size: 40rpx; font-weight: 700; color: $color-text-primary; display: block; }
.page-subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }

.pnl-card { margin: 0 32rpx 32rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx; }
.pnl-row { display: flex; gap: 16rpx; }
.pnl-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8rpx; &.highlight { background: rgba(3,144,74,0.06); padding: 16rpx; border-radius: $radius-md; } }
.pnl-label { font-size: 22rpx; color: $color-text-tertiary; text-transform: uppercase; }
.pnl-value { font-size: 28rpx; font-weight: 700; color: $color-text-primary; &.revenue { color: $color-text-primary; } &.profit { color: $color-success; } }
.pnl-trend { font-size: 20rpx; &.up { color: $color-success; } }

.section { padding: 0 32rpx; margin-bottom: 40rpx; }
.section-header { font-size: 22rpx; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $color-text-tertiary; margin-bottom: 20rpx; }

.breakdown-list { display: flex; flex-direction: column; gap: 16rpx; }
.breakdown-item { display: flex; align-items: center; gap: 16rpx; }
.breakdown-label { width: 120rpx; font-size: 24rpx; color: $color-text-primary; }
.breakdown-bar-wrap { flex: 1; height: 20rpx; background: $color-background-secondary; border-radius: 4rpx; overflow: hidden; }
.breakdown-bar { height: 100%; border-radius: 4rpx; }
.breakdown-value { font-size: 20rpx; color: $color-text-tertiary; white-space: nowrap; }

.expense-list { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 8rpx 24rpx; }
.expense-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 0; border-bottom: 1rpx solid $color-divider; &:last-child { border-bottom: none; } }
.expense-dot { width: 12rpx; height: 12rpx; border-radius: 50%; flex-shrink: 0; }
.expense-label { flex: 1; font-size: 26rpx; color: $color-text-primary; }
.expense-value { font-size: 26rpx; font-weight: 500; color: $color-text-primary; }

.cost-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16rpx; }
.cost-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx 16rpx; display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.cost-label { font-size: 22rpx; color: $color-text-tertiary; }
.cost-value { font-size: 28rpx; font-weight: 700; color: $color-text-primary; }
.cost-change { font-size: 20rpx; &.up { color: $color-success; } &.neutral { color: $color-text-tertiary; } }

.alert-list { display: flex; flex-direction: column; gap: 12rpx; }
.alert-item { display: flex; gap: 16rpx; padding: 20rpx; border-radius: $radius-lg; &.warning { background: $color-warning-bg; border: 1rpx solid rgba(232,168,56,0.2); } &.success { background: $color-success-bg; border: 1rpx solid rgba(3,144,74,0.2); } }
.alert-icon { font-size: 28rpx; color: $color-warning; &.success-icon { color: $color-success; } }
.alert-info { flex: 1; }
.alert-name { font-size: 24rpx; font-weight: 500; color: $color-text-primary; display: block; }
.alert-suggestion { font-size: 22rpx; color: $color-text-secondary; margin-top: 4rpx; }

.settlement-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 24rpx; }
.settlement-row { display: flex; align-items: center; justify-content: space-between; padding: 12rpx 0; }
.settlement-label { font-size: 26rpx; color: $color-text-primary; }
.settlement-value { font-size: 24rpx; color: $color-text-secondary; &.done { color: $color-success; } }
.btn-primary-full { height: 80rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.btn-text { font-size: 26rpx; font-weight: 600; color: #fff; }
</style>
