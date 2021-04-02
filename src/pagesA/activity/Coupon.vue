<template>
  <view class="page">
    <custom-nav>
      <view class="plr20">
        <view class="radius-circle w64 h64 relative" style="background-color:rgba(0,0,0,.2)" @tap="jump2home">
          <van-icon name="arrow-left" custom-style="color:rgba(18,19,20,1);width:48rpx;height:48rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/>
        </view>
      </view>
    </custom-nav>
    <!-- <view
      :title="title"
      class="fixed custom-nav"
    > -->
      <!-- <view slot="left" class="radius-circle w64 h64" :style="{'background-color':'rgba(0,0,0,.2)','transform':'translateY('+menuTop +'rpx)'}"> -->
      <!-- </view> -->
    <!-- </view> -->
    <!-- <image :src="imgUrl" mode='widthFix' class="w-full fixed" style="z-index:-1;"></image> -->
    <image :src="imgUrl" mode='widthFix' class="w-full fixed" style="z-index:-1;"></image>
    <template v-if="type==0">
      <view class="p62 bg-white absolute bottom-box" style="bottom:140rpx;">
        <view class="text-center key-title">秒寻·分享美好生活</view>
        <input type="text" class="l-h88 h88 mt60 pl40" placeholder="输入兑换码" style="background:rgba(245,245,246,1);" v-model="CDKEY" />
        <button class="confirm-btn mb10" @tap="getCoupon">领取优惠券</button>
        <view>
          <van-radio-group :value="radio" @change="onChangeRadio">
            <van-radio name="1" checked-color="#FF9EA8" icon-size="16px">我已阅读<text @tap="jump2rule" class="fs-mini" style="text-decoration:underline;color:#4F75B3;">《秒寻商城活动规则》</text></van-radio> 
          </van-radio-group> 
        </view>

      </view>
    </template>
    <template v-else-if="type==1">
      <view class="p62 bg-white absolute bottom-box" style="bottom:40rpx;">
        <view class="text-center key-title">秒寻·分享美好生活</view>
        <view class="mt60">
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
            <text v-if="showValidCodeBtn" style="color: #FF3838;" @click="onSendCode">获取验证码</text>
            <text v-else class="color-gray">{{ validTime }}s</text>
          </view>
          <button
            class="login-btn"
            :loading="loadingLogin"
            :disabled="disalbedLogin"
            open-type="getUserInfo"
            @getuserinfo="onLogin"
          >领取优惠券</button>
          <view>
            <van-radio-group :value="radio" @change="onChangeRadio">
              <van-radio name="1" checked-color="#FFD100" icon-size="16px">我已阅读<text @tap="jump2rule" class="fs-mini" style="text-decoration:underline;color:#4F75B3;">《秒寻商城活动规则》</text></van-radio> 
            </van-radio-group> 
          </view>
          <!-- <view class="text-center" style="margin-top: 140rpx;">
            <button class="wechat-login-btn"></button>
            <text class="color-info fs-sm">微信登陆</text>
          </view>-->
        </view>
      </view>
    </template>
    <template v-else-if="type==2">系统派发</template>
    <!-- 兑换成功弹窗 -->
    <van-popup :show="showCouponPopup" custom-class="bg-opacity" @close="showCouponPopup=false">
      <view class="bg-red ptb60 mb60">
        <view class="text-center popup-title mb22" style="width:664rpx;">优惠券到账啦</view>
        <view class="text-center popup-msg mb42">已领取优惠券可在 秒寻小程序-个人中心 查看</view>
        <view  style="max-height:600rpx;overflow:auto;">
          <view class="relative mb24" v-for="(item,idx) in couponList" :key="idx">
            <view class="h50 w24 bg-red radius absolute" :style="{left: couponLeftWidth+'px',top: '-18%'}"></view>
            <view class="coupon-card row ptb40 mauto space-around hidden">
              <view class="pl20 pr40 couponLeftWidth" style="border-right: 1px dashed rgba(157,160,164,1);">
                <view class="fw600 fs-lg mb10 ellipsis w350">{{item.title}}</view>
                <view class="fs-sm ellipsis">除特价商品外，满{{ formatCouponMoney(item.fullreduceAmount) }}元可用</view>
                <view class="fs-sm">有效期:{{item.startTime | formatTime( 'Y/M/D')}}-{{item.endTime | formatTime( 'Y/M/D')}}</view>
              </view>
              <view class="fw600 l-h100 flex-1 text-center" style="font-size:38rpx;">¥<text style="font-size:60rpx;">{{ formatCouponMoney(item.couponAmount) }}</text></view>
            </view>
            <view class="h50 w24 bg-red radius absolute" :style="{left: couponLeftWidth+'px',bottom: '-18%'}"></view>
          </view>
        </view>
        <button
          class="mt40 home-button"
          :loading="loadingLogin"
          @tap="jump2home"
        >前往小程序使用</button>
      </view>
      <!-- <view class="text-center mt50"><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h90" @tap="closePopup" /></view> -->
    </van-popup>
  </view>
