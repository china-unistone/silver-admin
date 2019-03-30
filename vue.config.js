const development = process.env.NODE_ENV !== 'production'

module.exports = {
  baseUrl: development ? '' : '/pc',
  configureWebpack: config => {
    if (development) {
      config.devtool = 'source-map'
    }
  },
  devServer: {
    proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/admin': {
            target: 'http://47.99.200.198/admin',   //代理接口
                changeOrigin: true,
                pathRewrite: {
                '^/admin': ''    //代理的路径
            }
        }
    }
  }
}