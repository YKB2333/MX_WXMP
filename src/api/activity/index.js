import http from '@/utils/http'
// export const SERVICE_OLD = 'gf-activity-service'
export const SERVICE = 'mx-activity-service'

// 是否领取任务
// export function isReceiveTask() {
//   return http.post(`${SERVICE}/api/activityinviteuser/open/is_receive`)
// }

/**
 * 获取任务详情
 * @param {*} data 
 * { activityInviteUserId: '', orderClause: '' }
 */
// export function getTaskDetail(data) {
//   return http.post(`${SERVICE}/api/activityinvitesku/open/acivityInvite_detail`, data)
// }

/**
 * 根据skuid获取折扣活动商品
 * @param {*} data 
 * {"activityId": 0,"pageNo": 0,"pageSize": 0}
 */
export function getActivityGoods(query) {
  // return http.post(`${SERVICE}/api/activitydiscountsku/open/get_by_activity`, query)
  return http.post(`${SERVICE}/ignore/activityDiscountSku/listByPage`, query)
}

/**
 * 获取活动详情
 * @param {*} activityId 
 */
export function getActivityDetail(activityId) {
  // return http.get(`${SERVICE}/api/activity/open/${activityId}`)
  return http.get(`${SERVICE}/ignore/activity/getById/${activityId}`)
}

/**
 * 根据Id查询商品专题数据
 * @param {*} activityId 
 */
export function getGoodsProject(activityId) {
  return http.get(`${SERVICE}/ignore/goodsProject/getById?id=${activityId}`)
}

/**
 * 分页查询商品专题SPU数据
 * @param {*} activityId 
 */
export function getGoodsProjectSpu(data) {
  return http.post(`${SERVICE}/ignore/goodsProjectSpu/listByPage`, data)
}


/**
 * 商城栅格运营坑位
 */
export function getShopGridResources() {
  return http.get(`${SERVICE}/ignore/shopGridResources/list?channel=2`)
}


/**
 * 查询商城小运营列表
 */
export function getShopSmallResources() {
  return http.get(`${SERVICE}/ignore/shopSmallResources/list`)
}


/**
 * 根据id查询商城小运营资源数据
 */
export function getShopSmallResourcesById(params) {
  return http.post(`${SERVICE}/ignore/shopThemeResources/getById`, params)
}


/**
 * 分页查询主题运营列表
 */
export function getShopThemeResources(params) {
  return http.post(`${SERVICE}/ignore/shopThemeResources/listByPage`, params)
}


/**
 * 根据Id查询自定义专题数据
 */
export function getCustomProject(query) {
  return http.get(`${SERVICE}/ignore/customProject/getById`, query)
  // return http.get("http://192.168.0.227:3100/mock/93/ignore/customProject/getById",query)
}

/**
 * 根据activityId获取活动详情
 * @param {*} query 
 * {"activityId": 0,"pageNo": 0,"pageSize": 0}
 */
export function getCustomProjectById(query) {
  return http.get(`${SERVICE}/ignore/customProjectBasic/getById`, query)
}

