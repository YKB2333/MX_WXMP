<template>
  <view class="bg-primary min-h-full">
    <view class="plr30 pt28 bg-white title_fixed">
      <view
        class="col center-x mb16 bg-white"
        style="position: relative; top: 0; z-index: 1"
        :style="{ 'margin-top': menuTop - 4 + h5Height + 'px' }"
      >
        <view class="absolute" @tap="goBack">
          <image :src="IMAGE.ARROW_LEFT" class="w-h48" />
        </view>
        <view class="text-center"
          ><image class="w90" mode="widthFix" :src="brandLogo || IMAGE.NULL_GOODS_IMG"
        /></view>
      </view>
    </view>
    <view
      class="row wrap center-x pt20 last-odd"
      :style="{ 'margin-top': navBoxHeight + 'px' }"
    >
      <block
        v-for="(item, index) in brandGoods"
        :key="index"
      >
        <view :class="[index % 2 == 0 ? 'mr24' : '']" @tap="onSpuClick(item.id)">
          <spu-card
            card-type="d"
            :spu-img="item.skuOssImage"
            :spu-name="item.spuName"
            :sell-price="item.salesPrice"
            :spu-activity-name="item.spuActivityName"
            :is-new-user-discount="item.isActivityNewUser"
            :origin-price="item.platformPrice"
            :is-label="item.labelName"
            :status="item.status"
            :replenish="item.salesStock == 0 || item.salesStock == null"
            :subTitle="item.title"
          />
        </view>
      </block>
    </view>
    <view class="color-gray fs-mini text-center pb20">
      <text v-if="loadMore.finished">我是有底线的</text>
      <text v-if="loadMore.loading">更多数据加载中...</text>
      <text v-if="loadMore.error" @click="onErrorClick"
        >请求发生错误，点击重试</text
      >
    </view>
  </view>
</template>

<script>
import SpuCard from "_c/SpuCard";
import CustomNav from "_c/CustomNav";
import { getBrands, getAllGoods } from "@/api/goods";
// import { getBrandGoods } from "@/api/goods/spu";
import { MALL_ICON_RETURN, ARROW_LEFT, NULL_GOODS_IMG } from "@/imageConfig";
import { mapGetters } from "vuex";

export default {
  name: "BrandGoodsList",
  components: { SpuCard, CustomNav },
  data() {
    return {
      IMAGE: {
        MALL_ICON_RETURN,
        NULL_GOODS_IMG,
        ARROW_LEFT,
      },
      navBoxHeight: 0,
      brandName: "",
      brandLogo: "",
      h5Height:0,
      query: {
        pageIndex: 0,
        pageSize: 10,
        brandId: "",
        status:1
      },
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      // 品牌商品
      brandGoods: [],
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo", "menuTop"]),
  },
  onLoad(options) {
    this.brandName = options.brandName;
    this.brandLogo = options.brandLogo;
    this.query.brandId = options.brandId;
    if(options.categoryIds){
      this.query.categoryIds = [options.categoryIds];
    }
    // uni.setNavigationBarTitle(this.brandName);
    // #ifdef H5
    this.h5Height = 20;
    // #endif 
    this.init();
    setTimeout(() => {
      let query = uni.createSelectorQuery();
      query
        .select(".title_fixed")
        .boundingClientRect((res) => {
          this.navBoxHeight = res.height;
        })
        .exec();
    }, 300);
  },
  methods: {
    init() {
      this.loadMore.finished = false;
      this.loadMore.loading = false;
      this.loadMore.error = false;
      this.query["pageIndex"] = 0;
      this.brandGoods = [];
      this.loadList();
    },
    loadList() {
      if (
        this.loadMore.finished ||
        this.loadMore.loading ||
        this.loadMore.error
      )
        return;

      this.query["pageIndex"] += 1;
      this.loadMore.loading = true;
      getAllGoods(this.query)
        .then((res) => {
          console.log(res);
          let data = res.data;
          console.log("品牌商品", data);
          if(data&&data.length>0){
            this.brandGoods = this.brandGoods.concat(data);
          }else{
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
      // getBrandGoods(this.query)
      //   .then((res) => {
      //     let data = res.data;
      //     console.log("品牌商品", data.list);
      //     this.brandGoods = this.brandGoods.concat(data.list);
      //     if (!data.hasNextPage) {
      //       this.loadMore.finished = true;
      //     }
      //     this.loadMore.error = false;
      //   })
    },
    onErrorClick() {
      this.loadMore.error = false;
      this.loadList();
    },
    onSpuClick(id) {
      console.log(id)
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${id}`,
      });
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':id}});
      // #endif
    },
    goBack() {
      uni.navigateBack();
    },
  },
  onReachBottom() {
    console.log("滚动加载");
    this.loadList();
  },
};
</script>

<style lang="scss" scoped>
.title_fixed {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;
}
.last-odd:after {
  content: "";
  display: block;
  width: 330rpx;
  height: 0;
}
</style>
