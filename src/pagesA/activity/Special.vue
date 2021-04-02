<template>
  <view class="page pb160" :style="{backgroundColor:'#'+ backgroundRgb}">
    <!-- <view>
      <view class="relative" v-for="(item,idx) in imgList" :key="idx">
        <image :src="IMAGE.LOGIN_POSTER" alt=""  class="w-full" mode="widthFix">
        <view class="absolute" :style="{width:m.width+'rpx',height:m.height+'rpx',top:m.top+'rpx',left:m.left+'rpx',border:'1rpx solid red'}" v-for="(m,n) in item.hotList" :key="n" @tap="onCarouselClick(item)"></view>
      </view>
    </view> -->
    <view v-if="banner">
      <image :src="banner" class="w-full" mode="widthFix" />
    </view>
    <block v-for="(item,idx) in customProjectList" :key="idx">
      <!-- 图片 -->
      <block v-if="item.type == 1">
        <view :style="{backgroundColor:'#'+item.backgroundRgb}" @tap="$_onBannerClick(item)">
          <image :src="item.data" class="w-full" mode="widthFix"  />
        </view>
      </block>
      <!-- 富文本 -->
      <block v-if="item.type == 3">
        <view class="ptb40 plr40" :style="{backgroundColor:'#'+item.backgroundRgb}" @tap="$_onBannerClick(item)">
          <rich-text :nodes="item.data | formatRichTextImg" @longpress="copyToClipboard(item.data)"></rich-text>
        </view>
      </block>
      <!-- 商品 -->
      <block v-if="item.type == 2">
        <view class="hidden" :style="{backgroundColor:'#'+item.backgroundRgb}">
          <!-- 商品数1-2个 -->
          <block v-if="item.spus && (item.spus.length == 1 || item.spus.length == 2)">
            <view class="col type-first mtb40">
              <view
                class="mlr40 row bg-white good-box mb22"
                style="border-radius: 8rpx;"
                v-for="(m,n) in item.spus"
                :key="n"
                :class="[m.status == 0 || m.salesStock == 0 || m.salesStock == null ? 'disabled' : '']"
                @tap="onSpuClick(m.id)"
              >
                <view class="spu-img-wrapper relative">
                  <image :src="m.skuOssImage" class="w-h160 m24" style="border-radius: 20rpx;" />
                  <view class="disabled-tag" v-if="m.status == 1">已下架</view>
                  <view class="disabled-tag" v-else-if="m.salesStock == 0 || m.salesStock == null">补货中</view>
                </view>
                <view class="flex-1 col space-around hidden mr32 mtb28">
                  <view class="ellipsis2 fw600">{{ m.spuName }}</view>
                  <view class="row space-between center-y">
                    <view>
                      <text class="color-red fw600 fs-sm mr8"
                        >¥{{ m.salesPrice | formatMoney }}</text
                      >
                      <text class="color-gray fw600 fs-sm delete-line"
                        >¥{{ m.platformPrice | formatMoney }}</text
                      >
                    </view>
                    <view class="buy-btn l-h56 bg-theme plr34 fw600">
                      去购买
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </block>
          <!-- 商品数3-6个 -->
          <block v-if="item.spus && (item.spus.length == 3 || item.spus.length >= 6)">
            <view class="col type-first mt40 mb20">
              <view class="row mlr40 space-between wrap">
                <block 
                  v-for="(m,n) in item.spus"
                  :key="n">
                  <view v-if="n<6" @tap="onSpuClick(m.id)" >
                    <spu-card
                      card-type="c-sm"
                      :spu-img="m.skuOssImage"
                      :spu-name="m.spuName"
                      :subTitle="m.title"
                      :sell-price="m.salesPrice"
                      :origin-price="m.platformPrice"
                      :status="m.status"
                      :replenish="m.salesStock == 0 || m.salesStock == null"
                    />
                  </view>
                </block>
              </view>
              <view 
                v-if="item.spus.length > 6"
                class="l-h88 mlr40 mb20 text-center bg-white fs-lg" 
                style="border: 1rpx solid #E2E3E9;border-radius: 10rpx;"
                @tap="moreGoods(item)"
                >
                查看更多
              </view>
            </view>
          </block>
          <!-- 商品数4个 -->
          <block v-if="item.spus && item.spus.length == 4">
            <view class="col type-first mt40 mb20">
              <view class="row mlr40 space-between wrap">
                <view 
                  @tap="onSpuClick(m.id)"    
                  v-for="(m,n) in item.spus"
                  :key="n">
                  <spu-card
                    card-type="c"
                    :spu-img="m.skuOssImage"
                    :spu-name="m.spuName"
                    :subTitle="m.title"
                    :sell-price="m.salesPrice"
                    :origin-price="m.platformPrice"
                    :status="m.status"
                    :replenish="m.salesStock == 0 || m.salesStock == null"
                  />
                </view>
              </view>
            </view>
          </block>
          <!-- 商品数5个 -->
          <block v-if="item.spus && item.spus.length == 5">
            <view class="col type-first mt40 mb20">
              <block v-for="(m,n) in item.spus" :key="n">
                <view
                  v-if="n<2"
                  class="mlr40 row bg-white good-box mb22"
                  style="border-radius: 20rpx;border: 1rpx solid #E1E3E8;"
                  :class="[m.status == 0 || m.salesStock == 0 || m.salesStock == null ? 'disabled' : '']"
                  @tap="onSpuClick(m.id)"
                >
                  <view class="spu-img-wrapper relative">
                    <image :src="m.skuOssImage" class="w-h160 m24" style="border-radius: 20rpx;" />
                    <view class="disabled-tag" v-if="m.status == 1">已下架</view>
                    <view class="disabled-tag" v-else-if="m.salesStock == 0 || m.salesStock == null">补货中</view>
                  </view>
                  <view class="flex-1 col space-around hidden mr32 mtb28">
                    <view class="ellipsis2 fw600">{{ m.spuName }}</view>
                    <view class="row space-between center-y">
                      <view>
                        <text class="color-red fw600 fs-sm mr8"
                          >¥{{ m.salesPrice | formatMoney }}</text
                        >
                        <text class="color-gray fw600 fs-sm delete-line"
                          >¥{{ m.platformPrice | formatMoney }}</text
                        >
                      </view>
                      <view class="buy-btn l-h56 bg-theme plr34 fw600">
                        去购买
                      </view>
                    </view>
                  </view>
                </view>
              </block>
              <view class="row mlr40 space-between">
                <block v-for="(m,n) in item.spus" :key="n">
                  <view 
                    @tap="onSpuClick(m.id)"    
                    v-if="n>=2">
                    <spu-card
                      card-type="c-sm"
                      :spu-img="m.skuOssImage"
                      :spu-name="'商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名'"
                      :sell-price="'129'"
                      :origin-price="'139'"
                      :status="'1'"
                      :replenish="false"
                    />
                  </view>
                </block>
              </view>
            </view>
          </block>
        </view>
      </block>
    </block>
    <view class="color-gray fs-mini l-h20 text-center ptb40 ">
      <text v-if="loadMore.finished">我是有底线的</text>
      <text v-if="loadMore.loading">更多数据加载中...</text>
      <text v-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
    </view>
    <view class="fixed bg-pink color-white fenBtn" @tap="onShareTap(1)">分享给好友</view>
    <!-- <view class="mlr40 bg-white text-center" @tap="getMessage">
      授权订阅消息
    </view> -->
    <!-- 分享弹窗 -->
    <van-popup
      :show="sharePopup"
      position="bottom"
      close-on-click-overlay
      @close="closePopup('share')">
      <view class="hairline-bottom ptb40 col center bg-white" >
        <!-- <view v-if="integralShareConfig.obtainIntegral > 0" class="mb60">分享成功后可获得{{integralShareConfig.obtainIntegral}}喵豆</view> -->
        <view class="flex w-full row space-around">
          <view class="text-center">
            <!-- #ifdef MP-WEIXIN -->
            <button :style="{backgroundImage: 'url('+IMAGE.WECHAT_LOGO+')'}" class="share-btn" open-type='share' />
            <!-- #endif -->
             <!-- #ifdef H5 -->
            <image :src="IMAGE.WECHAT_LOGO" class="text-center w64 h64 mauto mb10" @tap="onWxShare()" />
            <!-- #endif -->
            <view class="text-center fs-sm" style="color:#9D9FA3;">微信好友</view>
          </view>
        </view>
      </view>
      <view class="ptb30 text-center" @click="closePopup('share')">取消</view>
    </van-popup>
  </view>
