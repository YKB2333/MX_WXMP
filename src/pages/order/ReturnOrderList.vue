<template>
  <view class="page">
    <view class="text-center" v-if="goodsList.length == 0" style="padding-top:200rpx;">
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258 mb40" />
      <view class="color-gray-simple">您暂时还没有售后订单哦~</view>
    </view>
    <return-order-item 
      v-for="(item,index) in goodsList" :key="index"
      :order-entity="item"
      @exchange="onReturnMessage(item)"
      @cancle="closeReturns(item)"
    >
      <view slot="goods" class="hairline-bottom">
        <goods @tap="onRefundDetail(item.id)"
          v-for="(detail,index2) in item.orderDetails" :key="index2"
          :img="detail.skuPrimaryPic"
          :name="detail.skuName"
          :attr-value="detail.ownSpec"
          :price="detail.userLevelPrice"
          :quantity="detail.quantity"
        />
      </view>
    </return-order-item>
    <view v-if="(loadMore.finished || loadMore.loading) && goodsList.length !== 0" class="color-gray fs-mini text-center ptb20">
      <text v-if="loadMore.finished">我是有底线的</text>
      <text v-if="loadMore.loading">更多数据加载中...</text>
      <!--
      <text v-if="loadMore.error" @click="fetchUserAssetsRecords">加载失败，点击重试</text>
      -->
    </view>
  </view>
</template>

<script>
import GoodsInfo from "_c/GoodsInfo";
import { NULL_BOX_IMG } from '@/imageConfig'
import { orderReturnsPage,closeReturns } from '@/api/order/return'
import ReturnOrderItem from './components/ReturnOrderItem'
import Goods from './components/Goods'

export default {
  name: "ReturnOrderList",
  components: { GoodsInfo, ReturnOrderItem, Goods },
  data() {
    return {
      IMAGE: {
        NULL_BOX_IMG
      },
      tabName: '',
      pageTpye: [],
      refundPageTpye: [],
      queryParam: {
        pageNum: 1, 
        pageSize: 10,
      },
      loadMore: {
        finished: true,
        loading: false,
      },
      goodsList:[]
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: "退款/售后",
    });
    this.loadData(true)
  },
  onShow() {
    console.info('取消事件订阅RETURN_LIST_REFLUSH')
    this.$eventHub.$off(this.$eventName.RETURN_LIST_REFLUSH)
  },
  computed: {},
  created() {},
  methods: {
    onCancel() {
      console.log('cancel')
    },
    onRefundDetail(id) {
      console.log(id);
      let that = this
      uni.navigateTo({
        url: `/pages/order/return-goods/detail?source=returnList&returnsId=${id}`,
        success(){
          that.$eventHub.$on(that.$eventName.RETURN_LIST_REFLUSH, (type) => {
            uni.showLoading({mask: true})
            that.goodsList = []
            that.loadData(true)
          })
        }
      });
    },
    // onRefund(id){
    //   let that = this
    //   uni.showModal({
    //     // title: '确认退换货？',
    //     content: '是否退换货？',
    //     success: (res) => {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         uni.navigateTo({
    //           url: `/pages/order/return-goods/index?source=returnList&returnType=${this.type}&type=1&orderId=${id}`,
    //           success() {
    //             that.$eventHub.$on(that.$eventName.RETURN_LIST_REFLUSH, (type) => {
    //               console.info('返回页面类型', type)
    //               that.type = type; // 
    //               that.loadData(true)
    //             })
    //           }
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // },
    closeReturns(item){
      let id = item.id
      console.log(item)
      let that = this
      uni.showModal({
        content: '是否取消申请？',
        success: (res) => {
          if (res.confirm) {
            closeReturns(id).then(res=>{
              uni.showLoading({mask: true})
              that.goodsList = []
              that.loadData(true)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    indentL(){
      uni.navigateTo({
        url: '/pages/order/ReturnGoods'
      });
    },
    linkPage(id){
      // console.log(page);
      uni.navigateTo({
        url: `/pages/order/OrderDetail?id=${id}`
      });
    },
    async loadData(init) {
        init ? this.queryParam.pageNum = 1 : this.queryParam.pageNum += 1
        init ? this.loadMore.finished = false : ''
        await this._loadOrderInfoList(init, this.queryParam)
    },
    _loadOrderInfoList(init, data, index) {
      this.loadMore.loading = true
      // uni.showLoading({mask: true})
      return orderReturnsPage(data).then(res => {
        res = res.data
        if (!res.list || res.list.length == 0) this.loadMore.finished = true
        res.list.forEach(detail => {
          detail.orderDetails.forEach(item => {
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
        init ? this.goodsList = res.list : res.list.forEach(item => {
          this.goodsList.push(item)
        })
        uni.hideLoading()
      }).catch(() => {
        this.loadMore.error = true
      }).finally(()=>{
        this.loadMore.loading = false
        console.log('回弹',this.loadMore.finished);
        uni.hideLoading()
      })
    },
    // onChange(event) {
    //   this.type = event.detail.name
    //   this.loadData(true)
    // },
    onPullDownRefresh(){
      if (!this.loadMore.loading) {
        this.loadData(true)
        setTimeout(() => {
          console.log('下拉刷新') 
          uni.stopPullDownRefresh()
        }, 2500);
      }
    },
    onReachBottom() {
      if (!this.loadMore.finished && !this.loadMore.loading) {
        console.log('滚动加载')
        this.loadData(false)
      }
    },
    // 填写退换信息-按钮事件
    onReturnMessage(order){
      let that = this
        uni.navigateTo({
          url: `/pages/order/return-goods/logistics?source=returnList&returnsId=${order.id}`,
          success() {
            that.$eventHub.$on(that.$eventName.RETURN_LIST_REFLUSH, (reflush) => {
              if(reflush){
                console.info('触发回调', reflush)
                uni.showLoading({mask: true})
                that.goodsList = []
                that.loadData(true)
              }
            })
          }
        });
      // let id = order.returnsId
      // let that = this
      // uni.navigateTo({
      //   url: `/pages/order/return-goods/index?type=0&returnType=${this.type}&orderId=${id}&logisticsCompanyName=${order.logisticsCompanyName||''}&expressNo=${order.expressNo||''}`,
      //   success() {
      //     that.$eventHub.$on(that.$eventName.RETURN_LIST_REFLUSH, (type) => {
      //       console.info('返回页面类型', type)
      //       that.type = type; // 
      //       that.loadData(true)
      //     })
      //   }
      // });
    },
  }
};
</script>

<style lang="scss" scoped>
.page {
  // height: 100vh;
  min-height: 100vh;
  // background: #f2f4fa;
  background: white;
  overflow: auto;
}
/deep/ .van-tabs__line {
  background-color: $uni-color-theme !important;
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
.null-box {
  padding: 80rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #66686c;
  image {
    width: 386rpx;
    height: 258rpx;
    margin-bottom: 40rpx;
  }
}
</style>
<style lang="scss">
</style>
