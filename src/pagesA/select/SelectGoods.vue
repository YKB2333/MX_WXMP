<template>
  <view class="bg-primary min-h-full relative">
    <view class="bg-white">
      <!-- 搜索框 -->
      <view class="ptb20 shadow">
        <input 
          placeholder="请输入商品名称" 
          v-model="searchValue"
          placeholder-class="color-gray fs-sm text-center"
          style="background-color: #F5F5F5; width: 80%"
          class="text-center h60 l-h60 radius-round mauto"
          confirm-type="搜索"
          @confirm="onSearch"
        />
      </view>
      <!-- 商品列表 -->
      <view class="plr30">
        <view v-for="(item, index) in list" :key="index" class="ptb40 hairline-bottom row" @tap="onSelectGoods(item)">
          <image :src="item.skuImages | formatSkuImg(item.attrValueId)" class="w120 h120 mr30" mode="widthFix"/>
          <view class="flex-1 col space-between ellipsis">
            <view class="ellipsis fs-sm">{{ item.spuName }}</view>
            <view class="color-gray fs-mini">
              <text class="mr10">{{ item.ownSpec | formatSkuValues }}</text>
            </view>
            <view class="color-red fw600">¥{{ item.salesPrice | formatMoney }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 搜索为空 -->
    <view class="pos-center" v-if="isSearchNull">
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258" />
      <text class="block mt80 color-info text-center">没有搜索到宝贝呐~</text>
    </view>
  </view>
</template>

<script>
import { NULL_BOX_IMG } from '@/imageConfig'
import { searchSkus } from '@/api/goods/sku'

export default {
  name: "SelectGoods",
  data() {
    return {
      IMAGE: {
        NULL_BOX_IMG
      },
      searchValue: '',
      list: [],
      isSearchNull: false
    }
  },
  methods: {
    onSearch(e) {
      console.log('搜索词', this.searchValue)
      if (this.searchValue) {
        uni.showLoading()
        searchSkus(this.searchValue).then(res => {
          console.log('搜索结果', res.data)
          if (res.data.length) {
            this.list = res.data
            this.isSearchNull = false
          } else {
            this.list = []
            this.isSearchNull = true
          }
        }).finally(() => {
          uni.hideLoading()
        })
      }
    },
    // 点击商品
    onSelectGoods(item) {
      this.$eventHub.$emit(this.$eventName.SELECT_GOODS_SUCCESS, item)
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>