import http from '@/utils/http'
import { SERVICE_OLD, SERVICE } from './index'

// 购物车列表
// export function getCartList() {
//   console.log(SERVICE)
//   return http.post(`${SERVICE}/api/ordercart/list`)
// }
export function getCartList() {
  return http.get(`${SERVICE}/api/orderCart/list`)
}
// 添加购物车
export function addCart(quantity, skuId) {
  // return http.post(`${SERVICE_OLD}/api/ordercart/add`, { quantity, skuId })
  return http.post(`${SERVICE}/api/orderCart/add`, { quantity, skuId })
}
// 购物车批量删除
export function batchDeleteCart(ids) {
  // return http.post(`${SERVICE_OLD}/api/ordercart/batch_delete`, ids)
  return http.post(`${SERVICE}/api/orderCart/batchDelete`, ids)
}
// 更新购物车数量
export function updateQuantity(id, quantity) {
  // return http.post(`${SERVICE_OLD}/api/ordercart/update_quantity`, { id: id, quantity: quantity })
  return http.get(`${SERVICE}/api/orderCart/updateQuantity?skuId=${id}&quantity=${quantity}`)
}

//购物车优惠明细
export function getCalculateDiscount(params) { //
  return http.post(`${SERVICE}/api/orderCart/calculateDiscount`,params)
}
