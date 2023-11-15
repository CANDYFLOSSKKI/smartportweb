import request from '@/utils/request'

export function getKey(key) {
  return request({
    url: '/ship/get/key?key=' + key,
    method: 'get'
  })
}

export function getOneByName(name) {
  return request({
    url: 'ship/get/name?name=' + name,
    method: 'get'
  })
}

export function updateOneByName(data) {
  return request({
    url: 'ship/update',
    method: 'post',
    data
  })
}

export function bindShipToCraft(data) {
  return request({
    url: 'craft/add',
    method: 'post',
    data
  })
}

export function delCraft(name) {
  return request({
    url: 'craft/del?name=' + name,
    method: 'get'
  })
}

export function confirmShip(data) {
  return request({
    url: 'craft/confirm',
    method: 'post',
    data
  })
}

export function getCraft(account) {
  return request({
    url: 'craft/get/account?account=' + account,
    method: 'get'
  })
}

export function getCraftPre(account) {
  return request({
    url: 'craft/get/pre?account=' + account,
    method: 'get'
  })
}

export function updateBatch(data) {
  return request({
    url: 'craft/update/batch',
    method: 'post',
    data
  })
}

export function delBatch(data) {
  return request({
    url: 'craft/del/batch',
    method: 'post',
    data
  })
}
