/**
 * 车辆相关服务
 * 通过云函数 vehicleService 实现车辆管理
 */
import Taro from '@tarojs/taro'
import { callCloudFunction } from './cloud'

export function getVehicleList(options = {}) {
  return callCloudFunction('vehicleService', {
    action: 'getList',
    data: options // { brand, model, condition, priceMin, priceMax, sort, page, pageSize }
  })
}

export function getVehicleDetail(vehicleId) {
  return callCloudFunction('vehicleService', {
    action: 'getDetail',
    data: { vehicleId }
  })
}

export function addVehicle(data) {
  return callCloudFunction('vehicleService', {
    action: 'add',
    data
  })
}

export function updateVehicle(vehicleId, data) {
  return callCloudFunction('vehicleService', {
    action: 'update',
    data: { vehicleId, ...data }
  })
}

export function searchVehicles(keyword) {
  return callCloudFunction('vehicleService', {
    action: 'search',
    data: { keyword }
  })
}

export function getDealerVehicles(dealerId, options = {}) {
  return callCloudFunction('vehicleService', {
    action: 'getDealerVehicles',
    data: { dealerId, ...options }
  })
}
