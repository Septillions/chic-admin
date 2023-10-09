import { mapActions, mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../utils/menu'

export default {
  name: 'layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render (h) {
    return <div class="layout-header-aside-menu-side">
      <scrollbar>
        <el-menu
          collapse={this.asideCollapse}
          collapseTransition={this.asideTransition}
          uniqueOpened={true}
          defaultActive={this.$route.fullPath}
          ref="menu"
          onSelect={this.handleMenuSelect}>
          {this.menuAside.map(menu => createMenu.call(this, h, menu))}
        </el-menu>
        {
          this.menuAside.length === 0 && !this.asideCollapse
            ? <div class="layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
              <icon name="inbox" />
              <span>没有侧栏菜单</span>
            </div>
            : null
        }
      </scrollbar>
    </div>
  },
  data () {
    return {
      matched: null,
      menuAside: [],
      asideHeight: 300
    }
  },
  computed: {
    ...mapState('menu', [
      'aside',
      'asideCollapse',
      'asideTransition',
      'asideIndex',
      'history'
    ])
  },
  watch: {
    // 监听路由 改变侧边菜单栏
    $route: {
      handler ({ matched, fullPath }) {
        // 路由父级发生变化时菜单数据将发生改变
        const pathRoute = matched[0].path ? matched[0].path : matched[1].path
        if (matched.length > 0 && pathRoute !== this.matched) {
          const _side = this.aside.find(menu => menu.path === pathRoute)
          this.menuAside = _side && _side.children ? _side.children : []
          this.matched = pathRoute
        }

        // 记录历史菜单
        const path = fullPath.slice(0, fullPath.lastIndexOf('/'))
        const openeds = this.menuAside.find(menu => menu.path === path)
        if (openeds !== undefined && openeds.children) {
          const history = openeds.children.find(menu => menu.path === fullPath)
          this.historyDataSet(history).then(() => { })
        }

        // 进入"首页"时,将历史菜单压入最底部
        if (this.asideIndex === fullPath && this.history.length) {
          this.menuAside.unshift({
            path: '/index',
            title: '首页',
            icon: 'home'
          })

          this.menuAside.push({
            path: '/index/history',
            title: '访问历史',
            icon: 'navicon',
            children: this.history
          })

          this.$nextTick(() => {
            if (!this.asideCollapse && this.$refs.menu) {
              this.$refs.menu.open('/index/history')
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('menu', [
      'historyDataSet'
    ])
  }
}
