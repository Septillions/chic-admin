import request from '@/plugin/axios/request'

export function getMenuAuthList () {
  return request({
    url: '/auth/menu/list',
    method: 'get'
  })
}
