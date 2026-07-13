const config = {
  env: { NODE_ENV: '"production"' },
  defineConstants: { API_BASE: '"https://api.hauche.com/api"' },
  mini: {},
  h5: {}
}
module.exports = function(merge) { return merge({}, config) }
