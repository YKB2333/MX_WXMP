<template>
  <view class="min-h-full bg-primary pb30 hidden">
    <!-- #ifdef H5 -->
     <view class="plr30 pt28 bg-white title_fixed">
      <view
        class="col center-x mb16 bg-white l-h70 h70"
        style="position: relative; top: 0; z-index: 1;"
      >
        <view class="absolute" @tap="goBack" >
          <image :src="IMAGE.ARROW_LEFT" class="w-h48" />
        </view>
        <view>会员权益</view>
      </view>
    </view>
    <!-- #endif -->
    <!-- 等级卡片 -->
    <view
      v-if="userInfo && userInfo.levelCode == 0"
      class="relative radius-12 mt32"
      style="min-height:480rpx;"
    >
      <image
        :src="IMAGE.MINE_CARD_IRON"
        mode="widthFix"
        class="absolute mauto"
        style="left:0;right:0;width:686rpx;z-index: 1;"
      />
      <image :src="IMAGE.MINE_SHADOW" mode="widthFix" class="w-full" />

      <view class="col absolute w-h-full" style="top:0;left:0;z-index: 2;">
        <view class="row ptb32 plr64">
          <image
            :src="IMAGE.MINE_ICN_IRON"
            mode="widthFix"
            class="w-h80 mr24"
          />
          <view class="col flex-1">
            <view class="fs-lg-add color-iron l-h48">
              铁卡会员
            </view>
            <view class="fs-22 color-iron l-h36">
              成长秘籍是购物哦~
            </view>
          </view>
        </view>
        <view class="col flex-1 mt64 plr36">
          <block v-if="userInfo">
            <view class="integral">
              <view class="w192 h96 mlr24 text-center" @click="linkPage('couponList')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-iron">{{
                  userInfo
                    ? couponList.filter((item) => item.status === 0).length || 0
                    : "-"
                }}</text>
                <view class="fs-sm color-iron l-h32" >优惠券</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="relative w192 h96 mlr24 text-center m20" @click="linkPage('integral', '1')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-iron">{{
                  userInfo ? userInfo.avilableScore || 0 : "-"
                }}</text>
                <view class="fs-sm color-iron l-h32">喵豆</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="w192 h96 ml24 text-center">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-iron">{{
                  userInfo.levelCode == 0
                    ? "1/3"
                    : userInfo.levelCode == 1
                    ? "2/3"
                    : "3/3"
                }}</text>
                <view class="fs-sm color-iron l-h32">等级勋章</view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </view>
    <view
      v-if="userInfo && userInfo.levelCode == 1"
      class="relative radius-12 mt32"
      style="min-height:480rpx;"
    >
      <image
        :src="IMAGE.MINE_CARD_SILVER"
        mode="widthFix"
        class="absolute mauto"
        style="left:0;right:0;width:686rpx;z-index: 1;"
      />
      <image :src="IMAGE.MINE_SHADOW" mode="widthFix" class="w-full" />

      <view class="col absolute w-h-full" style="top:0;left:0;z-index: 2;">
        <view class="row ptb32 plr64">
          <image
            :src="IMAGE.MINE_ICN_SILVER"
            mode="widthFix"
            class="w-h80 mr24"
          />
          <view class="col flex-1">
            <view class="fs-lg-add color-silver l-h48">
              银卡会员
            </view>
            <view class="fs-22 color-silver l-h36">
              银光闪闪，更多优享！
            </view>
          </view>
        </view>
        <view class="col flex-1 mt64 plr36">
          <block v-if="userInfo">
            <view class="integral">
              <view class="w192 h96 mr24 text-center" @click="linkPage('couponList')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-silver">{{
                  userInfo
                    ? couponList.filter((item) => item.status === 0).length || 0
                    : "-"
                }}</text>
                <view class="fs-sm color-silver l-h32">优惠券</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="relative w192 h96 mlr24 text-center" @click="linkPage('integral', '1')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-silver">{{
                  userInfo.avilableScore || 0
                }}</text>
                <view class="fs-sm color-silver l-h32">喵豆</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="w192 h96 ml24 text-center">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-silver">{{
                  userInfo.levelCode == 0
                    ? "1/3"
                    : userInfo.levelCode == 1
                    ? "2/3"
                    : "3/3"
                }}</text>
                <view class="fs-sm color-silver l-h32">等级勋章</view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </view>
    <view
      v-if="userInfo && userInfo.levelCode == 2"
      class="relative radius-12 mt32"
      style="min-height:480rpx;"
    >
      <image
        :src="IMAGE.MINE_CARD_GOLD"
        mode="widthFix"
        class="absolute mauto"
        style="left:0;right:0;width:686rpx;z-index: 1;"
      />
      <image :src="IMAGE.MINE_SHADOW" mode="widthFix" class="w-full" />

      <view class="col absolute w-h-full" style="top:0;left:0;z-index: 2;">
        <view class="row ptb32 plr64">
          <image
            :src="IMAGE.MINE_ICN_GOLD"
            mode="widthFix"
            class="w-h80 mr24"
          />
          <view class="col flex-1">
            <view class="fs-lg-add color-gold l-h48">
              金卡会员
            </view>
            <view class="fs-22 color-gold l-h36">
              金光闪闪，美好尽享！
            </view>
          </view>
        </view>
        <view class="col flex-1 mt64 plr36">
          <block v-if="userInfo">
            <view class="integral">
              <view class="w192 h96 mlr24 text-center" @click="linkPage('couponList')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-gold">{{
                  couponList.filter((item) => item.status === 0).length || 0
                }}</text>
                <view class="fs-sm color-gold l-h32">优惠券</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="relative w192 h96 mlr24 text-center" @click="linkPage('integral', '1')">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-gold">{{
                  userInfo.avilableScore || 0
                }}</text>
                <view class="fs-sm color-gold l-h32">喵豆</view>
              </view>
              <view class="h32 w2 bg-gray-simple"></view>
              <view class="w192 h96 ml24 text-center">
                <text class="block fw600 fs-lg-add l-h48 mb8 color-gold">{{
                  userInfo.levelCode == 0
                    ? "1/3"
                    : userInfo.levelCode == 1
                    ? "2/3"
                    : "3/3"
                }}</text>
                <view class="fs-sm color-gold l-h32">等级勋章</view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </view>
    <!-- 勋章 -->
    <view class="h162 mlr32 bg-white row mb24 radius-12">
      <view class="row h216 w-full space-between" style="margin-top:-64rpx;">
        <view class="col center-x ml46">
          <image
            :src="IMAGE.VIP_ICON_MEDAL_IRON"
            mode="widthFix"
            class="w-h160"
          />
          <view class="fs-22">
            铁勋章
          </view>
        </view>
        <view class="col center-x">
          <image
            v-if="
              userInfo && (userInfo.levelCode == 1 || userInfo.levelCode == 2)
            "
            :src="IMAGE.VIP_ICON_MEDAL_SILVER"
            mode="widthFix"
            class="w-h160"
          />
          <image
            v-else
            :src="IMAGE.VIP_ICON_MEDAL"
            mode="widthFix"
            class="w-h160"
          />
          <view class="fs-22">
            {{ userInfo && (userInfo.levelCode == 1 || userInfo.levelCode == 2)? "银勋章" : "未点亮" }}
          </view>
        </view>
        <view class="col center-x mr46">
          <image
            v-if="userInfo && userInfo.levelCode == 2"
            :src="IMAGE.VIP_ICON_MEDAL_GOLD"
            mode="widthFix"
            class="w-h160"
          />
          <image
            v-else
            :src="IMAGE.VIP_ICON_MEDAL"
            mode="widthFix"
            class="w-h160"
          />
          <view class="fs-22">
            {{ userInfo && userInfo.levelCode == 2 ? "金勋章" : "未点亮" }}
          </view>
        </view>
      </view>
    </view>
    <!-- 会员权益 -->
    <view class="pt24 pb32 mlr32  bg-white radius-12 mb24">
      <view class="l-h44 mb48 fw600 plr32">
        会员权益
      </view>
      <view class="row mb32 plr32">
        <view class="relative w-h96 radius-circle mr30" style="border: 1rpx solid #FF9EA8;">
          <image
            :src="asisList[userInfo.levelCode].url"
            mode="widthFix"
            class="w-full  radius-circle pos-center"
          />
        </view>
        <view class="col relative">
          <view
            class=" bg-primary radius-12 mb16 fs-22 plr24 l-h48 h48 ellipsis w500"
          >
            {{ asisList[userInfo.levelCode].welcomeText || '欢迎'}}
          </view>
            <image
              :src="IMAGE.MINE_ICN_QIPAO"
              mode="widthFix"
              class="w24 h6 absolute"
              style="top:54rpx;left:24rpx;"
            />
          <view class="fs-22">
            {{ asisList[userInfo.levelCode].name || '客服'}}
          </view>
        </view>
      </view>
      <view class="row wrap">
        <block v-for="(item, idx) in rights" :key="idx">
          <view
            v-if="item.class.includes(userInfo.levelCode)"
            class="pt14 col center-y"
            style="width:25%;"
            @tap="jump2bohe(item.name)"
          >
            <image :src="item.icon" class="w64 mb16" mode="widthFix"/>
            <text
              :class="[item.active ? '' : 'color-gray', 'fs-22', 'mb4']"
              >{{ item.name }}</text
            >
            <text class="color-gray fs-22 mb16">{{ item.text }}</text>
          </view>
        </block>
      </view>
    </view>
    <!-- 按钮 -->
    <!-- <view class="share-goods-btn" @tap="toGoodsList">去分享商品</view> -->
    <!-- 联系弹窗 -->
    <!-- <van-popup
      :show="linkPopup"
      close-on-click-overlay
      closeable
      @close="closePopup"
    >
      <view class="p60">
        <view
          class="p20 radius-circle bg-white"
          style="position:absolute;left:50%;transform:translateX(-50%);top:-60rpx;z-index:99999999;"
        >
          <image
            :src="fansList[currentLinkIndex].avatar || IMAGE.AVATAR_DEFAULT"
            class="w-h140 radius-circle"
          />
        </view>
        <view
          class="ellipsis fw600 text-center mb30 mt80"
          v-if="fansList[currentLinkIndex].nickName"
          >{{ fansList[currentLinkIndex].nickName }}</view
        >
        <view>
          <view class="ptb26 row" v-if="fansList[currentLinkIndex].mobile">
            <text class="color-gray inline-block w144">手机号：</text>
            <view class="flex-1 row space-between">
              <text class="fw600">{{ fansList[currentLinkIndex].mobile }}</text>
              <text class="fw600 color-red" @tap="linkFans">联系</text>
            </view>
          </view>
          <view class="ptb26 row" v-if="fansList[currentLinkIndex].wechat">
            <text class="color-gray inline-block w144">微信号：</text>
            <view class="flex-1 row space-between">
              <text class="fw600">{{ fansList[currentLinkIndex].wechat }}</text>
              <text class="fw600 color-red" @tap="onCopy">复制</text>
            </view>
          </view>
          <view class="ptb26">
            <text class="color-gray inline-block w144">购买单数：</text>
            <text class="fw600">{{
              fansList[currentLinkIndex].buyQuantity || 0
            }}</text>
          </view>
          <view class="ptb26">
            <text class="color-gray inline-block w144">贡献金额：</text>
            <text class="fw600">{{
              fansList[currentLinkIndex].orderAmt | formatMoney
            }}</text>
          </view>
        </view>
      </view>
    </van-popup> -->
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import {
  INTEGRAL_GOODS_BUY,
  INTEGRAL_GOODS_SHARE,
  VIP_BG,
  VIP_ICON_MEDAL,
  VIP_ICON_MEDAL_IRON,
  VIP_ICON_MEDAL_SILVER,
  VIP_ICON_MEDAL_GOLD,
  VIP_SVIP,
  VIP_WHITE_BG,
  VIP_WKT,
  ARROW_RIGHT,
  VIP_BG_2X,
  AVATAR_DEFAULT,
  VIP_ICON_REWORD,
  VIP_ICON_FANS,
  ICON_CLOSE,
  MINE_CARD_IRON,
  MINE_CARD_SILVER,
  MINE_CARD_GOLD,
  MINE_ICN_IRON,
  MINE_ICN_SILVER,
  MINE_ICN_GOLD,
  MINE_SHADOW,
  MINE_ICN_ZHULI,
  MINE_ICN_QIPAO,
  MINE_ICN_YOUFEI,
  MINE_ICN_ZHEKOU,
  MINE_ICN_ZHEKOU_ACTIVE,
  MINE_ICN_BAOHE_ACTIVE,
  MINE_ICN_GENGDUO,
  VIP_ICN_MD,
  VIP_ICN_TK7,
  VIP_ICN_TK15,
  VIP_ICN_TK30,
  MINE_ICN_CAIDAN,
  MINE_ICN_CAIDAN_ACTIVE,
  MINE_ICN_MTK,
  MINE_ICN_MTK_ACTIVE,
  MINE_ICN_YFX,
  MINE_ICN_YFX_ACTIVE,
  ARROW_LEFT
} from "@/imageConfig";
import {
  getMyFansList,
  getUserVipSales,
  sendUserproxyinvite,
} from "@/api/member";
import { getAllCouponByUserId } from "@/api/activity/coupon";
import { getUserAsisList } from "@/api/user";
import { formatDiffTime } from "@/common/filters";

