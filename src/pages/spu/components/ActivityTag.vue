<template>
  <view class="activity-tag color-pink">{{ tagName }}</view>
</template>

<script>
export default {
  name: "ActivityTag",
  props: {
    tagName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-tag {
  font-size: 24rpx;
  // color: #FF3838;
  background: rgba(255, 158, 168, 0.16);
  border-radius: 2px;
  // border: 1px solid rgba(255, 56, 56, 1);
  height: 48rpx;
  line-height: 48rpx;
  padding: 0 16rpx;
  margin-right: 12rpx;
  // margin-bottom: 10rpx;
}
</style>
