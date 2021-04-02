<template>
  <view
    :class="[
      'spu-card',
      'bg-white',
      'hidden',
      status == 0 || replenish ? 'disabled' : '',
      cardType !== 'd' ? '' : 'spu-d-card',
    ]"
    :style="{ width: size + 'rpx', height: sizeH + 'rpx' }"
  >
    <view
      :class="['spu-img-wrapper', cardType !== 'd' ? 'p24' : '']"
      :style="{ width: size + 'rpx', height: size + 'rpx' }">
      <image :src="spuImg || IMAGE.NULL_GOODS_IMG" mode="widthFix" style="width:100%;" :lazy-load="true" />
      <view class="disabled-tag" v-if="status == 0">已下架</view>
      <view class="disabled-tag" v-else-if="replenish">补货中</view>
      <view class="brand-tags row" v-if="cardType === 'd' || cardType === 'd-sm'">
        <view class="brand-tag" v-if="isLabel && isLabel == '爆款'">爆款</view>
        <view class="spu-new-tag" v-if="isLabel && isLabel != '爆款'">{{ isLabel }}</view>
        <view class="brand-tag" v-if="spuActivityName" :style="{color: status == 0 || replenish ? '#ffffff' : '#ffffff','background-color': '#FEBD3B',}">{{ spuActivityName }}</view>
      </view>
    </view>
    <block v-if="cardType === 'a' || cardType === 'a-sm'">
      <view class="col space-between content-wrapper h140">
        <view
          :class="['ellipsis', 'fs-sm', 'l-h32', 'text-left', 'h32']"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#909399',
          }"
          >{{ subTitle }}</view
        >
        <view
          :class="['ellipsis', 'fs-sm', 'spu-name', 'fw600', 'l-h36']"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#121313',
          }"
          >{{ spuName }}</view
        >
        <view class="row center-y">
          <text :class="['color-red', 'fs-lg', 'mr10', 'fw600', 'ellipsis']"
            >¥<text class="ml10">{{ sellPrice / 100 }}</text></text
          >
          <!-- <view class="tag" v-else-if="isNewUserDiscount">新用户5折</view> -->
          <text
            :class="['color-gray', 'fs-normal', 'delete-line']"
            v-if="originPrice > sellPrice"
            >¥{{ originPrice / 100 }}</text
          >
        </view>
        <!-- <text class="tag hidden" style="max-width:100rpx;" v-if="spuActivityName">{{ spuActivityName }}</text> -->
      </view>
      <view class="ml30 mt8 row l-h32">
        <view
          v-if="spuActivityName"
          :class="['tag', 'mr8', 'text-center', 'plr8', 'fs-mini', 'l-h32']"
          >{{ spuActivityName }}</view
        >
        <view
          v-if="isLabel"
          :class="['tag', 'mr8', 'text-center', 'plr8', 'fs-mini', 'l-h32']"
          >{{ isLabel }}</view
        >
        <view
          v-else
          :class="[
            'mr8',
            'text-center',
            'color-white',
            'plr8',
            cardType === 'a-sm' ? 'fs-18' : 'fs-sm',
            cardType === 'a-sm' ? 'l-h28' : 'l-h32',
          ]"
          >占位</view
        >
      </view>
    </block>
    <block v-if="cardType === 'b'">
      <view class="content-wrapper">
        <view class="ellipsis fw600 text-center spu-name">{{ spuName }}</view>
        <view class="fw600 text-center mt30" style="font-size: 26rpx;"
          >¥{{ sellPrice | formatMoney }}</view
        >
      </view>
    </block>
    <block v-if="cardType === 'c' || cardType === 'c-sm'">
      <view class="content-wrapper plr18 pt8">
        <view
          :class="['ellipsis', 'fs-sm', 'l-h32', 'text-left', 'h32']"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#909399',
          }"
          >{{ subTitle }}</view
        >
        <view
          :class="[
            'ellipsis',
            cardType === 'c-sm' ? 'fs-mini h56' : 'fs-sm h64',
            'spu-name',
            'fw500',
          ]"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#121313',
          }"
          >{{ spuName }}</view
        >
        <view class="row center-y mt10">
          <text
            :class="[
              'color-red',
              cardType === 'c-sm' ? 'fs-sm' : 'fs-lg',
              'mr10',
              'fw600',
              'ellipsis',
            ]"
            >¥{{ sellPrice / 100 }}</text
          >
          <text
            :class="[
              'color-gray',
              cardType === 'c-sm' ? 'fs-sm' : 'fs-normal',
              'fw500',
              'delete-line',
            ]"
            v-if="originPrice > sellPrice"
            >¥{{ originPrice / 100 }}</text
          >
        </view>
      </view>
    </block>
    <block v-if="cardType === 'd' || cardType === 'd-sm'">
      <view class="col space-between content-wrapper">
        <view
          :class="['ellipsis', 'fs-sm', 'l-h32', 'text-left', 'h32']"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#909399',
          }"
          >{{ subTitle }}</view
        >
        <view
          :class="[
            'ellipsis',
            'fs-sm',
            'spu-name',
            'mt4',
            'fw600',
            'l-h36',
            'text-left',
          ]"
          :style="{
            'white-space': 'normal',
            color: status == 0 || replenish ? '#9D9FA3' : '#121313',
          }"
          >{{ spuName }}</view
        >
        <view class="row mt48">
          <text :class="['color-red', 'fs-lg', 'mr10', 'fw600', 'ellipsis']"
            >¥<text class="mlr10">{{ sellPrice / 100 }}</text>
            <text
              :class="['color-gray', 'fs-normal', 'delete-line','fw400']"
              v-if="originPrice > sellPrice"
              >¥{{ originPrice / 100 }}</text
            ></text
          >
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { NULL_GOODS_IMG, GOODS_YOUXUAN_1 } from "@/imageConfig";

