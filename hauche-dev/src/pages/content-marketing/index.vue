<template>
  <View class="page">
    <View class="filter-tabs">
      <View
        v-for="tab in publishTabs"
        :key="tab"
        :class="['tab-item', activePublishTab === tab ? 'tab-active' : '']"
        @tap="activePublishTab = tab"
      >
        <Text :class="['tab-text', activePublishTab === tab ? 'tab-text-active' : '']">{{ tab }}</Text>
      </View>
    </View>

    <View class="section">
      <View class="section-title-row">
        <Text class="section-title">内容库</Text>
      </View>
      <View class="library-tabs">
        <View
          v-for="tab in libraryTabs"
          :key="tab"
          :class="['lib-tab', activeLibTab === tab ? 'lib-tab-active' : '']"
          @tap="activeLibTab = tab"
        >
          <Text :class="['lib-tab-text', activeLibTab === tab ? 'lib-tab-text-active' : '']">{{ tab }}</Text>
        </View>
      </View>

      <View
        v-for="item in contentList"
        :key="item.id"
        class="content-card"
      >
        <View class="content-cover" :style="{ background: item.gradient }">
          <Text class="cover-label">{{ item.type }}</Text>
        </View>
        <View class="content-info">
          <Text class="content-title">{{ item.title }}</Text>
          <View class="content-meta">
            <Text class="meta-date">{{ item.date }}</Text>
            <Text class="meta-stat">浏览 {{ item.views }}</Text>
            <Text class="meta-stat">点赞 {{ item.likes }}</Text>
          </View>
          <View class="content-actions">
            <View class="action-btn action-edit" @tap="handleEdit(item)">
              <Text class="action-text">编辑</Text>
            </View>
            <View class="action-btn action-share" @tap="handleShare(item)">
              <Text class="action-text">分享</Text>
            </View>
            <View class="action-btn action-delete" @tap="handleDelete(item)">
              <Text class="action-text action-text-danger">删除</Text>
            </View>
          </View>
        </View>
      </View>
    </View>

    <View class="section">
      <View class="section-title-row">
        <Text class="section-title">营销模板</Text>
      </View>
      <View class="template-grid">
        <View
          v-for="tpl in templates"
          :key="tpl.name"
          class="template-card"
          @tap="handleTemplate(tpl)"
        >
          <View class="template-cover" :style="{ background: tpl.gradient }">
            <Text class="template-icon">{{ tpl.icon }}</Text>
          </View>
          <Text class="template-label">{{ tpl.name }}</Text>
        </View>
      </View>
    </View>

    <View class="ai-btn-wrap">
      <View class="ai-btn" @tap="handleAIGenerate">
        <Text class="ai-btn-text">AI一键生成</Text>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'

const activePublishTab = ref('已发布')
const publishTabs = ['已发布', '草稿', '审核中']

const activeLibTab = ref('图文')
const libraryTabs = ['图文', '视频', '海报']

const contentList = ref([
  {
    id: 1,
    type: '图文',
    title: 'Ferrari SF90 Stradale 深度试驾评测',
    date: '2026-07-10',
    views: 2340,
    likes: 186,
    gradient: 'linear-gradient(135deg, #DA291C, #8B0000)'
  },
  {
    id: 2,
    type: '视频',
    title: '2026款劳斯莱斯幻影 全球首发',
    date: '2026-07-08',
    views: 5620,
    likes: 423,
    gradient: 'linear-gradient(135deg, #E8B800, #B8860B)'
  },
  {
    id: 3,
    type: '图文',
    title: '超跑保养指南：夏季注意事项',
    date: '2026-07-05',
    views: 1890,
    likes: 152,
    gradient: 'linear-gradient(135deg, #333333, #181818)'
  },
  {
    id: 4,
    type: '海报',
    title: '七月限时品鉴会 · 迈巴赫S级专场',
    date: '2026-07-01',
    views: 3100,
    likes: 278,
    gradient: 'linear-gradient(135deg, #1A1A2E, #16213E)'
  }
])

const templates = ref([
  {
    name: '新车发布',
    icon: '🚗',
    gradient: 'linear-gradient(135deg, #DA291C, #FF6B6B)'
  },
  {
    name: '限时优惠',
    icon: '🏷',
    gradient: 'linear-gradient(135deg, #E8B800, #FFD700)'
  },
  {
    name: '品牌故事',
    icon: '📖',
    gradient: 'linear-gradient(135deg, #1A1A2E, #0F3460)'
  },
  {
    name: '节日促销',
    icon: '🎉',
    gradient: 'linear-gradient(135deg, #333333, #666666)'
  }
])

const handleEdit = (item) => {
  console.log('编辑内容', item.id)
}

const handleShare = (item) => {
  console.log('分享内容', item.id)
}

const handleDelete = (item) => {
  console.log('删除内容', item.id)
}

const handleTemplate = (tpl) => {
  console.log('使用模板', tpl.name)
}

const handleAIGenerate = () => {
  console.log('AI一键生成')
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 140px;
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

.section {
  padding: 24px 16px;
}

.section-title-row {
  margin-bottom: 20px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #181818;
}

.library-tabs {
  display: flex;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}

.lib-tab {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  border-radius: 4px;
}

.lib-tab-active {
  background: #DA291C;
}

.lib-tab-text {
  font-size: 26px;
  color: #666666;
}

.lib-tab-text-active {
  color: #FFFFFF;
  font-weight: bold;
}

.content-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.content-cover {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-label {
  font-size: 28px;
  color: #FFFFFF;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 24px;
  border-radius: 4px;
}

.content-info {
  padding: 20px 24px;
}

.content-title {
  font-size: 30px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 12px;
}

.content-meta {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.meta-date {
  font-size: 24px;
  color: #8F8F8F;
  margin-right: 20px;
}

.meta-stat {
  font-size: 24px;
  color: #8F8F8F;
  margin-right: 20px;
}

.content-actions {
  display: flex;
  border-top: 1px solid #CCCCCC;
  padding-top: 16px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  border-right: 1px solid #CCCCCC;

  &:last-child {
    border-right: none;
  }
}

.action-text {
  font-size: 26px;
  color: #181818;
}

.action-text-danger {
  color: #DA291C;
}

.template-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.template-card {
  width: calc(50% - 8px);
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  overflow: hidden;
}

.template-cover {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-icon {
  font-size: 48px;
}

.template-label {
  display: block;
  text-align: center;
  padding: 16px;
  font-size: 26px;
  color: #181818;
  font-weight: bold;
}

.ai-btn-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 32px;
  background: #FFFFFF;
  border-top: 1px solid #CCCCCC;
}

.ai-btn {
  background: #DA291C;
  border-radius: 8px;
  padding: 24px 0;
  text-align: center;
}

.ai-btn-text {
  color: #FFFFFF;
  font-size: 32px;
  font-weight: bold;
}
</style>
