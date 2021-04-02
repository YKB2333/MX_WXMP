<template>
  <view></view>
</template>

<script>
import { getSpuInfoByCode } from "@/api/tools";
export default {
  name: "Start",
  data() {
    return {};
  },
  async onLoad(options) {
    // #ifdef MP-WEIXIN
    let _options = options;
    console.log(_options);
    if (_options.scene) {
      await this.fetchSpuInfo(_options);
      // console.log(_options)
    }
    if (this.$store.getters.isUserInApp) {
      let url = this.getRouteUrl(_options);
      uni.reLaunch({
        url: url,
      });
      this.$store.commit("SET_USER_IN_APP_STATE", true);
    } else {
      try {
        console.log("start", _options);
        let wxCode = await this.$store.dispatch("getWxCode");
        let wxUserInfo = await this.$store.dispatch("getWxUserInfo");
        console.log("wxUserInfo", wxUserInfo);
        if (wxUserInfo) {
          this.$store.commit("SET_TOKEN", ""); // 防止一进来session失效
          // 检查是否绑定手机
          let check = await this.$store.dispatch("checkBindPhone", {
            code: wxCode,
            encryptedData: wxUserInfo.encryptedData,
            iv: wxUserInfo.iv,
          });
          if (check.bindinged && !this.$store.getters.isLogout) {
            await this.$store.dispatch("appLogin");
          } else {
            await this.$store.dispatch("clearUserData");
          }
        } else {
          await this.$store.dispatch("clearUserData");
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("clearUserData");
      } finally {
        let url = this.getRouteUrl(_options);
        uni.reLaunch({
          url: url,
        });
        this.$store.commit("SET_USER_IN_APP_STATE", true);
      }
    }
    this.$store.commit("SET_GETSYSTEMINFO");
    // #endif

    // #ifdef H5
    uni.reLaunch({
      url: this.$pageUrl.HOME
    });
    // #endif
  },
  methods: {
    // 获取跳转链接
    getRouteUrl(_options) {
      let sharePage = _options.sharePage || "";
      let url = `/pages/tabbar/Mall`; // 默认首页
      if (sharePage) {
        if (sharePage === "mall") {
          // 商城页
          url = `/pages/tabbar/Mall`;
        } else if (sharePage === "spu" && _options.spuId) {
          // 商详页
          url = `/pages/spu/index?spuId=${_options.spuId}`;
        } else if (sharePage === "article" && _options.id) {
          // 文章详情页
          url = `/pages/article/index?id=${_options.id}`;
        } else if (sharePage === "coupon" && _options.id) {
          // 兑换码页
          url = `/pagesA/activity/Coupon?id=${_options.id}&type=coupon`;
        } else if (sharePage === "goods" && _options.activityId) {
          // 专题页或限时购
          url = `/pagesA/activity/Goods?activityId=${_options.activityId}&type=${_options.type}`;
        } else if (sharePage === "special" && _options.activityId) {
          // 自定义专题页
          url = `/pagesA/activity/Special?activityId=${_options.activityId}`;
        } else if (sharePage === "special-list" && _options.activityId) {
          // 自定义专题页-查看更多页
          url = `/pagesA/goods-list/special-list?activityId=${_options.activityId}`;
        }
      }
      console.log("start=============", url);
      return url;
    },
    // 解析scene值
    async fetchSpuInfo(_options) {
      await getSpuInfoByCode({ code: _options.scene }).then((res) => {
        console.log(res);
        let data = JSON.parse(res.data);
        Object.keys(data).forEach((item) => {
          _options[item] = data[item];
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>