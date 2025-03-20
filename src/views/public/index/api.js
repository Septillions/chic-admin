import { request } from '@/plugin/axios/request'
export function home (query) {
  return request({
    url: '/statistics/home',
    method: 'get',
    params: query
  })
}
