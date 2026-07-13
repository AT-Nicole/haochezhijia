const config = {
  env: { NODE_ENV: '"development"' },
  defineConstants: { API_BASE: '"http://localhost:3000/api"' },
  mini: {},
  h5: {}
}
module.exports = function(merge) { return merge({}, config) }
