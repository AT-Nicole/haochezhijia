<template>
  <View class="page">
    <View class="filter-tabs">
      <View
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-item', activeTab === tab ? 'tab-active' : '']"
        @tap="activeTab = tab"
      >
        <Text :class="['tab-text', activeTab === tab ? 'tab-text-active' : '']">{{ tab }}</Text>
      </View>
    </View>

    <ScrollView scrollY class="order-list">
      <View
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
      >
        <View class="order-header">
          <View class="order-type">
            <Text class="type-icon">{{ order.icon }}</Text>
            <Text class="type-name">{{ order.typeName }}</Text>
          </View>
          <View :class="['status-badge', `status-${order.statusKey}`]">
            <Text class="status-text">{{ order.status }}</Text>
          </View>
        </View>

        <View class="order-body">
          <Text class="customer-info">{{ order.customer }} · {{ order.carModel }}</Text>
          <Text class="order-meta">{{ order.date }} · 服务管家：{{ order.butler }}</Text>
        </View>

        <View v-if="order.statusKey === 'ongoing'" class="progress-section">
          <View class="progress-bar-bg">
            <View class="progress-bar-fill" :style="{ width: order.progress + '%' }"></View>
          </View>
          <Text class="progress-label">进度 {{ order.progress }}%</Text>
        </View>
      </View>
    </ScrollView>

    <View class="bottom-summary">
      <Text class="summary-text">本月完成 23 单 | 进行中 5 单 | 好评率 98%</Text>
    </View>
  </View>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('全部')
const tabs = ['全部', '进行中', '已完成', '已取消']

const orders = ref([
  {
    id: 1,
    icon: '📋',
    typeName: '年检代办',
    customer: '张先生',
    carModel: 'Ferrari Roma',
    status: '进行中',
    statusKey: 'ongoing',
    date: '2026-07-12',
    butler: '王管家',
    progress: 60
  },
  {
    id: 2,
    icon: '🔧',
    typeName: '维修保养',
    customer: '刘女士',
    carModel: 'Porsche 911',
    status: '进行中',
    statusKey: 'ongoing',
    date: '2026-07-11',
    butler: '李管家',
    progress: 35
  },
  {
    id: 3,
    icon: '🛡',
    typeName: '保险理赔',
    customer: '陈先生',
    carModel: 'Lamborghini Huracan',
    status: '已完成',
    statusKey: 'completed',
    date: '2026-07-10',
    butler: '赵管家',
    progress: 0
  },
  {
    id: 4,
    icon: '🚗',
    typeName: '道路救援',
    customer: '赵女士',
    carModel: 'Rolls-Royce Ghost',
    status: '已完成',
    statusKey: 'completed',
    date: '2026-07-09',
    butler: '王管家',
    progress: 0
  },
  {
    id: 5,
    icon: '🎯',
    typeName: '代驾服务',
    customer: '孙先生',
    carModel: 'Bentley Continental GT',
    status: '已取消',
    statusKey: 'cancelled',
    date: '2026-07-08',
    butler: '李管家',
    progress: 0
  },
  {
    id: 6,
    icon: '✈',
    typeName: '机场接送',
    customer: '周女士',
    carModel: 'Mercedes-AMG GT',
    status: '进行中',
    statusKey: 'ongoing',
    date: '2026-07-13',
    butler: '赵管家',
    progress: 80
  }
])

const filteredOrders = computed(() => {
  if (activeTab.value === '全部') return orders.value
  const map = { '进行中': 'ongoing', '已完成': 'completed', '已取消': 'cancelled' }
  return orders.value.filter(o => o.statusKey === map[activeTab.value])
})
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 120px;
}

.filter-tabs {
  display: flex;
  background: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
  padding: 24px 16px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 4px solid transparent;
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }
}

.tab-item.tab-active {
  border-bottom-color: #DA291C;
}

.tab-text {
  font-size: 28px;
  color: #666666;
}

.tab-text-active {
  color: #DA291C;
  font-weight: bold;
}

.order-list {
  padding: 16px;
}

.order-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-type {
  display: flex;
  align-items: center;
}

.type-icon {
  font-size: 36px;
  margin-right: 12px;
}

.type-name {
  font-size: 30px;
  font-weight: bold;
  color: #181818;
}

.status-badge {
  padding: 4px 16px;
  border-radius: 4px;
}

.status-ongoing {
  background: #DA291C;
}

.status-completed {
  background: #34C759;
}

.status-cancelled {
  background: #8F8F8F;
}

.status-text {
  font-size: 22px;
  color: #FFFFFF;
}

.order-body {
  margin-bottom: 12px;
}

.customer-info {
  font-size: 28px;
  color: #181818;
  display: block;
  margin-bottom: 8px;
}

.order-meta {
  font-size: 24px;
  color: #8F8F8F;
  display: block;
}

.progress-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #CCCCCC;
}

.progress-bar-bg {
  height: 8px;
  background: #F0F0F0;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #DA291C;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-label {
  font-size: 22px;
  color: #666666;
}

.bottom-summary {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1px solid #CCCCCC;
  padding: 24px 32px;
  text-align: center;
}

.summary-text {
  font-size: 26px;
  color: #181818;
  font-weight: bold;
}
</style>
