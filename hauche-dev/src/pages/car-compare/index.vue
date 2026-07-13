<template>
  <View class="page">
    <!-- Header -->
    <View class="header">
      <View class="header-back" @tap="goBack"><Text class="back-text">‹</Text></View>
      <Text class="header-title">多车对比</Text>
      <View class="header-spacer" />
    </View>

    <View class="content">
      <!-- Selected Cars -->
      <ScrollView scroll-x class="selected-cars">
        <View class="selected-list">
          <View class="selected-card" v-for="car in selectedCars" :key="car.name">
            <Text class="selected-name">{{ car.name }}</Text>
            <Text class="selected-price">¥{{ car.price }}万</Text>
          </View>
          <View class="selected-add" @tap="goTo('/pages/showroom/index')">
            <Text class="selected-add-text">+ 添加</Text>
          </View>
        </View>
      </ScrollView>

      <!-- AI Recommendation -->
      <View class="ai-card">
        <Text class="ai-card-icon">✨</Text>
        <Text class="ai-card-text">AI推荐：迈巴赫S480 综合评分最高 (96分)，最适合商务出行</Text>
      </View>

      <!-- Comparison Table -->
      <View class="compare-table">
        <View class="compare-row compare-header">
          <Text class="compare-label"></Text>
          <Text class="compare-col" v-for="car in selectedCars" :key="car.name" :class="{ highlight: car.best }">{{ car.short }}</Text>
        </View>
        <View class="compare-row" v-for="row in compareData" :key="row.label">
          <Text class="compare-label">{{ row.label }}</Text>
          <Text class="compare-col" v-for="(val, idx) in row.values" :key="idx" :class="{ best: val === row.best }">{{ val }}</Text>
        </View>
      </View>

      <!-- AI Summary -->
      <View class="summary-card">
        <Text class="summary-title">AI 分析</Text>
        <Text class="summary-text">迈巴赫S480在舒适性和商务属性领先；奔驰G63动力最强、保值率优秀；保时捷911操控最佳。综合：S480(96) > G63(94) > 911(91)</Text>
      </View>

      <!-- Actions -->
      <View class="action-row">
        <View class="btn-primary-full"><Text class="btn-text">生成对比报告</Text></View>
        <View class="btn-outline" @tap="goTo('/pages/ai-chat/index')"><Text class="btn-outline-text">咨询顾问</Text></View>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const selectedCars = ref([
  { name: '迈巴赫S480', short: 'S480', price: 288, best: true },
  { name: '奔驰G63', short: 'G63', price: 258, best: false },
  { name: '保时捷911', short: '911', price: 198, best: false },
])

const compareData = ref([
  { label: '价格', values: ['¥288万', '¥258万', '¥198万'], best: '¥198万' },
  { label: '动力', values: ['4.0T V8', '4.0T V8', '3.7T H6'], best: '4.0T V8' },
  { label: '马力', values: ['503匹', '585匹', '473匹'], best: '585匹' },
  { label: '加速', values: ['4.9秒', '4.5秒', '3.6秒'], best: '3.6秒' },
  { label: '座位', values: ['5座', '5座', '2座'], best: '5座' },
  { label: '油耗', values: ['11.2L', '14.5L', '10.8L'], best: '10.8L' },
  { label: '保值率', values: ['82%', '85%', '88%'], best: '88%' },
  { label: '舒适', values: ['★★★★★', '★★★★', '★★★'], best: '★★★★★' },
  { label: '运动', values: ['★★★', '★★★★★', '★★★★★'], best: '★★★★★' },
])

const goBack = () => Taro.navigateBack()
const goTo = (url) => Taro.navigateTo({ url })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 88rpx; display: flex; align-items: center; padding: 0 24rpx; background: $color-surface; border-bottom: 1rpx solid $color-border; }
.header-back { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; }
.back-text { font-size: 40rpx; color: $color-text-primary; line-height: 1; }
.header-title { flex: 1; text-align: center; font-size: 30rpx; font-weight: 600; color: $color-text-primary; }
.header-spacer { width: 64rpx; }
.content { padding: 100rpx 32rpx 40rpx; }

.selected-cars { margin-bottom: 24rpx; }
.selected-list { display: flex; gap: 16rpx; padding: 4rpx; }
.selected-card { width: 180rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-md; padding: 16rpx; text-align: center; flex-shrink: 0; }
.selected-name { font-size: 24rpx; font-weight: 600; color: $color-text-primary; display: block; }
.selected-price { font-size: 26rpx; font-weight: 700; color: $color-primary; display: block; margin-top: 4rpx; }
.selected-add { width: 80rpx; border: 2rpx dashed $color-border; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.selected-add-text { font-size: 24rpx; color: $color-text-tertiary; }

.ai-card { display: flex; align-items: center; gap: 12rpx; padding: 20rpx 24rpx; background: rgba(218,41,28,0.03); border: 1rpx solid $color-primary; border-radius: $radius-lg; margin-bottom: 24rpx; }
.ai-card-icon { font-size: 24rpx; }
.ai-card-text { font-size: 24rpx; color: $color-text-primary; line-height: 1.5; }

.compare-table { background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; overflow: hidden; margin-bottom: 24rpx; }
.compare-row { display: flex; border-bottom: 1rpx solid $color-divider; &:last-child { border-bottom: none; } }
.compare-header { background: $color-background-secondary; }
.compare-label { width: 140rpx; padding: 20rpx 16rpx; font-size: 22rpx; color: $color-text-tertiary; display: flex; align-items: center; font-weight: 500; }
.compare-col { flex: 1; padding: 20rpx 12rpx; font-size: 24rpx; color: $color-text-primary; text-align: center; display: flex; align-items: center; justify-content: center; &.highlight { color: $color-primary; font-weight: 600; } &.best { color: $color-primary; font-weight: 600; } }

.summary-card { padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; margin-bottom: 24rpx; }
.summary-title { font-size: 24rpx; font-weight: 600; color: $color-text-primary; margin-bottom: 12rpx; }
.summary-text { font-size: 24rpx; color: $color-text-secondary; line-height: 1.6; }

.action-row { display: flex; gap: 16rpx; }
.btn-primary-full { flex: 2; height: 80rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.btn-text { font-size: 26rpx; font-weight: 600; color: #fff; }
.btn-outline { flex: 1; height: 80rpx; display: flex; align-items: center; justify-content: center; border: 1rpx solid $color-primary; border-radius: $radius-sm; }
.btn-outline-text { font-size: 26rpx; font-weight: 500; color: $color-primary; }
</style>
