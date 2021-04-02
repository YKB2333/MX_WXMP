<template>
  <view class="min-h-full pages pb100">
    <view class="head hidden">
      <view>
        <view class="row space-between center-y">
          <view v-if="order.title" class="fw600 fs-lg-add">{{order.title}}</view>
          <!-- <view v-if="orderData.status == 1" class="fs-normal" style="display: inherit;">
            <van-count-down
              v-if="orderData.orderExprieTimestamp"
              :time="orderData.orderExprieTimestamp"
              format="mm分ss秒"
              @finish="flushList"
            ></van-count-down>
            <view v-else>--分--秒</view>
            <text>后自动取消</text>
          </view> -->
        </view>
        <view v-if="order.message" class="mb28 fs-sm">{{order.message}}</view>
        <view class="w-h96 arrow" @tap="grayBtnMethod" >
          <van-icon  class="pos-center" v-if="order.grayBtn == '查看物流'" name="arrow" />
        </view>
      </view>
    </view>
    <view class="plr30 bg-white area-info" >    <!-- 地址信息，主盒子130px -->
      <view class="row center-y">    <!-- 挪上去160px的盒子 -->
        <image :src="IMAGE.AREA_POSITION" class="w64 h64" />
        <view class="flex-1 pl16 l-h44">
          <view class="ellipsis pb10">
            <text v-if="orderData.consignee">{{orderData.consignee}}</text>
            <text v-if="orderData.mobile" class="color-gray pl10 fs-sm-add">{{orderData.mobile}}</text>
          </view>
          <view class="ellipsis2 l-h34">{{orderData.orderType == 4 ? '虚拟物品，线上发货' : orderData.province + orderData.city + orderData.district + orderData.address}}</view>
        </view>
      </view>
    </view>
    <view class="bg-white plr30">
      <!-- 商品信息 -->
      <view class="mb20 bg-white ">
        <view :key="index" v-for="(item,index) in orderData.orderDetails" :class="index==0?'':'hairline-top'">
          <goods
            :img="item.skuPrimaryPic"
            :spuId="item.spuId"
            :name="item.skuName"
            :attr-value="item.ownSpec"
            :price="item.userLevelPrice"
            :quantity="item.quantity"
            :pay-channel="orderData.payChannel"
            >
            <view v-if="orderData.status !== 1" slot="goodBtm" class="pb30 row space-between center-y">
              <view>
                <view v-if="returns(item.returnStatus) && item.status !== 4" @tap="onReturnStatue(item)" class="row center-y">
                  <text style="color:#FF3838">{{returns(item.returnStatus)}}</text>
                  <van-icon color="#FF3838" class="arrow" name="arrow" />
                </view>
                <view v-if="item.status == 4" class="row center-y">
                  <text style="color:#FF3838">*已超过售后期限</text>
                </view>
              </view>
              <view v-if="orderData.status!==1" class="row center-y last_">
                <button v-if="orderData.payChannel!=6 && order.returnTitle" @tap="onReturnStatue(item)" :disabled="returns(item.returnStatus) || item.status == 4" class="border-quit">{{order.returnTitle}}</button>
                <button v-if="orderData.payChannel!=6 && orderData.status !== 1" @tap="addCart(item)" class="border-quit">加入购物车</button>
              </view>
            </view>
          </goods>
        </view>
      </view>
      <!-- 商品总额 -->
    </view>
    <view class="mb20 bg-white plr30">
      <view class="orderList bg-white">
        <view class="row space-between">
          <text>应付总额 :</text>
          <text>¥{{orderData.userLevelGoodsAmtTotal | formatMoney}}</text>
        </view>
        <view v-if="orderData.isCross==0" class="row space-between" >
          <view class="fs-sm mb0" style="color: #666C72;">累计抵扣 :<text class="fs-22">（优惠券{{orderData.couponAmount | formatMoney}}元，喵豆抵扣{{orderData.deductionAmount | formatMoney}}元）</text></view>
          <text>¥{{orderData.couponAmount + orderData.deductionAmount | formatMoney}}</text>
        </view>
      </view>
      <view style="border-bottom:1px solid #EEF2F6;height:1px"></view>
      <!-- 实付款 -->
      <view class=" mauto row space-between h100 center-y mb20">
        <text class="fs-normal fw600">实付金额</text>
        <text style="color:#FF3838" class="fw600 fs-normal"><text class="fw400 fs-22 color-gray">（含运费¥{{orderData.logisticsFee | formatMoney}}）</text>¥{{orderData.orderAmtTotal | formatMoney}}</text>
      </view>
    </view>
    <view class="orderList mb20 bg-white plr30">
        <view>
          <text>订单编号 :</text>
          <text @tap="copyToClipboard(orderData.outTradeNo)">
            {{orderData.outTradeNo}}
          </text>
          <text class="btn_" @tap="copyToClipboard(orderData.outTradeNo)">
            复制
          </text>
        </view>
        <view>
          <text>下单时间 :</text>
          <text>{{orderData.createTime | formatTime('Y/M/D h:m:s')}}</text>
        </view>
        <template v-if="order.showPayChannel">
          <view>
            <text>支付方式 :</text>
            <text>{{getPayChannelName(orderData.payChannel)}}</text>
          </view>
          <view>
            <text>支付时间 :</text>
            <text>{{orderData.payTime | formatTime('Y/M/D h:m:s')}}</text>
          </view>
        </template>
      </view>
      <!-- 底部按钮 -->
      <view v-if="order.showGrayBtn || order.showYellowBtn" class="bottomClick">
        <!-- <view class="row flex-end h100 center-y">
          <text class="border-quit" v-if="order.showGrayBtn" @tap="grayBtnMethod">{{ order.grayBtn  }}</text>
          <text class="border-pay " v-if="order.showYellowBtn" @tap="yellowBtnMethod">{{ order.yellowBtn  }}</text>
        </view> -->
        <text class="border-quit plr40" v-if="order.showGrayBtn" @tap="grayBtnMethod">{{ order.grayBtn  }}</text>
        <text class="border-quit plr40" v-if="order.title === '已完成'" @tap="goKD">查看物流</text>
        <text class="border-pay mr0 plr40" v-if="order.showYellowBtn" @tap="yellowBtnMethod">{{ order.yellowBtn  }}</text>
      </view>
  </view>
