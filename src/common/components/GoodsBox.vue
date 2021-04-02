<template>
  <view class="p20 row" style="background-color: #F2F4FA;border-radius: 8rpx;" :class="[ status == 0 || replenish ? 'disabled' : '']">
    <view class="mr30 spu-img-wrapper relative">
      <image :src="image" class="w-h120" style="border-radius: 8rpx;" />
      <view class="disabled-tag" v-if="status == 0">已下架</view>
      <view class="disabled-tag" v-else-if="replenish">补货中</view>  
    </view>
    <view class="flex-1 col space-around hidden">
      <view class="ellipsis fw600">{{ name }}</view>
      <!-- <view class="color-gray fs-mini">
        <text class="mr10" v-for="(sku, i) in skus" :key="i">{{ sku }}</text>
      </view> -->
      <view class="row space-between">
        <text class="color-red fw600 fs-sm">¥{{ price | formatMoney }}</text>
      </view>
    </view>
    <slot />
  </view>
</template>

<script>
export default {
  name: "GoodsBox",
  props: {
    image: {
      type: String
    },
    name: {
      type: String
    },
    skus: {
      type: Array,
      default: () => []
    },
    price: {
      type: Number
    },
    status: {
      // 0下架，1上架
      type: Number,
      default: 1,
    },
    replenish: {
      // 补货中
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-tag {
    display: none;
  }
.disabled {
  .spu-img-wrapper image {
    opacity: 0.5;
  }
  .disabled-tag {
    display: block;
    position: absolute;
    color: #ffffff;
    width: 140rpx;
    height: 48rpx;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 48rpx;
  }
  .spu-name {
    color: #121314;
  }
}
</style>