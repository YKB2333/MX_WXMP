<template>
  <view class="page">
    <view class="color-red fs-mini mtb20 mlr30">*取消未支付的订单，优惠券可退回。其他情况优惠券不退回。</view>
    <block v-if="couponList&&couponList.length">
      <!-- <view class="mlr30 mt20 p30 bg-white relative" style=""> -->
      <view
        v-for="(item,index) in couponList"
        :key="index"
        class="mlr30 mt20 p30 bg-white relative"
        :class="{'filter-gray':item.status!=0}"
      >
        <view class="row space-between">
          <view class="w440">
            <view class="fs-lg ellipsis">{{item.title}}</view>
            <view class="fs-sm ellipsis">除特价商品外，满{{formatCouponMoney(item.fullreduceAmount)}}元可用</view>
          </view>
          <view class="color-red fs-sm">
            ¥
            <text class="fs-60">{{formatCouponMoney(item.couponAmount)}}</text>
          </view>
        </view>
        <view class="coupon-line">---------------------------------------------------------</view>
        <view class="row space-between">
          <view>
            <view style="color:#9DA0A4;" class="fs-sm">有效期</view>
            <!-- <view style="color:#9DA0A4;" class="fs-sm">{{formatTimeStr(item.createTime)}}~{{item.endTime}}</view> -->
            <view
              style="color:#9DA0A4;"
              class="fs-sm"
            >{{item.startTime | formatTime( 'Y/M/D')}}~{{item.endTime | formatTime( 'Y/M/D')}}</view>
          </view>
          <view class="fs-22 coupon-bg-theme" @tap="jumpHappiness">{{item.btnTip}}</view>
        </view>
      </view>
    </block>
    <view class="text-center" v-else style="padding-top:200rpx;">
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258 mb40" />
      <view class="color-info">您暂时还没有优惠券哦~</view>
    </view>
    <view style="color:#9DA0A4;" class="text-center mt30 fs-22">共{{couponList.length}}张优惠券</view>
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
        NULL_BOX_IMG
      },
      couponList: [] // 优惠券列表
    };
  },
  onShow() {
    this.init();
  },
  onLoad(options) {
    console.log(options);
  },
  computed: {
    //优惠券金额除以100
    formatCouponMoney() {
      return money => {
        return money / 100;
      };
    },
    //优惠卷状态
    couponStatus() {
      return status => {
        //优惠券状态[-2:失效,-1:已过期,0:未使用,1:使用中,2:已使用]
        if (status === -2) {
          return "失效";
        } else if (status === -1) {
          return "已过期";
        } else if (status === 1) {
          return "使用中";
        } else if (status === 2) {
          return "已使用";
        }
      };
    }
  },
  methods: {
    init() {
      // 获取优惠券列表
      getAllCouponByUserId().then(res => {
        console.log("优惠卷", res);
        this.couponList = res.data;
      });
    },
    jumpHappiness() {
      uni.navigateTo({
        url: `/pagesA/activity/Happiness`
      });
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
  font-size: 16px;
  font-weight: 400;
  color: rgba(157, 160, 164, 0.29);
  overflow: hidden;
}
.coupon-bg-theme {
  background-color: #FF9EA8;
  border-radius: 24rpx;
  line-height: 48rpx;
  height: 48rpx;
  width: 156rpx;
  text-align: center;
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
}
.filter-gray {
  pointer-events: none;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
  opacity: 0.5;
}
</style>

