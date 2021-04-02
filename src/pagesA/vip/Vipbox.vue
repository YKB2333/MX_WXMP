<template>
  <view class="bg-primary p32 min-h-full row">
    <view class="bg-white radius-sm center-x pb40 relative" style="height:calc(100vh - 64rpx);">
      <view class="pt40 center mauto" style="width: 640rpx; height: 640rpx">
        <!-- 等待开盒 -->
        <image
          v-if="boxData.alreadyLotteryTimes == 0"
          :src="IMAGE.VIP_IMG_NOTO"
          style="width: 640rpx; height: 640rpx"
        />
        <!-- 开合成功 -->
        <image
          v-else-if="boxData.winning"
          :src="IMAGE.VIP_IMG_ISO"
          style="width: 640rpx; height: 640rpx"
        />
        <!-- 开盒失败 -->
        <image
          v-else-if="!boxData.winning"
          :src="IMAGE.VIP_IMG_FAIL"
          style="width: 640rpx; height: 640rpx"
        />
      </view>

      <view class="fw600 fs-lg-add mt24 mb16">
        <text v-if="boxData.userType == 0">没有钥匙</text>
        <text v-else-if="boxData.alreadyLotteryTimes == 0"
          >{{ month }}月宝盒</text
        >
        <text v-else-if="boxData.winning">开盒成功</text>
        <text v-else-if="!boxData.winning">开盒失败</text>
      </view>
      <view
        v-if="boxData.alreadyLotteryTimes == 0"
        class="color-gray fs-sm-add mlr100 l-h40"
      >
        <text v-if="boxData.userType == 0"
          >您是铁卡会员，暂无资格参与，升级银卡会员领取钥匙开宝盒吧~</text
        >
        <text v-if="boxData.userType == 1"
          >您是银卡会员，每个自然月可以开1次宝盒哦！快试试你的运气~</text
        >
        <text v-if="boxData.userType == 2"
          >您是金卡会员，每个自然月可以开2次宝盒哦！快试试你的运气~</text
        >
      </view>
      <view
        v-else-if="!boxData.winning"
        class="color-gray fs-sm-add mlr100 l-h40"
      >
        <text v-if="!boxData.lottery"
          >只差一点点！宝盒数量每月刷新，早来开盒几率更大哦~</text
        >
        <text v-else
          >只差一点点！只要心中有念，幸运女神就会光顾你！再开一次吧~</text
        >
      </view>
      <view v-else class="color-gray fs-sm-add mlr100 l-h40">
        恭喜你找到我啦，点击领取，别让我跑掉啦~
      </view>

      <view
        class="row mt60 center h80 mauto radius-mini"
        :style="{
          width: '256rpx',
          'background-color':
            boxData.lottery || boxData.winning ? '#FF7272' : '#F2F2F5',
        }"
        @tap="openBox"
      >
        <view v-if="boxData.userType == 0 && !boxData.lottery">
          <image
            :src="IMAGE.VIP_ICN_KEY"
            style="width: 48rpx; height: 48rpx;"
          />
        </view>
        <!-- // 可以领取的状态 且不可以继续摇奖 -->
        <!-- <view v-else-if="boxData.winning">
        </view> -->
        <view v-else-if="boxData.lottery && !boxData.winning">
          <image
            :src="IMAGE.VIP_ICN_ACTIVE_KEY"
            style="width: 48rpx; height: 48rpx;"
          />
        </view>
        <view class="ml8 color-gray" v-if="boxData.userType == 0">开宝盒</view>
        <view
          class="ml8 color-white"
          v-else-if="boxData.alreadyLotteryTimes == 0"
          >开宝盒</view
        >
        <view class="ml8 color-white" v-else-if="boxData.winning">领取</view>
        <view class="ml8 color-white" v-else-if="boxData.lottery"
          >再开一次</view
        >
        <view class="ml8 color-gray" v-else-if="!boxData.lottery"
          >次数已用完</view
        >
      </view>

      <view class="color-gray mt16" v-if="boxData.winning">
        <view class="pb80">
          <van-count-down
            v-if="isTimeShow"
            :time="timeData"
            format="DD : HH : mm : ss 后失效"
            @finish="onTimeFinish"
          />
        </view>
      </view>

      <view
        class="row center radius-sm absolute"
        style="bottom:80rpx;right:0;left:0;"
        @tap="jump2rule"
      >
        <view class="color-gray fs-mini mr8">宝盒规则</view>
        <image :src="IMAGE.ARROW_RIGHT" style="width: 24rpx; height: 32rpx" />
      </view>
    </view>
  </view>
</template>

<script>
import {
  ARROW_RIGHT,VIP_IMG_NOTO,VIP_IMG_ISO,VIP_IMG_DONE,VIP_IMG_FAIL,VIP_IMG_SUC,VIP_ICN_KEY,VIP_ICN_ACTIVE_KEY,
  } from "@/imageConfig";

import { getVipBoxInfo,doBoxRank } from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "vipbox",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT,
        VIP_IMG_NOTO,
        VIP_IMG_ISO,
        VIP_IMG_DONE,
        VIP_IMG_FAIL,
        VIP_IMG_SUC,
        VIP_ICN_KEY,
        VIP_ICN_ACTIVE_KEY,
      },
      boxData:{},
      month:"",
      timeData:0,
      isTimeShow:false,
    };
  },
  onLoad(){
    this.month = new Date().getMonth() + 1;
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      getVipBoxInfo().then(res => {
        if(res.data){
          console.log(res.data)
          this.boxData = res.data
          if(res.data.expireTime){
            let nowDate = new Date().getTime();
            let endTime = this.boxData.expireTime;
            let endDate = new Date(endTime).getTime();
            let offsetTime = endDate - nowDate;
            console.log("endTime", endTime,nowDate,);
            if(offsetTime >0){
              this.isTimeShow = true;
              this.timeData = offsetTime;
            }
          }
        }
      });
      //  this.boxData = {
      //     userType : 1,
      //     surplusLotteryTimes:0,
      //     alreadyLotteryTimes:1,
      //     totalLotteryTimes:1,
      //     winning:true,
      //     lottery:false,
      //  }
    },
    openBox() {
      console.log('我执行了==========11=====');
      // 铁卡 不可继续摇奖
      if(this.boxData.userType == 0 || (!this.boxData.lottery && !this.boxData.winning)){
        return;
      }
      console.log('我执行了===============');
      // 领取状态且不超过时间，少时间
      if(this.boxData.winning){
        uni.navigateTo({
           url: `/pagesA/vip/Receivebox?timeData=${this.timeData}`
        });
        return;
      }

      uni.showLoading({
        mask:true,
        title: "加载中",
      });
      doBoxRank(this.userInfo.id).then(res => {
        console.log("当前摇奖====== ",res.data);
        if(res.data){
          this.boxData = res.data
          if(res.data.expireTime){
            let nowDate = new Date().getTime();
            let endTime = this.boxData.expireTime;
            let endDate = new Date(endTime).getTime();
            let offsetTime = endDate - nowDate;
            console.log("endTime", endTime,nowDate,);
            if(offsetTime >0){
              this.isTimeShow = true;
              this.timeData = offsetTime;
            }
          }
        }
      }).finally(() =>{
        uni.hideLoading();
      });
    },
    jump2rule(){
      uni.navigateTo({
        url:"/pagesA/vip/Rule"
      })
    },
    //定时器结束
    onTimeFinish() {
      console.log("定时器结束");
      this.isTimeShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-color {
  background-color: #ff7272;
}
/deep/ .van-count-down {
  color: #909399 !important;
  font-size: 24rpx;
}
</style>
