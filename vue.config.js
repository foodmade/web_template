const path = require("path");
const NODE_MODULES_PATH = "node_modules";
var mode = process.env.NODE_ENV || "development";
module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部,
  // 例如 https://www.my-app.com/
  // 如果你的应用部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如将你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 '/my-app/'
  baseUrl: "/", // 构建好的文件输出到哪里
  assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  outputDir: "dist", // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败
  lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  transpileDependencies: [
    /* string or regex */
  ], // 是否为生产环境构建生成sourceMap?
  productionSourceMap: false, // 调整内部的webpack配置. // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {},
  configureWebpack: {
    devtool: (mode === "development") ? "inline-source-map" : false,
    mode: mode,
    optimization: {
      usedExports: true,
      sideEffects: true,
      runtimeChunk: mode === "development", // 将webpack运行时生成代码打包到runtime.js
      splitChunks: {// 动态导入模块
        chunks: "all",
        minSize: 30000, // 表示抽取出来的文件在压缩前的最小大小，默认为 30000
        minChunks: 1, // 表示被引用次数，默认为1
        maxSize: 0, // 最小尺寸，默认0
        maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为 5
        maxInitialRequests: 3, // 入口点处的最大并行请求数，默认为 3
        automaticNameDelimiter: '~', // 抽取出来的文件的自动生成名字的分割符，默认为 ~
        name: true, // 抽取出来文件的名字，默认为 true，表示自动生成文件名
        cacheGroups: { // 缓存组
          vendors: {
            test: /[\\/]node_modules[\\/]/, // 当匹配的是 chunk 名字的时候，面的所有 modules 都会选中
            priority: -10 // 表示抽取权重，数字越大表示优先级越高
          },
          'vue': {
            test: module => /vue/.test(module.context),
            priority: -1,
          },
          'elment-ui': {
            test: module => /element-ui/.test(module.context),
            priority: -2,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
        }
      }
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, NODE_MODULES_PATH)], // 优化模块查找路径
      alias: { // 直接指定它们的位置，这样 webpack 可以省下不少搜索硬盘的时间
        // 'vue': path.resolve(__dirname, NODE_MODULES_PATH, 'vue/dist/vue.min.js'),
        // 'vuex-class': path.resolve(__dirname, NODE_MODULES_PATH, 'vuex-class/dist/vuex-class.min.js'),
        // 'vue-property-decorator': path.resolve(__dirname, NODE_MODULES_PATH, 'vue-property-decorator/lib/vue-property-decorator.js'),
        // 'PageContent': path.resolve(__dirname, 'src/components/base/'),
      }
    }
  }, // CSS 相关选项
  css: {
    // 将组件内部的css提取到一个单独的css文件（只用在生产环境）
    // 也可以是传递给 extract-text-webpack-plugin 的选项对象
    // extract: true, // 允许生成 CSS source maps?
    sourceMap: false, // pass custom options to pre-processor loaders. e.g. to pass options to // sass-loader, use { sass: { ... } }
    loaderOptions: {
      stylus: {
        import: path.resolve(__dirname, "./src/assets/style/main.styl")
      }
    }, // Enable CSS modules for all css / pre-processor files. // This option does not affect *.vue files.
    modules: false
  }, // use thread-loader for babel & TS in production build // enabled by default if the machine has more than 1 cores 
  parallel: require("os").cpus().length > 1, // PWA 插件相关配置 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {}, // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === "darwin",
    // disableHostCheck: true,
    host: "0.0.0.0",
    port: 8080,
    https: false,
    // hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: null // string | Object
    // before: app => {}
  }, // 第三方插件配置

  pluginOptions: {
    // ...
  }
}