<template>
  <view class="border-title">
    <text class="title">
      <slot />
    </text>
    <!-- <text class="line"></text> -->
  </view>
</template>

<script>
export default {
  name: "BorderTitle",
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.border-title{
  position: relative;
  display: inline-block;
  .title{
    color: $uni-color-primary;
    font-size: 52rpx;
    font-weight: 600;
    z-index: 2;
  }
  .line{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 10rpx;
    width: 100%;
    background-color: $uni-color-theme;
    z-index: 1;
    display: block;
  }
}

</style>