<template>
  <View class="car-card" @tap="$emit('tap', car)">
    <!-- Image -->
    <View class="car-image" :style="{ backgroundColor: imageColor }">
      <Text v-if="car.tag" class="car-tag" :class="car.tagClass || 'tag-primary'">{{ car.tag }}</Text>
    </View>
    <!-- Info -->
    <View class="car-info">
      <Text class="car-name">{{ car.brand }} {{ car.model }}</Text>
      <View class="car-meta">
        <Text class="car-year">{{ car.year }}款</Text>
        <Text class="car-sep">|</Text>
        <Text class="car-mileage">{{ car.mileage || '0km' }}</Text>
      </View>
      <View class="car-bottom">
        <Text class="car-price">{{ car.price }}</Text>
        <Text class="car-location" v-if="car.location">{{ car.location }}</Text>
      </View>
    </View>
  </View>
</template>

<script setup>
defineProps({
  car: { type: Object, required: true },
  imageColor: { type: String, default: '#E8E8E8' }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.car-card {
  background-color: $color-surface;
  border: 2rpx solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.car-image {
  height: 280rpx;
  position: relative;
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
}
.car-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 4rpx 16rpx;
  border-radius: $radius-sm;
  font-size: 22rpx;
  font-weight: 500;
  background-color: rgba(218, 41, 28, 0.9);
  color: #FFFFFF;
}
.car-info {
  padding: 20rpx 24rpx;
}
.car-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-primary;
  display: block;
  margin-bottom: 8rpx;
}
.car-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.car-year, .car-mileage {
  font-size: 24rpx;
  color: $color-text-secondary;
}
.car-sep {
  font-size: 20rpx;
  color: $color-text-quaternary;
}
.car-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.car-price {
  font-size: 36rpx;
  font-weight: 700;
  color: $color-primary;
}
.car-location {
  font-size: 22rpx;
  color: $color-text-tertiary;
}
</style>
