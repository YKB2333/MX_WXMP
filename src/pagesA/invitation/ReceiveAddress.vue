<template>
  <view id="receive-address" class="min-h-full bg-primary">
    <view class="p30 bg-white text-center">恭喜完成任务，请确定您的领奖地址。</view>
    <view class="mt20">
      <current-address
        name="张海标"
        tel="18816793365"
        address="湖南省长沙市岳麓区芯城科技园"
        :is-default="true"
        :is-out-express="true"
      />
    </view>
    <view class="receive-btn fw600">
      <text>领奖(</text>
      <van-count-down
        :time="2 * 60 * 60 * 1000"
        format="HH时mm分ss秒"
      />
      <text>)</text>
    </view>
  </view>
</template>

<script>
import CurrentAddress from '_c/address'

export default {
  name: "ReceiveAddress",
  components: { CurrentAddress },
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
#receive-address{
  padding-bottom: 120rpx;
  .receive-btn{
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    background-color: $uni-color-theme;
    color: $uni-color-primary;
  }
  /deep/.uni-countdown__number{
    font-weight: 600 !important;
    font-size: 28rpx !important;
  }
}
</style>