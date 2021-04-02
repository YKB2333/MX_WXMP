<template>
  <view class="page">
    <view class="row">
      <view class="row space-between w-full">
        <view class="row center-y">
          <image v-if="vip > 0 && vip == 1" class="w-h44 mr10" :src="IMAGE.GOODS_SPU_SILVER" />
          <image
            v-if="vip > 0 && vip == 2"
            class="w-h44 mr10"
            :src="IMAGE.GOODS_SPU_GOLD"
          />
          <view >
            <text :class="salesPriceColor" class="fs-lg-big-add fw600 mr16"
              >¥ {{ salesPrice | formatMoney }}</text
            >
            <text
              v-if="platformPrice"
              :class="platformPriceColor"
              style="text-decoration-line:line-through"
              >¥ {{ platformPrice | formatMoney }}</text
            >
          </view>
        </view>
        <view v-if="sales > 0">
          <text class="fs-lg-big-add fw600 mr16"></text>
          <text class="priceGray">销量 {{ sales }}</text>
        </view>

        <!-- <view
            v-if="salesPrice > 0 && platformPrice > 0 && platformPrice > salesPrice"
            class="ml10 row center-y"
            :class="vipTangleColor"
          >
            <view
              class="color-red fs-mini plr10 fw600"
              :class="vipTagColor"
              style="height: 32rpx;line-height:32rpx;"
            >会员{{ ((salesPrice / platformPrice) * 10).toFixed(1) }}折</view>
          </view> -->
      </view>
      <!-- <slot name="sales-price-right" /> -->
    </view>
  </view>
</template>

<script>
import { GOODS_SPU_SILVER, GOODS_SPU_GOLD } from "@/imageConfig";
export default {
  name: "SpuPriceInfo",
  props: {
    platformPrice: {
      // 市场价
      type: Number,
      default: 0,
    },
    salesPrice: {
      // 销售价
      type: Number,
      default: 0,
    },
    sales: {
      // 销售量
      type: Number,
      default: 0,
    },
    vip: {
      // 销售量
      type: Number,
      default: 0,
    },
    salesPriceColor: {
      // 销售价
      type: String,
      default: "priceRed",
    },
    platformPriceColor: {
      // 市场价
      type: String,
      default: "priceGray",
    },
    vipTagColor: {
      // VIP标签
      type: String,
      default: "bg-color",
    },
    vipTangleColor: {
      // VIP三角
      type: String,
      default: "vip-tangle-red",
    },
  },
  data() {
    return {
      IMAGE: {
        GOODS_SPU_SILVER,
        GOODS_SPU_GOLD,
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.page {
  .bg-color {
    background: rgba(255, 56, 56, 0.2) !important;
  }
  .priceRed {
    color: #fe5050;
  }
  .priceGray {
    color: #bfc2cc;
  }
  .vip-tangle-white::before {
    content: "";
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 6rpx 8rpx 6rpx 0;
    border-color: transparent #fff transparent transparent;
  }
  .vip-tangle-red::before {
    content: "";
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 6rpx 8rpx 6rpx 0;
    border-color: transparent rgba(255, 56, 56, 0.2) transparent transparent;
  }
}
</style>
