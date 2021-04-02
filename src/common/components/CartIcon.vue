<template>
  <!-- 购物车按钮 -->
  <view class="cart-btn-wrapper">
    <image :src="IMAGE.CART_ARTICLE" />
    <view class="badge" v-if="count > 0">{{ count >= 10 ? '9+': count }}</view>
  </view>
</template>

<script>
import { CART_ARTICLE } from '@/imageConfig'
export default {
  name: "CartIcon",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      IMAGE: {
        CART_ARTICLE
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-btn-wrapper{
  position: relative;
  image{
    width: 60rpx;
    height: 60rpx;
  }
  .badge{
    background-color: #FF3838;
    color: #ffffff;
    font-size: 20rpx;
    padding: 0 6rpx;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: -10rpx;
    min-width: 16px;
    height: 34rpx;
    text-align: center;
    line-height: 34rpx;
  }
}
</style>