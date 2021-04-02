import Vue from 'vue'
import App from './App'
import { javascriptChannelName } from '@/config'

Vue.config.productionTip = false
App.mpType = 'app'
/**
 * Vuex
 */
import store from './store'
Vue.prototype.$store = store
/**
 * http请求
 */
import './utils/http'
/**
 * 配置文件
 */
Vue.prototype.$config = require('./config')

/**
 * 配置页面路径文件
 */
Vue.prototype.$pageUrl = require('./const/page-url')

/**
 * 全局过滤器
 */
import * as filters from './common/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$routerLink = (url) => {
  uni.navigateTo({ url: url })
}

/**
 * 全局 event bus
 */
Vue.prototype.$eventHub = new Vue();
// 事件名称对象
Vue.prototype.$eventName = require('./bus-event')

// #ifdef H5
window.getAppData = (jsonStr) => {
  let data = JSON.parse(jsonStr)
  // token
  store.commit('SET_TOKEN', data['token'])

  // 用户信息
  store.commit('SET_USER_INFO', data['userInfo'])

  // 设备信息
  store.commit('SET_PLATFORM_INFO', data['platformInfo'])
}

Vue.prototype.$flutter = (data) => {
  window[javascriptChannelName].postMessage(JSON.stringify(data))
}
// 解决生产环境https无法访问http图片问题
// <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
if (process.env.VUE_APP_ENV === 'prod') {
  console.log('mata==========')
  let head = document.getElementsByTagName("head");
  let meta = document.createElement("meta");
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = 'upgrade-insecure-requests';
  head[0].appendChild(meta);
}
// #endif

const app = new Vue({
  ...App
})
app.$mount()
