<template>
  <view>
    <view class="bg-primary ptb32 plr30">
      <view class="text-center bg-white radius-sm pb48 pt32">
        <view v-if="payOrder&&payOrder.obtainPoint>0">确认收货可获得喵豆</view>
        <view v-if="payOrder&&payOrder.obtainPoint>0" class="color-pink" style="font-size:80rpx;">{{
          payOrder.obtainPoint
        }}</view>
        <view class="mt8 mb24 l-h40" v-if="userInfo && userInfo.levelCode != 2">
          <view class="color-gray">
            再消费￥{{
              payOrder.userNextLevelAmountDiff | formatMoney
            }}
            即可升级{{ payOrder.userNextLevelName || '隐藏' }}会员！
          </view>
          <view class="color-gray"> {{ nextAsis }}助理等你哦~ </view>
        </view>
        <view class="mt8 mb24 l-h40" v-else>
          <view class="color-gray">
            您已成功消费获得喵豆，可在下次消费
          </view>
          <view class="color-gray">
            时抵用现金哦~
          </view>
        </view>
        <image
          :src="IMAGE.MINE_MIAODOU"
          class="w-full h128 mb32"
          mode="widthFix"
        />
        <view class="row space-between plr22">
          <navigator
            url="/pages/tabbar/Home"
            open-type="switchTab"
            style="width:48%"
          >
            <view
              class="l-h80 bg-primary text-center fs14"
              style="border-radius: 12rpx;"
              >返回首页</view
            >
          </navigator>
          <navigator
            :url="`/pages/order/OrderDetail?id=${orderId}`"
            style="width:48%"
          >
            <view
              class="bg-pink l-h80 text-center h80 color-white fs14"
              style="border-radius: 12rpx;"
              >查看订单</view
            >
          </navigator>
        </view>
      </view>

      <!-- <view class="w-h160 bg-theme radius-circle text-center l-h160" style="margin: 0 auto;">
        <image :src="IMAGE.ICON_YES" class="w70 h50" />
      </view>
      <view class="text-center fs-lg fw600 mt60">
        支付成功<text v-if="payOrder.obtainPoint">，获得<text class="color-red">{{payOrder.obtainPoint}}喵豆</text></text>
      </view>
      <view class="row space-between mt60">
        <navigator :url="`/pages/order/OrderDetail?id=${orderId}`" style="width: 48%;">
          <view class="h88 l-h88 text-center radius-round bg-theme fw600">查看订单</view>
        </navigator>
        <navigator open-type="switchTab" url="/pages/tabbar/Home" style="width: 48%;">
          <view class="h88 l-h88 text-center radius-round bg-white fw600" style="border: 2rpx solid #121314;">返回首页</view>
        </navigator>
      </view> -->
    </view>
    <guess-goods ref="guess-like" :guessGoods="guessGoods" isWhiteBg/>
    <!-- 升级弹窗 -->
    <!-- <view
      class="w-h-full absolute"
      style="top:0;left:0;background: rgba(0, 0, 0, 0.5);"
    > -->
    <van-popup
      :show="levelUpState"
      :close-on-click-overlay="true"
      custom-style="background: transparent"
      @click-overlay="closePopup"
    >
      <view>
        <view>
          <image
            :src="upStatusLight"
            mode="widthFix"
            class="w-h236 absolute light mauto"
            style="right:0;left:0;top:0;"
          />
          <image
            :src="upStatusImg"
            mode="widthFix"
            class="w-h150 absolute mauto"
            style="right:0;left:0;top:38rpx;"
          />
        </view>
        <view class="bg-white radius-12 hidden" style="margin-top:102rpx;">
          <view
            class="card-top text-center pb32"
            style="padding-top:106rpx;"
            :style="{
              background:
                userInfo.levelCode == 1
                  ? 'linear-gradient(180deg, #DEDEDE 0%, #BCC1C7 100%);'
                  : 'linear-gradient(180deg, #ffe0a2 0%, #f9d08c 100%);',
            }"
          >
            <view
              :class="[
                userInfo.levelCode == 1 ? 'color-silver' : 'color-gold',
                'fw600',
                'mb8',
                'fs-lg-add',
              ]"
            >
              {{ userDataText.title }}
            </view>
            <view
              v-for="(item, idx) in userDataText.content"
              :key="idx"
              :class="[
                userInfo.levelCode == 1 ? 'color-silver' : 'color-gold',
                'fs-sm-add',
                'plr32',
                'l-h36',
              ]"
              style="opacity:0.6;"
            >
              {{ item }}
            </view>
          </view>
          <view class="row space-between center-y h80 bg-white plr32">
            <view class="fw600">
              获得权益
            </view>
            <view class="fs-22 color-gray mr8" @click="jump2vip">
              查看更多
              <image :src="IMAGE.ARROW_RIGHT" mode="widthFix" class="w24 h32" />
            </view>
          </view>
          <view class="row wrap plr16 pb36 bg-white">
            <view class="ptb16 col center-y" style="width:25%;">
              <image
                :src="
                  userInfo.levelCode == 2
                    ? IMAGE.VIP_ICN_TK30
                    : IMAGE.VIP_ICN_TK15
                "
                class="w-h48 mb12"
              />
              <text class="color-gray-simple fs-22">无理由退货</text>
            </view>
            <view class="ptb16 col center-y" style="width:25%;">
              <image :src="IMAGE.MINE_ICN_ZHEKOU_ACTIVE" class="w-h48 mb12" />
              <text class="color-gray-simple fs-22"
                >全场{{ userInfo.levelCode == 2 ? "7.8" : "8.8" }}折</text
              >
            </view>
            <view
              v-if="userInfo.levelCode == 2"
              class="ptb16 col center-y"
              style="width:25%;"
            >
              <image :src="IMAGE.MINE_ICN_MTK_ACTIVE" class="w-h48 mb12" />
              <text class="color-gray-simple fs-22">秒退款</text>
            </view>
            <view
              v-if="userInfo.levelCode == 2"
              class="ptb16 col center-y"
              style="width:25%;"
            >
              <image :src="IMAGE.MINE_ICN_YFX_ACTIVE" class="w-h48 mb12" />
              <text class="color-gray-simple fs-22">运费险</text>
            </view>
            <view
              v-if="userInfo.levelCode == 1"
              class="ptb16 col center-y"
              style="width:25%;"
            >
              <image :src="IMAGE.MINE_ICN_BAOHE_ACTIVE" class="w-h48 mb12" />
              <text class="color-gray-simple fs-22">每月宝盒</text>
            </view>
            <view
              v-if="userInfo.levelCode == 1"
              class="ptb16 col center-y"
              style="width:25%;"
            >
              <image :src="IMAGE.MINE_ICN_CAIDAN_ACTIVE" class="w-h48 mb12" />
              <text class="color-gray-simple fs-22">惊喜彩蛋</text>
            </view>
          </view>
        </view>
        <view class="row plr60 space-between" style="height:0;">
          <image
            :src="IMAGE.ICON_UP_LINK"
            mode="widthFix"
            class="w36 h88 relative"
            style="z-index:1;transform: translateY(-40%);"
          />
          <image
            :src="IMAGE.ICON_UP_LINK"
            mode="widthFix"
            class="w36 h88 relative"
            style="z-index:1;transform: translateY(-40%);"
          />
        </view>
        <view class="radius-12 mt16 hidden bg-white">
          <image
            :src="
              userInfo.levelCode == 1
                ? IMAGE.ICON_SILVER_COMING
                : IMAGE.ICON_GOLD_COMING
            "
            mode="widthFix"
            class="w-full"
          />
          <view class="bg-white hidden">
            <view
              class="color-white bg-pink h80 l-h80 w256 mtb20 mauto text-center radius-12 relative"
            >
              撩{{ asisName }}
              <!-- :session-from="`ysf.config=${ysf.config}|groupid=398881453|staffid=3856743`" -->
              <button
                open-type="contact"
                :session-from="`ysf.config=${ysf.config}`"
                style="opacity:0;z-index:1;top:0;left:0;"
                class="w-h-full absolute"
              ></button>
            </view>
          </view>
        </view>
        <view class="text-center mt28"
          ><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h80" @tap="closePopup"
        /></view>
      </view>
    </van-popup>
    <!-- </view> -->
  </view>
