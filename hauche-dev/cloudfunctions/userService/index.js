// 豪车之家 - 用户服务云函数
// 功能：个人资料管理、VIP会员管理、我的线索、我的订单
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 敏感字段列表，返回用户信息时需过滤
const SENSITIVE_FIELDS = ['sessionKey', 'token']

// 移除敏感字段
function sanitizeUser(user) {
  if (!user) return user
  const result = { ...user }
  SENSITIVE_FIELDS.forEach(field => delete result[field])
  return result
}

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 获取用户资料 ============
      // 根据 openid 获取用户信息，过滤敏感字段
      case 'getProfile': {
        const { openid } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        const { data: users } = await db.collection('users').where({ openid }).limit(1).get()
        if (!users || users.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }

        return {
          code: 0,
          message: 'ok',
          data: sanitizeUser(users[0])
        }
      }

      // ============ 更新用户资料 ============
      // 可更新字段：nickname, avatar, phone, preferences
      case 'updateProfile': {
        const { openid } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        // 只允许更新白名单字段
        const allowedFields = ['nickname', 'avatar', 'phone', 'preferences']
        const updateData = { updatedAt: new Date().toISOString() }
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            updateData[field] = data[field]
          }
        })

        await db.collection('users').where({ openid }).update(updateData)

        const { data: updatedUser } = await db.collection('users').where({ openid }).limit(1).get()
        return {
          code: 0,
          message: '资料更新成功',
          data: sanitizeUser(updatedUser[0])
        }
      }

      // ============ 获取会员信息 ============
      // 返回 VIP 等级、积分、到期时间等
      case 'getMemberInfo': {
        const { openid } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        const { data: users } = await db.collection('users').where({ openid }).limit(1).get()
        if (!users || users.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }

        const user = users[0]
        const memberInfo = {
          tier: user.memberTier || 'normal',
          points: user.points || 0,
          expiry: user.memberExpiry || null,
          butlerId: user.butlerId || '',
          // 判断是否已过期
          isExpired: user.memberExpiry
            ? new Date(user.memberExpiry) < new Date()
            : true,
          // 等级权益说明
          tierBenefits: {
            normal: ['基础浏览权限', '在线咨询'],
            silver: ['专属管家', '优先看车', '积分兑换'],
            gold: ['金牌管家', '定制选车', '送车上门', '专属折扣'],
            platinum: ['钻石管家', '全球寻车', 'VIP通道', '终身保养', '专属活动']
          }
        }

        return {
          code: 0,
          message: 'ok',
          data: memberInfo
        }
      }

      // ============ 升级会员等级 ============
      // 升级 tier，更新到期时间，在 finances 集合记录交易
      case 'upgradeMember': {
        const { openid, tier, months = 12 } = data
        if (!openid || !tier) {
          return { code: -1, message: '缺少 openid 或 tier 参数', data: null }
        }

        const validTiers = ['silver', 'gold', 'platinum']
        if (!validTiers.includes(tier)) {
          return { code: -1, message: `无效的会员等级: ${tier}`, data: null }
        }

        const { data: users } = await db.collection('users').where({ openid }).limit(1).get()
        if (!users || users.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }

        const user = users[0]
        const now = new Date()
        // 如果当前会员未过期，在原到期时间基础上延长；否则从现在开始计算
        const baseDate = (user.memberExpiry && new Date(user.memberExpiry) > now)
          ? new Date(user.memberExpiry)
          : now
        const newExpiry = new Date(baseDate.getTime() + months * 30 * 24 * 60 * 60 * 1000)

        // 价格表（单位：元）
        const tierPrices = { silver: 999, gold: 2999, platinum: 9999 }
        const amount = tierPrices[tier] * Math.ceil(months / 12)

        // 更新用户会员信息
        await db.collection('users').where({ openid }).update({
          memberTier: tier,
          memberExpiry: newExpiry.toISOString(),
          updatedAt: now.toISOString()
        })

        // 在 finances 集合记录交易
        await db.collection('finances').add({
          data: {
            type: 'membership',
            category: 'income',
            amount,
            currency: 'CNY',
            payerOpenid: openid,
            payerName: user.nickname || '未知用户',
            description: `升级会员至${tier}等级，${months}个月`,
            status: 'paid',
            createdAt: now.toISOString()
          }
        })

        return {
          code: 0,
          message: '会员升级成功',
          data: {
            tier,
            expiry: newExpiry.toISOString(),
            amount
          }
        }
      }

      // ============ 获取我的线索（经销商） ============
      // 分页查询该经销商关联的所有线索
      case 'getMyLeads': {
        const { openid, page = 1, pageSize = 20, status } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        // 先获取经销商 ID
        const { data: users } = await db.collection('users').where({ openid }).limit(1).get()
        if (!users || users.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }
        const dealerId = users[0].dealerInfo?.dealerId
        if (!dealerId) {
          return { code: -1, message: '该用户非经销商', data: null }
        }

        const query = { dealerId }
        if (status) {
          query.status = status
        }

        const total = (await db.collection('leads').where(query).count()).total
        const { data: leads } = await db.collection('leads')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: leads,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 获取我的订单 ============
      // 分页查询该用户的所有订单（买家或经销商）
      case 'getMyOrders': {
        const { openid, page = 1, pageSize = 20, status } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        const query = {}
        if (status) {
          query.status = status
        }
        // 查询买家或经销商关联的订单
        query[_.or] = [
          { buyerOpenid: openid },
          { dealerOpenid: openid }
        ]

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

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[userService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
