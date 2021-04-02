<template>
  <view id="login-phone" class="relative min-h-full">
    <custom-nav class="relative">
      <view class="plr20">
        <view class="radius-circle w64 h64 absolute" style="background-color:rgba(0,0,0,.2);top:0;left:40rpx;" @tap="goBack">
          <image :src="IMAGE.ICON_RETURN" style="width:64rpx;height:64rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/>
          <!-- <van-icon name="arrow-left" custom-style="color:rgba(18,19,20,1);width:48rpx;height:48rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/> -->
        </view>
        <view class="text-center h-full fs-lg-add fw600">
          登录
        </view>
      </view>
    </custom-nav>
    <block v-if="!showBindPhonePage">
      <image :src="IMAGE.LOGIN_POSTER" mode='widthFix' class="w-full fixed" style="z-index:-1;"></image>
      <view class="absolute plr80 ptb50" style="bottom:30rpx;left:50%;transform:translateX(-50%);">
        <!-- <view class="text-center">
          <image :src="IMAGE.LOGO" class="w-h244" />
        </view> -->
        <!-- <button
          class="login-btn mb20"
          :loading="loadingLogin"
          open-type="getUserInfo"
          @getuserinfo="onAuthUserInfo"
        >登录</button> -->
        <view>
          <button
            class="login-btn mb60"
            open-type="getUserInfo"
            @getuserinfo="onGetUserInfo"
            v-if="!bindingedStatus"
          >微信授权</button>
        </view>
        <view>
          <button
            class="login-btn mb20"
            :loading="loadingLogin"
            open-type="getPhoneNumber" 
            @getphonenumber="getPhoneNumber"
            v-if="bindingedStatus"
          >微信快捷登录</button>
          <button class="phone-btn" @tap="()=>{this.showBindPhonePage = true}" v-if="bindingedStatus">手机验证码登录</button>
        </view>
      </view>
    </block>
    <block v-if="showBindPhonePage">
      <view class="plr80 ptb50" :style="{'margin-top': navBarHeight+'px'}">
        <view>
          <border-title>绑定手机号</border-title>
          <!-- <view class="color-gray mt20">登录自动注册</view> -->
        </view>
        <view style="margin-top: 200rpx;">
          <input
            v-model="mobile"
            type="number"
            :maxlength="11"
            placeholder="输入手机号码"
            placeholder-class="placeholder-class"
            class="ptb30 hairline-bottom"
          />
          <view class="row space-between hairline-bottom center-y">
            <input
              placeholder="请输入验证码"
              v-model="smsCode"
              type="number"
              :maxlength="6"
              placeholder-class="placeholder-class"
              class="flex-1 ptb30"
            />
            <text v-if="showValidCodeBtn" style="color: #FF9EA8;" @click="onSendCode">发送验证码</text>
            <text v-else class="color-gray">{{ validTime }}s</text>
          </view>
          <button
            class="phone-login-btn"
            :loading="loadingLogin"
            :disabled="disalbedLogin"
            open-type="getUserInfo"
            @getuserinfo="onLogin"
          >登录</button>
          <view class="mt40 fs-sm color-gray text-center">
            完成登录/注册即代表你同意
            <text
              style="color: #FF9EA8;"
              @tap="$routerLink(`/pagesA/H5/index?name=userProtocol&title=用户协议`)"
            >用户协议</text>和
            <text
              style="color: #FF9EA8;"
              @tap="$routerLink(`/pagesA/H5/index?name=privacy&title=隐私政策`)"
            >隐私政策</text>
          </view>
          <!-- <view class="text-center" style="margin-top: 140rpx;">
            <button class="wechat-login-btn"></button>
            <text class="color-info fs-sm">微信登陆</text>
          </view>-->
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import BorderTitle from "./components/BorderTitle";
import CustomNav from "_c/CustomNav";
import { sendSms } from "@/api/tools/message";
import { validPhone } from "@/utils";
import { mapGetters } from "vuex";
import { LOGO, LOGIN_POSTER, ICON_RETURN } from "@/imageConfig";
import { getWxPhone } from '@/api/tools'

