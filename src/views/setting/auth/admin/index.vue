<template>
  <container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      @refresh="handleRefresh"
      @sort="handleSort"/>
  </container>
</template>

<script>
import * as api from './api'

export default {
  name: 'setting-auth-admin',
  components: {
    PageHeader: () => import('./components/page-header'),
    PageMain: () => import('./components/page-main')
  },
  data () {
    return {
      table: [],
      loading: false,
      order: {
        orderType: undefined,
        orderField: undefined
      }
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
      api.list({
        ...form,
        ...this.order
      })
        .then(result => {
          this.table = result.data.items || []
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 排序刷新
    handleSort (val) {
      this.order = val
      this.handleRefresh()
    }
  }
}
</script>
