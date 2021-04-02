<template>
  <view class="w-full" style="height:100vh;">
    <image :src="IMAGE.INVITE_BG" class="w-h-full" />
    <view class="container-wrapper">
      <view style="width:684rpx;height:578rpx;" class="relative">
        <image :src="IMAGE.INVITE_RECEIVE_UPDATE_1" class="w-h-full" />
        <view class="absolute" style="left: 80rpx;right:60rpx;top:60rpx;bottom:10rpx;">
          <view class="row center-y">
            <image :src="inviteRecord.headImgUrl || IMAGE.AVATAR_DEFAULT" class="w-h80 mr26" />
            <text class="fw600">我是{{inviteRecord.nikeName}}：</text>
          </view>
          <view class="mtb20 color-info ellipsis2">{{userInfo.nickName}}，跟我一起加入秒推达人，秒寻全球好物，分享精致生活！</view>
          <view>
            <text class="fw600 block mb14">成为达人可享有：</text>
            <text class="fw600 block mb14">1.分享返现</text>
            <text class="fw600 block mb14">2.自购立减</text>
            <text class="fw600 block mb14">3.月度奖励</text>
            <text class="fw600 block mb14">4.喵豆抵现</text>
            <text class="fw600 block">5.专业培训</text>
          </view>
        </view>
      </view>
      <view style="width:684rpx;height:30rpx;">
        <image :src="IMAGE.INVITE_RECEIVE_UPDATE_2" class="w-h-full" />
      </view>
      <view style="width:684rpx;height:170rpx;" class="relative">
        <image :src="IMAGE.INVITE_RECEIVE_UPDATE_3" class="w-h-full" />
        <view class="absolute" style="left: 80rpx;right:60rpx;top:10rpx;bottom:10rpx;">
          <text class="block mb20 color-info">你只需要完成其中一项即可升级达人：</text>
          <text class="block fw600 mb20">1.在App自购300元优选商品</text>
          <text class="block fw600">2.用30000喵豆兑换</text>
        </view>
      </view>
      <view style="width:684rpx;height:30rpx;">
        <image :src="IMAGE.INVITE_RECEIVE_UPDATE_2" class="w-h-full" />
      </view>
      <view style="width:684rpx;height:375rpx;" class="relative">
        <image :src="IMAGE.INVITE_RECEIVE_UPDATE_5" class="w-h-full" />
        <view class="absolute" style="left: 80rpx;right:60rpx;top:10rpx;bottom:10rpx;">
          <!--
          <text class="block mb20 color-info">填写微信号信息会方便他人找到你：</text>
          <input 
            placeholder="请输入微信号（非必填）" 
            placeholder-class="color-gray"
            class="hairline-bottom ptb20"
          />
          -->
          <button class="bg-theme color-primary fw600 h88 l-h88 radius-round mt100" @click="acceptInvite">
            接收邀请
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 接收邀请升级
import { AVATAR_DEFAULT, INVITE_BG, INVITE_RECEIVE_UPDATE_1, INVITE_RECEIVE_UPDATE_2, INVITE_RECEIVE_UPDATE_3, INVITE_RECEIVE_UPDATE_5 } from '@/imageConfig'
import { acceptOrRejectInvite } from '@/api/member'
import { mapGetters } from 'vuex'

export default {
  name: "InviteReceiveUpdate",
  data() {
    return {
      IMAGE: {
        AVATAR_DEFAULT,
        INVITE_BG,
        INVITE_RECEIVE_UPDATE_1,
        INVITE_RECEIVE_UPDATE_2,
        INVITE_RECEIVE_UPDATE_3,
        INVITE_RECEIVE_UPDATE_5
      },
      inviteRecord: {},
    }
  },
  onLoad(options) {
    if(options.data){
      this.inviteRecord = JSON.parse(options.data)
    }
  },
  methods: {
    acceptInvite() {
      acceptOrRejectInvite({
        id: this.inviteRecord.id,
        status: 1,
      }).then(res=>{
        console.info(res)
        uni.navigateBack()
      })
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.container-wrapper{
  position: absolute;
  // top: 20rpx;
  // bottom: 20rpx;
  left: 30rpx;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  image{
    vertical-align: top !important;
  }
}
</style>