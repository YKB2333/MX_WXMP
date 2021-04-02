<template>
  <view class="bg-white plr30 mb20">
    <view class="row space-between hairline-bottom ptb30">
      <view @tap="copyToClipboard(returnList.returnsNo)">
        <text>售后编号：{{ returnList.returnsNo }}</text>
      </view>
      <view class="color-red">{{returnList.titleStatus}}</view>
    </view>
    <!-- 商品区域 -->
    <view>
      <slot name="goods" />
    </view>
    <!-- 操作按钮 -->
    <view v-if="returnList.titleStatus !== '已关闭'" class="row ptb20 center-y space-between">
      <view>
        <!-- <view v-if="returnList.returnsStatus == -1" class="fs-sm fw600">
          <text>合计：</text>
          <text class="color-red">¥{{returnList.returnAmt | formatMoney}}</text>
        </view> -->
        <view class="ptb10" v-if="returnList.showMoney">
          <text class="fs-sm">退款成功：</text>
          <text class="fs-lg">¥{{returnList.returnAmt | formatMoney}}</text>
        </view>
      </view>
      <view class="row">
        <button class="plain-btn" v-if="returnList.cancel" @click="onBtnClick('cancle')">取消申请</button>
        <button class="light-btn ml20" v-if="returnList.showWrite" @click="onBtnClick('exchange')">填写退回信息</button>
        <text v-if="(returnList.status == -2 || (type == 1 && returnList.status== -1)) && (returnList.orderStatus != 2 && returnList.orderStatus != 3)" class="color-gray ml30">您的订单已超过退换货期限</text>
      </view>
    </view>
  </view>
</template>

<script>
import { copyToClipboard ,deepClone} from '@/utils'
export default {
  name: "ReturnOrderItem",
  props: {
    type: { // tab栏 1退换申请，2处理中，3退换记录
      type: Number
    },
    orderEntity: {
      type: Object
    },
  },
  data() {
    return {
      returnList:{}
    }
  },
  created(){
    this.returnList = deepClone(this.orderEntity)
    this.getStatus()
  },
  methods: {
    copyToClipboard,
    getStatus(){
    // returnStatus  退货单状态：-1 关闭中 1 处理中 2 等待商品退回 3 待审核 4 通过
    // returnsType  1 退货退款  2 换货补偿  3 补发  4 赔付  5 未发货退款  为 -1 时 对应的returnStatus为1 ，此时后台还没有进行操作
    //  退货退款  type = 1 && status = 2
    //  仅退款  type = 5 && status = 3;
    //  售后申请中 status = 1;
    //  已退款  type=1 || type=5 && status = 4  （1 已退款）
    //  已退款  type!=1 || type!=5 && status = 4  （1 已完成）
    // type = -1  已关闭
      let status = this.returnList.status
      let returnsType = this.returnList.returnsType
      this.returnList.titleStatus = ''
      this.returnList.cancel = true
      if (status == -1) {
        this.returnList.titleStatus = '已关闭';
        this.returnList.cancel = false
      } else if (status == 4) {
        // 1 退款退货  4 赔付  5 未发货退款
        this.returnList.cancel = false
        if (returnsType == 1 || returnsType == 4 || returnsType == 5) {
          this.returnList.titleStatus = '已退款';
          this.returnList.showMoney = true
        } else if (returnsType == 2) {
          // 已换货
          this.returnList.titleStatus = '已换货';
        } else if (returnsType == 3) {
          // 已补发
          this.returnList.titleStatus = '已补发';
        }
      } else if (status == 1) {
        this.returnList.titleStatus = '售后申请中';
      } else if (status == 2) {
        if(returnsType ==1){
          this.returnList.titleStatus = '退货退款';
          this.returnList.showWrite = this.returnList.expressNo?false:true;
      }
      } else if (status == 3) {
        this.returnList.titleStatus = '售后申请中';
        if(returnsType == 5){
          this.returnList.titleStatus = '仅退款';
        }else if(returnsType == 1){
          this.returnList.titleStatus = '退货退款';
        }
      } 
    },
    onBtnClick(type) {
      console.info('触发=>', type)
      this.$emit(type)
    }
  },
  computed: {
    
  }
}
</script>

<style lang="scss" scoped>
.light-btn{
  background-color: #FFD100;
  color: #121314;
  font-weight: 600;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #FFD100;
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