</template>

<script>
import GuessGoods from "@/pages/guess-goods/index";
import { guessLike } from "@/api/goods/spu";
import { getUserAsis, getUserAsisList } from "@/api/user";
import {
  ICON_YES,
  ICON_GOLD_COMING,
  ICON_SILVER_COMING,
  ICON_UP_LINK,
  MINE_MIAODOU,
  ARROW_RIGHT,
  VIP_ICN_TK15,
  VIP_ICN_TK30,
  MINE_ICN_ZHEKOU_ACTIVE,
  ICON_LIGHT_GOLD,
  ICON_LIGHT_SILVER,
  VIP_ICON_MEDAL_SILVER,
  VIP_ICON_MEDAL_GOLD,
  ICON_CLOSE_WHITE,
  MINE_ICN_YFX_ACTIVE,
  MINE_ICN_MTK_ACTIVE,
  MINE_ICN_BAOHE_ACTIVE,
  MINE_ICN_CAIDAN_ACTIVE,
} from "@/imageConfig";
import { payOrderInfo } from "@/api/order";
import { getByUserAndType } from "@/api/tools";
import { mapGetters } from "vuex";
import { formatTime } from "@/utils";

export default {
  name: "Pay",
  components: { GuessGoods },
  computed: {
    upStatusImg() {
      return this.userInfo.levelCode == 1
        ? this.IMAGE.VIP_ICON_MEDAL_SILVER
        : this.IMAGE.VIP_ICON_MEDAL_GOLD;
    },
    upStatusLight() {
      return this.userInfo.levelCode == 1
        ? this.IMAGE.ICON_LIGHT_SILVER
        : this.IMAGE.ICON_LIGHT_GOLD;
    },
    nextAsis() {
      if (this.asisList.length > 0) {
        if(this.userInfo.levelCode<2){
          return this.asisList.find(
            (item) => item.userType == Number(this.userInfo.levelCode) + 1
          ).name;
        }
      }
    },
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      IMAGE: {
        ICON_YES,
        ICON_GOLD_COMING,
        ICON_SILVER_COMING,
        ICON_UP_LINK,
        MINE_MIAODOU,
        ARROW_RIGHT,
        VIP_ICN_TK15,
        VIP_ICN_TK30,
        MINE_ICN_ZHEKOU_ACTIVE,
        ICON_LIGHT_GOLD,
        ICON_LIGHT_SILVER,
        VIP_ICON_MEDAL_SILVER,
        VIP_ICON_MEDAL_GOLD,
        ICON_CLOSE_WHITE,
        MINE_ICN_YFX_ACTIVE,
        MINE_ICN_MTK_ACTIVE,
        MINE_ICN_BAOHE_ACTIVE,
        MINE_ICN_CAIDAN_ACTIVE,
      },
      payOrder: {
        obtainPoint: 0,
      },
      orderId: "",
      guessGoods: [], //猜你喜欢
      userData: {}, //用户最新消息
      userDataText: {},
      userNextLevelAmountDiff: 0, //升级金额
      ysf: {
        config: "",
      },
      levelUpState: false,
      asisName: "",
      asisType: 0,
      asisList: [], //小助理列表
    };
  },
  onLoad(options) {
    this.init();
    this.orderId = options.id;
    //加载订单
    uni.showLoading({ title: "加载中", mask: true });
    payOrderInfo(this.orderId)
      .then((res) => {
        console.info(res);
        this.payOrder = res.data;
        if (this.payOrder.payStatus < 1) {
          uni.navigateTo({
            url: "/pages/order/OrderList?type=all",
          });
        }
      })
      .finally(() => {
        uni.hideLoading();
      });
    
    this.fetchByUserAndType();
    this.fetchUserAsisList();
  },
  methods: {
    init() {
      let params = {
        pageIndex: 1,
        pageSize: 6,
      };
      guessLike(params).then((res) => {
        let data = res.data;
        if (data) {
          this.guessGoods = data;
          console.log("猜你喜欢", this.guessGoods);
        }
      });
    },
    //获取用户最新消息
    fetchByUserAndType() {
      // let res = {"resCode":"00000","data":{"pageNo":1,"pageSize":10,"id":"1333967426655649794","userId":"1333951854156980226","bizId":null,"bizType":"1","text":"{\"title\":\"恭喜您升级为金卡会员\",\"content\":[\"您的累计消费金额已达￥1666元\"]}","createTime":1606877593000,"updateTime":null,"readStatus":0},"resInfo":"成功","url":null,"success":true,"tip":false,"traceId":"d41fea66b253289d","responseTime":1606877601096}
      getByUserAndType({ userId: this.userInfo.id }).then((res) => {
        console.log(res);
        if (res.data) {
          //升级
          if (res.data.bizType == "1") {
            // 刷新用户信息
            this.fetchUserInfo();
            this.fetUserAsis();
            this.userData = res.data;
            this.userDataText = JSON.parse(this.userData.text);
          }
        }
      });
    },
    // 获取用户信息
    fetchUserInfo() {
      this.$store.dispatch("getUserInfo").then((data) => {
        console.log("用户信息", data, data.shareCode, data.avilableScore);
        this.levelUpState = true;
      });
    },
    // 小助理
    fetUserAsis() {
      getUserAsis().then((res) => {
        console.log("小助理111111111111111111", res);
        let data = res.data;
        if (data) {
          this.asisName = data.name;
          this.asisType = data.userType;
          this.ysf.config = JSON.stringify({
            uid: this.userInfo.id, // 用户唯一标识
            level: data.name, // vip等级
            data: JSON.stringify([
              {
                key: "real_name",
                label: "昵称",
                value: `${data.name}-${this.userInfo.nickName}-${this.userInfo.levelName}`,
              },
              {
                key: "mobile_phone",
                label: "手机号",
                value: this.userInfo.mobile,
              },
              {
                key: "reg_date",
                label: "创建时间",
                value: formatTime(this.userInfo.createdTime, "Y/M/D h:m:s"),
              },
              {
                key: "avatar",
                label: "头像",
                value: this.userInfo.headImgUrl,
              },
            ]),
          });
          console.log(
            "已登录================================================ysf",
            this.ysf.config
          );
        }
      });
    },
    //小助理列表
    fetchUserAsisList() {
      getUserAsisList().then((res) => {
        let data = res.data;
        if (data && data.list) {
          console.log(data);
          this.asisList = data.list;
        }
      });
    },
    closePopup() {
      this.levelUpState = false;
    },
    jump2vip(){
      uni.navigateTo({
        url: "/pagesA/vip/index",
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.card-top {
  width: 290px;
  opacity: 1;
  border-radius: 6rpx 6rpx 0px 0px;
}
.color-gold {
  color: #9e783a;
}
.radius-12 {
  border-radius: 12rpx;
}
.light {
  animation: lightRotate 5s infinite linear;
}
@keyframes lightRotate {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
</style>
