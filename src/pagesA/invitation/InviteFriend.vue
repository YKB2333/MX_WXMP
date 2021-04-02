<template>
  <view id="invite-friend" class="bg-primary min-h-full" style="padding-bottom: 120rpx;">
    <view>
      <view class="bg-white mb20">
        <view class="row p30 shadow"> 
          <image :src="IMAGE.TEMP_SPU_IMG" class="w-h220 mr30" />
          <view class="flex-1 col space-between">
            <view>
              <text class="block ellipsis2 fw600">Air Jordan 4 Kaws 联名款酷炫灰</text>
              <text class="block fs-sm color-gray mt16">需邀请50个用户</text>
            </view>
            <view class="row space-between center-y">
              <view class="color-gray">¥18866.00</view>
              <view class="fs-sm w200 h60 l-h60 text-center bg-theme radius-round">免费领取</view>
              <!-- <view class="fs-sm w200 h60 l-h60 text-center radius-round" style="background-color:#EBEBEB;">已抢光</view> -->
            </view>
          </view>
        </view>
        <view class="plr30 ptb24 row space-between center-y">
          <view>
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
          </view>
          <view class="fs-sm color-gray">已有6666人获奖</view>
        </view>
      </view>

      <view class="bg-white mb20">
        <view class="row p30 shadow"> 
          <image :src="IMAGE.TEMP_SPU_IMG" class="w-h220 mr30" />
          <view class="flex-1 col space-between">
            <view>
              <text class="block ellipsis2 fw600">Air Jordan 4 Kaws 联名款酷炫灰</text>
              <text class="block fs-sm color-gray mt16">需邀请50个用户</text>
            </view>
            <view class="row space-between center-y">
              <view class="color-gray">¥18866.00</view>
              <view class="fs-sm w200 h60 l-h60 text-center bg-theme radius-round">免费领取</view>
              <!-- <view class="fs-sm w200 h60 l-h60 text-center radius-round" style="background-color:#EBEBEB;">已抢光</view> -->
            </view>
          </view>
        </view>
        <view class="plr30 ptb24 row space-between center-y">
          <view>
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
          </view>
          <view class="fs-sm color-gray">已有5人获奖</view>
        </view>
      </view>

      <view class="bg-white mb20">
        <view class="row p30 shadow"> 
          <image :src="IMAGE.TEMP_SPU_IMG" class="w-h220 mr30" />
          <view class="flex-1 col space-between">
            <view>
              <text class="block ellipsis2 fw600">Air Jordan 4 Kaws 联名款酷炫灰</text>
              <text class="block fs-sm color-gray mt16">需邀请50个用户</text>
            </view>
            <view class="row space-between center-y">
              <view class="color-gray">¥18866.00</view>
              <view class="fs-sm w200 h60 l-h60 text-center bg-theme radius-round">免费领取</view>
              <!-- <view class="fs-sm w200 h60 l-h60 text-center radius-round" style="background-color:#EBEBEB;">已抢光</view> -->
            </view>
          </view>
        </view>
        <view class="plr30 ptb24 row space-between center-y">
          <view>
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.TEMP_AVATAR" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
            <image :src="IMAGE.AVATAR_INVITE" class="w-h40 mr10" />
          </view>
          <view class="fs-sm color-gray">已有5人获奖</view>
        </view>
      </view>
    </view>
    <navigator url="/pagesA/invitation/AttendanceRecord">
      <button class="w-full h100 l-h100 fw600 bg-theme fixed" style="bottom: 0;">参与记录</button>
    </navigator>
  </view>
</template>

<script>
import { AVATAR_INVITE, TEMP_AVATAR, TEMP_SPU_IMG } from '@/imageConfig'

export default {
  name: "InviteFriend",
  data() {
    return {
      IMAGE: {
        AVATAR_INVITE,
        TEMP_AVATAR,
        TEMP_SPU_IMG
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>