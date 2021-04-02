
export default {
  state: {
    isUserInApp: false, // 用户是否在App中, 默认否
    searchHistory: uni.getStorageSync('searchHistory') || [], // 搜索历史记录
    vipGuidePopup: uni.getStorageSync('vipGuidePopup') || '1', // 首页引导新会员状态记录
    cardGuideShow: uni.getStorageSync('cardGuideShow') || '1', // 我的引导新会员状态记录
    kefuGuideShow:uni.getStorageSync('kefuGuideShow') || '1', // 首页小助理引导状态
    cardGuideRecomendShow:uni.getStorageSync('cardGuideRecomendShow') || '1', // 我的推荐引导状态
    likeArticleIds: [], // 存放点赞文章的id
    menuTop: "",
    navBarHeight: "",
    // app设备信息
    platformInfo: uni.getStorageSync('platformInfo') || {},
  },
  mutations: {
    SET_USER_IN_APP_STATE(state, bool) {
      state.isUserInApp = bool
    },
    // 保存历史记录，如果val为空则清除全部
    SET_SEARCH_HISTORY(state, val) {
      // debugger
      if (!val) {
        state.searchHistory = []
      } else {
        if (!state.searchHistory.includes(val)) { // 搜索值不重复时添加
          state.searchHistory.unshift(val)
          if (state.searchHistory.length > 10) { // 最大10条
            state.searchHistory = state.searchHistory.slice(0, 10)
          }
        }
      }
      uni.setStorageSync('searchHistory', state.searchHistory)
      console.log(state.searchHistory)
    },
    // 保存首页新会员体系引导状态
    CLOSE_VIPGUIDE_STATE(state) {
      // debugger
      state.vipGuidePopup = '0'
      uni.setStorageSync('vipGuidePopup', state.vipGuidePopup)
      console.log(state.vipGuidePopup)
    },
    // 保存我的新会员体系引导状态
    CLOSE_CARDGUIDE_STATE(state) {
      // debugger
      state.cardGuideShow = '0'
      uni.setStorageSync('cardGuideShow', state.cardGuideShow)
      console.log(state.cardGuideShow)
    },
    // 保存首页小助理引导
    CLOSE_KEFUGUIDE_STATE(state) {
      state.kefuGuideShow = '0'
      uni.setStorageSync('kefuGuideShow', state.kefuGuideShow)
    },
    // 保存我的推荐引导状态
    CLOSE_CARDGUIDE_RECOMMEND(state) {
      state.cardGuideRecomendShow = '0'
      uni.setStorageSync('cardGuideRecomendShow', state.cardGuideRecomendShow)
      console.log(state.cardGuideRecomendShow)
    },
    // 点赞/取消点赞文章
    changeLikeArticleIds(state, { type, id }) {
      if (type === 'add') {
        state.likeArticleIds.push(id)
      }
      if (type === 'cancel') {
        state.likeArticleIds.splice(state.likeArticleIds.findIndex(ele => ele === id), 1)
      }
      // console.log(state.likeArticleIds)
    },
    SET_PLATFORM_INFO(state, info) {
      state.platformInfo = info
      uni.setStorageSync('platformInfo', info)
    },
    // 获取自定义导航栏配置
    SET_GETSYSTEMINFO(state) {
      let systemInfo = uni.getSystemInfoSync();
      // 获取menu属性
      let rect = uni.getMenuButtonBoundingClientRect
        ? uni.getMenuButtonBoundingClientRect()
        : null; //胶囊按钮位置信息
      uni.getMenuButtonBoundingClientRect();
      state.menuTop = rect.top;
      state.navBarHeight = (function () {
        //导航栏高度
        let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
        return 2 * gap + rect.height;
      })();
    },
  },
  actions: {

  }
}