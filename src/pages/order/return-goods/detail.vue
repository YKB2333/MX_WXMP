<template>
  <view class="min-h-full pages pb100">
    <view class="head hidden row space-between center-y">
      <view>
        <view class="row space-between center-y">
          <view class="fw600 fs-lg-add">{{order.title}}</view>
        </view>
        <view  class="fs-sm">{{order.message}}</view>
      </view>
      <view v-if="order.showWrite" @click="exchange(returnData)" style="border-radius:36rpx;background:rgba(242,244,250,1);" class="fs-sm ptb22 plr44 bg-white">{{order.rightBtnStr}}</view>
    </view>
    <view class="bg-white plr30">
      <!-- 商品信息 -->
      <view class="mb20 bg-white ">
        <view :key="index" v-for="(item,index) in returnData.orderDetails" :class="index==0?'':'hairline-top'">
          <goods
            :img="item.skuPrimaryPic"
            :name="item.skuName"
            :attr-value="item.ownSpec"
            :price="item.userLevelPrice"
            :quantity="item.quantity"> 
          </goods>
        </view>
      </view>
      <!-- 商品总额 -->
    </view>
    <view class="orderList mb20 bg-white plr30">
        <view>
          <text>订单编号 :</text>
          <text @tap="copyToClipboard(returnData.outTradeNo)">
            {{returnData.outTradeNo}}
          </text>
          <text class="btn_" @tap="copyToClipboard(returnData.outTradeNo)">
            复制
          </text>
        </view>
        <view>
          <text>申请时间 :</text>
          <text>{{returnData.createTime | formatTime('Y/M/D h:m:s')}}</text>
        </view>
        <template>
          <view>
            <text>售后编号 :</text>
            <text>{{returnData.returnsNo}}</text>
          </view>
        </template>
        <template>
          <view class="mb0">
            <text>申请原因 :</text>
            <text>{{returnData.reasonName}}</text>
          </view>
        </template>
      </view>
      <!-- 底部按钮 -->
      <view v-if="order.showBottom" class="bottomClick">
        <text class="border-quit" v-if="order.showBottom" @tap="grayBtnMethod">取消申请</text>
      </view>
  </view>
</template>

<script>
import Goods from '../components/Goods'
import { returnOrderDetail,closeReturns } from '@/api/order/return'
import { copyToClipboard } from '@/utils'
import { formatMoney } from '@/common/filters'
import { kd100AppId } from "@/config";

export default {
  name: "detail",
  components: {Goods },
  data() {
    return {
      returnsId: '',
      returnData: {},
      order: {},
      // showLogistics: false
    };
  },
  onShow() {
    console.info('取消事件订阅RETURN_LIST_REFLUSH')
    this.$eventHub.$off(this.$eventName.RETURN_DETAIL_REFLUSH)
  },
  onLoad(options) {
    this.returnsId = options.returnsId
    this.init()
  },
  methods: {
    exchange(returnData){
      console.log(returnData)
      let that = this
      if(!returnData.expressNo){
        uni.navigateTo({
          url: `/pages/order/return-goods/logistics?source=returnDetail&returnsId=${that.returnData.id}`,
          success() {
            that.$eventHub.$on(that.$eventName.RETURN_DETAIL_REFLUSH, (reflush) => {
              if(reflush){
                console.info('触发回调', reflush)
                that.init()
              }
            })
          }
        });
      }else{
        this.goKD100(returnData.expressNo)
      }
    },
    copyToClipboard,
    init(){
      returnOrderDetail(this.returnsId).then(res => {
        this.returnData = res.data
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
        this.tranOrder(this.returnData);
        console.log('订单信息，状态值为',this.returnData.status,this.returnData);
      })
    },
    tranOrder(returnData) {
      this.JudgementPage(returnData.status)
    },
    JudgementPage(status){
      let returnsType = this.returnData.returnsType;
      switch (status) {
        case 2:
          // 商品已寄回
          
          // if(returnsType == 1){
            if(this.returnData.expressNo){
              this.order =  {
                title:'商品已寄回',
                message:'仓库收到商品后将为您退款',
                rightBtnStr:'查看寄回物流',
                showWrite:true,  //展示右边按钮（查看寄回物流 填写退货信息）
                showBottom:false //展示取消订单
              }
            }else{
              this.order =  {
                title:'申请已通过',
                message:'申请已通过，请填写退货信息',
                rightBtnStr :'填写退货信息',
                showWrite:true, //展示右边按钮（查看寄回物流 填写退货信息）
                showBottom:true //展示取消订单
              }
            }
          // }
        break;
        case 3:
          // 申请中
          // if(returnsType == 1 || returnsType == 5){
            this.order =  {
              title:'退款审核中',
              message:'系统审核通过后将为您退款',
              showWrite:false, //展示右边按钮（查看寄回物流 填写退货信息）
              showBottom:true //展示取消订单
            }
          // }
        break;
        case 4:
          //已完成(退款成功 已换货 已补发)
          this.order =  {
            title:'',
            message:'任何意见和吐槽，都欢迎联系我们',
            showWrite:false, //展示右边按钮（查看寄回物流 填写退货信息）
            showBottom:false //展示取消订单
          }
          if( returnsType == 1 || returnsType == 4 || returnsType == 5){
            this.order.title = '退款成功'
            this.order.message = `退款金额 ¥${ formatMoney(this.returnData.returnGoodsAmt,true)} 已原路退回`
          }else if(returnsType == 2){
            this.order.title = '已换货'
          }else if (returnsType == 3) {
          // 已补发
            this.order.title = '已补发'
          }
        break;
        case 1:
          //售后申请中
          this.order =  {
            title:'售后申请中',
            message:'系统审核通过后将为您退款',
            showWrite:false, //展示右边按钮（查看寄回物流 填写退货信息）
            showBottom:true //展示取消订单
          }
        break;
        case -1:
          // 已关闭
          this.order =  {
            title:'已关闭',
            message:'任何意见和吐槽，都欢迎联系我们',
            showWrite:false, //展示右边按钮（查看寄回物流 填写退货信息）
            showBottom:false //展示取消订单
          }
        break;
        case -2:
          // 已删除
          this.order =  {
            title:'已删除',
            message:'任何意见和吐槽，都欢迎联系我们',
            showWrite:false, //展示右边按钮（查看寄回物流 填写退货信息）
            showBottom:false //展示取消订单
          }
        break;
        default: break;
      }
    },
    grayBtnMethod() {
      uni.showModal({
        content: '是否确定取消订单？',
        success: (res) => {
          if (res.confirm) {
            closeReturns(this.returnsId).then(res => {
              this.$eventHub.$emit(this.$eventName.RETURN_LIST_REFLUSH, true)
              uni.navigateBack()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
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
  }
};
</script>

<style lang="scss" scoped>
.pages{
   background-color: #F2F4FA;
}
.head{
  padding:38rpx;
  background-color: #F2F4FA;
  // background-color: #FFD100;
  color:$uni-color-primary;
  line-height: 1;
  >view{
    position: relative;
    >view:nth-child(1){
      margin-bottom: 18rpx;
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
.orderList{
  padding: 28rpx 0;
  view{
    margin-bottom: 28rpx;
    text{
      display:inline-block;
      color: #666C72;
      font-size: 24rpx;
    }
    .btn_{
      // color:#FF3838;
      color:#121314;
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
  padding:16rpx 40rpx;
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
  background:#FFD100;
  border-color:#FFD100;
  font-weight: 500;
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
