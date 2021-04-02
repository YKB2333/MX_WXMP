<template>
  <view class="sku" :class="{ 'active': active, 'disabled': disabled }">
    <view v-if="skuType === 1" class="sku-type-btn">
      <text>{{ attrValue }}</text>
    </view>
    <view v-if="skuType === 2" class="sku-type-img">
      <view class="sku-img-wrapper" style="border-radius:8rpx;">
        <image v-if="attrImg" :src="attrImg" class="w-h-full" style="border-radius:8rpx;" />
      </view>
      <text class="color-gray fs-mini ellipsis">{{ attrValue }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "Sku",
  props: {
    active: { // 高亮状态
      type: Boolean,
      default: false
    },
    skuData: {
      type: Object
    },
    skuType: { // sku类型：1文字，2图片
      type: Number,
      default: 1
    },
    attrValue: { // 属性值
      type: String
    },
    attrImg: { // 当sku类型为图片时的图片
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log('jflsjf')
  }
}
</script>

<style lang="scss" scoped>
.sku{
  display: inline-block;
  margin-bottom: 10rpx;
  margin-right: 10rpx;
  .sku-type-btn{
    font-size: 22rpx;
    padding: 16rpx 36rpx;
    text-align: center;
    border-radius: 8rpx;
    border: 1px solid transparent;
    color: #909399;
    background-color: #F2F2F5;
  }
  &.active{
    .sku-type-btn{
      background-color: #FF9EA8;
      color: #ffffff;
    }
    .sku-img-wrapper{
      border: 1px solid #FF9EA8;
    }
  }
  &.disabled{
    .sku-type-btn{
      color: #909399 !important;
      border: 1px solid rgba(157, 160, 164, 1) !important;
      background-color: #f2f2f5 !important;
    }
    .sku-img-wrapper{
      image{
        filter: grayscale(100%); 
        -webkit-filter: grayscale(100%);
      }
    }
  }
  .sku-type-img{
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 180rpx;
    .sku-img-wrapper{
      margin: 0 auto 10rpx;
      width: 88rpx;
      height: 88rpx;
    }
  }
}
</style>
