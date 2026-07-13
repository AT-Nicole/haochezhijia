<template>
  <View class="page">
    <!-- Car Images Placeholder -->
    <View class="car-gallery" :style="{ backgroundColor: car.bg }">
      <Text class="car-gallery-text">{{ car.short }}</Text>
      <View class="gallery-counter">
        <Text class="gallery-counter-text">1 / 6</Text>
      </View>
      <View class="gallery-back" @tap="goBack">
        <Text class="gallery-back-text">‹</Text>
      </View>
    </View>

    <!-- Price & Name -->
    <View class="price-section">
      <View class="price-row">
        <Text class="price-value">{{ car.price }}</Text>
        <Text class="price-tag">在售</Text>
      </View>
      <Text class="car-title">{{ car.name }}</Text>
      <Text class="car-subtitle">{{ car.fullSpec }}</Text>
      <View class="dealer-row">
        <View class="dealer-avatar">
          <Text class="dealer-avatar-text">{{ car.dealerShort }}</Text>
        </View>
        <View class="dealer-info">
          <Text class="dealer-name">{{ car.dealer }}</Text>
          <Text class="dealer-rating">{{ car.rating }} · 在售 {{ car.stock }} 辆 · 认证车行</Text>
        </View>
      </View>
    </View>

    <!-- AI Match Score -->
    <View class="ai-match-card">
      <View class="ai-match-header">
        <Text class="ai-match-icon">✨</Text>
        <Text class="ai-match-label">AI 综合评分</Text>
        <Text class="ai-match-score">{{ car.aiScore }}分</Text>
      </View>
      <Text class="ai-match-desc">{{ car.aiReason }}</Text>
    </View>

    <!-- Key Specs Grid -->
    <View class="specs-grid">
      <View class="spec-item" v-for="spec in specs" :key="spec.label">
        <Text class="spec-label">{{ spec.label }}</Text>
        <Text class="spec-value">{{ spec.value }}</Text>
      </View>
    </View>

    <!-- Action Buttons -->
    <View class="action-bar">
      <View class="action-secondary" @tap="onCompare">
        <Text class="action-secondary-text">加入对比</Text>
      </View>
      <View class="action-primary" @tap="onInquiry">
        <Text class="action-primary-text">立即询价</Text>
      </View>
    </View>

    <View style="height: 200rpx" />
  </View>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

const car = ref({
  name: '迈巴赫S480',
  short: '迈巴赫',
  fullSpec: '2024款 · 4.0T V8 双涡轮增压 · 9速手自一体',
  price: '¥288万',
  dealer: '深圳尊享名车',
  dealerShort: '尊',
  rating: '4.9',
  stock: 128,
  aiScore: 96,
  aiReason: '商务舒适性行业标杆，适合企业家日常出行。保值率优秀，售后网络完善。',
  bg: '#1a1a2e'
})

const specs = ref([
  { label: '马力', value: '503匹' },
  { label: '加速', value: '4.9秒' },
  { label: '座位', value: '5座' },
  { label: '油耗', value: '11.2L' },
  { label: '保值率', value: '82%' },
  { label: '舒适', value: '★★★★★' },
  { label: '运动', value: '★★★' },
  { label: '豪华', value: '★★★★★' },
])

onMounted(() => {
  const params = Taro.getCurrentInstance().router?.params
  if (params?.name) {
    car.value.name = decodeURIComponent(params.name)
    car.value.short = params.short || car.value.name.substring(0, 2)
  }
})

const goBack = () => Taro.navigateBack()
const onCompare = () => Taro.navigateTo({ url: '/pages/car-compare/index' })
const onInquiry = () => Taro.navigateTo({ url: '/pages/ai-chat/index' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }

.car-gallery { height: 500rpx; display: flex; align-items: center; justify-content: center; position: relative; }
.car-gallery-text { font-size: 48rpx; color: rgba(255,255,255,0.4); font-weight: 700; }
.gallery-counter { position: absolute; right: 24rpx; bottom: 24rpx; background: rgba(0,0,0,0.5); padding: 4rpx 16rpx; border-radius: $radius-full; }
.gallery-counter-text { font-size: 20rpx; color: #fff; }
.gallery-back { position: absolute; left: 24rpx; top: 60rpx; width: 64rpx; height: 64rpx; background: rgba(0,0,0,0.3); border-radius: $radius-full; display: flex; align-items: center; justify-content: center; }
.gallery-back-text { font-size: 36rpx; color: #fff; line-height: 1; }

.price-section { padding: 32rpx; }
.price-row { display: flex; align-items: center; gap: 16rpx; margin-bottom: 8rpx; }
.price-value { font-size: 48rpx; font-weight: 700; color: $color-primary; }
.price-tag { font-size: 20rpx; font-weight: 600; color: $color-success; background: $color-success-bg; padding: 4rpx 12rpx; border-radius: $radius-sm; }
.car-title { font-size: 36rpx; font-weight: 600; color: $color-text-primary; display: block; }
.car-subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }
.dealer-row { display: flex; align-items: center; gap: 16rpx; margin-top: 24rpx; padding-top: 24rpx; border-top: 1rpx solid $color-divider; }
.dealer-avatar { width: 64rpx; height: 64rpx; border-radius: $radius-sm; background: $color-primary; display: flex; align-items: center; justify-content: center; }
.dealer-avatar-text { font-size: 24rpx; color: #fff; font-weight: 600; }
.dealer-info { flex: 1; }
.dealer-name { font-size: 26rpx; font-weight: 500; color: $color-text-primary; }
.dealer-rating { font-size: 22rpx; color: $color-text-tertiary; margin-top: 2rpx; }

.ai-match-card { margin: 0 32rpx 32rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-primary; border-radius: $radius-lg; }
.ai-match-header { display: flex; align-items: center; gap: 8rpx; margin-bottom: 12rpx; }
.ai-match-icon { font-size: 24rpx; }
.ai-match-label { font-size: 22rpx; font-weight: 600; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.05em; flex: 1; }
.ai-match-score { font-size: 32rpx; font-weight: 700; color: $color-primary; }
.ai-match-desc { font-size: 24rpx; color: $color-text-secondary; line-height: 1.6; }

.specs-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16rpx; padding: 0 32rpx 32rpx; }
.spec-item { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-md; padding: 20rpx 16rpx; display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.spec-label { font-size: 20rpx; color: $color-text-tertiary; text-transform: uppercase; letter-spacing: 0.03em; }
.spec-value { font-size: 26rpx; font-weight: 600; color: $color-text-primary; }

.action-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; gap: 16rpx; padding: 16rpx 32rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); background: $color-surface; border-top: 1rpx solid $color-border; }
.action-secondary { flex: 1; height: 88rpx; display: flex; align-items: center; justify-content: center; border: 1rpx solid $color-primary; border-radius: $radius-sm; }
.action-secondary-text { font-size: 28rpx; font-weight: 500; color: $color-primary; }
.action-primary { flex: 2; height: 88rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.action-primary-text { font-size: 28rpx; font-weight: 600; color: #fff; }
</style>
