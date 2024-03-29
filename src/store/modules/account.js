import { Message, MessageBox } from 'element-ui'
import utils from '@/utils'
import router from '@/router'
import { authLogin } from '@/api/auth/admin'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload captcha {String} 验证码
     * @param {Object} payload uuid {String} UUID
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login ({ dispatch }, { login }) {
      const result = await authLogin(login)
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      utils.cookies.set('uuid', result.data.admin.id)
      utils.cookies.set('token', result.data.token.accessToken)
      // 设置 vuex 用户信息
      await dispatch('user/set', {
        name: result.data.admin.nickname,
        admin: result.data.admin,
        token: result.data.token
      }, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
    },
    /**
     * @description 退出登录并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 退出登录
       */
      async function logout () {
        // 删除cookie
        utils.cookies.remove('token')
        utils.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('user/set', {}, { root: true })
        // 删除 sourceData
        await dispatch('db/set', {
          dbName: 'database',
          path: '$menu.sourceData',
          value: [],
          user: true
        }, { root: true })
        // 跳转路由
        router.push({ name: 'login' })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('gray/set', true, { root: true })
        MessageBox.confirm('确定要退出登录吗', '提示', { type: 'warning' })
          .then(() => {
            commit('gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('gray/set', false, { root: true })
            Message({ message: '取消退出登录' })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load ({ dispatch }) {
      // 加载用户名
      await dispatch('user/load', null, { root: true })
      // 加载主题
      await dispatch('theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('transition/load', null, { root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('page/openedLoad', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('menu/asideLoad', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('color/load', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('size/load', null, { root: true })
      // 持久化数据读取菜单源数据
      // await dispatch('menu/sourceDataLoad', null, { root: true })
      // 持久化数据读取历史菜单数据
      // await dispatch('menu/historyLoad', null, { root: true })
    }
  }
}
