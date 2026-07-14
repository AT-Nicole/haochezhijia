<template>
  <View class="finance-page">
    <!-- Hero Banner -->
    <View class="hero-banner">
      <View class="hero-content">
        <Text class="hero-title">豪车尊享金融</Text>
        <Text class="hero-subtitle">专属定制 · 低利率 · 快速审批</Text>
      </View>
    </View>

    <!-- Loan Calculator -->
    <View class="calc-card">
      <Text class="card-title">贷款计算器</Text>

      <View class="calc-section">
        <View class="calc-label-row">
          <Text class="calc-label">贷款金额</Text>
          <Text class="calc-value">{{ loanAmount }} 万元</Text>
        </View>
        <View class="slider-track" @tap="onSliderTap" @touchmove="onSliderMove" @touchend="onSliderEnd">
          <View class="slider-fill" :style="{ width: sliderPercent + '%' }" />
          <View class="slider-thumb" :style="{ left: sliderPercent + '%' }" />
        </View>
        <View class="slider-range">
          <Text class="range-label">10万</Text>
          <Text class="range-label">500万</Text>
        </View>
      </View>

      <View class="calc-section">
        <Text class="calc-label">贷款期限</Text>
        <View class="term-options">
          <View
            v-for="(term, index) in terms"
            :key="index"
            :class="['term-item', activeTerm === index ? 'term-active' : '']"
            @tap="activeTerm = index"
          >
            <Text :class="['term-text', activeTerm === index ? 'term-text-active' : '']">{{ term }}</Text>
          </View>
        </View>
      </View>

      <View class="result-section">
        <Text class="result-label">预计月供</Text>
        <View class="result-row">
          <Text class="result-value">{{ monthlyPayment }}</Text>
          <Text class="result-unit">元/月</Text>
        </View>
      </View>
    </View>

    <!-- Product Cards -->
    <View class="products-section">
      <Text class="section-title">金融产品</Text>

      <View v-for="(product, index) in products" :key="index" class="product-card">
        <View class="product-header">
          <Text class="product-name">{{ product.name }}</Text>
          <View class="product-tag" :style="{ background: product.tagColor }">
            <Text class="product-tag-text">{{ product.tag }}</Text>
          </View>
        </View>
        <View class="product-details">
          <View class="product-detail">
            <Text class="detail-label">年利率</Text>
            <Text class="detail-value">{{ product.rate }}</Text>
          </View>
          <View class="product-detail">
            <Text class="detail-label">最长期限</Text>
            <Text class="detail-value">{{ product.maxTerm }}</Text>
          </View>
          <View class="product-detail">
            <Text class="detail-label">首付比例</Text>
            <Text class="detail-value">{{ product.downPayment }}</Text>
          </View>
        </View>
        <Text class="product-feature">{{ product.feature }}</Text>
      </View>
    </View>

    <!-- CTA Button -->
    <View class="cta-section">
      <View class="cta-button" @tap="handleApply">
        <Text class="cta-text">申请咨询</Text>
      </View>
      <Text class="cta-note">提交申请后专属顾问将在24小时内联系您</Text>
    </View>
  </View>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

const loanAmount = ref(200)
const sliderPercent = computed(() => {
  return ((loanAmount.value - 10) / (500 - 10)) * 100
})

const terms = ['12期', '24期', '36期', '48期', '60期']
const activeTerm = ref(2)

const monthlyPayment = computed(() => {
  const months = [12, 24, 36, 48, 60][activeTerm.value]
  const total = loanAmount.value * 10000
  const rate = 0.035 / 12
  const payment = Math.round((total * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1))
  return payment.toLocaleString()
})

const products = ref([
  {
    name: '低息贷',
    tag: '热门',
    tagColor: '#DA291C',
    rate: '3.5%',
    maxTerm: '60个月',
    downPayment: '30%',
    feature: '超低利率，适合长期持有豪车的客户，还款压力更小'
  },
  {
    name: '零首付',
    tag: '新品',
    tagColor: '#E8B800',
    rate: '4.8%',
    maxTerm: '36个月',
    downPayment: '0%',
    feature: '零首付购车方案，轻松拥有梦想座驾，资金更灵活'
  },
  {
    name: '弹性还款',
    tag: '推荐',
    tagColor: '#2C5F8A',
    rate: '4.2%',
    maxTerm: '48个月',
    downPayment: '20%',
    feature: '支持随借随还，提前还款无违约金，资金周转更自由'
  }
])

const handleApply = () => {
  Taro.showToast({ title: '申请已提交，顾问将尽快联系您', icon: 'none' })
}

// Slider 交互
const sliderDragging = ref(false)

const getSliderValue = (clientX, trackEl) => {
  // 简易计算：基于 touch 位置与容器宽度的比例
  const rect = { left: 32, width: 311 } // 近似值，实际可通过 getBoundingClientRect 获取
  const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  const value = Math.round(10 + (percent / 100) * (500 - 10))
  return Math.max(10, Math.min(500, value))
}

const onSliderTap = (e) => {
  const x = e.detail?.x || e.clientX || 0
  loanAmount.value = getSliderValue(x)
}