export default {
  name: "VIP",
  components: {},
  data() {
    return {
      IMAGE: {
        INTEGRAL_GOODS_BUY,
        INTEGRAL_GOODS_SHARE,
        VIP_BG,
        VIP_BG_2X,
        VIP_ICON_MEDAL,
        VIP_ICON_MEDAL_IRON,
        VIP_ICON_MEDAL_SILVER,
        VIP_ICON_MEDAL_GOLD,
        VIP_SVIP,
        VIP_WHITE_BG,
        VIP_WKT,
        ARROW_RIGHT,
        AVATAR_DEFAULT,
        VIP_ICON_REWORD,
        VIP_ICON_FANS,
        ICON_CLOSE,
        MINE_CARD_IRON,
        MINE_CARD_SILVER,
        MINE_CARD_GOLD,
        MINE_ICN_IRON,
        MINE_ICN_SILVER,
        MINE_ICN_GOLD,
        MINE_SHADOW,
        MINE_ICN_QIPAO,
        MINE_ICN_YOUFEI,
        MINE_ICN_ZHULI,
        MINE_ICN_ZHEKOU,
        MINE_ICN_ZHEKOU_ACTIVE,
        MINE_ICN_BAOHE_ACTIVE,
        MINE_ICN_GENGDUO,
        ARROW_LEFT
      },
      vipSaleData: {}, // 会员权益销售数据
      fansQuery: {
        pageNo: 0,
        pageSize: 20,
      },
      // 粉丝列表
      fansList: [],
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      totalFans: 0, // 粉丝总数
      svip: 0, // VIP:1是0否
      endTime: "", // vip结束时间，用来计算vip剩余时间
      userShareNumber: 0, // 已购买人数
      svipSalesTargetShareNumber: 0, // 目标购买人数
      targetAmount: 0, // 销售目标金额
      finishAmount: 0, // 已销售金额
      totalTaskValue: 0, // 非达人下，用户购买目标金额
      userTotalTaskValue: 0, // 非达人下，用户已购买金额
      linkPopup: false, // 联系弹窗
      currentLinkIndex: 0, // 当前联系人索引
      timer: null, // 定时器
      refreshTime: 0, // 用来刷新时间显示
      couponList: [], // 优惠券列表
      rights: [
        //会员权益
        {
          name: "宝盒",
          class: [0, 1, 2],
          icon: MINE_ICN_BAOHE_ACTIVE,
          text: "点击抽奖",
          active: true,
        },
        {
          name: "喵豆",
          class: [0],
          icon: VIP_ICN_MD,
          text: "+500",
          active: true,
        },
        {
          name: "喵豆",
          class: [1],
          icon: VIP_ICN_MD,
          text: "+2000",
          active: true,
        },
        {
          name: "喵豆",
          class: [2],
          icon: VIP_ICN_MD,
          text: "+5000",
          active: true,
        },
        {
          name: "退货",
          class: [0],
          icon: VIP_ICN_TK7,
          text: "7天无理由",
          active: true,
        },
        {
          name: "退货",
          class: [1],
          icon: VIP_ICN_TK15,
          text: "15天无理由",
          active: true,
        },
        {
          name: "退货",
          class: [2],
          icon: VIP_ICN_TK30,
          text: "30天无理由",
          active: true,
        },
        {
          name: "邮费",
          class: [0, 1, 2],
          icon: MINE_ICN_YOUFEI,
          text: "全场包邮",
          active: true,
        },
        {
          name: "折扣",
          class: [0],
          icon: MINE_ICN_ZHEKOU,
          text: "全场8.8折",
          active: false,
        },
        {
          name: "惊喜彩蛋",
          class: [0],
          icon: MINE_ICN_CAIDAN,
          text: "特色大礼包",
          active: false,
        },
        {
          name: "8.8折",
          class: [1],
          icon: MINE_ICN_ZHEKOU_ACTIVE,
          // icon: MINE_ICN_ZHEKOU,
          text: "金卡7.8折",
          active: true,
        },
        {
          name: "折扣",
          class: [2],
          icon: MINE_ICN_ZHEKOU_ACTIVE,
          text: "全场7.8折",
          active: true,
        },
        {
          name: "惊喜彩蛋",
          class: [1, 2],
          icon: MINE_ICN_CAIDAN_ACTIVE,
          text: "特色大礼包",
          active: true,
        },
        {
          name: "秒退款",
          class: [0, 1],
          icon: MINE_ICN_MTK,
          text: "退货秒退款",
          active: false,
        },
        {
          name: "运费险",
          class: [0, 1],
          icon: MINE_ICN_YFX,
          text: "免费赠送",
          active: false,
        },
        {
          name: "秒退款",
          class: [2],
          icon: MINE_ICN_MTK_ACTIVE,
          text: "退货秒退款",
          active: true,
        },
        {
          name: "运费险",
          class: [2],
          icon: MINE_ICN_YFX_ACTIVE,
          text: "免费赠送",
          active: true,
        },
      ],
      asisList: [],
    };
  },
  computed: {
    // 剩余时间
    remainTime() {
      if (this.refreshTime >= 0) {
        return formatDiffTime(this.endTime);
      }
    },
    ...mapGetters(["token", "userInfo", "authUserData", "shareUserId"]),
  },
  onLoad(options) {
    this.init();
  },
  methods: {
    init() {
      // this.fetchUserVipSales();
      // this.loadFansList();
      this.fetchUserAsisList();
      this.fetchCouponCounts();
    },
    fetchUserVipSales() {
      getUserVipSales().then((res) => {
        this.vipSaleData = res.data;
        console.log(this.vipSaleData);
        let data = res.data;
        // this.svip = data.svip;
        this.userShareNumber = data.userShareNumber; // 已购买人数
        this.svipSalesTargetShareNumber = data.svipSalesTargetShareNumber; // 目标购买人数
        this.targetAmount = data.targetAmount / 100; // 销售目标金额
        this.finishAmount = data.finishAmount / 100; // 已销售金额
        this.totalTaskValue = data.totalTaskValue / 100; // 非达人下，用户购买目标金额
        this.userTotalTaskValue = data.userTotalTaskValue / 100; // 非达人下，用户已购买金额
        if (data.svip === 1) {
          // vip
          if (data.endTime) {
            this.endTime = data.endTime;
            console.log(this.endTime);
            this.timer = setInterval(() => {
              // 一分钟刷新一次
              console.log("倒计时");
              this.refreshTime++;
            }, 60 * 1000);
          }
        }
      });
    },
    //小助理列表
    fetchUserAsisList() {
      getUserAsisList().then((res) => {
        console.log(res);
        let data = res.data;
        if (data && data.list) {
          this.asisList = data.list;
        }
      });
    },
    jump2bohe(name) {
      if (name == "宝盒") {
        uni.navigateTo({
          url: "/pagesA/vip/Vipbox",
        });
      }
    },
    // 获取优惠卷数量
    fetchCouponCounts() {
      getAllCouponByUserId().then((res) => {
        if (res.data) {
          console.log("优惠卷", res);
          this.couponList = res.data;
        }
      });
    },
    // 加载粉丝列表
    loadFansList() {
      if (
        this.loadMore.finished ||
        this.loadMore.loading ||
        this.loadMore.error
      )
        return;
      this.fansQuery["pageNo"] += 1;
      this.loadMore.loading = true;
      getMyFansList(this.fansQuery)
        .then((res) => {
          let data = res.data;
          this.fansList = this.fansList.concat(data.list);
          console.log("粉丝列表", this.fansList);
          if (!data.hasNextPage) {
            this.loadMore.finished = true;
          }
          this.loadMore.error = false;
          this.totalFans = Number(data.total);
        })
        .catch((error) => {
          this.loadMore.error = true;
          this.fansQuery["pageNo"] -= 1;
        })
        .finally(() => {
          this.loadMore.loading = false;
        });
    },
    onErrorClick() {
      this.loadMore.error = false;
      this.loadFansList();
    },
    // 跳转至商品列表
    toGoodsList() {
      uni.navigateTo({
        url: "/pages/goods-list/index?type=input",
      });
    },
    // 去兑换
    toExchange() {
      uni.navigateTo({
        url: "/pagesA/vip/Pay",
      });
    },
    // 打开联系弹窗
    showLinkPopup(index) {
      this.currentLinkIndex = index;
      this.linkPopup = true;
    },
    closePopup() {
      this.linkPopup = false;
    },
    goBack(){
      // #ifdef H5
      this.$flutter({ method: 'BACK'});
      // #endif
    },
    // 复制微信号
    onCopy() {
      uni.setClipboardData({
        data: this.fansList[this.currentLinkIndex].wechat,
      });
    },
    // 联系粉丝
    linkFans() {
      uni.makePhoneCall({
        phoneNumber: this.fansList[this.currentLinkIndex].mobile,
      });
    },
    // 邀请升级
    onInviteUpdate(item) {
      console.log(item);
      uni.showLoading({ mask: true });
      sendUserproxyinvite({ invitedUid: item.uid })
        .then((res) => {
          uni.showToast({
            title: "邀请成功",
            duration: 1000,
            icon: "none",
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    linkPage(routeName, query) {
      console.log("我进来了===== ", routeName, query);
      // #ifdef H5
      let appMap = {
        integral: { method: "MY_INTEGRAL", data: { type: query } },
        couponList: { method: "MY_COUPON" },
      };
      window[javascriptChannelName].postMessage(
        JSON.stringify(appMap[routeName])
      );
      // #endif

      // #ifdef MP-WEIXIN
      let map = {
        integral: `${this.$pageUrl.MY_INTEGRAL}?type=${query}`,
        couponList: `${this.$pageUrl.MY_COUPON}?fromPage=Mine`,
      };
      if (!this.token) {
        this.authPopup = true;
      } else {
        console.log(map[routeName]);
        uni.navigateTo({
          url: map[routeName],
        });
      }
      // #endif
    },

  },
  onReachBottom() {
    // this.loadFansList();
  },
  // 监听页面卸载
  onUnload() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.head_bg {
  // width: calc(100% - 60rpx);
  position: absolute;
  left: 30rpx;
  top: 30rpx;
  right: 30rpx;
}
.head_top {
  position: absolute;
  left: 50rpx;
  top: 30rpx;
  right: 50rpx;
}
.color-iron {
  color: #666880;
}
.color-gold {
  color: #98784a;
}
.color-silver {
  color: #717b8a;
}
.bg-iron {
  background-color: rgba(102, 104, 128, 0.6);
}
.bg-gold {
  background-color: rgba(102, 104, 128, 0.6);
}
.bg-silver {
  background-color: rgba(102, 104, 128, 0.6);
}
.integral {
  width: 75%;
  display: flex;
  align-items: center;
}
/deep/ .van-slider {
  background: #fec652 !important;
}
.share-goods-btn {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 66rpx;
  text-align: center;
  width: 430rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: rgba(255, 209, 0, 1);
  box-shadow: 0px 10rpx 25rpx 1px rgba(255, 185, 25, 0.5);
  border-radius: 50rpx;
  font-weight: 600;
  // margin: 30rpx auto 0;
}
.radius-12 {
  border-radius: 12rpx;
}
/deep/ .van-slider--disabled {
  opacity: 1;
}
/deep/ .van-popup {
  width: 80%;
  border-radius: 20rpx;
  overflow-y: unset;
}
</style>
