<template>
    <container :class="{ 'page-compact': crud.pageOptions.compact }">
        <d2-crud ref="d2Crud" v-bind="_crudProps" v-on="_crudListeners">
            <div slot="header">
                <!-- 搜索栏 -->
                <crud-search ref="search" :options="crud.searchOptions" @submit="handleSearch" />
                <!-- 顶部按钮 -->
                <el-button-group>
                    <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus" /> 新增</el-button>
                </el-button-group>
                <!-- 右上工具栏 -->
                <crud-toolbar :columns="null" v-bind="_crudToolbarProps" v-on="_crudToolbarListeners" />
            </div>
        </d2-crud>
    </container>
</template>

<script>
import { d2CrudPlus as D2CrudPlus } from 'd2-crud-plus'
import { crudOptions } from './crud'
import * as api from './api'

export default {
  name: 'template',
  mixins: [D2CrudPlus.crud],
  methods: {
    getCrudOptions () { return crudOptions(this) },
    pageRequest (query) { return api.list(query) },
    addRequest (row) { return api.add(row) },
    updateRequest (row) { return api.update(row) },
    delRequest (row) { return api.del(row.id) }
  }
}
</script>
