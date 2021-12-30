const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const { each, keys } = require('lodash')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = undefined

module.exports = {
  publicPath,
  lintOnSave: true,
  devServer: {
    port: 8081,
    publicPath,
    disableHostCheck: process.env.NODE_ENV === 'development'
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        additionalData: '@use "@/assets/style/public.scss" as *;'
      }
    }
  },
  pages,
  // build时 超过10K的打包成gzip 减小体积
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    config.optimization.runtimeChunk({
      name: 'manifest'
    })
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    each(keys(pages), name => {
      config.plugins.delete(`prefetch-${name}`)
      config.plugins.delete(`preload-${name}`)
    })
    // webpack-theme-color-replacer
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }])
    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // 不输出 map 文件
  productionSourceMap: false
}
