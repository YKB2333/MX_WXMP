import http from '@/utils/http'
import { SERVICE_OLD } from './index'

/**
 * 批量获取sku
 * skuIds：['74796419558412289']
 */
export function getBatchSku(skuIds) {
  // return http.post(`${SERVICE_OLD}/api/sku/open/batch_get_sku_by_id`, { skuIds: skuIds })
}

// 根据商品名或品牌名称查找
export function searchSkus(name) {
  // return http.get(`${SERVICE_OLD}/api/sku/open/query/${name}?distinct=1`)
}