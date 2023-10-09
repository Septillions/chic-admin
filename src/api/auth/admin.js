import request from '@/plugin/axios/request'

export function authLogin (data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function authCaptcha () {
  return request({
    url: '/auth/captcha',
    method: 'post'
  })
}

export function resetPassword (data) {
  return request({
    url: '/auth/resetPassword',
    method: 'post',
    data
  })
}
