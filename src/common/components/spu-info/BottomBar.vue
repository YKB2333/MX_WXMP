<template>
  <view class="bottom-bar-container row center-y">
    <view class="row center-y">
      <!-- #ifdef MP-WEIXIN -->
       <view class="cart-btn-wrapper relative" v-if="ysf">
          <!-- :session-from="`ysf.config=${ysf.config}|groupid=398881453|staffid=3856743`" -->
        <button
          open-type="contact"
          :send-message-title="ysf.title"
          :session-from="`ysf.config=${ysf.config}`"
          show-message-card="true"
          class="inline-block w-h-full absolute"
          style="overflow:unset;opacity:0;z-index:1;"
        ></button>
        <image :src="asisUrl" class="w-h80" />
        <view class="badge bg-pink" style="top: 6rpx;right: 42rpx;">?</view></view
      >
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="cart-btn-wrapper relative" v-if="ysf" @tap="toChat">
        <view class="inline-block w-h-full absolute" style="overflow:unset;opacity:0;z-index:1;"></view>
        <image :src="asisUrl" class="w-h80"/>
        <view class="badge bg-pink" style="top:6rpx;right:42rpx;">?</view>
      </view>
      <!-- #endif -->
      <view class="cart-btn-wrapper" @tap="onCartTap">
        <image :src="IMAGE.CART" class="w-h52" />
        <!-- <view class="mt12" style="font-size:22rpx;">购物车</view> -->
        <view class="badge bg-pink" v-if="cartCount > 0">{{
          cartCount > 9 ? "9+" : cartCount
        }}</view>
      </view>
      <view class="cart-btn-wrapper" @tap="onShareTap" v-if="showShareBtn">
        <image :src="IMAGE.BTN_SHARE" class="w-h52"
      /></view>
    </view>
    <block v-if="spuStatus == 0 || salesStock <= 0">
      <view
        style="background-color: #F5F5F5; height: 100%;"
        class="flex-1 row center color-gray ml20"
        >{{
          spuStatus == 0 ? "已下架" : salesStock == 0 ? "已售罄" : ""
        }}</view
      >
    </block>
    <block v-else>
      <block v-if="onlyAddCartBtn">
        <view
          style="background-color: #121314; height: 100%;"
          class="flex-1 row center color-white ml20 radius"
          @tap="onAddCartTap"
        >
          <text v-show="!hideAddCartText">加入购物车</text>
          <slot name="loading-cart"></slot>
        </view>
      </block>
      <block v-else-if="spuStatus == 1 && salesStock > 0">
        <view class="flex-1 row l-h40" style="height:100%;">
          <view class="add-cart-btn" @tap="onAddCartTap">
            <view v-show="!hideAddCartText">加入购物车</view>
            <slot name="loading-cart"></slot>
          </view>
          <view class="buy-btn bg-pink" @tap="onBuyTap">
            <view class="color-white">立即购买</view>
            <!-- <view class="color-white fs-sm ellipsis">({{ buyBtnText }})</view> -->
          </view>
        </view>
        <!-- <view class="share-btn" @tap="onShareTap" v-if="showShareBtn">
          <view class="fw600">立即分享</view>
          <view v-if="shareBtnText">({{ shareBtnText }})</view>
        </view> -->
      </block>
    </block>
  </view>
</template>

<script>
import { CART, HAPPINESS_BUY, BTN_SHARE } from "@/imageConfig";
import { getUserAsis } from '@/api/user'
import { formatMoney } from "@/common/filters";
import { mapGetters } from "vuex";

