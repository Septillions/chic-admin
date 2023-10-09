import request from '@/plugin/axios/request'

export function list (query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/role/update',
    method: 'put',
    data
  })
}

export function del (data) {
  return request({
    url: '/role/delete',
    method: 'delete',
    params: data
  })
}

export function listMenu (query) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: query
  })
}

export function listMenuByRole (query) {
  return request({
    url: '/menu/listByRole',
    method: 'get',
    params: query
  })
}
