/**
 * 微信云开发服务层
 * 统一封装数据库、存储、云函数调用
 */

// 云开发环境ID（需要在微信云开发控制台创建后填入）
const ENV_ID = 'your-env-id'

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
