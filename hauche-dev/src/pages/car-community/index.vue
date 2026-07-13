<template>
  <View class="community-page">
    <!-- Search Bar -->
    <View class="search-bar">
      <View class="search-input">
        <Text class="search-icon">🔍</Text>
        <Text class="search-placeholder">搜索话题、帖子或用户</Text>
      </View>
    </View>

    <!-- Topic Tabs -->
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

    <!-- Post List -->
    <ScrollView scroll-y class="post-list">
      <View v-for="(post, index) in posts" :key="index" class="post-card">
        <!-- Post Header -->
        <View class="post-header">
          <View class="avatar" :style="{ background: post.avatarColor }">
            <Text class="avatar-text">{{ post.nickname.charAt(0) }}</Text>
          </View>
          <View class="post-meta">
            <Text class="post-nickname">{{ post.nickname }}</Text>
            <Text class="post-time">{{ post.time }}</Text>
          </View>
        </View>

        <!-- Post Content -->
        <View class="post-content">
          <Text class="post-text">{{ post.content }}</Text>
        </View>

        <!-- Post Images -->
        <View class="post-images">
          <View
            v-for="(img, imgIdx) in post.images"
            :key="imgIdx"
            class="post-image"
            :style="{ background: img }"
          />
        </View>

        <!-- Post Actions -->
        <View class="post-actions">
          <View class="action-item">
            <Text class="action-icon">♡</Text>
            <Text class="action-count">{{ post.likes }}</Text>
          </View>
          <View class="action-item">
            <Text class="action-icon">💬</Text>
            <Text class="action-count">{{ post.comments }}</Text>
          </View>
        </View>
      </View>
    </ScrollView>

    <!-- Floating Post Button -->
    <View class="fab-button" @tap="handlePost">
      <Text class="fab-text">发帖</Text>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const tabs = ['热门话题', '超跑体验', '豪车改装', '新车速递']
const activeTab = ref(0)

const posts = ref([
  {
    nickname: '超跑玩家Alex',
    avatarColor: '#DA291C',
    time: '10分钟前',
    content: '今天试驾了法拉利SF90，V8双涡轮增压加上三电机，加速体验简直让人窒息。红漆在阳光下特别惊艳，这才是真正的超跑魅力！',
    images: ['#E8B800', '#DA291C', '#333333'],
    likes: 128,
    comments: 32
  },
  {
    nickname: '豪车测评老陈',
    avatarColor: '#2C5F8A',
    time: '30分钟前',
    content: '迈巴赫S680的后排体验无可挑剔，航空座椅搭配柏林之声，商务出行的天花板。唯一遗憾的是油耗偏高，市区百公里大概18L左右。',
    images: ['#666666', '#8F8F8F', '#B0B0B0'],
    likes: 256,
    comments: 67
  },
  {
    nickname: '兰博基尼车主Leo',
    avatarColor: '#E8B800',
    time: '1小时前',
    content: '给Huracán EVO做了全车碳纤维改装，前唇、后扩散器、侧裙全部换了锻造碳。重量减轻了40公斤，视觉效果拉满！',
    images: ['#FFD700', '#C0C0C0', '#CD7F32'],
    likes: 89,
    comments: 45
  },
  {
    nickname: '保时捷控小王',
    avatarColor: '#1A1A2E',
    time: '2小时前',
    content: '新款保时捷911 GT3 RS 实车到店了！4.0L自然吸气水平对置六缸，红线转速9000转，这才是纯粹的驾驶机器。各位车友周末有空来看看？',
    images: ['#4A4A4A', '#6B6B6B', '#8C8C8C'],
    likes: 342,
    comments: 98
  }
])

const handlePost = () => {
  Taro.showToast({ title: '发帖功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.community-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 120px;
}

.search-bar {
  padding: 16px 24px;
  background: #FFFFFF;

  .search-input {
    display: flex;
    align-items: center;
    height: 72px;
    background: #F5F5F5;
    border-radius: 4px;
    padding: 0 20px;

    .search-icon {
      font-size: 28px;
      margin-right: 12px;
    }

    .search-placeholder {
      font-size: 26px;
      color: #B0B0B0;
      font-family: 'PingFang SC', sans-serif;
    }
  }
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

.post-list {
  padding: 16px 24px;
}

.post-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      .avatar-text {
        font-size: 28px;
        color: #FFFFFF;
        font-family: 'PingFang SC', sans-serif;
        font-weight: 600;
      }
    }

    .post-meta {
      .post-nickname {
        font-size: 28px;
        color: #181818;
        font-weight: 600;
        font-family: 'PingFang SC', sans-serif;
        display: block;
      }

      .post-time {
        font-size: 22px;
        color: #B0B0B0;
        font-family: 'PingFang SC', sans-serif;
        display: block;
        margin-top: 4px;
      }
    }
  }

  .post-content {
    margin-bottom: 16px;

    .post-text {
      font-size: 28px;
      color: #181818;
      line-height: 44px;
      font-family: 'PingFang SC', sans-serif;
    }
  }

  .post-images {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;

    .post-image {
      flex: 1;
      height: 180px;
      border-radius: 4px;
    }
  }

  .post-actions {
    display: flex;
    gap: 40px;
    padding-top: 12px;
    border-top: 1px solid #F0F0F0;

    .action-item {
      display: flex;
      align-items: center;

      .action-icon {
        font-size: 28px;
        margin-right: 6px;
      }

      .action-count {
        font-size: 24px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
      }
    }
  }
}

.fab-button {
  position: fixed;
  right: 32px;
  bottom: 160px;
  width: 112px;
  height: 112px;
  background: #DA291C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .fab-text {
    font-size: 30px;
    color: #FFFFFF;
    font-weight: 600;
    font-family: 'PingFang SC', sans-serif;
  }
}
</style>
