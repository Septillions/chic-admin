export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认配置
  menu: {
    // 侧边栏是否折叠
    asideCollapse: false,
    // 侧边栏折叠动画
    asideTransition: true,
    // 访问历史收藏数
    historyCount: 15
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: '首页',
          auth: false
        }
      }
    ]
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    // 默认主题
    default: 'light',
    list: [
      {
        title: '浅色',
        name: 'light',
        preview: 'image/theme/light/preview@2x.png'
      },
      {
        title: '深色',
        name: 'dark',
        preview: 'image/theme/dark/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
