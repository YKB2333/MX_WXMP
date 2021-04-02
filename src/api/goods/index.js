
import http from '@/utils/http'
// export const SERVICE_OLD = 'gf-goods-service'
export const SERVICE = 'mx-goods-service'

// 获取spu详情
export function getSpuToEs(query) {
  return http.get(`${SERVICE}/ignore/spu/spuToEs/${query}`)
  // return http.get(`http://192.168.0.151:88/mx-goods-service/ignore/spu/spuToEs/208944290067619841`)
}

// 获取vip下单详情
export function getVipPayDetail() {
  // return http.get(`${SERVICE_OLD}/api/virtualsku/svip`)
}

// 查询一级分类
export function getCategoryOne() {
  // return http.get(`${SERVICE_OLD}/api/category/open/get/level1/wxmp`)
}

// 查询一级分类
export function getAllLevelOne() {
  // return http.get(`${SERVICE}/api/category/get/allLevelOne`)
  return http.get(`${SERVICE}/ignore/category/get/allLevelOne`)
}

// 查询全部商品
export function getAllGoods(data) {
  return http.post(`${SERVICE}/ignore/spu/esPage/allGoods`,data)
}

// 查询类目商品
export function searchGoods(data) {
  return http.post(`${SERVICE}/ignore/spu/esPage/searchGoods`,data)
}

// 查询二级类目品牌
export function getBrands(data){
  return http.get(`${SERVICE}/ignore/brand/get/getCategoryBrand`,data)
}
//
export function getHomePageCategory() {
  return http.get(`${SERVICE}/ignore/category/get/homePageCategory`)
}

// 分享商品列表
export function getShareGoodHistory(data){
  return http.post(`${SERVICE}/api/share/goods/info/page`,data)
}

// 购买记录商品信息
export function getAllStatusSpu(query) {
  return http.get(`${SERVICE}/ignore/spu/getAllStatusSpu/${query}`)
}

// 我的推荐商品列表
export function getMyRecommendGoods() {
  return http.post(`${SERVICE}/api/share/goods/info/listGoods`)
}

// 浏览/购买好友列表 {spuId:xx}
export function getFriendsBuyDetail(data) {
  return http.post(`${SERVICE}/api/share/goods/info/listUserOrderConversion?spuId=${data}`);
}
