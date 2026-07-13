<template>
  <View class="page">
    <View class="profile-card">
      <View class="avatar-wrap">
        <View class="avatar">
          <Text class="avatar-text">李</Text>
        </View>
      </View>
      <View class="profile-info">
        <Text class="advisor-name">李顾问</Text>
        <Text class="advisor-specialty">超跑 / 限量版</Text>
      </View>
      <View class="profile-stats">
        <View class="stat-item">
          <Text class="stat-value">4.9</Text>
          <Text class="stat-label">评分</Text>
        </View>
        <View class="stat-divider"></View>
        <View class="stat-item">
          <Text class="stat-value">156</Text>
          <Text class="stat-label">成交单</Text>
        </View>
        <View class="stat-divider"></View>
        <View class="stat-item">
          <Text class="stat-value">8年</Text>
          <Text class="stat-label">从业</Text>
        </View>
      </View>
    </View>

    <View class="section">
      <Text class="section-title">服务项目</Text>

      <View
        v-for="item in serviceItems"
        :key="item.id"
        class="service-card"
      >
        <View class="service-info">
          <Text class="service-name">{{ item.name }}</Text>
          <Text class="service-desc">{{ item.desc }}</Text>
        </View>
        <View class="book-btn" @tap="handleBook(item)">
          <Text class="book-btn-text">预约</Text>
        </View>
      </View>
    </View>

    <View class="section">
      <Text class="section-title">近期咨询记录</Text>

      <View
        v-for="record in records"
        :key="record.id"
        class="record-card"
      >
        <View class="record-header">
          <Text class="record-topic">{{ record.topic }}</Text>
          <View :class="['record-badge', `record-${record.statusKey}`]">
            <Text class="record-badge-text">{{ record.status }}</Text>
          </View>
        </View>
        <Text class="record-date">{{ record.date }}</Text>
      </View>
    </View>

    <View class="contact-section">
      <View class="consult-btn" @tap="handleConsult">
        <Text class="consult-btn-text">在线咨询</Text>
      </View>
      <View class="phone-row" @tap="handleCall">
        <Text class="phone-label">服务热线</Text>
        <Text class="phone-number">400-888-6666</Text>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'

const serviceItems = ref([
  {
    id: 1,
    name: '一对一选车咨询',
    desc: '根据您的需求推荐最适合的车型配置'
  },
  {
    id: 2,
    name: '专属看车安排',
    desc: '私人预约品鉴，尊享专属展厅体验'
  },
  {
    id: 3,
    name: '购车合同审核',
    desc: '专业法务团队协助审核购车条款'
  },
  {
    id: 4,
    name: '上牌过户代办',
    desc: '全流程代办上牌及过户手续'
  },
  {
    id: 5,
    name: '售后保障协调',
    desc: '协调厂家及服务中心处理售后问题'
  }
])

const records = ref([
  {
    id: 1,
    topic: 'Ferrari 296 GTB 选配咨询',
    date: '2026-07-12 14:30',
    status: '已完成',
    statusKey: 'done'
  },
  {
    id: 2,
    topic: '保时捷Taycan对比评估',
    date: '2026-07-10 10:00',
    status: '已完成',
    statusKey: 'done'
  },
  {
    id: 3,
    topic: '迈巴赫S680金融方案',
    date: '2026-07-14 16:00',
    status: '待进行',
    statusKey: 'pending'
  }
])

const handleBook = (item) => {
  console.log('预约服务', item.name)
}

const handleConsult = () => {
  console.log('在线咨询')
}

const handleCall = () => {
  console.log('拨打电话')
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 32px;
}

.profile-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  margin: 16px;
  padding: 32px 24px;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background: #DA291C;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 48px;
  color: #FFFFFF;
  font-weight: bold;
}

.profile-info {
  text-align: center;
  margin-bottom: 24px;
}

.advisor-name {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #181818;
  margin-bottom: 8px;
}

.advisor-specialty {
  display: block;
  font-size: 26px;
  color: #E8B800;
  font-weight: bold;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #CCCCCC;
  padding-top: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #181818;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 22px;
  color: #8F8F8F;
}

.stat-divider {
  width: 1px;
  background: #CCCCCC;
}

.section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 16px;
}

.service-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-info {
  flex: 1;
  margin-right: 16px;
}

.service-name {
  font-size: 30px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 8px;
}

.service-desc {
  font-size: 24px;
  color: #8F8F8F;
  display: block;
}

.book-btn {
  background: #FFFFFF;
  border: 2px solid #DA291C;
  border-radius: 8px;
  padding: 12px 32px;
}

.book-btn-text {
  font-size: 26px;
  color: #DA291C;
  font-weight: bold;
}

.record-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 12px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-topic {
  font-size: 28px;
  font-weight: bold;
  color: #181818;
}

.record-badge {
  padding: 4px 16px;
  border-radius: 4px;
}

.record-done {
  background: #34C759;
}

.record-pending {
  background: #E8B800;
}

.record-badge-text {
  font-size: 22px;
  color: #FFFFFF;
}

.record-date {
  font-size: 24px;
  color: #8F8F8F;
}

.contact-section {
  margin: 16px;
  padding-top: 24px;
  border-top: 1px solid #CCCCCC;
}

.consult-btn {
  background: #DA291C;
  border-radius: 8px;
  padding: 24px 0;
  text-align: center;
  margin-bottom: 20px;
}

.consult-btn-text {
  color: #FFFFFF;
  font-size: 32px;
  font-weight: bold;
}

.phone-row {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}

.phone-label {
  font-size: 26px;
  color: #666666;
  margin-right: 12px;
}

.phone-number {
  font-size: 28px;
  color: #DA291C;
  font-weight: bold;
}
</style>
