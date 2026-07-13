import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const isLoggedIn = ref(false)
  const role = ref('buyer') // buyer | dealer | creator | vip | admin
  const token = ref('')
  const memberInfo = ref(null)

  // 计算属性
  const isOpenidReady = computed(() => !!userInfo.value?.openid)
  const isDealer = computed(() => role.value === 'dealer')
  const isVIP = computed(() => role.value === 'vip')
  const isAdmin = computed(() => role.value === 'admin')
  const displayName = computed(() => userInfo.value?.nickname || '豪车用户')

  // 微信登录
  async function login() {
    try {
      const { code } = await Taro.login()
      const res = await Taro.cloud.callFunction({
        name: 'login',
        data: { action: 'wxLogin', data: { code } }
      })
      if (res.result?.code === 0) {
        const { openid, sessionKey, ...profile } = res.result.data
        userInfo.value = { openid, ...profile }
        token.value = sessionKey || openid
        isLoggedIn.value = true
        Taro.setStorageSync('token', token.value)
        Taro.setStorageSync('userInfo', userInfo.value)
        if (profile.role) setRole(profile.role)
        return profile
      }
      throw new Error(res.result?.message || '登录失败')
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  // 设置用户角色
  function setRole(newRole) {
    role.value = newRole
    Taro.setStorageSync('userRole', newRole)
  }

  // 退出登录
  function logout() {
    userInfo.value = null
    isLoggedIn.value = false
    token.value = ''
    role.value = 'buyer'
    memberInfo.value = null
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('userInfo')
    Taro.removeStorageSync('userRole')
  }

  // 从本地存储恢复会话
  function restoreSession() {
    const savedToken = Taro.getStorageSync('token')
    const savedUser = Taro.getStorageSync('userInfo')
    const savedRole = Taro.getStorageSync('userRole')
    if (savedToken && savedUser) {
      token.value = savedToken
      userInfo.value = savedUser
      isLoggedIn.value = true
    }
    if (savedRole) role.value = savedRole
  }

  // 自动恢复会话
  restoreSession()

  return {
    userInfo, isLoggedIn, role, token, memberInfo,
    isOpenidReady, isDealer, isVIP, isAdmin, displayName,
    login, setRole, logout, restoreSession
  }
})
