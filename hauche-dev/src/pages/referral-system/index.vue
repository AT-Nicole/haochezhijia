<template>
  <View class="page">
    <View class="page-header">
      <Text class="page-title">裂变分佣</Text>
      <Text class="page-subtitle">老客推荐 · 佣金自动到账</Text>
    </View>

    <!-- My Earnings -->
    <View class="earnings-row">
      <View class="earnings-card main">
        <Text class="earnings-value">¥128,500</Text>
        <Text class="earnings-label">累计佣金</Text>
      </View>
      <View class="earnings-card">
        <Text class="earnings-value">¥23,600</Text>
        <Text class="earnings-label">本月到账</Text>
      </View>
      <View class="earnings-card">
        <Text class="earnings-value">18</Text>
        <Text class="earnings-label">成功推荐</Text>
      </View>
    </View>

    <!-- Commission Rules -->
    <View class="section">
      <Text class="section-header">分佣规则</Text>
      <View class="rules-card">
        <View class="rule-item" v-for="rule in rules" :key="rule.label">
          <Text class="rule-label">{{ rule.label }}</Text>
          <Text class="rule-amount">{{ rule.amount }}</Text>
        </View>
        <View class="rule-note">
          <Text class="rule-note-text">佣金T+3自动到账，无需人工结算</Text>
        </View>
      </View>
    </View>

    <!-- Generate Poster -->
    <View class="section">
      <Text class="section-header">一键生成转介绍海报</Text>
      <View class="poster-card">
        <View class="poster-preview" :style="{ background: 'linear-gradient(135deg, #1a1a2e 0%, #DA291C 100%)' }">
          <Text class="poster-brand">豪车之家</Text>
          <Text class="poster-slogan">尊享名车 · 值得信赖</Text>
          <View class="poster-qr">
            <Text class="poster-qr-text">专属二维码</Text>
          </View>
        </View>
        <View class="poster-actions">
          <View class="btn-primary-full" @tap="onGeneratePoster">
            <Text class="btn-text">生成我的海报</Text>
          </View>
          <View class="btn-outline" @tap="onShareWechat">
            <Text class="btn-outline-text">分享到微信</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- My Referral Network -->
    <View class="section">
      <Text class="section-header">我的推荐网络</Text>
      <View class="network-section">
        <Text class="network-title">直接推荐 (12人)</Text>
        <View class="network-list">
          <View class="network-item" v-for="item in directReferrals" :key="item.name">
            <View class="network-avatar" :style="{ background: item.bg }">
              <Text class="network-avatar-text">{{ item.avatar }}</Text>
            </View>
            <View class="network-info">
              <Text class="network-name">{{ item.name }}</Text>
              <Text class="network-result">{{ item.result }}</Text>
            </View>
          </View>
        </View>
      </View>
      <View class="network-section">
        <Text class="network-title">二级推荐 (8人)</Text>
        <View class="network-list">
          <View class="network-item" v-for="item in indirectReferrals" :key="item.name">
            <View class="network-avatar" style="background: rgba(76,152,185,0.06)">
              <Text class="network-avatar-text">{{ item.avatar }}</Text>
            </View>
            <View class="network-info">
              <Text class="network-name">{{ item.name }}</Text>
              <Text class="network-result">{{ item.result }}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>

    <!-- AI Referral Tools -->
    <View class="section">
      <Text class="section-header">AI 裂变工具</Text>
      <View class="ai-tools">
        <View class="ai-tool-item" v-for="tool in aiTools" :key="tool.label">
          <Text class="ai-tool-label">{{ tool.label }}</Text>
          <Text class="ai-tool-desc">{{ tool.desc }}</Text>
          <Text class="ai-tool-arrow">></Text>
        </View>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const rules = [
  { label: '推荐购车成交', amount: '佣金 1% (起步¥5,000)' },
  { label: '推荐车行入驻', amount: '佣金 ¥10,000/家' },
  { label: '二级推荐成交', amount: '佣金 0.3%' },
]

const directReferrals = [
  { name: '王×鸿', avatar: '王', bg: 'rgba(218,41,28,0.03)', result: '已成交 ¥5,000' },
  { name: '李×明', avatar: '李', bg: 'rgba(232,184,0,0.08)', result: '已成交 ¥8,000' },
  { name: '张×伟', avatar: '张', bg: 'rgba(3,144,74,0.06)', result: '已成交 ¥5,000' },
]

