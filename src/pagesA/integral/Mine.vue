<template>

  <view >
    <!-- #ifdef H5 -->
    <view class="plr30 pt28 bg-white title_fixed">
      <view
        class="col center-x mb16 bg-white l-h70 h70"
        style="position: relative; top: 0; z-index: 1;"
      >
        <view class="absolute" @tap="goBack" >
          <image :src="IMAGE.ARROW_LEFT" class="w-h48" />
        </view>
        <view class="fw600">我的喵豆</view>
      </view>
    </view>
      <!-- #endif -->
    <view class="col flex">
      <view class="row rule mt24" @tap="jump2rule">
        <text class="fs-sm text-right color-gray">喵豆规则</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w24 h32 l-h48 ml8" />
      </view>
      <view class="col center-x mtb48">
          <!-- <view class="fw600" style="font-size:60rpx">
            <text v-if="query.userScoreLog.type === 1">{{ userInfo && userInfo.avilableScore | million}}</text>
            <text v-if="query.userScoreLog.type === 0">{{ userInfo && userInfo.unavilableScore | million }}</text>
            <text class="fs-sm fw500 pl20 relative" style="bottom:8rpx;" v-if="query.userScoreLog.type === 1 && deduction">（可抵扣{{ (userInfo.avilableScore / 100 ) | formatMoney(false) }}元）</text>
            <text class="fs-sm fw500 pl20 relative" style="bottom:8rpx;" v-if="query.userScoreLog.type === 0 && deduction">（可抵扣{{ (userInfo.unavilableScore /100) | formatMoney(false) }}元）</text>
          </view> -->
          <view class="right-color fw600" style="font-size:80rpx;">{{ userInfo && userInfo.avilableScore}}</view>
          <view class="color-gray mtb16">可抵现金：￥{{ (userInfo.avilableScore / 100 ) }}</view>
          <image :src="IMAGE.MINE_MIAODOU" class="w-full" mode="widthFix"/>
        </view>
      <view class="bg-primary h16"></view>
      <!-- <van-tabs
        :active="tabIndex"
        sticky
        :animated="false"
        @change="onTabChange"
      >
        <van-tab
          v-for="(tab, idx) in tabData"
          :key="idx"
          :title="tab.title"
          :name="tab.name"
        ></van-tab>
      </van-tabs>
      <view v-if="tabIndex === 0">
        <view class="l-h92 row center-y radius-round plr20 mtb32" style="background-color: #F2F2F2;margin-left:32rpx;margin-right:32rpx; border-radius: 8rpx;">
          <image :src="IMAGE.MALL_ICON_SEARCH" class="w-h40" />
          <input
            type="text"
            placeholder="商品名称"
            placeholder-class="fs-normal place-color"
            class="h60 fs-normal pl10 flex-1 place-color"
            confirm-type="search"
            v-model="queryHistory.spuName"
            @confirm="confirmSearch"
          />
        </view>
        <view v-for="(item, index) in historyList" :key="index" class="row space-between center-y wpct92 mauto h140" @tap="jump2ShareHistory(item)">
          <view class="relative" @tap.stop="onSpuClick(item.spuId)">
             <image class="w-h112 radius" :src="item.spuImage"/>
             <view class="w-h112 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
          </view>
          <view class="row bottom_border ml32 center-y w-full space-between">
              <view class="col h130 center-x flex-start">
                  <view class="fs-normal ellipsis w500 text-left">{{ item.spuName }}</view>
                  <view v-if="item.purchaseCount > 0" class="fs-sm color-gray mt8">{{item.purchaseCount}}人已购</view>
                  <view v-else class="fs-sm color-gray mt8">让商品飞一会儿~</view>
              </view>
              <view class="row center-y space-between" @tap="showPopover">
                    <view class="relative row center-y">
                      <block v-for="(key) in item.headImgList" :key="key">
                        <image :src="key" class="w-h48 absolute box1"/>
                      </block>
                    </view>
                    <image :src="IMAGE.ARROW_RIGHT" class="w24 h32 l-h48" v-if="item.purchaseCount > 0"/>
              </view>
          </view>
        </view>
      </view>
      <view v-if="tabIndex === 1">
      </view> -->
      <view v-for="(item, index) in list" :key="index" class="row space-between center-y wpct92 mauto h140 bottom_border">
        <view>
          <view>{{ item.remark }}<text v-if="item.outTradeNo">（订单号：{{ item.outTradeNo }}）</text></view>
          <view class="fs-sm color-gray mt6">{{ item.createdTime| formatTime('Y/M/D h:m:s') }}</view>
        </view>
        <view class="fw600 right-color text-center eclipse" style="color:" v-if="item.score > 0">+{{ item.score }}喵豆</view>
        <view class="fw600" v-else>{{ item.score }}</view>
      </view>
      <view class="color-gray fs-mini text-center ptb20">
        <text v-if="loadMore.finished">我是有底线的</text>
        <text v-if="loadMore.loading">更多数据加载中...</text>
        <text v-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
      </view>
    </view>
  </view>
