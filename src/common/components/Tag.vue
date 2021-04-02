<template>
  <view class="tag-wrapper">
    <slot />
  </view>
</template>

<script>
export default {
  name: "Tag",
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.tag-wrapper{
  font-size: 20rpx;
  color: #FF3838;
  padding: 8rpx 18rpx;
  background-color: #fff;
  border: 1px solid #FF3838;
  border-radius: 30rpx;
  text-align: center;
  display: inline-block; 
  margin-left: 10rpx;
  vertical-align: middle;
}
</style>