<template>
  <el-dropdown placement="bottom" size="small" @command="handleChange">
    <el-button class="base-mr btn-text can-hover" type="text">
      <icon name="low-vision" style="font-size: 18px;" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
        <icon :name="iconName(item.value)" class="base-mr-5" />{{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'header-size',
  data () {
    return {
      options: [
        { label: '默认', value: 'default' },
        { label: '大', value: 'medium' },
        { label: '中', value: 'small' },
        { label: '小', value: 'mini' }
      ]
    }
  },
  computed: {
    ...mapState('size', [
      'value'
    ])
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'page/keepAliveClean'
    }),
    ...mapActions({
      sizeSet: 'size/set'
    }),
    handleChange (value) {
      this.sizeSet(value)
      this.$notify({
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: '已更新页面内 <b>组件</b> 的 <b>默认尺寸</b><br/>例如按钮大小，<b>非字号</b>',
        type: 'success'
      })
    },
    iconName (name) {
      return name === this.value ? 'dot-circle-o' : 'circle-o'
    }
  }
}
</script>
