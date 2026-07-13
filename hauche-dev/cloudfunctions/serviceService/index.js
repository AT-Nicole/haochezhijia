// 豪车之家 - 管家服务云函数
// 功能：服务预约、管家分配、状态流转、时间线管理、排班查询、评价打分
// 服务状态流转：pending(待分配) → assigned(已分配) → in_progress(进行中) → completed(已完成) → rated(已评价)
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 服务类型枚举
const SERVICE_TYPES = {
  PICK_UP: 'pick_up',           // 接机服务
  TEST_DRIVE: 'test_drive',     // 试驾安排
  INSPECTION: 'inspection',      // 验车服务
  MAINTENANCE: 'maintenance',    // 保养维修
  DELIVERY: 'delivery',          // 送车上门
  CUSTOM: 'custom'               // 定制服务
}

// 服务状态枚举与流转
const SERVICE_STATUS = {
  PENDING: 'pending',           // 待分配
  ASSIGNED: 'assigned',         // 已分配管家
  IN_PROGRESS: 'in_progress',   // 进行中
  COMPLETED: 'completed',       // 已完成
  RATED: 'rated'                // 已评价
}

// 合法状态流转
const SERVICE_STATUS_FLOW = {
  [SERVICE_STATUS.PENDING]: [SERVICE_STATUS.ASSIGNED],
  [SERVICE_STATUS.ASSIGNED]: [SERVICE_STATUS.IN_PROGRESS],
  [SERVICE_STATUS.IN_PROGRESS]: [SERVICE_STATUS.COMPLETED],
  [SERVICE_STATUS.COMPLETED]: [SERVICE_STATUS.RATED]
}

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 创建服务预约 ============
      // VIP 用户创建管家服务预约，初始状态为 pending
      case 'create': {
        const {
          memberOpenid,          // VIP 会员 openid
          type,                  // 服务类型
          scheduledDate,         // 预约日期
          scheduledTime,         // 预约时间
          location,              // 服务地点
          description = '',     // 服务描述
          vehicleId = '',        // 关联车辆（可选）
          attachments = []       // 附件图片
        } = data

        if (!memberOpenid || !type || !scheduledDate) {
          return { code: -1, message: '缺少必填字段（memberOpenid, type, scheduledDate）', data: null }
        }

        const validTypes = Object.values(SERVICE_TYPES)
        if (!validTypes.includes(type)) {
          return { code: -1, message: `无效的服务类型: ${type}`, data: null }
        }

        const now = new Date().toISOString()
        const serviceId = `svc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        // 查询会员信息
        const { data: members } = await db.collection('users').where({ openid: memberOpenid }).limit(1).get()
        if (!members || members.length === 0) {
          return { code: -1, message: '用户不存在', data: null }
        }

        const serviceRecord = {
          serviceId,
          memberOpenid,
          memberName: members[0].nickname || 'VIP会员',
          memberTier: members[0].memberTier || 'normal',
          type,
          scheduledDate,
          scheduledTime: scheduledTime || '',
          location: location || '',
          description,
          vehicleId,
          attachments,
          status: SERVICE_STATUS.PENDING,
          assignedButler: '',       // 分配的管家 openid
          assignedButlerName: '',
          timeline: [{
            event: 'created',
            content: '服务预约已创建',
            operator: 'system',
            timestamp: now
          }],
          rating: 0,               // 评分（1-5）
          ratingContent: '',       // 评价内容
          butlerPerformance: 0,     // 管家绩效分
          createdAt: now,
          updatedAt: now
        }

        await db.collection('services').add({ data: serviceRecord })

        return {
          code: 0,
          message: '服务预约创建成功',
          data: serviceRecord
        }
      }

      // ============ 分配管家 ============
      // 为服务预约分配专属管家
      case 'assign': {
        const { serviceId, butlerOpenid } = data
        if (!serviceId || !butlerOpenid) {
          return { code: -1, message: '缺少 serviceId 或 butlerOpenid 参数', data: null }
        }

        // 查询管家信息
        const { data: butlers } = await db.collection('users').where({ openid: butlerOpenid }).limit(1).get()
        if (!butlers || butlers.length === 0) {
          return { code: -1, message: '管家不存在', data: null }
        }

        const now = new Date().toISOString()
        const butlerName = butlers[0].nickname || '管家'

        // 更新服务记录
        await db.collection('services').where({ serviceId }).update({
          assignedButler: butlerOpenid,
          assignedButlerName: butlerName,
          status: SERVICE_STATUS.ASSIGNED,
          updatedAt: now,
          timeline: _.push({
            event: 'assigned',
            content: `已分配管家: ${butlerName}`,
            operator: 'admin',
            timestamp: now
          })
        })

        return {
          code: 0,
          message: '管家分配成功',
          data: { serviceId, assignedButler: butlerOpenid, assignedButlerName: butlerName }
        }
      }

      // ============ 更新服务状态 ============
      // 按照状态流转图严格校验
      case 'updateStatus': {
        const { serviceId, newStatus, notes = '' } = data
        if (!serviceId || !newStatus) {
          return { code: -1, message: '缺少 serviceId 或 newStatus 参数', data: null }
        }

        // 查询当前服务
        const { data: services } = await db.collection('services').where({ serviceId }).limit(1).get()
        if (!services || services.length === 0) {
          return { code: -1, message: '服务不存在', data: null }
        }

        const currentStatus = services[0].status

        // 校验状态流转
        const allowedNext = SERVICE_STATUS_FLOW[currentStatus]
        if (!allowedNext || !allowedNext.includes(newStatus)) {
          return {
            code: -1,
            message: `非法状态流转: ${currentStatus} → ${newStatus}`,
            data: null
          }
        }

        const now = new Date().toISOString()
        const updateData = {
          status: newStatus,
          updatedAt: now,
          timeline: _.push({
            event: `status_changed_to_${newStatus}`,
            content: notes || `状态更新为: ${newStatus}`,
            operator: 'system',
            timestamp: now
          })
        }

        if (newStatus === SERVICE_STATUS.COMPLETED) {
          updateData.completedAt = now
        }

        await db.collection('services').where({ serviceId }).update(updateData)

        return {
          code: 0,
          message: `服务状态已更新为: ${newStatus}`,
          data: { serviceId, previousStatus: currentStatus, currentStatus: newStatus }
        }
      }

      // ============ 获取服务列表 ============
      // 支持筛选：状态、服务类型、VIP 会员、分页
      case 'getList': {
        const { page = 1, pageSize = 20, status, type, memberOpenid } = data

        const query = {}
        if (status) query.status = status
        if (type) query.type = type
        if (memberOpenid) query.memberOpenid = memberOpenid

        const total = (await db.collection('services').where(query).count()).total
        const { data: services } = await db.collection('services')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: services,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 获取服务详情 ============
      // 返回服务信息及完整时间线
      case 'getDetail': {
        const { serviceId } = data
        if (!serviceId) {
          return { code: -1, message: '缺少 serviceId 参数', data: null }
        }

        const { data: services } = await db.collection('services').where({ serviceId }).limit(1).get()
        if (!services || services.length === 0) {
          return { code: -1, message: '服务不存在', data: null }
        }

        return {
          code: 0,
          message: 'ok',
          data: services[0]
        }
      }

      // ============ 添加时间线事件 ============
      // 向服务的时间线数组追加事件记录（管家备注、照片、状态变更等）
      case 'addTimeline': {
        const { serviceId, event: timelineEvent, content, operator = 'system', photos = [] } = data
        if (!serviceId || !content) {
          return { code: -1, message: '缺少 serviceId 或 content 参数', data: null }
        }

        const now = new Date().toISOString()
        const timelineRecord = {
          event: timelineEvent || 'note',
          content,
          operator,
          photos,
          timestamp: now
        }

        await db.collection('services').where({ serviceId }).update({
          updatedAt: now,
          timeline: _.push(timelineRecord)
        })

        return {
          code: 0,
          message: '时间线已更新',
          data: timelineRecord
        }
      }

      // ============ 获取管家排班 ============
      // 查询管家的每日/每周服务排班
      case 'getButlerSchedule': {
        const { butlerOpenid, date, weekStartDate } = data
        if (!butlerOpenid) {
          return { code: -1, message: '缺少 butlerOpenid 参数', data: null }
        }

        let query = { assignedButler: butlerOpenid }

        // 如果指定了某天
        if (date) {
          query.scheduledDate = date
        }

        // 如果指定了周起始日，查询整周
        if (weekStartDate) {
          const start = new Date(weekStartDate)
          const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
          query.scheduledDate = _.gte(weekStartDate).and(_.lt(end.toISOString().split('T')[0]))
        }

        const { data: schedule } = await db.collection('services')
          .where(query)
          .orderBy('scheduledDate', 'asc')
          .orderBy('scheduledTime', 'asc')
          .limit(50)
          .get()

        // 按日期分组
        const groupedByDate = {}
        schedule.forEach(item => {
          const dateKey = item.scheduledDate
          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = []
          }
          groupedByDate[dateKey].push(item)
        })

        return {
          code: 0,
          message: 'ok',
          data: {
            butlerOpenid,
            totalAppointments: schedule.length,
            schedule: groupedByDate
          }
        }
      }

      // ============ VIP 评价服务 ============
      // VIP 对服务进行评分，计算管家绩效分
      case 'rate': {
        const { serviceId, rating, ratingContent = '' } = data
        if (!serviceId || !rating) {
          return { code: -1, message: '缺少 serviceId 或 rating 参数', data: null }
        }

        // 校验评分范围
        if (rating < 1 || rating > 5) {
          return { code: -1, message: '评分范围应为 1-5', data: null }
        }

        // 查询服务记录
        const { data: services } = await db.collection('services').where({ serviceId }).limit(1).get()
        if (!services || services.length === 0) {
          return { code: -1, message: '服务不存在', data: null }
        }

        const service = services[0]

        // 只有已完成的订单可以评价
        if (service.status !== SERVICE_STATUS.COMPLETED) {
          return { code: -1, message: '只有已完成的服务可以评价', data: null }
        }

        const now = new Date().toISOString()

        // 更新服务评价
        await db.collection('services').where({ serviceId }).update({
          rating,
          ratingContent,
          status: SERVICE_STATUS.RATED,
          updatedAt: now,
          timeline: _.push({
            event: 'rated',
            content: `VIP 评分: ${rating}星 - ${ratingContent}`,
            operator: service.memberOpenid,
            timestamp: now
          })
        })

        // 计算管家绩效分（基于该管家所有已完成服务的平均评分）
        let butlerPerformance = 0
        if (service.assignedButler) {
          const { data: allRated } = await db.collection('services')
            .where({
              assignedButler: service.assignedButler,
              status: SERVICE_STATUS.RATED
            })
            .get()

          if (allRated && allRated.length > 0) {
            const totalScore = allRated.reduce((sum, s) => sum + (s.rating || 0), 0)
            butlerPerformance = Math.round(totalScore / allRated.length * 100) / 100
          }

          // 更新管家的绩效分
          await db.collection('users').where({ openid: service.assignedButler }).update({
            performanceScore: butlerPerformance,
            updatedAt: now
          })
        }

        return {
          code: 0,
          message: '评价成功',
          data: {
            serviceId,
            rating,
            ratingContent,
            butlerPerformance
          }
        }
      }

      default:
        return { code: -1, message: `未知操作: ${action}`, data: null }
    }
  } catch (err) {
    console.error(`[serviceService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
