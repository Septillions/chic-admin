// import { frameInRoutes } from '@/router/routes'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('menu', [
      'routesData'
    ])
  },
  methods: {
    handleMenuSelect (index, indexPath) {
      if (/^menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        this.$open(index)
      } else {
        // this.$router.push({
        //   path: index
        // })
        this.getRoutePath(index, indexPath)
      }
    },
    /**
     * 触发菜单点击后进行菜单过滤
     * @param index     选中菜单项的 index
     * @param indexPath 选中菜单项的 index path
     */
    getRoutePath (index, indexPath) {
      // 首页或子级路由直接访问
      if (index === '/index' || !indexPath || indexPath.length > 1) {
        this.$router.push({ path: index })
        return
      }
      // 查找顶级路由下是否存在子路由
      let route = null
      for (const value of this.routesData) {
        if (value.path === index) {
          route = value.children
          break
        }
      }
      // 不存在子路由,则直接进入
      if (!route) {
        this.$router.push({ path: index })
        return
      }
      // 存在子路由,进入子路由首页
      for (const value of route) {
        if (value.path) {
          this.$router.push({ path: value.path })
          break
        }
      }
    }
  }
}
