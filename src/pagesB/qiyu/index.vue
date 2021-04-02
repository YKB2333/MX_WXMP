<template> </template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  onShow() {
    let myPluginInterface = requirePlugin("qiyu");
    let appId = "KIRSm1kKwpR";
    myPluginInterface.__configAppId(appId); // 不是微信的appId，是七鱼后台生成的appId
    myPluginInterface._$configAppKey("f69dce2d8ce65debc6c228b719e81cf2"); // 申请企业的appKey
    if (this.userInfo && this.userInfo.id) {
      console.log(this.userInfo.id,this.userInfo.nickName,this.userInfo.mobile,this.userInfo.headImgUrl)
      let userInfo = {
        userId: this.userInfo.id,
        data: [
          { key: "real_name", label: "昵称", value: this.userInfo.nickName },
          { key: "mobile_phone", label: "手机号", value: this.userInfo.mobile },
          { key: "email", label: "邮箱", value: "" },
          {
            key: "reg_date",
            label: "创建时间",
            value: this.userInfo.createdTime,
          },
          { key: "avatar", label: "头像", value: this.userInfo.headImgUrl },
        ],
      };
      myPluginInterface._$setUserInfo(userInfo);
    }
    uni.redirectTo({
      url: "plugin://qiyu/chat",
    });
  },
};
</script>

<style></style>
