/**
 * 微信支付云函数
 * 处理支付下单、查询、退款、回调等业务
 *
 * 注意：实际接入微信支付需要以下前提：
 * 1. 微信支付商户号（需在微信支付商户平台申请）
 * 2. 云开发环境已绑定商户号
 * 3. 已开通对应的支付权限（JSAPI、小程序支付等）
 */

// TODO: 替换为真实商户号
const MCH_ID = 'your-mch-id'
// TODO: 替换为真实API密钥
const API_KEY = 'your-api-key'

// 支付状态枚举
const PAYMENT_STATUS = {
  PENDING: 'pending',       // 待支付
  SUCCESS: 'success',       // 支付成功
  FAILED: 'failed',         // 支付失败
  REFUNDING: 'refunding',   // 退款中
  REFUNDED: 'refunded',     // 已退款
  CLOSED: 'closed'          // 已关闭
}

// 云函数入口
exports.main = async (event, context) => {
  const { action, data } = event
  const db = cloud.database()
  const _ = db.command

  try {
    switch (action) {
      case 'createPayment':
        return await createPayment(data, db, _)
      case 'queryPayment':
        return await queryPayment(data, db)
      case 'refund':
        return await refund(data, db, _)
      case 'handleCallback':
        return await handleCallback(data, db, _)
      case 'getPaymentHistory':
        return await getPaymentHistory(data, db)
      default:
        return { code: -1, msg: `未知操作: ${action}` }
    }
  } catch (err) {
    console.error(`[paymentService] ${action} 执行失败:`, err)
    return { code: -1, msg: err.message || '支付服务异常' }
  }
}

/**
 * 创建支付订单
 * @param {object} data - { orderId, amount, description, openid, payType }
 * @param {object} db - 数据库引用
 * @param {object} _ - 数据库命令
 */
