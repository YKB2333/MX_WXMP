<template>
  <view class="col center-x relative">
    <view class="mt72 mb68">
      <image :src="IMAGE.LOGO" class="w-h136" />
      <view class="absolute w-h112" style="top:0;right:0" @tap="closePopup()">
        <image :src="IMAGE.MINE_ICON_CLOSE" class="w-h32 pos-center" />
      </view>
    </view>
    <view class="fw600 l-h40 mb40" style="font-size:40rpx;">
      为获得更优质的服务
    </view>
    <view class="fs-lg l-h32 mb72" style="color:#9A9A9A;font-weight:500;">
      您可使用微信授权的方式进行登录
    </view>
    <view class="mlr40 mb80">
      <button
        class="login-btn"
        open-type="getUserInfo"
        @getuserinfo="onGetUserInfo"
        v-if="!bindingedStatus"
      >
        微信授权
      </button>
      <button
        class="login-btn"
        :loading="loadingLogin"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        v-if="bindingedStatus"
      >
        微信快捷登录
      </button>
    </view>
  </view>
</template>

<script>
import { MINE_ICON_CLOSE,LOGO, } from '@/imageConfig'
import { getWxPhone } from '@/api/tools'
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo", "authUserData", "shareUserId"]),
  },
  data(){
    return{
      IMAGE: {
        MINE_ICON_CLOSE,LOGO,
      },
      bindingedStatus:false, //是否绑定过手机
      loadingLogin: false, // 登陆按钮loaing
      maxNum:0,
      wxSetting:false, //是否已授权
    }
  },
  created(){
    uni.getSetting({
      success: (setting) => {
        console.log("setting",setting)
        if (setting.authSetting['scope.userInfo']){
          this.wxSetting = true
        }else{
          this.wxSetting = false
        }
      },
      fail: () => {
        console.log('getSetting fail')
        this.wxSetting = false
        resolve(null)
      }
    })
    if(this.authUserData && this.authUserData.bindinged || this.wxSetting){
      this.bindingedStatus = true
    }
    this.maxNum = 0
  },
  methods:{
    onGetUserInfo(e){
      console.log("onGetUserInfo",e)
      if (e.detail.errMsg === "getUserInfo:ok") {
        this.bindingedStatus = true
      }else{
        this.authPopup = false;
      }
    },  
    closePopup(){
      this.$emit("close-popup",'auth')
    },
    //获取手机号
    async getPhoneNumber(e){
      console.log("getPhoneNumber==========================================",e)
      if(e.detail.errMsg == "getPhoneNumber:fail:user deny"|| e.detail.errMsg == "getPhoneNumber:fail user deny"){
        this.authPopup = false;
        return;
      }
      this.loadingLogin = true;
      console.log(this.authUserData);
      if (this.authUserData && this.authUserData.bindinged) {
        console.log("缓存中已绑定")
        // 如果已绑定
        // 直接登录
        await this.$store.dispatch("appLogin");
        this.loadingLogin = false;
        this.authPopup = false
        this.afterLoginSeccess();
      } else {
        console.log("缓存中没绑定")
        //判断Session失效没
        this.wxCode = await this.$store.dispatch("getWxCode");
        try {
          let wxUserInfo = await this.$store.dispatch("getWxUserInfo");
          //获取手机号 code只能用一次
          let phoneNumber = await getWxPhone({
            code: this.wxCode,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          })
          
          let wxCode2 = await this.$store.dispatch("getWxCode");
          // let wxUserInfo = await this.$store.dispatch("getWxUserInfo");
          let check = await this.$store.dispatch("checkBindPhone", {
            code: wxCode2,
            encryptedData: wxUserInfo.encryptedData,
            iv: wxUserInfo.iv
          });

          if (check.bindinged) {
            // 如果已绑定
            // 直接登录
            let res = await this.$store.dispatch("appLogin");
            console.log(res)
          } else {
            console.log("bindWxPhone",phoneNumber.data);
            // 绑定并登录 todo...
            await this.$store.dispatch("bindWxPhone", {
                encryptedData: wxUserInfo.encryptedData,
                iv: wxUserInfo.iv,
                mobile: phoneNumber.data,
                unionId: check.unionId,
                fromUserId: this.shareUserId
            });
          }
          this.loadingLogin = false;
          this.authPopup = false
          this.afterLoginSeccess();
        } catch (error) {
          console.log("绑定手机号并登录catch", error);
          this.wxCode = await this.$store.dispatch("getWxCode");
          //超过5次请关闭小程序后重进
          this.maxNum += 1;
          console.log(this.maxNum)
          if(this.maxNum>5){
            uni.showToast({ title: '请关闭小程序重进！', icon: 'none' })
            return;
          } 
          uni.showToast({ title: '请稍后重试！', icon: 'none' })
        } finally {
          this.loadingLogin = false;
        }
      }
    },
    //登录成功后
    afterLoginSeccess() {
      uni.showToast({
        icon: "none",
        title: "登录成功",
        duration: 1500
      });
      this.$eventHub.$emit(this.$eventName.LOGIN_SUCCESS)
      this.closePopup()
      this.$emit("reload")
    },
  }
};
</script>

<style scoped>
.login-btn{
  background-color: #07C160;
  color: #FFFFFF;
  font-size: 34rpx;
  border-radius: 12px;
  height: 104rpx;
  line-height: 104rpx;
}
</style>
