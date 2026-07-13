<template>
  <View class="news-page">
    <!-- Category Tabs -->
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

    <!-- News List -->
    <ScrollView scroll-y class="news-list">
      <View v-for="(news, index) in newsList" :key="index" class="news-card">
        <View class="news-cover" :style="{ background: news.gradient }">
          <Text class="cover-tag">{{ news.tag }}</Text>
        </View>
        <View class="news-info">
          <Text class="news-title">{{ news.title }}</Text>
          <Text class="news-summary">{{ news.summary }}</Text>
          <View class="news-footer">
            <Text class="news-source">{{ news.source }}</Text>
            <Text class="news-dot">·</Text>
            <Text class="news-date">{{ news.date }}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const tabs = ['行业动态', '新车发布', '豪车评测', '行业报告']
const activeTab = ref(0)

const newsList = ref([
  {
    title: '2026年全球超豪华汽车销量报告出炉',
    summary: '据最新数据显示，2026年上半年全球超豪华品牌累计销量同比增长12%，其中劳斯莱斯和法拉利表现最为突出，分别实现了18%和15%的增长。',
    tag: '行业报告',
    source: '豪车之家研究院',
    date: '2026-07-12',
    gradient: 'linear-gradient(135deg, #DA291C 0%, #8B0000 100%)'
  },
  {
    title: '法拉利全新 hypercar 将于九月亮相',
    summary: '法拉利官方确认将于今年九月的米兰设计周发布一款限量版 hypercar，搭载 V6 混动系统，预计最大功率超过 1000 匹马力。',
    tag: '新车发布',
    source: 'Ferrari News',
    date: '2026-07-11',
    gradient: 'linear-gradient(135deg, #E8B800 0%, #B8860B 100%)'
  },
  {
    title: '保时捷 Cayenne 全新换代车型详细评测',
    summary: '全新第三代 Cayenne 在操控性、舒适性和科技配置上均有显著提升，全系标配空气悬架和 PDCC 动态底盘控制系统。',
    tag: '豪车评测',
    source: '豪车之家评测组',
    date: '2026-07-10',
    gradient: 'linear-gradient(135deg, #2C5F8A 0%, #1A3A5C 100%)'
  },
  {
    title: '兰博基尼与麻省理工合作研发新材质',
    summary: '兰博基尼宣布与麻省理工学院合作开发下一代碳纤维复合材料，预计可将车身重量进一步降低 15%，同时提升碰撞安全性。',
    tag: '行业动态',
    source: 'Auto Insider',
    date: '2026-07-09',
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)'
  },
  {
    title: '迈巴赫 EQS SUV 中国市场正式上市',
    summary: '奔驰旗下 ultra-luxury 品牌 Maybach 首款纯电 SUV EQS 680 正式登陆中国市场，售价 258 万元起，综合续航超过 600 公里。',
    tag: '新车发布',
    source: '豪车之家快讯',
    date: '2026-07-08',
    gradient: 'linear-gradient(135deg, #333333 0%, #1A1A1A 100%)'
  }
])
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.news-page {
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

.news-list {
  padding: 16px 24px;
}

.news-card {
  background: #FFFFFF;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;

  .news-cover {
    height: 320px;
    display: flex;
    align-items: flex-end;
    padding: 16px 20px;
    position: relative;

    .cover-tag {
      font-size: 22px;
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 12px;
      border-radius: 2px;
      font-family: 'PingFang SC', sans-serif;
    }
  }

  .news-info {
    padding: 20px 24px;

    .news-title {
      font-size: 32px;
      color: #181818;
      font-weight: 700;
      line-height: 48px;
      font-family: 'PingFang SC', sans-serif;
      display: block;
      margin-bottom: 8px;
    }

    .news-summary {
      font-size: 26px;
      color: #666666;
      line-height: 42px;
      font-family: 'PingFang SC', sans-serif;
      display: block;
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .news-footer {
      display: flex;
      align-items: center;

      .news-source {
        font-size: 22px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
      }

      .news-dot {
        font-size: 22px;
        color: #B0B0B0;
        margin: 0 8px;
      }

      .news-date {
        font-size: 22px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
      }
    }
  }
}
</style>
