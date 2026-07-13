import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getVehicleList, getVehicleDetail, searchVehicles } from '@/services/vehicle'

export const useVehicleStore = defineStore('vehicle', () => {
  // 状态
  const vehicleList = ref([])
  const currentVehicle = ref(null)
  const loading = ref(false)
  const searchResults = ref([])
  const pagination = ref({ page: 1, pageSize: 20, total: 0, hasMore: true })

  // 获取车辆列表
  async function fetchList(options = {}) {
    loading.value = true
    try {
      const res = await getVehicleList({ ...options, page: pagination.value.page, pageSize: pagination.value.pageSize })
      if (res.code === 0) {
        const { list, total } = res.data
        vehicleList.value = options.page > 1 ? [...vehicleList.value, ...list] : list
        pagination.value.total = total
        pagination.value.hasMore = vehicleList.value.length < total
      }
    } catch (err) {
      console.error('Fetch vehicles failed:', err)
    } finally {
      loading.value = false
    }
  }

  // 获取车辆详情
  async function fetchDetail(vehicleId) {
    loading.value = true
    try {
      const res = await getVehicleDetail(vehicleId)
      if (res.code === 0) currentVehicle.value = res.data
    } catch (err) {
      console.error('Fetch detail failed:', err)
    } finally {
      loading.value = false
    }
  }

  // 搜索车辆
  async function search(keyword) {
    loading.value = true
    try {
      const res = await searchVehicles(keyword)
      if (res.code === 0) searchResults.value = res.data
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      loading.value = false
    }
  }

  // 重置列表
  function resetList() {
    vehicleList.value = []
    pagination.value = { page: 1, pageSize: 20, total: 0, hasMore: true }
  }

  return { vehicleList, currentVehicle, loading, searchResults, pagination, fetchList, fetchDetail, search, resetList }
})
