<template>
  <!-- <view class="bg-primary min-h-full" style="padding-bottom: 130rpx;"> -->
  <view class="bg-primary min-h-full">
    <view>
      <van-tabs
        :active="tabIndex"
        sticky
        :animated="false"
        @change="onTabChange"
      >
        <van-tab
          v-for="(tab, idx) in cartData"
          :key="idx"
          :title="tab.title"
          :name="tab.name"
        ></van-tab>
      </van-tabs>
      <!-- #ifdef H5 -->
      <view v-if="tabCover" class="h10 w-full relative bg-white" style="margin-top: -5px;z-index: 9999;"></view>
      <!-- #endif -->

      <view v-if="cartData.length">
        <!-- <view
          v-for="(tab, idx) in cartData"
          :key="idx"
          :title="tab.title"
          :name="tab.name"
        > -->
        <!-- 购物车为空 -->
        <view v-show="cartData[tabIndex].isNull || !token">
          <view class="nullCart">
            <image mode="scaleToFill" :src="IMAGE.NULL_CART_BOX"></image>
            <text>购物车还是空的哦～</text>
          </view>
          <view class="plr30 ptb40 row space-between">
            <!-- #ifdef H5 -->
            <view
              class="fw600 h88 l-h88 text-center radius-round bg-pink color-white"
              style="width: 46%;"
              @tap="toRecommend"
              >查看更多商品</view
            >
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN -->
            <navigator
              url="/pages/tabbar/Mall"
              open-type="switchTab"
              style="width: 46%;"
            >
              <view class="fw600 h88 l-h88 text-center radius-round bg-pink color-white"
                >查看更多商品</view
              >
            </navigator>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <navigator url="/pagesA/integral/Task" style="width: 46%;">
              <view
                class="fw600 h88 l-h88 text-center radius-round"
                style="border: 1px solid #121314;"
                >玩玩喵豆游戏</view
              >
            </navigator>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view
              class="fw600 h88 l-h88 text-center radius-round"
              style="border: 1px solid #121314; width:46%"
              @tap="toTask"
            >
              玩玩喵豆游戏
            </view>
            <!-- #endif -->
          </view>
        </view>
        <block v-if="tabIndex == 0">
          <!-- 有效商品 -->
          <van-checkbox-group
            :value="cartData[tabIndex].checkResult"
            @change="onSelectGoods"
            v-if="cartData[tabIndex].list"
          >
            <view
              class="row center-y bg-white"
              v-for="(item, index) in cartData[tabIndex].list"
              :key="item.skuId"
            >
              <van-checkbox
                :disabled="
                  isDisabledCheck(
                    item.quantity,
                    item.stock,
                    item.purchaseLimitNum
                  )
                "
                :name="item.skuId"
                checked-color="#FF9EA8"
              ></van-checkbox>
              <view class="row hidden flex-1 ptb32 hairline-bottom">
                <view
                  @click="toGoodsDetail(item)"
                  class="relative goods-img-border"
                >
                  <image :src="item.skuImg" class="w-h160 radius" />
                  <view
                    class="disabledCart-tag"
                    v-if="item.quantity > item.stock || item.stock < 10"
                    >仅剩{{ item.stock }}件</view
                  >
                  <view class="activedCart-tag" v-else-if="item.activityName">{{
                    item.activityName
                  }}</view>
                </view>
                <view class="flex-1 hidden plr26 col space-around">
                  <view
                    class="row space-between center-y"
                    @click="toGoodsDetail(item)"
                  >
                    <view class="ellipsis hidden flex-1 pr40">
                      <image
                        v-if="item.couponCanUseStatus === 1 && tabIndex == 0"
                        :src="IMAGE.COUPON_TAG"
                        class="w-h32 mr10"
                      /><text style="vertical-align:middle;">{{
                        item.spuName
                      }}</text>
                    </view>
                    <view
                      class="w-h32"
                      @click.stop="onDelete(item.skuId, index)"
                      ><image :src="IMAGE.SHOPPING_ICON_CLOSE" class="w-h-full"
                    /></view>
                  </view>
                  <view class="row space-between" @click="toGoodsDetail(item)">
                    <view class="fs-22 color-gray">{{
                      formatSkuName(item.skuName)
                    }}</view>
                    <view
                      class="fs-mini color-pink"
                      v-if="item.quantity > item.stock"
                      >仅剩{{ item.stock }}件,请减少加购数量</view
                    >
                    <view
                      class="fs-mini color-pink"
                      v-else-if="item.quantity > item.purchaseLimitNum"
                      >限购{{ item.purchaseLimitNum }}件,请减少加购数量</view
                    >
                  </view>
                  <view class="row space-between center-y l-h48 h48">
                    <!-- <text
                        class="fs-sm color-gray"
                        @click.stop="onDelete(item.skuId, index)"
                        >删除</text
                      > -->
                    <view class="row center-y mt4 fw600 color-pink fs-lg-add">
                      <image
                        v-if="userInfo.levelCode > 0 && userInfo.levelCode == 1"
                        class="w-h32 mr10"
                        :src="IMAGE.GOODS_SPU_SILVER"
                      />
                      <image
                        v-if="userInfo.levelCode > 0 && userInfo.levelCode == 2"
                        class="w-h32 mr10"
                        :src="IMAGE.GOODS_SPU_GOLD"
                      />¥ {{ item.userLevelDiscountPrice | formatMoney }}</view
                    >
                    <!-- #ifdef MP-WEIXIN -->
                    <van-stepper
                      :value="item.quantity"
                      @change="onQuantityChange($event, item, index)"
                      integer
                      :disable-input="false"
                      :min="1"
                      :max="
                        maxStepper(
                          item.quantity,
                          item.stock,
                          item.purchaseLimitNum
                        )
                      "
                      :plus-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-icon red'
                          : 'stepper-icon'
                      "
                      :minus-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-icon red'
                          : 'stepper-icon'
                      "
                      :input-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-input red'
                          : 'stepper-input'
                      "
                    />
                    <!-- #endif -->
                    <!-- #ifdef H5 -->
                    <van-stepper
                      :value="item.quantity"
                      @change="onQuantityChange($event, item, index)"
                      integer
                      :disable-input="true"
                      :min="1"
                      :max="
                        maxStepper(
                          item.quantity,
                          item.stock,
                          item.purchaseLimitNum
                        )
                      "
                      :plus-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-icon red'
                          : 'stepper-icon'
                      "
                      :minus-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-icon red'
                          : 'stepper-icon'
                      "
                      :input-class="
                        item.quantity > item.stock ||
                        item.quantity > item.purchaseLimitNum
                          ? 'stepper-input red'
                          : 'stepper-input'
                      "
                    />
                    <!-- #endif -->
                  </view>
                </view>
              </view>
            </view>
          </van-checkbox-group>
          <!-- 失效加购商品 -->
          <view
            v-if="
              cartData[tabIndex].outList && cartData[tabIndex].outList.length
            "
            class="mt20"
          >
            <view
              class="row space-between bg-white plr30 ptb20 hairline-bottom"
            >
              <view class="row center-y">
                <image :src="IMAGE.SHOPPING_ICON_WARN" class="w-h32 mr24" />
                <text
                  >{{
                    cartData[tabIndex].outList.length
                  }} 件商品失效不能购买</text
                >
              </view>
              <view @tap="onClear" class="row center-y color-gray">
                <text>清空失效商品</text>
              </view>
            </view>
            <van-checkbox-group>
              <view
                class="row center-y bg-white"
                v-for="item in cartData[tabIndex].outList"
                :key="item.skuId"
              >
                <van-checkbox
                  :disabled="true"
                  :name="item.skuId"
                  checked-color="#FF9EA8"
                ></van-checkbox>
                <view class="row hidden flex-1 hairline-bottom ptb32">
                  <view class="relative goods-img-border">
                    <image :src="item.skuImg" class="w-h160 radius" />
                    <view class="absolute row w-h-full" style="top:0;">
                      <view class="disabledCart-tag">{{
                        item.spuStatus == 0
                          ? "已下架"
                          : item.stock == 0
                          ? "补货中"
                          : ""
                      }}</view>
                    </view>
                  </view>
                  <view
                    class="flex-1 space-between hidden plr26 col space-around"
                  >
                    <view class="row space-between center-y">
                      <view class="ellipsis hidden flex-1 pr40 color-gray">{{
                        item.spuName
                      }}</view>
                      <!-- <view class="mt4 fw600 color-red fs-lg"
                        >¥{{ item.price | formatMoney }}</view
                      > -->
                      <view
                        class="w-h32"
                        @click.stop="onDelete(item.skuId, index)"
                        ><image
                          :src="IMAGE.SHOPPING_ICON_CLOSE"
                          class="w-h-full"
                      /></view>
                    </view>
                    <view class="fs-22 color-gray">{{
                      formatSkuName(item.skuName)
                    }}</view>
                    <view class="mt4 fw600 color-gray fs-lg-add"
                      >¥ {{ item.userLevelDiscountPrice | formatMoney }}</view
                    >
                  </view>
                </view>
              </view>
            </van-checkbox-group>
          </view>
        </block>
        <block v-else>
          <view
            v-for="(cross, crossIdx) in cartData[1].list"
            :key="cross.wareHouseCode"
            v-show="cross.wareHouseCode"
          >
            <view
              v-if="
                (cross.list && cross.list.length) ||
                  (cross.outList && cross.outList.length)
              "
              class="bg-white"
            >
              <view class="h80 l-h80 plr24 mt20">
                <image :src="IMAGE.SHOPPING_ICON_ADD" class="w-h40 mr24" />
                {{ cross.bondedWareHouse }}
              </view>
              <!-- 有效商品 -->
              <van-checkbox-group
                :value="cross.checkResult"
                @change="onSelectCrossGoods($event, crossIdx)"
                v-for="(item, index) in cross.list"
                :key="item.skuId"
              >
                <view class="row center-y bg-white">
                  <van-checkbox
                    :disabled="
                      isDisabledCheck(
                        item.quantity,
                        item.stock,
                        item.purchaseLimitNum
                      )
                    "
                    :name="item.skuId"
                    checked-color="#FF9EA8"
                  ></van-checkbox>
                  <view class="row hidden flex-1 ptb30 hairline-bottom">
                    <view
                      @click="toGoodsDetail(item)"
                      class="relative goods-img-border"
                    >
                      <image :src="item.skuImg" class="w-h160 radius" />
                      <view
                        class="disabledCart-tag"
                        v-if="item.quantity > item.stock || item.stock < 10"
                        >仅剩{{ item.stock }}件</view
                      >
                      <view class="activedCart-tag" v-if="item.activityName">{{
                        item.activityName
                      }}</view>
                    </view>
                    <view class="flex-1 hidden plr26 col space-around">
                      <view
                        class="row space-between center-y"
                        @click="toGoodsDetail(item)"
                      >
                        <view class="ellipsis hidden flex-1 pr40"
                          ><image
                            v-if="
                              item.couponCanUseStatus === 1 && cross.name == 0
                            "
                            :src="IMAGE.COUPON_TAG"
                            class="w-h32 mr10"
                          /><text style="vertical-align:middle;">{{
                            item.spuName + index + crossIdx
                          }}</text></view
                        >
                        <view
                          class="w-h32"
                          @click.stop="
                            onDeleteCross(item.skuId, index, crossIdx)
                          "
                        >
                          <image
                            :src="IMAGE.SHOPPING_ICON_CLOSE"
                            class="w-h-full"
                        /></view>
                      </view>
                      <view
                        class="row space-between"
                        @click="toGoodsDetail(item)"
                      >
                        <view class="fs-sm color-gray">{{
                          formatSkuName(item.skuName)
                        }}</view>
                        <view
                          class="fs-mini color-red"
                          v-if="item.quantity > item.stock"
                          >仅剩{{ item.stock }}件,请减少加购数量</view
                        >
                        <!-- <view
                          class="fs-mini color-red"
                          v-else-if="
                            item.quantity > item.stock || item.stock < 10
                          "
                          >仅剩{{ item.stock }}件</view
                        > -->
                        <view
                          class="fs-mini color-red"
                          v-else-if="item.quantity > item.purchaseLimitNum"
                          >限购{{
                            item.purchaseLimitNum
                          }}件,请减少加购数量</view
                        >
                      </view>
                      <view class="row space-between center-y">
                        <!-- <text
                          class="fs-sm color-gray"
                          @click.stop="
                            onDeleteCross(item.skuId, index, crossIdx)
                          "
                          >删除</text
                        > -->
                        <view
                          class="row center-y mt4 fw600 color-pink fs-lg-add"
                        >
                          ¥ {{ item.userLevelDiscountPrice | formatMoney }}
                        </view>
                        <!-- #ifdef MP-WEIXIN -->
                        <van-stepper
                          :value="item.quantity"
                          @change="onQuantityChange($event, item, index)"
                          integer
                          :disable-input="false"
                          :min="1"
                          :max="
                            maxStepper(
                              item.quantity,
                              item.stock,
                              item.purchaseLimitNum
                            )
                          "
                          :plus-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-icon red'
                              : 'stepper-icon'
                          "
                          :minus-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-icon red'
                              : 'stepper-icon'
                          "
                          :input-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-input red'
                              : 'stepper-input'
                          "
                        />
                        <!-- #endif -->
                        <!-- #ifdef H5 -->
                        <van-stepper
                          :value="item.quantity"
                          @change="onQuantityChange($event, item, index)"
                          integer
                          :disable-input="true"
                          :min="1"
                          :max="
                            maxStepper(
                              item.quantity,
                              item.stock,
                              item.purchaseLimitNum
                            )
                          "
                          :plus-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-icon red'
                              : 'stepper-icon'
                          "
                          :minus-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-icon red'
                              : 'stepper-icon'
                          "
                          :input-class="
                            item.quantity > item.stock ||
                            item.quantity > item.purchaseLimitNum
                              ? 'stepper-input red'
                              : 'stepper-input'
                          "
                        />
                        <!-- #endif -->
                      </view>
                    </view>
                  </view>
                </view>
              </van-checkbox-group>
              <!-- 失效加购商品 -->
              <view v-if="cross.outList.length" class="mt20">
                <view
                  class="row space-between bg-white plr30 ptb20 hairline-bottom"
                >
                  <view class="row center-y">
                    <image :src="IMAGE.SHOPPING_ICON_WARN" class="w-h32 mr24" />
                    <text>{{ cross.outList.length }} 件商品失效不能购买</text>
                  </view>
                  <view
                    @tap="onClearCross(crossIdx)"
                    class="row center-y color-gray"
                  >
                    <text>清空失效商品</text>
                  </view>
                </view>
                <van-checkbox-group>
                  <view
                    class="row center-y bg-white"
                    v-for="item in cross.outList"
                    :key="item.skuId"
                  >
                    <van-checkbox
                      :disabled="true"
                      :name="item.skuId"
                      checked-color="#FF9EA8"
                    ></van-checkbox>
                    <view class="row hidden flex-1 hairline-bottom ptb30">
                      <view class="relative goods-img-border">
                        <image
                          :src="item.skuImg"
                          class="w-h160 radius opacity"
                        />
                        <view class="absolute row w-h-full" style="top:0;">
                          <view class="disabledCart-tag">{{
                            item.spuStatus == 0
                              ? "已下架"
                              : item.stock == 0
                              ? "补货中"
                              : ""
                          }}</view>
                        </view>
                      </view>
                      <view class="flex-1 space-between hidden plr30">
                        <view class="row space-between center-y">
                          <view class="ellipsis hidden flex-1 opacity pr40">{{
                            item.spuName
                          }}</view>
                          <view class="mt4 fw600 color-red fs-lg"
                            >¥
                            {{
                              item.userLevelDiscountPrice | formatMoney
                            }}</view
                          >
                        </view>
                        <view class="fs-sm color-gray mt10 opacity">{{
                          formatSkuName(item.skuName)
                        }}</view>
                        <view class="row space-between center-y opacity">
                          <text class="fs-sm color-gray">删除</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </van-checkbox-group>
              </view>
              <!-- 结算按钮 -->
              <view class="settlement-cross" v-if="cross.list.length">
                <view class="row w-full pr30 center-y">
                  <van-checkbox
                    :value="checkAllCrossList[crossIdx].checkAll"
                    @change="onChangeCheckAllCross(crossIdx)"
                    checked-color="#FF9EA8"
                    :label-class="checkAllCrossList[crossIdx].checkAll ? 'color-shop-pink' : 'color-gray'"
                    >全选</van-checkbox
                  >

                  <view class="flex-1 pr10 mr16">
                    <view class="text-right fw600 "
                      >合计：<text :class="{ 'color-pink': isSettle(crossIdx) }"
                        >¥ {{ cross.totalPrice | formatMoney }}</text
                      ></view
                    >
                    <!-- <view
                      class="text-right fs-22 color-gray mt8"
                      v-if="isSettle(crossIdx)"
                      @tap="onTap(totalQuantity(crossIdx), crossIdx)"
                    >
                      <text class="mr8"
                        >共优惠: ¥ {{ cross.allDiscount | formatMoney }} </text
                      ><text>查看明细 ></text>
                    </view> -->
                  </view>
                  <button
                    class="to-pay-btn"
                    :class="{ active: isSettle(crossIdx) }"
                    :disabled="!isSettle(crossIdx)"
                    @tap="toPay($event, crossIdx)"
                  >
                    结算{{
                      isSettle(crossIdx) ? `(${totalQuantity(crossIdx)})` : ""
                    }}
                  </button>
                </view>
              </view>
            </view>
          </view>
        </block>
        <!-- </view> -->
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <view class="pb100">
      <guess-goods ref="guess-like" :guessGoods="guessGoods" isWhiteBg />
    </view>
    <!-- 结算按钮 -->
    <view
      class="settlement h136"
      v-if="cartData[tabIndex].list.length && tabIndex == 0"
    >
      <view class="row w-full pr30 center-y">
        <van-checkbox
          :value="checkAll"
          @change="onChangeCheckAll"
          checked-color="#FF9EA8"
          :label-class="checkAll ? 'color-shop-pink' : 'color-gray'"
          >全选</van-checkbox
        >
        <view class="flex-1 pr10 mr16">
          <view class="text-right fw600 "
            >合计：<text :class="{ 'color-pink': isSettle() }"
              >¥ {{ cartData[tabIndex].totalPrice | formatMoney }}</text
            ></view
          >
          <view
            class="text-right fs-22 color-gray mt8"
            v-if="isSettle()"
            @tap="onTap(totalQuantity())"
          >
            <text class="mr8"
              >共优惠: ¥ {{ cartData[tabIndex].allDiscount | formatMoney }} </text
            ><text>查看明细 ></text>
          </view>
        </view>
        <button
          class="to-pay-btn"
          :class="{ active: isSettle() }"
          :disabled="!isSettle()"
          @tap="toPay"
        >
          结算{{ isSettle() ? `(${totalQuantity()})` : "" }}
        </button>
      </view>
    </view>
    <van-popup
      :show="detailPopup"
      position="bottom"
      round
      :close-on-click-overlay="true"
      @click-overlay="closeDetailPopup"
    >
      <view class="plr32">
        <image
          :src="IMAGE.SHOPPING_ICON_DETA"
          class="w-h48 absolute"
          style="right:16rpx;top:16rpx;"
          @tap="closeDetailPopup"
        />
        <view class="ptb24">
          <view class="fw600">金额优惠明细</view>
          <view class="color-gray fs-22 mt8">
            实际优惠金额请以下单页为准
          </view>
        </view>
        <view class="ptb24 row space-between center-y">
          <view>商品总价</view>
          <view class="color-pink fw600"
            >¥ {{ offerDetails.goodsTotalAmount | formatMoney }}</view
          >
        </view>
        <!-- <view 
          v-if="offerDetails.userLevelTotalAmount"
          class="ptb24 row space-between center-y"
        >
          <view>会员立减</view>
          <view class="color-pink fw600"
            >- ¥ {{ offerDetails.userLevelTotalAmount | formatMoney }}</view
          >
        </view> -->
        <view v-if="offerDetails.couponName" class="ptb24 row space-between">
          <view>
            <view>
              优惠券
            </view>
            <view class="fs-22 color-gray mt8">
              {{ offerDetails.couponName }}
            </view>
          </view>
          <view class="color-pink fw600">
            - ¥ {{ offerDetails.couponTotalAmount | formatMoney }}
          </view>
        </view>
        <!-- <view 
          v-if="offerDetails.discountTotalAmount"
          class="ptb24 row space-between center-y"
        >
          <view>共优惠</view>
          <view class="color-pink fw600"
            >- ¥ {{ offerDetails.discountTotalAmount | formatMoney }}</view
          >
        </view> -->
        <view class="ptb24 row space-between center-y">
          <view>合计</view>
          <view class="color-pink fw600"
            >¥ {{ offerDetails.actualTotalAmount | formatMoney }}</view
          >
        </view>
        <button
          class="active w-full fs-lg-add text-center h80 l-h80 mtb24 bg-pink radius color-white"
          @tap="toPay($event, detailCrossIdx)"
        >
          结算({{ detailQuantity }})
        </button>
      </view>
    </van-popup>
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
  </view>