const VALID_TIME = 60; //验证码倒计时60s
export default {
  name: "LoginPhone",
  components: { BorderTitle, CustomNav },
  data() {
    return {
      IMAGE: {
        LOGO,
        LOGIN_POSTER,
        ICON_RETURN
      },
      fromPage: "", // 来源页面
      mobile: "", // 手机号码
      smsCode: "", // 验证码
      validTime: VALID_TIME,
      showValidCodeBtn: true,
      loadingLogin: false, // 登陆按钮loaing
      showBindPhonePage: false, // 是否显示手机绑定区域
      isClickSmsBtn: false, // 是否点击过验证码按钮
      wxCode:"",
      bindingedStatus:false,
      wxSetting:false, //是否已授权
      maxNum:0
    };
  },
  computed: {
    disalbedLogin() {
      return !this.mobile || this.smsCode.length < 6 || !this.isClickSmsBtn;
    },
    ...mapGetters(["authUserData","shareUserId","menuTop","navBarHeight"])
  },
  onShow(){
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
    if(this.authUserData.bindinged || this.wxSetting){
      this.bindingedStatus = true
    }
    this.maxNum = 0
  },
  async onLoad(options) {
    // console.log(options)
    if (options.from) {
      this.fromPage = options.from;
    }
    this.wxCode = await this.$store.dispatch("getWxCode");
  },
  methods: {
    onSendCode() {
      if (!this.mobile) {
        uni.showToast({
          icon: "none",
          title: "请输入手机号码",
          duration: 1000
        });
      } else if (!validPhone(this.mobile)) {
        uni.showToast({
          icon: "none",
          title: "手机号码格式不正确",
          duration: 1000
        });
      } else {
        this.isClickSmsBtn = true;
        sendSms(this.mobile).then(res => {
          console.log("发送验证码", res);
          uni.showToast({
            icon: "none",
            title: "发送成功，请注意查收",
            duration: 1000
          });
          this.validTime = VALID_TIME;
          this.showValidCodeBtn = false;
          let timer = setInterval(() => {
            if (this.validTime > 0) {
              this.validTime--;
              this.showValidCodeBtn = false;
            } else {
              this.validTime = VALID_TIME;
              this.showValidCodeBtn = true;
              clearTimeout(timer);
            }
          }, 1000);
        });
      }
    },
    // 获取微信用户信息
    async onAuthUserInfo(e) {
      console.log("获取微信用户信息", e);
      try {
        if (this.loadingLogin) return;
        this.loadingLogin = true;
        if (e.detail.errMsg === "getUserInfo:ok") {
          let wxCode = await this.$store.dispatch("getWxCode");
          let wxUserInfo = await this.$store.dispatch("getWxUserInfo");
          // console.log('wxUserInfo', wxUserInfo)
          if (wxUserInfo) {
            let check = await this.$store.dispatch("checkBindPhone", {
              code: wxCode,
              encryptedData: wxUserInfo.encryptedData,
              iv: wxUserInfo.iv
            });
            if (check.bindinged) {
              await this.$store.dispatch("appLogin");
              this.afterLoginSeccess();
            } else {
              this.showBindPhonePage = true;
              uni.setNavigationBarTitle({
                title: "绑定手机号"
              });
            }
          }
        } else {
          uni.showToast({ title: e.detail.errMsg, icon: "none" });
        }
      } catch (error) {
        console.log("登录catch", error);
        // uni.showToast({ title: '登录失败，请重试！', icon: 'none' })
      } finally {
        this.loadingLogin = false;
      }
    },
    // 绑定手机号并登录
    async onLogin(e) {
      console.log(e)
      if (!this.mobile) {
        uni.showToast({
          icon: "none",
          title: "请输入手机号码",
          duration: 1000
        });
        return;
      }
      if (!validPhone(this.mobile)) {
        uni.showToast({
          icon: "none",
          title: "手机号码格式不正确",
          duration: 1000
        });
        return;
      }
      if (!this.smsCode) {
        uni.showToast({
          icon: "none",
          title: "请输入验证码",
          duration: 1000
        });
        return;
      }
      try {
        this.loadingLogin = true;
        let wxCode = await this.$store.dispatch("getWxCode");
        let wxUserInfo = await this.$store.dispatch("getWxUserInfo");
        let check = await this.$store.dispatch("checkBindPhone", {
          code: wxCode,
          encryptedData: wxUserInfo.encryptedData,
          iv: wxUserInfo.iv
        });
        if (check.bindinged) {
          // 如果已绑定
          // 直接登录
          await this.$store.dispatch("appLogin");
        } else {
          // 绑定并登录
          await this.$store.dispatch("bindPhone", {
            encryptedData: wxUserInfo.encryptedData,
            iv: wxUserInfo.iv,
            mobile: this.mobile,
            smsCode: this.smsCode,
            unionId: check.unionId,
            fromUserId: this.shareUserId
          });
        }
        this.afterLoginSeccess();
      } catch (error) {
        console.log("绑定手机号并登录catch", error);
        // uni.showToast({ title: '请重试！', icon: 'none' })
      } finally {
        this.loadingLogin = false;
      }
    },
    afterLoginSeccess() {
      uni.showToast({
        icon: "none",
        title: "登录成功",
        duration: 1500
      });
      this.$eventHub.$emit(this.$eventName.LOGIN_SUCCESS)
      if (this.fromPage === "home") {
        // let pages = getCurrentPages();
        // let lastpage = pages[pages.length - 2];
        // lastpage.$vm.refreshFocusList();
        uni.reLaunch({ url: "/pages/tabbar/Home" });
      } else if (this.fromPage === "ShoppingCart") {
        uni.reLaunch({ url: "/pages/tabbar/ShoppingCart" });
      } else if (this.fromPage === "coupon") {
        uni.reLaunch({ url: "/pages/tabbar/ShoppingCart" });
      } else if (this.fromPage === "cdkey") {//跳转扫码兑换
        uni.navigateBack();
      } else {
        uni.navigateBack();
      }
      // console.log("跳转扫码兑换");
      // uni.reLaunch({ url: "/pagesA/activity/Coupon?type=0" });
    },
    async getPhoneNumber(e){
      console.log("getPhoneNumber==========================================",e)
      if(e.detail.errMsg == "getPhoneNumber:fail:user deny" || e.detail.errMsg == "getPhoneNumber:fail user deny"){
        return;
      }
      this.loadingLogin = true;
      console.log(this.authUserData);
      if (this.authUserData && this.authUserData.bindinged) {
        // 如果已绑定
        // 直接登录
        await this.$store.dispatch("appLogin");
        this.loadingLogin = false;
        this.afterLoginSeccess();
      } else {
        //判断Session失效没
        // uni.checkSession({
        //   success(){},
        //   fail: async ()=>{
        this.wxCode = await this.$store.dispatch("getWxCode");
        //   }
        // })
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
    goBack(){
      uni.navigateBack()
    },
    onGetUserInfo(e){
      console.log("onGetUserInfo",e)
      if (e.detail.errMsg === "getUserInfo:ok") {
        this.bindingedStatus = true
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#login-phone {
  .placeholder-class {
    color: $uni-color-gray;
    font-size: 28rpx;
  }
  .phone-login-btn{
    margin-top: 80rpx;
    background-color: #FF9EA8;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
    font-weight: 600;
    border-radius: 8rpx;
    color: #fff;
    font-size: 36rpx;
    &[disabled] {
      background-color: $uni-bg-color-primary;
    }
  }
  .login-btn {
    width: 676rpx;
    margin-top: 80rpx;
    background-color: #609E60;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
    font-weight: 600;
    border-radius: 8rpx;
    color: #fff;
    font-size: 36rpx;
    &[disabled] {
      background-color: $uni-bg-color-primary;
    }
  }
  .phone-btn{
    width: 676rpx;
    text-align: center;
    font-size:36rpx;
    font-weight:600;
    text-decoration:underline;
    color:rgba(119,124,131,1);
  }
  /deep/ .van-icon{
    font-size: 48rpx!important;
  }
}
</style>