<template>
  <div class="layout-header-aside-group" :style="styleLayoutMainGroup" :class="{ grayMode: grayActive }">
    <!-- 半透明遮罩 -->
    <div class="layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div class="theme-header" :style="{ opacity: this.searchActive ? 0.5 : 1 }" flex-box="0" flex>
        <router-link to="/index" :class="{ 'logo-group': true, 'logo-transition': asideTransition }"
          :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth }" flex-box="0">
          <img v-if="asideCollapse" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">
          <img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">
        </router-link>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <i :class="`el-icon-s-${asideCollapse ? 'unfold' : 'fold'}`" />
        </div>
        <menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <header-search @click="handleSearchClick" />
          <header-log />
          <header-fullscreen />
          <header-size />
          <header-theme />
          <header-color />
          <header-user />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div flex-box="0" ref="aside"
          :class="{ 'theme-container-aside': true, 'theme-container-transition': asideTransition }" :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }">
          <menu-side />
        </div>
        <!-- 主体 -->
        <div class="theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-if="searchActive" class="theme-container-main-layer" flex>
              <panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="theme-container-main-header" flex-box="0">
                <tabs />
              </div>
              <!-- 页面 -->
              <div class="theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view :key="routerViewKey" />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuSide from './components/menu-side'
import MenuHeader from './components/menu-header'
import Tabs from './components/tabs'
import HeaderFullscreen from './components/header-fullscreen'
import HeaderSearch from './components/header-search'
import HeaderTheme from './components/header-theme'
import HeaderSize from './components/header-size'
import HeaderUser from './components/header-user'
import HeaderLog from './components/header-log'
import HeaderColor from './components/header-color'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    MenuSide,
    MenuHeader,
    Tabs,
    HeaderFullscreen,
    HeaderSearch,
    HeaderTheme,
    HeaderSize,
    HeaderUser,
    HeaderLog,
    HeaderColor
  },
  data () {
    return {
      // [顶栏项目名] 项目名称
      headerTitle: process.env.VUE_APP_TITLE,
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  computed: {
    ...mapState({
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      asideTransition: state => state.menu.asideTransition
    }),
    ...mapGetters({
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 用来实现带参路由的缓存
     */
    routerViewKey () {
      // 默认情况下 key 类似 __transition-n-/foo
      // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.path}`] || ''
      return `${stamp ? `__stamp-${stamp}-` : ''}${this.$route.path}`
    },
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return this.themeActiveSetting.backgroundImage
        ? { backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')` }
        : {}
    }
  },
  methods: {
    ...mapActions('menu', [
      'asideCollapseToggle'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
</style>
