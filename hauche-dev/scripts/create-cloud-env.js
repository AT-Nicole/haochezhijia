/**
 * 环境配置辅助脚本
 * 用法: node scripts/create-cloud-env.js
 */

const fs = require('fs')
const path = require('path')

function main() {
  console.log('══════════════════════════════════════')
  console.log('  豪车之家 - 环境配置向导')
  console.log('══════════════════════════════════════\n')
  
  const envPath = path.join(__dirname, '..', '.env')
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env 文件已存在，跳过创建')
    console.log('   如需重新配置，请先删除 .env 文件')
    return
  }
  
  const envContent = `# 豪车之家 环境配置
# 复制此文件为 .env.local 进行本地开发配置

# 微信小程序 AppID (替换为真实 AppID)
WX_APP_ID=wx0000000000000000

# 微信云开发环境 ID (开通云开发后获取)
CLOUD_ENV_ID=hauche-dev

# DeepSeek API Key (https://platform.deepseek.com)
DEEPSEEK_API_KEY=

# 微信支付商户号 (可选，支付功能需要)
WX_PAY_MCH_ID=
WX_PAY_API_KEY=
WX_PAY_NOTIFY_URL=
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ 已创建 .env 文件')
  console.log('\n请编辑 .env 文件填入真实配置:')
  console.log('  1. WX_APP_ID - 微信小程序 AppID')
  console.log('  2. CLOUD_ENV_ID - 云开发环境 ID')
  console.log('  3. DEEPSEEK_API_KEY - DeepSeek API 密钥')
  console.log('  4. WX_PAY_* - 支付配置(可选)')
}

main()
