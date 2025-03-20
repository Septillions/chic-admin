import { request } from '@/plugin/axios/request'

export function getOssSts (query) {
  return request({
    url: '/common/getOssSts',
    method: 'get',
    params: query
  })
}
