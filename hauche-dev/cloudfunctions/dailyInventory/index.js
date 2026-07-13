// dailyInventory 云函数 - 每日库存巡检
// 定时触发：每天08:00执行
// 检测超期未售车辆，标记慢车库存，生成调价建议，推送通知
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// 库龄等级定义
const INVENTORY_AGING_LEVELS = {
  warning: { days: 60, label: '库龄预警', color: 'yellow' },   // 60天
  slow_moving: { days: 90, label: '慢车库存', color: 'orange' }, // 90天
  critical: { days: 120, label: '严重滞销', color: 'red' }      // 120天
}

// 根据库龄生成调价建议
function generatePricingSuggestion(vehicle, agingDays) {
  const originalPrice = parseFloat((vehicle.price || '0').replace(/[^\d.]/g, ''))
  const brand = vehicle.brand || ''
  const model = vehicle.model || ''

  if (agingDays >= 120) {
    // 严重滞销：建议降价5-10%
    const suggestPrice = Math.round(originalPrice * 0.92)
    return {
      level: 'critical',
      suggestion: `严重滞销车辆，建议立即降价促销。建议参考价：¥${suggestPrice.toLocaleString()}（降幅约8%）`,
      suggestPrice: `¥${suggestPrice.toLocaleString()}`,
      urgency: '立即处理'
    }
  } else if (agingDays >= 90) {
    // 慢车：建议降价3-5%
    const suggestPrice = Math.round(originalPrice * 0.95)
    return {
      level: 'slow_moving',
      suggestion: `已进入慢车库存，建议适度降价。建议参考价：¥${suggestPrice.toLocaleString()}（降幅约5%）`,
      suggestPrice: `¥${suggestPrice.toLocaleString()}`,
      urgency: '尽快处理'
    }
  } else if (agingDays >= 60) {
    // 预警：关注并考虑小幅让利
    const suggestPrice = Math.round(originalPrice * 0.97)
    return {
      level: 'warning',
      suggestion: `库龄预警，建议关注市场动态并考虑小幅让利。建议参考价：¥${suggestPrice.toLocaleString()}（降幅约3%）`,
      suggestPrice: `¥${suggestPrice.toLocaleString()}`,
      urgency: '持续关注'
    }
  }

  return { level: 'normal', suggestion: '库龄正常', urgency: '无需调整' }
}

exports.main = async (event, context) => {
  const today = new Date()
  console.log(`每日库存巡检开始执行: ${today.toLocaleString()}`)

  const results = {
    date: today.toISOString().split('T')[0],
    scannedVehicles: 0,
    alertVehicles: 0,
    updatedVehicles: 0,
    pricingSuggestions: 0,
    errors: []
  }

  // 按库龄等级统计
  const agingStats = {
    warning: 0,
    slow_moving: 0,
    critical: 0
  }

  try {
    // 查询所有在售车辆
    const vehiclesRes = await db.collection('vehicles')
      .where({ status: 'active' })
      .limit(200)
      .get()

    const vehicles = vehiclesRes.data || []
    console.log(`扫描 ${vehicles.length} 辆在售车辆`)

    for (const vehicle of vehicles) {
      try {
        results.scannedVehicles++

        // 计算库龄（天）
        const listedDate = vehicle.listedDate ? new Date(vehicle.listedDate) : new Date(vehicle.createTime)
        const agingDays = Math.floor((today - listedDate) / (1000 * 60 * 60 * 24))

        // 检查是否超过预警线
        if (agingDays >= INVENTORY_AGING_LEVELS.warning.days) {
          results.alertVehicles++

          // 确定库龄等级
          let agingLevel = 'warning'
          if (agingDays >= INVENTORY_AGING_LEVELS.critical.days) {
            agingLevel = 'critical'
          } else if (agingDays >= INVENTORY_AGING_LEVELS.slow_moving.days) {
            agingLevel = 'slow_moving'
          }

          agingStats[agingLevel]++

          // 生成调价建议
          const priceSuggestion = generatePricingSuggestion(vehicle, agingDays)

          // 更新车辆状态
          await db.collection('vehicles').doc(vehicle._id).update({
            data: {
              inventoryStatus: agingLevel,
              inventoryAgingDays: agingDays,
              pricingSuggestion: priceSuggestion.suggestion,
              suggestPrice: priceSuggestion.suggestPrice || null,
              updateTime: db.serverDate()
            }
          })
          results.updatedVehicles++

          // 保存库存预警记录
          await db.collection('inventory_alerts').add({
            data: {
              vehicleId: vehicle._id,
              dealerId: vehicle.dealerId,
              brand: vehicle.brand,
              model: vehicle.model,
              agingLevel,
              agingDays,
              pricingSuggestion: priceSuggestion.suggestion,
              alertDate: today.toISOString().split('T')[0],
              status: 'pending',
              createTime: db.serverDate()
            }
          })

          results.pricingSuggestions++

          // 严重滞销车辆推送紧急通知
          if (agingLevel === 'critical' && vehicle.dealerId) {
            try {
              const dealerRes = await db.collection('dealers').doc(vehicle.dealerId).get()
              const dealer = dealerRes.data

              if (dealer && dealer.openid) {
                await cloud.openapi.subscribeMessage.send({
                  touser: dealer.openid,
                  templateId: process.env.INVENTORY_TEMPLATE_ID || '',
                  page: 'pages/inventory/index',
                  data: {
                    thing1: { value: `${vehicle.brand || ''} ${vehicle.model || ''}` },
                    thing2: { value: '严重滞销预警' },
                    thing3: { value: `已库龄${agingDays}天` }
                  }
                })
              }
            } catch (notifyErr) {
              console.warn(`库存预警通知推送失败: ${notifyErr.message}`)
            }
          }
        }
      } catch (vErr) {
        console.error(`处理车辆 ${vehicle._id} 时出错:`, vErr.message)
        results.errors.push({
          vehicleId: vehicle._id,
          error: vErr.message
        })
      }
    }

    // 记录执行日志
    await db.collection('cron_logs').add({
      data: {
        function: 'dailyInventory',
        executeDate: today.toISOString().split('T')[0],
        scannedVehicles: results.scannedVehicles,
        alertVehicles: results.alertVehicles,
        updatedVehicles: results.updatedVehicles,
        agingStats,
        createTime: db.serverDate()
      }
    })

    console.log(`库存巡检完成: 扫描 ${results.scannedVehicles} 辆, 预警 ${results.alertVehicles} 辆, 更新 ${results.updatedVehicles} 辆`)
  } catch (err) {
    console.error('每日库存巡检执行失败:', err)
    results.errors.push({ global: err.message })
  }

  return { code: 0, message: 'ok', data: results }
}
