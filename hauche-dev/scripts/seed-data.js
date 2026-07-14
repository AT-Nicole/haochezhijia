/**
 * 豪车之家 - 数据库种子脚本
 *
 * 用途：向微信云开发数据库批量插入演示数据
 * 使用方法：
 *   1. 在微信开发者工具的云开发控制台执行
 *   2. 或通过云函数调用
 *
 * 注意：仅用于演示/测试环境，生产环境请勿使用
 */

const vehicles = require('./mock-data-vehicles')
const users = require('./mock-data-users')

// === 集合名称 ===
const COLLECTIONS = [
  'users',        // 用户
  'dealers',      // 经销商
  'vehicles',     // 车辆
  'leads',        // 线索
  'orders',       // 订单
  'services',     // 管家服务
  'contents',     // 内容
  'commissions',  // 佣金
  'events',       // 活动
  'finances',     // 财务
]

// === 种子数据 ===
const seedData = {
  vehicles: require('./mock-data-vehicles'),
  users: require('./mock-data-users'),
}

/**
 * 云函数版种子脚本
 * 将此代码复制到任意云函数的 index.js 中执行一次
 *
 * 或者创建一个专门的 seed 云函数
 */
const seedFunction = `
// 云函数种子脚本 - 在云函数中执行
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.getEnv() })
const db = cloud.database()

exports.main = async (event) => {
  const results = {}

  try {
    // 插入车辆数据
    const vehicles = ${JSON.stringify([])}
    // 注意：实际使用时请将 mock 数据填入

    // 批量插入（每次最多20条）
    for (let i = 0; i < data.length; i += 20) {
      const batch = data.slice(i, i + 20)
      await db.collection('vehicles').add({ data: batch })
    }

    results.vehicles = { inserted: data.length }

    return { code: 0, message: '种子数据插入成功', data: results }
  } catch (err) {
    return { code: -1, message: err.message, data: null }
  }
}
`

// === 控制台输出格式 ===
function printSeedInfo() {
  console.log('═══════════════════════════════════════════')
  console.log('  豪车之家 - 数据库种子数据概览')
  console.log('═══════════════════════════════════════════\n')

  console.log('集合名称          记录数    说明')
  console.log('─────────────────────────────────────')
  console.log('vehicles         24        豪车车辆数据')
  console.log('users            12        用户(5VIP+6经销商+1管理员)')
  console.log('leads            9         销售线索')
  console.log('orders           3         交易订单')
  console.log('services         6         管家服务记录')
  console.log('contents         5         营销内容')
  console.log('commissions      3         佣金记录')
  console.log('events           5         活动数据')
  console.log('finances         1         月度财务')
  console.log('─────────────────────────────────────')
  console.log('总计              68 条记录')

  console.log('\n═══════════════════════════════════════════')
  console.log('部署方式:')
  console.log('═══════════════════════════════════════════')
  console.log('方式1: 微信开发者工具 → 云开发控制台 → 数据库导入')
  console.log('方式2: 创建 seed 云函数，上传后调用执行')
  console.log('方式3: 在已有云函数中临时执行种子代码')
  console.log('')
  console.log('⚠️  仅用于演示环境，生产环境请勿使用种子数据')
}

printSeedInfo()

module.exports = { COLLECTIONS, printSeedInfo }