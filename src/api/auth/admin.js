import request from '@/plugin/axios/request'

export function SYS_ADMIN_LOGIN (data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function SYS_ADMIN_CAPTCHA () {
  return request({
    url: '/auth/captcha',
    method: 'post'
  })
}
