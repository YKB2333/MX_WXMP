import http from '@/utils/http'
import { SERVICE } from './index'

// 收货地址列表
export function getAddressList() {
  // return http.get(`${SERVICE}/api/userreceivingaddress`)
  return http.get(`${SERVICE}/api/userReceivingAddress`)
}
// 收货地址新增/修改
export function updateAddress(type, data) {
  if (type === 'add') {
    // return http.post(`${SERVICE}/api/userreceivingaddress`, data)
    return http.post(`${SERVICE}/api/userReceivingAddress`, data)
  } else if (type === 'edit') {
    // return http.put(`${SERVICE}/api/userreceivingaddress`, data)
    return http.put(`${SERVICE}/api/userReceivingAddress`, data)
  }
}
// 设置默认地址
export function setDefaultAddress(id) {
  // return http.put(`${SERVICE}/api/userreceivingaddress/${id}`)
  return http.put(`${SERVICE}/api/userReceivingAddress/${id}`)
}
// 删除地址
export function deleteAddress(id) {
  // return http.delete(`${SERVICE}/api/userreceivingaddress/${id}`)
  return http.delete(`${SERVICE}/api/userReceivingAddress/${id}`)
}