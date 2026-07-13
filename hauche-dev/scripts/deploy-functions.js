/**
 * 云函数部署辅助脚本
 * 用法: node scripts/deploy-functions.js
 * 
 * 该脚本不直接部署（需要微信开发者工具），
 * 而是验证所有云函数结构完整性并输出部署清单
 */

const fs = require('fs')
const path = require('path')

const FUNCTIONS_DIR = path.join(__dirname, '..', 'cloudfunctions')

function validateFunction(dir) {
  const pkgPath = path.join(dir, 'package.json')
  const indexPath = path.join(dir, 'index.js')
  
  const errors = []
  if (!fs.existsSync(pkgPath)) errors.push('missing package.json')
  if (!fs.existsSync(indexPath)) errors.push('missing index.js')
  
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    if (!pkg.dependencies?.['wx-server-sdk']) {
      errors.push('missing wx-server-sdk dependency')
    }
  }
  
  return { dir: path.basename(dir), valid: errors.length === 0, errors }
}

function main() {
  console.log('══════════════════════════════════════')
  console.log('  豪车之家 - 云函数部署检查')
  console.log('══════════════════════════════════════\n')
  
  if (!fs.existsSync(FUNCTIONS_DIR)) {
    console.log('❌ cloudfunctions/ 目录不存在')
    process.exit(1)
  }
  
  const functions = fs.readdirSync(FUNCTIONS_DIR).filter(f => 
    fs.statSync(path.join(FUNCTIONS_DIR, f)).isDirectory() && f !== 'node_modules'
  )
  
  console.log(`发现 ${functions.length} 个云函数:\n`)
  
  let allValid = true
  functions.forEach(fn => {
    const result = validateFunction(path.join(FUNCTIONS_DIR, fn))
    if (result.valid) {
      console.log(`  ✅ ${fn}`)
    } else {
      console.log(`  ❌ ${fn}: ${result.errors.join(', ')}`)
      allValid = false
    }
  })
  
  console.log('\n══════════════════════════════════════')
  console.log('部署步骤:')
  console.log('══════════════════════════════════════')
  console.log('1. 打开微信开发者工具')
  console.log('2. 导入项目，选择 dist/ 目录')
  console.log('3. 点击"云开发" → 开通云开发')
  console.log('4. 上传全部云函数（右键 cloudfunctions/xxx → 上传并部署）')
  console.log('5. 配置环境变量:')
  console.log('   - DEEPSEEK_API_KEY: DeepSeek API密钥')
  console.log('   - WX_PAY_MCH_ID: 微信支付商户号')
  console.log('   - WX_PAY_API_KEY: 微信支付API密钥')
  console.log('6. 配置定时触发器（参考 cloudfunctions/config.json）')
  
  if (!allValid) {
    console.log('\n⚠️  部分云函数验证失败，请检查后重试')
    process.exit(1)
  }
  
  console.log('\n✅ 所有云函数结构验证通过！')
  
  // Read and display config
  const configPath = path.join(FUNCTIONS_DIR, 'config.json')
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    console.log(`\n超时配置:`)
    config.functions.forEach(f => {
      console.log(`  ${f.name}: ${f.timeout}s`)
    })
    if (config.triggers?.length) {
      console.log(`\n定时触发器:`)
      config.triggers.forEach(t => {
        console.log(`  ${t.name}: ${t.cron}`)
      })
    }
  }
}

main()
