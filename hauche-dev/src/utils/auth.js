import Taro from '@tarojs/taro'

/**
 * 检查是否登录，未登录则跳转到指定页面
 * @param {string} redirectTo - 未登录时跳转的页面路径
 * @returns {boolean}
 */
export function checkLogin(redirectTo = '/pages/role-select/index') {
  const token = Taro.getStorageSync('token')
  if (!token) {
    Taro.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      Taro.redirectTo({ url: redirectTo })
    }, 1500)
    return false
  }
  return true
}

/**
 * 检查当前用户是否拥有指定角色权限
 * @param {string} requiredRole - 需要的角色
 * @returns {boolean}
 */
export function checkRole(requiredRole) {
  const currentRole = Taro.getStorageSync('userRole')
  if (currentRole !== requiredRole) {
    Taro.showToast({ title: '无权限访问', icon: 'none' })
    return false
  }
  return true
}

/**
 * 检查VIP权限，非VIP则弹窗引导开通
 * @returns {boolean}
 */
export function requireVIP() {
  const role = Taro.getStorageSync('userRole')
  if (role !== 'vip') {
    Taro.showModal({
      title: 'VIP专属',
      content: '此功能仅限VIP会员使用，是否开通？',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateTo({ url: '/pages/finance-center/index' })
        }
      }
    })
    return false
  }
  return true
}

/**
 * 检查经销商权限
 * @returns {boolean}
 */
export function requireDealer() {
  return checkRole('dealer')
}

/**
 * 获取当前用户的openid
 * @returns {string}
 */
export function getOpenid() {
  return Taro.getStorageSync('openid') || ''
}
