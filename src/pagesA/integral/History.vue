<template>
    <view class="min-h-full" @click="dismissPopOver">
        <view v-if="!isEmpty">
            <view class="row m32" @tap="onSpuClick(topGoods.id)">
                <view class="relative goods-img-border">
                    <view class="relative">
                        <image class="w-h160 radius" :src="topGoods.skuOssImage" />
                        <view class="w-h160 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
                    </view>
                    <view v-if="topGoods.status == 0" class="absolute row w-h-full" style="top:0;">
                        <view class="disabledCart-tag">已下架</view>
                    </view>
                </view>
                <view class="col pl32 space-between flex-1 hidden">
                    <view class="ellipsis"> {{topGoods.spuName}} </view>
                    <view class="fs-22 color-gray mb16">{{topGoods.title}}</view>
                    <view class="fs-22 color-gray text-right" v-if="topGoods.status != 0">查看商品 > </view>
                </view>
            </view>
            <view class="h20 bg-primary"></view>        
            <view class="l-h88 pl32 fw600">购买记录</view>
        </view>
        <view class="l-h92 row center-y radius-round plr20" style="background-color: #F2F2F2;margin-left:32rpx;margin-right:32rpx; border-radius: 8rpx;">
            <image :src="IMAGE.MALL_ICON_SEARCH" class="w-h40" />
            <input
              type="text"
              placeholder="用户名称"
              placeholder-class="fs-normal place-color"
              class="h60 fs-normal pl10 flex-1 place-color"
              confirm-type="search"
              v-model="query.nickName"
              @confirm="confirmSearch"
            />
        </view>

        <view class="row  plr32 h130 center-y relative" v-for="(item,index) in historyList" :key="index">
            <div><image :src="item.headImgUrl" class="w-h88 radius-circle"/></div>
            <view class="row bottom_border ml32 center-y w-full space-between">
                <view class="col h130 center-x flex-start">
                    <view class="l-h50"> {{ item.nickName }} </view>
                    <view class="fs-sm color-gray mt4">{{item.orderCreateTime | formatTime('Y/M/D h:m:s')}} 购买了该商品</view>
                    <view class="h1 bg-gray w-full"></view>
                </view>
                <view class="row center-y" @tap.stop="showPopover(index,item)">

                        <image v-if="item.status =='-1'" :src="IMAGE.ICON_HISTORY_DEL" class="w-h24"  />
                        <image v-if="item.status =='0'" :src="IMAGE.ICON_HISTORY_TIME" class="w-h24"  />
                        <image v-if="item.status =='1'" :src="IMAGE.ICON_HISTORY_ADD" class="w-h24"  />
                         <view v-if="item.status == '-1'" class="fs-sm color-gray-simple ml4">取消发放</view>
                        <view v-if="item.status == '0'" class="fs-sm color-gray-simple ml4">待发放</view>
                        <view v-if="item.status == '1'" class="fw600 ml4" style="color:#FF9EA8">{{ item.shareObtainIntegral }}<span>喵豆</span></view>
                       
                </view>
            </view>
            <view class="absolute popover " v-if="index == currentIndex">
                <view v-if="item.status == '0'" class="color-white fs-sm">待发放：用户订单未确认收货喵豆最迟将在订单发货后第{{deleverDay}}天自动发放。</view>
                <view v-if="item.status == '-1'" class="color-white fs-sm">取消发放：用户已取消订单</view>
            </view>
        </view>

        <view class="color-gray fs-mini text-center ptb20">
            <text v-if="historyList && finished">我是有底线的</text>
            <text v-if="historyList && loading">更多数据加载中...</text>
            <text v-if="historyList && error" @click="onErrorClick">加载失败，点击重试</text>
        </view> 


        
    </view>
</template>

<script>
import { 
    MALL_ICON_SEARCH,
    ICON_HISTORY_ADD,
    ICON_HISTORY_DEL,
    ICON_HISTORY_TIME,
 } from "@/imageConfig"

import { getBuyShareRecord } from "@/api/order";
import { getAllStatusSpu } from '@/api/goods';
import { getSysdictQuery } from "@/api/tools";

