// import http from '@/utils/http'
// export const SERVICE = 'gf-member-service'

// // 获取用户资产
// export function getUserAssets() {
//   return http.get(`${SERVICE}/api/userassets/get`)
// }

// // 余额明细表
// // pageSize, status:0:待收/1:可用
// export function getUserAssetsRecords(query) {
//   return http.post(`${SERVICE}/api/userassetsrecord`, query)
// }

// // 提现分页查询
// export function getUserWithdrawRecords(query) {
//   return http.post(`${SERVICE}/api/userwithdrawrequest`, query)
// }

// // 我的粉丝分页查询
// export function getMyFansList(query) {
//   return http.post(`${SERVICE}/api/userrelationfans/page`, query)
// }

// // 查询会员权益销售额
// export function getUserVipSales() {
//   return http.get(`${SERVICE}/api/usersvipsales`)
// }

// // 校验账户密码
// export function validPassword(password) {
//   return http.post(`${SERVICE}/api/useraccount/vaildation`, { password: password })
// }

// // 设置新密码
// export function setNewPassword(password, confirmPasswod) {
//   return http.post(`${SERVICE}/api/useraccount`, { password: password, confirmPasswod: confirmPasswod })
// }

// // 查询用户是否设置过密码
// export function checkIsSetPassword() {
//   return http.get(`${SERVICE}/api/useraccount`)
// }

// // 获取粉丝邀请弹窗
// export function getFanInvitePopups() {
//   return http.get(`${SERVICE}/api/userproxyinvitefansrecord/get_invite_popups`)
// }

// // 接受或者拒绝粉丝邀请
// export function acceptOrRejectInvite(data) {
//   return http.put(`${SERVICE}/api/userproxyinvitefansrecord/accept_or_reject`, data)
// }

// // 发送邀请成为达人
// export function sendUserproxyinvite(data) {
//   return http.post(`${SERVICE}/api/userproxyinvitefansrecord`, data)
// }
