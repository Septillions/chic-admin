import request from '@/plugin/axios/request'

export function list (query) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/menu/update',
    method: 'put',
    data
  })
}

export function del (data) {
  return request({
    url: '/menu/delete',
    method: 'delete',
    params: data
  })
}
