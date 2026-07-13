// 表单验证工具

/**
 * 校验手机号
 */
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 校验价格
 */
export function isValidPrice(price) {
  return typeof price === 'number' && price > 0
}

/**
 * 校验车辆年份
 */
export function isValidCarYear(year) {
  const currentYear = new Date().getFullYear()
  return typeof year === 'number' && year >= 1990 && year <= currentYear + 1
}

/**
 * 校验车牌号（支持新能源车牌）
 */
export function isValidPlateNumber(plate) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5,6}$/.test(plate)
}

/**
 * 校验身份证号
 */
export function isValidIdCard(id) {
  return /^\d{17}[\dXx]$/.test(id)
}

/**
 * 必填校验
 */
export function required(value, fieldName = '此项') {
  if (value === undefined || value === null || value === '') {
    return `${fieldName}不能为空`
  }
  return null
}

/**
 * 通用表单校验
 * @param {Object} rules - 校验规则 { fieldName: [rule, ...] }
 * @param {Object} data - 表单数据
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateForm(rules, data) {
  const errors = {}
  for (const [field, ruleList] of Object.entries(rules)) {
    for (const rule of ruleList) {
      if (rule.required) {
        const err = required(data[field], rule.message || field)
        if (err) { errors[field] = err; break }
      }
      if (rule.validator && !rule.validator(data[field], data)) {
        errors[field] = rule.message || '格式不正确'
        break
      }
      if (rule.min && data[field]?.length < rule.min) {
        errors[field] = `${rule.message || field}最少${rule.min}个字符`
        break
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