const indirectReferrals = [
  { name: '赵× 推荐 陈×', avatar: '陈', result: '已成交 ¥1,500' },
]

const aiTools = [
  { label: '自动识别高净值客户', desc: 'AI分析客户社交圈' },
  { label: '自动生成个性化推荐语', desc: '根据车型和客户画像定制' },
  { label: '自动追踪转化路径', desc: '从推荐到成交全程追踪' },
]

const onGeneratePoster = () => Taro.showToast({ title: '海报已生成', icon: 'none' })
const onShareWechat = () => Taro.showToast({ title: '已分享到微信', icon: 'none' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.page-header { padding: 100rpx 32rpx 24rpx; }
.page-title { font-size: 40rpx; font-weight: 700; color: $color-text-primary; display: block; }
.page-subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }

.earnings-row { display: flex; gap: 16rpx; padding: 0 32rpx 32rpx; }
.earnings-card { flex: 1; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; padding: 24rpx 16rpx; display: flex; flex-direction: column; align-items: center; &.main { border-color: $color-primary; .earnings-value { color: $color-primary; } } }
.earnings-value { font-size: 36rpx; font-weight: 700; color: $color-text-primary; font-variant-numeric: tabular-nums; }
.earnings-label { font-size: 22rpx; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8rpx; }

.section { padding: 0 32rpx; margin-bottom: 40rpx; }
.section-header { font-size: 22rpx; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $color-text-tertiary; margin-bottom: 20rpx; }

.rules-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 8rpx 24rpx; }
.rule-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $color-divider; &:last-of-type { border-bottom: none; } }
.rule-label { font-size: 26rpx; color: $color-text-primary; }
.rule-amount { font-size: 24rpx; font-weight: 500; color: $color-primary; }
.rule-note { padding: 16rpx 0 8rpx; }
.rule-note-text { font-size: 22rpx; color: $color-text-tertiary; }

.poster-card { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; overflow: hidden; }
.poster-preview { height: 400rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16rpx; }
.poster-brand { font-size: 40rpx; font-weight: 700; color: #fff; }
.poster-slogan { font-size: 26rpx; color: rgba(255,255,255,0.8); }
.poster-qr { width: 120rpx; height: 120rpx; background: rgba(255,255,255,0.9); border-radius: $radius-md; display: flex; align-items: center; justify-content: center; margin-top: 16rpx; }
.poster-qr-text { font-size: 18rpx; color: $color-text-tertiary; }
.poster-actions { display: flex; gap: 16rpx; padding: 20rpx; }
.btn-primary-full { flex: 2; height: 72rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.btn-text { font-size: 24rpx; font-weight: 600; color: #fff; }
.btn-outline { flex: 1; height: 72rpx; display: flex; align-items: center; justify-content: center; border: 1rpx solid $color-primary; border-radius: $radius-sm; }
.btn-outline-text { font-size: 24rpx; font-weight: 500; color: $color-primary; }

.network-section { margin-bottom: 24rpx; }
.network-title { font-size: 24rpx; font-weight: 600; color: $color-text-primary; margin-bottom: 12rpx; }
.network-list { display: flex; flex-direction: column; gap: 12rpx; }
.network-item { display: flex; align-items: center; gap: 16rpx; padding: 16rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-md; }
.network-avatar { width: 56rpx; height: 56rpx; border-radius: $radius-sm; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.network-avatar-text { font-size: 22rpx; font-weight: 600; color: $color-text-primary; }
.network-info { flex: 1; display: flex; align-items: center; justify-content: space-between; }
.network-name { font-size: 24rpx; font-weight: 500; color: $color-text-primary; }
.network-result { font-size: 22rpx; color: $color-success; }

.ai-tools { display: flex; flex-direction: column; gap: 12rpx; }
.ai-tool-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.ai-tool-label { flex: 1; font-size: 26rpx; font-weight: 500; color: $color-text-primary; }
.ai-tool-desc { font-size: 22rpx; color: $color-text-tertiary; }
.ai-tool-arrow { font-size: 22rpx; color: $color-text-tertiary; }
</style>
