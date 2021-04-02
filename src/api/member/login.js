import http from '@/utils/http'
import { SERVICE } from './index'

// 绑定手机并登陆
export function loginAndBinding(data) {
  // "encryptedData", "iv","mobile", "smsCode", "shareUserId","unionId"
  console.log("loginAndBinding",data)
  return http.post(`${SERVICE}/wx-miniprogram/loginAndBinding`, data)
}

export function getQuickLoginAndBinding(data){
  return http.post(`${SERVICE}/wx-miniprogram/quickLoginAndBinding`, data)
  // return http.post(`http://192.168.31.212:9003/wx-miniprogram/quickLoginAndBinding`, data)
}

// 已绑定手机时的登陆
export function wxLogin(mobile, unionId) {
  let params = {
    mobile: mobile,
    unionId: unionId
  }
  return http.post(`${SERVICE}/wx-miniprogram/login`, params)
  // return http.post(`http://192.168.31.212:9003/wx-miniprogram/login`, params)
}

/**
 * 账号验证码登录
 * {"mobile":"","smsCode":""}
 */
export function mobileSMSCodeLogin(mobile,smsCode){
  let params = {
    mobile:mobile,
    smsCode:smsCode,
  }
  return http.post(`${SERVICE}/login`,params);
}

