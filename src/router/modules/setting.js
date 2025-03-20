import layoutHeaderAside from '@/layout/header-aside'

// 懒加载
const _import = file => () => import('@/views' + file)

const meta = { auth: true }

export default {
  path: '/setting',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '设置首页' },
      component: _import('/setting/index')
    },
    {
      path: 'admin/account',
      name: `${pre}admin-account`,
      meta: { ...meta, cache: true, title: '管理账号' },
      component: _import('/setting/admin/account')
    },
    {
      path: 'auth/role',
      name: `${pre}auth-role`,
      meta: { ...meta, cache: true, title: '角色管理' },
      component: _import('/setting/auth/role')
    },
    {
      path: 'auth/menu',
      name: `${pre}auth-menu`,
      meta: { ...meta, cache: true, title: '菜单管理' },
      component: _import('/setting/auth/menu')
    },
    {
      path: 'auth/rule',
      name: `${pre}auth-rule`,
      meta: { ...meta, cache: true, title: '权限分配' },
      component: _import('/setting/auth/rule')
    }
  ])('setting-')
}
