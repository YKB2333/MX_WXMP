<template>
  <view id="confirm-order" class="min-h-full bg-primary" v-show="!isLoading">
    <!-- 默认goods进入显示 -->
    <!-- 有地址 -->
    <view v-if="orderData.defaultUserAddress" @tap="onAddress">
      <current-address
        :name="orderData.defaultUserAddress.consignee"
        :tel="orderData.defaultUserAddress.mobile"
        :address="address"
        :is-default="orderData.defaultUserAddress.addressFlag"
      />
    </view>
    <!-- 无地址时显示输入 -->
    <view v-else class="plr30 pb30 bg-white">
      <input
        placeholder="收件人"
        class="ptb30 hairline-bottom"
        v-model="addressForm.username"
      />
      <input
        placeholder="手机号码"
        class="ptb30 hairline-bottom"
        v-model="addressForm.phone"
      />
      <!-- <picker mode="region" :value="addressForm.region" @change="onSelectAddressChange">
        <view class="ptb30 hairline-bottom row center-y space-between">
          <text v-if="addressForm.region.length">{{ addressForm.region.join('-') }}</text>
          <text v-else class="color-gray">所在地区</text>
          <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
        </view>
      </picker>-->
      <view
        class="ptb30 hairline-bottom row center-y space-between"
        @tap="showAddressPicker"
      >
        <text v-if="addressForm.region.length">{{
          addressForm.region.join("-")
        }}</text>
        <text v-else class="color-gray">所在地区</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>

      <textarea
        placeholder="详细收货地址：如道路、门牌号、小区、楼栋号等"
        class="w-full h200 ptb30"
        v-model="addressForm.detailAddress"
        :maxlength="60"
        @input="onInput"
      />
      <view class="row flex-end color-gray">{{ inputLength }}/60</view>
      <view
        class="bg-pink color-white w500 h80 l-h80 text-center mauto fw600 radius-round mt30"
        @click="onSaveAddress"
        >保存</view
      >
    </view>
    <!-- 商品 -->
    <view class="plr20 bg-white mt20">
      <view
        class="ptb30 hairline-bottom"
        v-for="(sku, i) in orderData.skus"
        :key="i"
      >
        <view class="row hidden">
          <view
            class="relative goods-img-border mr30"
            @tap="jump2spu(sku.spuId)"
          >
            <image :src="sku.skuMasterImageUrl" class="w-h140" />
            <view class="activedCart-tag" v-if="sku.activityName">{{
              sku.activityName
            }}</view>
          </view>
          <view class="flex-1 col space-between hidden">
            <view>
              <view class="fw600 ellipsis">{{ sku.spuName }}</view>
              <view class="fs-sm color-gray mt10">{{ sku.ownSpec }}</view>
            </view>
            <view class="row space-between center-y">
              <view class="row flex-start center-y mt6">
                <view class="row center-y">
                  <image
                    v-if="userInfo.levelCode > 0 && userInfo.levelCode == 1 && !orderData.cross"
                    class="w-h32 mr8"
                    :src="IMAGE.GOODS_SPU_SILVER"
                  />
                  <image
                    v-if="userInfo.levelCode > 0 && userInfo.levelCode == 2 && !orderData.cross"
                    class="w-h32 mr8"
                    :src="IMAGE.GOODS_SPU_GOLD"
                  />
                  <text class="color-red fs-lg fw600" style="margin: 8rpx 0;"
                    >¥ {{ sku.price | formatMoney }}</text
                  >
                </view>
                <!-- <view
                  class="fs-sm color-red ml8 border-red-cat mt4"
                  v-if="sku.activityDiscountSku && sku.activityDiscountSku.activityName"
                >{{ sku.activityDiscountSku.activityName }}</view> -->
              </view>
              <text>x{{ sku.quantity }}</text>
            </view>
          </view>
        </view>
        <block v-if="sku && sku.activityName">
          <view class="row space-between mt2">
            <text class="fs-mini color-gray">{{
              sku.activityName && orderData.cross == 0
                ? "*活动商品不支持使用优惠券和喵豆"
                : ""
            }}</text>
            <text></text>
            <!-- <text>包邮</text> -->
          </view>
        </block>
        <!-- <block v-else>
          <view
            class="color-red fs-sm mt30"
            v-if="!isDeliver(sku) && orderData.defaultUserAddress"
          >收货地址不在配送区域内：{{sku.deliverRegionTpl.name}}</view>
          <view
            class="row flex-end"
            v-if="isDeliver(sku)"
          >共{{sku.weight * sku.quantity / 10 | formatMoney}}kg</view>
        </block> -->
      </view>
    </view>
    <!-- 商品金额 -->
    <view class="mt20 plr30 bg-white">
      <view
        @tap="onCoupon"
        class="row space-between hairline-bottom ptb30 center-y"
      >
        <text class="fw600">优惠券</text>
        <view>
          <text v-if="orderData.couponAmount > 0" class="pr12"
            >-¥{{ orderData.couponAmount | formatMoney }}</text
          >
          <!-- <text v-else class="pr12 color-gray-simple"
            >无可用</text
          > -->
          <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
        </view>
      </view>
      <view class="ptb30" v-if="orderData.integral">
        <view class="row space-between center-y">
          <view>
            <text class="fw600">
              喵豆
              <text class="fs-mini fw400 color-gray-simple"
                >(共{{ orderData.totalUserIntegral }}喵豆，本单最高可使用{{
                  maxUsableIntegral
                }}喵豆)</text
              >
              <!-- 最高抵扣¥{{ maxUsableIntegral | formatMoney }} -->
            </text>
            <image
              :src="IMAGE.QUESTION"
              class="w-h30 ml10"
              @tap="showIntegralRule"
            />
          </view>
          <switch
            :checked="useIntegral"
            :disabled="orderData.totalUserIntegral<100"
            @change="usePointsHandler"
            color="#7AD071"
            @tap="consIntegral"
          />
        </view>
      </view>
      <view v-show="useIntegral">
        <view class="row space-between center-y">
          <view class="row center-y mb10">
            <text class="fw600">抵扣</text>
            <my-stepper
              v-model="currentUsebleIntegral"
              :min="0"
              :max="maxUsableIntegral"
              :step="orderData.integralEachScale"
              @icon-change="debounceFetchOrderInfo"
            />
          </view>
          <view>-¥{{ currentUsebleIntegral | formatMoney }}</view>
        </view>
        <!-- <view
          class="color-gray fs-mini pb30 pt16"
        >，抵扣¥{{ orderData.maxIntegral | formatMoney }}</view>-->
      </view>
      <!-- <view class="row space-between hairline-bottom ptb30 center-y"> -->
      <!-- @tap="switchFreigh" -->
      <!-- <view class="row center-y"> -->
      <!-- <text>物流配送：{{orderData.totalFreightContent}}</text> -->
      <!-- <image :src="IMAGE.QUESTION" class="w-h30 ml10" /> -->
      <!-- </view> -->
      <!-- <text>+¥{{isFreeShipping ? 0 : freightTotalPrice | formatMoney}}</text> -->
      <!-- </view> -->
    </view>
    <view class="mt20 plr30 bg-white">
      <view class="row space-between hairline-bottom ptb30 center-y">
        <text class="fw600">应付总额</text>
        <text>+¥{{ orderData.goodsSalesTotalAmount | formatMoney }}</text>
      </view>
      <view
        class="row space-between hairline-bottom ptb30 center-y"
      >
        <text class="fw600">
          累计抵扣
          <text class="fs-mini fw400 color-gray-simple">（优惠券&喵豆抵扣）</text>
        </text>
        <text
          >-¥{{
            (orderData.useIntegralAmount + orderData.couponAmount) | formatMoney
          }}</text
        >
      </view>
      <!-- <view v-if="orderData.cross==0" class="row space-between hairline-bottom ptb30 center-y">
        <view>
          <text>达人立减</text>
          <image :src="IMAGE.QUESTION" class="w-h30 ml10" @tap="showSvipRule" />
        </view>
        <text>-¥{{orderData.actualObtainAmount | formatMoney}}</text>
      </view> -->
    </view>

    <!-- 发票 -->
    <!-- <view class="mt20 row space-between bg-white plr30 ptb34" @tap="showInvoicePopup">
      <text>发票</text>
      <view>
        <text class="pr10">不开发票</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>
    </view>-->
    <!-- 底部栏 -->
    <view class="bottom-bar row bg-white">
      <view class="flex-1">
        <view class="h55 l-h80">
          <text class="fw600"
            >实付：<text class="color-pink">¥ {{ orderData.actualTotalAmount | formatMoney }}</text></text
          >
          <!-- <text class="fw500 fs-normal" style="color:#9EA0A4;"
            >(共{{ orderData.skus.length }}件)</text
          > -->
        </view>
        <view class="fw500 fs-sm h55 color-gray"
          >共{{ orderData.skus.length||0 }}件商品</view
        >
      </view>
      <!-- disabled-btn -->
      <template v-if="isCheck">
        <view
          class="fw600 text-center bg-pink color-white"
          style="width:226rpx;height:88rpx;line-height:88rpx;margin:10rpx 20rpx 0 0;border-radius:10rpx;"
          @click="onPay"
        >
          <text>提交订单</text>
        </view>
      </template>
      <template v-else>
        <view
          class="fw600 text-center disabled-btn"
          style="width:226rpx;height:88rpx;background-color: #ffd200;line-height:88rpx;margin:10rpx 20rpx 0 0;border-radius:10rpx;"
        >
          <text>提交订单</text>
        </view>
      </template>
    </view>
    <!-- 运费规则 -->
    <van-popup :show="isFreigh" custom-class="plr40 radius-twenty wpct86">
      <text class="block text-center ptb40 fw14 fw500">运费规则</text>
      <view class="pb40" v-for="item in orderData.freightTplInfos" :key="item">
        <view class="row space-between fs12 color-black">
          <text class="color-gray">{{ item.titel }}</text>
          <text>{{ item.totalWeightConent }}</text>
        </view>
        <view class="row wrap mt38 freigh">
          <image
            :src="img"
            :class="['w-h160  mb36 radius']"
            v-for="img in item.imgs"
            :key="img"
          />
        </view>
      </view>
      <view class="confirmBtn" @tap="switchFreigh">
        <text>知道了</text>
      </view>
    </van-popup>
    <!-- 喵豆规则说明弹窗 -->
    <van-popup
      :show="integralRulePopup"
      close-on-click-overlay
      custom-style="width:80%;border-radius:10px;"
      @click-overlay="integralRulePopup = false"
    >
      <view class="p60">
        <view class="text-center fw600 mb60">喵豆规则</view>
        <view class="mb60">
          <view class="fw600 mb20">使用数量</view>
          <view class="color-gray fs-sm" style="line-height:24px;">
            <text
              >1.{{ integralRuleData.pointDeduction }}喵豆抵扣1元人民币</text
            >
            <br />
            <text
              >2.每次使用喵豆数量为{{
                integralRuleData.eachScale
              }}的整数倍</text
            >
          </view>
        </view>
        <view class="mb60">
          <view class="fw600 mb20">使用条件</view>
          <view class="color-gray fs-sm" style="line-height:24px;">
            <text
              >1.订单金额大于{{
                integralRuleData.sillPrice | formatMoney
              }}元（含）</text
            >
            <br />
            <text
              >2.喵豆抵扣最高不超过每笔订单应付金额的{{
                integralRuleData.salesPercentage
              }}%</text
            >
            <br />
            <text>3.喵豆数量大于{{ integralRuleData.eachScale }}</text>
          </view>
        </view>
        <button
          style="width:80%;border:1px solid #121314;"
          class="radius-round h80 l-h80 color-primary bg-white fw600"
          @tap="integralRulePopup = false"
        >
          知道了
        </button>
      </view>
    </van-popup>
    <!-- 达人立减规则说明弹窗 -->
    <van-popup
      :show="sVipRulePopup"
      close-on-click-overlay
      custom-style="width:80%;border-radius:10px;"
      @click-overlay="sVipRulePopup = false"
    >
      <view class="p60">
        <view class="text-center fw600 mb60">达人立减说明</view>
        <view class="mb40">1.达人专享自购省立减优惠</view>
        <view class="mb60"
          >2.如订单使用优惠券或喵豆，将按比例减少达人立减金额</view
        >
        <button
          style="width:80%;border:1px solid #121314;"
          class="radius-round h80 l-h80 color-primary bg-white fw600"
          @tap="sVipRulePopup = false"
        >
          知道了
        </button>
      </view>
    </van-popup>
    <!-- 地址选择组件 -->
    <address-picker ref="address-picker" @change="onSelectAddressChange" />
    <!-- 发票弹窗 -->
    <van-popup
      :show="invoicePopup"
      position="bottom"
      close-on-click-overlay
      round
      closeable
      @close="closeInvoicePopup"
    >
      <view class="fs-lg fw600 text-center mtb60">开具发票</view>
      <view class="plr30 row space-between">
        <button
          class="invioce-tab-btn"
          :class="{ active: isUseInvoice }"
          @tap="changeUseInvoice(true)"
        >
          电子发票
        </button>
        <button
          class="invioce-tab-btn"
          :class="{ active: !isUseInvoice }"
          @tap="changeUseInvoice(false)"
        >
          不需要发票
        </button>
      </view>
      <view class="mt20 plr30" style="min-height: 30vh;">
        <view v-show="isUseInvoice">
          <view class="row ptb20 hairline-bottom">
            <text class="w150">发票抬头：</text>
            <view class="mr60" @tap="changeInvoiceType('0')">
              <image
                :src="invoice.type === '0' ? IMAGE.RADIO_YES : IMAGE.RADIO_NO"
                class="w-h48 mr10"
              />
              <text>个人</text>
            </view>
            <view @tap="changeInvoiceType('1')">
              <image
                :src="invoice.type === '1' ? IMAGE.RADIO_YES : IMAGE.RADIO_NO"
                class="w-h48 mr10"
              />
              <text>企业</text>
            </view>
          </view>
          <view class="row ptb20 hairline-bottom" v-show="invoice.type === '0'">
            <text class="w150">抬头名称：</text>
            <input
              placeholder="请填写抬头名称："
              v-model="invoice.companyTitle"
              class="flex-1"
            />
          </view>
          <view v-show="invoice.type === '1'">
            <view class="row ptb20 hairline-bottom">
              <text class="w150">企业名称：</text>
              <input
                placeholder="请填写企业名称"
                v-model="invoice.companyName"
                class="flex-1"
              />
            </view>
            <view class="row ptb20 hairline-bottom">
              <text class="w150">税号：</text>
              <input
                placeholder="请输入纳税人识别号"
                v-model="invoice.taxNo"
                class="flex-1"
              />
            </view>
          </view>
          <view class="row ptb20 hairline-bottom">
            <text class="w150">接收邮箱：</text>
            <input
              placeholder="请填写接收发票的邮箱地址"
              v-model="invoice.email"
              class="flex-1"
            />
          </view>
          <view class="ptb20">
            <text class="fs-mini color-gray"
              >注：开票时间为确认收货后30天内，部分特殊商品不支持开票，请谅解。开票金额为实付金额，不含喵豆等扣减金额</text
            >
          </view>
        </view>
      </view>
      <view
        class="bg-white p30"
        style="box-shadow:0px 3px 20px 0px rgba(0, 0, 0, 0.08);"
      >
        <button
          class="bg-theme fw600 radius-round ptb10"
          @tap="onConfirmInvoice"
        >
          确定提交
        </button>
      </view>
    </van-popup>
    <van-popup
      :show="error.resInfo"
      :overlay="false"
      custom-class="errorPopup"
    >
      <view class="p20 color-white fs12" style="background:rgba(0,0,0,0.6);border-radius:10rpx;">
        {{error.resInfo}}
      </view>
    </van-popup>
  </view>
