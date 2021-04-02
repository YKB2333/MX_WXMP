<template>
  <view id="invite-friend" class="bg-primary min-h-full">
    <view>
      <view class="row p30 mb20 bg-white">
        <image :src="IMAGE.TEMP_GIFT" class="w-h100" />
        <view class="flex-1 col space-around plr30">
          <text class="ellipsis">路飞迷你手办大放送啦～</text>
          <text class="fs-sm color-gray">已邀请 3 人 还差 1 人</text>
        </view>
        <view class="row center-y">
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h40" style="margin-right: -8rpx;" />
        </view>
      </view>

      <view class="row p30 mb20 bg-white">
        <image :src="IMAGE.TEMP_GIFT" class="w-h100" />
        <view class="flex-1 col space-around plr30">
          <text class="ellipsis">路飞迷你手办大放送啦～</text>
          <text class="fs-sm color-gray">待领奖</text>
        </view>
        <view class="row center-y">
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h40" style="margin-right: -8rpx;" />
        </view>
      </view>

      <view class="row p30 mb20 bg-white">
        <image :src="IMAGE.TEMP_GIFT" class="w-h100" />
        <view class="flex-1 col space-around plr30">
          <text class="ellipsis">路飞迷你手办大放送啦～</text>
          <text class="fs-sm color-gray">已成功</text>
        </view>
        <view class="row center-y">
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h40" style="margin-right: -8rpx;" />
        </view>
      </view>

      <view class="row p30 mb20 bg-white">
        <image :src="IMAGE.TEMP_GIFT" class="w-h100" />
        <view class="flex-1 col space-around plr30">
          <text class="ellipsis">路飞迷你手办大放送啦～</text>
          <text class="fs-sm color-gray">已失败</text>
        </view>
        <view class="row center-y">
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.TEMP_AVATAR" class="w-h40" style="margin-right: -8rpx;" />
          <image :src="IMAGE.AVATAR_INVITE" class="w-h40" style="margin-right: -8rpx;" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { AVATAR_INVITE, TEMP_AVATAR, TEMP_GIFT } from '@/imageConfig'

export default {
  name: "AttendanceRecord",
  data() {
    return {
      IMAGE: {
        AVATAR_INVITE,
        TEMP_AVATAR,
        TEMP_GIFT
      }
    }
  }
}
</script>

<style>

</style>