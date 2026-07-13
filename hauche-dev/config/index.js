const config = {
  projectName: '豪车之家',
  date: '2026-07-11',
  designWidth: 375,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2, 375: 2 / 1 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: { patterns: [], options: {} },
  framework: 'vue3',
  compiler: { type: 'template' },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      cssModules: { enable: false, config: { namingPattern: 'module', generateScopedName: '[name]__[local]___[hash:base64:5]' } }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: { autoprefixer: { enable: true, config: {} }, cssModules: { enable: false, config: { namingPattern: 'module', generateScopedName: '[name]__[local]___[hash:base64:5]' } } }
  }
}
module.exports = function(merge) { return merge({}, config) }
