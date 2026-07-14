/**
 * 微信云开发服务层
 * 统一封装数据库、存储、云函数调用
 */

import Taro from '@tarojs/taro'

// 云开发环境ID（需要在微信云开发控制台创建后填入）
// TODO: 替换为真实的云开发环境ID
const ENV_ID = 'hauche-env-prod'

/**
 * 获取云数据库引用
 */
export function getDB() {
  return wx.cloud.database({ env: ENV_ID })
}

/**
 * 通用查询封装
 */
export async function query(collection, options = {}) {
  const db = getDB()
  const { where = {}, orderBy, skip, limit = 20, field } = options

  let queryRef = db.collection(collection)

  if (Object.keys(where).length > 0) {
    queryRef = queryRef.where(where)
  }
  if (orderBy) {
    queryRef = queryRef.orderBy(orderBy.field, orderBy.order || 'desc')
  }
  if (skip) {
    queryRef = queryRef.skip(skip)
  }
  queryRef = queryRef.limit(limit)
  if (field) {
    queryRef = queryRef.field(field)
  }

  const { data } = await queryRef.get()
  return data
}

/**
 * 获取单条记录
 */
export async function getById(collection, id) {
  const db = getDB()
  const { data } = await db.collection(collection).doc(id).get()
  return data
}

/**
 * 新增记录
 */
export async function add(collection, data) {
  const db = getDB()
  const { _id } = await db.collection(collection).add({ data })
  return _id
}

/**
 * 更新记录
 */
export async function update(collection, id, data) {
  const db = getDB()
  await db.collection(collection).doc(id).update({ data })
}

/**
 * 删除记录
 */
export async function remove(collection, id) {
  const db = getDB()
  await db.collection(collection).doc(id).remove()
}

/**
 * 聚合查询（用于统计）
 */
export function aggregate(collection) {
  const db = getDB()
  return db.collection(collection).aggregate()
}

/**
 * 上传文件到云存储
 */
export async function uploadFile(filePath, cloudPath) {
  const { fileID } = await wx.cloud.uploadFile({
    cloudPath,
    filePath
  })
  return fileID
}

/**
 * 获取临时文件链接
 */
export async function getTempFileURL(fileList) {
  const { fileList: result } = await wx.cloud.getTempFileURL({ fileList })
  return result
}

/**
 * 调用云函数
 */
export async function callFunction(name, data = {}) {
  const { result } = await wx.cloud.callFunction({ name, data })
  return result
}

/**
 * 执行事务
 * @param {function} callback - 事务回调，接收事务数据库实例
 * @returns {Promise<any>} 事务结果
 */
export async function runTransaction(callback) {
  const db = getDB()
  return db.runTransaction(callback)
}

/**
 * 批量新增记录（云数据库单次限制20条，自动分片）
 * @param {string} collection - 集合名称
 * @param {Array<object>} records - 要插入的记录数组
 * @returns {Promise<string[]>} 插入记录的ID数组
 */
export async function batchAdd(collection, records) {
  const db = getDB()
  const CHUNK_SIZE = 20 // 云数据库单次批量操作上限
  const ids = []

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE)
    const res = await db.collection(collection).add({ data: chunk })
    // add 批量插入时返回的 ids 结构
    if (Array.isArray(res.ids)) {
      ids.push(...res.ids)
    } else if (res._id) {
      ids.push(res._id)
    }
  }

  return ids
}

/**
 * 批量更新记录
 * @param {string} collection - 集合名称
 * @param {Array<{id: string, data: object}>} updates - 更新数组
 */
export async function batchUpdate(collection, updates) {
  const db = getDB()
  const CHUNK_SIZE = 20

  for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
    const chunk = updates.slice(i, i + CHUNK_SIZE)
    // 使用 Promise.all 并行更新分片内的记录
    await Promise.all(
      chunk.map(item => db.collection(collection).doc(item.id).update({ data: item.data }))
    )
  }
}

/**
 * 获取集合记录总数（使用 _ 命令查询）
 * @param {string} collection - 集合名称
 * @param {object} where - 查询条件
 * @returns {Promise<number>} 总数
 */
export async function count(collection, where = {}) {
  const db = getDB()
  const countQuery = db.collection(collection).where(where).count()
  const { total } = await countQuery
  return total
}

/**
 * 分页查询（完整分页方案）
 * @param {string} collection - 集合名称
 * @param {object} options - 分页选项
 * @param {object} options.where - 查询条件
 * @param {number} options.page - 当前页码（从1开始）
 * @param {number} options.pageSize - 每页数量，默认20
 * @param {string} options.orderBy - 排序字段
 * @param {string} options.order - 排序方向 'asc' | 'desc'，默认 'desc'
 * @returns {Promise<{list: Array, total: number, page: number, pageSize: number, totalPages: number}>}
 */
export async function paginate(collection, options = {}) {
  const {
    where = {},
    page = 1,
    pageSize = 20,
    orderBy = 'createdAt',
    order = 'desc'
  } = options

  // 并行查询列表和总数
  const [list, total] = await Promise.all([
    query(collection, {
      where,
      orderBy: { field: orderBy, order },
      skip: (page - 1) * pageSize,
      limit: pageSize
    }),
    count(collection, where)
  ])

  return {
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

/**
 * 调用云函数（带错误处理）
 * @param {string} name - 云函数名称
 * @param {object} data - 传入参数
 * @returns {Promise<any>} 云函数返回结果
 */
export async function callCloudFunction(name, data) {
  try {
    const res = await Taro.cloud.callFunction({ name, data })
    return res.result
  } catch (err) {
    console.error(`[cloud] 云函数 ${name} 调用失败:`, err)
    throw err
  }
}

/**
 * 发送微信订阅消息
 * @param {string} openid - 用户openid
 * @param {string} templateId - 消息模板ID
 * @param {object} data - 消息数据
 */
export async function sendMessage(openid, templateId, data) {
  try {
    await Taro.cloud.callFunction({
      name: 'messageService',
      data: {
        action: 'sendSubscribeMessage',
        openid,
        templateId,
        data
      }
    })
  } catch (err) {
    console.error('[cloud] 订阅消息发送失败:', err)
    throw err
  }
}

// 导出集合名称常量
export const COLLECTIONS = {
  USERS: 'users',
  DEALERS: 'dealers',
  VEHICLES: 'vehicles',
  LEADS: 'leads',
  ORDERS: 'orders',
  SERVICES: 'services',
  CONTENTS: 'contents',
  COMMISSIONS: 'commissions',
  EVENTS: 'events',
  FINANCES: 'finances'
}
