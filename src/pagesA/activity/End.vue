<template>
  <view class="pos-center">
    <view>
      <view class="text-center">
        <image :src="IMAGE.ACTIVITY_END" class="w386 h258" />
      </view>
      <view class="mt70 text-center color-info">啊哦~ 活动结束了</view>
    </view>
    <navigator open-type="navigateBack">
      <view class="w500 h88 l-h88 text-center radius-round mt100 mauto" style="border: 1px solid #121314;">
        返回上一页
      </view>
    </navigator>
  </view>
</template>

<script>
import { ACTIVITY_END } from '@/imageConfig'

export default {
  name: "ActivityEnd",
  data() {
    return {
      IMAGE: {
        ACTIVITY_END: ACTIVITY_END,
      }
    }
  },
  onLoad(options) {
    console.log(this.$images.ACTIVITY_END)
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>

</style>