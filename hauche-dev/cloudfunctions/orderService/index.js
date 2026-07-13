// 豪车之家 - 订单服务云函数
// 功能：订单创建、状态流转、详情查询、佣金计算、经销商订单统计
// 订单状态流转：pending_contract(待签约) → contract_signed(已签约) → payment_received(已收款) → preparing(备货中) → delivered(已交付) → completed(已完成)
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 订单状态枚举与流转顺序
const ORDER_STATUS = {
  PENDING_CONTRACT: 'pending_contract',   // 待签约
  CONTRACT_SIGNED: 'contract_signed',      // 已签约
  PAYMENT_RECEIVED: 'payment_received',    // 已收款
  PREPARING: 'preparing',                  // 备货中
  DELIVERED: 'delivered',                  // 已交付
  COMPLETED: 'completed'                   // 已完成
}

// 合法状态流转映射
const STATUS_FLOW = {
  [ORDER_STATUS.PENDING_CONTRACT]: [ORDER_STATUS.CONTRACT_SIGNED],
  [ORDER_STATUS.CONTRACT_SIGNED]: [ORDER_STATUS.PAYMENT_RECEIVED],
  [ORDER_STATUS.PAYMENT_RECEIVED]: [ORDER_STATUS.PREPARING],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED]
}

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 创建订单 ============
      // 从线索转化或直接预订创建订单，初始状态为 pending_contract
      case 'create': {
        const { buyerOpenid, dealerOpenid, dealerId, vehicleId, vehicleName, amount, paymentMethod = 'bank_transfer' } = data
        if (!buyerOpenid || !dealerId) {
          return { code: -1, message: '缺少 buyerOpenid 或 dealerId 参数', data: null }
        }

        const now = new Date().toISOString()
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        const orderRecord = {
          orderId,
          buyerOpenid,
          dealerOpenid: dealerOpenid || '',
          dealerId,
          vehicleId: vehicleId || '',
          vehicleName: vehicleName || '',
          amount: amount || 0,
          commissionRate: 0,        // 佣金比例（后续计算）
          commissionAmount: 0,     // 佣金金额
          paymentMethod,
          paymentStatus: 'unpaid', // unpaid / partial / paid
          status: ORDER_STATUS.PENDING_CONTRACT,
          contractNo: '',          // 合同编号
          deliveryAddress: '',
          deliveryTime: null,
          notes: '',
          createdAt: now,
          updatedAt: now
        }

        await db.collection('orders').add({ data: orderRecord })

        return {
          code: 0,
          message: '订单创建成功',
          data: orderRecord
        }
      }

      // ============ 更新订单状态 ============
      // 按照状态流转图严格校验，不允许跳跃
      case 'updateStatus': {
        const { orderId, newStatus, notes = '' } = data
        if (!orderId || !newStatus) {
          return { code: -1, message: '缺少 orderId 或 newStatus 参数', data: null }
        }

        // 查询当前订单
        const { data: orders } = await db.collection('orders').where({ orderId }).limit(1).get()
        if (!orders || orders.length === 0) {
          return { code: -1, message: '订单不存在', data: null }
        }

        const order = orders[0]
        const currentStatus = order.status

        // 校验状态流转是否合法
        const allowedNextStatuses = STATUS_FLOW[currentStatus]
        if (!allowedNextStatuses || !allowedNextStatuses.includes(newStatus)) {
          return {
            code: -1,
            message: `非法状态流转: ${currentStatus} → ${newStatus}`,
            data: null
          }
        }

        const now = new Date().toISOString()
        const updateData = {
          status: newStatus,
          updatedAt: now
        }

        // 特殊状态处理
        if (newStatus === ORDER_STATUS.PAYMENT_RECEIVED) {
          updateData.paymentStatus = 'paid'
        }
        if (newStatus === ORDER_STATUS.COMPLETED) {
          updateData.completedAt = now
        }

        await db.collection('orders').where({ orderId }).update(updateData)

        return {
          code: 0,
          message: `订单状态已更新为: ${newStatus}`,
          data: { orderId, previousStatus: currentStatus, currentStatus: newStatus }
        }
      }

      // ============ 获取订单详情 ============
      // 返回订单信息并关联车辆、买家、经销商信息
      case 'getDetail': {
        const { orderId } = data
        if (!orderId) {
          return { code: -1, message: '缺少 orderId 参数', data: null }
        }

        const { data: orders } = await db.collection('orders').where({ orderId }).limit(1).get()
        if (!orders || orders.length === 0) {
          return { code: -1, message: '订单不存在', data: null }
        }

        const order = orders[0]
        const enriched = { ...order }

        // 关联车辆信息
        if (order.vehicleId) {
          const { data: vehicles } = await db.collection('vehicles')
            .where({ vehicleId: order.vehicleId })
            .field({ brand: true, model: true, year: true, price: true, images: true, color: true })
            .limit(1)
            .get()
          if (vehicles && vehicles.length > 0) {
            enriched.vehicleInfo = vehicles[0]
          }
        }

        // 关联买家信息
        if (order.buyerOpenid) {
          const { data: buyers } = await db.collection('users')
            .where({ openid: order.buyerOpenid })
            .field({ nickname: true, avatar: true, phone: true })
            .limit(1)
            .get()
          if (buyers && buyers.length > 0) {
            enriched.buyerInfo = buyers[0]
          }
        }

        // 关联经销商信息
        if (order.dealerId) {
          const { data: dealers } = await db.collection('dealers')
            .where({ dealerId: order.dealerId })
            .field({ name: true, phone: true, address: true })
            .limit(1)
            .get()
          if (dealers && dealers.length > 0) {
            enriched.dealerInfo = dealers[0]
          }
        }

        return {
          code: 0,
          message: 'ok',
          data: enriched
        }
      }

      // ============ 获取订单列表 ============
      // 支持筛选：状态、经销商、日期范围、分页
      case 'getList': {
        const { page = 1, pageSize = 20, status, dealerId, startDate, endDate } = data

        const query = {}
        if (status) query.status = status
        if (dealerId) query.dealerId = dealerId
        if (startDate || endDate) {
          query.createdAt = {}
          if (startDate) query.createdAt = _.gte(startDate)
          if (endDate) {
            if (query.createdAt && query.createdAt.constructor === Object) {
              query.createdAt = _.and([query.createdAt, _.lte(endDate)])
            } else {
              query.createdAt = _.lte(endDate)
            }
          }
        }

        const total = (await db.collection('orders').where(query).count()).total
        const { data: orders } = await db.collection('orders')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: orders,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 计算佣金 ============
      // 根据车辆价格和佣金比例计算佣金，创建佣金记录
      case 'calculateCommission': {
        const { orderId, commissionRate } = data
        if (!orderId) {
          return { code: -1, message: '缺少 orderId 参数', data: null }
        }

        // 查询订单信息
        const { data: orders } = await db.collection('orders').where({ orderId }).limit(1).get()
        if (!orders || orders.length === 0) {
          return { code: -1, message: '订单不存在', data: null }
        }

        const order = orders[0]
        // 默认佣金比例：豪车 2%，可自定义
        const rate = commissionRate || 0.02
        const commissionAmount = Math.round(order.amount * rate * 10000) / 10000  // 保留4位小数

        const now = new Date().toISOString()

        // 更新订单佣金信息
        await db.collection('orders').where({ orderId }).update({
          commissionRate: rate,
          commissionAmount,
          updatedAt: now
        })

        // 创建佣金记录
        const commissionId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        await db.collection('commissions').add({
          data: {
            commissionId,
            orderId,
            dealerId: order.dealerId,
            dealerOpenid: order.dealerOpenid,
            vehicleId: order.vehicleId,
            vehicleName: order.vehicleName,
            orderAmount: order.amount,
            commissionRate: rate,
            commissionAmount,
            status: 'pending',     // pending / paid / settled
            createdAt: now,
            updatedAt: now
          }
        })

        return {
          code: 0,
          message: '佣金计算完成',
          data: {
            commissionId,
            orderAmount: order.amount,
            commissionRate: rate,
            commissionAmount
          }
        }
      }

      // ============ 订单统计（经销商） ============
      // 统计：月度订单数、总金额、平均客单价
      case 'getStats': {
        const { dealerId, year, month } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        // 构建月份范围查询
        const targetYear = year || new Date().getFullYear()
        const targetMonth = month || (new Date().getMonth() + 1)
        const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString()
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999).toISOString()

        const monthQuery = {
          dealerId,
          createdAt: _.gte(startDate).and(_.lte(endDate))
        }

        // 月度订单总数
        const monthlyCount = (await db.collection('orders').where(monthQuery).count()).total

        // 月度已完成订单
        const completedQuery = {
          ...monthQuery,
          status: _.in([ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED])
        }
        const completedOrders = (await db.collection('orders').where(completedQuery).get()).data

        const completedCount = completedOrders.length
        const totalAmount = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
        const avgDealSize = completedCount > 0 ? Math.round(totalAmount / completedCount * 100) / 100 : 0

        // 年度累计
        const yearStartDate = new Date(targetYear, 0, 1).toISOString()
        const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59, 999).toISOString()
        const yearQuery = {
          dealerId,
          status: _.in([ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED]),
          createdAt: _.gte(yearStartDate).and(_.lte(yearEnd))
        }
        const yearOrders = (await db.collection('orders').where(yearQuery).get()).data
        const yearTotal = yearOrders.reduce((sum, o) => sum + (o.amount || 0), 0)

        return {
          code: 0,
          message: 'ok',
          data: {
            monthly: {
              count: monthlyCount,
              completedCount,
              totalAmount,
              avgDealSize
            },
            yearly: {
              totalAmount: yearTotal,
              orderCount: yearOrders.length
            }
          }
        }
      }

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[orderService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
