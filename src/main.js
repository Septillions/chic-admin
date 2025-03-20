// Vue
import Vue from 'vue'
import App from './App'
// core
import core from '@/plugin/core'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'

// d2-crud-plus 安装与初始化
import './plugin/crud'

// 核心插件
Vue.use(core)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    // 展示系统信息
    this.$store.commit('releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('account/load')
    // 获取并记录用户 UA
    this.$store.commit('ua/get')
    // 初始化全屏监听
    this.$store.dispatch('fullscreen/listen')
  }
}).$mount('#app')

// 动态设置浏览器标题
Vue.prototype.$setTitle = function (title) {
  document.title = title
}