export default {
  name: "SpuCard",
  props: {
    cardType: {
      type: String,
      default: "a",
    },
    // 图片
    spuImg: {
      type: String,
      required: true,
    },
    // 名称
    spuName: {
      type: String,
      required: true,
    },
    // 销售价
    sellPrice: {
      type: [Number, String],
      required: true,
    },
    // 原价
    originPrice: {
      type: [Number, String],
    },
    // 是否有新用户折扣
    isNewUserDiscount: {
      type: Boolean,
      required: false,
    },
    // 是否开启懒加载
    lazyLoad: {
      type: Boolean,
      default: true,
    },
    // 优选
    isLabel: {
      type: String,
      default: "",
    },
    spuActivityName: {
      // 活动名称
      type: String,
    },
    status: {
      // 0下架，1上架
      type: [Number, String],
      default: 1,
    },
    replenish: {
      // 补货中
      type: Boolean,
      default: false,
    },
    subTitle: {
      // 二级标题
      type: String,
      default: "",
    },
  },
  data() {
    return {
      IMAGE: {
        NULL_GOODS_IMG,
        GOODS_YOUXUAN_1,
      },
      num: 0,
      imgList: [
        'http://img.netbian.com/file/2020/0719/smallfb5eb76bfad671a169013c54fb79e5d51595173351.jpg',
        'http://img.netbian.com/file/2020/0719/smallfb5eb76bfad671a169013c54fb79e5d51595173351.jpg',
        'http://img.netbian.com/file/2020/0719/smallfb5eb76bfad671a169013c54fb79e5d51595173351.jpg'
      ]
    };
  },
  computed: {
    size() {
      if (this.cardType === "a") return 324;
      if (this.cardType === "b") return 315;
      if (this.cardType === "c") return 324;
      if (this.cardType === "d") return 330;
      if (this.cardType === "c-sm") return 208;
      if (this.cardType === "a-sm") return 300;
      if (this.cardType === "d-sm") return 324;
    },
    sizeH() {
      if (this.cardType === "a") return 528;
      if (this.cardType === "b") return 464;
      if (this.cardType === "c") return 464;
      if (this.cardType === "d") return 544;
      if (this.cardType === "c-sm") return 330;
      if (this.cardType === "a-sm") return 504;
      if (this.cardType === "d-sm") return 528;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.spu-card {
  display: inline-block;
  margin-bottom: 22rpx;
  padding-bottom: 20rpx;
  border-radius: 10rpx;
  position: relative;
  border: 1rpx solid #e1e3e8;
  // box-sizing: content-box;
  &.spu-d-card {
    border: none;
  }
  .spu-img-wrapper {
    position: relative;
    image {
      border-top-left-radius: 8rpx;
      border-top-right-radius: 8rpx;
    }
  }
  .content-wrapper {
    background-color: #ffffff;
    padding: 16rpx 30rpx 0;
    border-bottom-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
  }
  .tag {
    color: #ff3838;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-radius: 4rpx;
    border: 1rpx solid #ff3838;
    &.bg-white {
      background-color: #ffffff;
      border: none;
    }
  }
  .disabled-tag {
    display: none;
  }
  &.disabled {
    .spu-img-wrapper image {
      opacity: 0.5;
    }
    .disabled-tag {
      display: block;
      position: absolute;
      color: #ffffff;
      width: 140rpx;
      height: 48rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 20px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 48rpx;
    }
    .spu-name {
      color: #121314;
    }
  }
  .spu-tag {
    background: #8cb9a5;
    border-radius: 4rpx 24rpx 24rpx 0px;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 1);
    line-height: 48rpx;
    text-align: center;
    padding: 0 24rpx;
  }
  .brand-tags {
    position: absolute;
    top: 8rpx;
    left: 8rpx;
  }
  .brand-tag {
    background-color: #fe5050;
    border-radius: 4rpx 20rpx 20rpx 20rpx;
    font-size: 24rpx;
    color: #ffffff;
    text-align: center;
    padding: 4rpx 16rpx;
    line-height: 36rpx;
    margin-left: 6rpx;
  }
  .spu-new-tag {
    color: #ff9ea8;
    text-align: center;
    border-radius: 20rpx;
    border: 1rpx solid #ff9ea8;
    padding: 4rpx 16rpx;
    font-size: 24rpx;
    margin-left: 6rpx;
  }
}
</style>
