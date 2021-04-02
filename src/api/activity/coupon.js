import http from '@/utils/http'
export const SERVICE = 'mx-coupon-service'
//获得用户所有优惠券
export function getAllCouponByUserId(settlementGoodsVos) {
	if (settlementGoodsVos) {
		// return http.get(`${SERVICE}/api/couponUser/getAllCouponByUserId?selectGoodsMoount=${selectGoodsMoount}`)
		return http.post(`${SERVICE}/api/couponUser/calculateCouponUsed`,settlementGoodsVos)
	} else {
		return http.get(`${SERVICE}/api/couponUser/getAllCouponByUserId`)
	}
}
// 首页收到优惠券弹窗
export function getReceivedCoupon() {
	return http.get(`${SERVICE}/api/couponUser/receivedCouponList`) //新接口
}
// 获取活动页符合的最大面额优惠券
export function getHappinessMaxCoupon(totalActivitAmount) {
	return http.get(`${SERVICE}/api/couponUser/getCanUseMaxCoupon/${totalActivitAmount}`)
}
// 兑换码兑换优惠券
export function getExchangeCoupon(exchangeCode) {
	return http.get(`${SERVICE}/api/couponActivity/exchangeCoupon/${exchangeCode}`)
}
// 兑换码页图片
export function getActivityCouponImg(id) {
	return http.get(`${SERVICE}/ignore/activity/getImg/${id}`)
}
