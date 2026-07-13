<template>
  <View class="page">
    <!-- Header -->
    <View class="header">
      <Text class="title">全国车源比价</Text>
      <Text class="subtitle">一键调取全国报价 · 无库存代购</Text>
    </View>

    <!-- Search -->
    <View class="search-bar">
      <Text class="search-icon">🔍</Text>
      <Text class="search-text">搜索车型、品牌、车架号</Text>
    </View>

    <!-- Hot Tags -->
    <ScrollView scroll-x class="hot-tags">
      <View class="tag-list">
        <View class="hot-tag" v-for="tag in hotTags" :key="tag" :class="{ active: tag === '迈巴赫S级' }" @tap="selectTag(tag)">
          <Text class="hot-tag-text">{{ tag }}</Text>
        </View>
      </View>
    </ScrollView>

    <!-- Price Card -->
    <View class="price-card">
      <View class="price-card-header">
        <Text class="price-card-title">2024款 迈巴赫S480 4.0T</Text>
        <View class="ai-badge-inline">
          <Text class="ai-badge-text">AI已比价全国 126 家</Text>
        </View>
      </View>

      <!-- Price List -->
      <View class="price-list">
        <View class="price-item" v-for="item in priceList" :key="item.city" :class="{ recommended: item.recommended, lowest: item.lowest }">
          <View class="price-item-avatar">
            <Text class="price-item-avatar-text">{{ item.avatar }}</Text>
          </View>
          <View class="price-item-info">
            <View class="price-item-row">
              <Text class="price-item-city">{{ item.city }} · {{ item.dealer }}</Text>
              <Text v-if="item.recommended" class="price-badge-rec">推荐</Text>
              <Text v-if="item.lowest" class="price-badge-low">最低价</Text>
            </View>
            <Text class="price-item-status">{{ item.stock }}</Text>
          </View>
          <Text class="price-item-price">¥{{ item.price }}万</Text>
        </View>
      </View>

      <!-- AI Analysis -->
      <View class="ai-analysis">
        <View class="ai-analysis-header">
          <Text class="ai-analysis-icon">✨</Text>
          <Text class="ai-analysis-title">AI 分析</Text>
        </View>
        <Text class="ai-analysis-text">全国均价 ¥291.3万，深圳报价低于均价 ¥3.3万。成都报价最低但物流成本约 ¥2万，综合推荐从深圳尊享名车采购。</Text>
      </View>

      <!-- Action Buttons -->
      <View class="action-row">
        <View class="btn-primary-full" @tap="onProxyPurchase">
          <Text class="btn-text">一键代购</Text>
        </View>
        <View class="btn-outline" @tap="onAddCompare">
          <Text class="btn-outline-text">加入对比</Text>
        </View>
      </View>

      <!-- Proxy Purchase Model -->
      <View class="info-card">
        <Text class="info-card-title">无库存代购模式</Text>
        <Text class="info-card-desc">车行无需压库存，客户下单后平台一键调车，48小时到店。</Text>
        <View class="flow-steps">
          <View class="flow-step" v-for="(step, idx) in steps" :key="idx">
            <View class="flow-step-dot" />
            <Text class="flow-step-text">{{ step }}</Text>
          </View>
        </View>
      </View>

    <View style="height: 160rpx" />
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const hotTags = ['迈巴赫S级', '奔驰G级', '保时捷911', '路虎揽胜', '宾利飞驰', '劳斯莱斯幻影']

const priceList = ref([
  { city: '深圳', dealer: '尊享名车', price: '288', stock: '在库', avatar: '尊', recommended: true, lowest: false },
  { city: '广州', dealer: '粤淘名车', price: '292', stock: '在库', avatar: '粤', recommended: false, lowest: false },
  { city: '北京', dealer: '百得利', price: '295', stock: '在库', avatar: '北', recommended: false, lowest: false },
  { city: '上海', dealer: '利星行', price: '290', stock: '在库', avatar: '上', recommended: false, lowest: false },
  { city: '成都', dealer: '锦晟名车', price: '285', stock: '在库', avatar: '川', recommended: false, lowest: true },
  { city: '杭州', dealer: '之江名车', price: '298', stock: '预订', avatar: '浙', recommended: false, lowest: false },
])

const steps = ['客户下单', 'AI匹配车源', '48h到店']

const selectTag = (tag) => Taro.showToast({ title: `搜索: ${tag}`, icon: 'none' })
const onProxyPurchase = () => Taro.showToast({ title: '已提交代购需求', icon: 'none' })
const onAddCompare = () => Taro.navigateTo({ url: '/pages/car-compare/index' })
</script>

