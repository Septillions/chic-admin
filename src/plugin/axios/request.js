import { Message } from 'element-ui'
import axios from 'axios'
import { get, isEmpty, merge } from 'lodash'
import qs from 'qs'
import utils from '@/utils'
import store from '@/store'

/**
 * @description 创建一个错误
 * @param {String} msg 错误信息
 */
function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

/**
 * @description 记录错误信息
 * @param {Error} error 错误对象
 */
function errorLog (error) {
  // 添加到日志
  store.dispatch('log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    utils.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => config,
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      // http 状态码 200 情况
      // 根据 前后端约定的 response.data.code 判断接口是否请求成功
      // 例如 接口返回数据为
      // {
      //   code: 0,
      //   msg: 'ok',
      //   data: {
      //     items: [],
      //     total: 0
      //   }
      // }
      // 此时
      // response.data.code :
      // 0
      // response.data.msg :
      // 'ok'
      // response.data.data : (在调用接口)
      // {
      //   items: [],
      //   total: 0
      // }
      // 默认约定 code 为 0 时代表成功
      // 你也可以不使用这种方法，改为在下面的 http 错误拦截器里做处理
      const result = response.data
      const { code, msg } = result
      // 没有 code 视为非项目接口不作处理
      if (code === undefined) {
        return result
      }
      switch (code) {
        case 0:
          return result
        default:
          errorCreate(msg)
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      errorLog(error)
      throw error
    }
  )
  return service
}

function stringify (data) {
  return qs.stringify(data, { allowDots: true, encode: false })
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest (service) {
  return function (config) {
    const token = utils.cookies.get('token')
    const configDefault = {
      headers: {
        Authorization: token,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 5000,
      baseURL: process.env.VUE_APP_API,
      data: {}
    }
    const option = merge(configDefault, config)
    // 处理 get 请求的参数
    // 请根据实际需要修改
    if (!isEmpty(option.params)) {
      option.url = option.url + '?' + stringify(option.params)
      option.params = {}
    }
    // 当需要以 form 形式发送时 处理发送的数据
    // 请根据实际需要修改
    if (!isEmpty(option.data) && option.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      option.data = stringify(option.data)
    }
    return service(option)
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequest(service)

export default request
