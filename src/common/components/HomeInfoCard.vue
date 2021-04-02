<template>
  <view class="info-card hidden" @tap="onImgClick">
    <view class="relative">
      <image :src="imgUrl" :lazy-load="lazyLoad" mode="widthFix" class="w-full" :style="{'min-height':isVideo ? '502rpx' : ''}" />
      <image :src="IMAGE.HOME_ICON_PLAY" class="absolute translate-center w120 h120" v-if="isVideo">
    </view>
    <view class="content-wrapper row center-y" v-if="showGoods || showArticle ">
      <block v-if="showGoods">
        <view class="w-h96 mr20 ml40">
          <image :src="goodsImg.includes('http') ? goodsImg : IMAGE.NULL_GOODS_IMG" class="w-h-full" />
        </view>
        <view class="user-wrapper ellipsis flex-1 l-h40 mr12 ptb30">
          <view class="ellipsis fw600">{{ goodsName }}</view>
          <view class="ellipsis fs-sm color-red fw600">¥{{ goodsPrice | formatMoney}}</view>
        </view>
        <view class="ptb30 pr40" @tap.stop="buyTap">
          <view class="content-wrapper-buy h56 mt10 fw600" :class="{'filter-gray':salesStock <= 0}" >{{salesStock>0 ? "购买" : "补货中"}}</view>
        </view>
      </block>
      <block v-if="showArticle">
        <div class="w-full row mtb30">
          <div class="flex-1 row center" @tap.stop="onIcon('like')" style="border-right:1px solid #EFF2F6;">
            <image :src="isLike ? IMAGE.ICON_HEART_ACTIVE : IMAGE.ICON_HEART" class="w-h40 mr20" />
            <text>{{ likeNum }}</text>
          </div>
          <div class="flex-1 row center" @tap.stop="onIcon('share')">
            <image :src="IMAGE.ICON_SHARE" class="w-h40 mr20" />
            <text>{{ shareNum }}</text>
          </div>
        </div>
      </block>
    </view>
  </view>
</template>

<script>
import { 
  ICON_HEART_ACTIVE, ICON_HEART, ICON_SHARE, HOME_ICON_PLAY,
  NULL_GOODS_IMG, HOME_ICON_SOUND, HOME_ICON_PAUSE 
} from '@/imageConfig'
import { jumpLink } from "@/mixins";

export default {
  name: "HomeInfoCard",
  props: {
    articleId: {
      type: String,
      required: true
    },
    articleName:{
      type: String
    },
    //跳转id
    jumpSourceId: {
      type: String
    },
    //跳转类型
    jumpType: {
      type: [Number,String]
    },
    // 图片
    imgUrl: {
      type: String,
      required: true
    },
    // 商品名称
    goodsName: String,
    // 商品价格
    goodsPrice: Number,
    // 商品主图
    goodsImg: String,
    // 点赞数
    likeNum: Number,
    // 转发数
    shareNum: Number,
    //库存
    salesStock: Number,
    // 显示商品
    showGoods: {
      type: Boolean,
      default: false
    },
    // 显示文章（点赞-转发）
    showArticle: {
      type: Boolean,
      default: false
    },
    isLike: {
      type: Boolean,
      default: false
    },
    // 图片懒加载
    lazyLoad: {
      type: Boolean,
      default: true
    },
    // 是否视频类型
    isVideo:{
      type: [Boolean, Number],
      default: false
    }
  },
  mixins:[jumpLink],
  data() {
    return {
      IMAGE: {
        ICON_HEART_ACTIVE,
        ICON_HEART,
        ICON_SHARE,
        HOME_ICON_PLAY,
        HOME_ICON_SOUND, 
        HOME_ICON_PAUSE,
        NULL_GOODS_IMG
      },
      title:"专题"
    }
  },
  computed: {},
  methods:{
    buyTap(){
      this.$emit("buy-tap")
    },
    onImgClick() {
      if(this.jumpType && this.jumpType != 'null' || this.jumpSourceId && this.jumpSourceId != 'null'){
        console.log(this.jumpSourceId)
        this.$_selectPath(this.jumpType,{busId:this.jumpSourceId,title:this.articleName})
      }else{
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `${this.$pageUrl.ARTICLE}?id=${this.articleId}`
        });
        // #endif

        // #ifdef H5
        this.$flutter({ 
          method: 'TO_ARTICLE', data: { id: this.articleId }
        })
        // #endif
      }
    },
    onIcon(type) {
      this.$emit(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-card{
  width: 100%;
  border-radius: 26rpx;
  margin-bottom: 60rpx;
  box-shadow:0px 10rpx 58rpx 0px rgba(204,204,204,1);
  .content-wrapper{
    width: 100%;
    background-color: #ffffff;
    .user-wrapper{
      font-size: 24rpx;
      display: flex;
      flex-direction: column;
      .favorite-wrapper{
        display: flex;
        .favorites{
          padding-left: 8rpx;
          font-size: 24rpx;
        }
      }
    }
  }
}
.translate-center{
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 99;
}
.translate-left{
  bottom: 16rpx;
  left: 16rpx;
  z-index: 99;
}
.translate-right{
  bottom: 16rpx;
  right: 16rpx;
  z-index: 99;
}
.content-wrapper-buy{
  line-height:56rpx;
  background:rgba(255,209,0,1);
  border-radius:28rpx;
  font-weight:600;
  padding: 0 46rpx;
  text-align: center;
}
</style>