const onSliderMove = (e) => {
  if (!e.touches?.[0]) return
  sliderDragging.value = true
  loanAmount.value = getSliderValue(e.touches[0].clientX)
}

const onSliderEnd = () => {
  sliderDragging.value = false
}
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.finance-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 40px;
}

.hero-banner {
  background: linear-gradient(135deg, #DA291C 0%, #8B0000 100%);
  padding: 48px 32px 56px;

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .hero-title {
      font-size: 48px;
      color: #FFFFFF;
      font-weight: 700;
      font-family: 'PingFang SC', sans-serif;
      margin-bottom: 12px;
    }

    .hero-subtitle {
      font-size: 26px;
      color: rgba(255, 255, 255, 0.85);
      font-family: 'PingFang SC', sans-serif;
    }
  }
}

.calc-card {
  background: #FFFFFF;
  margin: -32px 24px 24px;
  border-radius: 8px;
  padding: 32px 24px;
  border: 1px solid #CCCCCC;

  .card-title {
    font-size: 32px;
    color: #181818;
    font-weight: 700;
    font-family: 'PingFang SC', sans-serif;
    margin-bottom: 32px;
    display: block;
  }

  .calc-section {
    margin-bottom: 28px;

    .calc-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .calc-label {
        font-size: 26px;
        color: #666666;
        font-family: 'PingFang SC', sans-serif;
      }

      .calc-value {
        font-size: 30px;
        color: #DA291C;
        font-weight: 600;
        font-family: 'SF Pro Display', sans-serif;
      }
    }

    .slider-track {
      height: 8px;
      background: #F0F0F0;
      border-radius: 4px;
      position: relative;

      .slider-fill {
        height: 100%;
        background: #DA291C;
        border-radius: 4px;
        transition: width 0.3s;
      }

      .slider-thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        background: #FFFFFF;
        border: 4px solid #DA291C;
        border-radius: 50%;
        transition: left 0.3s;
      }
    }

    .slider-range {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .range-label {
        font-size: 20px;
        color: #B0B0B0;
        font-family: 'SF Pro Display', sans-serif;
      }
    }

    .calc-label {
      font-size: 26px;
      color: #666666;
      font-family: 'PingFang SC', sans-serif;
      margin-bottom: 16px;
      display: block;
    }

    .term-options {
      display: flex;
      gap: 12px;

      .term-item {
        flex: 1;
        height: 72px;
        border: 1px solid #CCCCCC;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        .term-text {
          font-size: 24px;
          color: #666666;
          font-family: 'PingFang SC', sans-serif;
        }

        .term-text-active {
          color: #FFFFFF;
        }
      }

      .term-active {
        background: #DA291C;
        border-color: #DA291C;
      }
    }
  }

  .result-section {
    background: #FAFAFA;
    border-radius: 8px;
    padding: 24px;
    text-align: center;

    .result-label {
      font-size: 24px;
      color: #8F8F8F;
      font-family: 'PingFang SC', sans-serif;
      display: block;
      margin-bottom: 8px;
    }

    .result-row {
      display: flex;
      align-items: baseline;
      justify-content: center;

      .result-value {
        font-size: 56px;
        color: #DA291C;
        font-weight: 700;
        font-family: 'SF Pro Display', sans-serif;
      }

      .result-unit {
        font-size: 26px;
        color: #8F8F8F;
        font-family: 'PingFang SC', sans-serif;
        margin-left: 8px;
      }
    }
  }
}

.products-section {
  padding: 0 24px;

  .section-title {
    font-size: 32px;
    color: #181818;
    font-weight: 700;
    font-family: 'PingFang SC', sans-serif;
    margin-bottom: 20px;
    display: block;
  }

  .product-card {
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;

    .product-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .product-name {
        font-size: 30px;
        color: #181818;
        font-weight: 700;
        font-family: 'PingFang SC', sans-serif;
        margin-right: 12px;
      }

      .product-tag {
        padding: 4px 12px;
        border-radius: 2px;

        .product-tag-text {
          font-size: 20px;
          color: #FFFFFF;
          font-family: 'PingFang SC', sans-serif;
        }
      }
    }

    .product-details {
      display: flex;
      margin-bottom: 16px;

      .product-detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .detail-label {
          font-size: 22px;
          color: #8F8F8F;
          font-family: 'PingFang SC', sans-serif;
          margin-bottom: 6px;
        }

        .detail-value {
          font-size: 28px;
          color: #181818;
          font-weight: 600;
          font-family: 'SF Pro Display', sans-serif;
        }
      }
    }

    .product-feature {
      font-size: 24px;
      color: #666666;
      line-height: 40px;
      font-family: 'PingFang SC', sans-serif;
    }
  }
}

.cta-section {
  padding: 32px 24px 0;

  .cta-button {
    background: #DA291C;
    height: 96px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .cta-text {
      font-size: 32px;
      color: #FFFFFF;
      font-weight: 600;
      font-family: 'PingFang SC', sans-serif;
    }
  }

  .cta-note {
    font-size: 22px;
    color: #B0B0B0;
    font-family: 'PingFang SC', sans-serif;
    text-align: center;
    display: block;
  }
}
</style>
