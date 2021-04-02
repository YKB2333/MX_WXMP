import http from '@/utils/http'
// export const SERVICE_OLD = 'gf-order-service'
export const SERVICE = 'mx-order-service'

// 获取用户订单统计数据
export function getUserOrderCounts() {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/count`)
  return http.get(`${SERVICE}/api/orderInfo/count`)
}

// 构造订单确认页面
export function getOrderInfo(data) {
  // return http.post(`${SERVICE_OLD}/api/orderinfo`, data)
  return http.post(`${SERVICE}/api/order/confirmOrder`, data)
  // return http.post(`http://10.10.4.145:9011/api/order/confirmOrder`, data)
}

// 微信支付发起
export function createWechatPay(data) {
  // return http.post(`${SERVICE_OLD}/api/orderinfo/open/mini/wechat`, data)
  return http.post(`${SERVICE}/api/order/mini/placeOrder`, data)
  // return http.post(`http://10.10.4.145:9011/api/order/mini/placeOrder`, data)
}

// 微信支付再次发起
export function reWechatPay(data) {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/open/mini/continue_pay/${id}`)
  return http.post(`${SERVICE}/api/order/mini/continueToPay`,data)
}

// 我的订单列表
export function getOrderInfoList(data) {
  // return http.post(`${SERVICE_OLD}/api/orderinfo/list`, data)
  return http.post(`${SERVICE}/api/orderInfo/list`, data)
  // return http.post(`http://10.10.4.145:9011/api/orderInfo/list`, data)
}

// 我的订单详情
export function getOrderDetails(orderId) {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/details/${id}`)
  return http.get(`${SERVICE}/api/orderInfo/detail/${orderId}`)
  // return http.get(`http://10.10.4.145:9011/api/orderInfo/detail/${orderId}`)
}

// 删除订单
export function deleteOrder(id) {
  // return http.delete(`${SERVICE_OLD}/api/orderinfo/${id}`)
  return http.get(`${SERVICE}/api/order/deleteOrder?orderId=${id}`)
  
}

// 取消订单
export function cancelOrder(id) {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/cancel/${id}`)
  return http.get(`${SERVICE}/api/order/cancelOrder`,{orderId:id})
}

// 确认订单 确认发货
export function confirmOrder(id,billNo) {
  // return http.post(`${SERVICE_OLD}/api/orderpack/confirm/${id}/${biliNo}`)
  return http.get(`${SERVICE}/api/order/confirmReceipt?billNo=${billNo}`)
}

// 查询支付状态
export function payOrderInfo(orderId) {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/${orderId}`)
  return http.get(`${SERVICE}/api/orderInfo/getPostPaymentInfo?orderId=${orderId}`)
  
}

// vip下单续费
export function payVip(pwd) { // pwd:密码
  // return http.post(`${SERVICE_OLD}/api/orderinfo/svip`, { payType: 1, pwd: pwd })
}
// 订单包裹详情
export function getPackList(orderId) {
  // return http.get(`${SERVICE_OLD}/api/orderinfo/pack/${orderId}`)
  return http.get(`${SERVICE}/api/orderPack/getUserPack/${orderId}`)
}

//奖励金
export function shareEarningsQuery(params) { //奖励金
  // return http.post(`${SERVICE_OLD}/api/orderinfo/shareEarningsQuery`, params)
  // return http.post(`http://10.10.4.145:9005/api/orderinfo/shareEarningsQuery`, params)
}

//奖励金具体详情
export function getDetailsByOrderNoQuery(params) { //奖励金
  // return http.post(`${SERVICE_OLD}/api/orderinfo/getDetailsByOrderNoQuery/${params}`)
}

// 商品分享记录
export function getBuyShareRecord(params){
  return http.post(`${SERVICE}/api/buyShareRecord/page`,params)
}

// 获取收货地址
export function getOmsAddress() {
  return http.get(`${SERVICE}/api/omsAddress/getAddress`)
}

// 查询分享购买用户列表
export function getShareBuyUser() {
  return http.get(`${SERVICE}/api/buyShareRecord/listBuyUser`)
}

// 查询用户订单列表
export function getListUserOrder(userId) {
  return http.get(`${SERVICE}/api/buyShareRecord/listUserOrder?userId=${userId}`);
}
