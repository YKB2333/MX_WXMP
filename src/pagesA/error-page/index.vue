<template>
  <view class="error-page">
    <view class="container">
      <!-- 404 -->
      <view v-if="errorCode === 404">
        <view class="text-center">
          <image :src="IMAGE.ERROR_PAGE_404" class="w386 h258" /> 
        </view>
        <view class="mt70 text-center color-info">emmmm... 我们找不到您要的页面～</view>
      </view>
      <view v-if="errorCode === 500">
        <view class="text-center">
          <image :src="IMAGE.ERROR_PAGE_500" class="w386 h258" /> 
        </view>
        <view class="mt70 text-center color-info">应该是出了点小问题...</view>
      </view>
      <navigator open-type="navigateBack" :delta="2">
        <view class="w500 h88 l-h88 text-center radius-round mt100 mauto" style="border: 1rpx solid #121314;">
          返回上一页
        </view>
      </navigator>
    </view>
  </view>
</template>

<script>
import { ERROR_PAGE_404, ERROR_PAGE_500 } from '@/imageConfig'

export default {
  name: "ErrorPage",
  data() {
    return {
      IMAGE: {
        ERROR_PAGE_404: ERROR_PAGE_404,
        ERROR_PAGE_500: ERROR_PAGE_500
      },
      errorCode: 404
    }
  },
  onLoad(options) {
    console.log(options.errorCode)
    this.errorCode = Number(options.errorCode)
  }
}
</script>

<style lang="scss" scoped>
.error-page{
  .container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>