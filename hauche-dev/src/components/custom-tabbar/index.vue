<template>
  <View class="tabbar">
    <View 
      class="tabbar-item" 
      v-for="tab in tabs" 
      :key="tab.label"
      :class="{ active: isActive(tab.page) }"
      @tap="switchTab(tab.page)"
    >
      <Text class="tabbar-icon">{{ getIcon(tab.icon) }}</Text>
      <Text class="tabbar-label">{{ tab.label }}</Text>
    </View>
  </View>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

const TAB_CONFIGS = {
  buyer: [
    { label: '首页', page: '/pages/home-landing/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '发现', page: '/pages/car-community/index', icon: 'compass' },
    { label: '服务', page: '/pages/finance-center/index', icon: 'wrench' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  dealer: [
    { label: '首页', page: '/pages/home-dealer/index', icon: 'home' },
    { label: '车源', page: '/pages/national-pricing/index', icon: 'search' },
    { label: '营销', page: '/pages/ai-marketing/index', icon: 'zap' },
    { label: '线索', page: '/pages/service-tracking/index', icon: 'map-pin' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  creator: [
    { label: '首页', page: '/pages/home-creator/index', icon: 'home' },
    { label: '创作', page: '/pages/luxury-news/index', icon: 'pen-tool' },
    { label: '数据', page: '/pages/luxury-ranking/index', icon: 'bar-chart' },
    { label: '消息', page: '/pages/ai-chat/index', icon: 'message-circle' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  vip: [
    { label: '首页', page: '/pages/home-vip/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '服务', page: '/pages/concierge-service/index', icon: 'wrench' },
    { label: '管家', page: '/pages/butler-workbench/index', icon: 'key' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  admin: [
    { label: '首页', page: '/pages/home-admin/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '会员', page: '/pages/crm-members/index', icon: 'users' },
    { label: '财务', page: '/pages/ai-finance/index', icon: 'bar-chart' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ]
}

const ICONS = {
  home: '🏠', car: '🚗', compass: '🧭', wrench: '🔧', user: '👤',
  search: '🔍', zap: '⚡', 'map-pin': '📍', 'pen-tool': '✏️',
  'bar-chart': '📊', 'message-circle': '💬', key: '🔑', users: '👥'
}

const role = ref(Taro.getStorageSync('userRole') || 'buyer')
const tabs = computed(() => TAB_CONFIGS[role.value] || TAB_CONFIGS.buyer)

const isActive = (page) => {
  const currentPages = Taro.getCurrentPages()
  if (currentPages.length === 0) return false
  const currentPath = '/' + currentPages[currentPages.length - 1].route
  return currentPath === page
}

const switchTab = (page) => {
  Taro.reLaunch({ url: page })
}

const getIcon = (name) => ICONS[name] || '📋'
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: $color-surface;
  border-top: 1rpx solid $color-border;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  width: 128rpx;
  height: 100%;

  &.active .tabbar-label {
    color: $color-primary;
    font-weight: 600;
  }
}

.tabbar-icon {
  font-size: 36rpx;
}

.tabbar-label {
  font-size: 20rpx;
  color: $color-text-tertiary;
  font-weight: 500;
}
</style>
