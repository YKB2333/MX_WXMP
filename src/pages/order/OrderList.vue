<template>
  <view class="min-h-full bg-white relative">
    <van-tabs swipeable sticky color="#9DA0A4" :active="type" line-width="30" :ellipsis="false" @change="onChange" class="stickyOrder">
      <van-tab v-for="(T_item,T_index) in title" :key="T_index" :name="T_item.type" :title="T_item.title" >
        <block v-if="orderList && orderList.length">
          <order-item
            v-for="(item,index) in orderList"
            :key="index"
            :order-entity="item"
            @cancel="onCancel(item.id)"
            @delete="onDelete(item.id)"
            @pay="onPay(item)"
            @confirm="onConfirm(item)"
            @bag-detail="bagDetail(item)"
          >
            <view slot="goods"> 
              <view class="hairline-top" v-for="(detail,index2) in item.orderDetails" :key="index2">
                <goods
                  @tap="linkPage(item.id)"
                  :img="detail.skuPrimaryPic"
                  :name="detail.skuName"
                  :attr-value="detail.ownSpec"
                  :price="detail.userLevelPrice"
                  :quantity="detail.quantity"
                />
              </view>
            </view>
            <!-- 待支付状态下才显示 -->
            <view v-if="item.status == 1" slot="countdown" class="color-gray row center-y">
              <van-count-down
                v-if="item.orderExprieTimestamp"
                :time="item.orderExprieTimestamp"
                format="mm分ss秒"
                @finish="flushList"
              ></van-count-down>
              <view v-else>--分--秒</view>
              <text>后自动取消</text>
            </view>
          </order-item>
          <view v-if="loadMore.finished || loadMore.loading" class="color-gray fs-mini text-center ptb20">
            <text v-if="loadMore.finished">我是有底线的</text>
            <text v-if="loadMore.loading">更多数据加载中...</text>
            <!--
            <text v-if="loadMore.error" @click="fetchUserAssetsRecords">加载失败，点击重试</text>
            -->
          </view>
        </block>
        <view class="text-center" v-else style="padding-top:200rpx;">
          <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258 mb40" />
          <view class="color-gray-simple">您暂时还没有订单哦~</view>
        </view>
      </van-tab>
    </van-tabs>
    <!-- <view class="bottomTitle">
      共{{total}}个全部订单
    </view> -->
  </view>
</template>

<script>
import { NULL_BOX_IMG } from '@/imageConfig'
import { getOrderInfoList, deleteOrder, cancelOrder, confirmOrder, reWechatPay } from '@/api/order'
import OrderItem from './components/OrderItem'
import Goods from './components/Goods'
import { kd100AppId } from "@/config";
import { complareToNowTime } from '@/utils'
import { mapGetters } from "vuex";

