<template>
  <div>
    <el-form
      :inline="true"
      size="small"
      @submit.native.prevent>
      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate('create')">新增顶层菜单</el-button>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button
            icon="el-icon-circle-plus-outline"
            :disabled="loading"
            @click="checkedNodes(true)">展开</el-button>

          <el-button
            icon="el-icon-remove-outline"
            :disabled="loading"
            @click="checkedNodes(false)">收起</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item label="过滤">
        <el-input
          v-model="filterText"
          :disabled="loading"
          placeholder="输入关键词进行过滤"
          prefix-icon="el-icon-search"
          style="width: 240px;"
          :clearable="true">
        </el-input>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="10">
        <el-tree
          v-if="hackReset"
          class="tree-scroll"
          node-key="id"
          :data="treeData"
          :props="treeProps"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :default-expand-all="isExpandAll"
          :default-expanded-keys="expanded"
          :allow-drag="allowDrag"
          :draggable="true"
          @node-click="handleNodeClick"
          @node-drop="handleDrop"
          ref="tree">
          <span class="custom-tree-node action" slot-scope="{node, data}">
            <span class="brother-showing" :class="{'status-tree': !data.status}">
              <i v-if="auth.move" class="el-icon-sort move-tree base-mr-5"/>
              <icon v-if="data.icon" :name="data.icon" />
              <i v-else-if="data.children" :class="`el-icon-${node.expanded ? 'folder-opened' : 'folder'}`"/>
              <i v-else class="el-icon-document"/>
              {{node.label}}
            </span>

            <span class="active">
              <el-button
                v-if="auth.add"
                type="text"
                size="mini"
                @click.stop="handleAppend(data.id)">
                新增
              </el-button>

              <el-button
                v-if="auth.status"
                type="text"
                size="mini"
                @click.stop="enable(data.id, data.status)">
                {{data.status ? '禁用' : '启用'}}
              </el-button>

              <el-button
                v-if="auth.del"
                type="text"
                size="mini"
                @click.stop="remove(data.id)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>

      <el-col :span="14">
        <el-card
          v-show="auth.add || auth.set"
          class="box-card"
          shadow="never">

          <div slot="header">
            <span>{{textMap[formStatus]}}</span>
            <el-button
              v-if="formStatus === 'create' && auth.add"
              type="text"
              :loading="formLoading"
              style="float: right; padding: 3px 0;"
              @click="create">确定</el-button>

            <el-button
              v-else-if="formStatus === 'update' && auth.set"
              type="text"
              :loading="formLoading"
              style="float: right; padding: 3px 0;"
              @click="update">修改</el-button>
          </div>

          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="80px">
            <el-form-item
              label="上级菜单"
              prop="parentId">
              <el-cascader
                v-model="form.parentId"
                placeholder="不选择表示顶层菜单 试试搜索：首页"
                :key="form.id"
                :options="treeData"
                :props="cascaderProps"
                style="width: 100%;"
                filterable
                clearable>
              </el-cascader>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="菜单名称"
                  prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入菜单名称"
                    :clearable="true"/>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="权限代码"
                  prop="code">
                  <el-input
                    v-model="form.code"
                    placeholder="可输入权限代码"
                    :clearable="true"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="图标"
                  prop="icon">
                  <icon-select
                    v-model="form.icon"
                    :user-input="true"
                    placeholder="可选择图标"/>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="排序"
                  prop="sort">
                  <el-input-number
                    v-model="form.sort"
                    :min="0"
                    :max="500"
                    style="width: 120px;"
                    controls-position="right"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="类型"
                  prop="type">
                  <el-radio-group v-model="form.type">
                    <el-radio :label="1">菜单</el-radio>
                    <el-radio :label="2">按钮</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="状态"
                  prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">启用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              label="组件"
              prop="url">
              <el-input
                v-model="form.component"
                placeholder="可输入组件路径"
                :clearable="true"/>
            </el-form-item>

            <el-form-item
              label="URL"
              prop="url">
              <el-input
                v-model="form.url"
                placeholder="可输入链接地址"
                :clearable="true"/>
            </el-form-item>

            <el-form-item
              label="备注"
              prop="description">
              <el-input
                v-model="form.description"
                placeholder="可输入菜单备注"
                type="textarea"
                :rows="3"/>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from '../../api'

