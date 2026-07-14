<template>
  <View class="page">
    <View class="filter-tabs">
      <ScrollView scroll-x class="tabs-scroll">
        <View
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-item', activeTab === tab ? 'tab-active' : '']"
          @tap="activeTab = tab"
        >
          <Text :class="['tab-text', activeTab === tab ? 'tab-text-active' : '']">{{ tab }}</Text>
        </View>
      </ScrollView>
    </View>

    <ScrollView scroll-y class="event-list">
      <View
        v-for="event in filteredEvents"
        :key="event.id"
        class="event-card"
      >
        <View class="event-cover" :style="{ background: event.gradient }">
          <Text class="cover-title">{{ event.name }}</Text>
        </View>
        <View class="event-info">
          <View class="event-header">
            <Text class="event-name">{{ event.name }}</Text>
            <View :class="['event-badge', `badge-${event.statusKey}`]">
              <Text class="event-badge-text">{{ event.status }}</Text>
            </View>
          </View>

          <View class="event-detail-row">
            <Text class="event-detail-label">日期</Text>
            <Text class="event-detail-value">{{ event.date }}</Text>
          </View>
          <View class="event-detail-row">
            <Text class="event-detail-label">地点</Text>
            <Text class="event-detail-value">{{ event.location }}</Text>
          </View>

          <View class="event-footer">
            <View class="event-meta">
              <Text class="attendee-text">已报名 {{ event.attendees }}/{{ event.capacity }}人</Text>
              <Text :class="['fee-text', event.isFree ? 'fee-free' : '']">{{ event.fee }}</Text>
            </View>
            <View
              :class="['event-action-btn', event.statusKey === 'ended' ? 'action-detail' : 'action-signup']"
              @tap="handleEventAction(event)"
            >
              <Text class="event-action-text">{{ event.statusKey === 'ended' ? '查看详情' : '立即报名' }}</Text>
            </View>
          </View>
        </View>
      </View>

      <View class="ai-suggestion">
        <Text class="ai-label">AI推荐</Text>
        <Text class="ai-text">根据您客户画像，超跑品鉴活动匹配度最高</Text>
      </View>
    </ScrollView>
  </View>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('全部')
const tabs = ['全部', '超跑品鉴', '高尔夫联谊', '豪车沙龙', '新车发布']

const events = ref([
  {
    id: 1,
    name: '2026超跑品鉴之夜',
    category: '超跑品鉴',
    date: '2026-07-20 19:00',
    location: '上海外滩半岛酒店',
    status: '报名中',
    statusKey: 'signing',
    attendees: 18,
    capacity: 30,
    fee: '¥2,800/人',
    isFree: false,
    gradient: 'linear-gradient(135deg, #DA291C, #8B0000)'
  },
  {
    id: 2,
    name: '精英高尔夫联谊赛',
    category: '高尔夫联谊',
    date: '2026-07-25 08:00',
    location: '北京华彬高尔夫俱乐部',
    status: '即将开始',
    statusKey: 'upcoming',
    attendees: 24,
    capacity: 40,
    fee: '¥1,500/人',
    isFree: false,
    gradient: 'linear-gradient(135deg, #2E8B57, #1A5C38)'
  },
  {
    id: 3,
    name: '迈巴赫S级尊享品鉴会',
    category: '豪车沙龙',
    date: '2026-08-02 14:00',
    location: '杭州西湖国宾馆',
    status: '报名中',
    statusKey: 'signing',
    attendees: 8,
    capacity: 20,
    fee: '免费',
    isFree: true,
    gradient: 'linear-gradient(135deg, #1A1A2E, #16213E)'
  },
  {
    id: 4,
    name: 'Ferrari 296 XXP 新车发布会',
    category: '新车发布',
    date: '2026-06-15 10:00',
    location: '深圳国际会展中心',
    status: '已结束',
    statusKey: 'ended',
    attendees: 50,
    capacity: 50,
    fee: '¥5,000/人',
    isFree: false,
    gradient: 'linear-gradient(135deg, #E8B800, #B8860B)'
  }
])

const filteredEvents = computed(() => {
  if (activeTab.value === '全部') return events.value
  return events.value.filter(e => e.category === activeTab.value)
})

const handleEventAction = (event) => {
  console.log('活动操作', event.id, event.statusKey === 'ended' ? '查看详情' : '立即报名')
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
}

.filter-tabs {
  background: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabs-scroll {
  white-space: nowrap;
  padding: 24px 16px 0;
}

.tab-item {
  display: inline-block;
  padding: 0 24px 20px;
  border-bottom: 4px solid transparent;
  margin-right: 8px;
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

.event-list {
  padding: 16px;
  height: calc(100vh - 88px);
}

.event-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.event-cover {
  height: 200px;
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.cover-title {
  font-size: 30px;
  color: #FFFFFF;
  font-weight: bold;
}

.event-info {
  padding: 24px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.event-name {
  font-size: 32px;
  font-weight: bold;
  color: #181818;
}

.event-badge {
  padding: 4px 16px;
  border-radius: 4px;
}

.badge-signing {
  background: #DA291C;
}

.badge-upcoming {
  background: #E8B800;
}

.badge-ended {
  background: #8F8F8F;
}

.event-badge-text {
  font-size: 22px;
  color: #FFFFFF;
}

.event-detail-row {
  display: flex;
  margin-bottom: 8px;
}

.event-detail-label {
  font-size: 24px;
  color: #8F8F8F;
  width: 80px;
  flex-shrink: 0;
}

.event-detail-value {
  font-size: 24px;
  color: #181818;
  flex: 1;
}

.event-footer {
  border-top: 1px solid #CCCCCC;
  padding-top: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-meta {
  display: flex;
  flex-direction: column;
}

.attendee-text {
  font-size: 24px;
  color: #666666;
  margin-bottom: 4px;
}

.fee-text {
  font-size: 28px;
  color: #DA291C;
  font-weight: bold;
}

.fee-free {
  color: #34C759;
}

.event-action-btn {
  padding: 12px 32px;
  border-radius: 8px;
}

.action-signup {
  background: #DA291C;
}

.action-detail {
  background: #FFFFFF;
  border: 2px solid #CCCCCC;
}

.event-action-text {
  font-size: 26px;
  font-weight: bold;
}

.action-signup .event-action-text {
  color: #FFFFFF;
}

.action-detail .event-action-text {
  color: #666666;
}

.ai-suggestion {
  background: #FFFFFF;
  border: 1px solid #E8B800;
  border-radius: 8px;
  padding: 24px;
  margin-top: 8px;
}

.ai-label {
  font-size: 26px;
  font-weight: bold;
  color: #E8B800;
  display: block;
  margin-bottom: 8px;
}

.ai-text {
  font-size: 26px;
  color: #181818;
  line-height: 1.6;
}
</style>