</template>

<script>
import CustomNav from "_c/CustomNav";
import AuthPopup from "_c/AuthPopup";
import { mapGetters } from "vuex";
import {
  getCartList,
  batchDeleteCart,
  updateQuantity,
  getCalculateDiscount,
} from "@/api/order/cart";
import { guessLike } from "@/api/goods/spu";
import GuessGoods from "@/pages/guess-goods/index";
import {
  NULL_CART_BOX,
  SHOPPING_CART_DUSTBIN,
  COUPON_TAG,
  SHOPPING_ICON_CLOSE,
  SHOPPING_ICON_WARN,
  SHOPPING_ICON_ADD,
  SHOPPING_ICON_DETA,
  GOODS_SPU_SILVER,
  GOODS_SPU_GOLD,
} from "@/imageConfig";
import { deepClone, debounce, sortArr } from "@/utils";
import { getWxPhone } from "@/api/tools";
import { jumpLink } from "@/mixins";

export default {
  name: "ShoppingCart",
  components: { GuessGoods, CustomNav, AuthPopup },
  mixins: [jumpLink],
  data() {
    return {
      IMAGE: {
        NULL_CART_BOX,
        SHOPPING_CART_DUSTBIN,
        COUPON_TAG,
        SHOPPING_ICON_CLOSE,
        SHOPPING_ICON_WARN,
        SHOPPING_ICON_ADD,
        SHOPPING_ICON_DETA,
        GOODS_SPU_SILVER,
        GOODS_SPU_GOLD,
      },
      checkAll: false, // 全选
      checkAllCrossList: [{ checkAll: false }, { checkAll: false }],
      // #ifdef MP-WEIXIN
      tabIndex: 0,
      // #endif
      // #ifdef H5
      tabIndex: 1,
      // #endif
      // list:有效列表，outList失效列表
      cartData: [
        {
          name: 0,
          title: "普通商品",
          list: [],
          isNull: false,
          checkResult: [],
          outList: [],
          allDiscount: 0,
          totalPrice: 0,
        },
        {
          name: 1,
          title: "跨境商品",
          list: [],
          isNull: true,
          checkResult: [],
        },
      ],
      tabCover:true,
      authPopup: false,
      detailPopup: false,
      guessGoods: [], //猜你喜欢
      offerDetails: {}, //优惠明细
      detailQuantity: 0, //明细商品
      detailCrossIdx: null, //明细支付
    };
  },
  computed: {
    ...mapGetters(["token", "navBarHeight", "menuTop", "userInfo"]),
    totalPrice() {
      return (crossIdx) => {
        let total = 0;
        if (this.tabIndex == 0) {
          this.cartData[this.tabIndex].checkResult.forEach((selectId) => {
            let index = this.cartData[this.tabIndex].list.findIndex(
              (ele) => ele.skuId === selectId
            );
            if (index !== -1) {
              total +=
                this.cartData[this.tabIndex].list[index].price *
                this.cartData[this.tabIndex].list[index].quantity;
            }
          });
        } else {
          this.cartData[this.tabIndex].list[crossIdx].checkResult.forEach(
            (selectId) => {
              let index = this.cartData[this.tabIndex].list[
                crossIdx
              ].list.findIndex((ele) => ele.skuId === selectId);
              if (index !== -1) {
                total +=
                  this.cartData[this.tabIndex].list[crossIdx].list[index]
                    .price *
                  this.cartData[this.tabIndex].list[crossIdx].list[index]
                    .quantity;
              }
            }
          );
        }
        console.log(total);
        return total;
      };
    },
    totalQuantity() {
      return (crossIdx) => {
        let quantity = 0;
        if (this.tabIndex == 0) {
          this.cartData[this.tabIndex].checkResult.forEach((selectId) => {
            let index = this.cartData[this.tabIndex].list.findIndex(
              (ele) => ele.skuId === selectId
            );
            if (index !== -1) {
              quantity += this.cartData[this.tabIndex].list[index].quantity;
            }
          });
        } else {
          this.cartData[this.tabIndex].list[crossIdx].checkResult.forEach(
            (selectId) => {
              let index = this.cartData[this.tabIndex].list[
                crossIdx
              ].list.findIndex((ele) => ele.skuId === selectId);
              if (index !== -1) {
                quantity += this.cartData[this.tabIndex].list[crossIdx].list[
                  index
                ].quantity;
              }
            }
          );
        }
        return quantity;
      };
    },
    isSettle() {
      return (crossIdx) => {
        if (this.tabIndex == 0) {
          return this.cartData[this.tabIndex].checkResult.length > 0;
        } else {
          return (
            this.cartData[this.tabIndex].list[crossIdx].checkResult.length > 0
          );
        }
      };
    },
  },
  onShow() {
    // this.cartData[1].isNull = true;
    // this.$refs["guess-like"].init();
    let params = {
      pageIndex: 1,
      pageSize: 6,
    };
          // #ifdef MP-WEIXIN
      this.tabIndex = 0,
      // #endif
      // #ifdef H5
      this.tabIndex = 1,
      // #endif
    guessLike(params).then((res) => {
      let data = res.data;
      if (data) {
        this.guessGoods = data;
        console.log("猜你喜欢", this.guessGoods);
      }
    });
    this.maxNum = 0;
    if (!this.token) {
      this.authPopup = true;
    } else {
      this.authPopup = false;
    }
    this.fetchCartList();
  },
  onLoad() {},
  methods: {
    // 获取购物车列表
    fetchCartList() {
      console.log("购物车列表==========");
      if (this.token) {
        getCartList().then((res) => {
          console.log("购物车列表>", res.data, "-----------");
          if(res.data){
            // 普通商品
            let commonIndex = this.cartData.findIndex((ele) => ele.name === 0);
            let commonList =
              res.data &&
              res.data.filter((ele) => ele.spuType === 0 || ele.spuType === null);
            this.cartData[commonIndex].list = [];
            this.cartData[commonIndex].outList = [];
            commonList.forEach((common) => {
              if (common.stock > 0 && common.spuStatus == 1) {
                this.cartData[commonIndex].list.push(common);
              } else {
                this.cartData[commonIndex].outList.push(common);
              }
            });
            this.cartData[commonIndex].isNull =
              this.cartData[commonIndex].list.length === 0 &&
              this.cartData[commonIndex].outList.length === 0
                ? true
                : false;
  
            // 跨境商品
            let crossIndex = this.cartData.findIndex((ele) => ele.name === 1);
            let crossList = res.data &&res.data.filter((ele) => ele.spuType === 1);
            //保存跨境商品选中状态
            let saveCrossCheckState = this.cartData[crossIndex].list.map(
              (item) => {
                return {
                  wareHouseCode: item.wareHouseCode,
                  checkResult: JSON.parse(JSON.stringify(item.checkResult)),
                  allDiscount: item.allDiscount,
                  totalPrice: item.totalPrice,
                };
              }
            );
            this.cartData[crossIndex].list = [];
  
            //过滤分仓跨境列表
            var divideArr = [];
            crossList
              .map((item) => {
                return [item];
              })
              .forEach(([{ ...item }]) => {
                const flag = divideArr.find(
                  ([{ ...o }]) => o.wareHouseCode === item.wareHouseCode
                );
                if (!flag) {
                  divideArr.push([{ ...item }]);
                } else {
                  divideArr.forEach(([{ ...y }], index) => {
                    if (y.wareHouseCode === item.wareHouseCode) {
                      divideArr[index].push(item);
                    }
                  });
                }
              });
            //对跨境列表推入分仓对象
            divideArr.map((item) => {
              this.cartData[crossIndex].list.push({
                bondedWareHouse: "",
                wareHouseCode: item[0].wareHouseCode,
                list: [],
                checkResult: [],
                outList: [],
                allDiscount: 0,
                totalPrice: 0,
              });
            });
            //把保存的选中数组推入新建跨境分仓中
            saveCrossCheckState.forEach((saveItem) => {
              this.cartData[crossIndex].list.forEach((crossItem) => {
                if (saveItem.wareHouseCode == crossItem.wareHouseCode) {
                  crossItem.checkResult = saveItem.checkResult;
                  crossItem.allDiscount = saveItem.allDiscount;
                  crossItem.totalPrice = saveItem.totalPrice;
                }
              });
            });
            //把购物车对象分配到跨境列表的各个仓库列表中
            crossList.forEach((cross) => {
              this.cartData[crossIndex].list.forEach((item, idx) => {
                if (cross.wareHouseCode == item.wareHouseCode) {
                  item.bondedWareHouse = cross.bondedWareHouse;
                  if (cross.stock > 0 && cross.spuStatus == 1) {
                    item.list.push(cross);
                  } else {
                    item.outList.push(cross);
                  }
                }
              });
            });
            console.log(this.cartData[crossIndex].list);
            if (
              this.cartData[crossIndex].list &&
              this.cartData[crossIndex].list.length
            ) {
              this.cartData[crossIndex].isNull = false;
            } else {
              this.cartData[crossIndex].isNull = true;
              this.cartData[crossIndex].list=[{                
                bondedWareHouse: "",
                wareHouseCode: null,
                list: [{}],
                checkResult: [],
                outList: [],
                allDiscount: 0,
                totalPrice: 0,
              }]
            }
  
            // 活动页加购商品默认选中
            // console.log("活动页加购商品", this.$store.state.happiness.skuList);
            // if (this.$store.state.happiness.skuList.length) {
            //   this.cartData[this.tabIndex].checkResult = [];
            //   this.$store.state.happiness.skuList.forEach((skuId) => {
            //     console.log(skuId);
            //     let index = this.cartData[this.tabIndex].list.findIndex(
            //       (item) => item.skuId == skuId
            //     );
            //     console.log(index);
            //     if (index >= 0) {
            //       this.cartData[this.tabIndex].checkResult.push(
            //         this.cartData[this.tabIndex].list[index].skuId
            //       );
            //     }
            //   });
            // }
            if (
              this.cartData[this.tabIndex].list.length ==
              this.cartData[this.tabIndex].checkResult.length
            ) {
              this.checkAll = true;
            } else {
              this.checkAll = false;
            }
            this.$store.commit("CLEAR_FROM_SKU_ID");
            this.resetCheckResult();
            // #ifdef H5
            var a = document.getElementsByClassName("van-ellipsis")[1];
            a.click();
            console.log(this.checkAll)
            this.checkAll = false
            setTimeout(()=>{
              this.tabCover = false;
            },300) 
            this.$flutter({ method: 'HIDE_LOADING' })
            // #endif
          }
        });
      }
    },
    //获取购物车明细
    fetchCalculateDiscount() {
      let params = [
        {
          skuId: "",
          quantity: "",
          price: "",
          activityName: "",
          userLevelDiscountPrice: "",
        },
      ];
    },
    onTabChange(e) {
      let { name, title } = e.detail;
      console.log(name, title);
      this.tabIndex = name;
      // if (
      //   this.cartData[this.tabIndex].list &&
      //   this.cartData[this.tabIndex].checkResult.length ===
      //   this.cartData[this.tabIndex].list.filter(
      //     (e) => !this.isDisabledCheck(e.quantity, e.stock, e.purchaseLimitNum)
      //   ).length
      // ) {
      //   this.checkAll = true;
      // } else {
      //   this.checkAll = false;
      // }
    },
    // 重置已选择
    resetCheckResult() {
      if (this.cartData[this.tabIndex].checkResult.length > 0) {
        let copyCheckResult = deepClone(
          this.cartData[this.tabIndex].checkResult
        );
        this.cartData[this.tabIndex].checkResult = [];
        setTimeout(() => {
          this.cartData[this.tabIndex].checkResult = copyCheckResult;
        }, 0);
      }
      console.log(this.cartData[this.tabIndex].checkResult);
    },
    // 删除购物车
    onDelete(skuId, index) {
      uni.showModal({
        content: "确认删除吗？",
        confirmText: "删除",
        success: (res) => {
          if (res.confirm) {
            // console.log('用户点击确定')
            batchDeleteCart([skuId]).then((res) => {
              uni.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1000,
              });
              this.cartData[this.tabIndex].list.splice(index, 1);
              this.cartData[this.tabIndex].isNull =
                this.cartData[this.tabIndex].list.length === 0 ? true : false;

              this.cartData[this.tabIndex].checkResult.splice(
                this.cartData[this.tabIndex].checkResult.indexOf(skuId),
                1
              );
              this.resetCheckResult();
              this.fetchCartList();
              this.fetchCalculateDiscount();
            });
          }
        },
      });
    },
    // 删除购物车
    onDeleteCross(skuId, index, crossIdx) {
      uni.showModal({
        content: "确认删除吗？",
        confirmText: "删除",
        success: (res) => {
          if (res.confirm) {
            // console.log('用户点击确定')
            batchDeleteCart([skuId]).then((res) => {
              uni.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1000,
              });
              this.cartData[this.tabIndex].list[crossIdx].list.splice(index, 1);
              if (
                this.cartData[this.tabIndex].list &&
                this.cartData[this.tabIndex].list.length
              ) {
                this.cartData[this.tabIndex].isNull = false;
              } else {
                this.cartData[this.tabIndex].isNull = true;
              }

              this.cartData[this.tabIndex].list[crossIdx].checkResult.splice(
                this.cartData[this.tabIndex].list[crossIdx].checkResult.indexOf(
                  skuId
                ),
                1
              );
              this.resetCheckResult();
              this.fetchCartList();
              this.fetchCalculateDiscount(crossIdx);
            });
          }
        },
      });
    },
    //清除失效商品
    onClear() {
      uni.showModal({
        content: "清除失效商品？",
        confirmText: "清除",
        success: (t) => {
          if (t.confirm) {
            let ids = this.cartData[this.tabIndex].outList.map((e) => e.skuId);
            console.log(ids);
            uni.showLoading();
            batchDeleteCart(ids)
              .then((res) => {
                this.cartData[this.tabIndex].outList = [];
              })
              .finally(() => {
                uni.hideLoading();
              });
          }
        },
      });
    },
    //清除失效商品
    onClearCross(crossIdx) {
      uni.showModal({
        content: "清除失效商品？",
        confirmText: "清除",
        success: (t) => {
          if (t.confirm) {
            let ids = this.cartData[this.tabIndex].list[crossIdx].outList.map(
              (e) => e.skuId
            );
            console.log(ids);
            uni.showLoading();
            batchDeleteCart(ids)
              .then((res) => {
                this.cartData[this.tabIndex].list[crossIdx].outList = [];
              })
              .finally(() => {
                uni.hideLoading();
              });
          }
        },
      });
    },
    maxStepper(quantity, stock, purchaseLimitNum) {
      let max = 0;
      if (quantity > stock || quantity > purchaseLimitNum) {
        // 已有数量大于库存或限购时，取数量
        max = quantity;
      } else {
        if (stock > purchaseLimitNum) {
          max = purchaseLimitNum;
        } else {
          max = stock;
        }
      }

      return max;
    },
    isDisabledCheck(quantity, stock, purchaseLimitNum) {
      return quantity > stock || quantity > purchaseLimitNum;
    },
    // 选择商品
    onSelectGoods(e) {
      console.log(e);
      this.cartData[this.tabIndex].checkResult = e.detail;
      if (
        this.cartData[this.tabIndex].list &&
        this.cartData[this.tabIndex].checkResult.length ===
          this.cartData[this.tabIndex].list.filter(
            (e) =>
              !this.isDisabledCheck(e.quantity, e.stock, e.purchaseLimitNum)
          ).length
      ) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
        this.cartData[this.tabIndex].totalPrice = 0;
      }
      // 清空非当前tab已选择的商品
      // this.cartData.forEach((item, index) => {
      //   if (index !== this.tabIndex) {
      //     this.cartData[index].checkResult = [];
      //     this.cartData[index].totalPrice = 0;
      //   }
      // });

      this.fetchCalculateDiscount();
    },
    // 选择商品
    onSelectCrossGoods(e, crossIdx) {
      this.cartData[this.tabIndex].list[crossIdx].checkResult = e.detail;
      if (
        this.cartData[this.tabIndex].list[crossIdx].list &&
        this.cartData[this.tabIndex].list[crossIdx].checkResult.length ===
          this.cartData[this.tabIndex].list[crossIdx].list.filter(
            (e) =>
              !this.isDisabledCheck(e.quantity, e.stock, e.purchaseLimitNum)
          ).length
      ) {
        this.checkAllCrossList[crossIdx].checkAll = true;
      } else {
        this.checkAllCrossList[crossIdx].checkAll = false;
        this.cartData[this.tabIndex].list[crossIdx].totalPrice = 0;
      }
      // 清空非当前tab已选择的商品
      // this.cartData.forEach((item, index) => {
      //   if (index !== this.tabIndex) {
      //     this.cartData[this.tabIndex].list[crossIdx].checkResult = [];
      //     this.cartData[this.tabIndex].list[crossIdx].totalPrice = 0;
      //   }
      // });

      this.fetchCalculateDiscount(crossIdx);
    },
    //计算优惠券明细
    fetchCalculateDiscount(crossIdx) {
      //通过购物车ID，获取购物车内容
      let orderParam = [];
      let cartList =
        crossIdx || crossIdx == 0
          ? deepClone(this.cartData[this.tabIndex].list[crossIdx].list)
          : deepClone(this.cartData[this.tabIndex].list);
      let checkResult =
        crossIdx || crossIdx == 0
          ? deepClone(this.cartData[this.tabIndex].list[crossIdx].checkResult)
          : deepClone(this.cartData[this.tabIndex].checkResult);
      for (let x in cartList) {
        for (let y in checkResult) {
          if (cartList[x].skuId == checkResult[y]) {
            if (cartList[x].quantity > cartList[x].purchaseLimitNum) {
              uni.showToast({
                title: `${cartList[x].spuName}（超过最大限购数,限购数:${cartList[x].purchaseLimitNum}）`,
                icon: "none",
                duration: 2000,
              });
              return;
            }
            orderParam.push({
              spuId: cartList[x].spuId,
              skuId: cartList[x].skuId,
              brandId: cartList[x].brandId,
              categoryId: cartList[x].categoryId,
              quantity: cartList[x].quantity,
              price: cartList[x].price,
              activityName: cartList[x].activityName,
              userLevelDiscountPrice: cartList[x].userLevelDiscountPrice,
              cross:crossIdx || crossIdx == 0 ? true : false
            });
          }
        }
      }
      console.log(orderParam);
      if (orderParam.length > 0) {
        getCalculateDiscount(orderParam).then((res) => {
          console.log(res);
          if (res.data) {
            this.offerDetails = res.data;
            if (crossIdx || crossIdx == 0) {
              this.cartData[this.tabIndex].list[crossIdx].allDiscount =
                res.data.discountTotalAmount;
              this.cartData[this.tabIndex].list[crossIdx].totalPrice =
                res.data.actualTotalAmount;
            } else {
              this.cartData[this.tabIndex].allDiscount =
                res.data.discountTotalAmount;
              this.cartData[this.tabIndex].totalPrice =
                res.data.actualTotalAmount;
            }
          }
        });
      }else{
        if (crossIdx || crossIdx == 0) {
          this.cartData[this.tabIndex].list[crossIdx].allDiscount = 0
          this.cartData[this.tabIndex].list[crossIdx].totalPrice = 0
        }else{
          this.cartData[this.tabIndex].allDiscount = 0;
          this.cartData[this.tabIndex].totalPrice = 0;
        }
      }
    },
    onChangeCheckAll(crossIdx) {
      if (this.checkAll) {
        this.cartData[this.tabIndex].checkResult = [];
        this.cartData[this.tabIndex].totalPrice = 0;
      } else {
        this.cartData[this.tabIndex].checkResult = [];
        this.cartData[this.tabIndex].list.forEach((e) => {
          if (!this.isDisabledCheck(e.quantity, e.stock, e.purchaseLimitNum)) {
            this.cartData[this.tabIndex].checkResult.push(e.skuId);
          }
        });
        this.fetchCalculateDiscount();
      }
      this.checkAll = !this.checkAll;
    },
    // 跨境全选
    onChangeCheckAllCross(crossIdx) {
      if (this.checkAllCrossList[crossIdx].checkAll) {
        this.cartData[this.tabIndex].list[crossIdx].checkResult = [];
        this.cartData[this.tabIndex].list[crossIdx].totalPrice = 0;
      } else {
        this.cartData[this.tabIndex].list[crossIdx].checkResult = [];
        this.cartData[this.tabIndex].list[crossIdx].list.forEach((e) => {
          if (!this.isDisabledCheck(e.quantity, e.stock, e.purchaseLimitNum)) {
            this.cartData[this.tabIndex].list[crossIdx].checkResult.push(
              e.skuId
            );
          }
        });

        this.fetchCalculateDiscount(crossIdx);
      }

      this.checkAllCrossList[crossIdx].checkAll = !this.checkAllCrossList[
        crossIdx
      ].checkAll;
    },
    // skuName显示
    formatSkuName(skuName) {
      if (skuName) {
        let json = JSON.parse(skuName);
        let arr = [];
        Object.keys(json).forEach((key) => {
          arr.push(json[key]);
        });
        return arr.join();
      }
    },
    // 购物车数量改变
    onQuantityChange: debounce(function(e, item, index) {
      console.log(e.detail);
      item.quantity = e.detail;
      uni.showLoading({ mask: true });
      updateQuantity(item.skuId, e.detail)
        .then((res) => {
          this.fetchCalculateDiscount();
        })
        .finally(() => {
          uni.hideLoading();
        });
    }, 400),
    // 跳转详情页
    toGoodsDetail(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${item.spuId}&skuId=${item.skuId}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({
        method: "TO_GOODS_DETAIL",
        data: { spuId: item.spuId, skuId: item.id },
      });
      // #endif
    },
    //优惠明细弹窗
    onTap(quantity, crossIdx) {
      this.detailPopup = true;
      this.detailQuantity = quantity;
      if (crossIdx || crossIdx == 0) {
        this.detailCrossIdx = crossIdx;
      } else {
        this.detailCrossIdx = null;
      }
    },
    toLogin() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/login/Phone?from=ShoppingCart`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({ method: "TO_LOGIN" });
      // #endif
    },
    toPay(e, crossIdx) {
      console.log(crossIdx);
      //通过购物车ID，获取购物车内容
      let orderParam = [];
      let cartList =
        crossIdx || crossIdx == 0
          ? deepClone(this.cartData[this.tabIndex].list[crossIdx].list)
          : deepClone(this.cartData[this.tabIndex].list);
      let checkResult =
        crossIdx || crossIdx == 0
          ? deepClone(this.cartData[this.tabIndex].list[crossIdx].checkResult)
          : deepClone(this.cartData[this.tabIndex].checkResult);
      for (let x in cartList) {
        for (let y in checkResult) {
          if (cartList[x].skuId == checkResult[y]) {
            if (cartList[x].quantity > cartList[x].purchaseLimitNum) {
              uni.showToast({
                title: `${cartList[x].spuName}（超过最大限购数,限购数:${cartList[x].purchaseLimitNum}）`,
                icon: "none",
                duration: 2000,
              });
              return;
            }
            orderParam.push({
              skuId: cartList[x].skuId,
              quantity: cartList[x].quantity,
            });
          }
        }
      }
      if (orderParam.length <= 0) {
        return;
      }
      let urlParam = `orderType=1&orderParam=${encodeURIComponent(
        JSON.stringify(orderParam)
      )}`;
      console.info("下单信息========", urlParam);
      // 进入确认订单页面

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/order/ConfirmOrder?${urlParam}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({
        method: "TO_CONFIRM_ORDER",
        data: { orders: orderParam },
      });
      // #endif
    },
    closePopup() {
      console.log(this.authPopup);
      this.authPopup = false;
    },
    closeDetailPopup() {
      this.detailPopup = false;
    },
    //重新加载页面
    reload() {
      this.$mp.page.onShow();
    },

    toRecommend() {
      // #ifdef H5
      this.$flutter({ method: "TO_HOME", data: { index: 1 } });
      // #endif
    },

    toTask() {
      // #ifdef H5
      this.$flutter({ method: "TO_INTEGRAL_TASK" });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.nullCart {
  width: 100%;
  margin: 0 auto;
  padding-top: 57px;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: rgba(102, 104, 108, 1);
  image {
    width: 192px;
    height: 128px;
    margin: 0 auto;
    padding-bottom: 16px;
  }
}
.settlement {
  z-index: 2;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  box-shadow: 0px -10px 10px 0px rgba(203, 209, 227, 0.2);
  .to-pay-btn {
    background-color: #f2f2f5;
    font-size: 28rpx;
    border-radius: 10rpx;
    width: 188rpx;
    height: 80rpx;
    line-height: 80rpx;
    &.active {
      color: white;
      background-color: #ff9ea8;
    }
  }
}
.settlement-cross {
  width: 100%;
  background: white;
  display: flex;
  &:last-of-type {
    margin-bottom: 20rpx;
  }
  .to-pay-btn {
    color: white;
    background-color: rgba(255, 158, 168, 1);
    font-size: 28rpx;
    border-radius: 10rpx;
    width: 226rpx;
    height: 80rpx;
    line-height: 80rpx;
  }
}
/deep/ .van-checkbox {
  .van-icon {
    color: transparent;
  }
  .van-checkbox__icon--checked {
    .van-icon {
      color: white;
    }
  }
  .van-checkbox__icon-wrap {
    padding: 48rpx 26rpx; // 增大icon区域
  }
}
/deep/ .van-tabs__line {
  background-color: #FF9EA8 !important;
}
.light-btn {
  background-color: #ffd100;
  color: #121314;
  font-weight: 600;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #ffd100;
  padding: 0;
}
.plain-btn {
  background-color: transparent;
  color: #121314;
  font-weight: 500;
  font-size: 24rpx;
  width: 180rpx;
  height: 60rpx;
  line-height: 56rpx;
  border-radius: 30rpx;
  border: 1px solid #121314;
  padding: 0;
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
.activedCart-tag {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 48rpx;
  line-height: 48rpx;
  color: white;
  background: rgba(255, 114, 114, 0.8);
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  bottom: 0;
  font-size: 22rpx;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-img-border {
  border-radius: 12rpx;
  // border: 1rpx solid rgba(223, 223, 223, 1);
  overflow: hidden;
}
.opacity {
  opacity: 0.5;
}
/deep/ .stepper-icon {
  width: 56rpx !important;
  height: 56rpx !important;
  border-radius: 4px 0px 0px 4px;
  background-color: rgba(245, 245, 245, 1) !important;
  border: 0 !important;
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-color-primary !important;
  &.van-stepper__minus.red {
    background-color: rgba(255, 114, 114, 0.1) !important;
    color: #ff7272 !important;
  }
  &.van-stepper__plus.red {
    background-color: rgba(255, 114, 114, 0.1) !important;
    color: #ff7272 !important;
  }
  &.van-stepper__minus--disabled,
  &.van-stepper__plus--disabled {
    color: #9da0a4 !important;
  }
}
/deep/ .stepper-input {
  width: 90rpx !important;
  height: 56rpx !important;
  background-color: rgba(245, 245, 245, 1) !important;
  border: 0 !important;
  color: $uni-color-primary !important;
  font-size: 28rpx;
  &.red {
    background-color: rgba(255, 114, 114, 0.1) !important;
    color: #ff7272 !important;
  }
}
/deep/ .color-shop-pink{
  color:#FF9EA8 !important;
}
</style>
