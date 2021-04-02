<template>
  <view class="min-h-full pages pb100">
    <view class="head hidden">
      <view>
        <view class="row space-between center-y">
          <view class="fw600 fs-lg-add">填写退货物流</view>
        </view>
        <view class="mb28 fs-sm">请将商品邮寄到以下地址并填写准确的物流信息</view>
      </view>
    </view>
    <view class="plr30 bg-white area-info" >    <!-- 地址信息，主盒子130px -->
      <view class="row center-y">    <!-- 挪上去160px的盒子 -->
        <image :src="IMAGE.AREA_POSITION" class="w64 h64" />
        <view class="flex-1 pl16 l-h44">
          <view class="ellipsis row center-y space-between pb10">
            <text>
              <text>{{addressList.documentName}}</text>
              <text class="color-gray pl10 fs-sm-add">{{addressList.documentMobile}}</text>
            </text>
            <text @click="copyToClipboard(addressList.documentName+' '+addressList.documentMobile+' '+addressListDetail)" style="line-height:1;border:2rpx solid rgba(157,160,164,1); border-radius:22rpx;" class="fs-sm color-red ptb8 plr22">
              复制
            </text>
          </view>
          <view class="ellipsis2 l-h34">{{orderData.orderType == 4 ? '虚拟物品，线上发货' : addressListDetail}}</view>
        </view>
      </view>
    </view>
    <view class="bg-white plr30">
      <!-- 商品信息 -->
      <view class="mb20 bg-white ">
        <view :key="index" v-for="(item,index) in returnData.orderDetails" :class="index==0?'':'hairline-top'">
          <goods
            :img="item.skuPrimaryPic"
            :name="item.skuName"
            :attr-value="item.ownSpec"
            :price="item.price"
            :quantity="item.quantity">
          </goods>
        </view>
      </view>
      <!-- 商品总额 -->
    </view>
    <view class="mb20 bg-white plr30">
      <view style="font-size:30rpx;" class="pt34 row center-y bg-white">
        <text>包裹信息</text>
        <text class="fs-sm color-red pl18">(仅能填写一次且不能修改)</text>
      </view>
      <view class="hairline-bottom ptb34 row center-y bg-white">
        <text>物流公司</text>
        <input 
          placeholder="请输入物流公司"
          placeholder-class="gray-color"
          class="flex-1 pl60"
          v-model="logisticsCompanyName"
        />
      </view>
      <view class="hairline-bottom ptb34 row center-y bg-white">
        <text>物流单号</text>
        <input 
          placeholder="请输入物流单号"
          placeholder-class="gray-color"
          v-model="expressNo"
          class="flex-1 pl60"
        />
      </view>
    </view>
      <!-- 底部按钮 -->
    <view class="bottomClick">
      <text class="save" @tap="grayBtnMethod">确认保存</text>
    </view>
  </view>
</template>

<script>
import Goods from '../components/Goods'
import { returnOrderDetail,fillLogisticsInfo } from '@/api/order/return'
import { AREA_POSITION } from '@/imageConfig'
import { copyToClipboard } from '@/utils'
import { kd100AppId } from "@/config";

