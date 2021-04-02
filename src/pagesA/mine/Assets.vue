<template>
  <view class="min-h-full bg-primary page">
    <view class="p38 row center-y space-between bg-white">
      <view>
        <view class="color-gray">累计收入（元）</view>
        <view class="fw600 mtb10" style="font-size:68rpx;">{{ assetTotal | formatMoney }}</view>
        <view
          class="color-gray fs-sm ptb8 pl10 pr40 inline-block"
          style="background:rgba(157,160,164,0.2);border-radius:0 30px 30px 0;"
        >含可提现金额{{ usableAsset | formatMoney }}</view>
      </view>
      <navigator :url="`/pagesA/mine/Withdrawal?assetTotal=${usableAsset}`">
        <button class="bg-theme plr50 fs-lg radius-round mlr0">申请提现</button>
      </navigator>
    </view>
    <view class="ptb20">
      <!-- <image :src="IMAGE.ASSETS_TIP_TO_APP" class="w-full" mode="widthFix" /> -->
      <view>
        <van-tabs
          :active="query.isfenrun"
          sticky
          line-width="40"
          line-height="6"
          animated
          swipeable
          @change="onTabChange"
        >
          <van-tab v-for="(tab, idx) in cartData" :key="idx" :title="tab.title" :name="tab.name">
            <view class="row space-between plr40 pt40 pb20">
              <view class @tap="openShow">
                <text class="fs-34 mr18">{{currentDate}}</text>
                <van-icon custom-class="arrowDown" name="arrow-down" />
              </view>
              <view class="col text-right">
                <text
                  class="fs-sm color-gray"
                >本月收入 ¥{{dataList.length?(query.isfenrun==0 ? (dataList[0].monthFenrunSum / 100) : (dataList[0].monthAwardSum / 100)):0}}</text>
                <text class="fs-mini color-gray" v-if="query.isfenrun==1">每月20日计算上月20日~本月19日的月度培训奖励</text>
              </view>
            </view>
            <view
              class="row plr40 mtb38"
              v-for="(item,idx) in dataList"
              :key="idx"
              @tap="openDetailShow(item)"
            >
              <view class="radius-circle w88 h88 bg-gray mr18 hidden">
                <image :src="item.userHead" class="w-h-full" />
              </view>
              <view class="col space-around flex-1">
                <view class="fs-sm row">
                  {{item.userName}}
                  <view class="tag green" v-if="item.isFans==1 && query.isfenrun==1">{{"自购"}}</view>
                  <view class="tag blue" v-if="item.isFans==0 && query.isfenrun==1">{{"推广"}}</view>
                </view>
                <view class="color-gray fs-sm">{{item.createTime}}下单</view>
              </view>
              <view class="col pt14 w150 text-right">
                <view
                  class="fw600 fs-30"
                  :class="{'color-gray':item.status==-1}"
                  v-if="query.isfenrun==0"
                >+{{item.orderFenrunTotal | formatMoney}}</view>
                <view
                  class="fw600 fs-30"
                  v-if="query.isfenrun==1"
                >{{item.bonusStatus==null || item.bonusStatus==0?'计算中':('+'+( item.orderBonus / 100))}}</view>
                <view class="fs-sm" v-if="query.isfenrun==0">{{statusStr(item.status)}}</view>
              </view>
            </view>
          </van-tab>
        </van-tabs>
      </view>
    </view>
    <van-popup :show="show" position="bottom" @close="show=false">
      <van-datetime-picker
        :value="currentShowDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @cancel="show = false"
        @confirm="confirmPicker"
      />
    </van-popup>
    <van-popup :show="shareShow" @close="shareShow=false">
      <view class="radius-twenty hidden" style="width:640rpx;">
        <view class="row plr40 space-between ptb38 bg-theme">
          <view class="radius-circle w88 h88 bg-gray mr18 hidden">
            <image :src="orderDetail.curOrder.userHead" class="w-h-full" />
          </view>
          <view class="col pt14 flex-1">
            <view class="fs-30">{{orderDetail.curOrder.userName}}</view>
            <view class="fs-sm">{{orderDetail.curOrder.createTime}}下单</view>
          </view>
          <view class="col pt14 w150 text-right">
            <view class="fw600 fs-30">+{{orderDetail.curOrder.orderFenrunTotal | formatMoney}}</view>
            <view class="fs-sm">{{statusStr(orderDetail.curOrder.status)}}</view>
          </view>
        </view>
        <block v-if="orderDetail.list">
          <view
            v-for="item in orderDetail.list"
            :key="item.id"
            class="row plr40 space-between ptb38 bg-white"
          >
            <view class="w88 h88 bg-gray mr18 radius" style="border:1px solid rgba(229,229,229,1)">
              <image :src="item.skuPrimaryPic" class="w-h-full" />
            </view>
            <view class="col flex-1 space-around">
              <view class="fs-sm ellipsis2 l-h40">{{item.skuName}}</view>
            </view>
            <view class="col w150 text-right space-around">
              <view class="fw600 fs-30">¥{{item.price | formatMoney}}</view>
              <view class="color-gray fs-sm">数量:{{item.quantity }}</view>
            </view>
          </view>
        </block>
        <view
          class="row plr40 space-between ptb38 bg-white"
          style="border-top:1px dashed rgba(157,160,164,.42)"
        >
          <view class="col pt14 flex-1">
            <view class="color-gray fs-sm">订单号:{{spliceStr(orderDetail.curOrder.orderNo)}}</view>
          </view>
          <view class="col pt14 w250 text-right">
            <view class="fw600 fs-30">实付 ¥{{orderDetail.curOrder.orderRealTotal | formatMoney}}</view>
          </view>
        </view>
      </view>
    </van-popup>
    <van-popup :show="trainShow" @close="trainShow=false">
      <view class="radius-twenty hidden bg-white" style="width:640rpx;">
        <view class="col plr40 text-center ptb38 bg-theme">
          <view class="fs-34 fw600">{{orderDetail.curOrder.bonusStatus==null || orderDetail.curOrder.bonusStatus==0 ? '计算中' : '+' + (orderDetail.curOrder.orderBonus /100)}}</view>
          <view class="fs-sm">{{orderDetail.curOrder.bonusStatus==null || orderDetail.curOrder.bonusStatus==0 ? '最高获得分享收益的20' : '我的培训奖励'}}</view>
        </view>
        <block v-if="orderDetail.list">
          <view
            v-for="item in orderDetail.list"
            :key="item.id"
            class="row plr40 space-between ptb38"
          >
            <view class="w88 h88 bg-gray mr18 radius" style="border:1px solid rgba(229,229,229,1)">
              <image :src="item.skuPrimaryPic" class="w-h-full" />
            </view>
            <view class="col flex-1 space-around">
              <view class="fs-sm ellipsis2 l-h40">{{item.skuName}}</view>
            </view>
            <view class="col w150 text-right space-around">
              <view class="fw600 fs-30">¥{{item.price | formatMoney}}</view>
              <view class="color-gray fs-sm">数量:{{item.quantity }}</view>
            </view>
          </view>
          <view
            class="row plr40 space-between pt38"
            style="border-top:1px dashed rgba(157,160,164,.42)"
          >
            <view class="col pt14 flex-1">
              <view class="color-gray fs-sm">订单号:{{spliceStr(orderDetail.curOrder.orderNo)}}</view>
            </view>
            <view class="col pt14 w250 text-right">
              <view class="fw600 fs-30">实付 ¥{{orderDetail.curOrder.orderRealTotal | formatMoney}}</view>
            </view>
          </view>
        </block>
        <view class="row plr40 space-between ptb38">
          <view class="radius-circle w88 h88 bg-gray mr18 hidden">
            <image :src="orderDetail.curOrder.userHead" class="w-h-full" />
          </view>
          <view class="col pt14 flex-1">
            <view class="fs-sm row">
              {{orderDetail.curOrder.userName}}
              <view v-if="orderDetail.curOrder.isFans==1" class="tag green">{{"自购"}}</view>
              <view v-if="orderDetail.curOrder.isFans==0" class="tag blue">{{"推广"}}</view>
            </view>
            <view class="fs-sm">{{orderDetail.curOrder.createTime}}下单</view>
          </view>
          <view class="col pt14 w150 text-right">
            <view class="fw600 fs-30">+{{orderDetail.curOrder.orderFenrunTotal | formatMoney}}</view>
            <view class="color-gray fs-sm">分享收益</view>
          </view>
        </view>
      </view>
    </van-popup>
    <view class="color-gray fs-mini text-center ptb20">
      <text v-if="!resList.hasNextPage">我是有底线的</text>
      <text v-if="resList.hasNextPage">更多数据加载中...</text>
    </view>
  </view>
