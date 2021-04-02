<template>
  <view class="pt30 pb30" style="border-radius:16rpx;">
    <view @tap="jump2article">
      <view class="row mb26 fw600">
        <image
          :src="article.authorAvatar || IMAGE.AVATAR_DEFAULT"
          class="w-h64 mr32 radius-circle"
        />
        <view class="col">
          <text style="font-size:26rpx;">{{ article.authorName }}</text>
          <view class="fs-mini mr32 color-gray-simple">{{
            article.createTime | formatTime('Y/M/D h:m:s')
          }}</view>
        </view>
      </view>
      <view class="mb30">{{ article.articleName }}</view>
    </view>
    <!-- 图片类型 -->
    <view v-if="article.type === 0" style="overflow:hidden;white-space:nowrap;">
      <scroll-view scroll-x="true" style="width:auto;overflow:hidden;">
        <image
          v-for="image in article.articleImg"
          :key="image.id"
          :src="image.url"
          class="w-h180 mr16 talkImg"
          mode="aspectFill"
          @tap="previewImage(article.articleImg, image.url)"
        />
      </scroll-view>
    </view>
    <!-- 视频类型 -->
    <view v-if="article.type === 1" class="video-wrapper">
      <video
        :src="videoList[0].url"
        :poster="carousel[0].url"
        show-mute-btn
        muted
      ></video>
    </view>
  </view>
</template>

<script>
import { AVATAR_DEFAULT } from "@/imageConfig";

export default {
  name: "Talk",
  props: {
    article: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      IMAGE: {
        AVATAR_DEFAULT,
      },
      videoList: "",
    };
  },
  computed: {
    // 轮播图 与视频
    carousel() {
      let result = [];
      let data = this.article;
      if (data && data.articleImg && data.articleImg.length) {
        result = data.articleImg.filter((item) => {
          return item.type == 0;
        });
        // 获取视频
        this.videoList = data.articleImg.filter((item) => {
          return item.type == 1;
        });
      }
      return result;
    },
  },
  methods: {
    previewImage(data, url) {
      let arr = [];
      data.forEach((item) => {
        if (item.type == 0) {
          arr.push(item.url);
        }
      });
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: arr, // 需要预览的图片http链接列表
      });
    },
    jump2article() {
      uni.navigateTo({
        url: `/pages/article/index?id=${this.article.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.video-wrapper {
  video {
    width: 100%;
    height: 300rpx;
  }
}
.talkImg:last-of-type {
  border-radius: 12rpx;
  margin-right: 32rpx !important;
}
</style>