export default {
  name: "logistics",
  components: {Goods },
  data() {
    return {
      IMAGE: {
        AREA_POSITION
      },
      returnsId: '',
      returnData: {},
      addressList:{},
      order: {},
      expressNo:'',
      logisticsCompanyName:'',
      source:'',
      // showLogistics: false
    };
  },
  onShow() {

  },
  onLoad(options) {
    this.returnsId = options.returnsId
    this.source = options.source
    this.init()
  },
  computed:{
    addressListDetail(){
      let str = ""
      let addressList = this.addressList
      if(addressList.country) str+=addressList.country
      if(addressList.province) str+=addressList.province
      if(addressList.city) str+=addressList.city
      if(addressList.district) str+=addressList.district
      if(addressList.detailAddress) str+=addressList.detailAddress
      return str
    }
  },
  methods: {
    copyToClipboard,
    init(){
      returnOrderDetail(this.returnsId).then(res => {
        this.returnData = res.data
        if(this.returnData && this.returnData.returnAddressInfo){
          this.addressList = JSON.parse(this.returnData.returnAddressInfo)
          console.log(this.addressList)
        }
        this.returnData.orderDetails.forEach(item => {
          if(item.ownSpec){
            let skuOwnSpec = JSON.parse(item.ownSpec)
            item.ownSpec = ''
            for(let key in skuOwnSpec){
              item.ownSpec += skuOwnSpec[key] + ';'
            }
            item.ownSpec = item.ownSpec.substring(0, item.ownSpec.length - 1)
          }else{
            item.ownSpec = ''
          }
        })
      })
    },
    grayBtnMethod() {
      //保存
      if (!this.logisticsCompanyName) {
          uni.showToast({ title: '请输入物流公司名称', icon: 'none' })
          return
        }
        if (!this.expressNo) {
          uni.showToast({ title: '请输入物流单号', icon: 'none' })
          return
        }
        uni.showModal({
          title: '确认提交？',
          success: t => {
            if (t.confirm) {
              uni.showLoading({ title: '提交中...', mask: true })
              fillLogisticsInfo({
                "id": this.returnsId,
                "expressNo": this.expressNo,
                "logisticsCompanyName": this.logisticsCompanyName
              }).then(res => {
                console.log('提交成功')
                this.callback()
                uni.navigateBack()
              }).finally(() => {
                uni.hideLoading()
              })
            }
          }
        })
    },
    goKD100(no){
      console.info('跳转到快递100，查询订单：' + no)
      wx.navigateToMiniProgram({
        appId: kd100AppId,
        path: `/pages/result/result?nu=${no}`,
      })
    },
    flushList() {
      this.init()
    },
    callback() {
      if(this.source === 'orderList'){ //刷新订单列表
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
      }else if(this.source === 'orderDetail'){ //刷新订单详情
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
        this.$eventHub.$emit(this.$eventName.ORDER_DETAIL_REFLUSH, true)
      }else if(this.source === 'returnList'){ //刷新退换单列表
        this.$eventHub.$emit(this.$eventName.RETURN_LIST_REFLUSH, true)
      }else if(this.source === 'returnDetail'){ //刷新退换单详情
        this.$eventHub.$emit(this.$eventName.RETURN_DETAIL_REFLUSH, true)
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.pages{
   background-color: #F2F4FA;
}
.head{
  padding:0 6%;
  // background-color: #FFD100;
  background-color: #FFf;
  color:$uni-color-primary;
  padding-bottom: 80rpx;
  padding-top: 23rpx;
  line-height: 1;
  >view{
    position: relative;
    >view{
      margin-bottom: 18rpx;
    }
    .arrow{
      position: absolute;
      right:0;
      top:30rpx;
    }
  }
}
.area-info{
  height: 100rpx;
  >view{
    height: 167rpx;
    transform: translateY(-80rpx);
    z-index: 999;
    background-color: #fff;
    box-shadow:0 0 20rpx 0 rgba(196,196,196,0.6);
    border-radius:20rpx;
    padding:0 30rpx;
  }
}
.solidBottom1Px{
  border-bottom: 1px solid #EEF2F6;
}
// .orderList{
//   padding: 28rpx 0;
//   view{
//     margin-bottom: 28rpx;
//     text{
//       display:inline-block;
//       color: #666C72;
//       font-size: 24rpx;
//     }
//     .btn_{
//       color:#FF3838;
//       float:right;
//       border:2rpx solid #9DA0A4;
//       border-radius:22rpx;
//       padding:8rpx 22rpx;
//       line-height: 1;
//     }
//     text:nth-child(1){
//       margin-right: 50rpx;
//     }
//   }
// }
// .border-quit,.border-pay{
//   padding:16rpx 40rpx;
//   line-height: 1;
//   border:1rpx solid rgba(157,160,164,1);
//   border-radius:28rpx;
//   text-align: center;
//   font-size: 24rpx;
//   display: inline-block;
//   color:#121314;
//   margin-right: 20rpx;
//   background-color:transparent;
//   &[disabled] {
//     background-color:rgba(255,255,255,1);
//     border:2rpx solid rgba(157, 160, 164, 1);
//     opacity:0.3;
//     color:#9DA0A4;
//   }
// }
// .border-pay{
//   background:#FFD100;
//   border-color:#FFD100;
//   font-weight: 500;
// }
.save{
  background:#FF9EA8;
  font-size: 28rpx;
  width: 100%;
  border-radius:44rpx;
  height:88rpx;
  line-height: 88rpx;
  text-align: center;
}
.notclick{
  pointer-events:none;
}
.label-width{
  width: 180rpx;
}
/deep/ .van-count-down{
  font-size: 28rpx;
  color: #ffffff;
}
.bottomClick{
  width: 100%;
  // height:100rpx;
  box-shadow:0 0 20rpx 0 rgba(196,196,196,0.6);
  padding:16rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;;
  bottom:0;
  left:0;
  background-color: #fff;
}
</style>
<style lang="scss">
.c-custom-class	{
  position: relative;
  height: 100rpx !important;
  margin: 0 auto;
}
.c-custom-class::before{
  content: '';
  position: absolute;
  width: 92%;
  margin: 0 auto;
  bottom: 0%;
  height: 1px;
  background: #EEF2F6;
}
.last_{
  button:nth-last-child(1){
    margin-right: 0;
  }
}
</style>
