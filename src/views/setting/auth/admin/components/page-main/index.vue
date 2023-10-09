<template>
  <div>
    <el-form :inline="true" size="small">

      <el-form-item v-if="auth.add">
        <el-button icon="el-icon-plus" :disabled="loading" @click="handleCreate">新增账号</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="currentTableData" :highlight-current-row="true" :row-class-name="tableRowClassName"
      @sort-change="sortChange">
      <el-table-column label="用户名" prop="username" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="手机号" prop="mobile" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="昵称" prop="nickname" min-width="200" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="状态" prop="status" align="center" width="100" sortable="custom">
        <template slot-scope="scope">
          <el-tag size="mini" :type="statusMap[scope.row.status].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'" @click.native="switchStatus(scope.$index)">
            {{ statusMap[scope.row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="auth.set" size="small" @click="handleUpdate(scope.$index)" type="text">编辑</el-button>

          <el-button v-if="auth.del && !scope.row.isSystem" size="small" @click="handleDelete(scope.$index)"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true"
      :close-on-click-modal="false" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item v-if="dialogStatus === 'create'" label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :clearable="true" />
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" :clearable="true" />
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" :rows="5" />
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'update'" label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" :clearable="true" />
        </el-form-item>

        <el-form-item label="角色">
          <el-tree class="tree-border" :data="roleOptions" show-checkbox ref="role" node-key="id" empty-text="加载中，请稍候"
            :props="defaultProps"></el-tree>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取消</el-button>

        <el-button v-if="dialogStatus === 'create'" type="primary" :loading="dialogLoading" @click="create"
          size="small">确定</el-button>

        <el-button v-else type="primary" :loading="dialogLoading" @click="update(form.index)" size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '../../api'

export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    }
  },
  data () {
    return {
      currentTableData: [],
      auth: {
        add: true,
        del: true,
        set: true,
        enable: true,
        disable: true
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑账号',
        create: '新增账号'
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        },
        2: {
          text: '...',
          type: 'info'
        }
      },
      form: {
        index: undefined,
        username: undefined,
        password: undefined,
        mobile: undefined,
        nickname: undefined,
        status: undefined,
        roleIdList: []
      },
      // 角色列表
      roleOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          {
            max: 10,
            message: '长度不能大于 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }, {
            min: 6,
            message: '长度不能小于 6 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            max: 20,
            message: '长度不能大于 20 个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            max: 10,
            message: '长度不能小于 10 个字符',
            trigger: 'blur'
          }
        ],
        status: [
          {
            type: 'enum',
            enum: [0, 1],
            message: '值的范围必须为 0 或 1',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    tableData: {
      handler (val) {
        this.currentTableData = val
      },
      immediate: true
    }
  },
  methods: {
    // 获取排序字段
    sortChange ({ column, prop, order }) {
      const sort = {
        orderType: undefined,
        orderField: undefined
      }

      if (column && order) {
        sort.orderType = order === 'ascending' ? 'ASC' : 'DESC'
        sort.orderField = prop
      }

      this.$emit('sort', sort)
    },
    // 返回表格行颜色
    tableRowClassName ({ row }) {
      if (row.isSystem) {
        return 'warning-row'
      }
      return ''
    },
    // 所有角色节点数据
    getRoleAllCheckedKeys () {
      // 目前被选中的角色节点
      const checkedKeys = this.$refs.role.getCheckedKeys()
      // 半选中的角色节点
      const halfCheckedKeys = this.$refs.role.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 弹出新建对话框
    handleCreate () {
      this.form = {
        index: undefined,
        username: '',
        password: '',
        mobile: '',
        nickname: '',
        status: 1
      }
      this.listRole()

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogStatus = 'create'
        this.dialogLoading = false
        this.dialogFormVisible = true
      })
    },
    // 弹出编辑对话框
    handleUpdate (index) {
      const data = this.currentTableData[index]
      this.form = {
        index: index,
        id: data.id,
        username: data.username,
        password: '',
        mobile: data.mobile,
        nickname: data.nickname,
        status: data.status
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.listRole().then(() => {
          this.listRoleIdByAdmin(data.id).then(roleIdList => {
            roleIdList.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.role.setChecked(v, true, false)
              })
            })
          })
        })

        this.dialogStatus = 'update'
        this.dialogLoading = false
        this.dialogFormVisible = true
      })
    },
    // 请求创建账号
    create () {
      this.form.roleIdList = this.getRoleAllCheckedKeys()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          api.add(this.form)
            .then(res => {
              this.dialogFormVisible = false
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 请求修改账号
    update (index) {
      this.form.roleIdList = this.getRoleAllCheckedKeys()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          api.update(this.form)
            .then(res => {
              this.dialogFormVisible = false
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 请求删除账号
    handleDelete (index) {
      this.$confirm('确定删除该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          api.del(this.currentTableData[index].id)
            .then(() => {
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 请求修改排序
    handleSort (index) {
      api.update({
        id: this.currentTableData[index].id,
        sort: this.currentTableData[index].sort
      })
    },
    // 请求修改状态值
    switchStatus (index) {
      const oldData = this.currentTableData[index]
      const newStatus = oldData.status ? 0 : 1

      // 禁用权限检测
      if (newStatus === 0 && !this.auth.disable) {
        return
      }

      // 启用权限检测
      if (newStatus === 1 && !this.auth.enable) {
        return
      }

      api.update({ id: oldData.id, status: newStatus })
        .then(() => {
          this.$emit('refresh')
          this.$message.success('操作成功')
        })
    },
    // 请求获取角色列表
    listRole () {
      return api.listRole().then(result => {
        this.roleOptions = result.data.items
      })
    },
    // 请求获取管理员角色列表
    listRoleIdByAdmin (adminId) {
      return api.listRoleByAdmin({ adminId }).then(result => {
        const roleList = result.data
        const roleIdList = roleList.map(role => role.id)
        this.form.roleIdList = roleIdList
        return roleIdList
      })
    }
  }
}
</script>

<style scoped>
.el-table>>>.warning-row {
  background: oldlace;
}

.el-table>>>.spacer-row {
  background: #FAFAFA;
}

.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius: 4px;
}
</style>
