<template>
  <View :class="['skeleton', animated ? 'skeleton-animated' : '']">
    <!-- Card skeleton -->
    <View v-if="type === 'card'" class="skeleton-card">
      <View class="skeleton-image" />
      <View class="skeleton-body">
        <View class="skeleton-title" />
        <View class="skeleton-text" />
        <View class="skeleton-text short" />
      </View>
    </View>

    <!-- List skeleton -->
    <View v-else-if="type === 'list'">
      <View v-for="i in count" :key="i" class="skeleton-list-item">
        <View class="skeleton-avatar" />
        <View class="skeleton-content">
          <View class="skeleton-title" />
          <View class="skeleton-text" />
        </View>
      </View>
    </View>

    <!-- Grid skeleton -->
    <View v-else-if="type === 'grid'" class="skeleton-grid">
      <View v-for="i in count" :key="i" class="skeleton-grid-item">
        <View class="skeleton-image" />
        <View class="skeleton-text" />
      </View>
    </View>

    <!-- Stats skeleton -->
    <View v-else-if="type === 'stats'" class="skeleton-stats">
      <View v-for="i in count" :key="i" class="skeleton-stat-card">
        <View class="skeleton-value" />
        <View class="skeleton-label" />
      </View>
    </View>

    <!-- Detail skeleton -->
    <View v-else-if="type === 'detail'" class="skeleton-detail">
      <View class="skeleton-image large" />
      <View class="skeleton-title large" />
      <View class="skeleton-text" />
      <View class="skeleton-text" />
      <View class="skeleton-text short" />
    </View>
  </View>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'card' }, // card | list | grid | stats | detail
  count: { type: Number, default: 3 },
  animated: { type: Boolean, default: true }
})
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.skeleton-animated .skeleton-image,
.skeleton-animated .skeleton-title,
.skeleton-animated .skeleton-text,
.skeleton-animated .skeleton-value,
.skeleton-animated .skeleton-label,
.skeleton-animated .skeleton-avatar {
  background: linear-gradient(90deg, #E8E8E8 25%, #F0F0F0 50%, #E8E8E8 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-image {
  background-color: #E8E8E8;
  border-radius: $radius-md;
  height: 200rpx;
  &.large { height: 400rpx; }
}
.skeleton-title {
  background-color: #E8E8E8;
  border-radius: $radius-sm;
  height: 32rpx;
  width: 60%;
  margin-top: 16rpx;
  &.large { height: 40rpx; width: 80%; }
}
.skeleton-text {
  background-color: #E8E8E8;
  border-radius: $radius-sm;
  height: 24rpx;
  width: 100%;
  margin-top: 12rpx;
  &.short { width: 40%; }
}
.skeleton-avatar {
  background-color: #E8E8E8;
  border-radius: 50%;
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
}
.skeleton-value {
  background-color: #E8E8E8;
  border-radius: $radius-sm;
  height: 48rpx;
  width: 50%;
}
.skeleton-label {
  background-color: #E8E8E8;
  border-radius: $radius-sm;
  height: 22rpx;
  width: 40%;
  margin-top: 12rpx;
}
.skeleton-card {
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.skeleton-body { margin-top: 16rpx; }
.skeleton-list-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid $color-divider;
}
.skeleton-content { flex: 1; }
.skeleton-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.skeleton-grid-item {
  width: calc(50% - 8rpx);
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 16rpx;
}
.skeleton-stats {
  display: flex;
  gap: 16rpx;
}
.skeleton-stat-card {
  flex: 1;
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-lg;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.skeleton-detail {
  padding: 32rpx;
}
</style>
