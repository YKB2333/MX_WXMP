<template>
  <view v-if="svip == 1" class="plr16 ptb24 row center-y" :class="{radiusVip:borderStyle}" style="background-color: #121314;">
    <view style="background-color: #FFD100;" class="fs-mini plr12 radius-round h30 mr10">秒推达人</view>
    <view class="fs-sm color-theme">达人下单立减，低至</view>
    <view class="color-red fs-sm">¥{{ vipPrice | formatMoney }}</view>
  </view>
</template>

<script>
export default {
  name: "VipBar",
  props: {
    svip: { // 是否达人，0否 1是
      type: Number,
      default: 0
    },
    salesPrice: { // 销售价
      type: Number,
      default: 0
    },
    obtainAmount: { // 返现金额
      type: Number,
      default: 0
    },
    borderStyle:{
      type: Boolean,
      default: true
    }
  },
  computed: {
    vipPrice() {
      return this.salesPrice - this.obtainAmount <= 0 ? 0 : this.salesPrice - this.obtainAmount
    }
  },
  data() {
    return {
      
    }
  }
}
</script>

<style>
.radiusVip{border-radius: 24rpx 24rpx 0px 0px;}
</style>