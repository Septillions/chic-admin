import utils from '@/utils'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state state
     */
    versionShow () {
      utils.log.capsule(`${process.env.VUE_APP_TITLE}`, `v${process.env.VUE_APP_VERSION}`)
    }
  }
}
