
import http from '@/utils/http'
import { SERVICE } from './index'


// 获取用户绑定的银行列表
export function getUserBindBankList() {
  return http.get(`${SERVICE}/api/userbankbind`)
}

// 提现检查
export function checkWithdraw() {
  return http.get(`${SERVICE}/api/userwithdrawrequest/check`)
}

// 添加/修改银行卡
export function saveUpdateBank(data) {
  return http.post(`${SERVICE}/api/userbankbind/save_update`, data)
}

// 提现申请
/**
 * 
 * @param { "amount": 0,"bankCardNo": "","transName": "","bankName": "","bankOfDeposit": ""}
 * 
 */
export function applyWithdraw(data) {
  return http.post(`${SERVICE}/api/userwithdrawrequest/apply_for_withdraw`, data)
}