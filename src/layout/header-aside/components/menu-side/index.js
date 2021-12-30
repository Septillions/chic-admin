import { mapState } from 'vuex'
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
          collapse={ this.asideCollapse }
          collapseTransition={ this.asideTransition }
          uniqueOpened={ true }
          defaultActive={ this.$route.fullPath }
          ref="menu"
          onSelect={ this.handleMenuSelect }>
          { this.aside.map(menu => createMenu.call(this, h, menu)) }
        </el-menu>
        {
          this.aside.length === 0 && !this.asideCollapse
            ? <div class="layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
              <icon name="inbox"/>
              <span>没有侧栏菜单</span>
            </div>
            : null
        }
      </scrollbar>
    </div>
  },
  computed: {
    ...mapState('menu', [
      'aside',
      'asideCollapse',
      'asideTransition'
    ])
  }
}
