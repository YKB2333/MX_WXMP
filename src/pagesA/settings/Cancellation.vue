<template>
  <view class="col plr60" style="height:100vh;">
    <view class="flex-1 y-scroll">
      <view class="text-center fs-lg-big fw600 ptb40">永久注销账号</view>
      <view>
        <view class="fw600 mb40">注销后，将会：</view>
        <view class="text-word">1. 身份信息、会员权益、文章、评论将清空无法恢复</view>
        <view class="text-word">2. 交易信息将被清空<br>
          <text class="pl30">a. 对于已有订单请确保无纠纷</text><br />
          <text class="pl30">b. 售后权力将在注销时是为放弃</text>
        </view>
        <view class="text-word">3. 账户将被关闭，请确保账户没有余额</view>
        <view class="fw600 mtb40">以下情况无法注销：</view>
        <view class="text-word">1. 存在进行中的业务，包括订单、活动等</view>
        <view class="text-word">2. 最后一篇文章发布时间小于15天</view>
        <view class="text-word">3. 最后一个订单完成时间小于15天</view>
        <view class="text-word">4. 账户存在余额大于等于 10元</view>
        <view class="text-word">5. 账号存在纠纷，包括投诉举报与被投诉举报</view>
        <view class="text-word">6. 15天内存在修改密码行为或被冻结/解冻的情况</view>
      </view>
    </view>
    <view class="pb100 pt60">
      <button class="w-full fw600 ptb30 bg-theme text-center radius-round" style="line-height:1;" @click="onCancel">申请永久注销</button>
    </view>

    <!-- <van-popup>
      
    </van-popup> -->
  </view>
</template>

<script>
import { checkIsSetPassword } from '@/api/member'
import PasswordInput from '_c/PasswordInput'

export default {
  name: "Cancellation",
  components: { PasswordInput },
  data() {
    return {
    }
  },
  onLoad(options) {
  },
  methods: {
    // 永久注销
    async onCancel() {
      let isSetted = await this.isSetPassword()
      if (isSetted) { // 如果已设置过密码，显示输入密码弹窗

      } else {

      }
      // uni.showModal({
        //   title: ''
      // })
    },
    // 检查用户是否设置过密码
    isSetPassword() {
      return new Promise((resolve, reject) => {
        checkIsSetPassword().then(res => {
          rsolve(res.data)
        }).catch(() => {
          reject()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-word{
  font-size: 26rpx;
  color: #66686C;
  line-height: 56rpx;
}
</style>