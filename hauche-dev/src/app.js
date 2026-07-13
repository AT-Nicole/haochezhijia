import { defineComponent, onLaunch } from 'vue'
import { reactive } from 'vue'
import Taro from '@tarojs/taro'

// Global state
const globalState = reactive({
  // Current user role: 'buyer' | 'dealer' | 'creator' | 'vip' | 'admin'
  role: '',
  // User info (from WeChat login)
  userInfo: null,
  // Whether logged in
  isLoggedIn: false,
  // Theme tokens
  theme: {
    primary: '#DA291C',
    accent: '#E8B800'
  }
})

// Tab bar config per role
const TAB_CONFIGS = {
  buyer: [
    { label: '首页', page: '/pages/home-landing/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '发现', page: '/pages/car-community/index', icon: 'compass' },
    { label: '服务', page: '/pages/finance-center/index', icon: 'wrench' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  dealer: [
    { label: '首页', page: '/pages/home-dealer/index', icon: 'home' },
    { label: '车源', page: '/pages/national-pricing/index', icon: 'search' },
    { label: '营销', page: '/pages/ai-marketing/index', icon: 'zap' },
    { label: '线索', page: '/pages/service-tracking/index', icon: 'map-pin' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  creator: [
    { label: '首页', page: '/pages/home-creator/index', icon: 'home' },
    { label: '创作', page: '/pages/luxury-news/index', icon: 'pen-tool' },
    { label: '数据', page: '/pages/luxury-ranking/index', icon: 'bar-chart' },
    { label: '消息', page: '/pages/ai-chat/index', icon: 'message-circle' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  vip: [
    { label: '首页', page: '/pages/home-vip/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '服务', page: '/pages/concierge-service/index', icon: 'wrench' },
    { label: '管家', page: '/pages/butler-workbench/index', icon: 'key' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ],
  admin: [
    { label: '首页', page: '/pages/home-admin/index', icon: 'home' },
    { label: '展厅', page: '/pages/showroom/index', icon: 'car' },
    { label: '会员', page: '/pages/crm-members/index', icon: 'users' },
    { label: '财务', page: '/pages/ai-finance/index', icon: 'bar-chart' },
    { label: '我的', page: '/pages/role-select/index', icon: 'user' }
  ]
}

function setRole(role) {
  globalState.role = role
  Taro.setStorageSync('userRole', role)
}

function getRole() {
  if (globalState.role) return globalState.role
  const stored = Taro.getStorageSync('userRole')
  if (stored) {
    globalState.role = stored
    return stored
  }
  return ''
}

function getCurrentTabs() {
  const role = getRole()
  return TAB_CONFIGS[role] || TAB_CONFIGS.buyer
}

export default defineComponent({
  onLaunch() {
    // Restore role from storage
    getRole()
    // Check WeChat login
    this.checkLogin()
  },
  setup() {
    onLaunch(() => {
      console.log('豪车之家小程序启动')
    })

    return {
      globalState,
      setRole,
      getRole,
      getCurrentTabs,
      TAB_CONFIGS
    }
  }
})
