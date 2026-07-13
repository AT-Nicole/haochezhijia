import Taro from '@tarojs/taro'

/**
 * 预览车辆图片
 * @param {string} current - 当前图片链接
 * @param {string[]} urls - 所有图片链接
 */
export function previewImage(current, urls) {
  Taro.previewImage({ current, urls })
}

/**
 * 拨打电话
 * @param {string} phone - 电话号码
 */
export function makePhoneCall(phone) {
  Taro.makePhoneCall({ phoneNumber: phone }).catch(() => {})
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export function copyText(text) {
  Taro.setClipboardData({ data: text }).then(() => {
    Taro.showToast({ title: '已复制', icon: 'success' })
  })
}

/**
 * 打开地图位置
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {string} name - 位置名称
 * @param {string} address - 地址
 */
export function openLocation(lat, lng, name, address) {
  Taro.openLocation({ latitude: lat, longitude: lng, name, address })
}

/**
 * 跳转到车辆详情页
 * @param {string} vehicleId - 车辆ID
 */
export function goToCarDetail(vehicleId) {
  Taro.navigateTo({ url: `/pages/car-detail/index?id=${vehicleId}` })
}

/**
 * 跳转到经销商首页
 * @param {string} dealerId - 经销商ID
 */
export function goToDealerHome(dealerId) {
  Taro.navigateTo({ url: `/pages/home-dealer/index?dealerId=${dealerId}` })
}

/**
 * 跳转到AI聊天页
 * @param {string} context - 上下文信息
 */
export function goToAIChat(context = '') {
  Taro.navigateTo({ url: `/pages/ai-chat/index?context=${encodeURIComponent(context)}` })
}