export default {
  name: "BottomBar",
  props: {
    onlyAddCartBtn: {
      // 是否只显示'加入购物车'按钮
      type: Boolean,
      default: false,
    },
    cartCount: {
      // 购物车数量
      type: Number,
      default: 0,
    },
    svip: {
      type: Number,
      default: 0,
    },
    shareIntegral: {
      // 分享可得喵豆
      type: Number,
      default: 0,
    },
    obtainAmount: {
      // 返现金额
      type: Number,
      default: 0,
    },
    platformPrice: {
      // 市场价
      type: Number,
      default: 0,
    },
    salesPrice: {
      // 销售价
      type: Number,
      default: 0,
    },
    spuStatus: {
      // 0下架， 1上架
      type: Number,
      default: 1,
    },
    salesStock: {
      // 库存
      type: Number,
      default: 1,
    },
    hideAddCartText: {
      default: false,
      type: Boolean,
    },
    showShareBtn: {
      default: true,
      type: Boolean,
    },
    ysf: {
      default: {
        config:""
      },
      type: Object,
    },
    goodsTitle: {
      default:'商品',
      type:String,
    },
    goodsDesc:{
      default:'商品',
      type:String,
    },
    goodsImg:{
      default:'',
      type:String,
    },
    asisUrl:{
      default:'',
      type:String,
    },
    asisName:{
      default:'',
      type:String,
    },
  },
  computed: {
    shareBtnText() {
      let str = "";
      if (this.shareIntegral > 0) {
        str = `得${this.shareIntegral}喵豆`;
      }
      return str;
    },
    buyBtnText() {
      let str = "";
      if (this.salesPrice == this.platformPrice && this.obtainIntegral > 0) {
        str = `得${this.obtainIntegral}喵豆`;
      } else {
        let price = 0;
        if (this.svip == 1) {
          price =
            this.salesPrice - this.obtainAmount <= 0
              ? 0
              : this.salesPrice - this.obtainAmount;
        } else {
          price = this.salesPrice;
        }
        if (price == 0) {
          str = "省100%";
        } else {
          if (this.platformPrice >= 5000) {
            str = `省${formatMoney(this.platformPrice - price)}元`;
          } else {
            if (this.platformPrice > 0) {
              let percent = (this.platformPrice - price) / this.platformPrice;
              str = `省${(percent * 100).toFixed(2)}%`;
            }
          }
        }
      }
      return str;
    },
     ...mapGetters(["userInfo"]),
  },
  created() {
    // this.fetUserAsis()
  },
  data() {
    return {
      IMAGE: {
        CART,
        HAPPINESS_BUY,
        BTN_SHARE,
      },
      // asisUrl:""
    };
  },
  methods: {
    onCartTap() {
      console.log("onCartTap ==================================")
      this.$emit("onCartTap");
    },
    onAddCartTap() {
      this.$emit("onAddCartTap");
    },
    onBuyTap() {
      this.$emit("onBuyTap");
    },
    onShareTap() {
      this.$emit("onShareTap");
    },
    toChat(){
      // #ifdef H5
      this.$flutter({ method: 'MY_CHAT',data:{title:this.goodsTitle,desc:this.goodsDesc,price:this.salesPrice,imgUrl:this.goodsImg,nickName: this.asisName}})
      // #endif
    },
    // 小助理
    // fetUserAsis(){
    //   getUserAsis().then(res=>{
    //     let data = res.data;
    //     if(data){
    //       this.asisUrl = data.url;
    //     }
    //   })
    // },
  },
};
</script>

<style lang="scss" scoped>
.bottom-bar-container {
  background-color: #ffffff;
  padding: 10rpx 32rpx 40rpx 32rpx;
  height: 140rpx;
  box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.08);
  .cart-btn-wrapper {
    position: relative;
    text-align: center;
    padding-right: 50rpx;
    image {
      // &:first-of-type {
      //         width: 48rpx;
      // height: 48rpx;
      // }
      //        &:last-of-type{
      //         width: 96rpx;
      // height: 96rpx;
      // }
    }
    .badge {
      color: #ffffff;
      font-size: 20rpx;
      text-align: center;
      width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      border-radius: 50%;
      position: absolute;
      top: -8rpx;
      right: 32rpx;
    }
  }
  .share-btn {
    background-color: $uni-color-theme;
    // border: 1px solid $uni-color-theme;
    border-radius: 12rpx;
    margin-left: 16rpx;
    width: 185rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
  .add-cart-btn {
    background: #f2f2f5;
    // border: 1px solid $uni-color-gray;
    border-right-width: 0;
    border-radius: 12rpx 0px 0px 12rpx;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .buy-btn {
    // border: 1px solid $uni-color-primary;
    border-left-width: 0;
    color: #ffffff;
    border-radius: 0px 12rpx 12rpx 0px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
@media screen and(min-width: 375px) and(max-height: 812px) {
  .bottom-bar-container {
    height: 120 + 40rpx;
    padding-bottom: 40rpx !important;
  }
}
</style>
