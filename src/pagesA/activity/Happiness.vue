<template>
  <view class="page">
    <view class="home-banner">
      <image mode="widthFix" :src="dataTap[0].activiteBrandImageUrl" class="w-full" />
    </view>
    <view class="happiness-list hidden plr20" :class="{'home-fixed': isFixedTabs }">
      <van-tabs
        @change="onTabsChange"
        sticky
        :ellipsis="false"
        color="#FFD200"
        :active="active"
        tab-active-class="happiness-tab-active-class"
        id="vantabs"
      >
        <van-tab v-for="(tab, m) in dataTap" :key="m" :title="tab.categoryName" :name="tab.id">
          <block>
            <view v-for="(item, index) in tabGoodList" :key="index" class="happiness-goods">
              <view @click="toGoodsDetail(item)" class="row hidden flex-1">
                <view class="relative">
                  <image
                    :src="item.skuList | formatSkuListValue('imgUrl')"
                    class="w-h224"
                    :class="{'opacity':item.skuList.every(e => e.salesStock == 0 || e.salesStock == null)}"
                  />
                  <view
                    class="absolute row w-h-full"
                    style="top:0;"
                    v-if="item.skuList.every(e => e.salesStock == 0 || e.salesStock == null)"
                  >
                    <view class="disabledCart-tag">{{"补货中"}}</view>
                  </view>
                  <view class="absolute row w-h-full" style="top:0;" v-if="item.status == 0">
                    <view class="disabledCart-tag">{{"已下架"}}</view>
                  </view>
                </view>
                <view class="flex-1 col space-between hidden plr30">
                  <view
                    class="ellipsis-line-2 fw600 fs-lg"
                    :class="{'opacity':item.skuList.every(e => e.salesStock == 0 || e.salesStock == null)}"
                  >{{ item.spuName }}</view>
                  <view class="fs-sm color-yellow bg-yellow">{{ item.spuActivityName}}</view>
                  <view class="row space-between">
                    <view>
                      <view
                        class="mt4 fw600 fs-lg color-red"
                      >¥{{ item.skuList[0].salesPrice | formatMoney }}</view>
                      <!-- <view
                        class="fs-sm color-red ml8 border-red-cat"
                        v-if="item.spuActivityName"
                      >{{ item.spuActivityName }}</view> -->
                      <view
                        class="fs-normal color-gray"
                        style="text-decoration-line: line-through;"
                      >¥{{item.skuList[0].platformPrice | formatMoney}}</view>
                    </view>
                    <view class>
                      <!-- <view
                        class="h90 pt18"
                        v-if="countList.find(m=>m.skuList[0].spuId==item.skuList[0].spuId).skuList[0].quantity>0"
                      >
                        <van-stepper
                          :value="countList.find(m=>m.skuList[0].spuId==item.skuList[0].spuId).skuList[0].quantity"
                          disable-input="true"
                          integer
                          :min="0"
                          :max="99"
                          plus-class="stepper-icon"
                          minus-class="stepper-icon"
                          input-class="stepper-input"
                          @change="onChange($event, item, index)"
                        />
                      </view>-->
                      <view
                        @tap.stop="onCartTap(item, index)"
                        style="transform:translate3d(12rpx,0,0);"
                        :class="{'filter-gray':item.skuList.every(e => e.salesStock == 0 || e.salesStock == null|| e.status == 0)}"
                      >
                        <image :src="IMAGE.HAPPINESS_CART" mode="scaleToFill" class="w-h90" />
                        <view
                          class="color-gray fs-sm text-center"
                          style="transform:translate3d(0,-8rpx,0);"
                          v-show="countList.find(n=> n.spuId==item.id)"
                        >已加购</view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </block>
          <view class="color-gray fs-mini text-center ptb20">
            <text v-if="goods[active].finished">我是有底线的</text>
            <text v-if="goods[active].loading">更多数据加载中...</text>
            <text v-if="goods[active].error" @click="onErrorClick">加载失败，点击重试</text>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <!-- 结算按钮 -->
    <view class="settlement">
      <view class="row mauto" style="width:712rpx;">
        <view class="col center-y ml14 relative" @tap="onJump2CartTap">
          <image :src="IMAGE.HAPPINESS_BUY" mode="scaleToFill" class="w-h48" />
          <view class="fs-22">购物车</view>
          <text class="cartCount" v-if="countList.length>0">{{ totalQuantity }}</text>
        </view>
        <view class="flex-1 fw600 pr10">
          <view
            style="font-size: 30rpx;"
            class="text-right mt10"
          >共{{ totalQuantity }}件，¥{{ totalPrice | formatMoney }}</view>
          <view style="color:#9EA0A4;" class="text-right fs-22">使用优惠券可立减 ¥{{happinessMaxCoupon/100}}</view>
        </view>
        <view
          :class="isSettle?'isSettle-able':'isSettle-disabled'"
          class="fw600 w226 h88 l-h88 text-center fs-lg-add"
          @tap="toPay"
        >去结算</view>
      </view>
    </view>
    <!-- sku弹窗 -->
    <sku-popup ref="sku-popup" @change="onSkuPopupChange"></sku-popup>
  </view>
