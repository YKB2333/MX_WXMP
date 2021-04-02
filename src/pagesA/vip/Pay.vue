<template>
  <view class="min-h-full bg-primary pt20" style="padding-bottom: 100rpx;">
    <view class="bg-white p30">
      <view class="row">
        <image :src="imgUrl" class="w-h140 mr30" />
        <view class="flex-1 col space-between">
          <view>
            <view class="fw600 ellipsis">秒推达人时长</view>
            <view class="fs-sm color-gray mt10">
              <text>有效时间</text>
              <text class="ml30">{{ validDays }}天</text>
            </view>
          </view>
          <view class="row space-between">
            <text class="color-red fs-lg fw600">{{ integral }}</text>
            <text>x1</text>
          </view>
        </view>
      </view>
    </view>
    <view class="bg-white plr30 ptb40 mt20">
      <text>您的喵豆：{{ curUserIntegral }}</text>
    </view>
    <view class="col wpct92 mauto mt30">
      <view>
        <text class="color-red mr4">*</text>
        <text class="fs12 color-gray">您将购买的商品为虚拟内容，购买后不支持退订、转让、退换，请斟酌确认。</text>
      </view>
      <view class="mt30">
        <text class="color-red mr4">*</text>
        <text class="fs12 color-gray">虚拟商品完成支付后直接生效，不实际发货</text>
      </view>
    </view>
    <!-- 底部栏 -->
    <view class="bottom-bar">
      <button v-if="curUserIntegral < integral" disabled class="bg-theme fw600 h-full" style="line-height:unset;" @click="onPay">喵豆不足</button>
      <button v-else class="bg-theme fw600 h-full" style="line-height:unset;" @click="onPay">确认支付</button>
    </view>

    <!-- 密码弹窗 -->
    <van-popup :show="showPasswordInput" close-on-click-overlay closeable @close="closePopup">
      <view class="plr30 ptb60">
        <view class="mb30">请输入密码</view>
        <password-input 
          ref="pwd"
          :maxlength="6" 
          @finish="finish"
        />
      </view>
    </van-popup>
  </view>
</template>

<script>
import { VIP_PIC } from '@/imageConfig'
import { getVipPayDetail } from '@/api/goods'
import { payVip } from '@/api/order'
import { checkIsSetPassword } from '@/api/member'
import PasswordInput from '_c/PasswordInput'

export default {
  name: "VipPay",
  components: { PasswordInput },
  data() {
    return {
      IMAGE: {
        VIP_PIC
      },
      imgUrl: '', // svip名称
      curUserIntegral: 0, // 当前用户的喵豆
      integral: 0, // svip购买需要的喵豆
      isSettedPwd: false, // 是否设置过密码
      showPasswordInput: false, // 是否显示密码输入弹窗
      validDays: '',  // 有效时间
      pwd: '', // 密码值
    }
  },
  computed: {
  },
  onLoad(options) {
    this.$eventHub.$off(this.$eventName.SET_PWD_SUCCESS)
    this.$eventHub.$on(this.$eventName.SET_PWD_SUCCESS, () => {
      console.log('监听密码设置成功')
      this.isSettedPwd = true
    })
    this.init()
  },
  methods: {
    async init() {
      try {
        uni.showLoading()
        await getVipPayDetail().then(res => {
          console.log('svip下单详情', res.data)
          if (res.data) {
            this.curUserIntegral = res.data.curUserIntegral
            this.integral = res.data.integral
            this.imgUrl = res.data.imgUrl
            this.validDays = JSON.parse(res.data.ownSpec).validDays
          }
        })
      } finally {
        uni.hideLoading()
      }
    },
    // 支付
    onPay() {
      if (this.isSettedPwd) {
        this.showPasswordInput = true
      } else {
        // 检查是否设置过密码
        checkIsSetPassword().then(res => {
          if (res.data) {
            this.showPasswordInput = true
          } else {
            uni.showModal({
              title: '未设置过密码',
              confirmText: '去设置',
              cancelText: '放弃',
              success: t => {
                if (t.confirm) {
                  uni.navigateTo({
                    url: `/pagesA/settings/Password`
                  })
                } else {
                  uni.navigateBack()
                }
              }
            })
          }
        })
      }
    },
    // 密码输入结束
    finish(val) {
      console.log(val)
      payVip(val).then(res => {
        console.log('提交', res.data)
        uni.showToast({ title: '充值成功', icon: 'none', mask: true })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }).catch(error => {
        this.$refs['pwd'].clear()
      })
    },
    closePopup() {
      this.showPasswordInput = false
      this.$refs['pwd'].clear()
    }
  },
}
</script>

<style lang="scss" scoped>
.bottom-bar{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  line-height: 100rpx;
  z-index: 2;
  box-shadow: 0 -10rpx 10rpx 0 rgba(203,209,227,0.2);
}
</style>