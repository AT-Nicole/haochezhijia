// 豪车之家 - 经销商服务云函数
// 功能：经销商注册、审核、资料管理、数据看板
// 经销商状态流转：pending_review → active / rejected
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 经销商注册 ============
      // 注册新经销商，状态设为 pending_review，初始化空库存
      case 'register': {
        const { openid, name, address, phone, license, images = [] } = data
        if (!openid || !name || !phone) {
          return { code: -1, message: '缺少必填字段（openid, name, phone）', data: null }
        }

        const now = new Date().toISOString()
        const dealerId = `dealer_${openid.substring(0, 12)}_${Date.now()}`

        // 创建经销商记录
        const dealerRecord = {
          dealerId,
          openid,
          name,
          address: address || '',
          phone,
          license: license || '',
          images,
          status: 'pending_review',    // 待审核
          vehicleCount: 0,
          leadCount: 0,
          dealCount: 0,
          rating: 0,
          description: '',
          createdAt: now,
          updatedAt: now
        }

        await db.collection('dealers').add({ data: dealerRecord })

        // 更新用户角色和经销商信息
        await db.collection('users').where({ openid }).update({
          role: 'dealer',
          dealerInfo: {
            dealerId,
            companyName: name,
            license: license || '',
            address: address || '',
            phone,
            status: 'pending_review',
            inventoryCount: 0,
            joinedAt: now
          },
          updatedAt: now
        })

        return {
          code: 0,
          message: '经销商注册成功，等待审核',
          data: { dealerId, status: 'pending_review' }
        }
      }

      // ============ 获取经销商资料 ============
      // 根据 dealerId 获取经销商详细信息
      case 'getProfile': {
        const { dealerId } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const { data: dealers } = await db.collection('dealers').where({ dealerId }).limit(1).get()
        if (!dealers || dealers.length === 0) {
          return { code: -1, message: '经销商不存在', data: null }
        }

        return {
          code: 0,
          message: 'ok',
          data: dealers[0]
        }
      }

      // ============ 更新经销商资料 ============
      // 可更新字段：name, address, phone, images, description
      case 'updateProfile': {
        const { dealerId, name, address, phone, images, description } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const updateData = { updatedAt: new Date().toISOString() }
        if (name !== undefined) updateData.name = name
        if (address !== undefined) updateData.address = address
        if (phone !== undefined) updateData.phone = phone
        if (images !== undefined) updateData.images = images
        if (description !== undefined) updateData.description = description

        await db.collection('dealers').where({ dealerId }).update(updateData)

        // 同步更新用户表中的经销商信息
        await db.collection('users').where({ 'dealerInfo.dealerId': dealerId }).update({
          'dealerInfo.companyName': name,
          'dealerInfo.address': address,
          'dealerInfo.phone': phone,
          updatedAt: updateData.updatedAt
        })

        return {
          code: 0,
          message: '经销商资料更新成功',
          data: null
        }
      }

      // ============ 审核通过经销商 ============
      // 管理员操作：将经销商状态设为 active
      case 'approve': {
        const { dealerId, adminOpenid } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const now = new Date().toISOString()
        await db.collection('dealers').where({ dealerId }).update({
          status: 'active',
          approvedBy: adminOpenid || '',
          approvedAt: now,
          updatedAt: now
        })

        // 同步用户表状态
        await db.collection('users').where({ 'dealerInfo.dealerId': dealerId }).update({
          'dealerInfo.status': 'active',
          updatedAt: now
        })

        return {
          code: 0,
          message: '经销商审核通过',
          data: { dealerId, status: 'active' }
        }
      }

      // ============ 驳回经销商 ============
      // 管理员操作：将经销商状态设为 rejected，需提供原因
      case 'reject': {
        const { dealerId, reason = '', adminOpenid } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const now = new Date().toISOString()
        await db.collection('dealers').where({ dealerId }).update({
          status: 'rejected',
          rejectReason: reason,
          rejectedBy: adminOpenid || '',
          rejectedAt: now,
          updatedAt: now
        })

        // 同步用户表状态
        await db.collection('users').where({ 'dealerInfo.dealerId': dealerId }).update({
          'dealerInfo.status': 'rejected',
          updatedAt: now
        })

        return {
          code: 0,
          message: '经销商已驳回',
          data: { dealerId, status: 'rejected', reason }
        }
      }

      // ============ 获取经销商列表（管理员） ============
      // 分页 + 状态筛选
      case 'getList': {
        const { page = 1, pageSize = 20, status } = data

        const query = {}
        if (status) {
          query.status = status
        }

        const total = (await db.collection('dealers').where(query).count()).total
        const { data: dealers } = await db.collection('dealers')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: dealers,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 经销商数据看板 ============
      // 统计：车辆数量、线索数量、本月成交数量
      case 'getStats': {
        const { dealerId } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        // 车辆总数
        const vehicleCount = (await db.collection('vehicles').where({
          dealerId,
          status: _.neq('deleted')
        }).count()).total

        // 线索总数
        const leadCount = (await db.collection('leads').where({ dealerId }).count()).total

        // 本月成交数量
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const dealCount = (await db.collection('orders').where({
          dealerId,
          status: _.in(['delivered', 'completed']),
          createdAt: _.gte(monthStart)
        }).count()).total

        // 本月新增线索
        const newLeadsThisMonth = (await db.collection('leads').where({
          dealerId,
          createdAt: _.gte(monthStart)
        }).count()).total

        return {
          code: 0,
          message: 'ok',
          data: {
            vehicleCount,
            leadCount,
            dealCount,
            newLeadsThisMonth,
            conversionRate: leadCount > 0
              ? ((dealCount / leadCount) * 100).toFixed(1) + '%'
              : '0%'
          }
        }
      }

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[dealerService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
