<template>
  <view class="bg-primary min-h-full pb100">
    <view style="height:500rpx" class="bg-theme">
      <view class="row center-y space-between pt60">
        <view class="pl30">
          <view class="mb30">提现金额</view>
          <view class="fw600 fs-lg">¥<text style="font-size:68rpx;">{{ assetTotal | formatMoney }}</text></view>
        </view>
        <navigator url="/pagesA/mine/WithdrawalRecord">
          <view class="ptb24 pl50 pr32 fw600" style="background:rgba(255,255,255,0.5);border-radius: 36px 0px 0px 36px">提现记录</view>
        </navigator>
      </view>
    </view>
    <view class="relative" style="top:-240rpx">
      <view class="plr30">
        <view class="bg-white radius plr30 pt20 pb60">
          <view class="hairline-bottom ptb30 row"><text class="w140 fw600">收款人</text><input class="flex-1" v-model="bankForm.transName" placeholder="请输入收款人姓名" /></view>
          <view class="hairline-bottom ptb30 row"><text class="w140 fw600">银行卡号</text><input class="flex-1" v-model="bankForm.bankCardNo" placeholder="请输入收款人银行卡号" /></view>
          <view>
            <picker @change="onPickerChange" :value="currentBankIndex" :range="withdrawBanks">
              <view class="ptb30 row hairline-bottom">
                <text class="w140 fw600">选择银行</text>
                <view class="flex-1 row space-between center-y">
                  <text v-if="currentBankIndex >= 0">{{ withdrawBanks[currentBankIndex] }}</text>
                  <text v-else class="color-gray">请选择银行</text>
                  <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
                </view>
              </view>
            </picker>
          </view>
          <view class="hairline-bottom ptb30 row"><text class="w140 fw600">开户行</text><input class="flex-1" v-model="bankForm.bankOfDeposit" placeholder="请输入开户行" /></view>
          <view class="hairline-bottom ptb30 row"><text class="w140 fw600">身份证号</text><input class="flex-1" v-model="bankForm.idCard" placeholder="请输入身份证号" /></view>
          <view class="h60 l-h60 text-center">
            <text v-if="minAmt == 0 || assetTotal < minAmt * 100" class="fs-sm color-red">满{{ minAmt }}元即可申请提现</text>
          </view>
          <button class="apply-btn" :loading="btnLoading" :disabled="btnDisabled" @tap="onSubmit">申请提现</button>
        </view>
      </view>
    </view>
    <view style="margin-top:-240rpx">
      <!-- 提现规则 -->
      <view v-if="richTextRule" class="fs-sm mt50 color-info plr40">
        <rich-text :nodes="richTextRule"></rich-text>
      </view>
      <!-- 税费说明 -->
      <view v-if="richTextTax" class="fs-sm mt50 color-info plr40">
        <rich-text :nodes="richTextTax"></rich-text>
      </view>
    </view>
    <!-- 密码框 -->
    <van-popup :show="isShowPwd" closeable @close="closePwdPopup" custom-class="radius-twenty" position="center">
      <view class="pl80 pr80 ptb70 radius">
        <view class="text-center pb60 fw500">
          <text>请输入账户密码</text>
        </view>
        <view class="content">
          <validcode
            ref="pwd"
            :maxlength="6"
            :isPwd="true"
            @finish="onFinishPassword"

            :boxClass="`w450`"
            itemClass="w76 h76 l-h76"
          ></validcode>
        </view>
        <view class="pt30 row space-between fs12">
          <text style="color:#FF3838">{{isErrorPwd ? '您输入的密码有误':''}}</text>
          <navigator url="/pagesA/settings/Password">
            <text>忘记密码?</text>
          </navigator>
        </view>
      </view>
    </van-popup>
    <!-- 提现成功弹窗 -->
    <van-popup :show="submitSuccessPopup.show" close-on-click-overlay custom-style="width:90%;border-radius:10px;" @click-overlay="submitSuccessPopup.show = false;">
      <view class="plr30 ptb60 hairline-bottom">
        <view class="mb40 text-center"><image :src="IMAGE.ICON_SUCCESS" class="w-h120" /></view>
        <view class="fs-lg fw600 text-center mb24">提现申请提交成功</view>
        <view class="text-center" v-if="withdrawDealDayText">本次提现申请将于{{ withdrawDealDayText }}审核到账</view>
        <view class="radius plr30 ptb40 mt60" style="background-color:rgba(157,160,164, 0.1);">
          <view class="mb20">
            <text>提现金额：{{ submitSuccessPopup.data.amount | formatMoney }}元</text>
            <text class="color-gray">（含税费{{ submitSuccessPopup.data.tax | formatMoney }}元）</text>
          </view>
          <view class="mb20">预计到账：{{ (submitSuccessPopup.data.amount - submitSuccessPopup.data.tax) | formatMoney }}元</view>
          <view>收款账户：{{ submitSuccessPopup.data.bankName }}（{{ submitSuccessPopup.data.bankCardNo }}）</view>
        </view>
      </view>
      <view class="fs-lg fw600 text-center ptb40" @tap="submitSuccessPopup.show = false;">确定</view>
    </van-popup>

  </view>
