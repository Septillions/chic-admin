import request from '@/plugin/axios/request'

export function list (query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/admin/update',
    method: 'put',
    data
  })
}

export function del (data) {
  return request({
    url: '/admin/delete',
    method: 'delete',
    params: data
  })
}

export function listRole (query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function listRoleByAdmin (query) {
  return request({
    url: '/role/listByAdmin',
    method: 'get',
    params: query
  })
}
