<template>
  <!-- 猜你喜欢 -->
  <view class="guess-goods bg-white pb20" v-if="guessGoods && guessGoods.length" :style="{'background-color':isWhiteBg ? '#F2F2F5':'#FFFFFF'}">
    <view class="fw600 plr32 pt40">猜你喜欢</view>
    <view class="mlr32 mt34 pb20 row space-between wrap spu-box" :style="{'background-color':isWhiteBg ? '#F2F2F5':'#FFFFFF'}">
      <view @tap="onSpuClick(item.id)" v-for="(item, index) in guessGoods" :key="index">
        <spu-card
          card-type="d"
          :spu-img="item.skuOssImage"
          :spu-name="item.spuName"
          :subTitle="item.title"
          :sell-price="item.salesPrice"
          :spu-activity-name="item.spuActivityName"
          :origin-price="item.platformPrice"
          :is-label="item.labelName"
          :is-youxuan="item.preferred"
          :status="item.status"
          :replenish="item.salesStock == 0 || item.salesStock == null"
        />
      </view>
    </view>
  </view>
</template>

<script>
import SpuCard from '_c/SpuCard'
import { guessLike } from '@/api/goods/spu'

export default {
  name: "GuessGoods",
  components: { SpuCard },
  props:{
    guessGoods:{
      type:Array,
      required: true
    },
    isWhiteBg:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      // 猜你喜欢商品
      // guessGoods: [],
    }
  },
  created() {
  },
  methods: {
    init(spuId) {
      let params = {
        pageIndex: 1,
        pageSize: 6,
      }
      if(spuId) {
        params.id=spuId
      }
      guessLike(params).then(res => {
        let data = res.data
        if(data){
          this.guessGoods = data
          console.log('猜你喜欢', this.guessGoods)
        }
      })
    },
    onSpuClick(id){
      // #ifdef MP-WEIXIN
      uni.navigateTo({
         url: `/pages/spu/index?spuId=${id}`
      });
      // #endif

      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':id}})
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.spu-box::after { 
  content: ""; 
  width:190rpx;
} 
</style>