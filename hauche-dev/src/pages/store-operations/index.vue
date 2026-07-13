<template>
  <View class="page">
    <ScrollView scrollY class="scroll-area">
      <!-- 门店信息 -->
      <View class="store-card">
        <View class="store-header">
          <Text class="store-name">豪车之家 · 上海旗舰店</Text>
          <View class="store-status-badge">
            <Text class="store-status-text">营业中</Text>
          </View>
        </View>
        <View class="store-info-row">
          <Text class="store-info-icon">📍</Text>
          <Text class="store-info-text">上海市浦东新区陆家嘴环路1088号</Text>
        </View>
        <View class="store-info-row">
          <Text class="store-info-icon">🕐</Text>
          <Text class="store-info-text">营业时间：09:00 - 21:00</Text>
        </View>
        <View class="store-info-row">
          <Text class="store-info-icon">📞</Text>
          <Text class="store-info-text">021-8888-6666</Text>
        </View>
      </View>

      <!-- 今日概览 -->
      <View class="section">
        <Text class="section-title">今日概览</Text>
        <View class="overview-grid">
          <View class="overview-card">
            <Text class="overview-number">12</Text>
            <Text class="overview-label">到店</Text>
            <Text class="overview-unit">组</Text>
          </View>
          <View class="overview-card">
            <Text class="overview-number">5</Text>
            <Text class="overview-label">试驾</Text>
            <Text class="overview-unit">组</Text>
          </View>
          <View class="overview-card overview-highlight">
            <Text class="overview-number">2</Text>
            <Text class="overview-label">成交</Text>
            <Text class="overview-unit">单</Text>
          </View>
          <View class="overview-card">
            <Text class="overview-number">8</Text>
            <Text class="overview-label">线索</Text>
            <Text class="overview-unit">条</Text>
          </View>
        </View>
      </View>

      <!-- 员工排班 -->
      <View class="section">
        <Text class="section-title">今日排班</Text>
        <View
          v-for="staff in staffList"
          :key="staff.id"
          class="staff-card"
        >
          <View class="staff-avatar" :style="{ background: staff.color }">
            <Text class="staff-avatar-text">{{ staff.name.charAt(0) }}</Text>
          </View>
          <View class="staff-info">
            <Text class="staff-name">{{ staff.name }}</Text>
            <Text class="staff-role">{{ staff.role }}</Text>
          </View>
          <View class="staff-appointments">
            <Text class="appointment-count">{{ staff.appointments }}</Text>
            <Text class="appointment-label">今日预约</Text>
          </View>
        </View>
      </View>

      <!-- AI运营建议 -->
      <View class="ai-card">
        <View class="ai-header">
          <Text class="ai-icon">AI</Text>
          <Text class="ai-title">今日运营建议</Text>
        </View>
        <Text class="ai-content">下午有3组高端客户到店，建议准备迈巴赫和劳斯莱斯试驾车，并提前准备好展厅灯光及茶歇服务。</Text>
      </View>

      <!-- 快捷操作 -->
      <View class="section">
        <Text class="section-title">快捷操作</Text>
        <View class="action-grid">
          <View
            v-for="action in quickActions"
            :key="action.name"
            class="action-card"
            @tap="handleAction(action)"
          >
            <View class="action-icon-wrap" :style="{ background: action.bgColor }">
              <Text class="action-icon-text">{{ action.icon }}</Text>
            </View>
            <Text class="action-name">{{ action.name }}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
</template>

<script setup>
import { ref } from 'vue'

const staffList = ref([
  {
    id: 1,
    name: '王总监',
    role: '销售总监',
    appointments: 3,
    color: '#DA291C'
  },
  {
    id: 2,
    name: '张顾问',
    role: '高级顾问',
    appointments: 2,
    color: '#E8B800'
  },
  {
    id: 3,
    name: '刘管家',
    role: '服务管家',
    appointments: 4,
    color: '#333333'
  },
  {
    id: 4,
    name: '赵经理',
    role: '金融顾问',
    appointments: 1,
    color: '#1A1A2E'
  }
])

const quickActions = ref([
  {
    name: '排班管理',
    icon: '📅',
    bgColor: '#DA291C'
  },
  {
    name: '库存盘点',
    icon: '📦',
    bgColor: '#E8B800'
  },
  {
    name: '门店活动',
    icon: '🎉',
    bgColor: '#333333'
  },
  {
    name: '数据报表',
    icon: '📊',
    bgColor: '#1A1A2E'
  }
])

const handleAction = (action) => {
  console.log('快捷操作', action.name)
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
}

.scroll-area {
  height: 100vh;
}

.store-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  margin: 16px;
  padding: 24px;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.store-name {
  font-size: 34px;
  font-weight: bold;
  color: #181818;
}

.store-status-badge {
  background: #34C759;
  padding: 4px 16px;
  border-radius: 4px;
}

.store-status-text {
  font-size: 22px;
  color: #FFFFFF;
}

.store-info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.store-info-icon {
  font-size: 28px;
  margin-right: 12px;
  flex-shrink: 0;
  line-height: 1.4;
}

.store-info-text {
  font-size: 26px;
  color: #666666;
  line-height: 1.4;
  flex: 1;
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

.overview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.overview-card {
  width: calc(50% - 6px);
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.overview-highlight {
  border-color: #DA291C;
}

.overview-number {
  font-size: 48px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 4px;
}

.overview-highlight .overview-number {
  color: #DA291C;
}

.overview-label {
  font-size: 24px;
  color: #666666;
  margin-right: 4px;
}

.overview-unit {
  font-size: 22px;
  color: #8F8F8F;
}

.staff-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.staff-avatar {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.staff-avatar-text {
  font-size: 28px;
  color: #FFFFFF;
  font-weight: bold;
}

.staff-info {
  flex: 1;
}

.staff-name {
  font-size: 28px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 4px;
}

.staff-role {
  font-size: 24px;
  color: #8F8F8F;
}

.staff-appointments {
  text-align: center;
  flex-shrink: 0;
}

.appointment-count {
  font-size: 36px;
  font-weight: bold;
  color: #DA291C;
  display: block;
}

.appointment-label {
  font-size: 20px;
  color: #8F8F8F;
}

.ai-card {
  background: #FFFFFF;
  border: 1px solid #E8B800;
  border-radius: 8px;
  margin: 0 16px 24px;
  padding: 24px;
}

.ai-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.ai-icon {
  background: #E8B800;
  color: #FFFFFF;
  font-size: 22px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 4px;
  margin-right: 12px;
}

.ai-title {
  font-size: 28px;
  font-weight: bold;
  color: #181818;
}

.ai-content {
  font-size: 26px;
  color: #666666;
  line-height: 1.6;
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.action-card {
  width: calc(50% - 8px);
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
}

.action-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.action-icon-text {
  font-size: 36px;
}

.action-name {
  font-size: 28px;
  font-weight: bold;
  color: #181818;
}
</style>
