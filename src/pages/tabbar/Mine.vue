<template>
  <view class="page bg-primary hidden">
    <!-- #ifdef MP-WEIXIN -->
    <custom-nav class="relative" :bg="'#F2F2F5'" showStatus>
      <view class="plr20">
        <view class="text-center h-full fs-lg-add fw600">
          我的
        </view>
      </view>
    </custom-nav>
    <!--  #endif -->
    <!-- 我的 -->
   <view class="relative">
      <view
        class="mineHead hidden plr32 ptb24"
        :style="{ 'margin-top': navBarHeight + menuTop + 'px' }"
      >
        <!-- 用户信息 -->
        <view class="col">
          <view class="row center-y mb24">
            <image
              @tap="linkPage('userInfo')"
              :src="userInfo&&userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT"
              class="w-h112 radius-circle mr32"
            />
            <text
              class="ellipsis fs-lg-add fw600 flex-1"
              @tap="linkPage('userInfo')"
              >{{ userInfo&&userInfo.nickName || "登录/注册" }}</text
            >
            <image
              @tap="linkPage('setting')"
              :src="IMAGE.MINE_SETTING"
              class="w-h48 radius-circle"
            />
          </view>
          <view>
            <view class="col flex-1">
              <!-- 喵豆 -->
              <block>
                <view class="integral">
                  <view
                    @click="linkPage('couponList')"
                    class="w192 h96 mr24 text-center"
                  >
                    <text class="block fw600 fs-lg-add l-h48 mb8">{{
                      userInfo
                        ? couponList.filter((item) => item.status === 0).length || 0
                        : "-"
                    }}</text>
                    <view class="fs-sm l-h32" style="color:#909399;">优惠券</view>
                  </view>
                  <view class="h32 w2 bg-gray-simple"></view>
                  <view
                    @click="linkPage('recommendBuy', recommendNum)"
                    class="w192 h96 ml24 text-center"
                  >
                    <text class="block fw600 fs-lg-add l-h48 mb8">{{
                      userInfo ? (recommendNum > 999 ? "999+" : recommendNum) : "-"
                    }}</text>
                    <view class="fs-sm l-h32" style="color:#909399;">我的推荐</view>
                  </view>
                  <view class="h32 w2 bg-gray-simple"></view>
                  <view
                    class="relative w192 h96 mlr24 text-center"
                    @click="linkPage('integral', '1')"
                  >
                    <text class="block fw600 fs-lg-add l-h48 mb8">{{
                      userInfo ? userInfo.avilableScore || 0 : "-"
                    }}</text>
                    <view class="fs-sm l-h32" style="color:#909399;">喵豆</view>
                  </view>

                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
      <!-- 第二层引导蒙版 -->
      <view
        v-if="token && cardAsisShow && cardGuideRecomendShow === '0'"
        class="min-h-full w-full fixed"
        style="background:rgba(0, 0, 0, .1);top:0;z-index:9999;"
        @click="changeShow('cardAsisShow')"
      ></view>
      <!-- 第一层引导蒙版 -->
      <view
        v-if="token && cardGuideShow == '1' && cardGuideRecomendShow === '0'"
        class="min-h-full w-full fixed"
        style="background:rgba(0, 0, 0, .6);top:0;z-index:9999;"
        @click="changeShow('cardGuideShow')"
      ></view>

      <!-- 用等级卡片 -->
      <view class="relative">
        <image
          v-if="userInfo && cardGuideShow == '1' && cardGuideRecomendShow === '0'"
          :src="IMAGE.MINE_CARD_GUIDE"
          mode="widthFix"
          class="w-full absolute"
          style="top:390rpx"
          :class="{ zActive: zActive && cardGuideShow == '1' }"
          @click="changeShow('cardGuideShow')"
        />
        <view
          class="relative"
          :class="{ zActive: userInfo && zActive && cardGuideShow == '1' }"
        >
          <view
            v-if="userInfo && userInfo.levelCode == 0"
            class="relative mlr32 radius-12 mb24 hidden"
            @tap="goVip"
          >
            <image
              :src="IMAGE.MINE_CARD_IRON"
              mode="widthFix"
              class="w-full"
            />
            <view class="col absolute w-h-full " style="top:0;left:0;z-index:1;">
              <view class="row p32 center-y">
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
                <view
                  class="color-iron radius-12 text-center h64 l-h64 card-btn-bg plr28"
                >
                  会员中心
                </view>
              </view>
              <!-- 会员权益 -->
              <view class="bg-white pt24 flex-1">
                <view class="l-h44 mb24 mlr32 fw600">
                  会员权益
                </view>
                <view class="row wrap mlr8">
                  <view
                    class="pt14 col center-y"
                    style="width:20%;"
                    v-for="(item, idx) in rights"
                    :key="idx"
                  >
                    <image :src="item.icon" class="w-h48 mb16" />
                    <text class="fs-22" style="color:#303133;">{{ item.name }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="userInfo && userInfo.levelCode == 1"
            class="relative mlr32 radius-12 mb24 hidden"
            @tap="goVip"
          >
            <image
              :src="IMAGE.MINE_CARD_SILVER"
              mode="widthFix"
              class="w-full"
            />
            <view class="col absolute w-h-full " style="top:0;left:0;z-index:1;">
              <view class="row p32 center-y ">
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
                <view
                  class="color-silver radius-12 text-center h64 l-h64 card-btn-bg plr28"
                >
                  会员中心
                </view>
              </view>
              <!-- 会员权益 -->
              <view class="bg-white pt24 flex-1">
                <view class="l-h44 mb24 mlr32 fw600">
                  会员权益
                </view>
                <view class="row wrap mlr8">
                  <view
                    class="pt14 col center-y"
                    style="width:20%;"
                    v-for="(item, idx) in rights"
                    :key="idx"
                  >
                    <image :src="item.icon" class="w-h48 mb16" />
                    <text class="fs-22" style="color:#303133;">{{ item.name }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="
              (userInfo && userInfo.levelCode == 2) ||
                (!userInfo)
            "
            class="relative mlr32 radius-12 mb24 hidden"
            @tap="goVip"
          >
            <image
              :src="IMAGE.MINE_CARD_GOLD"
              mode="widthFix"
              class="w-full"
            />
            <view class="col absolute w-h-full " style="top:0;left:0;z-index:1;">
              <view class="row p32 center-y ">
                <image
                  :src="IMAGE.MINE_ICN_GOLD"
                  mode="widthFix"
                  class="w-h80 mr24"
                />
                <view class="col flex-1">
                  <view class="fs-lg-add color-gold l-h48">
                    {{
                      userInfo && userInfo.levelCode == 2 ? "金卡会员" : "会员"
                    }}
                  </view>
                  <view class="fs-22 color-gold l-h36">
                    {{
                      userInfo && userInfo.levelCode == 2
                        ? "金光闪闪，美好尽享！"
                        : "注册/登录即享受会员权益"
                    }}
                  </view>
                </view>
                <view
                  class="color-gold radius-12 text-center h64 l-h64 card-btn-bg plr28"
                >
                  {{
                    userInfo && userInfo.levelCode == 2 ? "会员中心" : "注册/登录"
                  }}
                </view>
              </view>
              <!-- 会员权益 -->
              <view class="bg-white pt24 flex-1">
                <view class="l-h44 mb24 mlr32 fw600">
                  会员权益
                </view>
                <view class="row wrap mlr8">
                  <view
                    class="pt14 col center-y"
                    style="width:20%;"
                    v-for="(item, idx) in rights"
                    :key="idx"
                  >
                    <image :src="item.icon" class="w-h48 mb16" />
                    <text class="fs-22" style="color:#303133;">{{ item.name }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="userInfo && cardGuideShow == '1'"
            class="absolute w-h-full"
            style="top:0;left:0;z-index:1;"
            @click="changeShow('cardGuideShow')"
          ></view>
        </view>
      </view>

		  <!-- 推荐蒙版 -->
      <view
        v-if="token && cardGuideRecomendShow === '1'"
        class="min-h-full w-full fixed"
        style="background:rgba(0, 0, 0, .6);top:0;z-index:9999;"
        @click="changeShow('cardGuideRecomendShow')"
      ></view>
      <!-- 我的推荐蒙版 -->
      <view  v-if="token && cardGuideRecomendShow === '1'" class="absolute w-h-full" style="top:160rpx;">
        <view
          @click="changeShow('cardGuideRecomendShow')"
          class="w192 h96 text-center absolute bg-white radius"
          style="z-index:10000;margin:0 auto;transform:translateX(-50%);left:50%;"
        >
          <text class="block fw600 fs-lg-add l-h48 mb8">{{
            userInfo ? (recommendNum > 999 ? "999+" : recommendNum) : "-"
          }}</text>
          <view class="fs-sm l-h32" style="color:#909399;">我的推荐</view>
        </view>
        <image
          :src="IMAGE.MINE_CARD_GUIDE_RECOMMEND" mode="widthFix" 
          class="w-full absolute"
          style="z-index:9999;"
          @click="changeShow('cardGuideRecomendShow')"
        />
      </view>
    </view> 
    <!-- 专属助理 -->
    <view class="relative">
      <!-- card_guide -->
      <image
        v-if="userInfo && cardAsisShow"
        :src="IMAGE.MINE_CARD_ASIS"
        mode="widthFix"
        class="w-full absolute"
        style="bottom:460rpx"
        :class="{ zActive: !zActive && cardGuideShow == '1' }"
        @click="changeShow('cardAsisShow')"
      />
      <view
        class="pt24 mlr32 plr32 bg-white radius-12 mb24 relative"
        :class="{ zActive: userInfo && !zActive && cardGuideShow == '1' }"
      >
        <view class="l-h44 mb48 fw600 " >
          专属助理
        </view>
        <view class="row mb32">
          <image
            :src="userInfo&&asisList[userInfo.levelCode || 0].url || IMAGE.AVATAR_DEFAULT"
            class="w-h96 mr32 radius-circle"
            style="border: 2rpx solid #FF9EA8;"
          />
          <view class="col relative">
            <view
              class="bg-primary radius-12 mb16 fs-22 plr24 l-h48 h48 ellipsis"
              style="max-width:500rpx;"
            >
              {{ asisList[userInfo&&userInfo.levelCode || 0].welcomeText || "欢迎" }}
            </view>
            <image
              :src="IMAGE.MINE_ICN_QIPAO"
              mode="widthFix"
              class="w24 h6 absolute"
              style="top:48rpx;left:24rpx;"
            />
            <view class="fs-22">
              {{ asisList[userInfo&&userInfo.levelCode|| 0].name || "客服" }}
            </view>
          </view>
        </view>
        <view class="row radius-12 hidden mb48 relative" @tap="toChat(asisList[userInfo&&userInfo.levelCode|| 0].name || `客服`)">
          <button
            open-type="contact"
            :session-from="
              `ysf.config=${
                userInfo?ysf[userInfo.levelCode].config:''
              }`
            "
            style="opacity:0;z-index:1;"
            class="w-h-full absolute"
          ></button>
          <view class="flex-1 bg-primary color-gray-simple pl32 l-h64" >
            撩一下你的小助理吧~
          </view>
          <view class="w160 h64 text-center l-h64 bg-pink color-white">
            撩{{ asisList[userInfo&&userInfo.levelCode|| 0].name || "客服 " }}
          </view>
        </view>
        <view class="row pb48">
          <block v-for="(item, idx) in asisList" :key="idx">
            <view
              v-if="idx != (userInfo&&userInfo.levelCode || 0)"
              class="row center-y bg-primary radius-twenty hidden mr32 pr16 relative"
              @tap="toChat(item.name || `客服`)"
            >
              <!-- :session-from="`ysf.config=${ysf[idx].config}|groupid=398881453|staffid=3856743`" -->
              <button
                open-type="contact"
                :session-from="`ysf.config=${ysf[idx].config}`"
                style="opacity:0;z-index:1;"
                class="w-h-full absolute"
              ></button>
              <image
                :src="item.url"
                mode="widthFix"
                class="w-h64 mr16 radius-circle"
              />
              <view class="color-gray mr4 fs-22">
                撩{{ item.name || "客服" }}
              </view>
              <image :src="IMAGE.ARROW_RIGHT" mode="widthFix" class="w24 h32" />
            </view>
          </block>
        </view>
        <view
          v-if="userInfo && cardGuideShow == '1'"
          class="absolute w-h-full"
          style="top:0;left:0;z-index:1;"
          @click="changeShow('cardAsisShow')"
        ></view>
      </view>
    </view>
    <!-- 我的订单 -->
    <view class="pt24 pb40 mb40 mlr32  bg-white radius-12">
      <!-- <view @tap="linkPage('/pages/order/OrderList?type=all')"> -->
      <view
        class="l-h44 mb48 plr32 row space-between"
        @tap="linkPage('orderList', `all`)"
      >
        <view class="fw600">
          我的订单
        </view>
        <view class="fs-22 color-gray mr8">
          查看全部订单
          <image :src="IMAGE.ARROW_RIGHT" mode="widthFix" class="w24 h32" />
        </view>
      </view>
      <view class="row space-between plr8 pb20">
        <!-- <view class="col center-y relative" @tap="linkPage(PAGE_URL.MY_ORDER_LIST,`/pages/order/OrderList?type=notPay`)"> -->
        <view
          style="width:20%;"
          class="col center-y relative"
          @tap="linkPage('orderList', 'notPay')"
        >
          <image :src="IMAGE.MINE_ICON_PAY_2X" class="w-h48 mb16" />
          <text class="fs-22 mt8" style="color:#303133;">待支付</text>
          <text class="integraHarvest" v-if="orderCounts.notPayNum > 0">{{
            orderCounts.notPayNum
          }}</text>
        </view>
        <view
          style="width:20%;"
          class="col center-y relative"
          @tap="linkPage('orderList', `notDelivered`)"
        >
          <image :src="IMAGE.MINE_ICON_DISPATCH_2X" class="w-h48 mb16" />
          <text class="fs-22 mt8" style="color:#303133;">待发货</text>
          <text class="integraHarvest" v-if="orderCounts.notDeliveredNum > 0">{{
            orderCounts.notDeliveredNum
          }}</text>
        </view>
        <view
          style="width:20%;"
          class="col center-y relative"
          @tap="linkPage('orderList', 'unreceived')"
        >
          <image :src="IMAGE.MINE_ICON_LOGISTICS" class="w-h48 mb16" />
          <text class="fs-22 mt8" style="color:#303133;">待收货</text>
          <text class="integraHarvest" v-if="orderCounts.unreceivedNum > 0">{{
            orderCounts.unreceivedNum
          }}</text>
        </view>
        <view
          style="width:20%;"
          class="col center-y relative"
          @tap="linkPage('orderList', 'finished')"
        >
          <image :src="IMAGE.MINE_ICON_FINISH" class="w-h48 mb16" />
          <text class="fs-22 mt8" style="color:#303133;">已完成</text>
        </view>
        <view
          style="width:20%;"
          class="col center-y relative"
          @tap="linkPage('returnOrderList', `refund`)"
        >
          <image :src="IMAGE.MINE_ICON_RETURN" class="w-h48 mb16" />
          <text class="fs-22 mt8" style="color:#303133;">退换货</text>
          <text class="integraHarvest" v-if="orderCounts.returnNum > 0">{{
            orderCounts.returnNum
          }}</text>
        </view>
      </view>
    </view>
    <!-- 点击复制 -->
              <!-- <view
            class="col space-between"
            @tap.stop="copyToClipboard(`token:${token} openId:${authUserData.openId}`)"
          >
            <text
              class="fs-mini l-h32 text-center plr12"
              style="color:#72797F;background:rgba(252,238,201,1);border-radius:4rpx;"
              :style="{
                color: userInfo.svip == 1 ? '#DFAD67' : '#72797F',
                background:
                  userInfo.svip == 1 ? 'rgba(252,238,201,1)' : '#DDDDDD',
              }"
              >点击复制token和OpenId</text
            >
          </view> -->

    <!-- 我的服务 -->
    <!-- <view>
      <view class="row space-between center-y plr40 mauto h100 l-h100">
        标题
        <text class="fs14 flex-1 fw600">我的服务</text>
      </view>
      <view class="row mauto pb16 plr20">
        #ifdef H5
        <view
          class="col center-y relative"
          style="padding-right:20rpx;min-width:180rpx;"
          v-if="userInfo && userInfo.svip === 1"
          @tap="linkPage('inviteFans')"
        >
          <image :src="IMAGE.ICON_FAN" class="w-h44" />
          <text class="fs-sm mt8 color-gray">邀请粉丝</text>
        </view>
        #endif
        <view
          class="col center-y relative"
          style="padding-right:20rpx;min-width:180rpx;"
          v-if="userInfo && userInfo.svip === 1"
          @tap="linkPage('material')"
        >
          <image :src="IMAGE.MINE_ICON_PIC" class="w-h44" />
          <text class="fs-sm mt8 color-gray">我的素材</text>
        </view>

        #ifdef H5
        <view
          class="col center-y relative"
          style="padding-right:20rpx; min-width:180rpx;"
          @tap="linkPage('chat')"
        >
          <image :src="IMAGE.MINE_ICON_TALK" class="w-h44" />
          <text class="fs-sm mt8 color-gray">客服</text>
        </view>
        #endif
        #ifdef MP-WEIXIN
        <block v-if="token">
          <button
            class="col center-y relative p0 m0 bg-white"
            style="padding-right:20rpx !important;min-width:180rpx;"
            :session-from="ysf.config"
            open-type="contact"
          >
            <image :src="IMAGE.MINE_ICON_TALK" class="w-h44" />
            <text class="fs-sm mt8 color-gray l-h32">客服</text>
          </button>
        </block>
        <block v-else>
          <view
            class="col center-y relative"
            style="padding-right:20rpx; min-width:180rpx;"
            @tap="linkPage('chat')"
          >
            <image :src="IMAGE.MINE_ICON_TALK" class="w-h44" />
            <view class="fs-sm mt8 color-gray">客服</view>
          </view>
        </block>
        #endif
      </view>
    </view> -->
    <!-- 精彩好文 -->
    <!-- <view class="bg-white">
      <view class="row space-between center-y plr40 mb16 mauto h100 l-h100">
        <text class="fs14 flex-1 fw600">精彩好文</text>
      </view>
      <view class="col plr40 mb20" v-for="(item, n) in recommendList" :key="n">
        <home-info-card
          :article-id="item.id"
          :article-name="item.articleName"
          :jump-type="item.jumpType || 'null'"
          :jump-source-id="item.jumpSourceId || 'null'"
          :img-url="item.articleImgVoList.find((e) => e.cover === 1).url"
          :is-video="item.type"
          @buy-tap="buyTap"
        />
      </view>
      <view class="fs-sm color-gray text-center ptb20">我是有底线的</view>
    </view> -->
    <!-- 授权弹窗 -->
    <van-popup
      :show="authPopup"
      position="bottom"
      round
      :close-on-click-overlay="true"
      @click-overlay="closePopup()"
    >
      <auth-popup @close-popup="closePopup" @reload="reload" />
    </van-popup>

    <!-- 升降级弹框 -->
    <van-popup
      :show="token && cardGuideShow == '0' && returnPopup"
      :close-on-click-overlay="true"
      custom-style="background: transparent"
    >
      <view class="bg-white-12 hidden center-x mt88">
        <view>
          <image
            :src="
              userDataText.preLevelCode == 2
                ? IMAGE.ICON_GOLD_LEAVE
                : IMAGE.ICON_SILVER_LEAVE
            "
            mode="widthFix"
            style="width:608rpx;"
          />
        </view>
        <view class="fw600 fs-lg-add pt20 pb16 plr80">{{
          userDataText.title
        }}</view>
        <view
          class="color-gray fs-sm-add l-h44 plr48 text-left"
          v-for="(item, idx) in userDataText.content"
          :key="idx"
          >{{ item }}</view
        >
        <view
          class="bg-pink radius-sm color-white center mauto h80 l-h80 w256 mtb48 relative"
          @tap="toChat(prevAsis)"
          >挽回{{ prevAsis }}
          <!-- #ifdef MP-WEIXIN -->
          <button
            :session-from="
              `ysf.config=${
                ysf[userDataText.preLevelCode]&&ysf[userDataText.preLevelCode].config
              }`
            "
            open-type="contact"
            style="opacity:0;z-index:1;top:0;left:0;"
            class="w-h-full absolute"
          ></button>
          <!-- #endif -->
        </view>
      </view>
      <view class="text-center mt50"
        ><image
          :src="IMAGE.ICON_CLOSE_WHITE"
          class="w-h80"
          @tap="closePopup('forGotHer')"
      /></view>
    </van-popup>
  </view>
</template>

<script>
import BaseTitle from "_c/BaseTitle";
import HomeInfoCard from "_c/HomeInfoCard";
import CustomNav from "_c/CustomNav";
import AuthPopup from "_c/AuthPopup";
import { getUserAsisList } from "@/api/user";
import { getByUserAndType } from "@/api/tools";
import { copyToClipboard, formatTime } from "@/utils";
import { mapGetters } from "vuex";
import { getRecommendArticle, getLikeArticle } from "@/api/article";
import { getUserOrderCounts } from "@/api/order";
import { getAllCouponByUserId } from "@/api/activity/coupon";
import { getWxPhone } from "@/api/tools";
import { javascriptChannelName } from "@/config";

import { getShareBuyUser } from '@/api/order'

import {
  MINE_ICON_DISPATCH_2X,
  MINE_ICON_FINISH,
  MINE_ICON_LOGISTICS,
  MINE_ICON_PAY_2X,
  MINE_ICON_RETURN,
  MINE_ICON_TALK,
  MINE_ICON_PIC,
  ICON_FAN,
  MINE_SETTING,
  AVATAR_DEFAULT,
  ICON_INVITE,
  ICON_MATERIAL_TOOLS,
  TEMP_GIFT,
  ARROW_RIGHT,
  MINE_ICON_RIGHTS,
  MINE_CARD_IRON,
  MINE_CARD_SILVER,
  MINE_CARD_GOLD,
  MINE_ICN_IRON,
  MINE_ICN_SILVER,
  MINE_ICN_GOLD,
  MINE_ICN_YOUFEI,
  MINE_ICN_ZHULI,
  MINE_ICN_ZHEKOU_ACTIVE,
  MINE_ICN_BAOHE_ACTIVE,
  MINE_ICN_GENGDUO,
  MINE_ICN_QIPAO,
  MINE_CARD_GUIDE,
  MINE_CARD_ASIS,
  MINE_CARD_GUIDE_RECOMMEND,
  ICON_CLOSE_WHITE,
  ICON_GOLD_LEAVE,
  ICON_SILVER_LEAVE,
} from "@/imageConfig";

export default {
  name: "mine",
  components: { BaseTitle, HomeInfoCard, CustomNav, AuthPopup },
  data() {
    return {
      IMAGE: {
        MINE_ICON_DISPATCH_2X,
        MINE_ICON_FINISH,
        MINE_ICON_LOGISTICS,
        MINE_ICON_PAY_2X,
        MINE_ICON_RETURN,
        MINE_ICON_TALK,
        AVATAR_DEFAULT,
        ICON_INVITE,
        ICON_MATERIAL_TOOLS,
        MINE_SETTING,
        TEMP_GIFT,
        ARROW_RIGHT,
        MINE_ICON_RIGHTS,
        MINE_CARD_IRON,
        MINE_ICON_PIC,
        MINE_CARD_SILVER,
        MINE_CARD_GOLD,
        ICON_FAN,
        MINE_ICN_IRON,
        MINE_ICN_SILVER,
        MINE_ICN_GOLD,
        MINE_ICN_YOUFEI,
        MINE_ICN_ZHULI,
        MINE_ICN_ZHEKOU_ACTIVE,
        MINE_ICN_BAOHE_ACTIVE,
        MINE_ICN_GENGDUO,
        MINE_ICN_QIPAO,
        MINE_CARD_GUIDE,
        MINE_CARD_ASIS,
        MINE_CARD_GUIDE_RECOMMEND,
        ICON_CLOSE_WHITE,
        ICON_GOLD_LEAVE,
        ICON_SILVER_LEAVE,
      },
      orderCounts: {}, // 订单数量
      couponList: [], // 优惠券列表
      likeNum: 0,
      recommendNum:0, // 推荐
      advertising: null, // 广告位
      authPopup: false,
      returnPopup: false,
      ysf: [], //发给七鱼客服信息
      rights: [
        //会员权益
        {
          name: "专属助理",
          icon: MINE_ICN_ZHULI,
        },
        {
          name: "每月宝盒",
          icon: MINE_ICN_BAOHE_ACTIVE,
        },
        {
          name: "会员折扣",
          icon: MINE_ICN_ZHEKOU_ACTIVE,
        },
        {
          name: "全场包邮",
          icon: MINE_ICN_YOUFEI,
        },
        {
          name: "更多权益",
          icon: MINE_ICN_GENGDUO,
        },
      ],
      asisList: [],
      zActive: true,
      cardAsisShow: false, //助理指导图片
      userData: {}, //用户最新消息
      userDataText: {
        preLevelCode: "0",
      }, //用户最新内容
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "userInfo",
      "authUserData",
      "shareUserId",
      "navBarHeight",
      "menuTop",
      "cardGuideShow",
      "cardGuideRecomendShow"
    ]),
    //挽回客服
    prevAsis() {
      let prevAsis = this.asisList.find(
        (item) => item.userType == this.userDataText.preLevelCode
      );
      if (prevAsis) {
        return prevAsis.name;
      }
      return "客服";
    },
  },
  onLoad() {

  },
  onShow() {
    if (!this.token) {
      this.authPopup = true;
    } else {
      this.authPopup = false;
    }
    this.init();
  },
  methods: {
    init() {
      if (this.token) {
        // 刷新用户信息
        this.fetchUserInfo();
        // 订单数量统计
        this.fetchOrderCounts();
        // 优惠卷数量
        this.fetchCouponCounts();
        //喜欢
        this.fetchLikeArticle();
        //获取用户最新消息
        this.fetchByUserAndType();
        // 获取推荐数量
        this.fetchBuyUsers();
      }
      this.fetchUserAsisList();
    },

    // 获取用户信息
    fetchUserInfo() {
      this.$store.dispatch("getUserInfo").then((data) => {
        console.log("用户信息", data, data.shareCode, data.avilableScore);
      });
    },

    // 获取推荐数量
    fetchBuyUsers() {
      getShareBuyUser().then(res => {
          this.recommendNum = res.data.length;
        });
    },
    //获取用户最新消息
    fetchByUserAndType() {
      getByUserAndType({ userId: this.userInfo.id }).then((res) => {
        console.log(res);
        if (res.data) {
          //降级
          if (res.data.bizType == "2") {
            // 刷新用户信息
            this.fetchUserInfo();
            this.userData = res.data;
            this.userDataText = JSON.parse(this.userData.text);
            this.returnPopup = true;
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
          console.log(this.asisList);
          if (this.userInfo && this.userInfo.id) {
            this.asisList.forEach((item) => {
              this.ysf.push({
                config: JSON.stringify({
                  uid: this.userInfo.id, // 用户唯一标识
                  level: 1, // vip等级
                  data: JSON.stringify([
                    {
                      key: "real_name",
                      label: "昵称",
                      value: `${item.name}-${this.userInfo.nickName}-${this.userInfo.levelName}`,
                    },
                    {
                      key: "mobile_phone",
                      label: "手机号",
                      value: this.userInfo.mobile,
                    },
                    { key: "email", label: "邮箱", value: "" },
                    {
                      key: "reg_date",
                      label: "创建时间",
                      value: formatTime(this.userInfo.createdTime,'Y/M/D h:m:s')
                    },
                    {
                      key: "avatar",
                      label: "头像",
                      value: this.userInfo.headImgUrl,
                    },
                  ]),
                }),
              });
            });
          } else {
            this.asisList.forEach((item) => {
              this.ysf.push({
                config: JSON.stringify({
                  uid: "0", // 用户唯一标识
                  level: 1, // vip等级
                  data: JSON.stringify([
                    {
                      key: "real_name",
                      label: "昵称",
                      value: `铁卡-未登录用户-${item.name}`,
                    },
                    { key: "mobile_phone", label: "手机号", value: "" },
                    {
                      key: "reg_date",
                      label: "创建时间",
                      value: "",
                    },
                  ]),
                }),
              });
            });
          }
          console.log("this.ysf========================", this.ysf);
        }
      });
    },
    // 获取订单数量
    fetchOrderCounts() {
      getUserOrderCounts().then((res) => {
        console.log("订单统计", res.data);
        this.orderCounts = res.data;
      });
    },
    // 获取喜欢数
    fetchLikeArticle() {
      getLikeArticle().then((res) => {
        if (res.resInfo == "成功") {
          this.likeNum = res.data;
          console.log(this.likeNum);
        }
      });
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
    onErrorClick() {
      this.error = false;
      this.fetchRecommendArticle();
    },
    // 点击广告位
    onAdvertisingClick() {
      let sourcesType = this.advertising.resourcesType;
      let sourceId = this.advertising.sourceId;

      if (sourcesType === 1 && sourceId) {
        // 文章详情
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/article/index?id=${sourceId}`,
        });
        // #endif
        // #ifdef H5
        window[javascriptChannelName].postMessage(
          JSON.stringify({ method: "TO_ARTICLE", data: { id: sourceId } })
        ); // 文章详情
        // #endif
      } else if (sourcesType === 2 && sourceId) {
        // 商品详情
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/spu/index?spuId=${sourceId}`,
        });
        // #endif
        // #ifdef H5
        window[javascriptChannelName].postMessage(
          JSON.stringify({
            method: "TO_GOODS_DETAIL",
            data: { spuId: sourceId },
          })
        ); // 商品详情
        // #endif
      } else if (sourcesType === 3 && sourceId) {
        // 邀请任务
        // #ifdef MP-WEIXIN
        uni.showToast({
          title: "更多功能请在App上使用",
          duration: 2000,
          icon: "none",
        });
        // #endif
        // #ifdef H5
        window[javascriptChannelName].postMessage(
          JSON.stringify({ method: "TO_TASK", data: { id: sourceId } })
        );
        // #endif
      } else if (sourcesType === 4 && sourceId) {
        // 限时限价活动商品列表
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/activity/Goods?activityId=${sourceId}&type=3`,
        });
        // #endif
        // #ifdef H5
        window[javascriptChannelName].postMessage(
          JSON.stringify({ method: "ACTIVITY_GOODS", data: { id: sourceId } })
        ); // 限时购
        // #endif
      } else if (sourcesType === 10) {
        // 优惠券活动页
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/activity/Happiness`,
        });
        // #endif
        // #ifdef H5
        window[javascriptChannelName].postMessage(
          JSON.stringify({ method: "THANKS_GIVING" })
        ); // 感恩活动
        // #endif
      } else {
        // #ifdef MP-WEIXIN
        uni.showToast({
          title: "更多功能请在App上使用",
          duration: 2000,
          icon: "none",
        });
        // #endif
      }
    },

    linkPage(routeName, query) {
      console.log("我进来了===== ", routeName, query);
      // #ifdef H5
      let appMap = {
        userInfo: { method: "MY_USER_INFO" },
        assets: { method: "MY_ASSERTS" },
        setting: { method: "MY_SETTING" },
        orderList: { method: "MY_ORDER_LIST", data: { type: query } },
        integral: { method: "MY_INTEGRAL", data: { type: query } },
        couponList: { method: "MY_COUPON" },
        // favorite: { method: "MY_FAVORITE", data: { total: query } },
        recommendBuy: { method: "MY_RECOMMEND", data: { total: query } },
        returnOrderList: {
          method: "MY_RETURN_ORDER_LIST",
          data: { type: query },
        },
        material: { method: "MY_MATERIAL" },
        chat: { method: "MY_CHAT" },
        shareCode: { method: "SHARE_CODE", data: { shareCode: query } },
        inviteFans: { method: "INVITE_FANS" },
      };
      window[javascriptChannelName].postMessage(
        JSON.stringify(appMap[routeName])
      );
      // #endif

      // #ifdef MP-WEIXIN
      let map = {
        userInfo: this.$pageUrl.MY_USER_INFO,
        assets: this.$pageUrl.MY_ASSERTS,
        setting: this.$pageUrl.MY_SETTING, // 设置页
        orderList: `${this.$pageUrl.MY_ORDER_LIST}?type=${query}`,
        integral: `${this.$pageUrl.MY_INTEGRAL}?type=${query}`,
        couponList: `${this.$pageUrl.MY_COUPON}?fromPage=Mine`,
        // favorite: `${this.$pageUrl.MY_FAVORITE}?total=${query}`,
        recommendBuy: `${this.$pageUrl.MY_RECOMMEND}?total=${query}`,
        returnOrderList: `${this.$pageUrl.MY_RETURNORDER_LIST}?type=${query}`,
        material: this.$pageUrl.MY_MATERIAL,
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
    toLogin() {
      uni.navigateTo({
        url: `/pages/login/Phone?from=mine`,
      });
    },
    onInviteFans() {
      uni.showToast({
        title: "更多功能请在App上体验",
        duration: 2000,
        icon: "none",
      });
    },
    goVip() {

      // #ifdef MP-WEIXIN
     if (!this.token) {
        this.authPopup = true;
      } else {
        uni.navigateTo({
          url: "/pagesA/vip/index",
        });
      }
      // #endif
      // #ifdef H5
       this.$flutter({ method: 'MY_VIP_INFO'})
      // #endif
    },
    closePopup(type) {
      if (type == "forGotHer") {
        this.returnPopup = false;
      } else {
        console.log(this.authPopup);
        this.authPopup = false;
      }
    },
    changeShow(type) {
      console.log(type);
      if(type == "cardGuideRecomendShow") {
        this.zActive = true;
        this.$store.commit("CLOSE_CARDGUIDE_RECOMMEND");
      }else if (type == "cardGuideShow") {
        this.cardAsisShow = true;
        this.zActive = false;
      } else {
        this.$store.commit("CLOSE_CARDGUIDE_STATE");
        this.cardAsisShow = false;
      }
    },
    //跳转到七鱼客服
    jump2qiyu() {
      uni.navigateTo({
        url: this.$pageUrl.QIYU,
      });
    },

    toChat(type){
      console.log("我跳转进来了。。。。",type);
      // #ifdef H5
      this.$flutter({ method: 'MY_CHAT', data: { nickName: type } })
      // this.$flutter({ method: 'TO_GOODS_DETAIL', data: { spuId: item.busId } })
      // #endif
    },
    //重新加载页面
    reload() {
      this.init();
    },
    copyToClipboard,
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
    // #ifdef H5
    this.$flutter({method:'REFRESH_INFO'})
    // #endif

    setTimeout(() => {
      console.log('下拉刷新') 
      uni.stopPullDownRefresh()
    }, 1500);
  },
};
</script>

<style lang="scss" scoped>
.customer-btn {
  width: 44rpx;
  height: 40rpx;
  background-size: 100% 100%;
  margin-right: 20rpx;
  display: inline-block;
  padding: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
}
.mineHead {
  position: relative;
  .mineHeadTop {
    position: absolute;
    top: 10px;
    width: 92%;
    left: 4%;
    display: flex;
    // justify-content: space-between;
    justify-content: flex-end;
  }
}
.integral {
  width: 100%;
  display: flex;
  align-items: center;
}
.solidBottomPx {
  border-bottom: 10px solid #f2f4fa;
}
.integraHarvest {
  position: absolute;
  top: -18rpx;
  right: 22rpx;
  background: #ff9ea8;
  border-radius: 50%;
  color: white;
  font-size: 22rpx;
  width: 32rpx;
  height: 32rpx;
  font-weight: 600;
  line-height: 32rpx;
  text-align: center;
  border: 2rpx solid #ff9ea8;
}
.fs-26 {
  font-size: 26rpx;
}
.inviteCode {
  line-height: 60rpx;
  background: rgba(255, 209, 0, 0.2);
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: rgba(153, 89, 0, 1);
  height: 60rpx;
  padding: 0 40rpx;
  text-align: center;
  float: right;
  position: absolute;
  right: 30rpx;
}
.award {
  line-height: 60rpx;
  background: rgba(255, 209, 0, 1);
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 600;
  height: 60rpx;
  padding: 0 40rpx;
  text-align: center;
  float: right;
  position: absolute;
  right: 30rpx;
}
.login-btn {
  background-color: #07c160;
  color: #ffffff;
  font-size: 34rpx;
  border-radius: 12px;
  height: 104rpx;
  line-height: 104rpx;
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
.radius-12 {
  border-radius: 12rpx;
}
.card-btn-bg {
  background: rgba(255, 255, 255, 0.5);
}
.zActive {
  z-index: 9999;
}
/deep/ .van-popup {
  // background-color: transparent;
}
/deep/ .bg-white-12 {
  background-color: #ffffff !important;
  border-radius: 12rpx;
}
</style>
