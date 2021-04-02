<template>
  <view class="page">
   <!-- 包裹详情 -->
   <!-- 已发货 -->
   <view v-if="sendPacks.length>0">
    <view v-for="item in sendPacks" :key="item.billNo" class="bg-white mb20 pt60">
      <view class="row space-between plr30 pb26">
        <view @click="goKD100(item.billNo)" class="row center-y ellipsis flex-1">
          <image style="flex-shrink:0;width:32rpx;height:26rpx;" :src="IMAGE.ICON_BAG" />
          <text class="pl8 ellipsis pr18">{{item.logisticsCompanyName}}{{item.billNo?':':''}}{{item.billNo}}</text>
          <!-- @tap="copyToClipboard('SK93849202')" 复制运单编号-->
          <van-icon class="arrow" custom-style="font-weight:600;" color="#919599" name="arrow" />
        </view>
        <text style="color:#FF3838;">
          {{item.status == 1?'已发货':item.status == 2?'已签收':'已发货'}}
        </text>
      </view>
      <view class="list_">
        <view class="goodList" v-for="(items,indexs) in item.skus" :key="indexs">
          <image @click="toDetail(items.spuId)" :src="items.skuPrimaryPic" mode="" />
        </view>
      </view>
      <!-- 底部 -->
      <view class="plr30 row space-between center-y ptb26 hairline-top">
        <view>共{{item.skuCount||0}}件商品</view>
        <view v-if="item.billNo" class="row">
          <button @click="goKD100(item.billNo)" class="plain-btn mr20">查看物流</button>
          <button v-if="item.status !== 2" @click="confim(item.billNo)" class="light-btn">确认收货</button>
        </view>
      </view>
    </view>
   </view>
    <!-- 待发货 -->
    <view class="bg-white mb20 pt40" v-if="noSendSkus.length>0">
      <view class="row space-between plr30 pb26">
        <view class="row center-y ellipsis flex-1">
          <image style="flex-shrink:0;width:32rpx;height:26rpx;" :src="IMAGE.ICON_BAG" mode="" />
          <text class="pl8 ellipsis">暂时无跟踪记录</text>
        </view>
        <text style="color:#FF3838;">
          未发货
        </text>
      </view>
      <view class="list_">
        <view class="goodList" v-for="(item,index) in noSendSkus" :key="index">
          <image @click="toDetail(item.spuId)" :src="item.skuPrimaryPic" mode="" />
        </view>
      </view>
      <!-- 底部 -->
      <view class="plr30 row center-y ptb40 hairline-top">
        <view>共{{noSendSkuCount || 0}}件商品</view>
      </view>
    </view>
  </view> 
</template>

<script>
import vanIcon from "@/wxcomponents/vant/icon/index";
import { getPackList,confirmOrder } from '@/api/order'
import { kd100AppId } from "@/config";
import { ICON_BAG } from '@/imageConfig'
import { copyToClipboard } from '@/utils'
export default {
  name: 'bagDetail',
  components: { vanIcon },
  data() {
    return {
      IMAGE:{
        ICON_BAG
      },
      orderId:'',
      sendPacks:[],
      noSendSkus:[],
      noSendSkuCount:0,
      source:''
    }
  },
  created() {},
  onLoad(options){
    this.orderId = options.id
    this.source = options.source
    this.init()
  },
  methods: {
    toDetail(spuId){
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${spuId}`
      })
    },
    confim(id){
      uni.showModal({
        content: '您已经收到商品?',
        cancelText: '未收货',
        confirmText: '已收货',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            confirmOrder(this.orderId,id).then(res => {
              this.init()
              this.callback()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    copyToClipboard,
    init(){
      getPackList(this.orderId).then(res => {
        this.sendPacks = res.data.sendPacks
        this.noSendSkus = res.data.noSendSkus 
        this.noSendSkuCount = res.data.noSendSkuCount
      })
    },
    goKD100(no){
      wx.navigateToMiniProgram({
        appId: kd100AppId,
        path: `/pages/result/result?nu=${no}`,
      })
    },
    callback() {
      if(this.source === 'orderList'){ //刷新订单列表
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
      }else if(this.source === 'orderDetail'){ //刷新订单详情
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
        this.$eventHub.$emit(this.$eventName.ORDER_DETAIL_REFLUSH, true)
      }else if(this.source === 'returnList'){ //刷新退换单列表
        this.$eventHub.$emit(this.$eventName.RETURN_LIST_REFLUSH, true)
      }else if(this.source === 'returnDetail'){ //刷新退换单详情
        this.$eventHub.$emit(this.$eventName.RETURN_DETAIL_REFLUSH, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page{
  background-color: #F2F4FA;
  height: 100vh;
}
.list_{
  padding-left: 30rpx;
  padding-bottom: 26rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  overflow-x:auto;
  .goodList{
    padding:10rpx;
    border:2rpx solid #DFDFDF;
    border-radius:10rpx;
    width:140rpx;
    height:140rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
    image{
      width:100%;
      height:100%;
      object-fit: contain;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
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
.light-btn{
  background-color: #FF9EA8;
  color: white;
  font-weight: 600;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #FF9EA8;
  padding: 0;
}
</style>
