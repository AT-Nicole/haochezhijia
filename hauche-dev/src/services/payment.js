import { callCloudFunction } from './cloud'

/**
 * 微信支付服务
 * 通过云函数调用微信支付API
 */

// 创建支付订单
export function createPayment(params) {
  return callCloudFunction('orderService', {
    action: 'createPayment',
    data: {
      orderId: params.orderId,
      amount: params.amount, // 单位：分
      description: params.description,
      openid: params.openid,
      payType: params.payType || 'order' // order | deposit | membership | service_fee
    }
  })
}

// 查询支付状态
export function queryPayment(paymentId) {
  return callCloudFunction('orderService', {
    action: 'queryPayment',
    data: { paymentId }
  })
}

// 申请退款
export function refund(params) {
  return callCloudFunction('orderService', {
    action: 'refund',
    data: {
      paymentId: params.paymentId,
      orderId: params.orderId,
      amount: params.amount,
      reason: params.reason
    }
  })
}

// 创建会员支付
export function createMemberPayment(openid, tier, amount) {
  return createPayment({
    orderId: `member_${Date.now()}`,
    amount,
    description: `豪车之家${tier}会员`,
    openid,
    payType: 'membership'
  })
}

// 创建服务费支付
export function createServicePayment(openid, serviceOrderId, amount) {
  return createPayment({
    orderId: `service_${Date.now()}`,
    amount,
    description: '管家服务费',
    openid,
    payType: 'service_fee'
  })
}
