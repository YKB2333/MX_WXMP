<template>
  <view class="bg-primary col" style="height:100vh;">
    <view class="flex-1 pt20">
      <view class="bg-white plr30 ptb20 hairline-bottom">
        <input placeholder="姓名" :value="form.name" @input="(e) => inputChange(e, 'name')" />
      </view>
      <view class="bg-white plr30 ptb20 hairline-bottom">
        <input placeholder="身份证号" :value="form.idCard" @input="(e) => inputChange(e, 'idCard')" />
      </view>
      <view class="bg-white plr30 ptb20">
        <input placeholder="手机号" type="number" :value="form.mobile" @input="(e) => inputChange(e, 'mobile')" />
      </view>
      <!-- <view class="plr30 mt40">
        <view class="fw600 mb20">填写说明：</view>
        <text class="color-gray">实名信息用于您提现奖励金时打款所用，若未填写或者填写不正确将可能导致提现失败</text>
      </view> -->
    </view>
    <button class="bottom-bar-btn" @tap="onSave" :loading="btnLoading">保存</button>
  </view>
</template>

<script>
import { checkIdCard, isEmpty, validPhone } from '@/utils'
import { addRealnameInfo, updateRealnameInfo, getRealnameList } from '@/api/user'

export default {
  name: 'Realname',
  components: {},
  data() {
    return {
      form: {
        name: '', // 姓名
        idCard: '', // 身份证号
        mobile: '', // 手机号
      },
      btnLoading: false,
      needCallback: false, // 是否需要回调
    }
  },
  computed: {},
  onLoad(options) {
    if (options.needCallback) {
      this.needCallback = Boolean(options.needCallback)
    }
    this.init()
  },
  methods: {
    init() {
      uni.showLoading()
      getRealnameList().then(res => {
        if (res.data.length > 0) {
          this.form = res.data[0]
        }
      }).finally(() => {
        uni.hideLoading()
      })
    },
    inputChange(e, key) {
      // console.log(e, key)
      this.form[key] = e.detail.value
    },
    onSave() {
      if (this.btnLoading) return
      if (isEmpty(this.form.name)) {
        uni.showToast({ title: '姓名不能为空', icon: 'none' })
        return
      }
      if (isEmpty(this.form.idCard)) {
        uni.showToast({ title: '身份证号码不能为空', icon: 'none' })
        return
      }
      if (!checkIdCard(this.form.idCard)) {
        uni.showToast({ title: '身份证号码格式不正确', icon: 'none' })
        return
      }
      if (isEmpty(this.form.mobile)) {
        uni.showToast({ title: '手机号码不能为空', icon: 'none' })
        return
      }
      if (!validPhone(this.form.mobile)) {
        uni.showToast({ title: '手机号码格式不正确', icon: 'none' })
        return
      }
      console.log(this.form)
      if (this.form.id) { // 修改
      console.log(this.form)
        this.btnLoading = true
        updateRealnameInfo(this.form).then(res => {
          if (this.needCallback) {
            this.$eventHub.$emit(this.$eventName.SAVE_REALNAME_SUCCESS, res.data)
          }
          uni.navigateBack({
            success: () => {
              uni.showToast({ title: '修改成功', icon: 'none', duration: 1500 })
            }
          })
        }).finally(() => {
          this.btnLoading = false
        })
      } else { // 添加
        this.btnLoading = true
        addRealnameInfo(this.form).then(res => {
          if (this.needCallback) {
            this.$eventHub.$emit(this.$eventName.SAVE_REALNAME_SUCCESS, res.data)
          }
          uni.navigateBack({
            success: () => {
              // uni.showToast({ title: '添加成功', icon: 'none', duration: 1500 })
            }
          })
        }).finally(() => {
          this.btnLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-bar-btn{
  // background-color: $uni-color-theme;
  background-color: #FF9EA8;
  color:#fff;
  width: 100%;
  font-weight: 600;
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  text-align: center;
}
@media screen and(min-width: 375px)and(max-height: 812px){
  .bottom-bar-btn{
    padding-bottom: 30rpx;
  }
}
</style>
