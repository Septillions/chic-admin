import Vue from 'vue'

import Container from './container'
import ContainerFrame from './container-frame'

// 注意 有些组件使用异步加载会有影响
Vue.component('container', Container)
Vue.component('container-frame', ContainerFrame)
Vue.component('count-up', () => import('./count-up'))
Vue.component('icon', () => import('./icon'))
Vue.component('icon-svg', () => import('./icon-svg/index.vue'))
Vue.component('icon-select', () => import('./icon-select/index.vue'))
Vue.component('icon-svg-select', () => import('./icon-svg-select/index.vue'))
Vue.component('scrollbar', () => import('./scrollbar'))
Vue.component('file-upload', () => import('./file-upload'))
