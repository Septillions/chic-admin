import index from './modules/index'
// import setting from './modules/setting'

// 懒加载
const _import = file => () => import('@/views/' + file)

/**
 * 在主框架内显示
 */
const frameIn = [
  index
  // setting
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('public/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('public/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
