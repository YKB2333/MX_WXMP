<template>
    <view class="col bg-primary min-h-full">

    <!-- 顶部购买信息 -->
    <view class="plr32  hidden pt32 relative pb32 bg-primary">
      <view class="relative radius-12 hidden">
        <view class="buy-name bg-white fs-lg-add ellipsis fw600 pt112 pb30" style="border-bottom: 1rpx solid #F2F2F5;"> {{ cardInfo.nickName }}</view>
        <view class="row space-between ptb30 bg-white">
          <view class="flex-1 col text-center">
            <view class="fs-lg-add ellipsis">{{ cardInfo.orderNum }}</view>
            <view class="sub-font">累计下单</view>
          </view>
          
          <view class="h60 w2 bg-primary mt16"></view>
          <view class="flex-1 col text-center">
            <view class="row center-x" style="align-items:baseline;">
              <view class="fs-sm-add">￥</view>
              <view class="buy-times fs-lg-add ellipsis text-center">{{ cardInfo.amount }}</view>
            </view>
            <view class="sub-font">累计消费</view>
          </view>
          <view class="h60 w2 bg-primary mt16"></view>
          <view class="flex-1 col text-center relative">
            <view class="radius absolute popover"  v-if="(cardInfo.shareObtainIntegralTotal / 100) > 1">可抵扣￥{{ cardInfo.shareObtainIntegralTotal / 100 }}
              <view class="sanjiao"> </view>
              <view class="sanjiao red"> </view>
            </view>
            <view class="fs-lg-add ellipsis">{{ cardInfo.shareObtainIntegralTotal}}</view>
            <view class="sub-font">为我赚取喵豆</view>
          </view>
        </view>
      </view>
      <image class="relative w-h112 radius-circle top-head center-x" :src="cardInfo.headImgUrl"/>
      <view class="relative row center l-h60 pt36">
        <view class="divider-line"></view>
        <view class="color-primary mlr16">  TA的订单 </view>
        <view class="divider-line"></view>
      </view>
    </view>


    <!-- 底部列表 -->

        <view class="bg-primary hidden">
        <block v-for="(item, index) in ordersList" :key="index">
              <view class="bg-white radius-12 mlr32 mb24 wpct92 mauto "> 
                
                <view class="row space-between ptb24 plr32">
                  <view class="fs-normal text-center" style="color:#909399;">{{ item.tradeTime }}</view>
                  <view v-if="item.orderStatus === -2" class="status-flag">已删除</view>
                  <view v-if="item.orderStatus === -1" class="status-flag">已取消</view>
                  <view v-if="item.orderStatus === 1" class="status-flag">待支付</view>
                  <view v-if="item.orderStatus === 2" class="status-flag">待发货</view>
                  <view v-if="item.orderStatus === 3" class="status-flag">待收货</view>
                  <view v-if="item.orderStatus === 4" class="status-flag">已完成</view>
                </view>
                <view class="h2 w-full bg-primary"></view>
                <view class="row w-full p32">
                  <view class="relative" @tap.stop="onItemClick(item.spuId)">
                    <image class="w-h160 radius" :src="item.skuImage"/>
                    <view class="w-h160 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
                  </view>
                  <view class="col pl32 flex-start">
                    <view class="fs-normal ellipsis w440 mt18" style="color:#303133;"> {{ item.spuName }} </view>
                    <view class="row space-between w-full">
                      <view class="buy-times fs-22 ellipsis l-h60" style="color:#909399;">{{item.ownSpec}}  数量 x{{item.quantity}}</view>
                      <view class="fs-22 buy-times l-h60" style="color:#909399;" @tap="onItemClick(item.spuId)">查看商品 > </view>
                    </view>

                    <view class="row" style="align-items:baseline;">
                      <view class="fs-sm-add">￥</view>
                      <view class="buy-times fs-lg-add ellipsis">{{ item.price | formatMoney}}</view>
                    </view>
                  </view>
                </view>

                <view class="l-h24 w-full">
                  <image :src="IMAGE.BUY_HISTORY_DIVIDE_LINE" class="l-h24 w-full" mode="widthFix"/>
                </view>

                <view class="row w-full space-between ptb24 plr32">
                  <view>订单返喵豆</view>
                  <view class="row" style="align-items:baseline;">
                    <image :src="IMAGE.BUY_HISTORY_RED_MIAODOU" class="w-h32"/>
                    <view class="ml4 fs-lg-add" style="color:#303133;font-weight:600;">{{ item.shareObtainIntegral }}</view>
                    <view v-if="item.orderStatus != 4" class="fs-22" style="color:#909399;">(未到账)</view>
                  </view>
                </view>
                
              </view>
        </block>
    </view>
  </view>
