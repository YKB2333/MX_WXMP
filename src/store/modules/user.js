import { loginAndBinding, getQuickLoginAndBinding, wxLogin, wxAuth } from '@/api/user/login'
// import { wxAuth } from '@/api/auth/login'
// import { loginAndBinding, getQuickLoginAndBinding, wxLogin } from '@/api/member/login'
import { getUserInfoByUid } from '@/api/user'
import { getIntegralConfig } from '@/api/tools'

export default {
  state: {
    shareUserId: uni.getStorageSync('shareUserId') || '',
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null,
    // 小程序授权请求后返回的数据
    authUserData: uni.getStorageSync('authUserData') || null,
    // 是否已退出登录
    isLogout: uni.getStorageSync('isLogout') || false,
  },
  mutations: {
    SET_FROM_USER_ID(state, shareUserId) {
      console.log("shareUserId============",shareUserId)

      // debugger
      state.shareUserId = shareUserId
      if (!shareUserId) {
        uni.removeStorageSync('shareUserId')
      } else {
        uni.setStorageSync('shareUserId', shareUserId)
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
      uni.setStorageSync('token', token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      if (!userInfo) {
        uni.removeStorageSync('userInfo')
      } else {
        uni.setStorageSync('userInfo', userInfo)
      }
    },
    SET_AUTH_USER_DATA(state, data) {
      state.authUserData = data
      uni.setStorageSync('authUserData', data)
    },
    SET_IS_LOGOUT(state, flag) {
      state.isLogout = flag
      uni.setStorageSync('isLogout', flag)
    },
    /**
     *  更新本地用户信息
     * @param {*} data => { nickName: 'abs' }
     */
    UPDATE_USER_INFO_VALUE(state, data) {
      Object.keys(data).forEach(key => {
        state.userInfo[key] = data[key]
      })
      uni.setStorageSync('userInfo', state.userInfo)
    }
  },
  actions: {
    // 获取微信code
    getWxCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: (res) => {
            resolve(res.code)
          },
          fail: () => {
            reject('error')
          }
        })
      })
    },
    // 获取微信用户信息
    getWxUserInfo() {
      return new Promise((resolve, reject) => {
        uni.getSetting({
          success: (setting) => {
            if (setting.authSetting['scope.userInfo']) {
              uni.getUserInfo({
                withCredentials: true,
                success: (info) => {
                  resolve(info)
                },
                fail: () => {
                  console.log('getUserInfo fail')
                  resolve(null)
                }
              })
            } else {
              resolve(null)
            }
          },
          fail: () => {
            console.log('getSetting fail')
            resolve(null)
          }
        })
      })
    },
    // 小程序授权，校验是否已绑定手机
    checkBindPhone({ dispatch, commit }, obj) {
      // code, encryptedData, iv
      return new Promise((resolve, reject) => {
        wxAuth(obj.code, obj.encryptedData, obj.iv).then(res => {
          console.log('小程序授权', res.data)
          commit('SET_AUTH_USER_DATA', res.data)
          if (!res.data.bindinged) {
            commit('SET_TOKEN', '')
            commit('SET_USER_INFO', null)
          }
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 绑定手机并登录
    bindPhone({ dispatch, commit }, obj) {
      return new Promise((resolve, reject) => {
        loginAndBinding(obj).then(res => {
          console.log('绑定手机并登录', res.data)
          let data = res.data
          commit('SET_TOKEN', `${data.token_type} ${data.access_token}`) // 中间空格隔开
          commit('SET_USER_INFO', data.userInfo)
          commit('SET_IS_LOGOUT', false)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 微信授权绑定手机并登录
    bindWxPhone({ dispatch, commit }, obj) {
      return new Promise((resolve, reject) => {
        getQuickLoginAndBinding(obj).then(res => {
          console.log('绑定手机并登录', res.data)
          let data = res.data
          commit('SET_TOKEN', `${data.token_type} ${data.access_token}`) // 中间空格隔开
          commit('SET_USER_INFO', data.userInfo)
          commit('SET_IS_LOGOUT', false)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 如果已绑定手机，传入手机和unionId登陆
    appLogin({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.authUserData['bindinged']) {
          let mobile = state.authUserData['mobile']
          let unionId = state.authUserData['unionId']
          wxLogin(mobile, unionId).then(res => {
            console.log('已绑定手机,自动登录', res.data)
            console.log('已绑定手机,自动登录', res.data["access_token"])
            let data = res.data
            commit('SET_TOKEN', `${data.token_type} ${data.access_token}`) // 中间空格隔开
            commit('SET_USER_INFO', data.userInfo)
            commit('SET_IS_LOGOUT', false)
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        } else {
          reject('未绑定手机号')
        }
      })
    },
    // 获取用户信息
    getUserInfo({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfoByUid(state.userInfo.id).then(res => {
          console.log('用户信息', res.data)
          commit('SET_USER_INFO', res.data)
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出登录
    userLogout({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', null)
        commit('SET_IS_LOGOUT', true)
        resolve()
      })
    },
    // 获取喵豆抵扣比例
    getIntegralDeduction() {
      return new Promise((resolve, reject) => {
        getIntegralConfig().then(res => {
          // console.log('喵豆配置', res.data)
          let list = res.data
          let target = list.find(ele => ele.dictType === 'SYSTEM_CONFIG' && ele.dictKey === 'POINT_DEDUCTION' && ele.enabled)
          if (target && target.dictValue) {
            resolve(Number(target.dictValue))
          } else {
            reject(null)
          }
          console.log(target)
        }).catch(error => {
          reject(null)
        })
      })
    },
    // 清除用户数据,token, userInfo
    clearUserData({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', null)
        resolve()
      })
    }
  }
}