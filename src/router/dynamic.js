import store from '@/store'
import router from '@/router'
import utils from '@/utils'
import layoutHeaderAside from '@/layout/header-aside'
import { frameInRoutes } from '@/router/routes'

// 懒加载
const _import = file => () => import('@/views' + file)

// 初始化动态路由
registerRouterHook()

// 初始化状态
function isInited () {
  return store.getters['menu/inited']
}

// 注册路由全局前置守卫
function registerRouterHook () {
  router.beforeEach(async (to, from, next) => {
    if (isInited()) {
      next()
      return
    }
    // 已登录 加载权限、路由、菜单
    const token = utils.cookies.get('token')
    if (token && token !== 'undefined') {
      // 持久化数据读取菜单源数据
      await store.dispatch('menu/sourceDataLoad', null, { root: true })
      // 持久化数据读取历史菜单数据
      await store.dispatch('menu/historyLoad', null, { root: true })
      next({ path: to.path, replace: true })
    } else {
      next()
    }
  })
}

/**
 * 根据提供的父级和列表格式化路由。
 *
 * @param {Array} list - 路由对象列表
 * @param {Object} parent - 父级路由对象
 * @return {Array} - 格式化后的路由对象列表
 */
function formatRouter (list, parent) {
  if (parent == null) {
    parent = { children: [] }
  }
  list.forEach((value) => {
    // 类型为菜单
    if (value.type !== 1) {
      return
    }
    let item = parent
    // 当组件存在或者 parentId = 0 为顶层时，创建新的路由项
    if (value.component || value.parentId === 0) {
      item = {
        id: value.id,
        parentId: value.parentId,
        path: value.url,
        name: value.url.split('/').filter(Boolean).join('-'),
        meta: { auth: true, cache: true, title: value.name }
      }
      if (value.parentId === 0) {
        item.component = layoutHeaderAside
      } else {
        item.component = _import(value.component)
      }
      parent.children.push(item)
    }
    // 递归处理子路由
    if (value.children != null && value.children.length > 0) {
      if (item.children == null) {
        item.children = []
      }
      formatRouter(value.children, item)
    }
  })
  return parent.children
}

export default {
  install (vm, source) {
    const routes = formatRouter(utils.formatDataToTree(source), null)
    router.addRoutes(routes)
    // 设置权限路由
    vm.commit('menu/routesSet', routes)
    // 处理路由 得到每一级的路由设置
    vm.commit('page/init', frameInRoutes.concat(routes))
  }
}
