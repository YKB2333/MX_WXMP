<template>
  <view id="task-progress" class="bg-primary min-h-full">
    <view class="bg-white row space-between plr50 ptb30 center-y">
      <view class="col center">
        <image :src="IMAGE.INVITE_ICON_SHARE" class="w-h106" />
        <text class="color-info fs-sm">分享给好友</text>
      </view>
      <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      <view class="col center">
        <image :src="IMAGE.INVITE_ICON_SETUP" class="w-h106" />
        <text class="color-info fs-sm">安装并注册</text>
      </view>
      <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      <view class="col center">
        <image :src="IMAGE.INVITE_ICON_INVITE" class="w-h106" />
        <text class="color-info fs-sm">邀请人数+1</text>
      </view>
    </view>
    <view class="relative">
      <view class="mt20 bg-white">
        <view class="plr30">
          <view class="ptb30 hairline-bottom row center">
            <text>倒计时：</text>
            <van-count-down
              :time="30 * 60 * 60 * 1000"
              format="DD天HH时mm分ss秒"
            />
            <!-- <uni-countdown 
              :day="0" 
              :hour="0" 
              :minute="0" 
              :second="40" 
              color="#121314"
              background-color="#ECF0F6"
              splitor-color="#9DA0A4"
              @timeup="onTimeup"
            /> -->
          </view>
        </view>
        <view class="color-info fs-sm row center mtb40">
          已经邀请<text class="color-red plr10" style="font-size:26rpx;">2</text>位好友购物，仅差<text class="color-red plr10" style="font-size:26rpx;">4</text>位好友即可获得奖品 
        </view>
        <view class="plr30 row space-around wrap">
          <image :src="IMAGE.TEMP_AVATAR" class="w-h80 mb40" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h80 mb40" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h80 mb40" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h80 mb40" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h80 mb40" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h80 mb40" />
        </view>
      </view>
      <view class="mt20 bg-white plr30">
        <view class="hairline-bottom fw600 text-center ptb30">邀请名单</view>
        <view v-for="i in 3" :key="i" class="row space-between center-y ptb30 hairline-bottom">
          <view class="flex-1 row">
            <image :src="IMAGE.TEMP_AVATAR" class="w-h60" />
            <view class="color-gray col space-between plr30">
              <text class="fs-sm ellipsis">爱买买买的小姑凉</text>
              <text class="fs-mini">(199****0739)</text>
            </view>
          </view>
          <button class="btn-black" :disabled="i !== 0">{{ i === 0 ?  '提醒好友下载' : '邀请成功' }}</button>
        </view>
        <view class="ptb30 row center">
          <text class="color-info fs-sm mr10">查看所有好友</text>
          <image :src="IMAGE.ARROW_RIGHT" class="w14" mode="widthFix" />
        </view>
      </view>
      <image v-if="receiveStatusImg" :src="receiveStatusImg" class="receive-status-img" />
    </view>
    <!-- <button class="invite-btn" disabled>立即邀请</button> -->
    <button class="invite-btn">立即邀请</button>
  </view>
</template>

<script>
import { 
  INVITE_ICON_INVITE, 
  INVITE_ICON_SETUP, 
  INVITE_ICON_SHARE,
  INVITE_RECEIVE_DONE,
  INVITE_RECEIVE_FAIL,
  INVITE_RECEIVE_OVERDUE,
  INVITE_RECEIVE_SUCCEED,
  ARROW_RIGHT,AVATAR_INVITE,
  TEMP_AVATAR
} from '@/imageConfig'

export default {
  name: "TaskProgress",
  components: { },
  data() {
    return {
      IMAGE: {
        INVITE_ICON_INVITE,
        INVITE_ICON_SETUP,
        INVITE_ICON_SHARE,
        INVITE_RECEIVE_DONE,
        INVITE_RECEIVE_FAIL,
        INVITE_RECEIVE_OVERDUE,
        INVITE_RECEIVE_SUCCEED,
        ARROW_RIGHT,
        AVATAR_INVITE,
        TEMP_AVATAR
      },
      receiveStatus: -1,
    }
  },
  computed: {
    receiveStatusImg() {
      // 成功
      if (this.receiveStatus === 0) return this.IMAGE.INVITE_RECEIVE_SUCCEED
      // 失败
      if (this.receiveStatus === 1) return this.IMAGE.INVITE_RECEIVE_FAIL
      // 过期
      if (this.receiveStatus === 2) return this.IMAGE.INVITE_RECEIVE_OVERDUE
      // 已结束
      if (this.receiveStatus === 3) return this.IMAGE.INVITE_RECEIVE_DONE
      return null
    }
  },
  methods: {
    // 倒计时结束
    onTimeup() {
      console.log('timeup')
    },
  }
}
</script>

<style lang="scss" scoped>
#task-progress{
  padding-bottom: 120rpx;
  /deep/.uni-countdown__number{
    font-weight: 600 !important;
    font-size: 28rpx !important;
  }
  .btn-black{
    // w220 h60 l-h60 text-center
    width: 220rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 24rpx;
    border-radius: 30rpx;
    background-color: #121314;
    color: #ffffff;
    &[disabled]{
      background-color: #EBEBEB;
      color: #121314;
    }
  }
  .invite-btn{
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    background-color: $uni-color-theme;
    color: $uni-color-primary;
    font-size: 28rpx;
    position: fixed;
    bottom: 0;
    border-radius: 0;
    &[disabled]{
      background-color: #C8CBD1;
    }
  }
  .receive-status-img{
    position: absolute;
    top: 0;
    right: 0;
    width: 371rpx;
    height: 287rpx;
  }
}
</style>