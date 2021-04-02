import http from '@/utils/http'
export const SERVICE = 'mx-tools-service'

/**
 * 生成海报小程序码链接
 * @param { spuId: 1 } 
 */
export function createSmallProgramCode(data) {
  return http.get(`${SERVICE}/ignore/minapp/makeMinappCode`, data)
}

/**
 * 根据UUID获取小程序码包含的SPU与用户信息
 * @param { code: 0b73cae44aa5445f831fbdbad0d50f8c } 
 */
export function getSpuInfoByCode(data) {
  return http.get(`${SERVICE}/ignore/minapp/getSpuInfoByCode`, data)
}

/**
 * 获取用户手机
 * @param { code, iv, encryptedData } 
 */
export function getWxPhone(data){
  return http.post(`${SERVICE}/ignore/minapp/getWxPhone`, data)
  // return http.post(`http://192.168.31.212:9012/ignore/minapp/getWxPhone`, data)
}

/**
 * 获取用户最新一条升降级未读消息
 * @param { userId } 
 */
export function getByUserAndType(data){
  return http.get(`${SERVICE}/api/pushMessage/getByUserAndType`, data)
  // return http.post(`http://192.168.31.212:9012/ignore/minapp/getWxPhone`, data)
}

// 获取喵豆相关配置
export function getIntegralConfig() {
  return http.get(`${SERVICE}/ignore/sys/dict/get_integral_config`)
}

// 后台字典配置查询
export function getSysdictQuery(query) {
  // return http.post(`${SERVICE}/api/sysdict/open/query`, query)
  return http.post(`${SERVICE}/ignore/sys/dict/query`, query)
}

