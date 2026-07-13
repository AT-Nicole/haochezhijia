<template>
  <ScrollView
    scroll-y
    refresher-enabled
    :refresher-triggered="refreshing"
    @refresherrefresh="handleRefresh"
    @scrolltolower="handleLoadMore"
    class="pull-refresh"
  >
    <slot />
    <!-- Load more indicator -->
    <View v-if="loadingMore" class="load-more">
      <Text class="load-more-text">加载中...</Text>
    </View>
    <View v-else-if="!hasMore && showEnd" class="load-more">
      <Text class="load-more-text end">— 已经到底了 —</Text>
    </View>
  </ScrollView>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  hasMore: { type: Boolean, default: true },
  showEnd: { type: Boolean, default: true }
})

const emit = defineEmits(['refresh', 'loadMore'])
const refreshing = ref(false)
const loadingMore = ref(false)

async function handleRefresh() {
  refreshing.value = true
  try {
    await emit('refresh')
  } finally {
    refreshing.value = false
  }
}

async function handleLoadMore() {
  if (!props.hasMore || loadingMore.value) return
  loadingMore.value = true
  try {
    await emit('loadMore')
  } finally {
    loadingMore.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.pull-refresh {
  height: 100%;
}
.load-more {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
}
.load-more-text {
  font-size: 24rpx;
  color: $color-text-tertiary;
  &.end { color: $color-text-quaternary; }
}
</style>
