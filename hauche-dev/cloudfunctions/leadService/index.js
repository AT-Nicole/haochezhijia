// 豪车之家 - 线索服务云函数
// 功能：线索创建、跟进、状态流转、转化成交、漏斗统计
// 线索状态流转：new(新线索) → contacted(已联系) → following(跟进中) → negotiation(谈判中) → won(成交) / lost(流失)
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 状态枚举
const LEAD_STATUS = {
  NEW: 'new',               // 新线索
  CONTACTED: 'contacted',   // 已联系
  FOLLOWING: 'following',   // 跟进中
  NEGOTIATION: 'negotiation', // 谈判中
  WON: 'won',                // 成交
  LOST: 'lost'               // 流失
}

// 跟进类型到状态的自动映射
const FOLLOWUP_STATUS_MAP = {
  first_contact: LEAD_STATUS.CONTACTED,
  phone_follow: LEAD_STATUS.FOLLOWING,
  visit: LEAD_STATUS.FOLLOWING,
  test_drive: LEAD_STATUS.NEGOTIATION,
  price_negotiation: LEAD_STATUS.NEGOTIATION,
  contract: LEAD_STATUS.WON,
  lost: LEAD_STATUS.LOST
}

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 创建线索 ============
      // 买家发起咨询时创建线索，若关联车辆则自动分配给对应经销商
      case 'create': {
        const { buyerOpenid, vehicleId, dealerId, message = '', contactPhone = '' } = data
        if (!buyerOpenid) {
          return { code: -1, message: '缺少 buyerOpenid 参数', data: null }
        }

        const now = new Date().toISOString()
        const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        // 如果关联了车辆但未指定经销商，自动查找
        let targetDealerId = dealerId
        if (vehicleId && !dealerId) {
          const { data: vehicles } = await db.collection('vehicles').where({ vehicleId }).limit(1).get()
          if (vehicles && vehicles.length > 0) {
            targetDealerId = vehicles[0].dealerId
          }
        }

        const leadRecord = {
          leadId,
          buyerOpenid,
          vehicleId: vehicleId || '',
          dealerId: targetDealerId || '',
          message,
          contactPhone,
          status: LEAD_STATUS.NEW,
          source: vehicleId ? 'vehicle_inquiry' : 'direct_inquiry',
          priority: 'normal',    // normal / high / urgent
          assignedTo: '',        // 跟进人
          history: [{
            type: 'created',
            content: '线索创建',
            operator: 'system',
            timestamp: now
          }],
          createdAt: now,
          updatedAt: now
        }

        await db.collection('leads').add({ data: leadRecord })

        // 更新车辆咨询计数
        if (vehicleId) {
          await db.collection('vehicles').where({ vehicleId }).update({
            inquiryCount: _.inc(1)
          })
        }

        // 更新经销商线索计数
        if (targetDealerId) {
          await db.collection('dealers').where({ dealerId: targetDealerId }).update({
            leadCount: _.inc(1),
            updatedAt: now
          })
        }

        return {
          code: 0,
          message: '线索创建成功',
          data: leadRecord
        }
      }

      // ============ 更新线索 ============
      // 更新线索信息（状态、备注等）
      case 'update': {
        const { leadId } = data
        if (!leadId) {
          return { code: -1, message: '缺少 leadId 参数', data: null }
        }

        const skipFields = ['leadId', 'createdAt', 'history']
        const updateData = { updatedAt: new Date().toISOString() }
        Object.keys(data).forEach(key => {
          if (!skipFields.includes(key) && data[key] !== undefined) {
            updateData[key] = data[key]
          }
        })

        await db.collection('leads').where({ leadId }).update(updateData)

        return {
          code: 0,
          message: '线索更新成功',
          data: null
        }
      }

      // ============ 获取线索详情 ============
      // 返回线索信息及完整跟进历史
      case 'getDetail': {
        const { leadId } = data
        if (!leadId) {
          return { code: -1, message: '缺少 leadId 参数', data: null }
        }

        const { data: leads } = await db.collection('leads').where({ leadId }).limit(1).get()
        if (!leads || leads.length === 0) {
          return { code: -1, message: '线索不存在', data: null }
        }

        return {
          code: 0,
          message: 'ok',
          data: leads[0]
        }
      }

      // ============ 获取线索列表 ============
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

      // ============ 添加跟进记录 ============
      // 向线索的 history 数组追加跟进记录，根据跟进类型自动更新状态
      case 'followUp': {
        const { leadId, type, content, operator, nextAction = '' } = data
        if (!leadId || !type || !content) {
          return { code: -1, message: '缺少 leadId, type 或 content 参数', data: null }
        }

        const now = new Date().toISOString()

        // 查询现有线索
        const { data: leads } = await db.collection('leads').where({ leadId }).limit(1).get()
        if (!leads || leads.length === 0) {
          return { code: -1, message: '线索不存在', data: null }
        }

        const lead = leads[0]

        // 创建跟进记录
        const followUpRecord = {
          type,             // 跟进类型：first_contact, phone_follow, visit, test_drive, price_negotiation, contract, lost
          content,          // 跟进内容
          operator: operator || 'system',
          nextAction,       // 下一步计划
          timestamp: now
        }

        // 根据跟进类型自动更新状态
        const newStatus = FOLLOWUP_STATUS_MAP[type]
        const updateData = {
          updatedAt: now,
          history: _.push(followUpRecord)
        }
        if (newStatus && newStatus !== lead.status) {
          updateData.status = newStatus
        }

        await db.collection('leads').where({ leadId }).update(updateData)

        return {
          code: 0,
          message: '跟进记录已添加',
          data: followUpRecord
        }
      }

      // ============ 线索转订单 ============
      // 将成交线索转为订单记录，更新线索状态为 won
      case 'convertToOrder': {
        const { leadId, buyerOpenid, dealerOpenid, paymentMethod = 'bank_transfer' } = data
        if (!leadId) {
          return { code: -1, message: '缺少 leadId 参数', data: null }
        }

        // 查询线索信息
        const { data: leads } = await db.collection('leads').where({ leadId }).limit(1).get()
        if (!leads || leads.length === 0) {
          return { code: -1, message: '线索不存在', data: null }
        }
        const lead = leads[0]

        // 查询关联车辆信息
        let vehicleInfo = null
        if (lead.vehicleId) {
          const { data: vehicles } = await db.collection('vehicles').where({ vehicleId: lead.vehicleId }).limit(1).get()
          if (vehicles && vehicles.length > 0) {
            vehicleInfo = vehicles[0]
            // 更新车辆状态为已售
            await db.collection('vehicles').where({ vehicleId: lead.vehicleId }).update({
              status: 'sold',
              updatedAt: new Date().toISOString()
            })
          }
        }

        const now = new Date().toISOString()
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        // 创建订单记录
        const orderRecord = {
          orderId,
          leadId,
          buyerOpenid: buyerOpenid || lead.buyerOpenid,
          dealerOpenid: dealerOpenid || '',
          dealerId: lead.dealerId,
          vehicleId: lead.vehicleId || '',
          vehicleName: vehicleInfo ? `${vehicleInfo.brand} ${vehicleInfo.model}` : '',
          amount: vehicleInfo ? vehicleInfo.price : 0,
          paymentMethod,
          status: 'pending_contract',
          createdAt: now,
          updatedAt: now
        }

        await db.collection('orders').add({ data: orderRecord })

        // 更新线索状态为成交
        await db.collection('leads').where({ leadId }).update({
          status: LEAD_STATUS.WON,
          updatedAt: now,
          history: _.push({
            type: 'converted',
            content: `线索已转为订单 ${orderId}`,
            operator: 'system',
            timestamp: now
          })
        })

        // 更新经销商成交计数
        if (lead.dealerId) {
          await db.collection('dealers').where({ dealerId: lead.dealerId }).update({
            dealCount: _.inc(1),
            updatedAt: now
          })
        }

        return {
          code: 0,
          message: '线索已转为订单',
          data: { orderId, order: orderRecord }
        }
      }

      // ============ 线索漏斗统计 ============
      // 返回指定经销商的各状态线索数量（漏斗数据）
      case 'getStats': {
        const { dealerId, startDate, endDate } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const baseQuery = { dealerId }
        if (startDate || endDate) {
          baseQuery.createdAt = {}
          if (startDate) baseQuery.createdAt = _.gte(startDate)
          if (endDate) {
            if (baseQuery.createdAt && baseQuery.createdAt.constructor === Object) {
              baseQuery.createdAt = _.and([baseQuery.createdAt, _.lte(endDate)])
            } else {
              baseQuery.createdAt = _.lte(endDate)
            }
          }
        }

        // 统计各状态数量
        const statuses = Object.values(LEAD_STATUS)
        const funnelData = {}
        let totalLeads = 0

        for (const status of statuses) {
          const count = (await db.collection('leads').where({
            ...baseQuery,
            status
          }).count()).total
          funnelData[status] = count
          totalLeads += count
        }

        // 计算转化率
        funnelData.total = totalLeads
        funnelData.conversionRate = totalLeads > 0
          ? ((funnelData[LEAD_STATUS.WON] / totalLeads) * 100).toFixed(1) + '%'
          : '0%'

        return {
          code: 0,
          message: 'ok',
          data: funnelData
        }
      }

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[leadService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
