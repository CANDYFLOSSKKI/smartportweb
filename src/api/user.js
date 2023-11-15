import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: { token }
  })
}

export function signup(data) {
  return request({
    url: '/user/signup',
    method: 'post',
    data
  })
}

export function confirm(data) {
  return request({
    url: '/employee/confirm',
    method: 'post',
    data
  })
}

export function updateBasicInfo(data) {
  return request({
    url: '/user/update/basic',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/update/pass',
    method: 'post',
    data
  })
}

export function sendVerifyEmail(data) {
  return request({
    url: '/user/send/email',
    method: 'post',
    data
  })
}

export function bindEmail(data) {
  return request({
    url: '/user/bind/email',
    method: 'post',
    data
  })
}

export function confirmEmail(data) {
  return request({
    url: '/user/confirm/email',
    method: 'post',
    data
  })
}

export function delEmail(data) {
  return request({
    url: '/user/del/email',
    method: 'post',
    data
  })
}

export function bindLicense(data) {
  return request({
    url: '/license/add',
    method: 'post',
    data
  })
}

export function updateLicense(data) {
  return request({
    url: '/license/update',
    method: 'post',
    data
  })
}

export function getLicense(account) {
  return request({
    url: '/license/get/account?account=' + account,
    method: 'get'
  })
}

export function delLicense(account) {
  return request({
    url: '/license/del?account=' + account,
    method: 'get'
  })
}

export function searchUser(account) {
  return request({
    url: '/user/search?account=' + account,
    method: 'get'
  })
}

export function getLogFullBundle() {
  return request({
    url: '/log/get',
    method: 'get'
  })
}
