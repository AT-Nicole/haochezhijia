<template>
  <View class="reviews-page">
    <!-- Brand Filter -->
    <ScrollView scroll-x class="filter-bar">
      <View class="filter-tags">
        <View
          v-for="(brand, index) in brands"
          :key="index"
          :class="['filter-tag', activeBrand === index ? 'filter-tag-active' : '']"
          @tap="activeBrand = index"
        >
          <Text :class="['filter-tag-text', activeBrand === index ? 'filter-tag-text-active' : '']">{{ brand }}</Text>
        </View>
      </View>
    </ScrollView>

    <!-- Overall Rating -->
    <View class="rating-overview">
      <Text class="rating-label">综合评分</Text>
      <View class="rating-score-wrap">
        <Text class="rating-score">4.8</Text>
        <Text class="rating-max">/5.0</Text>
      </View>
      <View class="stars-display">
        <Text class="star filled">★★★★★</Text>
      </View>
      <Text class="rating-count">基于 2,368 条真实车主评价</Text>
    </View>

    <!-- Review List -->
    <ScrollView scroll-y class="review-list">
      <View v-for="(review, index) in reviews" :key="index" class="review-card">
        <View class="review-header">
          <View class="review-avatar" :style="{ background: review.avatarColor }">
            <Text class="review-avatar-text">{{ review.nickname.charAt(0) }}</Text>
          </View>
          <View class="review-meta">
            <Text class="review-nickname">{{ review.nickname }}</Text>
            <Text class="review-model">{{ review.carModel }}</Text>
          </View>
          <View class="review-rating">
            <Text class="review-stars" :style="{ color: review.rating >= 4 ? '#E8B800' : '#DA291C' }">{{ review.stars }}</Text>
            <Text class="review-rating-num">{{ review.rating }}.0</Text>
          </View>
        </View>

        <View class="review-content">
          <Text class="review-text">{{ review.content }}</Text>
        </View>

        <Text class="review-date">{{ review.date }}</Text>
      </View>
    </ScrollView>
  </View>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const brands = ['全部', '保时捷', '法拉利', '兰博基尼', '迈巴赫', '劳斯莱斯']
const activeBrand = ref(0)

const reviews = ref([
  {
    nickname: '超跑发烧友',
    avatarColor: '#DA291C',
    carModel: '法拉利 SF90 Stradale',
    rating: 5,
    stars: '★★★★★',
    content: '绝对是最值得购买的超级跑车！V8双涡轮加三电机的动力组合太疯狂了，百公里加速2.5秒。操控精准到不可思议，转向手感完美。唯一缺点是日常通勤有点太张扬了。',
    date: '2026-07-10'
  },
  {
    nickname: '商务精英Jack',
    avatarColor: '#2C5F8A',
    carModel: '迈巴赫 S680',
    rating: 5,
    stars: '★★★★★',
    content: '作为商务座驾，迈巴赫S680无可挑剔。后排座椅舒适度堪比头等舱，柏林之声音质出色。V12发动机动力充沛但非常平顺，车内静谧性极佳。配司机开是最正确的选择。',
    date: '2026-07-08'
  },
  {
    nickname: '性能控Tom',
    avatarColor: '#E8B800',
    carModel: '兰博基尼 Huracán EVO',
    rating: 4,
    stars: '★★★★☆',
    content: '5.2L V10自然吸气的声浪是任何涡轮增压都给不了的，这才是超跑该有的声音！操控极其出色，四驱系统信心十足。扣一星是因为内饰材质和同价位比还有提升空间。',
    date: '2026-07-06'
  },
  {
    nickname: '德系忠粉',
    avatarColor: '#333333',
    carModel: '保时捷 911 Turbo S',
    rating: 5,
    stars: '★★★★★',
    content: '第三代992 Turbo S堪称日常可用性最强的超跑。3.2秒破百，底盘兼顾舒适与运动，PDK变速箱无懈可击。外观低调但性能恐怖，这就是保时捷的魅力——完美平衡。',
    date: '2026-07-04'
  },
  {
    nickname: '浮夸的劳',
    avatarColor: '#8B4513',
    carModel: '劳斯莱斯 Ghost',
    rating: 5,
    stars: '★★★★★',
    content: '幻影太大了，古思特才是最完美的劳斯莱斯。车身尺寸恰到好处，气场不输幻影。星空顶、车门雨伞这些细节让人感动。开在路上回头率100%，服务体验也是行业标杆。',
    date: '2026-07-02'
  }
])
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.reviews-page {
  min-height: 100vh;
  background: #FAFAFA;
}

.filter-bar {
  background: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
  white-space: nowrap;

  .filter-tags {
    display: flex;
    padding: 16px 24px;
    gap: 12px;

    .filter-tag {
      padding: 10px 24px;
      border-radius: 4px;
      border: 1px solid #CCCCCC;
      background: #FFFFFF;

      .filter-tag-text {
        font-size: 24px;
        color: #666666;
        font-family: 'PingFang SC', sans-serif;
      }

      .filter-tag-text-active {
        color: #FFFFFF;
      }
    }

    .filter-tag-active {
      background: #DA291C;
      border-color: #DA291C;
    }
  }
}

.rating-overview {
  background: #FFFFFF;
  margin: 16px 24px;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .rating-label {
    font-size: 26px;
    color: #8F8F8F;
    font-family: 'PingFang SC', sans-serif;
    margin-bottom: 16px;
  }

  .rating-score-wrap {
    display: flex;
    align-items: baseline;
    margin-bottom: 12px;

    .rating-score {
      font-size: 80px;
      color: #DA291C;
      font-weight: 700;
      font-family: 'SF Pro Display', sans-serif;
      line-height: 1;
    }

    .rating-max {
      font-size: 28px;
      color: #B0B0B0;
      font-family: 'SF Pro Display', sans-serif;
      margin-left: 4px;
    }
  }

  .stars-display {
    margin-bottom: 8px;

    .star {
      font-size: 36px;

      &.filled {
        color: #E8B800;
      }
    }
  }

  .rating-count {
    font-size: 22px;
    color: #B0B0B0;
    font-family: 'PingFang SC', sans-serif;
  }
}

.review-list {
  padding: 0 24px 32px;
}

.review-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;

  .review-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .review-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      .review-avatar-text {
        font-size: 28px;
        color: #FFFFFF;
        font-weight: 600;
        font-family: 'PingFang SC', sans-serif;
      }
    }

    .review-meta {
      flex: 1;

      .review-nickname {
        font-size: 28px;
        color: #181818;
        font-weight: 600;
        font-family: 'PingFang SC', sans-serif;
        display: block;
      }

      .review-model {
        font-size: 22px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
        display: block;
        margin-top: 4px;
      }
    }

    .review-rating {
      text-align: right;

      .review-stars {
        font-size: 24px;
        display: block;
      }

      .review-rating-num {
        font-size: 24px;
        color: #181818;
        font-weight: 600;
        font-family: 'SF Pro Display', sans-serif;
        display: block;
        margin-top: 4px;
      }
    }
  }

  .review-content {
    margin-bottom: 12px;

    .review-text {
      font-size: 26px;
      color: #666666;
      line-height: 42px;
      font-family: 'PingFang SC', sans-serif;
    }
  }

  .review-date {
    font-size: 22px;
    color: #B0B0B0;
    font-family: 'PingFang SC', sans-serif;
  }
}
</style>
