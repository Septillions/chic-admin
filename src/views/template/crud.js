export const crudOptions = (vm) => {
  return {
    rowHandle: {
      width: 120,
      view: false,
      edit: false,
      remove: false,
      custom: [{
        size: 'mini',
        text: '查看',
        emit: 'view'
      }, {
        size: 'mini',
        text: '编辑',
        type: 'primary',
        emit: 'edit'
      }]
    },
    columns: [
      {
        title: 'ID',
        key: 'id',
        align: 'center',
        minWidth: 70,
        sortable: 'custom',
        show: false,
        addForm: { component: { show: false } },
        editForm: { component: { show: false } }
      }, {
        title: '创建时间',
        key: 'createTime',
        type: 'datetime',
        sortable: 'custom',
        align: 'center',
        minWidth: 140,
        addForm: { component: { show: false } },
        editForm: { component: { show: false } }
      }, {
        title: '更新时间',
        key: 'updateTime',
        type: 'datetime',
        sortable: 'custom',
        align: 'center',
        minWidth: 140,
        show: false,
        addForm: { component: { show: false } },
        editForm: { component: { show: false } }
      }
    ]
  }
}
