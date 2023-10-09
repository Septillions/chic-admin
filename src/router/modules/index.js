import layoutHeaderAside from '@/layout/header-aside'

// 懒加载
const _import = file => () => import('@/views/' + file)

const meta = { auth: true }

export default {
  path: '/',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: [
    // 首页
    {
      path: 'index',
      name: 'index',
      meta: { ...meta, cache: true, title: '首页' },
      component: _import('public/index')
    },
    // 系统 前端日志
    {
      path: 'log',
      name: 'log',
      meta: { ...meta, cache: true, title: '前端日志' },
      component: _import('public/log')
    },
    // 刷新页面 必须保留
    {
      path: 'refresh',
      name: 'refresh',
      hidden: true,
      component: _import('public/function/refresh')
    },
    // 页面重定向 必须保留
    {
      path: 'redirect/:route*',
      name: 'redirect',
      hidden: true,
      component: _import('public/function/redirect')
    }
  ]
}
