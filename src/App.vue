<script>
import { getSpuInfoByCode } from "@/api/tools";
import uma from 'umtrack-wx';

export default {
  methods: {
    // 解析scene值
    async fetchSpuInfo(_options) {
      await getSpuInfoByCode({ code: _options.scene }).then((res) => {
        console.log("onAppRoute getSpuInfo ", res);
        let data = JSON.parse(res.data);
        if (data.fromUserId) {  // 此为后台返回
          console.log("onAppRoute", data.fromUserId);
          this.$store.commit("SET_FROM_USER_ID", data.fromUserId);
        }
      });
    },
  },
  onLaunch: function() {
    console.log("App Launch");
    this.$store.commit("SET_FROM_USER_ID", '');
    //监听路由切换
    // #ifdef MP-WEIXIN
    wx.onAppRoute(route => {
      console.log('onAppRoute', route)
      if(route.query.scene){
        this.fetchSpuInfo(route.query);
      }
      if (route.query.shareUserId) {
        console.log("onAppRoute", route.query.shareUserId);
        this.$store.commit("SET_FROM_USER_ID", route.query.shareUserId);
      }
    });

    // #endif

    // #ifdef H5
    uni.hideTabBar()
    // #endif
  },
  onShow: function() {
    console.log("App Show");
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      // console.log(updateManager)
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
      });

      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });
    }
  },
  onHide: function() {
    console.log("App Hide");
  },
  created:function() {
    console.log('APP created');
    // #ifdef MP-WEIXIN
    uma.init({
      appKey:'605809fdb8c8d45c13a8f99e',
      useOpenid:true,
      autoGetOpenid:true,
      debug:true,
      uploadUserInfo:true,
    });
    // #endif
    console.log('友盟统计执行完 ------ ')
  }
};
</script>

<style lang='scss'>
/*每个页面公共css */
@import "./common/scss/index.scss";
</style>
