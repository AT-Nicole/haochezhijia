import { defineStore } from 'pinia'
import { ref } from 'vue'
import Taro from '@tarojs/taro'

export const useAppStore = defineStore('app', () => {
  // 全局应用状态
  const theme = ref('light')
  const networkStatus = ref('unknown')
  const systemInfo = ref(null)
  const isIphoneX = ref(false)

  // 初始化应用信息
  function initApp() {
    try {
      const sysInfo = Taro.getSystemInfoSync()
      systemInfo.value = sysInfo
      isIphoneX.value = sysInfo.model?.includes('iPhone X') ||
                        sysInfo.model?.includes('iPhone 11') ||
                        sysInfo.model?.includes('iPhone 12')
    } catch (e) { /* 忽略 */ }

    // 监听网络状态变化
    Taro.onNetworkStatusChange((res) => {
      networkStatus.value = res.isConnected ? 'connected' : 'disconnected'
    })
  }

  // 自动初始化
  initApp()

  return { theme, networkStatus, systemInfo, isIphoneX, initApp }
})
