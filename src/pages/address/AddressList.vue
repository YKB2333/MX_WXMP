<template>
  <view class="page">
    <!-- 选择收货地址  -->
    <!-- <view class="h100 l-h100 text-center color-red bg-white fs14">
      <text>请选择收货地址：全国（新疆、内蒙除外）</text>
    </view> -->
    <!-- 收货地址 -->
    <view class="mt20 bg-white plr30" v-for="(item, index) in addressList" :key="item.id">
      <view @tap="selectedAddress(index)">
        <view class="row space-between pt40">
          <text class="fs-lg fw600">{{ item.consignee }}</text>
          <text class="color-gray">{{ item.mobile | formatMobile }}</text>
        </view>
        <view class="hairline-bottom ptb26 color-gray">
          <text>{{ `${item.provinceName}${item.cityName}${ item.districtName}${item.address}` }}</text>
        </view>
      </view>
      <view class="row space-between h100 l-h100 mb20">
        <view class="row space-between center-y">
          <image :src="IMAGE.RADIO_ACTIVE" class="w-h40 mr10"  @tap="switchRadio(item)" v-if="item.addressFlag === 1" />
          <image :src="IMAGE.RADIO_INACTIVE" class="w-h40 mr10"  @tap="switchRadio(item)" v-else />
          <text style="font-size: 26rpx;">默认地址</text>
        </view>
        <view>
          <text class="btn-black mr30" @tap="linkPage('edit', item)">编辑</text>
          <text class="btn-red" @tap="onDelete(item, index)">删除</text>
        </view>
      </view>
    </view>
    <view class="bg-pink color-white text-center h100 l-h100 fixed wpct100" style="bottom:0" @tap="linkPage('add')">
      <text>添加收货地址</text>
    </view>
  </view>
</template>

<script>
import { getAddressList, setDefaultAddress, deleteAddress } from '@/api/user/address'
import { RADIO_ACTIVE, RADIO_INACTIVE } from '@/imageConfig'

export default {
  name: 'AddressList',
  components: {  },
  data() {
    return {
      IMAGE: {
        RADIO_ACTIVE,
        RADIO_INACTIVE
      },
      addressList: [], // 获取收货地址
      refSelectedAddressId: '',
      sourceType: '', //用于接收前一个页面跳转过来的标识，用于订单确认页面回调选择地址用
    }
  },
  onShow() {
    this.fetchAddressList()
  },
  onLoad(options) {
    console.log(options)
    this.refSelectedAddressId = options.addressId
    this.sourceType = options.sourceType
  },
  computed: {},
  methods: {
    // 获取收货地址列表
    fetchAddressList() {
      getAddressList().then(res => {
        this.addressList = res.data
      })
    },
    // 删除地址
    onDelete(item, index) {
      console.log(item)
      // 删除的地址是否为默认的地址，如果是，删除后将剩余地址的第一条设置为默认
      let isDefault = item.addressFlag
      uni.showModal({
        title: '确认删除？',
        content: '删除收货地址',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            deleteAddress(item.id).then(res => {
              const deleteId = item.id
              this.addressList.splice(index, 1)

              if (isDefault && this.addressList.length) {
                this.fetchSetDefaultAddress(this.addressList[0].id)
              }
              // console.log('debugger', item.id, this.refSelectedAddressId)
              //如果删除的是当前已选择的地址，则判断默认地址是哪条记录，并发送选择事件消息给订单确认页面
              if(item.id == this.refSelectedAddressId) {
                const tempAddressList = this.addressList.filter(addr => addr.addressFlag == 1)
                if(tempAddressList.length){
                  this.refSelectedAddressId = tempAddressList[0].id
                  this.$eventHub.$emit('changeUserAddress', tempAddressList[0])
                }else{
                  if (this.addressList.length) {
                    this.refSelectedAddressId = this.addressList[0].id
                    this.$eventHub.$emit('changeUserAddress', this.addressList[0])
                  } else {
                    this.refSelectedAddressId = ''
                    this.$eventHub.$emit('changeUserAddress', null)
                  }
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    switchRadio(item) {
      if (item.addressFlag === 1) return
      this.fetchSetDefaultAddress(item.id)
      this.$eventHub.$emit('changeUserAddress', item)
    },
    // 设置默认地址
    fetchSetDefaultAddress(id) {
      uni.showLoading({mask: true})
      setDefaultAddress(id).then(() => {
        console.log('设置默认地址成功')
        this.addressList.forEach(ele => {
          if (ele.id === id) {
            ele.addressFlag = 1
          } else {
            ele.addressFlag = 0
          }
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
    linkPage(updateType, item) {
      if (updateType === 'add') {
        uni.navigateTo({
          url: `/pages/address/AddressEdit?updateType=add`
        })
      } else if (updateType === 'edit') {
        let str = JSON.stringify(item)
        uni.navigateTo({
          url: `/pages/address/AddressEdit?updateType=edit&address=${str}`
        })
      }
    },
    // 选择地址（从确定订单页面进来有效）
    selectedAddress(index) {
      if (this.sourceType === 'order') {
        console.info('address', index)
        this.$eventHub.$emit('changeUserAddress', this.addressList[index])
        wx.navigateBack()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  overflow-y: auto;
  background: #F2F4FA;
  padding-bottom: 100rpx;
}
.integral{
  position: absolute;
  left: 12%;
  top: 50%;
  transform: translate(0,-50%)
}
.btn-red{
  display: inline-block;
  width:100rpx;
  height:40rpx;
  line-height: 40rpx;
  text-align: center;
  background:rgba(157,160,164,0);
  border:2rpx solid rgba(255, 56, 56, 1);
  color: #FF3838;
  border-radius:20rpx;
  font-size: 12px;
}
.btn-black{
  display: inline-block;
  text-align: center;
  width:100rpx;
  height:40rpx;
  line-height: 40rpx;
  background:rgba(157,160,164,0);
  font-size: 12px;
  border:2rpx solid #121314;
  color: #121314;
  border-radius:20rpx;
}
</style>

