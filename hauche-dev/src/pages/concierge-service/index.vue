<template>
  <View class="page">
    <!-- Category Tabs -->
    <View class="tabs">
      <View
        v-for="(tab, idx) in tabs"
        :key="idx"
        :class="['tab-item', activeTab === idx ? 'tab-active' : '']"
        @tap="activeTab = idx"
      >
        <Text :class="['tab-text', activeTab === idx ? 'tab-text-active' : '']">{{ tab.label }}</Text>
      </View>
    </View>

    <!-- Service Cards -->
    <View class="card-list">
      <View class="service-card" v-for="(item, idx) in currentCards" :key="idx">
        <View class="card-left">
          <Text class="card-icon">{{ item.icon }}</Text>
          <View class="card-info">
            <Text class="card-name">{{ item.name }}</Text>
            <Text class="card-desc">{{ item.desc }}</Text>
          </View>
        </View>
        <View class="card-btn" @tap="handleReserve(item.name)">
          <Text class="card-btn-text">预约</Text>
        </View>
      </View>
    </View>
  </View>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

const activeTab = ref(0)

const tabs = [
  { label: '出行' },
  { label: '生活' },
  { label: '商务' },
  { label: '金融' }
]

const serviceData = ref([
  // 出行
  [
    { icon: '✈️', name: '机场贵宾接送', desc: '专车接送，VIP候机厅休息' },
    { icon: '🚄', name: '高铁贵宾服务', desc: '商务座预订，专人引导进出站' },
    { icon: '🚗', name: '代驾服务', desc: '专业司机，24小时随叫随到' },
    { icon: '🏎️', name: '豪车租赁', desc: '全球高端车型，按需租赁' }
  ],
  // 生活
  [
    { icon: '🍽️', name: '米其林餐厅预订', desc: '全国米其林餐厅优先订位' },
    { icon: '🏨', name: '五星酒店预订', desc: '全球五星级酒店专属折扣' },
    { icon: '🏌️', name: '球会/会所预约', desc: '高端球会及私人会所通道' },
    { icon: '🏥', name: '医疗绿色通道', desc: '三甲医院专家号源优先' }
  ],
  // 商务
  [
    { icon: '🏢', name: '会议场地预订', desc: '高端商务会议场地安排' },
    { icon: '🌐', name: '商务翻译', desc: '多语种专业翻译服务' },
    { icon: '🛩️', name: '私人飞机包机', desc: '全球公务机包机服务' },
    { icon: '🛥️', name: '游艇租赁', desc: '豪华游艇出海体验' }
  ],
  // 金融
  [
    { icon: '💰', name: '豪车贷款', desc: '低利率专属金融方案' },
    { icon: '🛡️', name: '保险方案', desc: '定制高端车险方案' },
    { icon: '📊', name: '资产配置', desc: '专属财富管理顾问' },
    { icon: '📑', name: '税务筹划', desc: '专业税务优化建议' }
  ]
])

const currentCards = computed(() => serviceData.value[activeTab.value])

const handleReserve = (name: string) => {
  Taro.showToast({ title: `已预约：${name}`, icon: 'none' })
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  min-height: 100vh;
  background-color: #FAFAFA;
}

/* Tabs */
.tabs {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
  padding: 0 16rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 0;
  position: relative;
}

.tab-item.tab-active {
  border-bottom: 4rpx solid #DA291C;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
}

.tab-text-active {
  color: #DA291C;
  font-weight: 600;
}

/* Card List */
.card-list {
  padding: 24rpx 32rpx;
}

.service-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 28rpx 32rpx;
  margin-bottom: 20rpx;
}

.card-left {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 24rpx;
}

.card-icon {
  font-size: 44rpx;
  margin-right: 20rpx;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 28rpx;
  color: #181818;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.card-desc {
  font-size: 22rpx;
  color: #8F8F8F;
}

.card-btn {
  background-color: #FFFFFF;
  border: 1px solid #DA291C;
  border-radius: 4px;
  padding: 12rpx 32rpx;
}

.card-btn-text {
  font-size: 26rpx;
  color: #DA291C;
  font-weight: 500;
}
</style>
