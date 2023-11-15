import request from '@/utils/request'

export function getEntrustApplyCraftInfo(account) {
  return request({
    url: '/craft/get/entrust/account?account=' + account,
    method: 'get'
  })
}

export function addEntrustApply(data) {
  return request({
    url: '/entrust/add',
    method: 'post',
    data
  })
}

export function getEntrustList(account) {
  return request({
    url: '/entrust/get/list?account=' + account,
    method: 'get'
  })
}

export function getEntrustInfo(appkey) {
  return request({
    url: '/entrust/get/info?appkey=' + appkey,
    method: 'get'
  })
}

export function updateEntrust(data) {
  return request({
    url: '/entrust/update',
    method: 'post',
    data
  })
}

export function delEntrust(appkey) {
  return request({
    url: '/entrust/del?appkey=' + appkey,
    method: 'get'
  })
}

export function getGoodsList(account) {
  return request({
    url: '/space/get/list?account=' + account,
    method: 'get'
  })
}
