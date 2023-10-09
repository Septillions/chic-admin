<template>
  <el-dropdown size="small" class="base-mr">
    <span class="btn-text">{{ info.name ? `您好 ${info.name}` : '未登录' }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="resetMenu" icon="el-icon-refresh">重载菜单</el-dropdown-item>
      <el-dropdown-item @click.native="clearHistory" icon="el-icon-time">清空历史</el-dropdown-item>
      <el-dropdown-item divided @click.native="handleCreate" icon="el-icon-key">修改密码</el-dropdown-item>
      <el-dropdown-item divided @click.native="logOff" icon="el-icon-switch-button">退出账号</el-dropdown-item>
    </el-dropdown-menu>
    <el-dialog title="修改密码" width="600px" :visible.sync="dialogVisible" :append-to-body="true"
      :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="dataForm" label-width="100px">
        <el-form-item label="原密码" prop="passwordOld">
          <el-input v-model="form.passwordOld" @keyup.enter.native="setPassword()" type="password" placeholder="原密码"
            :clearable="true" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="form.password" @keyup.enter.native="setPassword()" type="password" placeholder="新密码"
            :clearable="true" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="passwordConfirm">
          <el-input v-model="form.passwordConfirm" @keyup.enter.native="setPassword()" type="password" placeholder="确认新密码"
            :clearable="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false" size="small">取消</el-button>

        <el-button type="primary" :loading="dialogLoading" @click.native="setPassword" size="small">确定</el-button>
      </div>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import menu from '@/menu'
import { mapState, mapActions } from 'vuex'
import { resetPassword } from '@/api/auth/admin'
import { getMenuAuthList } from '@/api/auth/menu'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogLoading: false,
      form: {
        password: '',
        passwordConfirm: '',
        passwordOld: ''
      },
      rules: {
        password: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ],
        passwordConfirm: [
          {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ],
        passwordOld: [
          {
            required: true,
            message: '原密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('account', [
      'logout'
    ]),
    ...mapActions('menu', [
      'historyClear'
    ]),
    /**
     * 重新载入菜单
     */
    async resetMenu () {
      const result = await getMenuAuthList()
      await this.$store.dispatch('db/set', {
        dbName: 'database',
        path: '$menu.sourceData',
        value: result.data || [],
        user: true
      })
      // 重新初始化菜单数据
      menu.install(this.$store, result.data || [])
      /**
       * 清空页面缓存设置，将导致页面上的缓存数据丢失，但会实时载入权限
       * 如果将其注释，那么已打开页面需要关闭之后，在下次打开页面时生效。
       * 请根据实际需要而自行选择
       */
      this.$store.commit('page/keepAliveClean')
      await this.$router.replace('/refresh')
      this.$message.success('菜单(包括权限)已重新载入')
    },
    /**
     * 清除历史
     */
    async clearHistory () {
      await this.historyClear()
      if (this.$route.path === '/index') {
        await this.$router.replace('/refresh')
      }
      this.$message.success('左侧访问历史栏已清空')
    },
    /**
     * 初始化成员变量
     */
    resetTemp () {
      this.dialogLoading = false
      this.form = { password: '', passwordConfirm: '', passwordOld: '' }
    },
    /**
     * 创建修改密码对话框
     */
    handleCreate () {
      this.resetTemp()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    /**
     * 修改密码
     */
    setPassword () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const param = {
            password: this.form.password,
            passwordOld: this.form.passwordOld
          }
          resetPassword(param).then(() => {
            this.dialogVisible = false
            this.$message.success('密码修改成功')
          }).catch(() => {
            this.dialogLoading = false
          })
        }
      })
    },
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
