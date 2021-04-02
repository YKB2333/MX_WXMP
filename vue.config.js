const srcConfig = require('./src/config')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '_c': '@/common/components',
        '_img': '@/static/images'
      }
    }
  },
  devServer: {
    port: 8911,
    proxy: {
      //配置跨域
      '/proxy': {
        target: srcConfig.baseURL,
        changOrigin: true,
        pathRewrite: {
          '^/proxy': ''
        }
      }
    }
  }
}