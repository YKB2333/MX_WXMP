import http from '@/utils/http'
// export const SERVICE = 'gf-message-service'
import { SERVICE } from '../index'
import { templateCode } from '@/config'

// 发送短信
export function sendSms(mobile) {
  // return http.post(`${SERVICE}/sms/code/${mobile}`)
  return http.post(`${SERVICE}/ignore/sms/send/sendCode/${mobile}`)
}

// 修改账户密码时发送验证码
export function sendMessageCode(mobile) {
  // return http.post(`${SERVICE}/sms/send`, { templateCode: templateCode, phoneNumbers: mobile })
  return http.post(`${SERVICE}/ignore/sms/send/sendSms/${mobile}`)
}

// 短信验证码验证
export function verification(mobile, smsCode) {
  // return http.post(`${SERVICE}/sms/content/verification`, { templateCode: templateCode, phoneNumber: mobile, code: smsCode })
  return http.post(`${SERVICE}/ignore/sms/send/content/verification`, { templateCode: templateCode, phoneNumber: mobile, code: smsCode })
}
