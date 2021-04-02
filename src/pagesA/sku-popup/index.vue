<template>
  <van-popup
    :show="popup"
    position="bottom"
    round
    :close-on-click-overlay="true"
    :z-index="1000000000"
    @click-overlay="onClickOverlay"
  >
    <view class="sku-popup-page">
      <block v-if="pageLoading">
        <view style="height: 200px;" class="row center">
          <van-loading color="#FFD100" />
        </view>
      </block>
      <block v-else>
        <!-- <vip-bar :svip="svip" :sales-price="salesPrice" :obtainAmount="obtainAmount" /> -->
        <view class="row plr32 ptb30 hairline-bottom relative">
          <view slot="platform-price-right" style="position:absolute; right: 32rpx; top: 30rpx; z-index: 10000000001;" @tap="onClose">
            <van-icon name="close" color="#9DA0A4" size="28" />
          </view>
          <view v-if="carousel.length"><image :src="carousel[0].imgUrl" class="w-h200 mr20" /></view>
          <view class="flex-1 col ptb20 space-between">
            <price-info :platform-price="platformPrice" :sales-price="salesPrice"></price-info>
            <view class="fs-sm mt8">
              <text>库存{{ salesStock }}件</text>
              <text class="color-red" v-if="salesStock < 10">（库存紧张）</text>
            </view>
            <view class="fs-sm">已选：{{ selectValues }}</view>
          </view>
        </view>
        <view class="flex-1 y-scroll">
          <view class="hairline-bottom plr32 pb20" v-for="attr in attributeKeys" :key="attr.id">
            <view class="fs-sm mb16 mt30">{{ attr.attrName }}</view>
            <view>
              <sku
                v-for="(value, k) in attr.values" :key="k"
                :sku-type="attr.attrType" 
                :attr-value="value.attrValue"
                :attr-img="value.attrImg"
                :active="isSkuActive(value.attrName, value.attrValue)"
                :disabled="isSkuDisabled(value.attrName, value.attrValue)"
                @click.native="onSkuClick(value)"
              />
            </view>
          </view>
          <view class="row space-between center-y plr32 ptb40">
            <view class="fs-sm">
              <text>购买数量</text>
              <text class="color-gray">(限购{{ limitBuyCount }}件)</text>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <van-stepper 
              :value="stepperValue"
              @change="onStepperChange"
              :min="1" 
              :max="limitBuyCount"
              :disable-input="false"
              plus-class="stepper-icon-jia" 
              minus-class="stepper-icon-jian" 
              input-class="stepper-icon-input" 
            />
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <van-stepper 
              :value="stepperValue"
              @change="onStepperChange"
              :min="1" 
              :max="limitBuyCount"
              :disable-input="true"
              plus-class="stepper-icon-jia" 
              minus-class="stepper-icon-jian" 
              input-class="stepper-icon-input" 
            />
            <!-- #endif -->
          </view>
        </view>
        <bottom-bar 
          only-add-cart-btn
          :cart-count="cartCount"
          :spu-status="status"
          :sales-stock="salesStock"
          @on-cart-tap="onCartTap"
          @on-add-cart-tap="onAddCartTap"
          :hide-add-cart-text="addCartLoading">
          <view slot="loading-cart" v-if="addCartLoading">
            <van-loading color="#FFD100" />
          </view>
        </bottom-bar>
      </block>
    </view>
  </van-popup>
</template>

<script>
import PriceInfo from '_c/spu-info/PriceInfo'
import BottomBar from '_c/spu-info/BottomBar'
import Sku from '_c/spu-info/Sku'
import { getSpuDetail } from '@/api/goods/spu'
import { isObjectEqual, deepClone} from '@/utils'
import { addCart } from '@/api/order/cart'
// import VipBar from '_c/spu-info/VipBar'

