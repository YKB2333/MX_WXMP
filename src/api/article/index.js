import http from '@/utils/http'
// export const SERVICE_OLD = 'gf-article-service'
export const SERVICE = 'mx-article-service'

// // 获取话题
// export function getTopicList() {
//   return http.get(`${SERVICE_OLD}/api/topic/open/list`)
// }

/* 文章列表
  {
    "pageSize": 20,
    "pageNo": 1
  }
*/
export function getArticleList(params) {
  return http.post(`${SERVICE}/ignore/article/page/list`, params)
  // return http.post(`http://192.168.0.227:3100/mock/117/ignore/article/page/list`, params)
}

/* 文章详情
  {
    "id": 20,
  }
*/
export function getArticleDetail(id) {
  return http.get(`${SERVICE}/ignore/article/get/articleDetail/${id}`)
  // return http.get(`http://192.168.0.227:3100/mock/117/ignore/article/get/articleDetail/${id}`)
}

/* 文章推荐
  {
    "pageSize": 20,
    "pageNo": 1
  }
*/
export function getRecommendArticle(params) {
  return http.post(`${SERVICE}/ignore/article/getRecommendList`, params)
  // return http.post(`http://192.168.0.227:3100/mock/117/ignore/article/getRecommendList`, params)
}

/* 文章喜欢数
*/
export function getLikeArticle() {
  return http.get(`${SERVICE}/api/article/like/countMyLikeNum`)
  // return http.get(`http://192.168.0.227:3100/mock/117/api/article/like/countMyLikeNum`)
}

// 我的喜欢列表
export function getMyLikeList(query) {
  return http.post(`${SERVICE}/api/article/getMyLikeList`, query)
  // return http.post(`http://192.168.0.227:3100/mock/117/api/article/getMyLikeList`, query)
}

/**
 * 文章评论列表
 * {
 *  articleId
 *  pageNo
 *  pageSize
 * }
 */
export function getCommentList(data) {
  return http.post(`${SERVICE}/ignore/article/comments/page`, data)
}

/**
 * 添加评论
 * 
 * {
 *  articleId: 文章id
 *  content： 评论内容
 * }
 */
export function addComment(data) {
  return http.post(`${SERVICE}/api/article/comments/add`, data)
}

/**
 * 获取sku关联的文章（TA说）
 * {
 *  flag: 0,第一次传0
 *  pageNo
 *  pageSize
 *  spuId
 *  skuId
 * }
 * */
export function TAList(data) {
  // return http.post(`${SERVICE_OLD}/api/article/open/get_by_sku`, data)
  return http.post(`${SERVICE}/ignore/article/heSaidList`, data)
}

// 点赞文章
export function likeArticle(articleId) {
  // return http.post(`${SERVICE_OLD}/api/article/like`, { articleId: articleId })
  return http.get(`${SERVICE}/api/article/like/add/${articleId}`)
}

// 取消点赞文章
export function cancelLikeArticle(articleId) {
  // return http.post(`${SERVICE_OLD}/api/article/cancel_like/${articleId}`)
  return http.get(`${SERVICE}/api/article/like/cancel/${articleId}`)
}

// 关注/取消关注(flag：1关注/0取消关注)
// export function focus(articleId, flag) {
//   return http.get(`${SERVICE_OLD}/api/focus/focus/${articleId}/${flag}`)
// }

// 文章转发
export function shareArticle(id) {
  // return http.get(`${SERVICE_OLD}/api/article/open/share/${id}`)
  return http.get(`${SERVICE}/ignore/article/shareArticle/${id}`)
}

// 点赞评论
export function likeComment(id) {
  // return http.post(`${SERVICE_OLD}/api/article/comments/like`, {evaluateId: id})
  return http.get(`${SERVICE}/api/evaluateLike/add/${id}`)
}
// 取消点赞评论
export function cancelLikeComment(evaluateId) {
  // return http.post(`${SERVICE_OLD}/api/article/comments/cancel_like/${evaluateId}`)
  return http.get(`${SERVICE}/api/evaluateLike/cancel/${evaluateId}`)
}

// 阅读文章
export function read(id) {
  // return http.get(`${SERVICE_OLD}/api/article/open/read/${id}`)
  return http.get(`${SERVICE}/ignore/article/read/${id}`)
  
}
