<template>
  <view style="margin-bottom: -30rpx;">
    <view class="bg-white p30 row space-between center-y">
      <view class="flex-1 col space-between pr20">
        <view class="row center-y">
          <text class="fs-lg mr30 fw600">{{ name }}</text>
          <text class="color-gray mr30">{{ tel | formatMobile }}</text>
          <tag v-if="isDefault">默认</tag>
        </view>
        <view class="mt26 color-gray">{{ address }}</view>
        <view class="mt26 color-red fs-sm" v-if="isOutExpress">收货地址不在配送区域内：全国（新疆、内蒙除外）</view>
      </view>
      <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
    </view>
    <image :src="IMAGE.ADDRESS_LINE" class="w-full" mode="widthFix" style="vertical-align:top;" />
  </view>
</template>

<script>
import Tag from '_c/Tag'
import { ADDRESS_LINE, ARROW_RIGHT } from '@/imageConfig'

export default {
  name: "address",
  components: { Tag },
  props: {
    name: {
      type: String
    },
    tel: {
      type: String
    },
    address: {
      type: String
    },
    // 是否默认地址
    isDefault: {
      type: Boolean,
      default: false
    },
    // 是否非配送区域
    isOutExpress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      IMAGE: {
        ADDRESS_LINE,
        ARROW_RIGHT
      }
    }
  }
}
</script>

<style>

</style>