<template>
  <view class="min-h-full" :style="{backgroundColor:'#'+bannerRgb}">
    <!-- <van-nav-bar
      :title="title"
      left-arrow
      fixed
    /> -->
    <view v-if="banner">
      <image :src="banner" class="w-full" mode="widthFix" />
    </view>
    <view style="padding-bottom:164rpx;">
      <view class="row wrap space-between pt40 plr40">
        <view @tap="onSpuClick(item.spuId)" v-for="(item, index) in goodsList" :key="index">
          <spu-card
            v-if="type == 4 || type == 99"
            card-type="a"
            :spu-img="item.spu.skuImage || IMAGE.NULL_GOODS_IMG"
            :spu-name="item.spu.spuName"
            :subTitle="item.spu.title"
            :sell-price="item.spu.salesPrice"
            :origin-price="item.spu.platformPrice"
            :is-label="item.spu.labelName"
            :is-youxuan="item.spu.preferred"
            :spu-activity-name="item.spu.spuActivityName"
            :status="item.spu.status"
            :replenish="item.spu.salesStock == 0 || item.spu.salesStock == null"
          />
          <spu-card
            v-if="type==3"
            card-type="a"
            :spu-img="item.skuImgUrl || IMAGE.NULL_GOODS_IMG"
            :spu-name="item.spuName"
            :subTitle="item.spu.title"
            :spu-activity-name="item.activityName"
            :sell-price="item.activityPrice"
            :origin-price="item.platformPrice"
            :is-youxuan="item.preferred"
            :status="item.status"
            :replenish="item.stock == 0 || item.stock == null"
            :is-label="item.labelNames ? item.labelNames[0] : null"
          />
            <!-- :spu-activity-name="'限时抢购'" -->
        </view>
      </view>
      <view class="color-gray fs-mini l-h20 text-center pt12 pb24 ">
        <text v-if="loadMore.finished">我是有底线的</text>
        <text v-if="loadMore.loading">更多数据加载中...</text>
        <text v-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
      </view>
    </view>
    <view class="fixed bg-pink fenBtn color-white" @tap="onShareTap(1)">分享给好友</view>
    <!-- 分享弹窗 -->
    <van-popup
      :show="sharePopup"
      position="bottom"
      close-on-click-overlay
      @close="closePopup('share')">
      <view class="hairline-bottom ptb40 col center bg-white" >
        <!-- <view v-if="integralShareConfig.obtainIntegral > 0" class="mb60">分享成功后可获得{{integralShareConfig.obtainIntegral}}喵豆</view> -->
        <view class="flex w-full row space-around">
          <view>
            <button :style="{backgroundImage: 'url('+IMAGE.WECHAT_LOGO+')'}" class="share-btn" open-type='share' />
            <view class="text-center fs-sm" style="color:#9D9FA3;">微信好友</view>
          </view>
        </view>
      </view>
      <view class="ptb30 text-center" @click="closePopup('share')">取消</view>
    </van-popup>
      

  </view>
</template>

<script>
import SpuCard from "_c/SpuCard";
import {
  getActivityGoods,
  getActivityDetail,
  getGoodsProject,
  getGoodsProjectSpu,
  getShopSmallResourcesById
} from "@/api/activity";
import { getIntegralConfig } from '@/api/tools'
import { shareGoods } from '@/api/goods/spu'
import { shareTimeline } from "@/mixins/shareTimeline";
import { NULL_GOODS_IMG, WECHAT_LOGO } from "@/imageConfig";
import { mapGetters } from 'vuex'

