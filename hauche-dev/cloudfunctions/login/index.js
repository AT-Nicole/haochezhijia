// 豪车之家 - 登录云函数
// 功能：微信登录、角色设置、获取用户信息
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 生成简易 token（基于 openid + 时间戳）
function generateToken(openid) {
  const crypto = require('crypto')
  return crypto.createHash('md5')
    .update(`${openid}:${Date.now()}:${Math.random().toString(36)}`)
    .digest('hex')
    .substring(0, 32)
}

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 微信登录 ============
      // 通过 wx.login 获取的 code 换取 openid，自动创建或更新用户记录
      case 'wxLogin': {
        const { code } = data
        if (!code) {
          return { code: -1, message: '缺少 code 参数', data: null }
        }

        // 调用微信 code2Session 接口获取 openid 和 session_key
        const res = await cloud.openapi().code2Session({ code })
        const { openid, session_key, unionid } = res

        // 查询用户是否已存在
        const { data: existingUser } = await db.collection('users').where({ openid }).limit(1).get()
        const now = new Date().toISOString()

        let userRecord
        if (existingUser && existingUser.length > 0) {
          // 更新已有用户的最后登录时间
          await db.collection('users').where({ openid }).update({
            lastLoginAt: now,
            sessionKey: session_key
          })
          userRecord = { ...existingUser[0], lastLoginAt: now }
        } else {
          // 创建新用户
          userRecord = {
            openid,
            unionid: unionid || '',
            sessionKey: session_key,
            role: 'buyer',              // 默认角色为买家
            nickname: '',
            avatar: '',
            phone: '',
            status: 'active',
            memberTier: 'normal',        // 会员等级：normal / silver / gold / platinum
            memberExpiry: null,
            points: 0,
            preferences: {},
            butlerId: '',                // 专属管家 ID
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now
          }
          await db.collection('users').add({ data: userRecord })
        }

        // 生成 token 返回给客户端
        const token = generateToken(openid)
        // 保存 token 到用户记录
        await db.collection('users').where({ openid }).update({ token })

        // 返回用户信息（不返回敏感字段）
        const { sessionKey, token: _t, ...safeUser } = userRecord
        return {
          code: 0,
          message: 'ok',
          data: { token, userInfo: safeUser }
        }
      }

      // ============ 设置用户角色 ============
      // 角色类型：buyer(买家) / dealer(经销商) / creator(创作者) / vip(VIP会员) / admin(管理员)
      case 'setRole': {
        const { openid, role } = data
        if (!openid || !role) {
          return { code: -1, message: '缺少 openid 或 role 参数', data: null }
        }

        const validRoles = ['buyer', 'dealer', 'creator', 'vip', 'admin']
        if (!validRoles.includes(role)) {
          return { code: -1, message: `无效的角色类型: ${role}`, data: null }
        }

        const now = new Date().toISOString()
        const updateData = {
          role,
          updatedAt: now
        }

        // 根据角色初始化专属字段
        if (role === 'dealer') {
          // 经销商：创建空的库存记录
          updateData.dealerInfo = {
            dealerId: '',
            companyName: '',
            license: '',
            address: '',
            phone: '',
            status: 'pending_review',
            inventoryCount: 0,
            joinedAt: now
          }
        } else if (role === 'vip') {
          // VIP 会员：分配专属管家
          updateData.memberTier = 'silver'
          updateData.memberExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          updateData.points = 1000   // 初始积分
          updateData.butlerId = ''
        }

        await db.collection('users').where({ openid }).update(updateData)

        // 如果角色是 dealer，同时创建经销商记录
        if (role === 'dealer') {
          const dealerId = `dealer_${openid.substring(0, 12)}_${Date.now()}`
          await db.collection('users').where({ openid }).update({
            'dealerInfo.dealerId': dealerId
          })
          await db.collection('dealers').add({
            data: {
              dealerId,
              openid,
              name: '',
              address: '',
              phone: '',
              images: [],
              status: 'pending_review',
              vehicleCount: 0,
              leadCount: 0,
              dealCount: 0,
              rating: 0,
              createdAt: now,
              updatedAt: now
            }
          })
        }

        const { data: updatedUser } = await db.collection('users').where({ openid }).limit(1).get()
        return {
          code: 0,
          message: '角色设置成功',
          data: updatedUser[0] || null
        }
      }

      // ============ 获取用户信息 ============
      // 根据 openid 获取用户完整资料
      case 'getUserInfo': {
        const { openid } = data
        if (!openid) {
          return { code: -1, message: '缺少 openid 参数', data: null }
        }

        const { data: user } = await db.collection('users').where({ openid }).limit(1).get()
        if (!user || user.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }

        return {
          code: 0,
          message: 'ok',
          data: user[0]
        }
      }

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[login] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
