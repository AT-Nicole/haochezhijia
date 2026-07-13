import { get, post } from '@/utils/request'

export const chatApi = {
  send: (data) => post('/chat/send', data),
  getHistory: (params) => get('/chat/history', params),
  getTags: (userId) => get('/chat/tags', { user_id: userId }),
}
