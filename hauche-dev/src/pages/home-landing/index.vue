<template>
  <View class="page">
    <!-- Search Bar -->
    <View class="search-row">
      <View class="search-bar" @tap="goTo('/pages/showroom/index')">
        <Text class="search-icon">🔍</Text>
        <Text class="search-text">搜索车型、品牌、服务</Text>
      </View>
      <View class="location-tag">
        <Text class="location-text">深圳</Text>
      </View>
    </View>

    <!-- Quick Entries -->
    <View class="quick-grid">
      <View class="quick-item" v-for="item in quickEntries" :key="item.label" @tap="goTo(item.url)">
        <View class="quick-icon-wrap" :style="{ backgroundColor: item.bg }">
          <Text class="quick-icon-text">{{ item.icon }}</Text>
        </View>
        <Text class="quick-label">{{ item.label }}</Text>
      </View>
    </View>

    <!-- AI Recommendations -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">AI 为你推荐</Text>
        <Text class="section-link" @tap="goTo('/pages/showroom/index')">查看更多 ></Text>
      </View>
      <ScrollView scroll-x class="car-scroll">
        <View class="car-scroll-inner">
          <View class="car-card" v-for="car in aiCars" :key="car.name" @tap="goTo('/pages/car-detail/index')">
            <View class="car-image-placeholder" :style="{ backgroundColor: car.bgColor }">
              <Text class="car-image-text">{{ car.shortName }}</Text>
            </View>
            <View class="car-info">
              <Text class="car-name">{{ car.name }}</Text>
              <Text class="car-price">{{ car.price }}</Text>
              <View class="car-dealer-row">
                <Text class="car-dealer">{{ car.dealer }}</Text>
                <Text class="car-match">{{ car.match }}% 匹配</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>

    <!-- Featured Dealers -->
    <View class="section">
      <View class="section-header-row">
        <Text class="section-header">精选车行</Text>
        <Text class="section-link">全部车行 ></Text>
      </View>
      <View class="dealer-card" v-for="dealer in dealers" :key="dealer.name">
        <View class="dealer-avatar">
          <Text class="dealer-avatar-text">{{ dealer.avatar }}</Text>
        </View>
        <View class="dealer-info">
          <Text class="dealer-name">{{ dealer.name }}</Text>
          <Text class="dealer-detail">{{ dealer.rating }} · 在售 {{ dealer.stock }} 辆</Text>
          <Text class="dealer-badge">平台认证车行</Text>
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

const quickEntries = ref([
  { icon: '🌍', label: '全球寻车', url: '/pages/national-pricing/index', bg: 'rgba(218,41,28,0.06)' },
  { icon: '✨', label: 'AI智选', url: '/pages/ai-chat/index', bg: 'rgba(218,41,28,0.06)' },
  { icon: '💰', label: '豪车金融', url: '/pages/finance-center/index', bg: 'rgba(232,184,0,0.08)' },
  { icon: '🔑', label: '终身管家', url: '/pages/butler-workbench/index', bg: 'rgba(3,144,74,0.06)' },
  { icon: '⭐', label: '车主口碑', url: '/pages/owner-reviews/index', bg: 'rgba(76,152,185,0.06)' },
  { icon: '💬', label: '车友圈', url: '/pages/car-community/index', bg: 'rgba(76,152,185,0.06)' },
  { icon: '🏆', label: '豪车排行', url: '/pages/luxury-ranking/index', bg: 'rgba(232,184,0,0.08)' },
  { icon: '📹', label: '短视频', url: '/pages/home-creator/index', bg: 'rgba(218,41,28,0.06)' },
])

const aiCars = ref([
  { name: '迈巴赫S480', shortName: '迈巴赫', price: '¥288万', dealer: '深圳尊享名车', match: 96, bgColor: '#1a1a2e' },
  { name: '奔驰 G63', shortName: 'G63', price: '¥258万', dealer: '粤港澳大湾区车行', match: 92, bgColor: '#2d2d3a' },
  { name: '保时捷911', shortName: '911', price: '¥198万', dealer: '鹏程豪华汽车', match: 89, bgColor: '#1e2a1e' },
])

const dealers = ref([
  { name: '深圳尊享名车', avatar: '尊', rating: '4.9', stock: 128 },
  { name: '粤港澳大湾区车行', avatar: '粤', rating: '4.8', stock: 96 },
  { name: '鹏程豪华汽车', avatar: '鹏', rating: '4.7', stock: 73 },
])

const goTo = (url) => {
  Taro.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page { min-height: 100vh; background: $color-background; }

// Search
.search-row { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 32rpx; }
.search-bar { flex: 1; display: flex; align-items: center; gap: 16rpx; height: 72rpx; padding: 0 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.search-icon { font-size: 28rpx; }
.search-text { font-size: 26rpx; color: $color-text-tertiary; }
.location-tag { padding: 8rpx 16rpx; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.location-text { font-size: 24rpx; color: $color-text-secondary; font-weight: 500; }

// Quick entries
.quick-grid { display: flex; flex-wrap: wrap; gap: 24rpx; padding: 24rpx 32rpx; }
.quick-item { width: calc(25% - 18rpx); display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.quick-icon-wrap { width: 88rpx; height: 88rpx; border-radius: $radius-lg; display: flex; align-items: center; justify-content: center; }
.quick-icon-text { font-size: 36rpx; }
.quick-label { font-size: 22rpx; color: $color-text-secondary; white-space: nowrap; }

// Section
.section { padding: 0 32rpx; margin-bottom: 32rpx; }
.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.section-link { font-size: 22rpx; color: $color-primary; font-weight: 500; }

// Car scroll
.car-scroll { white-space: nowrap; }
.car-scroll-inner { display: inline-flex; gap: 20rpx; padding: 4rpx; }
.car-card { width: 360rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; overflow: hidden; flex-shrink: 0; }
.car-image-placeholder { height: 220rpx; display: flex; align-items: center; justify-content: center; }
.car-image-text { font-size: 28rpx; color: rgba(255,255,255,0.6); font-weight: 600; }
.car-info { padding: 20rpx; }
.car-name { font-size: 28rpx; font-weight: 600; color: $color-text-primary; display: block; }
.car-price { font-size: 30rpx; font-weight: 700; color: $color-primary; display: block; margin-top: 4rpx; }
.car-dealer-row { display: flex; justify-content: space-between; margin-top: 8rpx; }
.car-dealer { font-size: 22rpx; color: $color-text-tertiary; }
.car-match { font-size: 22rpx; color: $color-primary; font-weight: 500; }

// Dealers
.dealer-card { display: flex; align-items: center; gap: 20rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; margin-bottom: 16rpx; }
.dealer-avatar { width: 72rpx; height: 72rpx; border-radius: $radius-sm; background: $color-primary; display: flex; align-items: center; justify-content: center; }
.dealer-avatar-text { font-size: 28rpx; color: #fff; font-weight: 600; }
.dealer-info { flex: 1; display: flex; flex-direction: column; gap: 4rpx; }
.dealer-name { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.dealer-detail { font-size: 22rpx; color: $color-text-tertiary; }
.dealer-badge { font-size: 20rpx; color: $color-primary; background: rgba(218,41,28,0.06); padding: 2rpx 8rpx; border-radius: $radius-xs; align-self: flex-start; }
</style>
