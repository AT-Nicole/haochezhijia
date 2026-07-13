import { get, post, put } from '@/utils/request'

export const memberApi = {
  getList: (params) => get('/members/list', params),
  getDetail: (id) => get(`/members/${id}`),
  create: (data) => post('/members', data),
  update: (id, data) => put(`/members/${id}`, data),
  checkMembership: () => get('/membership/check'),
}
