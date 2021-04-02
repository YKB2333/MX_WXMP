<template>
  <view class="bg-white plr30 mb20">
    <view class="row space-between ptb30 center-y">
      <block v-if="orderEntity.status === 1">
        <view class="fs-normal">
          <slot name="countdown" />
        </view>
        <view class="color-red">待支付</view>
      </block>
      <block v-if="orderEntity.status === 2">
        <view class="fs-normal flex-1 " @tap="copyToClipboard(orderEntity.outTradeNo)">
          <text>订单号:{{ orderEntity.outTradeNo }}</text>
          <!-- <text class="color-red ml40">复制</text> -->
        </view>
        <view class="color-red">待发货</view>
      </block>
      <block v-if="orderEntity.status === 3 && orderEntity.thirdDeliverStatus == 2">
        <view class="fs-normal flex-1" @tap="copyToClipboard(orderEntity.outTradeNo)">
          <text>订单号:{{ orderEntity.outTradeNo }}</text>
          <!-- <text class="color-red ml40">复制</text> -->
        </view>
        <view class="color-red">已发货</view>
      </block>
      <block v-if="orderEntity.status === 3 && orderEntity.thirdDeliverStatus == 1">
        <view class="fs-normal flex-1" @tap="copyToClipboard(orderEntity.outTradeNo)">
          <text>订单号:{{ orderEntity.outTradeNo }}</text>
          <!-- <text class="color-red ml40">复制</text> -->
        </view>
        <view class="color-red">部分发货</view>
      </block>
      <block v-if="orderEntity.status === 4">
        <view class="fs-normal flex-1" @tap="copyToClipboard(orderEntity.outTradeNo)">订单号:{{ orderEntity.outTradeNo }}</view>
        <view class="color-red">已完成</view>
      </block>
      <block v-if="orderEntity.status === -1">
        <view class="fs-normal flex-1" @tap="copyToClipboard(orderEntity.outTradeNo)">订单号:{{ orderEntity.outTradeNo }}</view>
        <view class="color-gray">已取消</view>
      </block>
    </view>
    <!-- <template v-if="orderEntity.waybillNumberList && orderEntity.waybillNumberList.length">
      <view v-for="(item, index) in orderEntity.waybillNumberList" :key="index"
        @tap="goKD100(item)"
        class="fs-sm radius plr20 ptb26 row space-between" style="color:#666C72;background-color:#F4F5F9;">
        <text>快递单号：{{ item }}</text>
        <text>查询</text>
      </view>
    </template>
    <view v-if="logistics" class="fs-sm radius plr20 ptb26" style="color:#666C72;background-color:#F4F5F9;">
      <text>{{ logistics }}</text>
    </view> -->
    <!-- 商品区域 -->
    <view>
      <slot name="goods" />
    </view>
    <!-- 操作按钮 -->
    <view class="row ptb20 center-y space-between hairline-top">
      <view>
        <!-- <slot name="button-left" /> -->
        <view class="pb8 col">
          <view class="row center-y">
            <text class="fs-sm">合计</text>
            <text class="fs-lg fw600 pl8">¥{{ orderEntity.orderAmtTotal | formatMoney }}</text>
          </view>
          <view class="color-gray fs-sm">(含运费¥{{ orderEntity.logisticsFee | formatMoney }})</view>
        </view>
      </view>
      <view class="row">
        <button class="plain-btn ml30" v-if="orderEntity.status == 1" @click="onBtnClick('cancel')">取消订单</button>
        <button class="plain-btn ml30" v-if="orderEntity.status == -1 || orderEntity.status == 4" @click="onBtnClick('delete')">删除</button>
        <button class="light-btn ml30" v-if="orderEntity.status == 1" @click="onBtnClick('pay')">立即支付</button>
        <block>
          <button class="plain-btn ml30" v-if="orderEntity.status == 3 || orderEntity.status == 4" @click="onBtnClick('bagDetail')">查看物流</button>
          <!-- <button class="light-btn ml30" v-if="(orderEntity.status == 3 && orderEntity.orderPackInfo && orderEntity.orderPackInfo.isAllSend && orderEntity.orderPackInfo.isOnePack)&&(orderEntity.returnStatus == -1 || orderEntity.returnStatus == -2 || orderEntity.returnStatus == 4)" @click="onBtnClick('confirm')">确认收货</button> -->
          <button class="light-btn ml30" v-if="(orderEntity.status == 3 && orderEntity.orderPackInfo && orderEntity.orderPackInfo.isAllSend && orderEntity.orderPackInfo.isOnePack)&&(orderEntity.returnStatus == -2 || orderEntity.returnStatus == -1 || orderEntity.returnStatus == 4)" @click="onBtnClick('confirm')">确认收货</button>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { copyToClipboard } from '@/utils'
import { kd100AppId } from "@/config";

export default {
  name: "OrderItem",
  props: {
    orderEntity: {
      type: Object
    }
  },
  data() {
    return {
      totalPrice: '',
    }
  },
  computed: { },
  created() { },
  methods: {
    onBtnClick(type) {
      console.info('触发按钮=>', type)
      this.$emit(type)
    },
    // goKD100(no){
    //   console.info(`${kd100AppId}=>跳转到快递100，查询订单：${no}`)
    //   wx.navigateToMiniProgram({
    //     appId: kd100AppId,
    //     path: `/pages/result/result?nu=${no}`,
    //   })
    // },
    copyToClipboard,
  },
  // watch: {
  //   orderEntity: {
  //     handler: function(val) {
  //       console.log('监听orderItem', val)
  //       this.init()
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.light-btn{
  background-color: #FF9EA8;
  color: #fff;
  font-weight: 600;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #FF9EA8;
  padding: 0;
}
.plain-btn{
  background-color: transparent;
  color: #121314;
  font-weight: 500;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #121314;
  padding: 0;
}
</style>
