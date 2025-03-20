import { request } from '@/plugin/axios/request'

export function list (query) {
  return request({
    url: '/demo/list',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/demo/add',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/demo/update',
    method: 'put',
    data
  })
}

export function del (id) {
  return request({
    url: '/demo/delete',
    method: 'delete',
    params: { id }
  })
}
