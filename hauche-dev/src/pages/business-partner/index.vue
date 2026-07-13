<template>
  <View class="page">
    <ScrollView scrollY class="scroll-area">
      <View class="stats-row">
        <View class="stat-card">
          <Text class="stat-number">46</Text>
          <Text class="stat-label">合作商户</Text>
        </View>
        <View class="stat-card">
          <Text class="stat-number">23单</Text>
          <Text class="stat-label">本月引荐</Text>
        </View>
        <View class="stat-card stat-card-accent">
          <Text class="stat-number">¥18.5万</Text>
          <Text class="stat-label">合作收入</Text>
        </View>
      </View>

      <View
        v-for="category in categories"
        :key="category.name"
        class="category-section"
      >
        <Text class="category-title">{{ category.name }}</Text>
        <View
          v-for="partner in category.partners"
          :key="partner.id"
          class="partner-card"
        >
          <View class="partner-header">
            <View class="partner-logo" :style="{ background: partner.logoColor }">
              <Text class="logo-text">{{ partner.name.charAt(0) }}</Text>
            </View>
            <View class="partner-info">
              <Text class="partner-name">{{ partner.name }}</Text>
              <View class="partner-tags">
                <View class="tag">
                  <Text class="tag-text">{{ partner.type }}</Text>
                </View>
              </View>
            </View>
            <View :class="['coop-badge', partner.status === '已合作' ? 'coop-active' : 'coop-pending']">
              <Text class="coop-badge-text">{{ partner.status }}</Text>
            </View>
          </View>
          <Text class="partner-desc">{{ partner.desc }}</Text>
        </View>
      </View>
    </ScrollView>

    <View class="bottom-btn-wrap">
      <View class="apply-btn" @tap="handleApply">
        <Text class="apply-btn-text">申请合作</Text>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    name: '金融机构',
    partners: [
      {
        id: 1,
        name: '瑞信私人银行',
        type: '金融贷款',
        status: '已合作',
        desc: '提供超跑专属金融方案，利率低至2.8%，最高可贷车价80%',
        logoColor: '#1A1A2E'
      },
      {
        id: 2,
        name: '中金财富',
        type: '理财顾问',
        status: '洽谈中',
        desc: '为高净值客户提供购车资产配置建议',
        logoColor: '#E8B800'
      }
    ]
  },
  {
    name: '保险公司',
    partners: [
      {
        id: 3,
        name: '平安产险豪车专线',
        type: '豪车保险',
        status: '已合作',
        desc: '超跑专属保险方案，全国通赔，尊享管家服务',
        logoColor: '#DA291C'
      }
    ]
  },
  {
    name: '豪车租赁',
    partners: [
      {
        id: 4,
        name: '星耀超跑俱乐部',
        type: '高端租赁',
        status: '已合作',
        desc: '百台超跑租赁，机场接送及婚庆用车服务',
        logoColor: '#333333'
      },
      {
        id: 5,
        name: '尊享出行',
        type: '商务租车',
        status: '洽谈中',
        desc: '高端商务接待及会务用车解决方案',
        logoColor: '#0F3460'
      }
    ]
  },
  {
    name: '维修保养',
    partners: [
      {
        id: 6,
        name: '驰加高端养护中心',
        type: '专业维保',
        status: '已合作',
        desc: '原厂认证技师，全系超跑维修保养服务',
        logoColor: '#34C759'
      }
    ]
  },
  {
    name: '生活服务',
    partners: [
      {
        id: 7,
        name: '鸿鹄高尔夫俱乐部',
        type: '高尔夫',
        status: '已合作',
        desc: '顶级球场资源，定期举办客户联谊活动',
        logoColor: '#2E8B57'
      },
      {
        id: 8,
        name: '璞丽酒店集团',
        type: '尊享住宿',
        status: '洽谈中',
        desc: '为外地看车客户提供五星住宿及接送安排',
        logoColor: '#8B4513'
      }
    ]
  }
])

const handleApply = () => {
  console.log('申请合作')
}
</script>

<style lang="scss">
@import '@/app.scss';

.page {
  background: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 140px;
}

.scroll-area {
  height: calc(100vh - 140px);
}

.stats-row {
  display: flex;
  padding: 16px;
  gap: 12px;
}

.stat-card {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px 12px;
  text-align: center;
}

.stat-card-accent {
  border-color: #E8B800;
}

.stat-number {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #DA291C;
  margin-bottom: 8px;
}

.stat-card-accent .stat-number {
  color: #E8B800;
}

.stat-label {
  font-size: 22px;
  color: #8F8F8F;
}

.category-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.category-title {
  font-size: 30px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 6px solid #DA291C;
}

.partner-card {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 12px;
}

.partner-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.partner-logo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 32px;
  color: #FFFFFF;
  font-weight: bold;
}

.partner-info {
  flex: 1;
}

.partner-name {
  font-size: 28px;
  font-weight: bold;
  color: #181818;
  display: block;
  margin-bottom: 8px;
}

.partner-tags {
  display: flex;
}

.tag {
  background: #F5F5F5;
  border: 1px solid #CCCCCC;
  border-radius: 2px;
  padding: 2px 12px;
}

.tag-text {
  font-size: 22px;
  color: #666666;
}

.coop-badge {
  padding: 4px 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.coop-active {
  background: #DA291C;
}

.coop-pending {
  background: #E8B800;
}

.coop-badge-text {
  font-size: 22px;
  color: #FFFFFF;
}

.partner-desc {
  font-size: 24px;
  color: #8F8F8F;
  line-height: 1.6;
  border-top: 1px solid #CCCCCC;
  padding-top: 16px;
}

.bottom-btn-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 32px;
  background: #FFFFFF;
  border-top: 1px solid #CCCCCC;
}

.apply-btn {
  background: #DA291C;
  border-radius: 8px;
  padding: 24px 0;
  text-align: center;
}

.apply-btn-text {
  color: #FFFFFF;
  font-size: 32px;
  font-weight: bold;
}
</style>
