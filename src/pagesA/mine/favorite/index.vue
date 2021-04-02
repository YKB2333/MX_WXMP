<template>
  <view class="pt40 ">
    <view class="plr40">
      <block v-for="(item, index) in listData" :key="item.id">
        <home-info-card 
          show-article
          :jump-type="item.jumpType || 'null'"
          :jump-source-id="item.jumpSourceId || 'null'"
          :article-id="item.id"
          :article-name="item.articleName"
          :img-url="item.articleImgVoList.find(e => e.cover === 1).url"
          :like-num="item.likeNum"
          :is-like="item.isLike"
          :share-num="item.shareNum"
          :is-video="item.type"
          @like="onLike(item, index)"
          @share="onShare(item)"
        />
      </block>
      <view>
        <div class="fs16 text-center fw600 mb40">为您推荐精选内容</div>
        <block v-for="(item, index) in recommendList" :key="item.id">
          <home-info-card 
            show-article
            :jump-type="item.jumpType || 'null'"
            :jump-source-id="item.jumpSourceId || 'null'"
            :article-id="item.id"
            :article-name="item.articleName"
            :img-url="item.articleImgVoList.find(e => e.cover === 1).url"
            :like-num="item.likeNum"
            :is-like="item.isLike"
            :share-num="item.shareNum"
            :is-video="item.type"
            @like="onLike(item, index, 'recomend')"
            @share="onShare(item)"
          />
        </block>
      </view>
    </view>
    <view class="color-gray fs-mini text-center pb20">
      <text v-if="state.finished">我是有底线的</text>
      <text v-else-if="state.loading">更多数据加载中...</text>
      <text v-else-if="state.error" @click="onErrorClick">加载失败，点击重试</text>
    </view>
    <van-popup
      :show="sharePopup"
      position="bottom"
      close-on-click-overlay
      @close="closePopup">
      <view class="hairline-bottom ptb40 col center bg-white" >
        <!-- <view v-if="integralShareConfig.obtainIntegral > 0" class="mb60" style="font-size:26rpx;">分享成功后可获得{{ integralShareConfig.obtainIntegral }}喵豆</view> -->
        <!-- #ifdef MP-WEIXIN -->
        <button class="share-btn" open-type='share' :style="{backgroundImage: 'url('+IMAGE.WECHAT_LOGO+')'}" />
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <image :src="IMAGE.WECHAT_LOGO" class="text-center w64 h64 mauto mb10" @tap="onWxShare()" />
        <!-- #endif -->
        <text class="fs-sm" style="color:#9D9FA3;">微信好友</text>
      </view>
      <view class="ptb30 text-center" @click="closePopup" style="font-size:26rpx;">取消</view>
    </van-popup>
  </view>
</template>

<script>
import { cancelLikeArticle, likeArticle ,shareArticle, getMyLikeList, getRecommendArticle} from '@/api/article'
import { getIntegralConfig } from '@/api/tools'
import HomeInfoCard from '_c/HomeInfoCard'
import { WECHAT_LOGO } from '@/imageConfig'
import { mapGetters } from 'vuex'