</template>

<script>
import { getExchangeCoupon, getActivityCouponImg } from "@/api/activity/coupon.js"
import { LOGIN_POSTER, ICON_CLOSE_WHITE } from '@/imageConfig'
import { sendSms } from "@/api/tools/message";
import { validPhone } from "@/utils";
import { mapGetters } from "vuex";
import CustomNav from "_c/CustomNav";
const VALID_TIME = 60; //验证码倒计时60s

export default {
  data() {
    return {
      type: 0, //优惠券领取方式
      CDKEY: "",
      showCouponPopup: false,
      IMAGE:{
        LOGIN_POSTER,
        ICON_CLOSE_WHITE
      },
      menuTop:"", //菜单高度
      radio: "0",
      mobile: "", // 手机号码
      smsCode: "", // 验证码
      couponList:[],
      validTime: VALID_TIME,
      showValidCodeBtn: true,
      loadingLogin: false, // 登陆按钮loaing
      showBindPhonePage: false, // 是否显示手机绑定区域
      isClickSmsBtn: false, // 是否点击过验证码按钮
      imgUrl:"",
      navBarHeight:"",
      couponLeftWidth:0
    };
  },
  components:{
    CustomNav
  },
  computed: {
    disalbedLogin() {
      return !this.mobile || this.smsCode.length < 6 || !this.isClickSmsBtn || this.radio!=1;
    },
    //优惠券金额除以100
    formatCouponMoney() {
      return money => {
        return money / 100;
      };
    },
    ...mapGetters(["shareUserId","token"])
  },
  onLoad(options) {
    console.log("领劵中心", options);
    if (options.type) {
      // relanch没返回参数
      this.activityId = options.id
      console.log(this.activityId)
      this.init()
    }
  },
  methods: {
    init(){
        this.fetchActivityCouponImg()
        // this.getSystemInfo()
    },

    //获取活动图片
    fetchActivityCouponImg(){
        getActivityCouponImg(this.activityId).then(res=>{
          console.log(res)
          this.imgUrl = res.data
        })
    },
    //获取优惠券
    getCoupon() {
      // uni.showToast({ title: '兑换码错误', icon: 'none' })
      // uni.showToast({ title: '兑换码已使用', icon: 'none' })
      // uni.showToast({ title: "兑换活动暂未开始", icon: "none" });
      if(!this.token){
        console.log(this.token)
        uni.navigateTo({
          url:"/pages/login/Phone?from=cdkey"
        })
        return ;
      }
      if(this.CDKEY){
        if(this.radio == 1){
          uni.showLoading({title:"领劵中...",mask:true})
          getExchangeCoupon(this.CDKEY).then(res=>{
            console.log("兑换码",res)
            if(res.data){
              setTimeout(()=>{
                let query = wx.createSelectorQuery()
                query.select('.couponLeftWidth').boundingClientRect((res) => {
                  this.couponLeftWidth = res.width + 10 || 0
                  console.log(this.couponLeftWidth)
                }).exec()
              },1000)
              this.couponList = res.data;
              this.showCouponPopup = true;
              uni.hideLoading()
            }
          }).catch(err=>{
              uni.showToast({ title: err.resInfo, icon: 'none' })
          })
        }else{
            uni.showToast({ title: "请勾选已阅读活动规则", icon: 'none' })
        }
      }else{
          uni.showToast({ title: "请输入兑换码", icon: 'none' })
      }
    },
    jump2home() {
      uni.reLaunch({ url: "/pages/tabbar/Home" });
    },
    jump2rule(){
      uni.navigateTo({ url: "/pagesA/activity/Rule" });
    },
    //关闭y优惠券弹窗
    closeCouponPopup() {
      console.info("默认弹窗关闭事件");
      this.showCouponPopup = false;
    },
    onChangeRadio(e){
      console.log(this.radio,e)
      if(this.radio){
        this.radio = "" 
      }else{
        this.radio = e.detail;
      }
    },
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
    // 关闭弹窗
    closePopup() {
      console.info('默认弹窗关闭事件')
      this.showCouponPopup = false
    },
  }
};
</script>

