/**
 * 豪车之家 - Mock 数据自动初始化
 *
 * 在 app.js 的 onLaunch 中调用
 * 仅在开发/H5模式下生效
 */

import Taro from '@tarojs/taro'

const ENV = process.env.NODE_ENV || 'development'

export function initMockData() {
  if (ENV === 'production') return

  // 设置演示模式标识
  Taro.setStorageSync('DEMO_MODE', true)
  Taro.setStorageSync('userRole', Taro.getStorageSync('userRole') || 'buyer')
  Taro.setStorageSync('token', Taro.getStorageSync('token') || 'demo_token')
  Taro.setStorageSync('userInfo', Taro.getStorageSync('userInfo') || JSON.stringify({
    _id: 'demo_001',
    openid: 'demo_openid_001',
    nickname: '豪哥',
    role: 'buyer'
  }))

  console.log('[Mock] 演示模式已启用')
  console.log('[Mock] 角色: ' + Taro.getStorageSync('userRole'))
}