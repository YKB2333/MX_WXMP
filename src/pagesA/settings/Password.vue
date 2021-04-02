<template>
  <view class="page">
    <!-- 验证码 -->
    <view class="wpct80 mauto" v-if="!showPwd">
      <view class="row space-between center-y  hairline-bottom mt40">
        <input type="number" class="wpct70 h90" :maxlength="6" @input="onValidCodeInput">
        <text class="FFAE00 fs-sm" v-if="leftTime == 0" @tap="onSendSms">发送验证码</text>
        <text class="FFAE00 fs-sm" v-else>{{ leftTime }}s</text>
      </view>
      <text class="pt30 block fs-sm color-gray">将向{{ userInfo && userInfo.mobile | formatMobile }}发送短信</text>
    </view>

    <view class="content mt100" v-if="showPwd">
      <validcode ref="pwd" :maxlength="6" :isPwd="true" @finish="onInputFinish"></validcode>
      <text class="pt30 block fs-sm wpct80 mauto color-gray" v-if="isFirstPwd">请输入6位数字密码</text>
      <text class="pt30 block fs-sm wpct80 mauto color-gray" v-else>请再输入一次</text>
    </view>
  </view>
</template>

<script>
import validcode from '_c/PasswordInput'
import { sendMessageCode, verification } from '@/api/tools/message'
import { setNewPassword } from '@/api/member'
import { mapGetters } from 'vuex'

export default {
  name: "SetPassword",
  components: { validcode },
  data() {
    return {
      timer: '',
      leftTime: 0,
      isClickSmsBtn: false, // 是否已经点击过发送密码
      showPwd: false, // 是否显示密码框
      password: '', // 第一次的密码
      confirmPassword: '', // 确认密码
      isFirstPwd: true, // 第一次输入密码
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad() {

  },
  methods: {  
    // 监听密码框输入完成
    onInputFinish(val) {
      console.log(val)
      if (this.password) {
        // 确认密码
        this.confirmPassword = val
        if (val !== this.password) {
          console.log("两次密码设置不正确")
          uni.showToast({ title: '两次密码不一致', icon: 'none' })
          this.$refs.pwd.clear()
          this.confirmPassword = ''
        } else {
          // 发起设置密码请求
          setNewPassword(this.password, this.confirmPassword).then(res => {
            uni.showToast({ title: '设置密码成功', icon: 'none' })
            this.$eventHub.$emit(this.$eventName.SET_PWD_SUCCESS)
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
          }).catch(error => {
            if (error.resCode === '99997') { // 密码太简单
              // 回到第一次输入密码的状态
              this.password = ''
              this.confirmPassword = ''
              this.isFirstPwd = true
              this.$refs.pwd.clear()
            } else {
              // 只清除确认密码
              this.confirmPassword = ''
              this.$refs.pwd.clear()
            }
          })
        }
      } else {
        // 第一次密码
        this.password = val
        this.isFirstPwd = false
        this.$refs.pwd.clear()
      }
    },
    // 发送短信
    onSendSms() {
      this.isClickSmsBtn = true
      sendMessageCode(this.userInfo.mobile).then(res => {
        this.leftTime = 60
        this.timer = setInterval(() => {
          if (this.leftTime <= 0) {
            clearInterval(this.timer)
            this.leftTime = 0
            return
          } else {
            this.leftTime--
          }
        }, 1000)
      })
    },
    // 校验短信验证码
    onValidCodeInput(e) {
      // 未点击发送验证码按钮时不触发
      if (!this.isClickSmsBtn) return
			let { value } = e.detail
      console.log(value)
      if(value.length == 6) {
        verification(this.userInfo.mobile, value).then(res => {
          this.showPwd = true
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.FFAE00{
  color: #FFAE00;
}

</style>
