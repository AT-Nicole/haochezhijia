<template>
  <View class="page">
    <!-- Search Bar -->
    <View class="search-section">
      <View class="search-bar" @tap="onSearch">
        <Text class="search-icon">🔍</Text>
        <Text class="search-placeholder">搜索品牌、车型</Text>
      </View>
    </View>

    <!-- Category Tabs -->
    <ScrollView scroll-x class="category-scroll">
      <View class="category-tabs">
        <View
          class="category-tab"
          :class="{ active: activeCategory === cat }"
          v-for="cat in categories"
          :key="cat"
          @tap="activeCategory = cat"
        >
          <Text class="category-text">{{ cat }}</Text>
        </View>
      </View>
    </ScrollView>

    <!-- AI Section Label -->
    <View class="section-label-row">
      <Text class="section-icon">✨</Text>
      <Text class="section-label">AI推荐</Text>
    </View>

    <!-- Horizontal AI Cards -->
    <ScrollView scroll-x class="ai-scroll">
      <View class="ai-cards">
        <View class="ai-card" v-for="car in aiRecommendCars" :key="car.name" @tap="goDetail(car)">
          <View class="ai-card-image" :style="{ backgroundColor: car.bg }">
            <Text class="ai-card-image-text">{{ car.short }}</Text>
          </View>
          <View class="ai-card-info">
            <Text class="ai-card-name">{{ car.name }}</Text>
            <Text class="ai-card-spec">{{ car.spec }}</Text>
            <View class="ai-card-bottom">
              <Text class="ai-card-price">{{ car.price }}</Text>
              <Text class="ai-card-match">{{ car.match }}%</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

    <!-- In-Stock Section -->
    <View class="section-label-row">
      <Text class="section-label">在库车辆</Text>
      <Text class="section-link" @tap="onShowAll">查看全部 ></Text>
    </View>

    <!-- Vehicle List -->
    <View class="car-list">
      <View class="car-item" v-for="car in stockCars" :key="car.name" @tap="goDetail(car)">
        <View class="car-item-image" :style="{ backgroundColor: car.bg }">
          <Text class="car-item-image-text">{{ car.short }}</Text>
          <Text v-if="car.tag" class="car-item-tag" :class="car.tagClass">{{ car.tag }}</Text>
        </View>
        <View class="car-item-info">
          <Text class="car-item-name">{{ car.name }}</Text>
          <Text class="car-item-desc">{{ car.desc }}</Text>
          <View class="car-item-bottom">
            <Text class="car-item-price">{{ car.price }}</Text>
            <Text class="car-item-dealer">{{ car.dealer }}</Text>
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

const categories = ['全部', '轿车', 'SUV', '跑车', '新能源', 'MPV']
const activeCategory = ref('全部')

const aiRecommendCars = ref([
  { name: '迈巴赫S480', short: '迈巴赫', spec: '2024 · 4.0T · 9AT', price: '¥288万', match: 96, dealer: '深圳尊享名车', bg: '#1a1a2e', _id: '1' },
  { name: '奔驰 G63', short: 'G63', spec: '2024 · 4.0T · AMG', price: '¥258万', match: 94, dealer: '粤港澳大湾区车行', bg: '#2d2d3a', _id: '2' },
  { name: '保时捷911', short: '911', spec: '2024 · 3.7T · PDK', price: '¥198万', match: 92, dealer: '鹏程豪华汽车', bg: '#1e2a1e', _id: '3' },
])

