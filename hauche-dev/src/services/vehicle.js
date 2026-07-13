/**
 * 车辆相关服务
 */
import { query, getById, add, update, COLLECTIONS } from './cloud'

/**
 * 获取在售车辆列表
 */
export async function getVehicleList(options = {}) {
  const { brand, model, condition, minPrice, maxPrice, sort, page = 1, pageSize = 20 } = options

  const where = { status: '在售' }
  if (brand) where.brand = brand
  if (model) where.model = model
  if (condition) where.condition = condition
  if (minPrice) where.price = { ...where.price, $gte: minPrice }
  if (maxPrice) where.price = { ...where.price, $lte: maxPrice }

  const orderBy = sort
    ? { field: sort === 'price-asc' ? 'price' : sort === 'price-desc' ? 'price' : 'createdAt', order: sort === 'price-asc' ? 'asc' : 'desc' }
    : { field: 'createdAt', order: 'desc' }

  return query(COLLECTIONS.VEHICLES, {
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    limit: pageSize
  })
}

/**
 * 获取车辆详情
 */
export async function getVehicleDetail(id) {
  return getById(COLLECTIONS.VEHICLES, id)
}

/**
 * 获取车行车辆
 */
export async function getDealerVehicles(dealerId) {
  return query(COLLECTIONS.VEHICLES, {
    where: { dealerId, status: '在售' },
    orderBy: { field: 'createdAt', order: 'desc' },
    limit: 50
  })
}

/**
 * 添加车辆
 */
export async function addVehicle(data) {
  return add(COLLECTIONS.VEHICLES, {
    ...data,
    status: '在售',
    viewCount: 0,
    daysInStock: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

/**
 * 更新车辆信息
 */
export async function updateVehicle(id, data) {
  return update(COLLECTIONS.VEHICLES, id, {
    ...data,
    updatedAt: new Date()
  })
}

/**
 * 获取品牌列表
 */
export async function getBrands() {
  // 使用聚合去重
  // MVP阶段返回固定列表
  return [
    { name: '迈巴赫', count: 8 },
    { name: '奔驰', count: 12 },
    { name: '保时捷', count: 10 },
    { name: '路虎', count: 6 },
    { name: '宾利', count: 4 },
    { name: '劳斯莱斯', count: 3 },
    { name: '玛莎拉蒂', count: 5 },
    { name: '兰博基尼', count: 3 }
  ]
}