export default {
  name: 'SkuPopup',
  components: { PriceInfo, BottomBar, Sku, 
  // VipBar
   },
  data() {
    return {
      popup: false, // 是否显示弹窗
      pageLoading: false, // 弹窗loading状态
      cartCount: 0, // 购物车图标数量
      svip: 0, // 0非达人
      status: 1, // 1上架，0下架
      currentSku: {},
      attributeKeys: [],
      skuList: [], // sku列表
      carousel: [], // sku图片列表
      stepperValue: 1, // 进步器的值，即选择加入购物车的数量
      ownSpec: {},
      addCartLoading: false, // 加入购物车按钮loading状态
    }
  },
  computed: {
    salesPrice() { // 销售价
      return this.currentSku.salesPrice || 0
    },
    platformPrice() { // 市场价
      return this.currentSku.platformPrice || 0
    },
    salesStock() { // 库存
      return this.currentSku.salesStock || 0
    },
    obtainAmount() {
      return this.currentSku.obtainAmount || 0
    },
    selectValues() {
      return Object.values(this.ownSpec).join(',')
    },
    // 限购买数量
    limitBuyCount() {
      let limit = this.currentSku.purchaseLimitNum || 0
      if (this.salesStock >= limit) {
        return limit
      } else {
        return this.salesStock
      }
    },
  },
  methods: {
    show({spuId, cartCount}) {
      this.popup = true
      this.pageLoading = true
      this.cartCount = cartCount
      getSpuDetail(spuId).then(res => {
        if (res.data) {
          let data = res.data
          this.attributeKeys = data.attributeKeys
          this.skuList = data.skuList
          this.status = data.status
          this.currentSku = this.skuList[0]
          this.ownSpec = JSON.parse(this.currentSku.ownSpec);
          this.getCarousel()
          console.log(this.attributeKeys)
        } else {
        }
      }).catch(error => {
      }).finally(() => {
        this.pageLoading = false
      })
    },
    hide() {
      this.popup = false
    },
    onClickOverlay() {
      console.log('onClickOverlay')
      this.popup = false
    },
    onClose() {
      this.popup = false
    },
    isSkuActive(attrName, attrValue) {
      if (this.ownSpec[attrName] === attrValue) {
        return true
      }
      return false
    },
    isSkuDisabled(attrName, attrValue) {
      let copy = deepClone(this.ownSpec)
      if (copy.hasOwnProperty(attrName) && copy[attrName] !== attrValue) {
        copy[attrName] = attrValue
        let exist = this.skuList.some(e => isObjectEqual(JSON.parse(e.ownSpec), copy))
        return !exist
      }
      return false
    },
    getCarousel() {
      for(let i = 0; i < this.attributeKeys.length; i++) {
        let attr = this.attributeKeys[i]
        for(let j = 0; j < attr.values.length; j++) {
          let value = attr.values[j]
          if (value.id === this.currentSku.attrValueId) {
            if (value.skuImages && value.skuImages.length > 0) {
              this.carousel = value.skuImages.filter(e => e.type > 0)
              break
            }
          }
        } 
      }
    },
    // 点击sku
    onSkuClick(value) {
      if (this.isSkuActive(value.attrName, value.attrValue) || this.isSkuDisabled(value.attrName, value.attrValue)) {
        return
      }
      let copy = deepClone(this.ownSpec)
      copy[value.attrName] = value.attrValue
      console.log(copy)
      let idx = this.skuList.findIndex(e => isObjectEqual(copy, JSON.parse(e.ownSpec)))
      if (idx >= 0) {
        this.currentSku = this.skuList.find(e => isObjectEqual(copy, JSON.parse(e.ownSpec)))
        console.log('currentSku', this.currentSku)
        this.ownSpec = JSON.parse(this.currentSku.ownSpec)
        this.getCarousel()
      }
    },
    onCartTap() {
      this.$emint('onCartTap')
    },
    onAddCartTap() {
      let quantity = this.stepperValue
      let skuId = this.currentSku.id
      this.addCartLoading = true;
      addCart(quantity, skuId).then(res => {
        // let price = 0
        // if (this.svip == 1) {
        //   price = this.salesPrice - this.obtainAmount <= 0 ? 0 : this.salesPrice - this.obtainAmount
        // } else {
        //   price = this.salesPrice
        // }
        this.$emit('change', { quantity: quantity, skuId: this.currentSku.id, purchaseLimitNum: this.currentSku.purchaseLimitNum, spuId: this.currentSku.spuId, price: this.salesPrice })
        this.popup = false
        uni.showToast({ title: '已加入购物车', icon: 'none', duration: 2000 })
        // 弹窗购物车数量重置为1
        this.stepperValue = 1
      }).finally(res => {
        this.addCartLoading = false;
      })
    },
    onStepperChange(e) {
      // console.log(e.detail)
      this.stepperValue = e.detail
    },
  }
}
</script>

<style lang="scss" scoped>
.sku-popup-page{
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  /deep/ .stepper-icon-jia{
    width: 56rpx !important;
    height: 56rpx !important;
    border: none !important;
  }
  /deep/ .stepper-icon-jian{
    width: 56rpx !important;
    height: 56rpx !important;
    border: none !important;
  }
  /deep/ .stepper-icon-input{
    width: 90rpx !important;
    height: 56rpx !important;
    border: none !important;
  }
}
</style>
