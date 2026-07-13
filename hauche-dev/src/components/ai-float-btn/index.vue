<template>
  <View class="ai-float" @tap="goToChat">
    <View class="ai-btn">
      <Text class="ai-icon">AI</Text>
    </View>
    <Text class="ai-label">AI助手</Text>
  </View>
</template>

<script setup>
import Taro from '@tarojs/taro'

function goToChat() {
  Taro.navigateTo({ url: '/pages/ai-chat/index' })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.ai-float {
  position: fixed;
  right: 32rpx;
  bottom: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  z-index: 999;
}
.ai-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid rgba(255,255,255,0.3);
}
.ai-icon {
  font-size: 28rpx;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.05em;
}
.ai-label {
  font-size: 20rpx;
  color: $color-text-tertiary;
  font-weight: 500;
}
</style>