<style lang="scss" scoped>
@import '@/app.scss';
.page { min-height: 100vh; background: $color-background; }
.header { padding: 100rpx 32rpx 24rpx; }
.title { font-size: 40rpx; font-weight: 700; color: $color-text-primary; display: block; }
.subtitle { font-size: 24rpx; color: $color-text-tertiary; display: block; margin-top: 8rpx; }
.search-bar { margin: 0 32rpx 24rpx; display: flex; align-items: center; gap: 16rpx; height: 72rpx; padding: 0 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-sm; }
.search-icon { font-size: 28rpx; }
.search-text { font-size: 26rpx; color: $color-text-tertiary; }
.hot-tags { margin-bottom: 32rpx; }
.tag-list { display: flex; gap: 12rpx; padding: 0 32rpx; }
.hot-tag { padding: 12rpx 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-full; white-space: nowrap; &.active { background: $color-primary; border-color: $color-primary; .hot-tag-text { color: #fff; } } }
.hot-tag-text { font-size: 24rpx; color: $color-text-secondary; font-weight: 500; }

.price-card { margin: 0 32rpx 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; overflow: hidden; }
.price-card-header { padding: 24rpx; border-bottom: 1rpx solid $color-divider; display: flex; align-items: center; justify-content: space-between; }
.price-card-title { font-size: 28rpx; font-weight: 600; color: $color-text-primary; }
.ai-badge-inline { background: rgba(218,41,28,0.06); padding: 4rpx 12rpx; border-radius: $radius-sm; }
.ai-badge-text { font-size: 20rpx; font-weight: 600; color: $color-primary; }
.price-list { padding: 0; }
.price-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 24rpx; border-bottom: 1rpx solid $color-divider; &.recommended { background: rgba(218,41,28,0.03); } &.lowest .price-item-price { color: rgba(232,184,0,1); } &:last-child { border-bottom: none; } }
.price-item-avatar { width: 48rpx; height: 48rpx; border-radius: $radius-sm; background: $color-primary; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.price-item-avatar-text { font-size: 20rpx; color: #fff; font-weight: 600; }
.price-item-info { flex: 1; }
.price-item-row { display: flex; align-items: center; gap: 8rpx; }
.price-item-city { font-size: 24rpx; font-weight: 500; color: $color-text-primary; }
.price-badge-rec { font-size: 18rpx; font-weight: 600; color: $color-primary; background: rgba(218,41,28,0.06); padding: 2rpx 8rpx; border-radius: $radius-xs; }
.price-badge-low { font-size: 18rpx; font-weight: 600; color: rgba(232,184,0,1); background: rgba(232,184,0,0.1); padding: 2rpx 8rpx; border-radius: $radius-xs; }
.price-item-status { font-size: 20rpx; color: $color-text-tertiary; margin-top: 4rpx; }
.price-item-price { font-size: 28rpx; font-weight: 700; color: $color-text-primary; font-variant-numeric: tabular-nums; }

.ai-analysis { margin: 0 32rpx 24rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.ai-analysis-header { display: flex; align-items: center; gap: 8rpx; margin-bottom: 12rpx; }
.ai-analysis-icon { font-size: 24rpx; }
.ai-analysis-title { font-size: 22rpx; font-weight: 600; color: $color-text-tertiary; text-transform: uppercase; }
.ai-analysis-text { font-size: 24rpx; color: $color-text-secondary; line-height: 1.6; }

.action-row { display: flex; gap: 16rpx; margin: 0 32rpx 32rpx; }
.btn-primary-full { flex: 2; height: 80rpx; display: flex; align-items: center; justify-content: center; background: $color-primary; border-radius: $radius-sm; }
.btn-text { font-size: 26rpx; font-weight: 600; color: #fff; }
.btn-outline { flex: 1; height: 80rpx; display: flex; align-items: center; justify-content: center; border: 1rpx solid $color-primary; border-radius: $radius-sm; }
.btn-outline-text { font-size: 26rpx; font-weight: 500; color: $color-primary; }

.info-card { margin: 0 32rpx; padding: 24rpx; background: $color-surface; border: 1rpx solid $color-border; border-radius: $radius-lg; }
.info-card-title { font-size: 26rpx; font-weight: 600; color: $color-text-primary; display: block; margin-bottom: 8rpx; }
.info-card-desc { font-size: 22rpx; color: $color-text-secondary; line-height: 1.6; display: block; margin-bottom: 20rpx; }
.flow-steps { display: flex; align-items: center; justify-content: center; gap: 32rpx; }
.flow-step { display: flex; align-items: center; gap: 8rpx; }
.flow-step-dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: $color-primary; }
.flow-step-text { font-size: 22rpx; color: $color-text-secondary; }
</style>
