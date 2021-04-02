const getters = {
  shareUserId: state => state.user.shareUserId,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  authUserData: state => state.user.authUserData,
  isLogout: state => state.user.isLogout,
  // 是否绑定手机
  isBindPhone: state => {
    let data = state.user.authUserData
    return data && data.bindinged
  },
  isUserInApp: state => state.app.isUserInApp,
  searchHistory: state => state.app.searchHistory,
  vipGuidePopup: state => state.app.vipGuidePopup,
  cardGuideShow: state => state.app.cardGuideShow,
  kefuGuideShow: state => state.app.kefuGuideShow,
  cardGuideRecomendShow: state => state.app.cardGuideRecomendShow,
  likeArticleIds: state => state.app.likeArticleIds,
  platformInfo: state => state.app.platformInfo,
  menuTop:state => state.app.menuTop,
  navBarHeight:state => state.app.navBarHeight,
}
export default getters
