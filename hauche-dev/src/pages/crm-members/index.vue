<template>
  <view class="page">
    <!-- Custom Header (since this page uses Taro navigateBack) -->
    <view class="header">
      <view class="header-back" @tap="handleBack">
        <text class="icon-arrow">&#xe5e0;</text>
      </view>
      <text class="header-title">会员管理</text>
      <view class="header-add" @tap="handleAdd">
        <text class="icon-plus">+</text>
      </view>
    </view>

    <!-- Search Bar -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">&#x1F50D;</text>
        <input
          class="search-input"
          type="text"
          placeholder="搜索会员姓名/手机号"
          placeholder-class="search-placeholder"
          :value="searchText"
          @input="onSearchInput"
          confirm-type="search"
        />
      </view>
    </view>

    <!-- Filter Tabs -->
    <scroll-view class="filter-tabs" scroll-x :show-scrollbar="false" enhanced>
      <view class="filter-tabs-inner">
        <view
          v-for="(tab, idx) in filterTabs"
          :key="idx"
          class="filter-tab"
          :class="{ active: activeTab === idx }"
          @tap="activeTab = idx"
        >
          <text class="filter-tab-text">{{ tab.label }} {{ tab.count }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- Member List -->
    <scroll-view
      class="member-list"
      scroll-y
      :show-scrollbar="false"
      enhanced
      @scrolltolower="onLoadMore"
    >
      <view
        v-for="(member, idx) in memberList"
        :key="member.id"
        class="member-card"
        @tap="handleMemberTap(member)"
      >
        <view class="card-body">
          <!-- Card Header: Avatar + Name + Badge -->
          <view class="card-header">
            <view class="avatar" :class="'avatar-' + member.tierColor">
              <text class="avatar-text">{{ member.name.charAt(0) }}</text>
            </view>
            <view class="card-info">
              <view class="name-row">
                <text class="name">{{ member.name }}</text>
                <view class="tier-badge" :class="'tier-' + member.tierColor">
                  <text class="tier-badge-text">{{ member.tier }}</text>
                </view>
              </view>
              <text class="phone">{{ member.phone }}</text>
            </view>
          </view>

          <!-- Tags -->
          <view class="tags-row" v-if="member.tags.length">
            <view
              v-for="(tag, tIdx) in member.tags"
              :key="tIdx"
              class="tag-pill"
              :class="'tag-' + tag.color"
            >
              <text class="tag-text">{{ tag.label }}</text>
            </view>
          </view>

          <!-- Meta -->
          <view class="card-meta">
            <text class="meta-text">{{ member.lastActive }}</text>
          </view>

          <!-- Purchase (optional) -->
          <view class="card-purchase" v-if="member.purchase">
            <text class="purchase-icon">&#x1F4E6;</text>
            <text class="purchase-text">已购: {{ member.purchase }}</text>
          </view>

          <!-- Commission (optional) -->
          <view
            v-if="member.commission"
            class="card-commission"
            :class="'commission-' + member.commission.status"
          >
            <text class="commission-icon">
              {{ member.commission.status === 'pending' ? '$' : '✓' }}
            </text>
            <text class="commission-text">
              居间佣金 {{ member.commission.amount }} {{ member.commission.label }}
            </text>
          </view>
        </view>

        <!-- Chevron -->
        <text class="chevron">&#x203A;</text>
      </view>
    </scroll-view>

    <!-- Floating Action Button -->
    <view class="fab" @tap="handleAdd">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// ── Search ──
const searchText = ref('')
const onSearchInput = (e) => {
  searchText.value = e.detail.value
}

// ── Filter Tabs ──
const activeTab = ref(0)
const filterTabs = ref([
  { label: '全部', count: 128 },
  { label: '普通车友', count: 86 },
  { label: '入门会员 ¥9,800', count: 28 },
  { label: '高端私董 ¥19,800', count: 14 },
])

// ── Member Data ──
const memberList = ref([
  {
    id: 1,
    name: '李明辉',
    phone: '138****6789',
    tier: '高端私董',
    tierColor: 'gold',
    tags: [
      { label: '企业主', color: 'purple' },
      { label: '房产', color: 'teal' },
      { label: '高尔夫', color: 'amber' },
    ],
    lastActive: '2天前活跃',
    purchase: '保时捷Cayenne, 迈巴赫S480',
    commission: { amount: '¥15万', label: '待结算', status: 'pending' },
  },
  {
    id: 2,
    name: '张伟',
    phone: '139****1234',
    tier: '入门会员',
    tierColor: 'blue',
    tags: [
      { label: '投资人', color: 'blue' },
      { label: '收藏', color: 'purple' },
    ],
    lastActive: '1周前活跃',
    purchase: '宝马7系',
    commission: null,
  },
  {
    id: 3,
    name: '王强',
    phone: '136****5678',
    tier: '普通车友',
    tierColor: 'gray',
    tags: [
      { label: '高尔夫', color: 'amber' },
    ],
    lastActive: '3天前活跃',
    purchase: null,
    commission: null,
  },
  {
    id: 4,
    name: '陈志远',
    phone: '137****4321',
    tier: '高端私董',
    tierColor: 'gold',
    tags: [
      { label: '企业主', color: 'purple' },
      { label: '房产', color: 'teal' },
      { label: '高尔夫', color: 'amber' },
      { label: '红酒', color: 'rose' },
    ],
    lastActive: '5天前活跃',
    purchase: null,
    commission: { amount: '¥8万', label: '已结算', status: 'settled' },
  },
  {
    id: 5,
    name: '刘芳',
    phone: '135****9012',
    tier: '入门会员',
    tierColor: 'blue',
    tags: [
      { label: '房产', color: 'teal' },
      { label: '红酒', color: 'rose' },
    ],
    lastActive: '昨天活跃',
    purchase: '奔驰GLE',
    commission: null,
  },
])

// ── Actions ──
const handleBack = () => {
  Taro.navigateBack()
}

const handleAdd = () => {
  Taro.showToast({ title: '新增会员', icon: 'none' })
}

const handleMemberTap = (member) => {
  Taro.showActionSheet({
    itemList: ['查看详情', '编辑会员', '拨打电话', '发送消息'],
    success: (res) => {
      if (res.tapIndex === 0) {
        Taro.showToast({ title: `查看 ${member.name}`, icon: 'none' })
      } else if (res.tapIndex === 2) {
        Taro.makePhoneCall({ phoneNumber: member.phone })
      }
    },
  })
}

const onLoadMore = () => {
  Taro.showToast({ title: '加载更多...', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

/* ── Design Tokens ── */
$color-primary: #C8A45C;
$color-primary-light: #D4B76E;
$color-primary-lighter: #E2CC8E;
$color-primary-lightest: rgba(200, 164, 92, 0.1);
$color-primary-dark: #A6893F;

$color-bg: #0C0C14;
$color-bg-secondary: #111119;
$color-surface: #16161F;
$color-surface-elevated: #1C1C28;
$color-surface-hover: #222232;

$text-primary: #F0ECE4;
$text-secondary: #8A867E;
$text-tertiary: #5A5750;

$border-color: rgba(255, 255, 255, 0.06);
$success: #34D399;
$success-bg: rgba(52, 211, 153, 0.1);
$warning: #FBBF24;
$info: #60A5FA;
$info-bg: rgba(96, 165, 250, 0.1);

$radius-sm: 12rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-full: 9999rpx;

/* ── Page ── */
.page {
  min-height: 100vh;
  background: $color-bg;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background: $color-bg;
  border-bottom: 3rpx solid $color-primary;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-back,
.header-add {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-back .icon-arrow {
  font-size: 36rpx;
  color: $text-primary;
}

.header-add .icon-plus {
  font-size: 40rpx;
  font-weight: 300;
  color: $color-primary;
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 0.04em;
}

/* ── Search Bar ── */
.search-bar {
  padding: 24rpx 32rpx;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 72rpx;
  background: $color-surface;
  border: 1rpx solid $border-color;
  border-radius: $radius-full;
  padding: 0 28rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: $text-primary;
  background: transparent;
}

.search-placeholder {
  color: $text-tertiary;
  font-size: 28rpx;
}

/* ── Filter Tabs ── */
.filter-tabs {
  white-space: nowrap;
  padding: 0 32rpx 24rpx;
}

.filter-tabs-inner {
  display: inline-flex;
  gap: 16rpx;
}

.filter-tab {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  border-radius: $radius-full;
  border: 1rpx solid $border-color;
  background: transparent;

  &.active {
    background: rgba(200, 164, 92, 0.15);
    border-color: $color-primary;
  }
}

.filter-tab-text {
  font-size: 26rpx;
  font-weight: 500;
  color: $text-secondary;

  .active & {
    color: $color-primary;
  }
}

/* ── Member List ── */
.member-list {
  flex: 1;
  padding: 0 32rpx;
  padding-bottom: 200rpx;
}

/* ── Member Card ── */
.member-card {
  background: $color-surface;
  border: 1rpx solid $border-color;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  position: relative;

  &:active {
    background: $color-surface-hover;
  }
}

.chevron {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: $text-tertiary;
}

.card-body {
  padding-right: 48rpx;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;

  &.avatar-gold {
    background: rgba(200, 164, 92, 0.15);
  }
  &.avatar-blue {
    background: rgba(96, 165, 250, 0.12);
  }
  &.avatar-gray {
    background: rgba(138, 134, 126, 0.12);
  }
}

.avatar-text {
  font-size: 34rpx;
  font-weight: 600;
  color: $color-primary;
  .avatar-blue & { color: $info; }
  .avatar-gray & { color: $text-secondary; }
}

.card-info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 4rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.tier-badge {
  padding: 4rpx 16rpx;
  border-radius: $radius-full;

  &.tier-gold {
    background: rgba(200, 164, 92, 0.18);
  }
  &.tier-blue {
    background: rgba(96, 165, 250, 0.15);
  }
  &.tier-gray {
    background: rgba(138, 134, 126, 0.15);
  }
}

.tier-badge-text {
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 0.04em;

  .tier-gold & { color: $color-primary-lighter; }
  .tier-blue & { color: $info; }
  .tier-gray & { color: $text-secondary; }
}

.phone {
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 16rpx;
}

/* Tags */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.tag-pill {
  padding: 4rpx 16rpx;
  border-radius: $radius-full;

  &.tag-purple { background: rgba(167, 139, 250, 0.12); }
  &.tag-teal { background: rgba(52, 211, 153, 0.1); }
  &.tag-amber { background: rgba(251, 191, 36, 0.1); }
  &.tag-blue { background: rgba(96, 165, 250, 0.1); }
  &.tag-rose { background: rgba(251, 113, 133, 0.1); }
}

.tag-text {
  font-size: 22rpx;
  font-weight: 500;

  .tag-purple & { color: #A78BFA; }
  .tag-teal & { color: $success; }
  .tag-amber & { color: $warning; }
  .tag-blue & { color: $info; }
  .tag-rose & { color: #FB7185; }
}

/* Meta */
.card-meta {
  margin-bottom: 8rpx;
}

.meta-text {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* Purchase */
.card-purchase {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.purchase-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
  opacity: 0.5;
}

.purchase-text {
  font-size: 22rpx;
  color: $text-secondary;
}

/* Commission */
.card-commission {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 20rpx;
  border-radius: $radius-sm;
  margin-top: 8rpx;

  &.commission-pending {
    background: rgba(200, 164, 92, 0.12);
  }
  &.commission-settled {
    background: $success-bg;
  }
}

.commission-icon {
  font-size: 22rpx;
  font-weight: 700;

  .commission-pending & { color: $color-primary-lighter; }
  .commission-settled & { color: $success; }
}

.commission-text {
  font-size: 22rpx;
  font-weight: 600;

  .commission-pending & { color: $color-primary-lighter; }
  .commission-settled & { color: $success; }
}

/* ── Floating Action Button ── */
.fab {
  position: fixed;
  right: 32rpx;
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  box-shadow: 0 8rpx 40rpx rgba(200, 164, 92, 0.35);

  &:active {
    transform: scale(0.92);
    opacity: 0.9;
  }
}

.fab-icon {
  font-size: 48rpx;
  font-weight: 300;
  color: $color-bg;
  line-height: 1;
}
</style>
