<template>
  <View class="empty-state">
    <View class="empty-icon">{{ icon }}</View>
    <Text class="empty-title">{{ title }}</Text>
    <Text v-if="description" class="empty-desc">{{ description }}</Text>
    <View v-if="actionText" class="empty-action" @tap="$emit('action')">
      <Text class="empty-action-text">{{ actionText }}</Text>
    </View>
  </View>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '🔍' },
  title: { type: String, default: '暂无数据' },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' }
})
defineEmits(['action'])
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}
.empty-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
}
.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: 8rpx;
}
.empty-desc {
  font-size: 26rpx;
  color: $color-text-secondary;
  text-align: center;
  margin-bottom: 32rpx;
  line-height: 1.6;
}
.empty-action {
  margin-top: 16rpx;
}
.empty-action-text {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-primary;
}
</style>