export default {
  name: "GoodsList",
  components: { SpuCard },
  mixins:[shareTimeline],
  data() {
    return {
      IMAGE: {
        NULL_GOODS_IMG,
        WECHAT_LOGO
      },
      goodsList: [], // 商品列表
      FullGoodsList: [], // 全部商品数据列表
      query: {
        pageNo: 0,
        pageSize: 20,
      },
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      banner: "",
      title:"",
      type:"",//限时购 3 或 商品专题 4 或 主题馆专题 99
      bannerRgb:"",
      activityId:"",
      shareImg:"",
      sharePopup: false, // 分享弹窗
      integralShareConfig: { // 分享喵豆配置
        enable: false,
        obtainIntegral: 0
      }, 
    };
  },
  computed: {
    ...mapGetters(['token','userInfo'])
  },
  onShow() {},
  onLoad(options) {
    if (options.activityId) {
      this.type = options.type
      this.activityId = options.activityId
      if(this.type == 3){
        this.query.activityId = options.activityId;
      }else if(this.type == 99){
        this.query.id = options.activityId;
      }else{
        this.query.goodsProjectId = options.activityId;
      }
      this.init();
      this.fetchIntegalConfig()
    }
  },
  methods: {
    init() {
      this.loadMore.finished = false;
      this.loadMore.loading = false;
      this.loadMore.error = false;
      this.query["pageNo"] = 0;
      this.goodsList = [];
      this.FullGoodsList = [];
      if(this.type==3){//限时购
        getActivityDetail(this.query.activityId).then(res => {
          // console.log('活动详情', res.data)
          let data = res.data
          uni.setNavigationBarTitle({
            title: data.activityName || '活动商品'
          })
          this.banner = data.headImg
          this.title = data.activityName || "活动商品"
          this.shareImg = data.shareImg
        })
      }else if(this.type == 4){//专题
        getGoodsProject(this.query.goodsProjectId).then((res) => {
          console.log("活动详情", res.data);
          let data = res.data;
          uni.setNavigationBarTitle({
            title: data.labelName || "活动商品",
          });
          this.banner = data.bannerImgUrl;
          this.bannerRgb = data.bannerRgb ? data.bannerRgb : "";
          this.shareImg = data.shareImg
          this.title = data.labelName || "活动商品"
        })
      }
      this.loadList();
    },
    loadList() {
      if (
        this.loadMore.finished ||
        this.loadMore.loading ||
        this.loadMore.error
      ) {
        // 如果已结束或在加载中或发生错误，不触发
        return;
      }
      this.query["pageNo"] += 1;
      this.loadMore.loading = true;
      if(this.type == 3){
        getActivityGoods(this.query).then(res => {
          let data = res.data
          console.log('商品列表', data.list)
          if(data.list && data.list.length>0){
            this.FullGoodsList = this.FullGoodsList.concat(data.list)
            this.goodsList = this.unique(this.FullGoodsList)
            console.log(this.goodsList,'去重后商品列表');
          }else{
            this.loadMore.finished = true
          }
          this.loadMore.error = false
        }).catch(() => {
          this.loadMore.error = true
          this.query['pageNo'] -= 1
        }).finally(() => {
          this.loadMore.loading = false
        })
      }else if(this.type == 99){
        getShopSmallResourcesById(this.query).then(res=>{
          let data = res.data
          uni.setNavigationBarTitle({
            title: data.title || "活动商品",
          });
          this.banner = data.bannerImgUrl;
          this.bannerRgb = data.bannerRgb ? data.bannerRgb : "";
          this.shareImg = data.shareImgUrl
          this.title = data.title || "活动商品"
          console.log('商品列表', data.shopThemeSpuVos)
          if(data && data.shopThemeSpuVos && data.shopThemeSpuVos.length){
            this.FullGoodsList = this.FullGoodsList.concat(data.shopThemeSpuVos)
            this.goodsList = this.unique(this.FullGoodsList)
            console.log(this.goodsList,'去重后商品列表');
          }else{
            this.loadMore.finished = true
          }
          this.loadMore.error = false
        }).catch(() => {
          this.loadMore.error = true
          this.query['pageNo'] -= 1
        }).finally(() => {
          this.loadMore.loading = false
        })
      }else{
        getGoodsProjectSpu(this.query)
          .then((res) => {
            let data = res.data;
            console.log("商品列表", data.list);
            if(data.list && data.list.length>0){
              this.FullGoodsList = this.FullGoodsList.concat(data.list);
              this.goodsList = this.unique(this.FullGoodsList);
              console.log(this.goodsList, "去重后商品列表");
            }else{
              this.loadMore.finished = true;
            }
            this.loadMore.error = false;
          })
          .catch(() => {
            this.loadMore.error = true;
            this.query["pageNo"] -= 1;
          })
          .finally(() => {
            this.loadMore.loading = false;
          });
      }
    },
    onErrorClick() {
      this.loadMore.error = false;
      this.loadList();
    },
    // 对象去重，根据spuid
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.spuId) && res.set(arr.spuId, 1));
    },
    closePopup(type) {
      if (type === 'share') {
        this.sharePopup = false
      } else if (type === 'spuDesc') {
        this.spuDescPopup['show'] = false
      } else if (type === 'buy') {
        this.disableScroll = false
        this.buyPopup = false
      }
    },
    // 立即分享
    onShareTap(type) {
      if (this.token) {
        if (type == 0) {
          this.sharePopup = true
        } else if (type == 1) {
          this.closePopup('buy')
          this.sharePopup = true
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
      }
    },
    // 获取喵豆配置
    fetchIntegalConfig() {
      getIntegralConfig().then(res => {
        console.log('喵豆配置', res.data)
        let shareIntegral = res.data.filter(item => item.dictType === 'ARTICLE_CONFIG' && item.dictKey === 'SHARE_THE_INTEGRAL')
        if (shareIntegral.length) {
          let target = shareIntegral[0]
          if (target.dictValue) {
            let json = JSON.parse(target.dictValue)
            if (json.enable) this.integralShareConfig = json
          }
        }
      })
    },
    onSpuClick(spuId){
      // #ifdef MP-WEIXIN
      console.log(spuId)
      uni.navigateTo({
         url: `/pages/spu/index?spuId=${spuId}`
      });
      // #endif
    }
  },
  onReachBottom() {
    console.log("滚动加载");
    this.loadList();
  },
  // 自定义转发 
  onShareAppMessage(e) {
    shareGoods(this.activityId).then(res => {
      console.log('分享喵豆', res.data)
      if (res.data > 0) {
        uni.showToast({title: `分享活动+${res.data}喵豆`})
      }
    })
    this.sharePopup = false;
    console.log(this.title)
    let obj = {
      title: "秒寻.好产品——"+this.title,
      path: `/pages/start/index?sharePage=goods&activityId=${this.activityId}&type=${this.type}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.shareImg || this.banner
    }
    return {
      ...obj
    }
  },
  onShareTimeline(){
    let obj = {
      title: "秒寻.好产品——"+this.title,
      query:`sharePage=goods&activityId=${this.activityId}&type=${this.type}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.shareImg || this.banner
    }
    return {
      ...obj
    }
  }
};
</script>

<style lang="scss" scoped>
.fenBtn{
  width:430rpx;
  line-height:100rpx;
  // box-shadow:0rpx 10rpx 25rpx 1rpx rgba(255,185,25,0.5);
  border-radius:50rpx;
  bottom: 64rpx;
  font-weight: 600;
  left: 50%;
  transform: translate3d(-50%,0,0);
  text-align: center;
}
.pb160{
  padding-bottom: 160rpx;
}
.share-btn{
    width: 100rpx;
    height: 100rpx;
    margin-bottom: 20rpx;
    background-size: 100% 100%;
    padding: 0;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
