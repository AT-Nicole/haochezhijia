// 格式化价格: 1680000 → '¥168万'
export function formatPrice(price) {
  if (price >= 10000) {
    return '¥' + (price / 10000).toFixed(0) + '万'
  }
  return '¥' + price.toLocaleString()
}

// 格式化数字: 186800 → '186,800'
export function formatNumber(num) {
  return num.toLocaleString()
}

// 相对时间: '2天前', '1周前'
export function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  if (diff < 604800) return Math.floor(diff / 86400) + '天前'
  return Math.floor(diff / 604800) + '周前'
}

// 手机号脱敏: 13812345678 → '138****5678'
export function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
