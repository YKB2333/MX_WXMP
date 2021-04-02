<template>
  <view class="page">
    <view class="color-red fs-mini mtb20 mlr30">*取消未支付的订单，优惠券可退回。其他情况优惠券不退回。</view>
    <block v-if="couponList&&couponList.length">
      <view
        v-for="(item,index) in couponList"
        :key="index"
        class="mlr30 mt20 bg-white relative radius10 hidden"
        @tap="changeCurCouponId(item)"
      >
        <view class="row space-between plr30 pt30" :class="{'filter-gray':!item.valid}">
          <view class="w440">
            <view class="fs-lg fw600 l-h60 ellipsis">{{item.title}}</view>
            <view class="fs-sm ellipsis">除特价商品外，满{{formatCouponMoney(item.fullreduceAmount)}}元可用</view>
          </view>
          <view class="color-red fs-sm fw600">
            ¥
            <text class="fs-60">{{formatCouponMoney(item.couponAmount)}}</text>
          </view>
        </view>
        <view class="coupon-line relative">
          <view
            v-if="!item.valid && item.validTip.length>0"
            class="color-red coupon-tag text-center"
          >{{item.validTip}}</view>--------------------------------------------------------------------------------
        </view>
        <view class="row space-between plr30 pb30">
          <view>
            <view style="color:#9DA0A4;" class="fs-sm">有效期</view>
            <view
              style="color:#9DA0A4;"
              class="fs-sm"
            >{{item.startTime | formatTime( 'Y/M/D')}}~{{item.endTime | formatTime( 'Y/M/D')}}</view>
          </view>
          <!-- 未使用 -->
          <!-- 当前选中状态 -->
          <!-- 不能用 -->
          <view
            v-if="skus&&skus.length>0"
            class="fs-22 coupon-bg"
            :class="{'coupon-bg-theme':item.status==0,'coupon-bg-active':curCouponId==item.id,'coupon-bg-filter':!item.valid}"
            @tap.stop="quickUse(item)"
          >{{item.btnTip=="使用中"?"立即使用":item.btnTip}}</view>
          <view
            v-else
            class="fs-22 coupon-bg"
            :class="{'coupon-bg-theme':item.status==0,'coupon-bg-filter':fromPage=='comfirmOrder'? true : !item.valid}"
            @tap.stop="jump2mall()"
          >{{item.btnTip}}</view>
        </view>
        <view class="absolute coupon-img-box" v-show="curCouponId==item.id&&skus&&skus.length>0">
          <image :src="IMAGE.COUPON_GOU" class="w-h64" />
        </view>
      </view>
    </block>
    <view class="text-center" v-else style="padding-top:200rpx;">
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258 mb40" />
      <view class="color-info">您暂时还没有优惠券哦~</view>
    </view>
    <view style="color:#9DA0A4;" class="text-center mt30 fs-22">共{{couponList.length||0}}张优惠券</view>
  </view>
</template>

<script>
import {
  getAddressList,
  setDefaultAddress,
  deleteAddress
} from "@/api/user/address";
import { getAllCouponByUserId } from "@/api/activity/coupon";
import {
  COUPON_GOU,
  RADIO_ACTIVE,
  RADIO_INACTIVE,
  NULL_BOX_IMG
} from "@/imageConfig";

