/**
 * AI 智能客服服务
 * 通过云函数 aiService 实现对话与推荐
 */
import Taro from '@tarojs/taro'
import { callCloudFunction } from './cloud'

export async function sendMessage(message, context = {}) {
  return callCloudFunction('aiService', {
    action: 'chat',
    data: { message, userId: context.userId, context: context.history || [] }
  })
}

export async function getCarRecommendation(preferences) {
  return callCloudFunction('aiService', {
    action: 'recommend',
    data: preferences // { budget, preference, usage, userId }
  })
}