</template>

<script>
import {
  ACTIVITY_END,
  HAPPINESS_CART,
  HAPPINESS_BANNER,
  HAPPINESS_BUY
} from "@/imageConfig";
import { getCartList } from "@/api/order/cart";
import { getCategoryList, searchSpu } from "@/api/activity/goods";
import { getHappinessMaxCoupon } from "@/api/activity/coupon";
import SkuPopup from "@/pagesA/sku-popup";
import { deepClone, debounce } from "@/utils";
import { getReceivedCoupon } from "@/api/activity/coupon";
export default {
  name: "happiness",
  data() {
    return {
      IMAGE: {
        ACTIVITY_END,
        HAPPINESS_CART,
        HAPPINESS_BANNER,
        HAPPINESS_BUY
      },
      stepperStatus: true, //进步器状态
      dataTap: [],
      countList: [
        // {
        //   id: "191526347631628289",
        //   spuId: "135399389211398144",
        //   spuName: "蜜浓氨基酸滋润保湿锁水防御修护凝胶面膜22mlX4",
        //   skuId: "135400755350736896",
        //   skuName: '{"面膜":"22ml*4片"}',
        //   skuImg:
        //     "https://oss-miaoxun.oss-cn-hangzhou.aliyuncs.com/goods/f7d5558f-e647-4617-aa25-17440813c9ff.jpg",
        //   quantity: 10,
        //   price: 10900,
        //   status: 1,
        //   enabled: 1,
        //   version: 1,
        //   remark: null,
        //   createTime: "2020-06-12 12:11:59",
        //   updateTime: "2020-06-12 12:11:59",
        //   purchaseLimitNum: 999,
        //   activityName: null,
        //   spuType: 0,
        //   uid: "189053531883773953"
        // }
      ], //加购的商品
      cartList: [], //购物车列表
      active: "0", // 默认推荐
      pageSize: 20,
      goods: {},
      isFixedTabs: false, // 是否开启固定tabs
      vanTabsTop: 0, // tabs距离顶部的滚动距离
      couponResult: [], //优惠券
      happinessMaxCoupon: "" ,//最大减免金额
      couponQuantity:0
    };
  },
  components: {
    SkuPopup
  },
  onShow() {
    this.fetchCartList();
    // this.fetchReceivedCoupon();
  },
  onLoad(options) {
    // console.log(this.$images.ACTIVITY_END);
    this.fetchCategoryData();
  },
  // 滚动加载
  onReachBottom() {
    console.log("滚动加载");
    this.loadGoodList();
  },
  computed: {
    tabGoodList() {
      if (this.goods[this.active]) {
        return this.goods[this.active].list;
      } else {
        return [];
      }
    },
    totalPrice() {
      let totalList = this.countList.filter(item => item.quantity > 0);
      let total = 0;
      totalList.forEach(item => {
        total += item.price * item.quantity;
      });
      return total;
    },
    //购物车商品数量
    totalQuantity() {
      let quantity = 0;
      this.couponQuantity = 0 ;
      this.countList.forEach(item => {
        if (item.couponCanUseStatus == 1) {
          quantity += item.quantity;
          this.couponQuantity  += item.quantity;
        }
      });
      return quantity;
    },
    isSettle() {
      let totalList = this.countList.filter(item => item.quantity > 0);
      return totalList.length > 0;
    }
  },
  methods: {
    // 获取购物车列表
    fetchCartList() {
      getCartList().then(res => {
        console.log("购物车列表", res.data);
        this.cartList = res.data;
        this.countList = JSON.parse(
          JSON.stringify(
            this.cartList.filter(item => item.couponCanUseStatus == 1)
          )
        );
        this.fetchMaxCoupon();
      });
    },
    //优惠券
    fetchReceivedCoupon() {
      getReceivedCoupon().then(res => {
        console.log("优惠卷", res);
        this.couponResult = res.data;
      });
    },
    loadGoodList() {
      if (
        this.goods[this.active].finished ||
        this.goods[this.active].loading ||
        this.goods[this.active].error
      )
        return;
      this.goods[this.active].pageNo += 1;
      let query = {
        pageSize: this.pageSize,
        pageNo: this.goods[this.active].pageNo,
        categoryId: this.active,
        // orderByClause: "create_time desc",
        // spuName: "",
        isActivityGood: 1
      };
      if (this.active == 0) {
        query.categoryId = "";
      }
      this.goods[this.active].loading = true;

      searchSpu(query)
        .then(res => {
          console.log(res.data);
          let data = res.data;
          this.goods[this.active].list = this.goods[this.active].list.concat(
            data.list
          );
          // if (!data.hasNextPage) {
          //   // 是否还有下一页
          //   this.goods[this.active].finished = true;
          // }
          if (data.list.length === 0) {
            // 是否还有下一页
            this.goods[this.active].finished = true;
          }
          this.goods[this.active].error = false;
          // console.log(this.goods)
        })
        .catch(error => {
          if (error.resCode === '70001') {
            uni.hideToast();
            this.goods[this.active].finished = true;
            this.goods[this.active].error = false;
          } else {
            this.goods[this.active].error = true;
            this.goods[this.active].pageNo -= 1;
          }
        })
        .finally(() => {
          this.goods[this.active].loading = false;
        });
    },
    //获取tab分类
    fetchCategoryData() {
      getCategoryList().then(res => {
        console.log(res);
        this.dataTap = res.data;
        console.log(this.dataTap);
        this.dataTap.unshift({
          id: "0",
          categoryName: "全部",
          activiteBrandImageUrl: res.data[0].activiteBrandImageUrl
        });
        this.dataTap.forEach(item => {
          this.$set(this.goods, item.id, {
            pageNo: 0,
            loading: false,
            finished: false,
            error: false,
            list: []
          });
        });
        this.active = this.dataTap[0].id;
        console.log(this.goods);
        this.loadGoodList();
      });
    },
    // 标签页切换
    onTabsChange(e) {
      console.log(e.detail.name);
      this.active = e.detail.name;
      if (this.goods[this.active].list.length === 0) {
        this.loadGoodList();
      }
    },
    //进步器
    onChange: debounce(function(e, item, index) {
      // console.log(e.detail);
      // item.quantity = e.detail;
      this.countList[
        this.countList.findIndex(
          m => m.skuList[0].spuId == item.skuList[0].spuId
        )
      ].skuList[0].quantity = e.detail;
      // uni.showLoading({ mask: true })
      // updateQuantity(item.id, e.detail).then(res => {
      // }).finally(() => {
      //   uni.hideLoading()
      // })
    }, 30),
    //购物车图标
    onCartTap: debounce(function(item, index) {
      console.log(item);
      // cartCount:购物车图标上的数量
      this.$refs["sku-popup"].show({
        spuId: item.id,
        cartCount: this.couponQuantity
      });
    }, 30),
    //获取最大面额优惠券
    fetchMaxCoupon() {
      let totalList = this.countList.filter(item => item.quantity > 0);
      let total = 0;
      totalList.forEach(item => {
        total += item.price * item.quantity;
      });
      getHappinessMaxCoupon(total).then(res => {
        console.log(res.data.couponAmount);
        if (res.data.couponAmount) {
          this.happinessMaxCoupon = res.data.couponAmount;
        } else {
          this.happinessMaxCoupon = 0;
        }
      });
    },
    //结算按钮
    toPay() {
      //通过购物车ID，获取购物车内容
      let orderParam = [];
      let checkResult = deepClone(this.countList);
      for (let i = 0; i < checkResult.length; i++) {
        if (checkResult[i].quantity > checkResult[i].purchaseLimitNum) {
          uni.showToast({
            title: `${checkResult[i].spuName}（超过最大限购数,限购数:${checkResult[i].purchaseLimitNum}）`,
            icon: "none",
            duration: 2000
          });
          return;
        }
        console.log(checkResult[i]);
        orderParam.push({
          skuId: checkResult[i].skuId,
          number: checkResult[i].quantity
        });
        // orderParam.push({ skuId: "66946225877815297", number: 16 });
      }
      // checkResult.forEach(item => {});

      if (orderParam.length <= 0) {
        return;
      }

      let urlParam =
        `orderType=1&orderParam=` +
        encodeURIComponent(JSON.stringify(orderParam));
      // console.info(urlParam)
      // 进入确认订单页面
      uni.navigateTo({
        url: `/pages/order/ConfirmOrder?${urlParam}`
      });
    },
    // 跳转详情页
    toGoodsDetail(item) {
      console.log(item);
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${item.id}&skuId=${item.skuId}`
      });
    },
    onErrorClick() {
      this.goods[this.active].error = false;
      this.loadGoodList();
    },
    // 跳转购物车
    onJump2CartTap() {
      console.log(666);
      this.countList.forEach(item => {
        this.$store.commit("SET_FROM_SKU_ID", item.skuId);
      });
      uni.switchTab({
        url: `/pages/tabbar/ShoppingCart`
      });
    },
    onSkuPopupChange({ quantity, skuId, spuId, price, purchaseLimitNum }) {
      // 回调参数说明：quantity=>添加购物车的数量，sku=>添加购物车的sku对象
      let isHas = this.countList.findIndex(item => {
        return item.skuId === skuId;
      });
      if (isHas != -1) {
        this.countList[isHas].quantity += quantity;
      } else {
        this.countList.push({ quantity, skuId, spuId, price });
        console.log(this.countList);
      }
      console.log(quantity, skuId, spuId, price);
      this.fetchMaxCoupon();
    }
  },
  // 监听滚动
  onPageScroll: debounce(function(data) {
    // 防抖
    console.log("防抖", data);
    console.log(this.vanTabsTop, data.scrollTop);
    if (this.vanTabsTop == 0) {
      let query = wx.createSelectorQuery();
      query
        .select(".home-banner")
        .boundingClientRect(res => {
          // console.log(res,'home-tab')
          this.vanTabsTop = res.height || 0;
        })
        .exec();
    }
    if (this.vanTabsTop > 0 && data.scrollTop > this.vanTabsTop) {
      this.isFixedTabs = true;
    } else {
      this.isFixedTabs = false;
    }
  }, 300)
};
</script>

<style lang="scss" scoped>
.page {
  // height: 100vh;
  min-height: 100vh;
  overflow-y: auto;
  background: #ff3838;
  padding-bottom: 100rpx;
}

.settlement {
  z-index: 999;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  height: 130rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px -10px 10px 0px rgba(203, 209, 227, 0.2);
}

.fs-30 {
  font-size: 30rpx;
}

.fw500 {
  font-weight: 500;
}

.fs-22 {
  font-size: 22rpx;
}

.ml16 {
  margin-left: 16rpx;
}

.happiness-list {
  // height: 1216rpx;
  width: 712rpx;
  background-color: #fff;
  margin: 0 auto 130rpx;
  border-radius: 16rpx;
}

.happiness-goods {
  // height: 250rpx;
  margin: 44rpx 0 24rpx;
}

.ellipsis-line-2 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 32rpx;
  font-weight: 500;
  color: rgba(18, 19, 20, 1);
}

.color-yellow {
  color: #ffa200;
  padding: 0 10rpx;
  width: fit-content;
  margin: 14rpx 0;
}

.bg-yellow {
  background-color: rgba(255, 209, 0, 0.2);
}

.disabled-btn {
  background-color: #ebebeb !important;
}

.disabledCart-tag {
  padding: 0 30rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20rpx;
  margin: 48% auto 0;
  font-size: 28rpx;
  line-height: 48rpx;
  color: #ffffff;
}
.opacity {
  opacity: 0.5;
}
.filter-gray {
  pointer-events: none;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
  opacity: 0.5;
}
.isSettle-able {
  background-color: #ffd200;
  border-radius: 10px;
}
.isSettle-disabled {
  background-color: #ffd200;
  pointer-events: none;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
  opacity: 0.5;
}

.home-fixed {
  padding-top: 44px;
  /deep/ .van-sticky {
    position: fixed !important;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 999;
  }
}
.cartCount {
  position: absolute;
  top: -10rpx;
  left: 38rpx;
  background: #ff3838;
  border-radius: 50%;
  padding: 0 12rpx;
  color: white;
  font-size: 20rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  width: fit-content;
}
.page {
  /deep/ .van-tab {
    padding-left: 24rpx;
    padding-right: 24rpx;
  }
  /deep/ .van-tab view {
    font-size: 28rpx;
    color: #9ea0a4;
    font-weight: 600;
    font-weight: 400;
  }
  /deep/ .van-tab--active view {
    font-size: 34rpx !important;
    color: $uni-color-primary !important;
    font-weight: 600 !important;
  }
  // /deep/ .van-stepper__minus {
  //   width: 56rpx !important;
  //   height: 56rpx !important;
  //   border-radius: 50% !important;
  //   background-color: rgba(255, 209, 0, 1) !important;
  //   color: #121314 !important;
  //   border: none !important;
  // }

  // /deep/ .van-stepper__plus {
  //   width: 56rpx !important;
  //   height: 56rpx !important;
  //   border-radius: 50% !important;
  //   background-color: rgba(255, 209, 0, 1) !important;
  //   color: #121314 !important;
  //   border: none !important;
  // }

  // /deep/ .van-stepper .van-stepper__minus--disabled {
  //   width: 56rpx !important;
  //   height: 56rpx !important;
  //   border-radius: 50% !important;
  //   background-color: rgba(157, 160, 164, 0.2) !important;
  //   color: rgba(157, 160, 164, 0.2) !important;
  //   border: none !important;
  // }

  // /deep/ .van-stepper .van-stepper__plus--disabled {
  //   width: 56rpx !important;
  //   height: 56rpx !important;
  //   border-radius: 50% !important;
  //   background-color: rgba(157, 160, 164, 0.2) !important;
  //   color: rgba(157, 160, 164, 0.2) !important;
  //   border: none !important;
  // }

  // /deep/ .van-stepper .stepper-input {
  //   border: none !important;
  //   font-size: 28rpx !important;
  //   color: rgba(18, 19, 20, 1) !important;
  //   transform: translate3d(0, 6rpx, 0);
  // }
}
</style>