export default {
  name: 'MyFavorite',
  components: {
    HomeInfoCard
  },
  data() {
    return {
      IMAGE: {
        WECHAT_LOGO
      },
      query: {
        pageSize: 9999,
        pageNo: 1
      },
      recommendQuery: {
        pageSize: 20,
        pageNo: 1
      },
      total: 0, // 总条数
      listData: [],
      recommendList: [],
      state: {
        loading: false,
        error: false,
        finished: false
      },
      sharePopup: false,
      article: {},
      integralShareConfig: { // 分享喵豆配置
        enable: false,
        obtainIntegral: 0
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad(options) {
    if (options.total) {
      console.log(options.total)
      this.total = Number(options.total)
    }
    // #ifdef H5
    window.wxShareArticleCallback = this.wxShareArticleCallback
    // #endif
    this.loadList()
    this.loadRecommendList()
    this.fetchIntegalConfig()
  },

  methods: {
    loadList() {
      getMyLikeList(this.query).then(({ data }) => {
        // console.log(data)
        this.listData = data.list
      })
    },
    loadRecommendList() {
      if (this.state.loading || this.state.finished) return
      this.state.loading = true
      getRecommendArticle(this.recommendQuery).then(({ data }) => {
        // console.log(data)
        this.recommendList = this.recommendList.concat(data.list)
        if (!data.hasNextPage) {
          this.state.finished = true
        }
        this.recommendQuery.pageNo += 1
        this.state.error = false
      }).catch(err => {
        this.state.error = true
      }).finally(() => {
        this.state.loading = false
        // #ifdef H5
        this.$flutter({ method: 'HIDE_LOADING' })
        // #endif
      })
    },
    onErrorClick() {
      this.state.error = false
      this.loadRecommendList()
    },
    onLike(item, index, recomend) {
      console.log(item)
      if (item.isLike) { // 取消
        uni.showModal({
          content: '确定取消喜欢？',
          success: (t) => {
            if (t.confirm) {
              cancelLikeArticle(item.id).then(res => {
                if (recomend) {
                  item.isLike = false
                  } else {
                  this.listData.splice(index, 1)
                }
                if (this.total >=1) this.total -= 1
              })
            }
          }
        });
      } else {  
        likeArticle(item.id).then(res => {
          item.isLike = true
          this.total += 1
        })
      }
    },
    onShare(item) {
      console.log('当前内容====== ',item)
      this.article = item
      this.sharePopup = true
    },
    // 分享文章
    onWxShare() {
      try {
        uni.showLoading({ title: "正在打开微信", mask: true });
        let id = this.article.id // 分享id
        let title = this.article.articleName || '这篇文章超好看~' // 分享标题
        let description = this.article.articleName // 分享描述
        let thumbnail = this.article.articleImgVoList.find(e => e.cover === 1).url // 封面图
        this.$flutter({ method: 'WX_SHARE_ARTICLE', data: { id, title, description, thumbnail } })
      } catch (error) {
        console.log(error)
        uni.hideLoading();
      } finally {
        // 因为是异步的，所以这里会立即关闭掉
        // uni.hideLoading();
      }
    },

    // 微信分享回调
    wxShareArticleCallback(jsonStr) {
      console.log('微信分享回调  ============  ',jsonStr)
      this.closePopup()
      uni.hideLoading();
      if (JSON.parse(jsonStr).isSuccessful === 'true') {
        shareArticle(this.id).then(res => {
          this.shareNum = res.data.shareNum
          if (res.data.obtainIntegral > 0) {
            uni.showToast({
              title: '推荐文章成功',
              duration: 2000,
              icon:'none'
            });
          }
        })
      }
    },
    closePopup() {
      this.sharePopup = false
    },
    // 获取喵豆配置
    fetchIntegalConfig() {
      getIntegralConfig().then(res => {
        // console.log('喵豆配置', res.data)
        let shareIntegral = res.data.filter(item => item.dictType === 'GOODS_CONFIG' && item.dictKey === 'SHARE_THE_INTEGRAL')
        if (shareIntegral.length) {
          let target = shareIntegral[0]
          if (target.dictValue) {
            let json = JSON.parse(target.dictValue)
            if (json.enable) this.integralShareConfig = json
          }
        }
      })
    },
  },
  onReachBottom() {
    // console.log('滚动加载')
    this.loadRecommendList()
  },
  watch: {
    total(val) {
      let n = val || 0
      // #ifdef MP-WEIXIN
      uni.setNavigationBarTitle({
        title: `我的喜欢(${n > 99 ? '99+' : n})`
      });
      // #endif

      // #ifdef H5
      this.$flutter({ method: 'SET_FAVORITE_NUM', data: { likeNum: n } })
      // #endif
    }
  },
  onShareAppMessage(e) {
    this.closePopup()
    let obj = {
      title: this.article.articleName,
      path: `${this.$pageUrl.START}?sharePage=article&id=${this.article.id}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.article.articleImgVoList.find(e => e.cover === 1).url
    }
    return {
      ...obj
    }
  },
};
</script>
<style lang="scss" scoped>
.share-btn{
  width: 72rpx;
  height: 72rpx;
  margin-bottom: 20rpx;
  background-size: 100% 100%;
  padding: 0;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>