</template>

<script>
import validcode from "_c/PasswordInput"
import { ARROW_RIGHT, ICON_SUCCESS } from "@/imageConfig"
import { getSysdictQuery } from "@/api/tools"
import { checkWithdraw, getUserBindBankList, saveUpdateBank, applyWithdraw } from "@/api/member/bank"
import { checkIsSetPassword, validPassword } from "@/api/member"
import { withdrawBanks } from "@/config"
import { checkIdCard, isEmpty } from '@/utils'

export default {
  name: "Withdrawal",
  components: { validcode },
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT,
        ICON_SUCCESS
      },
      assetTotal: 0, // 可提现金额
      richTextRule: "", // 提现规则富文本
      richTextTax: '', // 税费说明富文本
      minAmt: 0, // 最低提现金额
      withdrawBanks, // 提现银行列表
      currentBankIndex: -1,
      // 银行表单
      bankForm: {
        transName: "", // 收款人姓名
        bankCardNo: "", // 银行卡号
        bankName: "", // 银行名称
        bankOfDeposit: "", // 开户支行
        idCard: "", // 身份证号
      },
      btnLoading: false,
      btnDisabled: true,
      isShowPwd: false, // 显示密码
      isErrorPwd: false, // 显示密码输入错误
      // 显示填写成功弹窗
      submitSuccessPopup: {
        show: false,
        data: {
          amount: 0,
          bankCardNo: "",
          bankName: "",
          tax: 0
        }
      },
      withdrawDealDay: null,
      withdrawDealDayText: ''
    }
  },
  computed: {},
  onLoad(options) {
    this.assetTotal = Number(options.assetTotal)
    this.init()
  },
  methods: {
    async init() {
      // 检查提现，如果已有提现在处理，不能继续提现
      let check = await this.fetchCheckWithdraw()
      console.log("check", check)
      if (!check.success) {
        this.btnDisabled = true
        uni.showToast({ title: check.resInfo, icon: 'none', duration: 3000 })
      }
      this.fetchUserBankList()
      // 获取最低提现金额
      getSysdictQuery({dictKey: "MINIMUM_AMT", dictType: "SYSTEM_CONFIG"}).then(res => {
        console.log('最低提现金额', res.data)
        this.minAmt = Number(res.data)
        if (this.assetTotal >= this.minAmt * 100) {
          this.btnDisabled = false
        }
      })
      // 提现规则
      getSysdictQuery({dictType: "SYSTEM_CONFIG", dictKey: "WITHDRAW_RULE"}).then(res => {
        this.richTextRule = res.data.replace(/\\n/g, '<br />')
        console.log(this.richTextRule)
      })
      // 税费说明
      getSysdictQuery({dictType: "SYSTEM_CONFIG", dictKey: "WITHDRAW_TAX_RULE"}).then(res => {
        this.richTextTax = res.data.replace(/\\n/g, '<br />')
      })
      getSysdictQuery({ dictType: "SYSTEM_CONFIG", dictKey: "WITHDRAW_AUDIT_DAY" }).then(res => {
        console.log('提现审核时间', res.data)
        this.withdrawDealDay = Number(res.data)
      })
    },
    fetchCheckWithdraw() {
      return new Promise((resolve, reject) => {
        checkWithdraw().then(res => {
          resolve(res)
        }).catch(error => {
          resolve(error)
        })
      })
    },
    // 获取用户绑定的银行列表
    fetchUserBankList() {
      getUserBindBankList().then(res => {
        this.userBankList = res.data
        if (res.data.length) {
          this.bankForm = res.data[0]
          this.currentBankIndex = this.withdrawBanks.findIndex(ele => ele === this.bankForm.bankName)
        }
      })
    },
    onPickerChange(e) {
      // console.log(e)
      this.currentBankIndex = Number(e.detail.value)
      this.bankForm.bankName = this.withdrawBanks[this.currentBankIndex]
    },
    // 添加/编辑
    async onSubmit() {
      try {
        if (this.btnLoading) return
        console.log(this.bankForm)
        if (this.bankForm.transName.length < 2 || this.bankForm.transName.length > 15) {
          uni.showToast({ title: "请输入2-15个字的收款人姓名", icon: "none" })
          return
        }
        if (this.bankForm.bankCardNo.length < 16 || this.bankForm.bankCardNo.length > 32) {
          uni.showToast({ title: "请输入正确的银行卡号", icon: "none" })
          return
        }
        if (isEmpty(this.bankForm.bankName)) {
          uni.showToast({ title: "请选择银行", icon: "none" })
          return
        }
        if (isEmpty(this.bankForm.bankOfDeposit)) {
          uni.showToast({ title: "请输入开户行", icon: "none" })
          return
        }
        if (isEmpty(this.bankForm.idCard)) {
          uni.showToast({ title: "请输入身份证号码", icon: "none" })
          return
        }
        if (!checkIdCard(this.bankForm.idCard)) {
          uni.showToast({ title: "身份证号码格式不正确", icon: "none" })
          return
        }
        this.btnLoading = true
        // 保存/修改银行卡
        let saveUpdate = await saveUpdateBank(this.bankForm)
        // 检查是否设置密码
        let checkPwd = await checkIsSetPassword()
        if(checkPwd.data) { // 已设置密码
          this.isShowPwd = true
          this.$refs['pwd'].isFocus = false
          setTimeout(()=>{
            this.$refs['pwd'].isFocus = true
          }, 100)
        } else {
          uni.showModal({
            content: '未设置过密码',
            confirmText: '去设置',
            success: (t) => {
              if (t.confirm) {
                uni.navigateTo({ url: `/pagesA/settings/Password` })
              }
            }
          })
        }
      } catch (error) {
      } finally {
        this.btnLoading = false
      }
    },
    closePwdPopup() {
      this.isShowPwd = false
      this.$refs['pwd'].clear()
    },
    //获取密码
    async onFinishPassword(pwd) {
      try {
        uni.showLoading({ mask: true })
        let { data } = await validPassword(pwd)
        if (!data) {
          this.isErrorPwd = true // 密码错误
          this.$refs['pwd'].clear() // 清空已输入的密码
        } else {
          this.isErrorPwd = false
          this.closePwdPopup()
          let { data }  = await applyWithdraw({
            amount: this.assetTotal,
            bankCardNo: this.bankForm.bankCardNo,
            transName: this.bankForm.transName,
            bankName: this.bankForm.bankName,
            bankOfDeposit: this.bankForm.bankOfDeposit,
            idCard: this.bankForm.idCard
          })
          this.submitSuccessPopup.show = true
          this.submitSuccessPopup.data = data
          this.initWithdrawDealDayText()
          this.assetTotal = 0
          this.btnDisabled = true
        }
      } catch (error) {
        console.log('catch', error)
      } finally {
        uni.hideLoading()
      }
    },
    // 
    initWithdrawDealDayText() {
      if (this.withdrawDealDay !== null) {
        let timestap = new Date()
        let day = timestap.getDate()
        // 如果创建时间的日期大于20号，显示下个月的20号，否则显示当月20号
        if (day > this.withdrawDealDay) {
          this.withdrawDealDayText = `下月${this.withdrawDealDay}号`
        } else {
          this.withdrawDealDayText = `本月${this.withdrawDealDay}号`
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-btn{
  // bg-theme h88 l-h88 fw600 color-primary fw600 radius-round
  background-color: $uni-color-theme;
  height: 88rpx;
  line-height: 88rpx;
  font-weight: 600;
  color: $uni-color-primary;
  border-radius: 60px;
  &[disabled]{
    background-color:rgba(255,209,0, 0.2);
  }
}
</style>
<style lang="scss">
.w-border-red {
  border: 1px solid #ff3838 !important;
}
</style>
