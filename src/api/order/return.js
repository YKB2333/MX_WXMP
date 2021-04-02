import http from '@/utils/http'
import { SERVICE_OLD, SERVICE } from './index'

// 退换原因列表
export function getReasionList() {
  // return http.post(`${SERVICE_OLD}/api/orderreturns/reason_list`)
  return http.get(`${SERVICE}/api/return/reason/reason_list`)
}

// 填写物流信息
// {
//   "expressNo": "", 物流单号
//   "id": 0, 工单id
//   "logisticsCompanyName": "" 物流公司名称
// }
export function fillLogisticsInfo(data) {
  // return http.post(`${SERVICE_OLD}/api/orderreturns/fill_logistics_info`, data)
  return http.post(`${SERVICE}/api/order/returns/fill_logistics_info`, data)
}

// 退款
// {
//   "description": "", 描述信息
//   "images": "",  图片 多张逗号分隔
//   "orderId": 0, 订单id
//   "orderDetailsId": 0, 订单明细id
//   "reasonId": 0, 申请原因id
//   "reasonName": "" 申请原因
// }
export function applyForRefund(data) {
  // return http.post(`${SERVICE_OLD}/api/orderreturns/applyForRefundByDetails`, data)
  return http.post(`${SERVICE}/api/order/returns/applyForRefundByDetails`, data)
}

// 退换货查询
export function orderReturnsPage(data) {
  // return http.post(`${SERVICE_OLD}/api/orderreturns/page`, data)
  return http.get(`${SERVICE}/api/order/returns/page/${data.pageNum}/${data.pageSize}`)
}

// 退款详情
export function returnOrderDetail(orderId) {
  // return http.get(`${SERVICE_OLD}/api/orderreturns/${orderId}`)
  return http.get(`${SERVICE}/api/order/returns/${orderId}`)
  
}

// 取消售后申请
export function closeReturns(id) {
  // return http.post(`${SERVICE_OLD}/api/orderreturns/applyForCloseReturns/${id}`)
  return http.post(`${SERVICE}/api/order/returns/applyForCloseReturns/${id}`)
}