</template>

<script>
import { ASSETS_TIP_TO_APP } from "@/imageConfig";
import { getUserAssets } from "@/api/member";
import { shareEarningsQuery, getDetailsByOrderNoQuery } from "@/api/order";

export default {
  name: "AccountingDetail",
  data() {
    return {
      IMAGE: {
        ASSETS_TIP_TO_APP,
      },
      // 用户资产，单位分
      assetTotal: 0, // 总资产
      usableAsset: 0, // 可用
      cartData: [
        {
          name: 0,
          title: "分享收益",
          list: [],
          isNull: false,
          checkResult: [],
          outList: [],
        },
        {
          name: 1,
          title: "培训奖励",
          list: [],
          isNull: false,
          checkResult: [],
          outList: [],
        },
      ],
      minHour: 10,
      maxHour: 20,
      minDate: new Date(new Date().getFullYear() - 5, 0, 1).getTime(),
      maxDate: new Date(new Date().getFullYear() + 5, 10, 1).getTime(),
      currentShowDate: new Date().getTime(),
      currentDate: null,
      show: false,
      shareShow: false, //分享奖励弹窗
      trainShow: false, //培训奖励弹窗
      resList: {
        hasNextPage: true,
      },
      dataList: [],
      query: {
        pageNo: 0,
        pageSize: 20,
        isfenrun: 0, //奖励金类型
        createTime: "2020-07",
      },
      orderDetail: {
        curOrder: [],
        list: [],
      },
    };
  },
  computed: {
    statusStr() {
      return (status) => {
        if (status == -1) {
          return "已撤销";
        } else if (status == 2) {
          return "待收中";
        } else if (status == 3) {
          return "待收中";
        } else if (status == 4) {
          return "已到账";
        }
      };
    },
    spliceStr() {
      return (str) => {
        if (str) {
          console.log(str);
          return (
            str.substr(0, 6) + "****" + str.substr(-4, str.split("").length)
          );
        }
      };
    },
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      // 获取用户资产
      getUserAssets().then((res) => {
        console.log("获取用户资产",res)
        this.assetTotal = res.data.assetTotal || 0;
        this.usableAsset = res.data.usableAsset || 0;
      });
      this.confirmPicker({ detail: new Date().getTime() });
    },
    onTabChange(e) {
      let { name, title } = e.detail;
      // console.log(name, title);
      this.query.pageNo = 0;
      this.query.pageSize = 20;
      this.query.isfenrun = name;
      this.resList.hasNextPage = true;
      this.dataList = [];
      this.fetchShareEarnings();
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    confirmPicker(val) {
      console.log(val);
      this.currentShowDate = val.detail;
      let year = new Date(val.detail).getFullYear();
      let month = new Date(val.detail).getMonth() + 1;
      let day = new Date(val.detail).getDate();
      let hour = new Date(val.detail).getHours();
      let minute = new Date(val.detail).getMinutes();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      if (hour >= 0 && hour <= 9) {
        hour = `0${hour}`;
      }
      if (minute >= 0 && minute <= 9) {
        minute = `0${minute}`;
      }
      this.className = "timeClass";
      this.currentDate = `${year}.${month}`;
      this.query.createTime = `${year}-${month}`;
      // this.query.createTime = `2020-04`;
      this.show = false;
      this.dataList = [];
      this.query.pageNo = 0;
      this.query.pageSize = 20;
      this.resList.hasNextPage = true;
      this.fetchShareEarnings();
    },
    openShow() {
      this.show = true;
    },
    openDetailShow(detail) {
      if (this.query.isfenrun == 0) {
        this.shareShow = true;
      } else {
        this.trainShow = true;
      }
      this.orderDetail.curOrder = detail;
      this.fetchDetail(detail.orderNo);

      console.log(detail);
    },
    fetchShareEarnings() {
      if (this.resList.hasNextPage) {
        uni.showLoading({ mask: true });
        this.query.pageNo += 1;
        shareEarningsQuery(this.query)
          .then((res) => {
            console.log("查询奖励金",res)
            this.resList = res.data;
            this.dataList = this.dataList.concat(res.data.list);
          })
          .catch((err) => {
            this.query.pageNo -= 1;
          })
          .finally((res) => {
            uni.hideLoading({ mask: true });
          });
      }
    },
    fetchDetail(orderNo) {
      uni.showLoading({ mask: true });
      getDetailsByOrderNoQuery(orderNo)
        .then((res) => {
          this.orderDetail.list = res.data;
          console.log(this.orderDetail.list);
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
  },
  onReachBottom() {
    console.log("到底了");
    this.fetchShareEarnings();
  },
};
</script>

<style lang="scss" scoped>
.page {
  .fs-34 {
    font-size: 34rpx;
  }
  .fs-30 {
    font-size: 30rpx;
  }
  .tag {
    line-height: 32rpx;
    border-radius: 4rpx;
    font-size: 22rpx;
    padding: 0 10rpx;
    margin-left: 8rpx;
    &.green {
      background: rgba(36, 159, 44, 0.2);
      color: rgba(36, 159, 44, 1);
    }
    &.blue {
      background: rgba(20, 93, 174, 0.2);
      color: rgba(20, 93, 174, 1);
    }
  }
  /deep/ .van-tabs__line {
    background-color: $uni-color-theme !important;
  }
  /deep/ .van-tabs__nav {
    width: 60%;
    margin: 0 auto;
  }
  /deep/ .van-tab--active view {
    // font-size: 40rpx !important;
    // color: $uni-color-primary !important;
    font-weight: 600 !important;
  }
  /deep/ .van-tab {
    text {
      font-size: 34rpx;
    }
  }
  /deep/ .arrowDown {
    transform: translateY(4rpx);
  }
  /deep/ .van-popup {
    background-color: transparent !important;
  }
}
</style>
