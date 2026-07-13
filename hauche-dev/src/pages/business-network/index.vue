<template>
  <View class="page">
    <View class="page-header">
      <Text class="page-title">企业家资源圈</Text>
      <Text class="page-subtitle">高端圈层 · AI资源撮合</Text>
    </View>

    <!-- Stats -->
    <View class="stats-row">
      <View class="stat-card">
        <Text class="stat-value">186</Text>
        <Text class="stat-label">圈内好友</Text>
      </View>
      <View class="stat-card accent">
        <Text class="stat-value">42</Text>
        <Text class="stat-label">本月互动</Text>
      </View>
      <View class="stat-card">
        <Text class="stat-value">8</Text>
        <Text class="stat-label">商务对接</Text>
      </View>
    </View>

    <!-- AI Recommendations -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">AI 为你推荐</Text>
        <Text class="ai-tag">匹配</Text>
      </View>
      <View class="match-list">
        <View class="match-card" v-for="m in aiMatches" :key="m.name">
          <View class="match-avatar" :style="{ background: m.bg }">
            <Text class="match-avatar-text">{{ m.avatar }}</Text>
          </View>
          <View class="match-info">
            <View class="match-header-row">
              <Text class="match-name">{{ m.name }}</Text>
              <Text class="match-industry">{{ m.industry }}</Text>
            </View>
            <Text class="match-desc">{{ m.desc }}</Text>
            <View class="match-action" @tap="onConnect(m.name)">
              <Text class="match-action-text">发起对接 ></Text>
            </View>
          </View>
        </View>
      </View>
    </View>

    <!-- Industry Directory -->
    <View class="section">
      <Text class="section-header">行业资源</Text>
      <View class="industry-pills">
        <View class="industry-pill" v-for="ind in industries" :key="ind" :class="{ active: ind === '全部' }" @tap="activeIndustry = ind">
          <Text class="industry-pill-text">{{ ind }}</Text>
        </View>
      </View>
      <View class="member-grid">
        <View class="member-card" v-for="member in members" :key="member.name">
          <View class="member-avatar" :style="{ background: member.bg }">
            <Text class="member-avatar-text">{{ member.avatar }}</Text>
          </View>
          <Text class="member-name">{{ member.name }}</Text>
          <Text class="member-company">{{ member.company }}</Text>
        </View>
      </View>
    </View>

    <!-- Networking Events -->
    <View class="section">
      <Text class="section-header">圈层活动</Text>
      <View class="event-list">
        <View class="event-card" v-for="ev in events" :key="ev.title">
          <View class="event-date-badge">
            <Text class="event-month">{{ ev.month }}</Text>
            <Text class="event-day">{{ ev.day }}</Text>
          </View>
          <View class="event-info">
            <Text class="event-title">{{ ev.title }}</Text>
            <Text class="event-location">{{ ev.location }}</Text>
            <Text class="event-count">{{ ev.registered }}人已报名</Text>
          </View>
          <View class="event-btn" @tap="onRegister(ev.title)">
            <Text class="event-btn-text">报名</Text>
          </View>
        </View>
      </View>
    </View>

    <!-- Deal Board -->
    <View class="section">
      <Text class="section-header">成交看板</Text>
      <View class="deal-list">
        <View class="deal-item" v-for="deal in deals" :key="deal.desc">
          <Text class="deal-text">{{ deal.text }}</Text>
          <Text class="deal-result" :class="deal.statusClass">{{ deal.result }}</Text>
        </View>
      </View>
    </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const aiMatches = [
  { name: '张总', avatar: '张', bg: 'rgba(218,41,28,0.03)', industry: '科技', desc: '与你有3位共同好友，在寻找豪华MPV' },
  { name: '刘总', avatar: '刘', bg: 'rgba(232,184,0,0.08)', industry: '地产', desc: '旗下5辆公司用车，年采购预算2000万' },
  { name: '赵总', avatar: '赵', bg: 'rgba(76,152,185,0.06)', industry: '金融', desc: '近期入手保时捷卡宴，寻找高端保险资源' },
]

const industries = ['全部', '科技', '地产', '金融', '制造', '医疗']
const activeIndustry = ref('全部')

