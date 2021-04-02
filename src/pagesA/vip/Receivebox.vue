<template>
  <view class="pt32 bg-primary min-h-full">
    <view class="bg-white radius-sm center-x mlr32 plr32" v-if="!hasReceive">
      <view class="pt48 pb16">
        <image :src="IMAGE.VIP_IMG_DONE" style="width: 160rpx; height: 160rpx"/>
      </view>
      <view class="color-gray fs-small-add">恭喜你获得{{month}}月宝盒，请确认收货地址，包邮送到家</view>
      <view class="row space-between mt80 mb14">
        <view>送至</view>
        <view class="fs-mini" style="color:#FF9EA8" @tap="choseAddr">更改地址 > </view>
      </view>

       
      <view class="col bg-primary radius-sm flex-start p24 text-left" v-if="address && address.id">
        <view class="fs-sm-add color-gray pb24">收件人：{{address.consignee}}</view>
        <view class="fs-sm-add color-gray pb24">手机号：{{address.mobile | formatMobile }}</view>
        <view class="fs-sm-add color-gray eclipse">地址：{{ `${address.provinceName}${address.cityName}${ address.districtName}${address.address}` }}</view>
      </view>
      <view v-else class="p24">
        请去设置收货地址
      </view>
      <view class="h80 w256 mt80 mb16 bg-pink color-white l-h80 mauto radius-mini" @tap="confirm">确定</view>
       <view class="pb80">
          <van-count-down
          v-if="isTimeShow"
          :time="timeData"
          format="DD : HH : mm : ss 后失效"
          @finish="onTimeFinish" 
          />
       </view>
    </view>
    <view  v-else>
      <view class="bg-white radius-sm center-x mlr32 hidden">
        <view class="pt48 pb16">
          <image :src="IMAGE.VIP_IMG_SUC" style="width: 88rpx; height: 88rpx"/>
        </view>
        <view class="fw600 ">{{month}}月宝盒领取成功</view>
        <view class="fs-sm-add color-gray mt16">在我的订单可查看发货详情</view>
        <view class="row space-around l-h80 plr12 mt80 mb48">
          <view class="wpct46 bg-primary color-gray radius-mini" @tap="toHome">返回首页</view>
          <view class="wpct46 bg-pink color-white radius-mini" @tap="toOrderList">查看订单</view>
        </view>
      </view>
          <!-- 猜你喜欢 -->
      <view class="bg-primary">
        <guess-goods ref="guess-like" :guessGoods="guessGoods" isWhiteBg/>
      </view>
      </view>
  </view>
</template>

<script>
import { VIP_IMG_SUC,VIP_IMG_DONE } from "@/imageConfig";
import GuessGoods from "@/pages/guess-goods/index";
import { guessLike } from "@/api/goods/spu";
import { receiveAward } from "@/api/user";
import { getAddressList } from '@/api/user/address'

export default {
    name: "receivebox",
    components:{
      GuessGoods
    },
    data(){
      return {
        IMAGE: {
          VIP_IMG_SUC,
          VIP_IMG_DONE
        },
        hasReceive:false,
        guessGoods: [], //猜你喜欢
        timeData: 0,
        isTimeShow:false,
        address:{},
        month:"",
      }
    },
    onLoad(options){
      if (options.timeData) {
        let nowDate = new Date().getTime();
        let endTime =  options.timeData;
        console.log("endTime", endTime);
        let endDate = new Date(endTime).getTime();
        let offsetTime = endDate - nowDate;
        if(offsetTime >0){
          this.isTimeShow = true;
          this.timeData = offsetTime;
        }
      }
      this.fetchAddressList();
      this.month = new Date().getMonth() + 1;
    },
    onShow() {
      guessLike({"pageIndex":1,"pageSize":6}).then((res) => {
        let data = res.data;
        if (data) {
          this.guessGoods = data;
          console.log("猜你喜欢", this.guessGoods);
        }
      });
      this.$eventHub.$off("changeUserAddress");
      this.$eventHub.$on("changeUserAddress", _data => {
          this.changeUserAddress(_data);
      });
    },
    methods:{
      fetchAddressList() {
        getAddressList().then(res => {
          if(res.data){
            const tempList = res.data.filter(addr => addr.addressFlag == 1)
            if(tempList.length > 0){
                this.address = tempList[0];
            }
          }
        })
      },
      confirm(){
        if(!this.address){
          return;
        }
        uni.showLoading({
          title: '领取中'
        });
        receiveAward(this.address.id).then( res => {
          if(res.resCode == "00000"){
            this.hasReceive = true;
          }
        }).finally(() =>{
          uni.hideLoading();
        });
      },

      toHome(){
        // #ifdef MP-WEIXIN
        uni.switchTab({
           url: '/pages/tabbar/Mine'
        });
        // #endif

        // #ifdef H5
        this.$flutter({ method: "TO_HOME", data: { index: 3 } });
        // #endif
      },
      
      toOrderList(){
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: "/pages/order/OrderList?type=all",
        });
        // #endif
        // #ifdef H5
        this.$flutter({ method: "MY_ORDER_LIST", data: { type: 'all' } });
        // #endif
      },
      choseAddr(){
      // uni.navigateTo({
      //   url: `/pages/address/AddressList?sourceType=order&addressId=${this.orderData.defaultUserAddress.id}`
      // });
      uni.navigateTo({
         url: '/pages/address/AddressList?sourceType=order'
      });
      },
     changeUserAddress(value) {
       this.address = value;
      },
      //定时器结束
      onTimeFinish() {
        console.log("定时器结束");
        this.isTimeShow = false;
      },
    }
}
</script>

<style lang="scss" scoped>

/deep/ .van-count-down {
  color: #909399 !important;
  font-size: 24rpx;
}
</style>