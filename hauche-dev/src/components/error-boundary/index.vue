<template>
  <View v-if="error" class="error-boundary">
    <View class="error-icon">⚠️</View>
    <Text class="error-title">加载失败</Text>
    <Text class="error-message">{{ error }}</Text>
    <View class="error-actions">
      <View class="btn-outline" @tap="handleRetry">
        <Text class="btn-outline-text">重试</Text>
      </View>
    </View>
  </View>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err.message || '未知错误'
  console.error('ErrorBoundary caught:', err)
  return false // prevent propagation
})

function handleRetry() {
  error.value = null
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx;
}
.error-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.error-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: 8rpx;
}
.error-message {
  font-size: 26rpx;
  color: $color-text-secondary;
  text-align: center;
  margin-bottom: 32rpx;
}
.error-actions { margin-top: 16rpx; }
.btn-outline {
  border: 2rpx solid $color-primary;
  border-radius: $radius-sm;
  padding: 16rpx 48rpx;
}
.btn-outline-text {
  font-size: 28rpx;
  color: $color-primary;
  font-weight: 500;
}
</style>
