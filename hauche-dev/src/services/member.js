/**
 * 会员服务
 * 通过云函数 userService 实现会员管理
 */
import { callCloudFunction } from './cloud'

export function getMemberInfo(userId) {
  return callCloudFunction('userService', {
    action: 'getMemberInfo',
    data: { userId }
  })
}

export function upgradeMember(userId, tier) {
  return callCloudFunction('userService', {
    action: 'upgradeMember',
    data: { userId, tier }
  })
}