</template>

<script>
import CurrentAddress from "_c/address";

import {
  VIP_PIC,
  ARROW_RIGHT,
  QUESTION,
  RADIO_YES,
  RADIO_NO,
  GOODS_SPU_SILVER,
  GOODS_SPU_GOLD,
} from "@/imageConfig";
import { debounce } from "@/utils";
import { getOrderInfo, createWechatPay } from "@/api/order";
import { updateAddress } from "@/api/user/address";
import { mapGetters } from "vuex";
import AddressPicker from "_c/AddressPicker";
import MyStepper from "_c/MyStepper";
import { getSysdictQuery } from "@/api/tools";

export default {
  name: "ConfirmOrder",
  components: { CurrentAddress, AddressPicker, MyStepper },
  data() {
    return {
      IMAGE: {
        VIP_PIC,
        ARROW_RIGHT,
        QUESTION,
        RADIO_YES,
        RADIO_NO,
        GOODS_SPU_SILVER,
        GOODS_SPU_GOLD,
      },
      inputLength: 0, // 详细地址输入长度
      // 地址表单
      addressForm: {
        username: "",
        phone: "",
        detailAddress: "",
        region: [],
        // region: ['广东省', '广州市', '海珠区'],
        regionDetail: {},
      },
      useIntegral: false, // 使用喵豆开关
      isFreigh: false, // 是否显示运费规则
      orderType: 1, // 订单来源类型，1购物车结算 2立即购买
      orderParam: [], //订单商品明细
      orderData: {
        defaultUserAddress: {},
        totalUserPoint: 0, // 用户总喵豆
        totalDeductionPoint: 0, // 订单可使用喵豆
        integralEachScale: 0, // 喵豆的整倍数使用
        realName: false, // 是否需要实名
        cross:false
      },
      isLoading: true,
      integralRulePopup: false, // 喵豆规则弹窗
      maxUsableIntegral: 0, // 最高可使用喵豆
      currentUsebleIntegral: 0, // 当前选择使用的喵豆
      // 喵豆规则说明
      integralRuleData: {
        pointDeduction: "", // 多少喵豆抵扣1元
        enable: false, // 是否启动抵扣规则
        sillPrice: "", //使用喵豆的销售价格门槛，单位（分），
        salesPercentage: "", // 最大抵扣销售商品的百分比值，e.g. 50%->值为50,
        eachScale: "", // 每次喵豆使用的倍数
      },
      sVipRulePopup: false, // 达人立减规则弹窗
      invoicePopup: false, // 发票弹窗
      isUseInvoice: true, // 是否开票
      invoice: {
        type: "0", // 0个人，1企业
        companyName: "", // 企业名称
        taxNo: "", // 税号
        email: "",
        companyTitle: "",
      },
      realnameFlag: 0,
      couponStatus: true,
      couponUserIds: [], //优惠卷id
      error:{}
    };
  },
  onLoad(options) {
    console.log("onLoad", options);
    this.orderType = options.orderType;
    this.orderParam = options.orderParam;
    if (this.orderType && this.orderParam) {
      // uni.showLoading({ title: "加载中", mask: true });
      this.orderParam = JSON.parse(decodeURIComponent(options.orderParam));
      // 调用后台订单参数
      this.fetchOrderInfo({ useIntegral: true });
    }

    this.$eventHub.$off("changeUserAddress");
    this.$eventHub.$on("changeUserAddress", (_data) => {
      this.changeUserAddress(_data);
    });

    this.$eventHub.$off(this.$eventName.SAVE_REALNAME_SUCCESS);
    this.$eventHub.$on(this.$eventName.SAVE_REALNAME_SUCCESS, (_data) => {
      // console.log('$on', _data)
      this.orderData.realName = false;
    });

    this.$eventHub.$off(this.$eventName.SELECT_COUPON);
    this.$eventHub.$on(this.$eventName.SELECT_COUPON, (id) => {
      console.log("$优惠券id", id);
      this.couponUserIds = [];
      this.couponStatus = true;
      if (id) {
        this.couponUserIds.push(id);
      } else {
        this.couponStatus = false;
      }
      console.log("=======", this.couponUserIds);
      this.fetchOrderInfo({ showLoading: false, useIntegral: true });
    });
  },
  onShow() {
    if (this.realnameFlag === 1) {
      console.log("实名");
      this.showRealnameModal();
    }
    console.log("123", this.authUserData, this.userInfo);
  },
  computed: {
    ...mapGetters(["authUserData", "token", "userInfo","shareUserId"]),
    address() {
      return this.orderData.defaultUserAddress
        ? this.orderData.defaultUserAddress.provinceName +
            this.orderData.defaultUserAddress.cityName +
            this.orderData.defaultUserAddress.districtName +
            this.orderData.defaultUserAddress.address
        : "";
    },
    isCheck() {
      let isOk = false;
      //检查订单是否可以点击提交订单 TODO
      //1，判断收货地址有没填写
      if (
        this.orderData.defaultUserAddress &&
        this.orderData.defaultUserAddress.id
      ) {
        //2，判断是否可以配送
        // if (this.isFreeShipping) {
        //   isOk = true;
        // } else {
        //   for (let i in this.orderData.skus) {
        //     if (!this.isDeliver(this.orderData.skus[i])) {
        //       return isOk;
        //     }
        //   }
        isOk = true;
        // }
      }
      return isOk && !this.orderData.realName;
    },
    totalMoney() {
      return (
        this.orderData.salesTotalPrice +
        this.orderData.logisticsFee -
        (this.useIntegral ? this.integerMoney * 100 : 0)
        //  this.orderData.salesTotalPrice +
        // (this.isFreeShipping ? 0 : this.freightTotalPrice) -
        // (this.useIntegral ? this.integerMoney * 100 : 0)
      );
    },
    integerMoney() {
      try {
        return this.currentUsebleIntegral / this.orderData.pointScale;
      } catch (err) {
        console.log(err);
      }
      return 0;
    },
    isFreeShipping() {
      let checkFree = false; //是否包邮
      if (
        !this.orderData.defaultUserAddress ||
        !this.orderData.defaultUserAddress.id
      )
        return checkFree;
      let subtractTotal =
        this.orderData.salesTotalPrice -
        (this.useIntegral ? this.integerMoney * 100 : 0);
      let freeShippingTpl = this.orderData.skus[0].freeShippingTpl;
      if (freeShippingTpl) {
        //检查是否包邮，包邮扣减规则
        for (let i in freeShippingTpl.freeShippingRegionInfoList) {
          let cityIds = freeShippingTpl.freeShippingRegionInfoList[
            i
          ].cityId.split(",");
          if (
            cityIds.includes(this.orderData.defaultUserAddress.cityId) &&
            subtractTotal >= freeShippingTpl.freeShippingRegionInfoList[i].fee
          ) {
            checkFree = true;
          }
        }
      }
      console.log(checkFree);
      return checkFree;
    },
    // freightTotalPrice() {
    //   //实时计算运费
    //   console.info("开始实时计算运费");
    //   let total = 0;
    //   let deliverRegionTplList = [];
    //   if (this.orderData && this.orderData.skus) {
    //     this.orderData.skus.forEach(sku => {
    //       let result = this.checkDeliver(sku);
    //       console.info("检查商品" + sku.spuName, result);
    //       if (result.isDeliver) {
    //         console.info(
    //           "检查商品" + sku.spuName,
    //           "可配送",
    //           deliverRegionTplList.length
    //         );
    //         let isExists = false;
    //         if (deliverRegionTplList.length) {
    //           for (let j in deliverRegionTplList) {
    //             if (
    //               deliverRegionTplList[j].deliverRegionTplInfo.id ==
    //               result.deliverRegionTplInfo.id
    //             ) {
    //               deliverRegionTplList[j].deliverRegionTpl.weight +=
    //                 result.deliverRegionTpl.weight;
    //               deliverRegionTplList[j].deliverRegionTpl.quantity +=
    //                 result.deliverRegionTpl.quantity;
    //               console.info("检查商品" + sku.spuName, "存在相同计算结果");
    //               isExists = true;
    //             }
    //           }
    //         }
    //         if (!isExists) {
    //           console.info(
    //             "检查商品" + sku.spuName,
    //             "当前没有计算结果，初始写入",
    //             result
    //           );
    //           deliverRegionTplList.push(result);
    //         }
    //       } else {
    //         console.info("检查商品" + sku.spuName, "不可配送");
    //       }
    //     });
    //     for (let i in deliverRegionTplList) {
    //       total += this.calculate(
    //         deliverRegionTplList[i].deliverRegionTpl,
    //         deliverRegionTplList[i].deliverRegionTplInfo
    //       );
    //     }
    //   }
    //   return total;
    // }
  },
  methods: {
    showRealnameModal() {
      if (this.orderData.realName) {
        uni.showModal({
          content: "请填写实名信息",
          showCancel: false,
          confirmText: "去填写",
          success: (t) => {
            if (t.confirm) {
              // console.log('用户点击确定')
              this.realnameFlag = 1;
              uni.navigateTo({
                url: `/pagesA/user-info/Realname?needCallback=${true}`,
              });
            }
          },
        });
      }
    },
    showAddressPicker() {
      this.$refs["address-picker"].show();
    },
    onInput(e) {
      // console.log(e)
      this.inputLength = e.detail.value.length;
    },
    // 保存地址
    onSaveAddress() {
      console.log(this.addressForm);
      uni.showLoading({ title: "加载中", mask: true });
      updateAddress("add", {
        provinceId: this.addressForm.regionDetail.code[0],
        provinceName: this.addressForm.regionDetail.value[0],
        cityId: this.addressForm.regionDetail.code[1],
        cityName: this.addressForm.regionDetail.value[1],
        districtId: this.addressForm.regionDetail.code[2],
        districtName: this.addressForm.regionDetail.value[2],
        address: this.addressForm.detailAddress,
        consignee: this.addressForm.username,
        mobile: this.addressForm.phone,
        addressFlag: 0,
      })
        .then((res) => {
          console.info("updateAddress=>", res);
          this.orderData.defaultUserAddress = res.data;
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 确定区域时触发
    onSelectAddressChange(data) {
      this.addressForm["region"] = data.value;
      this.addressForm["regionDetail"] = data;
    },
    // 调用后台订单参数
    fetchOrderInfo(obj) {
      let pages = getCurrentPages()
      if (!obj || obj.showLoading) {
        uni.showLoading({ title: "加载中", mask: true });
      }
      getOrderInfo({
        useIntegral: this.useIntegral ? this.currentUsebleIntegral : 0, //使用喵豆/喵豆的数量
        integral: this.useIntegral, //下单是否使用喵豆/喵豆
        coupon: this.couponStatus, //下单是否使用优惠券
        cart: this.orderType == 1 ? true : false, //是否通过购物车下单，true=购物车下单；false=立即购买
        addressId: this.orderData.defaultUserAddress.id,
        orderPayChannel: 1,
        couponUserIds: this.couponUserIds,
        skus: this.orderParam,
        clientPlatform:'miniapp',  // 判断来源是小程序还是app
      })
        .then((res) => {
          console.info(res);
          this.orderData = res.data;
          // 计算可使用的最高喵豆
          if (obj && obj.useIntegral) {
            this.initMaxUsableIntegral();
          }
          if (this.orderData.skus) {
            this.orderData.skus.forEach((sku) => {
              if (sku.ownSpec) {
                let skuOwnSpec = JSON.parse(sku.ownSpec);
                sku.ownSpec = "";
                for (let key in skuOwnSpec) {
                  sku.ownSpec += skuOwnSpec[key] + ";";
                }
                sku.ownSpec = sku.ownSpec.substring(0, sku.ownSpec.length - 1);
              } else {
                sku.ownSpec = "";
              }
            });
          }
          this.showRealnameModal();
          console.log("res.data.resCode",res.data.resCode)
        })
        .catch((err) => {
          this.error = err
          // console.error(err);
          // if(err.resCode== "99992"){
          //     console.log(123)
            // uni.showToast({
            //   title: err.resInfo,
            //   duration: 100000,
            //   icon: "none",
            // });
            setTimeout(()=>{
              uni.navigateBack()
            },4000)
          // }
        })
        .finally(() => {
          this.isLoading = false;
          uni.hideLoading();
        });
    },
    // 调用后台订单参数(防抖)
    debounceFetchOrderInfo: debounce(function() {
      this.fetchOrderInfo();
    }, 800),
    // 支付
    onPay() {
      uni.showLoading({ title: "加载中", mask: true });
      if (!this.authUserData.openId) {
        uni.showModal({
          content: "认证会话丢失",
          showCancel: false,
        });
        return;
      }
      if (this.currentUsebleIntegral == 0) {
        this.useIntegral = false;
      }
      //发起微信小程序支付创建
      let params = {
        useIntegral: this.useIntegral ? this.currentUsebleIntegral : 0,
        integral: this.useIntegral,
        coupon: this.couponStatus,
        cart: this.orderType == 1 ? true : false, //是否通过购物车下单，true=购物车下单；false=立即购买
        addressId: this.orderData.defaultUserAddress.id,
        orderPayChannel: 1,
        couponUserIds: this.couponUserIds,
        weChatMiniOpenId: this.authUserData.openId,
        skus: this.orderParam,
        clientPlatform:'miniapp',  // 判断来源是小程序还是app
      }
      if(this.shareUserId){
        params['shareUserId'] = this.shareUserId;
      }
      createWechatPay(params)
        .then((res) => {
          console.info(res);
          res = res.data;
          // todo ...
          // uni.reLaunch({
          //   url: "/pages/order/OrderList?type=notPay",
          // });
          if (res.type == 2) {
            // uni.reLaunch({
            //   url: '/pages/order/OrderList?type=all'
            // })
            uni.reLaunch({
              url: `/pages/pay/index?id=` + res.orderId,
            });
          } else {
            wx.requestPayment({
              timeStamp: res.paymentObj.timeStamp,
              nonceStr: res.paymentObj.nonceStr,
              package: res.paymentObj.packageValue,
              signType: res.paymentObj.signType,
              paySign: res.paymentObj.paySign,
              success: function(wxRes) {
                console.info("支付成功", wxRes,res);
                uni.reLaunch({
                  url: `/pages/pay/index?id=` + res.orderId,
                });
              },
              fail: function(wxRes) {
                console.info("支付失败", wxRes);
                uni.reLaunch({
                  url: "/pages/order/OrderList?type=notPay",
                });
              },
              complete: function(wxRes) {
                console.info("支付完成", wxRes);
              },
            });
          }
        })
        .catch((err) => {
          console.info(err);
          uni.showModal({
            title: "下单失败",
            content: err.resInfo,
            showCancel: false,
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    //打印积分
    consIntegral(){
      if(this.orderData.totalUserIntegral<100){
        uni.showToast({
        icon: "none",
        title: "您的喵豆已不足100",
        duration: 1500
      })
      }
    },
    // 显示 隐藏 运费规则
    switchFreigh() {
      this.isFreigh = !this.isFreigh;
    },
    // 支付
    onAddress() {
      // const that = this
      // this.$eventHub.$on('changeUserAddress', function (_data) {
      //   that.changeUserAddress(_data)
      // })
      uni.navigateTo({
        url: `/pages/address/AddressList?sourceType=order&addressId=${this.orderData.defaultUserAddress.id}`,
      });
    },
    // 优惠券
    onCoupon() {
      // const that = this
      // this.$eventHub.$on('changeUserAddress', function (_data) {
      //   that.changeUserAddress(_data
      // })
      console.log(this.orderData);
      if (!this.orderData.couponUserIds) {
        this.orderData.couponUserIds = "''";
      }
      let skus = [];
      this.orderData.skus.forEach(item=>{
        if(!item.activity){
          let {id,brandId,categoryId,price,quantity,spuId} = item
          skus.push({skuId:id,brandId,categoryId,price,quantity,spuId})
        }
      })
      uni.navigateTo({
        url: `/pages/coupon/CouponList?couponId=${this.orderData.couponUserIds[0]}&fromPage=comfirmOrder&skus=${JSON.stringify(skus)}`,
      });
    },
    usePointsHandler(obj) {
      this.useIntegral = obj.detail.value;
      this.fetchOrderInfo({ useIntegral: this.useIntegral });
    },
    changeUserAddress(address) {
      console.log("$on", address);
      // this.$eventHub.$off('changeUserAddress')
      this.orderData.defaultUserAddress = address;
    },
    calculate(deliverRegionTpl, deliverRegionTplInfo) {
      let quantity = deliverRegionTpl.quantity;
      let weight = deliverRegionTpl.weight;
      let countType = deliverRegionTpl.countType;
      if (countType == 2) {
        //按件
        if (quantity <= deliverRegionTplInfo.first) {
          return deliverRegionTplInfo.firstFee;
        } else {
          // 2  20 首
          // 3  30 续
          // 7    购买
          // 7 - 2 = 5
          // 5 / 3 = 1.222222222
          // 2 * 30 + 20
          // 超过首件数量 续件计算
          return (
            Math.ceil(
              (quantity - deliverRegionTplInfo.first) /
                deliverRegionTplInfo.continued
            ) *
              deliverRegionTplInfo.continuedFee +
            deliverRegionTplInfo.firstFee
          );
        }
      } else {
        //重量
        if (weight <= deliverRegionTplInfo.first) {
          return deliverRegionTplInfo.firstFee;
        } else {
          // 超过首重续重计算
          return (
            Math.ceil(
              (weight - deliverRegionTplInfo.first) /
                deliverRegionTplInfo.continued
            ) *
              deliverRegionTplInfo.continuedFee +
            deliverRegionTplInfo.firstFee
          );
        }
      }
    },
    isDeliver(sku) {
      let isOk = false;
      return this.checkDeliver(sku).isDeliver;
    },
    checkDeliver(sku) {
      let result = {
        isDeliver: false,
        // freightPrice: 0,
        deliverRegionTplInfo: {},
      };
      if (
        this.orderData.defaultUserAddress &&
        this.orderData.defaultUserAddress.cityId
      ) {
        let deliverRegionTpl = sku.deliverRegionTpl;
        let deliverRegionTplInfoList =
          deliverRegionTpl.deliverRegionTplInfoList;
        for (let i in deliverRegionTplInfoList) {
          let cityIds = deliverRegionTplInfoList[i].cityId.split(",");
          if (cityIds.includes(this.orderData.defaultUserAddress.cityId)) {
            deliverRegionTpl["weight"] = sku.weight;
            deliverRegionTpl["quantity"] = sku.quantity;
            result.isDeliver = true;
            // result.freightPrice = this.calculate(deliverRegionTpl, deliverRegionTplInfoList[i])
            result.deliverRegionTpl = deliverRegionTpl;
            result.deliverRegionTplInfo = deliverRegionTplInfoList[i];
            break;
          }
        }
      }
      return result;
    },
    initMaxUsableIntegral() {
      if (
        this.orderData.maxIntegral >= this.orderData.integralEachScale &&
        this.orderData.maxIntegral >= 100
      ) {
        // 取就近的整百数
        let value = Math.floor(this.orderData.maxIntegral / 100) * 100;
        this.maxUsableIntegral = value;
        this.currentUsebleIntegral = value;
      } else {
        this.maxUsableIntegral = 0;
        this.currentUsebleIntegral = 0;
      }
      console.log("currentUsebleIntegral", this.currentUsebleIntegral);
    },
    // 显示喵豆规则说明弹窗
    async showIntegralRule() {
      try {
        uni.showLoading({ mask: true });

        let a = await getSysdictQuery({
          dictType: "SYSTEM_CONFIG",
          dictKey: "POINT_DEDUCTION",
        });
        let b = await getSysdictQuery({
          dictType: "SYSTEM_CONFIG",
          dictKey: "GOODS_DEDUCTION_RULE",
        });
        console.log(a,b)
        this.integralRuleData.pointDeduction = a.data.dictValue;
        let json = JSON.parse(b.data.dictValue);
        this.integralRuleData.enble = json.enable;
        this.integralRuleData.sillPrice = Number(json.sillPrice);
        this.integralRuleData.salesPercentage = json.salesPercentage;
        this.integralRuleData.eachScale = json.eachScale;
        this.integralRulePopup = true;
      } catch (error) {
        uni.showToast({
          title: "数据请求出错，请重试",
          duration: 2000,
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },
    // 显示喵豆规则说明弹窗
    async showSvipRule() {
      // try {
      //   uni.showLoading({ mask: true });
      //   let a = await getSysdictQuery({
      //     dictType: "SYSTEM_CONFIG",
      //     dictKey: "POINT_DEDUCTION"
      //   });
      //   let b = await getSysdictQuery({
      //     dictType: "SYSTEM_CONFIG",
      //     dictKey: "GOODS_DEDUCTION_RULE"
      //   });
      //   this.integralRuleData.pointDeduction = a.data;
      //   let json = JSON.parse(b.data);
      //   this.integralRuleData.enble = json.enable;
      //   this.integralRuleData.sillPrice = Number(json.sillPrice);
      //   this.integralRuleData.salesPercentage = json.salesPercentage;
      //   this.integralRuleData.eachScale = json.eachScale;
      this.sVipRulePopup = true;
      // } catch (error) {
      //   uni.showToast({
      //     title: "数据请求出错，请重试",
      //     duration: 2000,
      //     icon: "none"
      //   });
      // } finally {
      //   uni.hideLoading();
      // }
    },
    // 显示发票弹窗
    showInvoicePopup() {
      this.invoicePopup = true;
    },
    closeInvoicePopup() {
      this.invoicePopup = false;
    },
    changeInvoiceType(type) {
      this.invoice["type"] = type;
    },
    changeUseInvoice(bool) {
      this.isUseInvoice = bool;
    },
    onConfirmInvoice() {
      console.log(this.invoice);
      this.closeInvoicePopup();
    },
    jump2spu(spuId) {
      console.log(spuId);
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${spuId}`,
      });
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
#confirm-order {
  // height: 100vh;
  // overflow-y: auto;
  padding-bottom: 120rpx;
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    line-height: 100rpx;
    z-index: 2;
    box-shadow: 0 -10rpx 10rpx 0 rgba(203, 209, 227, 0.2);
  }
}
.activedCart-tag {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 32rpx;
  line-height: 32rpx;
  background: rgba(255, 210, 0, 0.8);
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  font-size: 20rpx;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-img-border {
  border-radius: 10rpx;
  border: 1rpx solid rgba(223, 223, 223, 1);
  height: fit-content;
  overflow: hidden;
}
// 运费规则
.freigh {
  image {
    margin-right: 43rpx;
  }
  image:nth-child(3n) {
    margin-right: 0rpx !important;
  }
}
.confirmBtn {
  width: 470rpx;
  height: 80rpx;
  margin: 0 auto;
  margin-bottom: 40rpx;
  line-height: 80rpx;
  text-align: center;
  background: rgba(157, 160, 164, 0);
  border: 2rpx solid rgba(18, 19, 20, 1);
  border-radius: 40rpx;
}
.disabled-btn {
  background-color: #ebebeb;
}
.border-red-cat {
  border: 1px solid rgba(255, 56, 56, 1);
  border-radius: 17rpx;
  padding: 2rpx 14rpx;
  font-size: 20rpx;
  display: flex;
  justify-content: center;
  align-content: center;
}
@media screen and(min-width: 375px) and(max-height: 812px) {
  .bottom-bar {
    height: 110rpx !important;
  }
  .bottom-bar-btn {
    height: 110rpx !important;
  }
}

.invioce-tab-btn {
  border-radius: 4px;
  border: 1px solid #919599;
  margin: 0;
  width: 49%;
  background-color: #ffffff;
  &.active {
    color: $uni-color-theme;
    border: 1px solid $uni-color-theme;
    background-color: #fffdf5;
  }
}

/deep/ .minus-plus-icon {
  background-color: transparent;
  border: none !important;
  font-weight: 600;
}
/deep/ .errorPopup{
  margin-top: -18%;
}
.color-red {
  color: #ff3838;
  padding: 0 10rpx;
  width: fit-content;
  border-radius: 4rpx;
}
.bg-red {
  background-color: rgba(255, 56, 56, 0.2);
}
.h55 {
  height: 55rpx;
  line-height: 55rpx;
  margin-left: 30rpx;
}
.lh80 {
  line-height: 80rpx;
  margin-left: 40rpx;
}
</style>