async function createPayment(data, db, _) {
  const { orderId, amount, description, openid, payType = 'order' } = data

  if (!orderId || !amount || !openid) {
    return { code: -1, msg: '缺少必要参数：orderId、amount、openid' }
  }

  // 在 payments 集合中创建支付记录
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await db.collection('payments').add({
    data: {
      paymentId,
      orderId,
      amount,         // 单位：分
      description,
      openid,
      payType,
      status: PAYMENT_STATUS.PENDING,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  // TODO: 实际接入微信支付时，调用统一下单接口
  // 实际环境使用 cloud.openapi().pay.unifiedOrder() 或 pay.transactions.v3.create()
  // 示例：
  // const payResult = await cloud.openapi().pay.unifiedOrder({
  //   body: description,
  //   out_trade_no: paymentId,
  //   total_fee: amount,
  //   spbill_create_ip: '127.0.0.1',
  //   notify_url: 'https://your-domain.com/payment/callback', // 回调地址
  //   trade_type: 'JSAPI',
  //   openid: openid
  // })
  // 返回支付参数供小程序端 wx.requestPayment 调用

  // 开发阶段返回模拟支付参数
  const mockPaymentParams = {
    timeStamp: String(Math.floor(Date.now() / 1000)),
    nonceStr: paymentId,
    package: `prepay_id=mock_${paymentId}`,
    signType: 'MD5',
    paySign: 'mock_sign'
  }

  return {
    code: 0,
    data: {
      paymentId,
      ...mockPaymentParams,
      // 标记为模拟环境
      _mock: true
    }
  }
}

/**
 * 查询支付状态
 * @param {object} data - { paymentId }
 * @param {object} db - 数据库引用
 */
async function queryPayment(data, db) {
  const { paymentId } = data

  if (!paymentId) {
    return { code: -1, msg: '缺少参数：paymentId' }
  }

  const { data: payment } = await db.collection('payments')
    .where({ paymentId })
    .get()

  if (!payment || payment.length === 0) {
    return { code: -1, msg: '支付记录不存在' }
  }

  return {
    code: 0,
    data: payment[0]
  }
}

/**
 * 申请退款
 * @param {object} data - { paymentId, orderId, amount, reason }
 * @param {object} db - 数据库引用
 * @param {object} _ - 数据库命令
 */
async function refund(data, db, _) {
  const { paymentId, orderId, amount, reason } = data

  if (!paymentId || !orderId || !amount) {
    return { code: -1, msg: '缺少必要参数：paymentId、orderId、amount' }
  }

  // 查询原始支付记录
  const { data: payments } = await db.collection('payments')
    .where({ paymentId, status: PAYMENT_STATUS.SUCCESS })
    .get()

  if (!payments || payments.length === 0) {
    return { code: -1, msg: '未找到已支付的订单或订单状态不支持退款' }
  }

  const payment = payments[0]

  // 检查退款金额是否超过支付金额
  if (amount > payment.amount) {
    return { code: -1, msg: '退款金额不能超过支付金额' }
  }

  // TODO: 实际接入微信支付退款API
  // await cloud.openapi().pay.refund({
  //   out_trade_no: paymentId,
  //   out_refund_no: `refund_${Date.now()}`,
  //   total_fee: payment.amount,
  //   refund_fee: amount
  // })

  // 更新支付记录状态为退款中
  await db.collection('payments').doc(payment._id).update({
    data: {
      status: PAYMENT_STATUS.REFUNDING,
      refundAmount: amount,
      refundReason: reason,
      refundedAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  // 创建退款记录
  const refundId = `refund_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await db.collection('refunds').add({
    data: {
      refundId,
      paymentId,
      orderId,
      amount,
      reason,
      status: 'processing',
      createdAt: db.serverDate()
    }
  })

  return {
    code: 0,
    data: {
      refundId,
      paymentId,
      amount,
      status: 'processing',
      msg: '退款申请已提交'
    }
  }
}

/**
 * 支付回调处理（微信支付成功通知）
 * @param {object} data - 回调通知数据
 * @param {object} db - 数据库引用
 * @param {object} _ - 数据库命令
 */
async function handleCallback(data, db, _) {
  // TODO: 实际环境中需要验证微信支付回调签名
  // 1. 验证回调数据的签名是否正确
  // 2. 解密回调数据（微信支付v3使用AES-256-GCM加密）
  // 3. 确认订单金额一致
  //
  // const crypto = require('crypto')
  // 验签逻辑...

  const { paymentId, orderId, status, transactionId } = data

  if (!paymentId || !orderId) {
    return { code: -1, msg: '回调数据不完整' }
  }

  // 查询支付记录
  const { data: payments } = await db.collection('payments')
    .where({ paymentId })
    .get()

  if (!payments || payments.length === 0) {
    return { code: -1, msg: '支付记录不存在' }
  }

  const payment = payments[0]

  // 防止重复处理
  if (payment.status === PAYMENT_STATUS.SUCCESS) {
    return { code: 0, msg: '已处理' }
  }

  // 根据回调状态更新支付记录
  const updateData = {
    status: status === 'SUCCESS' ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
    transactionId: transactionId || null,
    paidAt: db.serverDate(),
    updatedAt: db.serverDate()
  }

  await db.collection('payments').doc(payment._id).update({
    data: updateData
  })

  // 支付成功时同步更新关联订单状态
  if (status === 'SUCCESS') {
    await db.collection('orders').where({ orderId }).update({
      data: {
        payStatus: 'paid',
        paidAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
  }

  // 返回成功响应给微信支付（实际环境需要返回特定XML/JSON格式）
  return {
    code: 0,
    msg: 'SUCCESS'
  }
}

/**
 * 获取用户支付历史
 * @param {object} data - { openid, page, pageSize }
 * @param {object} db - 数据库引用
 */
async function getPaymentHistory(data, db) {
  const { openid, page = 1, pageSize = 20 } = data

  if (!openid) {
    return { code: -1, msg: '缺少参数：openid' }
  }

  const skip = (page - 1) * pageSize

  // 并行查询总数和列表
  const [countResult, listResult] = await Promise.all([
    db.collection('payments').where({ openid }).count(),
    db.collection('payments')
      .where({ openid })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
  ])

  return {
    code: 0,
    data: {
      list: listResult.data,
      total: countResult.total,
      page,
      pageSize,
      totalPages: Math.ceil(countResult.total / pageSize)
    }
  }
}