const members = [
  { name: '张×', avatar: '张', bg: 'rgba(218,41,28,0.03)', company: '张科科技 · CEO' },
  { name: '刘×', avatar: '刘', bg: 'rgba(232,184,0,0.08)', company: '恒基地产 · 董事长' },
  { name: '王×', avatar: '王', bg: 'rgba(3,144,74,0.06)', company: '汇金投资 · 合伙人' },
  { name: '陈×', avatar: '陈', bg: 'rgba(76,152,185,0.06)', company: '嘉和制造 · 总裁' },
  { name: '李×', avatar: '李', bg: 'rgba(241,58,44,0.04)', company: '仁和医疗 · 院长' },
  { name: '赵×', avatar: '赵', bg: 'rgba(232,168,56,0.06)', company: '锦程金融 · VP' },
  { name: '黄×', avatar: '黄', bg: 'rgba(218,41,28,0.03)', company: '华创科技 · CTO' },
  { name: '周×', avatar: '周', bg: 'rgba(76,152,185,0.06)', company: '鼎盛地产 · 总裁' },
]

const events = [
  { title: '大湾区豪车圈·企业家私享晚宴', location: '深圳湾1号 · 7月25日', month: '7月', day: '25', registered: '32' },
  { title: '科技×豪车·跨界沙龙', location: '前海深港合作区 · 8月3日', month: '8月', day: '3', registered: '18' },
]

const deals = [
  { text: '王× → 李× 车辆置换合作 ¥280万', result: '已完成', statusClass: 'done' },
  { text: '张总 → 刘总 企业用车采购 5辆', result: '已完成', statusClass: 'done' },
  { text: '陈总 → 赵总 高端保险资源对接', result: '进行中', statusClass: 'active' },
]

const onConnect = (name) => Taro.showToast({ title: `已向${name}发起对接`, icon: 'none' })
const onRegister = (title) => Taro.showToast({ title: `已报名${title}`, icon: 'none' })
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

.match-list { display: flex; flex-direction: column; gap: 16rpx; }
.match-card { display: flex; gap: 16rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.match-avatar { width: 72rpx; height: 72rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.match-avatar-text { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.match-info { flex: 1; }
.match-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4rpx; }
.match-name { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.match-industry { font-size: 20rpx; font-weight: 500; color: $color-primary; background: rgba(218,41,28,0.06); padding: 4rpx 12rpx; border-radius: $radius-xs; }
.match-desc { font-size: 22rpx; color: $color-text-secondary; margin-bottom: 12rpx; }
.match-action { }
.match-action-text { font-size: 22rpx; color: $color-primary; font-weight: 500; }

.industry-pills { display: flex; gap: 12rpx; overflow-x: auto; margin-bottom: 20rpx; }
.industry-pill { padding: 12rpx 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-full; white-space: nowrap; &.active { background: $color-primary; border-color: $color-primary; .industry-pill-text { color: #fff; } } }
.industry-pill-text { font-size: 24rpx; color: $color-text-secondary; font-weight: 500; }

.member-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.member-card { display: flex; flex-direction: column; align-items: center; gap: 8rpx; padding: 20rpx 12rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.member-avatar { width: 64rpx; height: 64rpx; border-radius: $radius-sm; display: flex; align-items: center; justify-content: center; }
.member-avatar-text { font-size: 24rpx; font-weight: 600; color: #fff; }
.member-name { font-size: 22rpx; font-weight: 500; color: $color-text-primary; }
.member-company { font-size: 18rpx; color: $color-text-tertiary; }

.event-list { display: flex; flex-direction: column; gap: 16rpx; }
.event-card { display: flex; gap: 16rpx; padding: 20rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; align-items: center; }
.event-date-badge { width: 80rpx; height: 80rpx; background: $color-primary; border-radius: $radius-md; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
.event-month { font-size: 18rpx; color: rgba(255,255,255,0.8); }
.event-day { font-size: 32rpx; font-weight: 700; color: #fff; }
.event-info { flex: 1; }
.event-title { font-size: 24rpx; font-weight: 600; color: $color-text-primary; display: block; }
.event-location { font-size: 20rpx; color: $color-text-tertiary; margin-top: 4rpx; display: block; }
.event-count { font-size: 20rpx; color: $color-primary; margin-top: 4rpx; display: block; }
.event-btn { padding: 12rpx 28rpx; background: $color-primary; border-radius: $radius-sm; }
.event-btn-text { font-size: 22rpx; font-weight: 600; color: #fff; }

.deal-list { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; padding: 8rpx 24rpx; }
.deal-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $color-divider; &:last-child { border-bottom: none; } }
.deal-text { font-size: 24rpx; color: $color-text-primary; flex: 1; }
.deal-result { font-size: 22rpx; font-weight: 500; white-space: nowrap; &.done { color: $color-success; } &.active { color: $color-info; } }
</style>
