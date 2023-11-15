import request from '@/utils/request'

export function confirm(appkey) {
  return request({
    url: '/approval/confirm?appkey=' + appkey,
    method: 'get'
  })
}

export function getKeyList(key) {
  return request({
    url: '/approval/get/key?key=' + key,
    method: 'get'
  })
}

export function getFreeList() {
  return request({
    url: '/approval/get/free',
    method: 'get'
  })
}

export function getReserveList(account) {
  return request({
    url: '/approval/get/reserved?account=' + account,
    method: 'get'
  })
}

export function getLogList(account) {
  return request({
    url: '/approval/get/log?account=' + account,
    method: 'get'
  })
}

export function reserveOne(data) {
  return request({
    url: '/approval/reserve',
    method: 'post',
    data
  })
}

export function reserveReset(data) {
  return request({
    url: '/approval/reserve/reset',
    method: 'post',
    data
  })
}

export function dealOne(data) {
  return request({
    url: '/approval/deal',
    method: 'post',
    data
  })
}

export function getLicense(appkey) {
  return request({
    url: '/approval/get/license?appkey=' + appkey,
    method: 'get'
  })
}

export function getLicenseLog(appkey) {
  return request({
    url: '/approval/get/license/log?appkey=' + appkey,
    method: 'get'
  })
}

export function getEntrust(appkey) {
  return request({
    url: '/approval/get/entrust?appkey=' + appkey,
    method: 'get'
  })
}

export function getEntrustLog(appkey) {
  return request({
    url: '/approval/get/entrust/log?appkey=' + appkey,
    method: 'get'
  })
}

export function getRestoreList() {
  return request({
    url: '/restore/get/list',
    method: 'get'
  })
}

export function dealEntrustApproval(data) {
  return request({
    url: '/approval/deal/entrust',
    method: 'post',
    data
  })
}

export function getOrder(appkey) {
  return request({
    url: '/approval/get/order?appkey=' + appkey,
    method: 'get'
  })
}

export function getOrderLog(appkey) {
  return request({
    url: '/approval/get/order/log?appkey=' + appkey,
    method: 'get'
  })
}

export function dealOrderApproval(data) {
  return request({
    url: '/approval/deal/order',
    method: 'post',
    data
  })
}

export function getSpaceInfo(appkey) {
  return request({
    url: '/space/get/info?appkey=' + appkey,
    method: 'get'
  })
}
