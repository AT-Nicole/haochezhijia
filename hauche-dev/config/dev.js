const config = {
  env: {
    NODE_ENV: '"development"',
    USE_MOCK: '"true"',
    CLOUD_ENV_ID: '"hauche-dev"',
    DEEPSEEK_API_KEY: '""',
    WX_APP_ID: '"wx0000000000000000"'
  },
  defineConstants: {},
  mini: {},
  h5: {}
}
module.exports = function(merge) { return merge({}, config) }
