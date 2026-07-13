<template>
  <View class="ranking-page">
    <!-- Tabs -->
    <ScrollView scroll-x class="tabs-wrapper">
      <View class="tabs">
        <View
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', activeTab === index ? 'tab-active' : '']"
          @tap="activeTab = index"
        >
          <Text :class="['tab-text', activeTab === index ? 'tab-text-active' : '']">{{ tab }}</Text>
          <View v-if="activeTab === index" class="tab-indicator" />
        </View>
      </View>
    </ScrollView>

    <!-- Top 3 Highlight -->
    <View class="top-three">
      <View
        v-for="(car, index) in topThree"
        :key="index"
        :class="['top-card', 'top-card-' + (index + 1)]"
      >
        <View class="top-rank-badge">
          <Text class="top-rank-num">{{ car.rank }}</Text>
        </View>
        <Text class="top-car-name">{{ car.name }}</Text>
        <Text class="top-car-brand">{{ car.brand }}</Text>
        <Text class="top-car-value">{{ car.value }}</Text>
        <Text :class="['top-car-change', car.changeType === 'up' ? 'change-up' : 'change-down']">{{ car.change }}</Text>
      </View>
    </View>

    <!-- Remaining #4-#10 -->
    <View class="ranking-list">
      <View
        v-for="(car, index) in restList"
        :key="index"
        class="ranking-row"
      >
        <Text class="row-rank">{{ car.rank }}</Text>
        <View class="row-info">
          <Text class="row-name">{{ car.name }}</Text>
          <Text class="row-brand">{{ car.brand }}</Text>
        </View>
        <Text class="row-value">{{ car.value }}</Text>
        <Text :class="['row-change', car.changeType === 'up' ? 'change-up' : 'change-down']">{{ car.change }}</Text>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const tabs = ['保值率榜', '销量榜', '口碑榜', '关注榜']
const activeTab = ref(0)

const allCars = ref([
  { rank: 1, name: '保时捷 911', brand: 'Porsche', value: '89.2%', change: '↑ 2.1%', changeType: 'up' },
  { rank: 2, name: '法拉利 F8', brand: 'Ferrari', value: '87.5%', change: '↑ 1.8%', changeType: 'up' },
  { rank: 3, name: '劳斯莱斯 幻影', brand: 'Rolls-Royce', value: '85.3%', change: '↓ 0.5%', changeType: 'down' },
  { rank: 4, name: '兰博基尼 Huracán', brand: 'Lamborghini', value: '83.7%', change: '↑ 1.2%', changeType: 'up' },
  { rank: 5, name: '迈巴赫 S680', brand: 'Maybach', value: '82.1%', change: '↑ 0.9%', changeType: 'up' },
  { rank: 6, name: '奔驰 AMG GT', brand: 'Mercedes-AMG', value: '80.6%', change: '↓ 1.3%', changeType: 'down' },
  { rank: 7, name: '阿斯顿马丁 DB12', brand: 'Aston Martin', value: '78.9%', change: '↑ 0.7%', changeType: 'up' },
  { rank: 8, name: '宾利 欧陆 GT', brand: 'Bentley', value: '77.4%', change: '↓ 0.4%', changeType: 'down' },
  { rank: 9, name: '迈凯伦 750S', brand: 'McLaren', value: '76.1%', change: '↑ 1.5%', changeType: 'up' },
  { rank: 10, name: '玛莎拉蒂 MC20', brand: 'Maserati', value: '74.8%', change: '↓ 0.6%', changeType: 'down' }
])

const topThree = allCars.value.slice(0, 3)
const restList = allCars.value.slice(3)
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.ranking-page {
  min-height: 100vh;
  background: #FAFAFA;
}

.tabs-wrapper {
  background: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
  white-space: nowrap;

  .tabs {
    display: flex;
    padding: 0 8px;

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 24px;
      position: relative;

      .tab-text {
        font-size: 28px;
        color: #666666;
        font-family: 'PingFang SC', sans-serif;
      }

      .tab-text-active {
        color: #DA291C;
        font-weight: 600;
      }

      .tab-indicator {
        position: absolute;
        bottom: 0;
        width: 40px;
        height: 4px;
        background: #DA291C;
        border-radius: 2px;
      }
    }
  }
}

.top-three {
  display: flex;
  justify-content: space-between;
  padding: 24px 20px 16px;
  gap: 12px;

  .top-card {
    flex: 1;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #CCCCCC;
    position: relative;
  }

  .top-card-1 {
    border-color: #E8B800;

    .top-rank-badge {
      background: #E8B800;
    }

    .top-car-value {
      color: #E8B800;
    }
  }

  .top-card-2 {
    border-color: #C0C0C0;

    .top-rank-badge {
      background: #C0C0C0;
    }

    .top-car-value {
      color: #999999;
    }
  }

  .top-card-3 {
    border-color: #CD7F32;

    .top-rank-badge {
      background: #CD7F32;
    }

    .top-car-value {
      color: #CD7F32;
    }
  }

  .top-rank-badge {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .top-rank-num {
      font-size: 32px;
      color: #FFFFFF;
      font-weight: 700;
      font-family: 'SF Pro Display', sans-serif;
    }
  }

  .top-car-name {
    font-size: 26px;
    color: #181818;
    font-weight: 600;
    font-family: 'PingFang SC', sans-serif;
    margin-bottom: 4px;
    text-align: center;
  }

  .top-car-brand {
    font-size: 20px;
    color: #8F8F8F;
    font-family: 'PingFang SC', sans-serif;
    margin-bottom: 12px;
  }

  .top-car-value {
    font-size: 40px;
    font-weight: 700;
    font-family: 'SF Pro Display', sans-serif;
    margin-bottom: 8px;
  }

  .top-car-change {
    font-size: 22px;
    font-family: 'PingFang SC', sans-serif;
  }
}

.change-up {
  color: #DA291C;
}

.change-down {
  color: #2C5F8A;
}

.ranking-list {
  padding: 0 24px 32px;

  .ranking-row {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    padding: 24px;
    margin-bottom: 2px;
    border-bottom: 1px solid #F0F0F0;

    .row-rank {
      width: 48px;
      font-size: 32px;
      color: #181818;
      font-weight: 700;
      font-family: 'SF Pro Display', sans-serif;
      text-align: center;
    }

    .row-info {
      flex: 1;
      margin-left: 16px;

      .row-name {
        font-size: 28px;
        color: #181818;
        font-weight: 600;
        font-family: 'PingFang SC', sans-serif;
        display: block;
      }

      .row-brand {
        font-size: 22px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
        display: block;
        margin-top: 4px;
      }
    }

    .row-value {
      font-size: 28px;
      color: #181818;
      font-weight: 600;
      font-family: 'SF Pro Display', sans-serif;
      margin-right: 16px;
    }

    .row-change {
      font-size: 22px;
      width: 80px;
      text-align: right;
      font-family: 'PingFang SC', sans-serif;
    }
  }
}
</style>
