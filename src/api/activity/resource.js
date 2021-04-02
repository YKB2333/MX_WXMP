import http from '@/utils/http'
export const SERVICE = 'mx-activity-service'

// 首页商城资源(包括轮播图、喵豆图标等)
export function getHomeResource(){
  return http.get(`${SERVICE}/ignore/shopResources/list?channel=2`)
}

/**
 * values数组里的id(153528001684836353)
 *  =>
 * skuList里attrValueId(153528001684836353)
 * 
 * 多规格
 * 153118791893520385
 *  => 
 * 153118791893520385
 * 153118791893520385
 * 
 */