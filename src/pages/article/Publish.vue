<template>
  <view id="publish-article" style="padding-bottom: 120rpx;">
    <view class="plr30 pt30">
      <!-- 图片 -->
      <view class="layout-row gutter-10">
        <view class="layout-col-8" v-for="filePath in tempFilePaths" :key="filePath">
          <image :src="filePath" class="w-h224 mb10" />
        </view>
        <!-- 选择 -->
        <view class="layout-col-8">
          <image :src="IMAGE.CHOOSEIMG" class="w-h224" @click="onChooseImg" />
        </view>
      </view>
      <!-- 输入框 -->
      <view>
        <input 
          placeholder="请输入动态标题" 
          v-model="form.title" 
          class="ptb30 hairline-bottom block" 
          placeholder-class="color-gray" 
        />
        <textarea 
          placeholder="我想说..."
          v-model="form.content"
          placeholder-class="color-gray"
          class="ptb30 hairline-bottom block" 
          maxlength="-1"
          style="height: 160rpx;"
        />
      </view>
      <!-- 选择话题 -->
      <navigator url="/pagesA/select/SelectTopic">
        <view class="row ptb30 hairline-bottom center-y space-between">
          <text>#话题</text>
          <view>
            <text v-if="form.topic" class="mr60 plr36 ptb14 fs-sm radius-round" style="border: 1rpx solid #121314;">#{{ form.topic }}</text>
            <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" style="position: relative;top:4rpx;" />
          </view>
        </view>
      </navigator>
      <!-- 选择推荐商品 -->
      <view>
        <navigator url="/pagesA/select/SelectGoods">
          <view class="row ptb30 center-y space-between mb20">
            <text>推荐商品</text>
            <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" style="position: relative;top:4rpx;" />
          </view>
        </navigator>
        <!-- 商品 -->
        <view class="relative">
          <goods-box 
            :image="IMAGE.TEMP_SPU_IMG"
            name="Air Jordan 4 x Kaws 联名酷灰 AJ 4 鹿皮"
            :skus="['42码', '联名奶奶灰']"
            :price="1399"
          />
          <!-- 删除icon -->
          <image 
            :src="IMAGE.IMAGE" 
            class="delete-goods-icon"
            @click="onDeleteGoods"  
          />
        </view>
      </view>
    </view>
    <button class="w-full h100 l-h100 fw600 bg-theme fixed" style="bottom: 0;">发布</button>
  </view>
</template>

<script>
import GoodsBox from '_c/GoodsBox'
import { CHOOSEIMG, ARROW_RIGHT, TEMP_SPU_IMG } from '@/imageConfig'
export default {
  name: "PublishArticle",
  components: { GoodsBox },
  data() {
    return {
      IMAGE: {
        CHOOSEIMG,
        ARROW_RIGHT,
        TEMP_SPU_IMG
      },
      form: {
        files: [],
        title: '',
        content: '',
        topic: '潮牌推荐'
      },
      tempFilePaths: []
    }
  },
  methods: {
    // 调用微信API选择图片
    onChooseImg() {
      uni.chooseImage({
        count: 9,
        success: (res) => {
          // tempFilePath可以作为img标签的src属性显示图片
          console.log(res.tempFiles)
          console.log(res.tempFilePaths)
          this.tempFilePaths = res.tempFilePaths
        }
      })
    },
    // 删除商品
    onDeleteGoods() {
      console.log('删除商品')
    }
  }
}
</script>

<style lang="scss" scoped>
#publish-article{
  .delete-goods-icon{
    width: 28rpx;
    height: 28rpx;
    position: absolute;
    right: -10rpx;
    top: -10rpx;
  }
}
</style>