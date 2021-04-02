import http from '@/utils/http'
export const SERVICE = 'mx-user-service'

// 根据用户获取助理信息
export function getUserAsis() {
  return http.get(`${SERVICE}/ignore/customer/service/user/get`)
}

// 获取个人中心小助理列表
export function getUserAsisList() {
  return http.get(`${SERVICE}/ignore/customer/service/user/getList/0/10`)
}
// 获取用户摇奖信息
export function getVipBoxInfo(){
  return http.get(`${SERVICE}/api/lucky/lottery/get/user/lottery`);
  // return http.get(`http://192.168.0.227:3100/mock/99/api/lucky/lottery/get/user/lottery`);
}

// 摇奖
export function doBoxRank(userId){
  return http.get(`${SERVICE}/api/lucky/lottery/do/lottery/${userId}`);
  // return http.get(`http://192.168.0.227:3100/mock/99/api/lucky/lottery/do/lottery/${userId}`);
}

// 领奖
export function receiveAward(addressId){
  return http.get(`${SERVICE}/api/lucky/lottery/receive/${addressId}`);
}

// 获取用户信息
export function getUserInfoByUid() {
  // return http.get(`${SERVICE}/api/userinfo/${id}`)
  return http.get(`${SERVICE}/api/userInfo/getUserInfo`)
}

// 个人喵豆明细列表（可用/代收, type0是代收喵豆,1是可用喵豆）
export function getUserIntegralLog(query) {
  // return http.post(`${SERVICE}/api/userscorelog/page`, query)
  return http.post(`${SERVICE}/api/userScoreLog/page`, query)
}

/**
 * 更新用户昵称/头像
 * { "nickName": "张海标" }
 * { "headImgUrl": "" }
 * @param {*} data 
 */
export function updateAvatarName(data) {
  // return http.post(`${SERVICE}/api/userinfo/update_avatar_name`, data)
  return http.post(`${SERVICE}/api/userInfo/update_avatar_name`, data)
}

// 添加实名信息
export function addRealnameInfo({ idCard, mobile, name }) {
  // return http.post(`${SERVICE}/api/realnameinfo`, { idCard, mobile, name })
  return http.post(`${SERVICE}/api/realNameInfo`, { idCard, mobile, name })
}

// 修改实名信息
export function updateRealnameInfo(data) {
  // return http.put(`${SERVICE}/api/realnameinfo`, data)
  return http.put(`${SERVICE}/api/realNameInfo`, data)
}

// 获取用户实名信息列表
export function getRealnameList() {
  // return http.get(`${SERVICE}/api/realnameinfo`)
  return http.get(`${SERVICE}/api/realNameInfo`)
}

export function deleteRealname(id) {
  // return http.delete(`${SERVICE}/api/realnameinfo/${id}`)
  return http.delete(`${SERVICE}/api/realNameInfo/${id}`)
}