export default {
    name:'History',
    data(){
        return {
            IMAGE:{
                MALL_ICON_SEARCH,
                ICON_HISTORY_ADD,
                ICON_HISTORY_DEL,
                ICON_HISTORY_TIME,
            },
            query: {
                pageSize:20,
                pageNo:0,
                spuId:'',
                // shareUserId:'198345281828917248',
                nickName:'',
            },
            currentIndex:-1,
            finished: false,
            error: false,
            loading: false,
            historyList: [],
            pageNo:1,
            topGoods:{
                spuName:'',
                title:'',
                salesPrice:'',
                skuOssImage:'',
            },
            deleverDay:15,
            isEmpty:false
        }
    },
    onLoad(options){
      console.log('传过来的spuId ',options.spuId)  
      this.query.spuId = options.spuId
    },
    onShow(){
        this.finished = false
        this.error = false
        this.loading = false
        this.getSpuEs();
        this.fetchHistory();
        this.getConfig();
    },
    methods:{
        fetchHistory(){
            if(this.finished || this.loading || this.error) return
            this.query['pageNo'] +=1
            this.loading = true
            getBuyShareRecord(this.query).then( res => {
                console.log('返回数据=== ',res.data);
                let data = res.data;
                if(!data.hasNextPage) {
                    this.finished = true
                } 
                this.historyList = this.historyList.concat(data.list)
                console.log('长度：',this.historyList.length)
                this.error = false
            }).catch(error => {
                this.error = true
                this.query['pageNo'] -=1
            }).finally( ()=> {
                this.loading = false
            });
        },

        getSpuEs(){
            uni.showLoading({
                title: '加载中'
            });
            // getAllStatusSpu('162153359740194816').then(res=>{
            getAllStatusSpu(this.query.spuId).then(res=>{
                if(res.data){
                    this.topGoods = res.data
                    this.isEmpty = false;
                    console.log('tpppGoods  ',this.topGoods)
                }else {
                    this.isEmpty = true;
                }
            }).finally(() => {
                 uni.hideLoading();
            });
        },
        onErrorClick() {
            this.error = false
            this.loadComments()
        },
        confirmSearch(e) {
          let { value } = e.detail;
          console.log("键盘搜索", value);
          this.finished = false
          this.loading = false
          this.error = false
          this.query['pageNo'] = 0;
          this.historyList = [];
          this.fetchHistory();
        },

        showPopover(index,item){
            if(item.status == '1'){
                this.currentIndex = -1;
            }else {
                this.currentIndex = index;
            }
        },
        dismissPopOver(){
            this.currentIndex = -1;
        },

        onSpuClick(id){
            // let id = '162153359740194816';
            if(this.topGoods.status == 0){
                uni.showToast({
                    title: '商品已下架',
                    duration: 2000,
                    icon:'none'
                });
                return;
            }
            // #ifdef MP-WEIXIN
            uni.navigateTo({
                url: `/pages/spu/index?spuId=${id}`
            });
            // #endif
            // #ifdef H5
            this.$flutter({ method: 'TO_GOODS_DETAIL', data: { spuId: id } })
            // #endif
        },

        getConfig() {
            getSysdictQuery({dictKey: "ORDER_CONFIG", dictType: "SYSTEM_CONFIG"}).then(res => {
                let json = JSON.parse(res.data.dictValue);
                this.deleverDay = json.autoOrderDelivered;    
            })
        }
    }

}
</script>

<style lang="scss" scoped>

.bottom_border {
  border-bottom: 1px solid #eef2f6;
}

.popover {
    z-index: 2;
    background-color: rgba(2, 2, 2, 0.78);
    border-radius: 12rpx;
    max-width: 400rpx;
    // right: 8rpx;
    right: 24rpx;
    top: 108rpx;
    padding:20rpx;
}

.popover:before {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    right: 60rpx;
    top: -26rpx;
    border-left: 16rpx solid transparent;
    border-right: 16rpx solid transparent;
    border-top: 16rpx solid transparent;
    border-bottom: 16rpx solid rgba(2, 2, 2, 0.78);
}

.assistant-box{
    z-index: 1;
    right: 32rpx;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.12);
    .assistant-box-content{
      top: 0;
      right: 114%;
      white-space: nowrap;
      background: #000000;
      opacity: 0.72;
      border-radius: 12rpx;
      .assistant-box-content-qipao{
        bottom:-12rpx;
        right: 24rpx;
      }
    }
}
.place-color {
    color: #909399;
}
.goods-img-border {
  border-radius: 12rpx;
  // border: 1rpx solid rgba(223, 223, 223, 1);
  overflow: hidden;
}
.disabledCart-tag {
  position: absolute;
  color: white;
  bottom: 0;
  width: 100%;
  height: 48rpx;
  line-height: 48rpx;
  background: rgba(0, 0, 0, 0.4);
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  bottom: 0;
  font-size: 22rpx;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>