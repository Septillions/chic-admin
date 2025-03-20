// 设置文件
import setting from '@/setting.js'
import menu from '@/menu'
import utils from '@/utils'
import router from '@/router/dynamic'
import { getMenuAuthList } from '@/api/auth/menu'

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边历史菜单
    history: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 侧边栏折叠动画
    asideTransition: setting.menu.asideTransition,
    // 侧边栏首页路径
    asideIndex: setting.page.opened[0].fullPath,
    // 侧边栏限制历史菜单
    historyCount: setting.menu.historyCount,
    // 菜单源数据
    sourceData: [],
    // 路由权限数据
    routesData: [],
    // 路由是否初始化
    routesInited: false
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    async asideCollapseSet ({ state, dispatch }, collapse) {
      // store 赋值
      state.asideCollapse = collapse
      // 持久化
      await dispatch('db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} context
     */
    async asideCollapseToggle ({ state, dispatch }) {
      // store 赋值
      state.asideCollapse = !state.asideCollapse
      // 持久化
      await dispatch('db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * 设置侧边栏折叠动画
     * @param {Object} context
     * @param {Boolean} transition is transition
     */
    async asideTransitionSet ({ state, dispatch }, transition) {
      // store 赋值
      state.asideTransition = transition
      // 持久化
      await dispatch('db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * 切换侧边栏折叠动画
     * @param {Object} context
     */
    async asideTransitionToggle ({ state, dispatch }) {
      // store 赋值
      state.asideTransition = !state.asideTransition
      // 持久化
      await dispatch('db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * 持久化数据加载侧边栏设置
     * @param {Object} context
     */
    async asideLoad ({ state, dispatch }) {
      // store 赋值
      const menu = await dispatch('db/get', {
        dbName: 'sys',
        path: 'menu',
        defaultValue: setting.menu,
        user: true
      }, { root: true })
      state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
      state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
    },
    /**
     * @description 从持久化数据读取菜单源数据
     * @param state state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async sourceDataLoad ({ state, dispatch }) {
      // 加载菜单数据源
      // state.sourceData = await dispatch('db/get', {
      //   dbName: 'database',
      //   path: '$menu.sourceData',
      //   defaultValue: [],
      //   user: true
      // }, { root: true })
      // 处理菜单源不存在，并且用户已登录
      if (!state.sourceData.length && utils.cookies.get('token')) {
        const result = await getMenuAuthList()
        // 持久化
        state.sourceData = result.data || []
        await dispatch('db/set', {
          dbName: 'database',
          path: '$menu.sourceData',
          value: state.sourceData,
          user: true
        }, { root: true })
      }
      // 处理顶栏菜单、侧边菜单、功能搜索
      menu.install(this, state.sourceData)
      // 处理动态路由
      router.install(this, state.sourceData)
    },
    /**
     * @description 从持久化数据读取历史菜单数据
     * @param state state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyLoad ({ state, dispatch }) {
      // 获取历史菜单持久化
      state.history = await dispatch('db/get', {
        dbName: 'database',
        path: '$menu.history',
        defaultValue: [],
        user: true
      }, { root: true })
    },
    /**
     * 将 history 属性赋值并持久化 在这之前请先确保已经更新了 state.history
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyDataWrite ({ state, dispatch }) {
      // 历史菜单持久化
      dispatch('db/set', {
        dbName: 'database',
        path: '$menu.history',
        value: state.history,
        user: true
      }, { root: true })
    },
    /**
     * 设置历史菜单数据
     * @param state
     * @param dispatch
     * @param history
     * @returns {Promise<void>}
     */
    async historyDataSet ({ state, dispatch }, history) {
      if (history) {
        const index = state.history.findIndex(menu => menu.path === history.path)
        if (index !== -1) {
          state.history.splice(index, 1)
        }
        state.history.unshift(history)
        if (state.history.length > state.historyCount) {
          state.history = state.history.slice(0, state.historyCount)
        }
      }
      // 持久化
      await dispatch('historyDataWrite')
    },
    /**
     * 清空访问历史
     * @param state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyClear ({ state, dispatch }) {
      state.history = []
      await dispatch('historyDataWrite')
    }
  },
  mutations: {
    /**
     * @description 设置顶栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = menu
    },
    /**
     * @description 设置权限路由
     * @param {Object} state state
     * @param {Array} routes routes setting
     */
    routesSet (state, routes) {
      // store 赋值
      state.routesData = routes
      state.routesInited = true
    }
  },
  getters: {
    inited (state) {
      return state.routesInited
    }
  }
}
