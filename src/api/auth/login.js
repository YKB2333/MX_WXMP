import http from '@/utils/http'
import { SERVICE } from './index'

// 小程序授权，校验是否已绑定手机
export function wxAuth(code, encryptedData, iv) {
  console.log("wxAuth",code)
  return http.post(`${SERVICE}/wx/miniprogram_auth`, { code: code, encryptedData: encryptedData, iv: iv })
}

