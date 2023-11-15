import request from '@/utils/request'

export function addOrder(data) {
  return request({
    url: '/order/add',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data
  })
}

export function delOrder(appkey) {
  return request({
    url: '/order/del?appkey=' + appkey,
    method: 'get'
  })
}

export function processOrder(appkey) {
  return request({
    url: '/order/process?appkey=' + appkey,
    method: 'get'
  })
}

export function getOrderList(account) {
  return request({
    url: '/order/get/list?account=' + account,
    method: 'get'
  })
}

export function getOrderInfo(appkey) {
  return request({
    url: '/order/get/info?appkey=' + appkey,
    method: 'get'
  })
}

export function getSpaceList(account) {
  return request({
    url: '/space/get/list?account=' + account,
    method: 'get'
  })
}

export function getSpaceUpdateList(data) {
  return request({
    url: '/space/get/list/update',
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
