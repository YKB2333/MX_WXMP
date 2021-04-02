<template>
  <view class="col" style="height: 100vh;">
    <view class="flex-1 col" :style="{background: 'url('+IMAGE.INVITE_BG+')'}">
      <view class="ptb40" style="padding-left: 130rpx;padding-right: 130rpx;">
        <view class="color-red fs-lg fw600 mb40 text-center">邀请好友注册立得500喵豆</view>
        <view class="row space-between center-y">
          <view class="col center">
            <image :src="IMAGE.INVITE_ICON_SHARE" class="w-h68 mb20" />
            <text class="fs-sm">转发海报</text>
          </view>
          <image :src="IMAGE.ARROW_RIGHT" class="w14 h24 relative" style="top:-32rpx;" />
          <view class="col center">
            <image :src="IMAGE.INVITE_ICON_SETUP" class="w-h68 mb20" />
            <text class="fs-sm">好友下载APP并注册</text>
          </view>
          <image :src="IMAGE.ARROW_RIGHT" class="w14 h24 relative" style="top:-32rpx;" />
          <view class="col center">
            <image :src="IMAGE.INVITE_ICON_INVITE" class="w-h68 mb20" />
            <text class="fs-sm">绑定完成</text>
          </view>
        </view>
      </view>
      <view class="flex-1" style="padding-left: 130rpx;padding-right: 130rpx;">
        <image :src="IMAGE.INVITE_INVITE" class="w-full" mode="widthFix" />
      </view>
    </view>

    <view class="row space-between plr90 ptb30" style="background-color: #FFDC4D;">
      <view class="row center-y">
        <image :src="IMAGE.MATERIAL_ICON_WECHAT" class="w-h36 mr12" />
        <text class="fs-sm">微信好友</text>
      </view>
      <view class="row center-y">
        <image :src="IMAGE.MATERIAL_ICON_PYQ" class="w-h36 mr12" />
        <text class="fs-sm">朋友圈</text>
      </view>
      <view class="row center-y">
        <image :src="IMAGE.MATERIAL_ICON_SAVE" class="w-h36 mr12" />
        <text class="fs-sm">保存本地</text>
      </view>
    </view>
  </view>
</template>

<script>
import { 
  INVITE_BG, INVITE_ICON_INVITE, INVITE_ICON_SETUP, INVITE_ICON_SHARE, INVITE_INVITE,
  MATERIAL_ICON_PYQ, MATERIAL_ICON_SAVE,MATERIAL_ICON_WECHAT, ARROW_RIGHT
} from '@/imageConfig'
export default {
  name: "InviteMine",
  data() {
    return {
      IMAGE: {
        INVITE_BG,
        INVITE_ICON_INVITE,
        INVITE_ICON_SETUP,
        INVITE_ICON_SHARE,
        INVITE_INVITE,
        MATERIAL_ICON_PYQ,
        MATERIAL_ICON_SAVE,
        MATERIAL_ICON_WECHAT,
        ARROW_RIGHT
      },
    }
  },
  onLoad(options) {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>