export default {
  name: "OrderList",
  components: {OrderItem, Goods },
  data() {
    return {
      IMAGE: {
        NULL_BOX_IMG
      },
      type: '',
      total:'',
      title: [
        { type: 'all', title: '全部', code: null },
        { type: 'notPay', title: '待支付', code: 1 },
        { type: 'notDelivered', title: '待发货', code: 2 },
        { type: 'unreceived', title: '待收货', code: 3 },
        { type: 'finished', title: '已完成', code: 4 },
      ],
      orderList: [],
      tabName: '',
      queryParam: {
        pageNo: 1,
        pageSize: 10,
        status: ''
      },
      loadMore: {
        finished: true,
        loading: false,
      },
    };
  },
  onLoad(options) {
    // debugger
    this.type = options.type
    // uni.startPullDownRefresh()
    this.loadData(true)
  },
  onShow() {
    console.info('取消事件订阅ORDER_LIST_REFLUSH')
    this.$eventHub.$off(this.$eventName.ORDER_LIST_REFLUSH)
  },
  computed: {
    ...mapGetters(["authUserData"]),
  },
  created() {
    uni.setNavigationBarTitle({
      title: "我的订单"
    })
  },
  methods: {
    goKD100(no){
      console.info(`${kd100AppId}=>跳转到快递100，查询订单：${no}`)
      wx.navigateToMiniProgram({
        appId: kd100AppId,
        path: `/pages/result/result?nu=${no}`,
      })
    },
    bagDetail(item){
      console.log(item)
      let that = this
      if(item.orderPackInfo && item.orderPackInfo.isOnePack && item.orderPackInfo.isAllSend && item.orderPackInfo.sendPackBillNos.length>0){
        this.goKD100(item.orderPackInfo.sendPackBillNos[0])
      }else{
        uni.navigateTo({
          url: `/pages/order/bagDetail?source=orderList&id=${item.id}`,
          success() {
            that.$eventHub.$on(that.$eventName.ORDER_LIST_REFLUSH, (reflush) => {
              console.info('触发回调', reflush)
              if(reflush){
                that.loadData(true)
              }
            })
          }
        });
      }
    },
    onCancel(id) {
      uni.showModal({
        // title: '确认取消？',
        content: '是否确定取消订单?',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            cancelOrder(id).then(res => {
              this.loadData(true)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onDelete(id) {
      console.info(id)
      uni.showModal({
        // title: '确认删除？',
        content: '删除后无法恢复，确定删除吗？',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            uni.showLoading({title: '加载中', mask: true})
            deleteOrder(id).then(res => {
              this.loadData(true)
            }).finally(()=>{
              uni.hideLoading()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onPay(item) {
      reWechatPay({orderId:item.id,weChatMiniOpenId: this.authUserData.openId,outTradeNo:item.outTradeNo}).then(res => {
        res = res.data
        wx.requestPayment({
          timeStamp: res.paymentObj.timeStamp,
          nonceStr: res.paymentObj.nonceStr,
          package: res.paymentObj.packageValue,
          signType: res.paymentObj.signType,
          paySign: res.paymentObj.paySign,
          success: function (WXres) {
            console.info('支付成功', WXres)
            uni.reLaunch({
              url: `/pages/pay/index?id=` + res.orderId
            })
          },
          fail: function (WXres) {
            console.info('支付失败', WXres)
          },
          complete: function (WXres) {
            console.info('支付完成', WXres)
          }
        })
      })
    },
    onRefund(id){
      // let that = this
      // uni.showModal({
      //   // title: '确认退换货？',
      //   content: '是否退款？',
      //   success: (res) => {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //       uni.navigateTo({
      //         url: `/pages/order/return-goods/index?source=orderList&type=1&orderId=${id}`,
      //         success() {
      //           that.$eventHub.$on(that.$eventName.ORDER_LIST_REFLUSH, (reflush) => {
      //             console.info('触发回调', reflush)
      //             if(reflush){
      //               that.loadData(true)
      //             }
      //           })
      //         }
      //       })
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    },
    // onRefundList(){
    //   uni.navigateTo({
    //     url: `/pages/order/ReturnOrderList?type=refundProcessing`
    //   })
    // },
    onConfirm(item){
      uni.showModal({
        content: '您已经收到商品?',
        cancelText: '未收货',
        confirmText: '已收货',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            if(item.orderPackInfo.sendPackBillNos.length>0){
              confirmOrder(item.id,item.orderPackInfo.sendPackBillNos[0]).then(res => {
                uni.showToast({ title: '操作成功', icon: 'none' })
                this.loadData(true)
              })
            }else{
              uni.showToast({ title: '操作失败，物流单号为空', icon: 'none' })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    linkPage(id) {
      // console.log(page);
      let that = this
      uni.navigateTo({
        url: `/pages/order/OrderDetail?id=${id}`,
        success() {
          that.$eventHub.$on(that.$eventName.ORDER_LIST_REFLUSH, (reflush) => {
            console.info('触发回调', reflush)
            if(reflush){
              that.loadData(true)
            }
          })
        }
      });
    },
    flushList() {
      this.loadData(true)
    },
    async loadData(init) {
      for (let i = 0; i < this.title.length; i++) {
        // console.info(this.title[i].type, this.type)
        if (this.title[i].type == this.type) {
          this.queryParam.status = this.title[i].code
          await this._loadOrderInfoList(init, this.queryParam)
        }
      }
    },
    _loadOrderInfoList(init, data) {
      let param = Object.assign({}, data)
      this.loadMore.loading = true
      if (init) {
        param.pageNo = 1
        this.loadMore.finished = false
      }else{
        param.pageNo += 1
      }
      uni.showLoading({title: '加载中', mask: true})
      // uni.showLoading({mask: true})
      return getOrderInfoList(param).then(res => {
        data.pageNo = param.pageNo
        res = res.data
        this.total = res.total
        if (!res.list || res.list.length == 0) this.loadMore.finished = true
        res.list.forEach(detail => {
          if (detail.status == 1 && detail.orderExprieTime) {
            let end = detail.orderExprieTime // 将'-'替换成'/'再转为时间戳（'-'部分机型会返回 undefined 或者 Invalid date）
            let cur = new Date().getTime()
            detail.orderExprieTimestamp = cur > end ? 0 : (end - cur)
          }
          detail.orderDetails.forEach(item => {
            if (item.ownSpec) {
              let skuOwnSpec = JSON.parse(item.ownSpec)
              item.ownSpec = ''
              for (let key in skuOwnSpec) {
                item.ownSpec += skuOwnSpec[key] + ';'
              }
              item.ownSpec = item.ownSpec.substring(0, item.ownSpec.length - 1)
            } else {
              item.ownSpec = ''
            }
            // if (item.type == 2) { // 新用户活动的订单
            //   item.price = item.activityPrice
            // }
          })
        })
        if(init){
          this.orderList = res.list
        }else{
          res.list.forEach(item => {
            this.orderList.push(item)
          })
        }
        // init ?  this.$set(this.title[index], 'orderList', res.list) : res.list.forEach(item => {
        //   this.orderList.push(item)
        // })
      }).catch(() => {
        this.loadMore.error = true
      }).finally(() => {
        this.loadMore.loading = false
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    },
    onChange(event) {
      // console.info('变更tab')
      this.type = event.detail.name
      // uni.startPullDownRefresh()
      this.loadData(true)
    }
    
  },
  onPullDownRefresh() {
    console.info('下拉刷新')
    if (!this.loadMore.loading) {
      // console.log('滚动加载')
      this.loadData(true)
      // setTimeout(() => {
      //   uni.stopPullDownRefresh()
      // }, 1000);
    }
  },
  onReachBottom() {
    console.info('触底刷新')
    if (!this.loadMore.finished && !this.loadMore.loading) {
      // console.log('滚动加载')
      this.loadData(false)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-sticky-wrap{
  position: fixed;
  right: 0;
  left: 0;
  top:0
}
/deep/ .van-sticky{
  height: 44px;
  z-index: 1;
}
/deep/ .van-tabs__line {
  background-color: #FF9EA8 !important;
}
/deep/ .van-tabs__line {
  height: 2px;
}
/deep/ .tabs__nav {
  height: 100rpx;
  // padding-bottom: 20px;
}
/deep/ .van-tab--active {
  font-size: 40rpx;
  color: $uni-color-primary;
  font-weight: 500;
}
/deep/ .van-tabs__scroll {
  background-color: white;
}
/deep/ .van-hairline--top-bottom:after {
  // border-bottom:
  border-width: 0;
}
/deep/ .van-count-down{
  font-size: 28rpx;
  color: $uni-color-gray;
}
.pxsolide {
  border-bottom: 10px solid #f2f4fa;
}
.shoppingCartList {
  width: 70%;
  display: block;
  text {
    display: block;
  }
  text:nth-child(1) {
    font-size: 14px;
  }
  text:nth-child(2) {
    font-size: 12px;
    color: #9da0a4;
  }
  text:nth-child(3) {
    font-size: 14px;
    color: #ff3838;
  }
  .delete {
    display: flex;
    justify-content: space-between;
    text {
      font-size: 12px;
      color: #9da0a4;
    }
  }
}
.bottomTitle{
  height: 80rpx;
  width:100%;
  position: fixed;
  bottom:0;
  left:0;
  background-color: #F2F4FA;
  z-index: 9999999999;
  color:#9DA0A4;
  text-align: center;
  font-size:24rpx;
  line-height: 80rpx;
}
</style>
