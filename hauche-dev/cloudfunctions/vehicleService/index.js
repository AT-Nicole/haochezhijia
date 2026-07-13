// 豪车之家 - 车辆服务云函数
// 功能：车辆增删改查、列表筛选、全文搜索
// 车辆状态：active(在售) / sold(已售) / reserved(已预留) / deleted(已删除)
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })

const db = cloud.database()
const _ = db.command

// 必填字段校验
const REQUIRED_FIELDS = ['brand', 'model', 'year', 'price', 'images']

exports.main = async (event, context) => {
  const { action, data, userInfo } = event

  try {
    switch (action) {
      // ============ 添加车辆 ============
      // 经销商添加车辆到库存，校验必填字段
      case 'add': {
        const { dealerId, brand, model, year, price, images, mileage, condition, color, description, configuration = {} } = data

        // 校验必填字段
        for (const field of REQUIRED_FIELDS) {
          if (!data[field]) {
            return { code: -1, message: `缺少必填字段: ${field}`, data: null }
          }
        }
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const now = new Date().toISOString()
        const vehicleId = `vehicle_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        const vehicleRecord = {
          vehicleId,
          dealerId,
          brand,                    // 品牌：如 保时捷、法拉利
          model,                    // 车型：如 Cayenne、458 Italia
          year,                     // 年份
          price,                    // 价格（万元）
          images,                   // 图片列表
          mileage: mileage || 0,    // 里程数（公里）
          condition: condition || 'new',  // 新旧：new / used
          color: color || '',       // 外观颜色
          description: description || '',
          configuration,            // 配置信息对象
          tags: [],                 // 标签（如 性能SUV、限量版）
          status: 'active',         // 状态：在售
          viewCount: 0,             // 浏览次数
          inquiryCount: 0,          // 咨询次数
          createdAt: now,
          updatedAt: now
        }

        await db.collection('vehicles').add({ data: vehicleRecord })

        // 更新经销商车辆计数
        await db.collection('dealers').where({ dealerId }).update({
          vehicleCount: _.inc(1),
          updatedAt: now
        })

        return {
          code: 0,
          message: '车辆添加成功',
          data: vehicleRecord
        }
      }

      // ============ 更新车辆信息 ============
      // 仅允许车辆所属经销商更新
      case 'update': {
        const { vehicleId, dealerId } = data
        if (!vehicleId || !dealerId) {
          return { code: -1, message: '缺少 vehicleId 或 dealerId 参数', data: null }
        }

        // 验证归属
        const { data: vehicles } = await db.collection('vehicles').where({ vehicleId }).limit(1).get()
        if (!vehicles || vehicles.length === 0) {
          return { code: -1, message: '车辆不存在', data: null }
        }
        if (vehicles[0].dealerId !== dealerId) {
          return { code: -1, message: '无权修改此车辆', data: null }
        }

        // 构建更新数据（排除不可修改字段）
        const skipFields = ['vehicleId', 'dealerId', 'createdAt', 'viewCount', 'inquiryCount']
        const updateData = { updatedAt: new Date().toISOString() }
        Object.keys(data).forEach(key => {
          if (!skipFields.includes(key) && data[key] !== undefined) {
            updateData[key] = data[key]
          }
        })

        await db.collection('vehicles').where({ vehicleId }).update(updateData)

        return {
          code: 0,
          message: '车辆信息更新成功',
          data: null
        }
      }

      // ============ 删除车辆（软删除） ============
      // 将状态设为 deleted，不实际删除记录
      case 'remove': {
        const { vehicleId, dealerId } = data
        if (!vehicleId || !dealerId) {
          return { code: -1, message: '缺少 vehicleId 或 dealerId 参数', data: null }
        }

        // 验证归属
        const { data: vehicles } = await db.collection('vehicles').where({ vehicleId }).limit(1).get()
        if (!vehicles || vehicles.length === 0 || vehicles[0].dealerId !== dealerId) {
          return { code: -1, message: '车辆不存在或无权操作', data: null }
        }

        await db.collection('vehicles').where({ vehicleId }).update({
          status: 'deleted',
          updatedAt: new Date().toISOString()
        })

        // 更新经销商车辆计数
        await db.collection('dealers').where({ dealerId }).update({
          vehicleCount: _.inc(-1),
          updatedAt: new Date().toISOString()
        })

        return {
          code: 0,
          message: '车辆已删除',
          data: null
        }
      }

      // ============ 获取车辆详情 ============
      // 返回车辆信息并关联经销商信息
      case 'getDetail': {
        const { vehicleId } = data
        if (!vehicleId) {
          return { code: -1, message: '缺少 vehicleId 参数', data: null }
        }

        const { data: vehicles } = await db.collection('vehicles').where({ vehicleId }).limit(1).get()
        if (!vehicles || vehicles.length === 0) {
          return { code: -1, message: '车辆不存在', data: null }
        }

        const vehicle = vehicles[0]

        // 增加浏览计数
        await db.collection('vehicles').where({ vehicleId }).update({
          viewCount: _.inc(1)
        })

        // 关联查询经销商信息
        let dealerInfo = null
        if (vehicle.dealerId) {
          const { data: dealers } = await db.collection('dealers')
            .where({ dealerId: vehicle.dealerId })
            .field({ dealerId: true, name: true, phone: true, address: true, images: true, rating: true })
            .limit(1)
            .get()
          if (dealers && dealers.length > 0) {
            dealerInfo = dealers[0]
          }
        }

        return {
          code: 0,
          message: 'ok',
          data: { ...vehicle, dealerInfo }
        }
      }

      // ============ 获取车辆列表 ============
      // 支持筛选：品牌、车型、价格区间、新旧、排序、分页
      case 'getList': {
        const {
          page = 1,
          pageSize = 20,
          brand,
          model,
          minPrice,
          maxPrice,
          condition,
          sort = 'createdAt',    // 排序字段
          sortOrder = 'desc'     // 排序方向
        } = data

        // 构建查询条件
        const query = { status: 'active' }
        if (brand) query.brand = brand
        if (model) query.model = db.RegExp({ regexp: model, options: 'i' })
        if (condition) query.condition = condition
        if (minPrice !== undefined || maxPrice !== undefined) {
          query.price = {}
          if (minPrice !== undefined) query.price = _.gte(minPrice)
          if (maxPrice !== undefined) {
            if (query.price && query.price.constructor === Object) {
              query.price = _.and([query.price, _.lte(maxPrice)])
            } else {
              query.price = _.lte(maxPrice)
            }
          }
        }

        const total = (await db.collection('vehicles').where(query).count()).total
        const { data: vehicles } = await db.collection('vehicles')
          .where(query)
          .orderBy(sort, sortOrder)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: vehicles,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 获取经销商车辆列表 ============
      // 分页获取指定经销商的所有车辆
      case 'getDealerVehicles': {
        const { dealerId, page = 1, pageSize = 20, status: vehicleStatus } = data
        if (!dealerId) {
          return { code: -1, message: '缺少 dealerId 参数', data: null }
        }

        const query = { dealerId }
        if (vehicleStatus) {
          query.status = vehicleStatus
        } else {
          query.status = _.neq('deleted')
        }

        const total = (await db.collection('vehicles').where(query).count()).total
        const { data: vehicles } = await db.collection('vehicles')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            list: vehicles,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          }
        }
      }

      // ============ 全文搜索车辆 ============
      // 在品牌 + 车型名称上进行模糊搜索
      case 'search': {
        const { keyword, page = 1, pageSize = 20 } = data
        if (!keyword || keyword.trim() === '') {
          return { code: -1, message: '搜索关键词不能为空', data: null }
        }

        const query = {
          status: 'active',
          // 使用正则实现模糊匹配
          [_.or]: [
            { brand: db.RegExp({ regexp: keyword, options: 'i' }) },
            { model: db.RegExp({ regexp: keyword, options: 'i' }) },
            { description: db.RegExp({ regexp: keyword, options: 'i' }) },
            { tags: keyword }
          ]
        }

        const total = (await db.collection('vehicles').where(query).count()).total
        const { data: vehicles } = await db.collection('vehicles')
          .where(query)
          .orderBy('viewCount', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()

        return {
          code: 0,
          message: 'ok',
          data: {
            keyword,
            list: vehicles,
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
    console.error(`[vehicleService] action=${action} error:`, err)
    return { code: -1, message: err.message || '服务器错误', data: null }
  }
}