</template>

<script>
import { LOGO, LOGIN_POSTER, ICON_RETURN } from "@/imageConfig";
import { getCustomProject } from "@/api/activity";
import { getIntegralConfig } from '@/api/tools'
import { shareGoods } from '@/api/goods/spu'
import { shareTimeline, jumpLink } from "@/mixins";
import { NULL_GOODS_IMG, WECHAT_LOGO } from "@/imageConfig";
import SpuCard from '_c/SpuCard'
import { mapGetters } from "vuex"
import { copyToClipboard } from '@/utils'
import { javascriptChannelName } from '@/config'


export default {
  components:{ SpuCard },
  mixins:[shareTimeline, jumpLink],
  data() {
    return {
      IMAGE: {
        NULL_GOODS_IMG,
        WECHAT_LOGO
      },
      type:"",//专题类型
      activityId:"",
      customProjectList:[],
      banner:"",
      backgroundRgb:"",
      shareImgUrl:"",
      title:"",
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      sharePopup: false, // 分享弹窗
      integralShareConfig: { // 分享喵豆配置
        enable: false,
        obtainIntegral: 0
      }, 
    };
  },
  computed: {
    ...mapGetters(['token', 'userInfo']),
  },
  onLoad(options) {
    if (options.activityId) {
      console.log("options.activityId",options.activityId)
      this.type = options.type
      this.activityId = options.activityId
      // #ifdef H5
      window.wxShareArticleCallback = this.wxShareArticleCallback
      // #endif
      this.init();
      this.fetchIntegalConfig()
    }
  },
  methods: {
    init() {
      this.loadMore.finished = false;
      this.loadMore.loading = false;
      this.loadMore.error = false;
      this.fetchCustomProject()
    },
    //获取自定义专题数据
    fetchCustomProject(){
      getCustomProject({id:this.activityId}).then(res=>{
        let data = res.data;
        console.log(data)
        uni.setNavigationBarTitle({
          title: data.title || "活动商品",
        });
        this.banner = data.bannerImgUrl;
        this.backgroundRgb = data.backgroundRgb ? data.backgroundRgb : "";
        this.shareImgUrl = data.shareImgUrl
        this.title = data.title || "活动商品"
        this.customProjectList = data.customProjectBasics || [];
        console.log('商品列表', data.customProjectBasics)
        // if(data && data.shopThemeSpuVos && data.shopThemeSpuVos.length){
        //   this.FullGoodsList = this.FullGoodsList.concat(data.shopThemeSpuVos)
        //   this.goodsList = this.unique(this.FullGoodsList)
        //   console.log(this.goodsList,'去重后商品列表');
        // }else{
        this.loadMore.finished = true
        // }
        // this.loadMore.error = false
      }).catch((err) => {
        this.loadMore.error = true
        // console.log(err)
        // uni.showToast({
        //   mask:true,
        //   title:err
        // })
      }).finally(() => {
        this.loadMore.loading = false
      })
    },
    // 查看更多商品
    moreGoods(item) {
      console.log('查看更多  ',item.id)
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/goods-list/special-list?activityId=${item.id}`
      })
      // #endif

      // #ifdef H5
      this.$flutter({method:'SPECIAL_GOODS',data: {id:item.id,title:this.title}})  // 商品专题 （这里的查看更多用到了新接口）
      // #endif
    },
    onSpuClick(id){
      // #ifdef MP-WEIXIN
      uni.navigateTo({
         url: `/pages/spu/index?spuId=${id}`
      });
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{spuId:id}}) // 商品详情
      // #endif
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
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_LOGIN'})
        // #endif
      }
    },

    // 分享文章
    onWxShare() {
      try {
        uni.showLoading({ title: "正在打开微信", mask: true });
        let id = this.activityId // 分享id
        let title = "秒寻.好产品——"+this.title || '活动商品' // 分享标题
        let description = this.title // 分享描述
        let thumbnail = this.shareImgUrl // 封面图
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
      this.closePopup('share')
      uni.hideLoading();
      if (JSON.parse(jsonStr).isSuccessful === 'true') {
        shareGoods(this.activityId).then(res => {
          console.log('分享喵豆', res.data)
          if (res.data > 0) {
            uni.showToast({title: `分享活动+${res.data}喵豆`})
          }
        })
      }
    },
    getMessage(){
      var that = this;
      //这里增加获取用户订阅消息权限，需要将申请的模板id填写进来。这里填写你自己的
      var template_ids = ["t26hxmI5RjUIk0r2ESE4G7CMPl5m55q2GGKZL4a32Yk" ];
      //默认不能发送消息，当用户明确选择了允许才可以发.
      var can_send = 0;
      var data = {
        // order_sn: e.currentTarget.dataset.id,
        can_send: can_send
      };
      wx.requestSubscribeMessage({
        tmplIds: template_ids,
        success:function( res ){
          console.log(res);
          // for (var tmp_id of template_ids ){
          //   if (res.hasOwnProperty(tmp_id) && res[tmp_id] == "accept"){
          //     can_send = 1;
          //   }  
          // }
          // data['can_send'] = can_send;
          //成功调用支付下单
          // that.doPay( data );
        },
        fail:function( res ){
          //失败调用支付下单
          // that.doPay(data);
        }
      });
    },
    copyToClipboard
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
      path: `/pages/start/index?sharePage=special&activityId=${this.activityId}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.shareImgUrl || this.banner
    }
    return {
      ...obj
    }
  },
  onShareTimeline(){
    let obj = {
      title: "秒寻.好产品——"+this.title,
      query:`sharePage=special&activityId=${this.activityId}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.shareImgUrl || this.banner
    }
    return {
      ...obj
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  .title {
    font-size: 40rpx;
    font-weight: 500;
    color: #9e9b79;
  }
  .disabled-tag {
    display: none;
  }
  .disabled {
    .spu-img-wrapper image {
      opacity: 0.5;
    }
    .disabled-tag {
      display: block;
      position: absolute;
      color: #ffffff;
      width: 140rpx;
      height: 48rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 20rpx;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 48rpx;
    }
    .spu-name {
      color: #121314;
    }
  }
  .color-gray{
    font-weight: 500;
    color: #9EA0A4;
  }
  .buy-btn{
    background: #FFDA00;
    border-radius: 28rpx;
  }
  .type-first{
    .good-box:last-of-type{
      margin-bottom: 0 !important;
    }
  }
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
}
.pb160{
  padding-bottom: 160rpx;
}
</style>
