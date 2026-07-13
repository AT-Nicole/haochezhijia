<template>
  <View class="page">
    <View class="header">
      <Text class="logo">豪车之家</Text>
      <Text class="subtitle">大湾区高端汽车服务平台</Text>
      <Text class="tagline">全平台 · 撮合模式 · 车行入驻</Text>
    </View>

    <View class="role-list">
      <View 
        class="role-card" 
        v-for="role in roles" 
        :key="role.key"
        @tap="onSelectRole(role.key)"
      >
        <View class="role-card-header">
          <Text class="role-icon">{{ role.icon }}</Text>
          <View class="role-info">
            <Text class="role-name">{{ role.label }}</Text>
            <Text class="role-tag">{{ role.tag }}</Text>
          </View>
        </View>
        <Text class="role-desc">{{ role.desc }}</Text>
        <Text v-if="role.recommended" class="recommended-badge">RECOMMENDED</Text>
      </View>
    </View>

    <View class="footer">
      <Text class="footer-text">所有车辆均来自入驻车行 · 平台不持有车辆</Text>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const roles = ref([
  { 
    key: 'buyer', 
    icon: '👤', 
    label: '我是买家', 
    tag: 'RECOMMENDED',
    desc: '选车、资讯、社区、金融服务',
    recommended: true,
    entryPage: '/pages/home-landing/index'
  },
  { 
    key: 'dealer', 
    icon: '🏪', 
    label: '我是车行', 
    tag: '豪车毒模式',
    desc: '发车、交付追踪、线索管理、AI营销',
    recommended: false,
    entryPage: '/pages/home-dealer/index'
  },
  { 
    key: 'creator', 
    icon: '✍️', 
    label: '我是创作者', 
    tag: '自媒体',
    desc: '图文、短视频、发圈素材、数据看板',
    recommended: false,
    entryPage: '/pages/home-creator/index'
  },
  { 
    key: 'vip', 
    icon: '👑', 
    label: '私董会员', 
    tag: 'VIP',
    desc: '专属管家、企业家资源圈、高端服务',
    recommended: false,
    entryPage: '/pages/home-vip/index'
  },
  { 
    key: 'admin', 
    icon: '⚙️', 
    label: '管理员', 
    tag: '后台',
    desc: '车行审核、内容管理、数据总览',
    recommended: false,
    entryPage: '/pages/home-admin/index'
  }
])

const onSelectRole = (roleKey) => {
  Taro.setStorageSync('userRole', roleKey)
  const role = roles.value.find(r => r.key === roleKey)
  if (role) {
    Taro.reLaunch({ url: role.entryPage })
  }
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 32rpx;
  background-color: $color-background;
}

.header {
  padding: 120rpx 0 60rpx;
  text-align: center;
}

.logo {
  display: block;
  font-size: 56rpx;
  font-weight: 700;
  color: $color-text-primary;
  font-family: $font-display;
  letter-spacing: 0.02em;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: $color-text-secondary;
  margin-top: 12rpx;
}

.tagline {
  display: block;
  font-size: 22rpx;
  color: $color-text-tertiary;
  margin-top: 8rpx;
}

.role-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.role-card {
  position: relative;
  background-color: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  
  &:active {
    background-color: $color-surface-hover;
  }
  
  &:first-child {
    border-color: $color-primary;
  }
}

.role-card-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.role-icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.role-name {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text-primary;
}

.role-tag {
  font-size: 20rpx;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-text-tertiary;
}

.role-desc {
  font-size: 24rpx;
  color: $color-text-secondary;
  padding-left: 92rpx;
}

.recommended-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  font-size: 18rpx;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $color-primary;
  background-color: rgba(218, 41, 28, 0.06);
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
}

.footer {
  padding: 60rpx 0 80rpx;
  text-align: center;
}

.footer-text {
  font-size: 22rpx;
  color: $color-text-tertiary;
}
</style>
