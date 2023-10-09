<template>
  <container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :tree-data="tree"
      @refresh="handleRefresh"
      ref="main"/>
  </container>
</template>

<script>
import utils from '@/utils'
import * as api from './api'

export default {
  name: 'setting-auth-menu',
  components: {
    PageHeader: () => import('./components/page-header'),
    PageMain: () => import('./components/page-main')
  },
  data () {
    return {
      tree: [],
      loading: false
    }
  },
  mounted () {
    this.handleSubmit()
  },
  methods: {
    // 重新载入页面
    handleRefresh () {
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 提交查询请求
    handleSubmit (form) {
      this.loading = true
      const level = form ? form.level : 0
      api.list(form).then(result => {
        this.tree = utils.formatDataToTree(result.data.items, 'id', 'parentId', level)
        if (this.$refs.main) {
          this.$refs.main.filterText = ''
          this.$refs.main.resetForm()
          this.$refs.main.resetElements()
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
