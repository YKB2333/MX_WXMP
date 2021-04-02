import http from '@/utils/http'
import { SERVICE_OLD, SERVICE } from './index'

// 根据spuId数组批量获取spu
export function getSpuByIds(ids){
  // return http.post(`${SERVICE_OLD}/api/spu/open/bach_id`, {ids: ids})
}

// 猜你喜欢
// export function guessLike(data) {
//   return http.post(`${SERVICE_OLD}/api/spu/open/guess_you_like`, data)
// }

// 猜你喜欢
export function guessLike(data) {
  // return http.post(`http://192.168.0.227:3100/mock/105/api/spu/guess_you_like`, data)
  return http.post(`${SERVICE}/ignore/spu/guess_you_like`, data)
}

// 根据spuId获取商品详情
export function getSpuDetail(id,uId) {
  if(uId) {
    return http.get(`${SERVICE}/ignore/spu/getDetails`,{spuId:id,shareUserId:uId})  
  }
  return http.get(`${SERVICE}/ignore/spu/getDetails`,{spuId:id})
  // return http.get(`http://192.168.31.212:9008/ignore/spu/getDetails`,{spuId:id})
}

// 获取品牌商品
export function getBrandGoods(data) {
  // return http.post(`${SERVICE_OLD}/api/spu/open/get_by_brand`, data)
}

// 分享商品
export function shareGoods(spuId) {
  return http.get(`${SERVICE}/ignore/spu/share/${spuId}`)
}

/**
 * 搜索商品
 * @param { pageNo: 1, pageSize: 30, spuName: '', categoryId: '' } 
 */
export function searchSpu(data) {
  // return http.post(`${SERVICE_OLD}/api/spu/open/page/new/wxmp`, data)
}
