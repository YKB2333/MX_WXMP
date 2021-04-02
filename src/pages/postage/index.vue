<template>
  <view id="postage">
    <view>
      <!-- 表头 -->
      <view class="row">
        <view class="flex-2 text-center p30 border-r-b color-info">配送区域</view>
        <view class="flex-1 text-center p30 border-b color-info">包邮规则</view>
      </view>
      <!-- 表格内容 -->
      <view class="row" v-for="freeShippingRegionInfo in maxPriorityFreeShippingTpl.freeShippingRegionInfoList" :key="freeShippingRegionInfo.id">
        <view class="flex-2 text-center p30 border-r-b">
          {{maxPriorityFreeShippingTpl.regionType == 1 ? '全国' : freeShippingRegionInfo.cityName}}
        </view>
        <view class="flex-1 text-center p30 border-b">满{{freeShippingRegionInfo.fee | formatMoney}}元，免运费</view>
      </view>
    </view>
    <view v-if="false" class="color-gray fs-sm text-center mt40">备注：如果多个包邮规则叠加，则按照最优惠原则计算运费金额</view>
  </view>
</template>

<script>

export default {
  name: "Postage",
  data() {
    return {
      maxPriorityFreeShippingTpl: {}
    }
  },
  onLoad(options){
    if(options.tpl){
      this.maxPriorityFreeShippingTpl = JSON.parse(options.tpl)
    }
  }
}
</script>

<style lang="scss" scoped>
#postage{
  .border-b{
    border-bottom: 1px solid #EEF2F6;
  }
  .border-r-b{
    border-bottom: 1px solid #EEF2F6;
    border-right: 1px solid #EEF2F6;
  }
}
</style>