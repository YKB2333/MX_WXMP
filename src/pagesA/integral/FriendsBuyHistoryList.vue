<template>
    <view class="bg-primary min-h-full">
      <!-- #ifdef H5 -->
      <view class="plr30 pt28 bg-white title_fixed">
        <view
          class="col center-x bg-white l-h70 h70"
          style="position: relative; top: 0; z-index: 1;"
        >
          <view class="absolute" @tap="goBack" >
            <image :src="IMAGE.ARROW_LEFT" class="w-h48" />
          </view>
          <view class="fw600">我的推荐</view>
        </view>
      </view>
      <!-- #endif -->

     <van-tabs
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

        <view v-if="tabIndex === 0" class="row wrap space-between pt20 plr32">
            <block v-for="(item, index) in buyUsers" :key="index">
                <view @tap="onClick(item)">
                <buy-card
                    :user-head="item.headImgUrl"
                    :user-name="item.nickName"
                    :place-times="item.orderTime"
                    :place-total="item.orderNum"
                    :place-consume="Math.floor(item.amount)"
                />
                </view>
            </block>
        </view>
        <view v-if="tabIndex === 1" class="row wrap space-between pt20 plr32">
          <view v-for="(item,index) in recommendGoods" :key="index">
            <view class="w332 h560 bg-white radius-12 col mb20" @tap="onSpuClick(item)">
              <view class="w-h332 relative radius-12">
                <image class="w-h-full radius-12" :src="item.spuImage" />
                <view class="absolute h132 col" style="left:0;right:0;bottom:0;background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);">
                  <view v-if="item.headImgList" class="row center-y l-h48 mt20" >
                    <block v-for="(key) in item.headImgList || [] " :key="key">
                      <image :src="key" class="w-h48 box1"/>
                    </block>
                  </view>
                  <view v-if="item.headImgList.length > 0" class="color-white fs-22 pl24 pt8 mt">{{ item.viewCount }} 人浏览 | {{ item.purchaseCount }} 人购买</view>
                  <view v-else class="color-white mt60 center-x fs-22">还没好友浏览或购买</view>
                </view>
              </view>

              <view class="bg-white p24 radius-12">
                <view class="fs-22 ellipsis" style="color:#909399;">{{ item.title }}</view>
                <view class="fs-sm-add ellipsis mt18 mb40 fw600" style="color:#303133;">{{ item.spuName }}</view>
                <view class="row" style="align-items:baseline;">
                  <view style="color:#FF5A6B;">￥</view>
                  <view class="fs-lg-big mr10" style="color:#FF5A6B;">{{ item.salesPrice / 100 }}</view>
                  <view style="color:#909399;text-decoration:line-through;">￥{{ item.platformPrice / 100}}</view>
                </view>
              </view>
            </view>
          </view>

        </view>
    </view>
</template>

<script>
import BuyCard from '_c/BuyCard'
import SpuCard from '_c/SpuCard'
import { getShareBuyUser } from '@/api/order'
import { getMyRecommendGoods } from '@/api/goods'
import {
  ARROW_LEFT,
} from '@/imageConfig';

export default {
    name:'FriendsBuyHistoryList',
    components: { BuyCard,SpuCard },
    data() {
       return {
           IMAGE: {
             ARROW_LEFT,
           },
           tabIndex:0,
           tabData:[
             {
               name:0,
               title:'购买好友',
             },
             {
               name:1,
               title:'推荐商品'
             }
            ],
          recommendGoods:[],
          buyUsers:[],
       } 
    },
    onLoad() {
    },
    onShow() {
      this.init();
    },
    methods: {
      goBack() {
        // #ifdef MP-WEIXIN
        uni.navigateBack();
        // #endif
        // #ifdef H5
        this.$flutter({method:'BACK'})
        // #endif 
      },
        onClick(item) {
          let param = encodeURIComponent(JSON.stringify(item))
            uni.navigateTo({
                 url: `/pagesA/integral/FriendsBuyHistory?spuId=${item.spuId}&params=${param}`
            });
       },
      onTabChange(e){
        let { name, title } = e.detail;
        console.log('当前点击条目：',name,title)
        this.tabIndex = name;
       },
      init() {
        uni.showLoading({
          title: '加载中',
          mask: true
        });
        // 分享购买用户列表
        getShareBuyUser().then(res => {
          console.log('当前分享购买用户列表 ',res.data)
          this.buyUsers = res.data;
          this.tabData[0].title='购买好友 '+this.buyUsers.length;
        }).finally( () => {
          uni.hideLoading();
        });

        // 推荐商品
        getMyRecommendGoods().then( res => {
          console.log('我的推荐商品',res.data);
          this.recommendGoods = res.data;
          this.tabData[1].title = '推荐商品 ' + this.recommendGoods.length;
        });
      },
      onSpuClick(item) {
        let param = encodeURIComponent(JSON.stringify(item))
        uni.navigateTo({
          url: `/pagesA/integral/FriendsBuyGoodsDetail?spuId=${item.spuId}&params=${param}`
        });
      }
    },
}
</script>

<style lang="scss" scoped>
.buy-name {
    color: #303133;
}
.buy-times {
    color: #909399;
    font-size: 11;
}
/deep/.van-tabs__line {
  background-color: #FF9EA8 !important;
  width: 112rpx !important;
  left: 40rpx;
}
.box1:nth-of-type(3) {
      position: relative;
      z-index: 3;
      left: -20rpx;
      border-radius: 48rpx;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
      border: 1px solid #FFFFFF;
  }.box1:nth-of-type(2) {
      position: relative;
      z-index: 2;
      left: -2rpx;
      border-radius: 48rpx;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
      border: 1px solid #FFFFFF;
  }.box1:nth-of-type(1) {
      position: relative;
      z-index: 1;
      left: 20rpx;
      border-radius: 48rpx;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
      border: 1px solid #FFFFFF;
  }
</style>