</template>

<script>
import CustomNav from "_c/CustomNav";
import BuyCard from '_c/BuyCard'
import {
  IC_BLACK_RETURN,
  BUY_HISTORY_DIVIDE_LINE,
  BUY_HISTORY_RED_MIAODOU
} from '@/imageConfig';

import { getListUserOrder } from '@/api/order'
export default {
  name:"FriendsBuyHistory",
  components: {
    CustomNav,
    BuyCard
  },
  data() {
    return {
      IMAGE: {
        IC_BLACK_RETURN,
        BUY_HISTORY_DIVIDE_LINE,
        BUY_HISTORY_RED_MIAODOU
      },
      userHead:'https://nowpic.gtimg.com/hy_personal_room/1211068335/12110683351603144984/640?tp=webp',
      userName:'难过就买买买',
      placeTime:'20',
      qipaoTop:0,
      qipaoTopStatus:false,
      cardInfo: {},
      ordersList:[],
    }
  },
  onLoad(options) {
    console.log('options == ',options)
    console.log('当前用户ID')
    this.cardInfo = JSON.parse(decodeURIComponent(options.params))
    // this.cardInfo =  JSON.parse(options.params)
    this.init();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onItemClick(id) {
       // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${id}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':id}});
      // #endif
   },
   init() {
     uni.showLoading({
       title: '加载中',
       mask: true
     });
     getListUserOrder(this.cardInfo.userId).then( res => {
       this.ordersList = res.data;
       this.ordersList.forEach(item => {
            if(item.ownSpec){
              let skuOwnSpec = JSON.parse(item.ownSpec)
              item.ownSpec = ''
              for(let key in skuOwnSpec){
                item.ownSpec += skuOwnSpec[key] + ';'
              }
              item.ownSpec = item.ownSpec.substring(0, item.ownSpec.length - 1)
            }else{
              item.ownSpec = ''
            }
          })
     }).finally( () => {
       uni.hideLoading();
     });

   }
  },
 // 监听滚动
  onPageScroll: function(data) { // 防抖
    if(data.scrollTop > 100) {
      this.qipaoTopStatus = true;
    }else {
      this.qipaoTopStatus = false;
    }

  },
}
</script>

<style lang="scss" scoped>
.head-top-bg {
  z-index: -1;
  width: 100%;
  height: 100;
}
.top-head {
  position:absolute !important;
  top: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
}
.buy-name {
    color: #303133;
    // bottom:10rpx;
    justify-content: center  !important;
    text-align: center  !important;
}
.top-font {
  color: #303133;
  font-weight: 600;
  font-size: 20rpx;
}
.sub-font {
    color: #909399;
    margin-top: 8rpx;
    font-size: 22rpx;
}
.divider-line {
  width: 64rpx;
  height: 2rpx;
  background-color: #BFC2CC;
}
.popover {
    top:-70%;
    margin: 0 auto;
    right: 26%;
    background-color: white;
    border: 1px solid #F77F8C;
    font-size: 20rpx;
    color: #F77F8C;
    text-align: center;
    justify-content: center;
    padding: 0 16rpx;
    border-radius: 24rpx;
    line-height: 48rpx;
    white-space: nowrap;
}
.title_fixed{
  position: fixed;
  width: 100%;
  top:0;
  z-index: 9999;
}

.bg-blur{
    float:left;
    background-position:center;
    background-repeat:no-repeat;
    background-size:cover;
    -webkit-filter: blur(9px);
    -moz-filter: blur(9px);
    -o-filter: blur(9px);
    -ms-filter: blur(9px);
    filter:blur(9px);
}
.status-flag {
    background-color: white;
    border: 1px solid #F77F8C;
    font-size: 26rpx;
    color: #F77F8C;
    text-align: center;
    justify-content: center;
    padding: 4rpx 16rpx;
    border-radius: 24rpx;
    height: 48rpx;
}
.sanjiao{
  position: absolute;
  border: 8rpx solid transparent;
  border-top-color: white;
  bottom: -13rpx;
  right: 26%;
  transform: translateX(-50%);
  margin: 0 auto;
  width: 16rpx;
  z-index: 2;
  &.red{
    border-top-color: #F77F8C;
    // bottom: 0;
    bottom: -16rpx;
    z-index: 1;
  }
}
</style>