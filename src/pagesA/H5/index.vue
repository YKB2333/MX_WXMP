<template>
  <view class="min-h-full">
    <block>
      <!-- <web-view src="http://www.xiamenmiaoxun.com.cn/config/h5/userProtocol/index.html"></web-view> -->
      <web-view :src="h5"></web-view>
    </block>
  </view>
</template>

<script>
export default {
  name: 'H5',
  components: {},
  data() {
    return {
      h5: ''
    }
  },
  onLoad(options) {
    // console.log(options.name)
    this.h5 = this.$config.H5[options.name]
    if (options.title) {
      // #ifdef MP-WEIXIN
      uni.setNavigationBarTitle({
        title: decodeURIComponent(options.title)
      })
      // #endif
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
