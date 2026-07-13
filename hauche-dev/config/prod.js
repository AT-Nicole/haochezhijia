const config = {
  env: {
    NODE_ENV: '"production"',
    USE_MOCK: '"false"',
    CLOUD_ENV_ID: '"hauche-prod"',
    DEEPSEEK_API_KEY: '""',
    WX_APP_ID: '"wx0000000000000000"'
  },
  defineConstants: {},
  mini: {},
  h5: {}
}
module.exports = function(merge) { return merge({}, config) }
