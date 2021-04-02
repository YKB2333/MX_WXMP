<template>
  <view class="info-card ">
    <view class="relative">
      <image :src="imgUrl" :lazy-load="lazyLoad" mode="widthFix" class="w-full" style="border-top-left-radius: 8rpx;border-top-right-radius:8rpx; max-height:600rpx;" />
      <image :src="IMAGE.ICON_PLAY" class="absolute translate-center w50 h50" v-if="isVideo">
    </view>
    <view class="content-wrapper " style="border-bottom-left-radius: 8rpx;border-bottom-right-radius:8rpx;">
      <view>
        <text class="ellipsis2 fw600">{{ title }}</text>
      </view>
      <view class="user-wrapper">
        <image :src="avatar.includes('http') ? avatar : IMAGE.AVATAR_DEFAULT" class="w-h40 radius-circle" />
        <text class="ellipsis flex-1 plr8">{{ nickName }}</text>
        <view class="favorite-wrapper">
          <image 
            :src="isFavorite ? IMAGE.ICON_HEART_ACTIVE : IMAGE.ICON_HEART" 
            class="w28 h24"
          />
          <text class="favorites">{{ favorites }}</text>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script>
import { ICON_HEART_ACTIVE, ICON_HEART, ICON_PLAY, AVATAR_DEFAULT } from '@/imageConfig'

export default {
  name: "InfoCard",
  props: {
    // 图片
    imgUrl: {
      type: String,
      required: true
    },
    // 标题
    title: {
      type: String,
      required: true
    },
    // 头像
    avatar: {
      type: String,
      required: true
    },
    // 昵称
    nickName: {
      type: String,
      required: true
    },
    // 收藏数
    favorites: {
      type: Number,
      required: true
    },
    // 是否已收藏
    isFavorite: {
      type: Boolean,
      required: true
    },
    // 图片懒加载
    lazyLoad: {
      type: Boolean,
      default: true
    },
    // 是否视频类型
    isVideo:{
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      IMAGE: {
        ICON_HEART_ACTIVE,
        ICON_HEART,
        ICON_PLAY,
        AVATAR_DEFAULT
      },
      num:0
    }
  },
  computed: {
    
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.info-card{
  width: 345rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  .content-wrapper{
    background-color: #ffffff;
    padding: 15rpx;
    .user-wrapper{
      font-size: 24rpx;
      display: flex;
      align-items: center;
      margin-top: 30rpx;
      .favorite-wrapper{
        display: flex;
        align-items: center;
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
</style>