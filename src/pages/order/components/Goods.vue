<template>
  <view>
    <view class="row ptb30">
      <view class="relative" @tap="jump2spu">
          <view class="img"><image :src="img"/></view>
          <view class="w-h140 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
      </view>
    
      <view class="flex-1 pl18 col space-between hidden">
        <view class="col">
          <text class="fw600 ellipsis">{{ name }}</text>
          <text class="ellipsis2 fs-sm l-h38 color-gray">{{ attrValue }}</text>
        </view>
        <view class="row space-between">
          <text class="fs-lg color-red">¥{{ price | formatMoney }}</text>
          <text class="fs-normal">x{{ quantity }}</text>
        </view>
      </view>
    </view>
    <slot name="goodBtm"></slot>
  </view>
</template>
<script>
export default {
  name: "Goods",
  props: {
    img: {
      type: String
    },
    name: {
      type: String
    },
    attrValue: {
      type: String
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number
    },
    spuId: {
      type: String
    },
    payChannel:{
      type: [String,Number]
    }
  },
  data() {
    return {

    }
  },
  methods:{
    jump2spu(){
      if(this.spuId&&this.payChannel!=6){
        uni.navigateTo({
          url: `/pages/spu/index?spuId=${this.spuId}`
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.img{
  // border:1rpx solid rgba(223,223,223,1);
  border-radius: 10rpx;
  width: 140rpx;
  height: 140rpx;
  padding:10rpx;
  image{
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>
