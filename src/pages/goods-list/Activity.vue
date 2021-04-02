<template>
  <view class="bg-primary min-h-full">
    <view v-if="banners.length">
      <swiper :indicator-dots="banners.length > 1" indicator-color="#f4f4f4" indicator-active-color="#fedc01" autoplay="true" interval="2000">
        <swiper-item v-for="(imgUrl, index) in banners" :key="index">
          <image :src="imgUrl" mode='aspectFill' style="height: inherit; width: 100%;"></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="row wrap space-between pt20 plr40">
      <block v-for="(id, index) in goodsIds" :key="index">
        <view @tap="onSpuClick(id)">
          <spu-card v-if="getGoodsInfo(id)"
            card-type="a"
            :spu-img="getGoodsInfo(id) | getSpuImgOnAttr"
            :spu-name="getGoodsInfo(id, 'spuName')"
            :subTitle="getGoodsInfo(id, 'title')"
            :sell-price="getGoodsInfo(id, 'skuList') | formatSkuListValue('salesPrice')"
            :spu-activity-name="getGoodsInfo(id, 'spuActivityName')"
            :origin-price="getGoodsInfo(id, 'skuList') | formatSkuListValue('platformPrice')"
            :is-label="getGoodsInfo(id, 'labelName')"
            :status="getGoodsInfo(id, 'status')"
            :replenish="isReplenish(id)"
          />
        </view>
      </block>
    </view>
    <view class="color-gray fs-mini text-center ptb20">
      <text>我是有底线的</text>
    </view>
  </view>
</template>

<script>
import SpuCard from '_c/SpuCard'
import { getSpuDetail } from '@/api/goods/spu'

export default {
  name: 'ActivityGoodsList',
  components: { SpuCard },
  data() {
    return {
      goodsIds: [], // 商品ids
      goodsList: [], // 商品列表
      banners: [], // banner
    }
  },
  computed: {
  },
  onLoad(options) {
    let areaData  = JSON.parse(decodeURIComponent(options.areaData))
    uni.setNavigationBarTitle({ title: areaData.name })
    this.goodsIds = areaData.goodsIds
    if (areaData.banners && areaData.banners.length) {
      this.banners = areaData.banners
    }
    this.init()
  },
  methods: {
    init() {
      uni.showLoading()
      this.loadList()
      setTimeout(() => {
        uni.hideLoading()
      }, 1500)
    },
    // 加载商品列表
    loadList() {
      for(let id of this.goodsIds) {
        getSpuDetail(id).then(res => {
          if (res.data) {
            this.goodsList.push(res.data)
          }
          // console.log(this.goodsList)
        })
      }
    },
    getGoodsInfo(id, key) {
      // debugger
      let result = null
      this.goodsList.forEach(item => {
        if (item && item.id === id) {
          if (key) {
            result = item[key]
          } else {
            result = item
          }
        }
      })
      // console.log(result)
      return result
    },
    isReplenish(id) {
      let flag = false
      flag = this.getGoodsInfo(id, 'skuList').every(e => e.salesStock == 0 || e.salesStock == null)
      return flag
    },
    onSpuClick(id){
      // #ifdef MP-WEIXIN
      uni.navigateTo({
         url: `/pages/spu/index?spuId=${id}`
      });
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