export default {
  props: {
    treeData: {
      default: () => []
    },
    loading: {
      default: false
    }
  },
  data () {
    return {
      hackReset: true,
      isExpandAll: false,
      expanded: [],
      filterText: '',
      treeProps: {
        label: 'name',
        children: 'children'
      },
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
        emitPath: false
      },
      auth: {
        add: true,
        del: true,
        set: true,
        status: true,
        move: true
      },
      form: {
        parentId: undefined,
        name: undefined,
        code: undefined,
        icon: undefined,
        sort: 1,
        type: 1,
        status: undefined,
        component: undefined,
        url: undefined,
        description: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '菜单名称不能为空',
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
            max: 50,
            message: '长度不能大于 50 个字符',
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
        type: [
          {
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            max: 50,
            message: '组件路径不能大于 50 个字符',
            trigger: 'blur'
          }
        ],
        url: [
          {
            max: 500,
            message: '长度不能大于 500 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            max: 500,
            message: '长度不能大于 500 个字符',
            trigger: 'blur'
          }
        ]
      },
      formStatus: 'create',
      formLoading: false,
      textMap: {
        create: '新增菜单',
        update: '编辑菜单'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤菜单
    filterNode (value, data) {
      if (!value) { return true }
      return data.name.indexOf(value) !== -1
    },
    // 展开或收起节点
    checkedNodes (isExpand) {
      this.filterText = ''
      this.expanded = []
      this.hackReset = false
      this.$nextTick(() => {
        this.isExpandAll = isExpand
        this.hackReset = true
      })
    },
    // 重置表单
    resetForm () {
      this.form = {
        parentId: 0,
        name: '',
        code: '',
        icon: '',
        sort: 1,
        type: 1,
        status: 1,
        component: '',
        url: '',
        description: ''
      }
    },
    // 重置元素
    resetElements (val = 'create') {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.formStatus = val
      this.formLoading = false
    },
    // 点击树节点事件
    handleNodeClick (data) {
      if (!this.auth.add && !this.auth.set) {
        return
      }
      this.resetForm()
      this.resetElements('update')
      this.form = {
        ...data
      }
    },
    // 新增菜单表单初始化
    handleCreate (status) {
      this.resetForm()
      this.resetElements(status)
      if (this.$refs.tree.getCurrentKey()) {
        this.$refs.tree.setCurrentKey(null)
      }
    },
    // 追加菜单
    handleAppend (key) {
      this.handleCreate('create')
      this.$refs.tree.setCurrentKey(key)
      this.form.parentId = key
    },
    // 新增菜单
    create () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true
          api.add({
            ...this.form
          })
            .then(res => {
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.formLoading = false
            })
        }
      })
    },
    // 更新菜单
    update () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true
          api.update({
            ...this.form
          })
            .then(res => {
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.formLoading = false
            })
        }
      })
    },
    // 删除菜单
    remove (key) {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          api.del({ id: key })
            .then(() => {
              this.$refs.tree.remove(this.$refs.tree.getNode(key))
              this.handleCreate('create')
              this.$message.success('操作成功')
            })
        })
    },
    // 启用与禁用的切换
    enable (key, val) {
      this.$confirm('状态的切换会影响上下级菜单，是否确认操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          val ? val = 0 : val = 1
          api.update({ id: key, status: val })
            .then(() => {
              if (!this.isExpandAll) {
                this.expanded = [this.$refs.tree.getNode(key).data.parentId || key]
              }
              this.$emit('refresh')
              this.$message.success('操作成功')
            })
        })
    },
    /**
     * 拖拽成功后操作
     * @param draggingNode  被拖拽节点对应的 Node
     * @param dropNode      结束拖拽时最后进入的节点
     * @param dropType      被拖拽节点的放置位置（before、after、inner）
     * @param ev            event
     */
    handleDrop (draggingNode, dropNode, dropType, ev) {
      // 获取原始数据
      const setMenu = {
        id: draggingNode.data.id,
        parentId: draggingNode.data.parentId
      }
      // 处理插入到其他菜单中
      if (dropType === 'inner') {
        setMenu.parentId = dropNode.key
        dropNode.childNodes.forEach((value, index) => {
          value.data.sort = index + 1
          if (draggingNode.data.id === value.data.id) {
            setMenu.sort = index + 1
          }
        })
      } else {
        setMenu.parentId = dropNode.data.parentId
        dropNode.parent.childNodes.forEach((value, index) => {
          value.data.sort = index + 1
          if (draggingNode.data.id === value.data.id) {
            setMenu.sort = index + 1
          }
        })
      }
      api.update(setMenu)
        .catch(res => {
          this.$emit('refresh')
        })
    },
    // 判断节点是否可移动
    allowDrag () {
      return this.auth.move
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-scroll {
  max-height: 615px;
  overflow: auto;
  padding-bottom: 1px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.brother-showing {
  i {
    width: 16px;
  }

  .iconfont {
    font-size: 16px;
    vertical-align: baseline;
  }
}

.active {
  display: none;
}

.action:hover .active {
  display: block;
}

.move-tree {
  color: $color-text-placehoder;
  cursor: move;
}

.status-tree {
  color: $color-text-placehoder;
  text-decoration: line-through
}

.box-card {
  border-radius: 0;
  border: 1px solid $color-border-1;
}
</style>
