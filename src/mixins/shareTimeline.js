export const shareTimeline = {
  created() {
    console.log("测试朋友圈分享")
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    // #endif
  }
}
