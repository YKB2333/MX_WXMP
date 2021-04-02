import http from '@/utils/http'
import { SERVICE_OLD } from './index'

/** 素材分页查询
 * {"pageNo":1,"pageSize":20,"spuId":"","type":1}
 * 类型:1所有素材,2我的素材
 */
export function getMaterialList(query) {
  // return http.post(`${SERVICE_OLD}/api/materiacirclel/page`, query)
}

/**
 * 发布素材
 * {"content":"","coverHeight":0,"coverWidth":0,"images":"","spuId":"","type":0}
 * type: 0图片1视频
 * images: 素材图片,逗号分隔
 * */ 
export function publishMaterial(query) {
  // return http.post(`${SERVICE_OLD}/api/materiacirclel/publish`,  query)
}

/**
 * 素材统计
 * unChecked: 待审核
 * publish： 已发布
 * offline： 已下线
 * fail: 未通过
 */
export function getStatusCount() {
  // return http.get(`${SERVICE_OLD}/api/materiacirclel/status_count`)
}

// 素材下载统计
export function downloads(id) {
  // return http.get(`${SERVICE_OLD}/api/materiacirclel/add_downloads/${id}`)
}

// 删除素材
export function deleteMaterial(id) {
  // return http.get(`${SERVICE_OLD}/api/materiacirclel/delete/${id}`)
}
