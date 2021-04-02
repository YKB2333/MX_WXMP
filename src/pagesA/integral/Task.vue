<template>
  <view id="integral-task">
    <view class="relative">
      <image :src="IMAGE.INTEGRAL_BG_BANNER" class="w-full h260" mode="widthFix"  />
      <view class="content">
        <block v-if="token">
          <view class="fs-sm mb14">喵豆</view>
          <view class="row" style="align-items: flex-end;">
            <text style="font-size: 60rpx;" class="mr30 fw600">{{ userInfo && userInfo.avilableScore | million}}</text>
            <text class="fs-sm mb18" >（可抵扣{{ deduction | formatMoney(false) }}元）</text>
          </view>
        </block>
        <block v-else>
          <view class="login-btn" @click="$routerLink('/pages/login/Phone')">登录查看喵豆</view>
        </block>
      </view>
    </view>
    <view class="pt30 plr50">
      <view class="row" v-if="findIntegral('readArticle')">
        <image :src="IMAGE.INTEGRAL_ARTICLE_READ" class="w-h100 mr28"  />
        <view class="flex-1 col space-around">
          <text class="fw600">阅读文章+{{ findIntegral('readArticle') }}</text>
          <text class="fs-sm color-gray">阅读一篇好文，了解一个新奇、好玩的宝贝。</text>
        </view>
      </view>
      <view class="row mt60" v-if="findIntegral('commentArticle')">
        <image :src="IMAGE.INTEGRAL_ARTICLE_COMMENT" class="w-h100 mr28" />
        <view class="flex-1 col space-around">
          <text class="fw600">评论文章+{{ findIntegral('commentArticle') }}</text>
          <text class="fs-sm color-gray">释放你心中的想法，和大家一起讨论吧~</text>
        </view>
      </view>
      <!-- <view class="row mt60" v-if="findIntegral('shareArticle')">
        <image :src="IMAGE.INTEGRAL_ARTICLE_SHARE" class="w-h100 mr28" />
        <view class="flex-1 col space-around">
          <text class="fw600">分享文章+{{ findIntegral('shareArticle') }}</text>
          <text class="fs-sm color-gray">独乐乐不如众乐乐，把有意思的文章发给好友吧~</text>
        </view>
      </view>
      <view class="row mt60" v-if="findIntegral('shareGoods')">
        <image :src="IMAGE.INTEGRAL_GOODS_SHARE" class="w-h100 mr28" />
        <view class="flex-1 col space-around">
          <text class="fw600">分享商品+{{ findIntegral('shareGoods') }}</text>
          <text class="fs-sm color-gray">好宝贝，一起享~购买可能还有惊喜哦~</text>
        </view>
      </view> -->
      <view class="row mt60">
        <image :src="IMAGE.INTEGRAL_GOODS_BUY" class="w-h100 mr28" />
        <view class="flex-1 col space-around">
          <text class="fw600">购买商品</text>
          <text class="fs-sm color-gray">买就送喵豆，买就送喵豆，嗯，就是这样。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getIntegralConfig } from '@/api/tools'
import { 
  INTEGRAL_ARTICLE_COMMENT, 
  INTEGRAL_ARTICLE_READ, 
  INTEGRAL_ARTICLE_SHARE, 
  INTEGRAL_BG_BANNER, 
  INTEGRAL_GOODS_BUY,
  INTEGRAL_GOODS_SHARE
} from '@/imageConfig'

export default {
  name: "IntegralTask",
  data() {
    return {
      IMAGE: {
        INTEGRAL_ARTICLE_COMMENT: INTEGRAL_ARTICLE_COMMENT,
        INTEGRAL_ARTICLE_READ: INTEGRAL_ARTICLE_READ,
        INTEGRAL_ARTICLE_SHARE: INTEGRAL_ARTICLE_SHARE,
        INTEGRAL_BG_BANNER: INTEGRAL_BG_BANNER,
        INTEGRAL_GOODS_BUY: INTEGRAL_GOODS_BUY,
        INTEGRAL_GOODS_SHARE: INTEGRAL_GOODS_SHARE
      },
      integralConfig: []
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo']),
    // 计算喵豆抵扣
    deduction() {
      let result = 0
      if (this.token) {
        let index = this.integralConfig.findIndex(ele => ele.dictType === 'SYSTEM_CONFIG' && ele.dictKey === 'POINT_DEDUCTION' && ele.enabled)
        if (index !== -1) {
          let per = Number(this.integralConfig[index].dictValue)
          result = this.userInfo.avilableScore / per
        }
      }
      return result
    }
  },
  onLoad(options) {
    this.fetchIntegralConfig()
  },
  methods: {
    init() {
      this.fetchIntegralConfig()
      // if (this.token) {
      // }
    },
    // 获取后台喵豆配置
    fetchIntegralConfig() {
      getIntegralConfig().then(res => {
        console.log('喵豆配置', res.data)
        this.integralConfig = res.data
        this.findIntegral('readArticle')
      })
    },
    // 获取喵豆规则并显示
    findIntegral(type) {
      let result = ''
      let index = -1
      if (type === 'readArticle') { // 阅读文章
        index = this.integralConfig.findIndex(ele => ele.dictType === 'ARTICLE_CONFIG' && ele.dictKey === 'READ_THE_INTEGRAL')
      } else if (type === 'commentArticle') { // 评论文章
        index = this.integralConfig.findIndex(ele => ele.dictType === 'ARTICLE_CONFIG' && ele.dictKey === 'EVALUATE_THE_INTEGRAL')
      } else if (type === 'shareArticle') { // 分享文章
        index = this.integralConfig.findIndex(ele => ele.dictType === 'ARTICLE_CONFIG' && ele.dictKey === 'SHARE_THE_INTEGRAL')
      } else if (type === 'shareGoods') { // 分享商品
        index = this.integralConfig.findIndex(ele => ele.dictType === 'GOODS_CONFIG' && ele.dictKey === 'SHARE_THE_INTEGRAL')
      } 
      if (index >= 0) {
        let value = JSON.parse(this.integralConfig[index].dictValue)
        if (value.enable) {
          result = value.obtainIntegral
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
#integral-task{
  .content{
    position: absolute;
    left: 70rpx;
    right: 70rpx;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .login-btn{
    background-color: #ffffff;
    text-align: center;
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    margin-left: 20rpx;
    border-radius: 60rpx;
  }
}
</style>