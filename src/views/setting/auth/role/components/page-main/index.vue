<template>
  <div>
    <el-form :inline="true" size="small">

      <el-form-item v-if="auth.add">
        <el-button icon="el-icon-plus" :disabled="loading" @click="handleCreate">新增角色</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="currentTableData" :highlight-current-row="true" :row-class-name="tableRowClassName"
      @sort-change="sortChange">
      <el-table-column label="角色名称" prop="name" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="角色代码" prop="code" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="描述" prop="description" min-width="200" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="所属类型">
        <template slot-scope="scope">
          {{ scope.row.isSystem ? '系统保留' : '用户添加' }}
        </template>
      </el-table-column>

      <el-table-column label="排序" prop="sort" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-input-number v-if="auth.sort" size="mini" v-model="scope.row.sort" @change="handleSort(scope.$index)"
            style="width: 88px;" controls-position="right" :min="0" :max="500">
          </el-input-number>
          <span v-else>
            {{ scope.row.sort }}
          </span>
        </template>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" :clearable="true" />
        </el-form-item>

        <el-form-item label="角色代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色代码" :clearable="true" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" type="textarea" :rows="5" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="500" style="width: 120px;" />
        </el-form-item>

        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
          <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menu" node-key="id" empty-text="加载中，请稍候"
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
import utils from '@/utils'

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
        disable: true,
        sort: true
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新增角色'
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
        name: undefined,
        code: undefined,
        description: undefined,
        sort: undefined,
        status: undefined,
        menuIdList: []
      },
      // 菜单列表
      menuOptions: [],
      menuExpand: false,
      menuNodeAll: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          },
          {
            max: 10,
            message: '长度不能大于 10 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '角色代码不能为空',
            trigger: 'blur'
          },
          {
            max: 10,
            message: '长度不能大于 10 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            max: 500,
            message: '长度不能大于 500 个字符',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            type: 'number',
            message: '必须为数字值',
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
    // 所有菜单节点数据
    getMenuAllCheckedKeys () {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 弹出新建对话框
    handleCreate () {
      this.form = {
        index: undefined,
        name: '',
        code: '',
        description: '',
        sort: 50,
        status: 1
      }
      this.menuExpand = false
      this.menuNodeAll = false

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        this.listMenu()

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
        name: data.name,
        code: data.code,
        description: data.description,
        sort: data.sort,
        status: data.status
      }
      this.menuExpand = false
      this.menuNodeAll = false

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.listMenu().then(() => {
          this.listMenuIdByRole(data.id).then(menuIdList => {
            menuIdList.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })

        this.dialogStatus = 'update'
        this.dialogLoading = false
        this.dialogFormVisible = true
      })
    },
    // 请求创建角色
    create () {
      this.form.menuIdList = this.getMenuAllCheckedKeys()
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
    // 请求修改角色
    update (index) {
      this.form.menuIdList = this.getMenuAllCheckedKeys()
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
    // 请求删除角色
    handleDelete (index) {
      const param = { id: this.currentTableData[index].id }
      this.$confirm('删除后对应的“权限规则”也将被删除，确定执行该操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          api.del(param)
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
    // 请求获取菜单列表
    listMenu () {
      return api.listMenu().then(result => {
        const menuList = result.data.items
        this.menuOptions = utils.formatDataToTree(menuList)
      })
    },
    // 请求获取角色菜单列表
    listMenuIdByRole (roleId) {
      return api.listMenuByRole({ roleId }).then(result => {
        const menuList = result.data
        const menuIdList = menuList.map(menu => menu.id)
        this.form.menuIdList = menuIdList
        return menuIdList
      })
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand (value) {
      const treeList = this.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll (value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
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