const stockCars = ref([
  { name: '迈巴赫S680', short: 'S680', desc: '2024 · 6.0T · 黑色 · 5座', price: '¥368万', dealer: '深圳尊享名车', tag: 'VIP', tagClass: 'tag-vip', bg: '#1a1a2e', _id: '4' },
  { name: '奔驰G63 AMG', short: 'G63', desc: '2024 · 4.0T · 白色 · 5座', price: '¥258万', dealer: '粤港澳大湾区车行', tag: '', tagClass: '', bg: '#2d2d3a', _id: '5' },
  { name: '保时捷911 Turbo', short: '911T', desc: '2024 · 3.7T · 红色 · 2座', price: '¥236万', dealer: '鹏程豪华汽车', tag: '', tagClass: '', bg: '#2a1a1a', _id: '6' },
  { name: '迈巴赫GLS600', short: 'GLS', desc: '2024 · 4.0T · 深蓝 · 4座', price: '¥298万', dealer: '深圳尊享名车', tag: 'VIP', tagClass: 'tag-vip', bg: '#1a2a2e', _id: '7' },
  { name: '路虎揽胜运动版', short: '揽胜', desc: '2024 · 3.0T · 黑色 · 7座', price: '¥168万', dealer: '粤淘名车', tag: '', tagClass: '', bg: '#1e1e2e', _id: '8' },
])

const goDetail = (car) => {
  Taro.navigateTo({ url: `/pages/car-detail/index?id=${car._id}&name=${car.name}` })
}

const onSearch = () => {
  Taro.navigateTo({ url: '/pages/showroom/index' })
}

const onShowAll = () => {
  Taro.showToast({ title: '加载更多...', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.search-section { padding: 16rpx 32rpx; }
.search-bar { display: flex; align-items: center; gap: 16rpx; height: 72rpx; padding: 0 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.search-icon { font-size: 28rpx; }
.search-placeholder { font-size: 26rpx; color: $color-text-tertiary; }
.category-scroll { margin-bottom: 24rpx; }
.category-tabs { display: flex; gap: 16rpx; padding: 0 32rpx; }
.category-tab { padding: 12rpx 28rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; white-space: nowrap; &.active { background: $color-primary; border-color: $color-primary; .category-text { color: #fff; } } }
.category-text { font-size: 24rpx; font-weight: 500; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.03em; }
.section-label-row { display: flex; align-items: center; gap: 8rpx; padding: 0 32rpx; margin-bottom: 20rpx; }
.section-icon { font-size: 24rpx; }
.section-label { font-size: 22rpx; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $color-text-tertiary; }
.section-link { font-size: 22rpx; color: $color-primary; font-weight: 500; }

.ai-scroll { margin-bottom: 32rpx; }
.ai-cards { display: flex; gap: 20rpx; padding: 0 32rpx; }
.ai-card { width: 340rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; overflow: hidden; flex-shrink: 0; }
.ai-card-image { height: 200rpx; display: flex; align-items: center; justify-content: center; }
.ai-card-image-text { font-size: 28rpx; color: rgba(255,255,255,0.5); font-weight: 600; }
.ai-card-info { padding: 20rpx; }
.ai-card-name { font-size: 28rpx; font-weight: 600; color: $color-text-primary; display: block; }
.ai-card-spec { font-size: 22rpx; color: $color-text-tertiary; display: block; margin-top: 4rpx; }
.ai-card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }
.ai-card-price { font-size: 30rpx; font-weight: 700; color: $color-primary; }
.ai-card-match { font-size: 22rpx; font-weight: 500; color: $color-primary; background: rgba(218,41,28,0.06); padding: 4rpx 12rpx; border-radius: $radius-xs; }

.car-list { padding: 0 32rpx; display: flex; flex-direction: column; gap: 16rpx; }
.car-item { display: flex; gap: 20rpx; padding: 20rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.car-item-image { width: 200rpx; height: 160rpx; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; overflow: hidden; }
.car-item-image-text { font-size: 24rpx; color: rgba(255,255,255,0.5); font-weight: 600; }
.car-item-tag { position: absolute; top: 8rpx; left: 8rpx; font-size: 18rpx; font-weight: 600; padding: 2rpx 8rpx; border-radius: $radius-xs; &.tag-vip { background: rgba(232,184,0,0.9); color: #000; } }
.car-item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.car-item-name { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.car-item-desc { font-size: 22rpx; color: $color-text-tertiary; margin-top: 4rpx; }
.car-item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.car-item-price { font-size: 28rpx; font-weight: 700; color: $color-primary; }
.car-item-dealer { font-size: 20rpx; color: $color-text-tertiary; }
</style>
