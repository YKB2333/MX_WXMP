import http from '@/utils/http'
import { SERVICE } from './index'

// 小程序授权，校验是否已绑定手机
export function wxAuth(code, encryptedData, iv) {
  console.log("wxAuth",code)
  return http.post(`${SERVICE}/wx/miniprogram_auth`, { code: code, encryptedData: encryptedData, iv: iv })
  // return http.post(`http://192.168.31.212:9010/wx/miniprogram_auth`, { code: code, encryptedData: encryptedData, iv: iv })
}

// 绑定手机并登陆 (手机验证码)
export function loginAndBinding(data) {
  // "encryptedData", "iv","mobile", "smsCode", "shareUserId","unionId"
  console.log("loginAndBinding",data)
  return http.post(`${SERVICE}/wx-miniprogram/loginAndBinding`, data)
  // return http.post(`http://192.168.31.212:9010/wx-miniprogram/loginAndBinding`, data)
}

// 绑定手机并登陆 (不用手机验证码)
export function getQuickLoginAndBinding(data){
  return http.post(`${SERVICE}/wx-miniprogram/quickLoginAndBinding`, data)
  // return http.post(`http://192.168.31.212:9010/wx-miniprogram/quickLoginAndBinding`, data)
}

// 已绑定手机时的登陆
export function wxLogin(mobile, unionId) {
  let params = {
    mobile: mobile,
    unionId: unionId
  }
  return http.post(`${SERVICE}/wx-miniprogram/login`, params)
  // return http.post(`http://192.168.31.212:9010/wx-miniprogram/login`, params)
}