import Fly from 'flyio/dist/npm/wx'
let request = new Fly()
import { baseURL, timeout, headersTokenKey, javascriptChannelName } from '@/config'
import store from '@/store'

// #ifdef MP-WEIXIN
request.config.baseURL = baseURL
// #endif

// h5端开发模式下由于跨域所以需要使用代理
// #ifdef H5
request.config.baseURL = process.env.NODE_ENV === 'development' ? '/proxy/' : baseURL
// #endif

request.config.timeout = timeout
request.config.headers['Content-Type'] = 'application/json'

let showTip = (res) => {
	console.log(res)
	if (res.data.resCode === '40001') {
		store.dispatch('clearUserData').then(() => {
			uni.showToast({ title: '登录过期', icon: 'none', duration: 1500 })
			// #ifdef MP-WEIXIN
			setTimeout(() => {
				uni.reLaunch({ url: '/pages/tabbar/Home' })
			}, 1500);
			// #endif

			// #ifdef H5
			this.$flutter({ method: 'CLEAR_USER_INFO' })
			this.$flutter({ method: 'TO_LOGIN' })
			// #endif
		})
	} else {
		// console.log(res.data.resInfo)
		if (!res.data.success && res.data.resInfo) {
			uni.showToast({ title: res.data.resInfo, icon: 'none', duration: 3000 })
		}
	}
}

// 请求拦截器
request.interceptors.request.use(
	(req) => {
		// 在发送请求之前做些什么
		// console.log(req)
		if (store.getters.token) {
			req.headers[headersTokenKey] = store.getters.token
		}
		return req
	}, (error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

request.interceptors.response.use(
	(res) => {
		// console.log('res', res)
		let token = res.headers[headersTokenKey]
    if (token) {
      console.log('更新token', token)
      store.commit('SET_TOKEN', token)
    }
		// 返回结果集
		if (res.status === 200 && res.data) {
			if (res.data.success) {
				showTip(res)
				return res.data
			} else {
				showTip(res)
				return Promise.reject(res.data)
			}
		}
	}, 
	(error) => {
		// console.log('error', error)
		if (error.status === 0) {
			uni.showToast({title: '网络连接失败，请重试', icon: 'none', duration: 2000})
			return Promise.reject('网络连接失败')
		} else if(error.status === 1) {
			// console.log('请求超时')
			uni.showToast({title: '请求超时，请重试', icon: 'none', duration: 2000})
			return Promise.reject('请求超时')
		} else {
			showTip(error.response)
			return Promise.reject(error)

		}
	}
);


export default request;