<style lang="scss" scoped>
.page{
  .confirm-btn {
    margin-top: 40rpx;
    background-color: $uni-color-pink;
    text-align: center;
    color: white;
    height: 88rpx;
    line-height: 88rpx;
    font-weight: 600;
    border-radius: 60rpx;
    &[disabled] {
      background-color: $uni-bg-color-primary;
    }
  }
  .key-title{
    font-size:36rpx;
    font-weight:600;
    width: 570rpx;
  }
  .bottom-box{
    box-shadow:0px -3rpx 27rpx 0px rgba(0, 0, 0, 0.23);
    border-radius:32rpx;
    left: 50%; 
    transform: translate(-50%, 0);
  }
  .login-btn {
    background-color: $uni-color-theme;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
    font-weight: 600;
    border-radius: 60rpx;
    &[disabled] {
      background-color: $uni-bg-color-primary;
    }
  }
  .home-button{
    width:570rpx;
    background-color:#FFD100;
    box-shadow:0px -3rpx 27rpx 0rpx rgba(0, 0, 0, 0.23);
    border-radius:32rpx;
  }
  .popup-title{
    font-size:36rpx;
    font-weight:600;
    color:rgba(255,255,255,1);
  }
  .popup-msg{
    font-size:24rpx;
    color:rgba(255,255,255,1);
    opacity:0.5;
  }
  .coupon-card{
    width:599rpx;
    background:rgba(255,255,255,1);
    box-shadow:0px -3rpx 27rpx 0px rgba(0, 0, 0, 0.1);
    border-radius:10rpx;
  }
  .suXian{
    transform:rotate(90deg);
    font-size:16px;
    color:rgba(157,160,164,1);
    opacity:0.3;
    max-height: 100%;
  }
  /deep/ .bg-red{
    background-color: #FF3838 !important;
    border-radius: 32rpx;
  }
  /deep/ .van-popup{
    // height:100%;
    overflow: hidden;
    >.bg-red{
      // transform: translateY(10%);
    }
  }
  /deep/ .bg-opacity{
    background-color: transparent;
  }
  /deep/ .van-icon-success{
    color: #fff;
  }
  /deep/ .van-radio__label{
    font-size: 22rpx;
  }
  /deep/ .van-radio{
    margin-left: 56rpx;
  }
  /deep/ .van-nav-bar{
    background-color: transparent;
  }
  /deep/ .van-icon-arrow-left{
    font-size: 48rpx!important;
    color: #000;
  }
  /deep/ .van-nav-bar__left{
    transform: translateY(16rpx);
  }
  /deep/ .van-icon{
    font-size: 48rpx!important;
  }
  /deep/ .van-icon-success{
    font-size: 32rpx!important;
  }
  /deep/ .van-radio__label{
    margin-left: 0;
  }
  /deep/ .van-radio__icon-wrap{
    padding: 28rpx 20rpx 28rpx 60rpx;
  }
}
</style>