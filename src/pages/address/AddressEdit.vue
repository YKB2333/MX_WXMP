<template>
  <view class="page">
    <view class="plr30 pb30 bg-white">
      <input placeholder="收货人名称" class="ptb30 hairline-bottom" v-model="form.consignee" />
      <input placeholder="手机号码" type="number" class="ptb30 hairline-bottom" v-model="form.mobile" />
      <!-- <picker mode="region" :value="region" @change="onSelectAddressChange">
        <view class="ptb30 hairline-bottom row center-y space-between">
          <text class="color-gray" v-if="region.length === 0">所在地区</text>
          <text v-else class="color-primary">{{ `${region.join('-')}`}}</text>
          <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
        </view>
      </picker> -->
      <view class="ptb30 hairline-bottom row center-y space-between" @tap="showAddressPicker">
        <text class="color-gray" v-if="region.length === 0">所在地区</text>
        <text v-else class="color-primary">{{ `${region.join('-')}`}}</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>
      <view>
        <textarea 
          placeholder="详细收货地址：如道路、门牌号、小区、楼栋号等" 
          class="h100 ptb30 block mb20 w-full" 
          v-model="form.address" 
          placeholder-class="color-gray"
          :maxlength="60"
          @input="onDetailAddressInput"
        />
        <view class="color-gray fs-sm row flex-end">{{ currentInputLength }}/60</view>
      </view>
    </view>
    <view class="bg-pink color-white text-center h100 l-h100 fixed wpct100" style="bottom:0" @click="onSave">
      <text>保存</text>
    </view>
    <address-picker ref="address-picker" @change="onSelectAddressChange" v-model="code" />
  </view>
</template>

<script>
import { updateAddress } from '@/api/user/address'
import { validPhone } from '@/utils'
import { ARROW_RIGHT } from '@/imageConfig'
import AddressPicker from '_c/AddressPicker'

export default {
  name: 'AddressEdit',
  components: { AddressPicker },
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT
      },
      updateType: 'add', // 更新类型：add添加地址，edit编辑地址
      form: {
        "consignee": '', // 收货人
        "mobile": '',   // 手机
        "provinceName": '', // 省名称
        "cityName": '', // 市名称
        "districtName": '', // 区名称
        "address": '', // 详细地址
        "addressFlag": 0, // 1：默认地址, 0非默认
        "provinceId": '',
        "cityId": '',
        "districtId": '',
      },
      region: [], // ['广东省', '广州市', '海珠区']
      code: [], // ['440000', '440100', '440105']
      currentInputLength: 0, // 当前输入长度
    }
  },

  computed: {},
  onLoad(options) {
    this.updateType = options.updateType
    if (this.updateType === 'edit') {
      let data = JSON.parse(options.address)
      console.log(data)
      this.form = data
      this.code = [data.provinceId, data.cityId, data.districtId]
      this.region = [data.provinceName, data.cityName, data.districtName]
      this.currentInputLength = data.address.length
      console.log('code', this.code)
    }
    if(options.type == 'new'){
      uni.setNavigationBarTitle({
        title: "添加收货地址"
      });
    }
  },
  methods: {
    showAddressPicker() {
      this.$refs['address-picker'].show()
    },
    onDetailAddressInput(e) {
      // console.log(e.detail.value)
      this.currentInputLength = e.detail.value.length
    },
    // 确定区域时触发
    // onSelectAddressChange(e) {
    //   let data = e.detail
    //   console.log(data)
    //   this.region = data.value // 省市区名称数组
    //   this.code = data.code // 省市区编码数组
    // },
    onSelectAddressChange(data) {
      console.log(data)
      this.region = data.value // 省市区名称数组
      this.code = data.code // 省市区编码数组
    },
    // 保存
    onSave() {
      if (!this.form.consignee) {
        uni.showToast({title: '请输入收货人名称', icon: 'none'})
        return
      }
      if (!this.form.mobile) {
        uni.showToast({title: '请输入手机号', icon: 'none'})
        return
      }
      if(!validPhone(this.form.mobile)) {
        uni.showToast({title: '请输入正确的手机号码', icon: 'none'})
        return
      }
      console.log(this.region.length,this.code.length)
      if (this.region.length < 3 || this.code.length < 3) {
        uni.showToast({title: '请选择收货地址', icon: 'none'})
        return
      }
      if (!this.form.address) {
        uni.showToast({title: '请输入详细地址', icon: 'none'})
        return
      }
      this.form.provinceId = this.code[0]
      this.form.cityId = this.code[1]
      this.form.districtId = this.code[2]
      this.form.provinceName = this.region[0]
      this.form.cityName = this.region[1]
      this.form.districtName = this.region[2]
      if (this.updateType === 'add') { // 添加地址
        uni.showLoading({mask: true})
        updateAddress('add', this.form).then(res => {
          // 添加成功后返回
          uni.navigateBack()
        }).finally(() => {
          uni.hideLoading()
        })
      } else if (this.updateType === 'edit') { // 修改地址
        uni.showLoading({mask: true})
        updateAddress('edit', this.form).then(res => {
          // 添加成功后返回
          uni.navigateBack()
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