</template>

<script>
import { INTEGRAL_BG_BANNER, ARROW_RIGHT, ARROW_LEFT,MINE_MIAODOU,GOODS_SPU_GOLD,MALL_ICON_SEARCH} from '@/imageConfig'
import { getUserIntegralLog } from '@/api/user'
import { getShareGoodHistory } from "@/api/goods";
import { mapGetters } from 'vuex'

export default {
  name: 'Integral',
  components: {  },
  data() {
    return {
      IMAGE: {
        INTEGRAL_BG_BANNER,
        ARROW_LEFT,
        ARROW_RIGHT,
        MINE_MIAODOU,
        GOODS_SPU_GOLD,
        MALL_ICON_SEARCH
      },
      // tabIndex:0,
      // tabData:[
      //   {
      //     name:0,
      //     title:'好友购买记录',
      //   },
      //   {
      //     name:1,
      //     title:'喵豆明细'
      //   }
      // ],
      query: {
        pageNo: 0,
        pageSize: 20,
        // userScoreLog: {
        //   type: 1, // type0是代收喵豆,1是可用喵豆
        // }
        userId:""
      },
      queryHistory: {
        pageNo:0,
        pageSize:20,
        spuName:""
      },
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      list: [], // 喵豆明细列表
      historyList:[], // 分享商品列表
      deduction: null, // 喵豆抵扣比例
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad(options) {
    // this.query.userScoreLog.type = Number(options.type)
    console.log("我被初始化了=====")
    this.init()
    this.fetchDeduction()
  },
  methods: {
    init() {
      this.loadMore.finished = false
      this.loadMore.loading = false
      this.loadMore.error = false
      this.query['pageNo'] = 0
      this.query['userId'] = this.userInfo.id
      this.init = []
      // this.fetchHistory()
      this.loadList()
    },
    loadList() {
      if (this.loadMore.finished || this.loadMore.loading || this.loadMore.error) { // 如果已结束或在加载中或发生错误，不触发
        return
      }
      this.query['pageNo'] += 1
      this.loadMore.loading = true
      getUserIntegralLog(this.query).then(res => {
        let data = res.data
        if(data&&data.list&&data.list.length>0){
          this.list = this.list.concat(data.list)
        }else{
          this.loadMore.finished = true
        }
        console.log('喵豆列表', this.list)
        this.loadMore.error = false
      }).catch(() => {
        this.loadMore.error = true
        this.query['pageNo'] -= 1
      }).finally(() => {
        this.loadMore.loading = false
      })
    },
    // fetchHistory(){
    //     if(this.loadMore.finished || this.loadMore.loading || this.loadMore.error) return
    //     this.queryHistory['pageNo'] += 1;
    //     this.loadMore.loading = true
    //     getShareGoodHistory(this.queryHistory).then( res => {
    //         console.log('返回数据=== ',res.data);
    //         let data = res.data;
    //         if(!data.hasNextPage) {
    //             this.loadMore.finished = true
    //         } 
    //         this.historyList = this.historyList.concat(data.list)
    //         console.log('长度：',this.historyList.length)
    //         this.loadMore.error = false
    //     }).catch(error => {
    //         console.log('出错了--- ',error)
    //         this.loadMore.error = true
    //         this.query['pageNo'] -=1
    //     }).finally( ()=> {
    //         this.loadMore.loading = false
    //     });
    // },
    onErrorClick() {
      this.loadMore.error = false
      this.loadList()
    },
    // 获取喵豆抵扣比例
    fetchDeduction() {
      this.$store.dispatch('getIntegralDeduction').then(result => {
        console.log('喵豆抵扣', result)
        this.deduction = result
      })
    },
    jump2rule(){
      console.log(666)
      uni.navigateTo({
        url:"/pagesA/integral/Rule"
      })
    },
    // onTabChange(e){
    //   let { name, title } = e.detail;
    //   console.log('当前点击条目：',name,title)
    //   this.tabIndex = name;
    //   this.loadMore.finished = false
    //   this.loadMore.loading = false
    //   this.loadMore.error = false
    //   if(name === 0){
    //     this.queryHistory['pageNo'] = 0;
    //     this.historyList = [];
    //     this.fetchHistory();
    //   }else {
    //     this.query['pageNo'] = 0;
    //     this.list = [];
    //     this.loadList();
    //   }
    // },
  //   confirmSearch(e) {
  //     let { value } = e.detail;
  //     console.log("键盘搜索", value);
  //     this.loadMore.finished = false
  //     this.loadMore.loading = false
  //     this.loadMore.error = false
  //     this.queryHistory['pageNo'] = 0;
  //     this.historyList = [];
  //     this.fetchHistory();
  //   },
  //   jump2ShareHistory(item){
  //     if(item.purchaseCount > 0){
  //       uni.navigateTo({
  //          url: `/pagesA/integral/History?spuId=${item.spuId}`
  //       });
  //     }
  //  },
    goBack(){
      // #ifdef H5
      this.$flutter({ method: 'BACK'});
      // #endif
    },
    // onSpuClick(id){
    //     // let id = '162153359740194816';
    //     // #ifdef MP-WEIXIN
    //     uni.navigateTo({
    //         url: `/pages/spu/index?spuId=${id}`
    //     });
    //     // #endif
    //     // #ifdef H5
    //     this.$flutter({ method: 'TO_GOODS_DETAIL', data: { spuId: id } })
    //     // #endif
    // },
  },
  onReachBottom() {
    // console.log('滚动加载')
    if(this.tabIndex == 0) {
      this.fetchHistory()
    }else {
      this.loadList()
    }
    
  }
}
</script>

<style lang="scss" scoped>
// .integral{
//   position: absolute;
//   left: 12%;
//   top: 50%;
//   transform: translate(0,-50%);
// }
.bottom_border {
  border-bottom: 1px solid #eef2f6;
}
.right-color {
  color: #FF9EA8;
  white-space: nowrap; 
}
.rule {
  position: absolute;
  right: 0rpx;
  border-radius: 24rpx 0rpx 0rpx 24rpx;
  background-color: #F2F2F5;
  padding: 8rpx 16rpx 8rpx 24rpx;
}
/deep/ .van-tabs__line {
  background-color: #FF9EA8 !important;
  width: 112rpx !important;
  left: 40rpx;
}
.box1:nth-of-type(3) {
    position: relative;
    z-index: 1;
    right: 60rpx;
    border-radius: 30rpx;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
    border: 1px solid #FFFFFF;
}.box1:nth-of-type(2) {
    position: relative;
    z-index: 2;
    right: 30rpx;
    border-radius: 30rpx;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
    border: 1px solid #FFFFFF;
}.box1:nth-of-type(1) {
    position: relative;
    z-index: 3;
    right: 1rpx;
    border-radius: 30rpx;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
    border: 1px solid #FFFFFF;
}
.place-color {
  color: #909399;
}
</style>

