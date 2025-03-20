import Vue from 'vue'
import D2CrudX from 'd2-crud-x'
import { d2CrudPlus as D2CrudPlus } from 'd2-crud-plus'
import { D2pAreaSelector, D2pFileUploader, D2pIconSelector, D2pTreeSelector, D2pFullEditor } from 'd2p-extends'
import { request } from '@/plugin/axios/request'
import lodash from 'lodash'

// https://greper.github.io/d2-crud-plus/
Vue.use(D2CrudX, { name: 'd2-crud' })
// 安装扩展插件
Vue.use(D2pTreeSelector)
Vue.use(D2pAreaSelector)
Vue.use(D2pIconSelector)
Vue.use(D2pFullEditor)
Vue.use(D2pFileUploader)

Vue.use(D2CrudPlus, {
  // 关闭控制台提示
  starTip: false,
  /**
   * 获取数据字典的请求方法
   * 可在dict中配置getData方法覆盖此全局方法
   */
  getRemoteDictFunc (url, dict) {
    return request({
      url: url,
      method: 'get'
    }).then(result => {
      return result.data
    })
  },
  /**
   * d2-crud 全局配置
   * 每个页面的crudOptions会以全局配置为基础进行覆盖
   */
  commonOption () {
    return {
      format: {
        // 分页查询接口返回的数据结构配置
        page: {
          // 请求参数
          request: {
            // 当前页码
            current: 'pageIndex',
            // 每页条数
            size: 'pageSize',
            // 排序字段
            orderProp: 'sortField',
            // 排序方式
            // orderAsc: 'orderAsc',
            orderAsc (query, value) {
              if (value) {
                query.sortType = 'ASC'
              } else {
                query.sortType = 'DESC'
              }
            }
          },
          // 响应数据
          response: {
            // 当前页码 result.data.pageIndex
            current: 'pageIndex',
            // 每页条数 result.data.pageSize
            size: 'pageSize',
            // 总记录数 result.data.total
            total: 'total',
            // 列表数组 result.data.items
            records: 'items'
          }
        }
      },
      /**
       * d2-crud 配置
       * 支持el-table的配置参数
       */
      options: {
        // 是否带有纵向边框
        border: true,
        // 是否为斑马纹
        stripe: false,
        // 是否要高亮当前行
        highlightCurrentRow: true,
        // el-table 高度
        height: '100%',
        rowKey: function (row) {
          return lodash.uniqueId('key_')
        }
      },
      /**
       * 页面配置
       */
      pageOptions: {
        // 是否紧凑型页面
        compact: false
      },
      /**
       * 表单配置
       * 支持el-dialog的配置
       * 支持el-form的配置
       * 支持el-drawer的配置
       */
      formOptions: {
        // 默认 dialog 对话框模式，drawer 抽屉模式
        type: 'dialog',
        // 抽屉模式的宽度
        size: '50%',
        // 默认表单字段所占宽度
        defaultSpan: 12,
        // 全屏显示，传null则隐藏全屏按钮，抽屉模式请隐藏
        fullscreen: false,
        // 是否支持表单对话框拖拽，抽屉模式请关闭
        draggable: false,
        // 提交修改表单时，将undefinded的数据修改为空字符串''，可以解决无法清空字段的问题
        nullToBlankStr: true,
        // 有修改时是否需要保存提醒，也可以传入一个方法，自定义确认对话框，()=> return vm.$confirm({})
        saveRemind: true
      },
      viewOptions: {
        // 开启查看按钮
        disabled: false,
        // 查看时使用哪种组件展示 form=使用表单组件,row=使用行展示组件
        componentType: 'form'
      },
      /**
       * 搜索配置
       */
      searchOptions: {
        // 点击重置后是否立即查询
        searchAfterReset: true,
        // 搜索改变后是否自动查询
        debounce: false
      },
      /**
       * 分页配置
       */
      pagination: {
        // 每页显示个数选择器的选项设置
        pageSizes: [5, 10, 20, 50, 100]
      },
      /**
       * 行操作
       */
      rowHandle: {
        align: 'center',
        view: {
          // 小型化按钮
          thin: false,
          // 按钮尺寸 medium / small / mini
          size: 'mini',
          // 按钮文字
          text: '查看',
          // 按钮类型 primary / success / warning / danger / info / text
          type: 'info',
          // 按钮图标
          icon: '',
          // 是否显示圆形按钮
          circle: false
        },
        edit: {
          thin: false,
          size: 'mini',
          text: '编辑',
          type: 'primary',
          icon: '',
          circle: false
        },
        remove: {
          thin: false,
          size: 'mini',
          text: '删除',
          type: 'danger',
          icon: '',
          circle: false
        }
      }
    }
  }
})

// 修改官方字段类型
const selectType = D2CrudPlus.util.columnResolve.getType('select')
selectType.component.props.color = 'auto'
selectType.component.props.autoColors = ['primary', 'success', 'warning', 'danger', 'info']
selectType.component.props.autoEffects = ['dark', 'light', 'plain']

const radioType = D2CrudPlus.util.columnResolve.getType('radio')
radioType.component.props.color = 'auto'
radioType.component.props.autoColors = ['info', 'warning', 'danger', 'primary', 'success']
radioType.component.props.autoEffects = ['plain', 'light', 'dark']
