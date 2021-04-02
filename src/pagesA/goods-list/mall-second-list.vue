<template>
  <view class="min-h-full color-white bg-primary page">
    <view class="pl32">
      <view class="fw600 h80 l-h80">品牌推荐</view>
      <scroll-view scroll-x="true">
        <view class="row bg-red mr32" style="width:fit-content;">
          <view
            v-for="(item, index) in brands"
            :key="index"
            class="p8 mr24 bg-white brand-img-box w-h96 relative"
            style="border-radius: 12rpx"
            @tap="onBrandClick(item)"
          >
            <image
              class="w-full pos-center"
              :src="item.brandLogo || IMAGE.NULL_GOODS_IMG"
              mode="widthFix"
              :lazy-load="true"
            />
          </view>
        </view>
      </scroll-view>
    </view>

    <view>
      <view class="fw600 mt20 ml32 h80 l-h80">全部商品</view>
    </view>
    <view class="row center-x wrap last-odd pt20">
      <block v-for="(item, index) in goodsList" :key="index">
        <view
          :class="[index % 2 == 0 ? 'mr24' : '']"
          @tap="onSpuClick(item.id)"
        >
          <spu-card
            card-type="d"
            :spu-img="item.skuOssImage"
            :spu-name="item.spuName"
            :sell-price="item.salesPrice"
            :spu-activity-name="item.spuActivityName"
            :origin-price="item.platformPrice"
            :is-label="item.labelName"
            :status="item.status"
            :replenish="item.salesStock == 0 || item.salesStock == null"
            :subTitle="item.title"
          />
        </view>
      </block>
    </view>

    <view class="color-gray fs-mini l-h20 text-center pt12 pb24">
      <text v-if="loadMore.finished">我是有底线的</text>
      <text v-if="loadMore.loading">更多数据加载中...</text>
      <text v-if="loadMore.error" @click="onErrorClick">
        加载失败，点击重试</text
      >
    </view>
  </view>
</template>

<script>
import { NULL_GOODS_IMG } from "@/imageConfig";
import { getBrands, getAllGoods } from "@/api/goods";
import SpuCard from "_c/SpuCard";

export default {
  name: "mallSecondList",
  components: { SpuCard },
  data() {
    return {
      IMAGE: {
        NULL_GOODS_IMG,
      },
      title: "",
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      brands: [],
      categoryId: "",
      query: {
        pageIndex: 0,
        pageSize: 10,
        categoryIds: [],
        status: 1,
      },
      goodsList: [],
    };
  },
  onLoad(options) {
    this.categoryId = options.categoryId;
    this.query["categoryIds"].push(options.categoryId);
    uni.setNavigationBarTitle({ title: options.categoryName });
    this.init();
  },

  methods: {
    async init() {
      try {
        uni.showLoading();
        getBrands({ categoryId: this.categoryId }).then((res) => {
          console.log("二级类目列表", res.data);
          this.brands = res.data;
        });
        this.loadMore.finished = false;
        this.loadMore.loading = false;
        this.loadMore.error = false;
        this.query["pageIndex"] = 0;
        this.getList();
      } finally {
        uni.hideLoading();
      }
    },

    getList() {
      if (
        this.loadMore.finished ||
        this.loadMore.loading ||
        this.loadMore.error
      )
        return;
      this.query["pageIndex"] += 1;
      this.loadMore.loading = true;
      console.log("当前pageIndex  ", this.query["pageIndex"]);
      getAllGoods(this.query)
        .then((res) => {
          let data = res.data;
          console.log("二级类目列表", data);
          if (data && data.length) {
            this.goodsList = this.goodsList.concat(data);
          }
          if (!data || !data.length) {
            this.loadMore.finished = true;
          }
          this.loadMore.error = false;
        })
        .catch(() => {
          this.loadMore.error = true;
          this.query["pageIndex"] -= 1;
        })
        .finally(() => {
          this.loadMore.loading = false;
        });
    },

    onErrorClick() {
      this.loadMore.error = false;
      this.getList();
    },

    onSpuClick(id) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${id}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({ method: 'TO_GOODS_DETAIL', data: { spuId: id } })
      // #endif
    },

    onBrandClick(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/goods-list/Brand?brandId=${item.id}&brandName=${item.brandName}&spuId=${item.id}&brandLogo=${item.brandLogo}&categoryIds=${this.query["categoryIds"][0]}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({ method: 'TO_TOP_BRAND', data: { brandName: item.brandName,brandLogo: item.brandLogo, spuId: item.id,brandId:item.id,categoryIds:this.query["categoryIds"]} })
      // #endif
    },
  },
  onReachBottom() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.brand-img-box {
  &:last-of-type {
    margin-right: 32rpx;
  }
}
.last-odd:after {
  content: "";
  display: block;
  width: 330rpx;
  height: 0;
}
/deep/::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
  background: transparent;
}
</style>