export default {
  name: "AddressList",
  components: {},
  data() {
    return {
      IMAGE: {
        COUPON_GOU,
        RADIO_ACTIVE,
        RADIO_INACTIVE,
        NULL_BOX_IMG
      },
      addressList: [], // 获取收货地址
      refSelectedAddressId: "",
      fromPage:"",
      skus:null,//订单sku数据
      sourceType: "", //用于接收前一个页面跳转过来的标识，用于订单确认页面回调选择地址用
      couponList: [], //优惠券
      curCouponId: "", //当前优惠券id
    };
  },
  onShow() {
    this.init();
  },
  onLoad(options) {
    console.log(options);
    this.curCouponId = options.couponId;
    this.fromPage = options.fromPage;
    if(options.skus){
      this.skus = JSON.parse(options.skus);
    }
    console.log(this.curCouponId);
  },
  computed: {
    //优惠券金额除以100
    formatCouponMoney() {
      return money => {
        return money / 100;
      };
    },
    //优惠券状态[-2:失效,-1:已过期,0:未使用,1:使用中,2:已使用]
  },
  methods: {
    init() {
      if(this.skus){
        getAllCouponByUserId(this.skus).then(res => {
          console.log("优惠卷", res);
          this.couponList = res.data;
        });
      }else{
        getAllCouponByUserId().then(res => {
          console.log("优惠卷", res);
          this.couponList = res.data;
        });
      }
    },
    quickUse(couponObj) {
      // if (couponObj.id == this.curCouponId) {
      //   this.curCouponId == "";
      //   return ;
      // }
      console.log(couponObj);
      this.curCouponId = couponObj.id;
      this.$eventHub.$emit(this.$eventName.SELECT_COUPON, this.curCouponId);
    },
    changeCurCouponId(couponObj) {
      if (!couponObj.valid || (this.skus&&this.skus.length==0)) {
        return;
      }
      if (couponObj.id == this.curCouponId) {
        this.curCouponId = "";
      } else {
        this.curCouponId = couponObj.id;
      }
      console.log(this.curCouponId);
      this.$eventHub.$emit(this.$eventName.SELECT_COUPON, this.curCouponId);
    },
    jump2mall() {
      // uni.navigateTo({
        // url: `/pagesA/activity/Happiness`
      // });
      uni.switchTab({
        url: `/pages/tabbar/Mall`
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  background: #f2f4fa;
  padding-bottom: 100rpx;
}
.integral {
  position: absolute;
  left: 12%;
  top: 50%;
  transform: translate(0, -50%);
}
.btn-red {
  display: inline-block;
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  background: rgba(157, 160, 164, 0);
  border: 2rpx solid rgba(255, 56, 56, 1);
  color: #ff3838;
  border-radius: 20rpx;
  font-size: 12px;
}
.btn-black {
  display: inline-block;
  text-align: center;
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
  background: rgba(157, 160, 164, 0);
  font-size: 12px;
  border: 2rpx solid #121314;
  color: #121314;
  border-radius: 20rpx;
}
.fs-60 {
  font-size: 60rpx;
}
.fs-22 {
  font-size: 22rpx;
}
.coupon-line {
  height: 60rpx;
  line-height: 60rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: rgba(157, 160, 164, 0.29);
  overflow: hidden;
}
.coupon-line::before {
  content: "";
  position: absolute;
  display: inline-block;
  top: 18rpx;
  left: -15rpx;
  width: 30rpx;
  height: 30rpx;
  background-color: #F1F3F9;
  border-radius: 50%;
}
.coupon-line::after {
  content: "";
  position: absolute;
  display: inline-block;
  top: 18rpx;
  right: -15rpx;
  width: 30rpx;
  height: 30rpx;
  background-color: #F1F3F9;
  border-radius: 50%;
}
.coupon-bg {
  border-radius: 24rpx;
  line-height: 48rpx;
  height: 48rpx;
  width: 156rpx;
  text-align: center;
}
.coupon-bg-theme {
  background-color: #FF9EA8;
  color: white;
}
.coupon-bg-active {
  // background-color: rgba(255, 209, 0, 0.29) !important;
  background-color: rgba(255, 158, 168, 0.5) !important;
  color: rgba(18, 19, 20, 0.29);
}
.coupon-bg-filter {
  pointer-events: none;
  background: rgba(157, 160, 164, 0.3);
  color: rgba(18, 19, 20, 0.3);
}
.coupon-img-box {
  top: 0;
  right: 0;
}
.coupon-tag {
  display: inline-block;
  padding: 0 16rpx;
  height: 32rpx;
  font-size: 18rpx;
  line-height: 32rpx;
  background: rgba(255, 207, 207, 1);
  border-radius: 16rpx;
  transform: translate3d(15rpx, -6rpx, 0);
  margin-left: 15rpx;

}
.filter-gray {
  pointer-events: none;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
  opacity: 0.5;
}
.radius10 {
  border-radius: 10rpx;
}
</style>