</template>

<script>
import Goods from './components/Goods'
import vanIcon from "@/wxcomponents/vant/icon/index";
import { AREA_POSITION } from '@/imageConfig'
import { getOrderDetails, deleteOrder, cancelOrder, confirmOrder, reWechatPay } from '@/api/order'
import { copyToClipboard } from '@/utils'
import { addCart } from '@/api/order/cart'
import { kd100AppId } from "@/config";
import { mapGetters } from "vuex"

export default {
  name: "OrderDetail",
  components: {vanIcon,Goods },
  data() {
    return {
      IMAGE: {
        AREA_POSITION
      },
      orderId: '',
      orderData: {},
      order: {},
      // showLogistics: false
    };
  },
  computed: {
    // 用户
    ...mapGetters(['userInfo', 'token', "authUserData"]),
    returns(){ //退款状态
      return function(value) {
        if(value==4){
          return '已退款，查看详情'
        }else if(value==1||value==2||value==3){
          return '售后中，查看详情'
        }else{
          return ''
        }
      }
    }
  },
  created() {
    // this.JudgementPage('GoodsWait');
  },
  onShow() {
    console.info('取消事件订阅RETURN_LIST_REFLUSH')
    this.$eventHub.$off(this.$eventName.ORDER_DETAIL_REFLUSH)
  },
  onLoad(options) {
    // this.JudgementPage(option.type);
    this.orderId = options.id
    this.init()
  },
  methods: {
    addCart(params){
      //添加购物车
      let quantity = 1
      addCart(quantity, params.skuId).then(res => {
        uni.showToast({ title: '加入购物车成功', icon: 'none', duration: 1000 })
      })
    },
    copyToClipboard,
    init(){
      getOrderDetails(this.orderId).then(res => {
        this.orderData = res.data
        if (this.orderData.status == 1 && this.orderData.orderExprieTime) {
          let end = new Date(this.orderData.orderExprieTime.replace(/-/g,"/")).getTime() // 将'-'替换成'/'再转为时间戳（'-'部分机型会返回 undefined 或者 Invalid date）
          let cur = new Date().getTime()
          this.orderData.orderExprieTimestamp = cur > end ? 0 : (end - cur)
        }
        this.orderData.orderDetails.forEach(item => {
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
        this.tranOrder(this.orderData);
        console.log('订单信息，状态值为',this.orderData.status,this.orderData);
      })
    },
    tranOrder(orderData) {
      this.JudgementPage(orderData.status)
      this.order.showPayChannel = this.orderData.payChannel>0?true:false
      if(this.orderData.status == -1){
        if(this.orderData.payStatus != 3){
          this.order.showPayChannel = false
        }
      }else if(this.orderData.status == 1){
        this.order.showPayChannel = false
      }
    },
    JudgementPage(status){
      console.log("status======================",status)
      switch (status) {
         case 2:
          // 待发货
          this.order =  {
            title:'待发货',
            returnTitle:'申请退款',
            message:'我们正在为您准备商品，请耐心等待哦',
            showYellowBtn:false,
            showGrayBtn:false
          }
        break;
        case 3:
          // 已发货
          this.order =  {
            title:'已发货',
            returnTitle:'申请退货',
            yellowBtn:'确认收货',
            grayBtn:'查看物流',
            message:'包裹已在路上，请耐心等待',
            showYellowBtn:false,
            showGrayBtn:true
          }
          if(this.orderData.thirdDeliverStatus == 1){
             this.order.title = '部分发货'
             this.order.showYellowBtn = false
             if(this.orderData.orderPackInfo){
               this.order.message = `该订单已拆成多个包裹发出，其中${this.orderData.orderPackInfo.confirmPackNum}个已签收`
             }
          }
          // if((this.orderData.orderPackInfo && this.orderData.orderPackInfo.isAllSend && this.orderData.orderPackInfo.isOnePack) && (this.orderData.returnStatus == -1 || this.orderData.returnStatus == -2 || this.orderData.returnStatus == 4)){ //单个包裹且退款状态正常显示确认收货
          if((this.orderData.orderPackInfo && this.orderData.orderPackInfo.isAllSend && this.orderData.orderPackInfo.isOnePack) && (this.orderData.returnStatus == -2)){ //单个包裹且退款状态正常显示确认收货
            this.order.showYellowBtn = true
          }else if(this.orderData.orderPackInfo &&!this.orderData.orderPackInfo.isOnePack && this.orderData.orderPackInfo.isAllSend){ //已发货但是分为多个包裹发出
            this.order.message = `该订单已拆成多个包裹发出，其中${this.orderData.orderPackInfo.confirmPackNum}个已签收`
          }
        break;
        case 4:
          //已完成
          this.order =  {
            title:'已完成',
            grayBtn:'删除订单',
            returnTitle:'申请退货',
            message:'任何意见和吐槽，都欢迎联系我们',
            showYellowBtn:false,
            showGrayBtn:true
          }
        break;
        case 1:
          //待支付
          this.order =  {
            title:'待支付',
            yellowBtn:'立即支付',
            grayBtn:'取消订单',
            message:'订单已提交，请尽快完成支付',
            showYellowBtn:true,
            showGrayBtn:true
          }
        break;
        case -1:
          // 已取消
          this.order =  {
            title:'已取消',
            grayBtn:'删除订单',
            message:'任何意见和吐槽，都欢迎联系我们',
            showYellowBtn:false,
            showGrayBtn:true
          }
        break;
        case -2:
          // 已删除
          this.order =  {
            title:'已删除',
            message:'任何意见和吐槽，都欢迎联系我们',
            showYellowBtn:false,
            showGrayBtn:false
          }
        break;
        default: break;
      }
    },
    onClickImg(url){
      console.log(134);
      wx.previewImage({
        current: url,
        urls: url
      });
    },
    getPayChannelName(payChannel){
      let channelName = ''
      switch(payChannel){
        case 0:
          channelName = '余额'
          break;
        case 1:
          channelName = '微信'
          break;
        case 2:
          channelName = '支付宝'
          break;
        case 3:
          channelName = '奖励'
          break;
        case 4:
          channelName = '喵豆'
          break;
        case 5:
          channelName = '苹果'
          break;
        case 6:
          channelName = '宝盒'
          break;
      }
      return channelName + '支付'
    },
    onReturnStatue(item) {
      let status = this.orderData.status
      let returnStatus = item.returnStatus
      let that = this 
      if(returnStatus == -1 || returnStatus == -2 || returnStatus == null){
        let contentDialog = ''
        if(status == 2){ //退款
          contentDialog = '退款只能申请一次，是否退款？'
        }else if(status == 3){
          contentDialog = '退换货只能申请一次，是否退换货？'
        }
        uni.showModal({
          content: contentDialog,
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
              let param = encodeURIComponent(JSON.stringify(item))
              uni.navigateTo({
                url: `/pages/order/return-goods/index?source=orderDetail&list=${param}`,
                success() {
                  that.$eventHub.$on(that.$eventName.ORDER_DETAIL_REFLUSH, (reflush) => {
                    console.info('触发回调', reflush)
                    if(reflush){
                      setTimeout(()=>{
                        console.log("1s")
                        that.init()
                      },1000)
                    }
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        //go to returnList
        if(item.returnsId){
          uni.navigateTo({ 
            url: `/pages/order/return-goods/detail?source=returnList&returnsId=${item.returnsId}`
            // url: `/pages/order/ReturnOrderList?type=refundProcessing`
          })
        }else{
          uni.navigateTo({ 
            url: `/pages/order/ReturnOrderList?type=refundProcessing`
          })
        }
      }
    },
    grayBtnMethod() {
      //按钮事件
      let that = this
      if(this.orderData.status == -1 || this.orderData.status == 4){ //删除订单
        uni.showModal({
          content: '删除后无法恢复，确定删除吗？',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
              deleteOrder(this.orderData.id).then(res => {
                console.info(res)
                this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
                uni.navigateBack()
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else if(this.orderData.status == 1){ //取消订单
        uni.showModal({
          content: '是否确定取消订单？',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
              cancelOrder(this.orderData.id).then(res => {
                console.info(res)
                this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
                uni.navigateBack()
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else if(this.orderData.status == 3){ //查看物流
        // this.onReturnStatue()
        if(this.orderData.orderPackInfo && this.orderData.orderPackInfo.isOnePack && this.orderData.orderPackInfo.isAllSend && this.orderData.orderPackInfo.sendPackBillNos.length>0){
          this.goKD100(this.orderData.orderPackInfo.sendPackBillNos[0])
        }else{
          uni.navigateTo({
            url: `/pages/order/bagDetail?source=orderDetail&id=${this.orderId}`,
            success() {
              that.$eventHub.$on(that.$eventName.ORDER_DETAIL_REFLUSH, (reflush) => {
                console.info('触发回调', reflush)
                if(reflush){
                  that.init()
                }
              })
            }
          });
        }
      }
    },
    goKD() {
        if(this.orderData.orderPackInfo && this.orderData.orderPackInfo.isOnePack && this.orderData.orderPackInfo.isAllSend && this.orderData.orderPackInfo.sendPackBillNos.length>0){
          this.goKD100(this.orderData.orderPackInfo.sendPackBillNos[0])
        }else{
          uni.navigateTo({
            url: `/pages/order/bagDetail?source=orderDetail&id=${this.orderId}`,
            success() {
              that.$eventHub.$on(that.$eventName.ORDER_DETAIL_REFLUSH, (reflush) => {
                console.info('触发回调', reflush)
                if(reflush){
                  that.init()
                }
              })
            }
          });
        }
    },
    yellowBtnMethod(){
      if(this.orderData.status == 1){
        reWechatPay({orderId:this.orderData.id,weChatMiniOpenId: this.authUserData.openId,outTradeNo:this.orderData.outTradeNo}).then(res => {
          res = res.data
          wx.requestPayment({
            timeStamp: res.paymentObj.timeStamp,
            nonceStr: res.paymentObj.nonceStr,
            package: res.paymentObj.packageValue,
            signType: res.paymentObj.signType,
            paySign: res.paymentObj.paySign,
            success:function(WXres){
              console.info('支付成功', WXres)
              uni.reLaunch({
                url: `/pages/pay/index?id=` + res.orderId
              })
            },
            fail:function(WXres){
              console.info('支付失败', WXres)
            },
            complete:function(WXres){
              console.info('支付完成', WXres)
            }
          })
        })
      }else if(this.orderData.status == 3){
        let returnStatus = this.orderData.returnStatus
        if(returnStatus == -1 || returnStatus == -2 || returnStatus == 4){
          //确认订单
          uni.showModal({
            // title: '确认收货？',
            content: '您已经收到商品？',
            cancelText: '未收货',
            confirmText: '已收货',
            success: (res) => {
              if (res.confirm) {
                console.log('用户点击确定')
                if(this.orderData.orderPackInfo.sendPackBillNos.length>0){
                  confirmOrder(this.orderData.id,this.orderData.orderPackInfo.sendPackBillNos[0]).then(res => {
                    this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
                    uni.navigateBack()
                  })
                }else{
                  uni.showToast({ title: '操作失败，物流单号为空', icon: 'none' })
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          uni.navigateTo({
            url: `/pages/order/ReturnOrderList?type=refundProcessing`
          })
        }
      }
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
      right: -42rpx;
      top: -10rpx;
    }
  }
}
.area-info{
  height: 130rpx;
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
.orderList{
  padding: 28rpx 0 0 0;
  view{
    margin-bottom: 28rpx;
    text{
      display:inline-block;
      color: #666C72;
      font-size: 24rpx;
    }
    .btn_{
      color:#FF3838;
      float:right;
      border:2rpx solid #9DA0A4;
      border-radius:22rpx;
      padding:8rpx 22rpx;
      line-height: 1;
    }
    text:nth-child(1){
      margin-right: 50rpx;
    }
  }
}
.border-quit,.border-pay{
  padding:16rpx 20rpx;
  line-height: 1;
  border:1rpx solid rgba(157,160,164,1);
  border-radius:28rpx;
  text-align: center;
  font-size: 24rpx;
  display: inline-block;
  color:#121314;
  margin-right: 20rpx;
  background-color:transparent;
  &[disabled] {
    background-color:rgba(255,255,255,1);
    border:2rpx solid rgba(157, 160, 164, 1);
    opacity:0.3;
    color:#9DA0A4;
  }
}
.border-pay{
  background:#ff9ea8;
  border-color:#ff9ea8;
  font-weight: 500;
  color: #fff;
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
  height:100rpx;
  box-shadow:0 0 20rpx 0 rgba(196,196,196,0.6);
  padding:18rpx 30rpx;
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
