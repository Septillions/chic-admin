<template>
  <container :is-back="false">
    <page-navi class="base-m" v-model="root"/>
  </container>
</template>

<script>
export default {
  name: 'setting-index',
  components: {
    PageNavi: () => import('@/components/navigation')
  },
  data () {
    return {
      root: '/setting'
    }
  }
}
</script>
