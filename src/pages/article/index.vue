<template>
  <view id="article" :style="{'padding-bottom':execBottomHeight + 'px'}">
    <custom-nav>
      <view class="plr20">

        <!-- #ifdef MP-WEIXIN -->
        <view v-if="pagesDetail>=2" class="radius-circle w64 h64 relative" :style="{'background-color':'rgba(0,0,0,.2)'}" @tap="goBack">
          <!-- <van-icon name="arrow-left" size="12" custom-style="width:48rpx;height:48rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/> -->
          <image :src="IMAGE.ICON_RETURN" style="width:64rpx;height:64rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/>
        </view>
        <view v-else class="radius-circle w64 h64 relative" @tap="goBack">
          <image :src="IMAGE.GOODS_SPU_HOME" style="width:64rpx;height:64rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"/>
        </view>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="row space-between mt80">
          <view class="radius-circle w64 h64 relative" @tap="goBack">
            <image :src="IMAGE.ICON_RETURN_H5" style="width:64rpx;height:64rpx;potion:absolute; left:0; top:0; right:0; bottom:0; margin:auto;" />
          </view>
          <view class="radius-circle w64 h64 relative">
             <cart-icon :count="cartCount" @click.native="onClickWithSession('toCart')" />
          </view>
        </view>
        <!-- #endif -->
      </view>
    </custom-nav>
    <view class="top-container">
      <!-- 轮播图 -->
      <view v-if="carousel.length && article.type == 0">
        <block>
          <!-- #ifdef MP-WEIXIN -->
          <swiper 
            :style="{height:carousel[0].height / carousel[0].width * phoneW +'px', width: '100vw'}"
            :indicator-dots="true" 
            indicator-color="#f4f4f4" 
            indicator-active-color="#ff9ea8" 
            :autoplay="true" 
            interval="3000"
            @change="onCarouselChange" >
            <swiper-item v-for="(item, index) in carousel" :key="index">
              <image :src="item.url" mode='aspectFit' class="w-h-full" @tap="onPreviewImage(index)"></image>
            </swiper-item>
          </swiper>
          <!-- #endif -->

          <!-- #ifdef H5 -->
          <my-swiper 
            :style="{height:carousel[0].height / carousel[0].width * phoneW +'px', width: '100vw'}"
            :options="swiperOptions">
            <my-swiper-item v-for="(item, index) in carousel" :key="index">
              <image :src="item.url" mode='aspectFit' class="w-h-full" @tap="onPreviewImage(index)"></image>
            </my-swiper-item>
            <div class="swiper-pagination" slot="pagination"></div>
          </my-swiper>
          <!-- #endif -->
        </block>
      </view>
      <!-- 视频 -->
      <!-- <view class="video-wrapper" v-if="article.type == 1 ">
      </view> -->
      <view  v-if="videoContext != null && article.type == 1" class="relative" :style="{height:carousel[0].height / carousel[0].width * phoneW +'px', width: '100vw'}">
          <video 
            v-if="videoContext != null"
            :id="vid"
            :show-center-play-btn="false"
            :show-play-btn="playing"
            :src="videoList[0].url"
            class="w-h-full" 
            :enable-progress-gesture="false"
            @ended="onEnded"
            @pause="onPause"
            @play="onPlay"
            :show-fullscreen-btn="false"
          />
        <div v-if="!playing" class="absolute w-h-full" style="top:0;" >
          <image :src="carousel[0].url" mode="widthFix" class="video-image w-full" v-if="isVideoFirst" />
          <image 
            :src="IMAGE.HOME_ICON_PLAY" 
            class="w120 h120 pos-center"
            @tap="goPlay"
            v-if="showPlayBtn">
        </div>
      </view>
      <!-- 购物车按钮 -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="cart-btn-container" :style="{'top':navBarHeight + menuTop + 20 +'px'}">
        <cart-icon :count="cartCount" @click.native="onClickWithSession('toCart')" />
      </view>
      <!-- #endif -->
    </view>
    <!-- 文章区域 -->
    <view class="article-container">
      <!-- 商品 -->
      <view v-if="spuInfoVo.spuName" class="mb38">
        <goods-box 
          :image="spuInfoVo.imageUrl"
          :name="spuInfoVo.spuName"
          :price="spuInfoVo.salesPrice"
          :replenish="spuInfoVo.salesStock == 0 || spuInfoVo.salesStock == null"
          @click.native="toSpuDetail(spuInfoVo)"
        >
          <!-- <image v-if="spuInfoVo.salesStock > 0" :src="IMAGE.CART" class="w42 h40" @click.stop="onClickWithSession('addCart', spuInfoVo)" /> -->
          <view class="fw600 buy-btn bg-pink color-white" :class="{'filter-gray': spuInfoVo.salesStock == 0 || spuInfoVo.salesStock == null}"  @click.stop="buyTap(spuInfoVo)">购买</view>
        </goods-box>
      </view>
      <view class="fw600 fs-lg-big">
        <!-- <text v-if="article && article.topicName">#{{ article.topicName || '-' }}#</text> -->
        <text>{{ article.articleName || '-' }}</text>
      </view>
      <view class="row space-between center-y mtb40">
        <view class="row">
          <image :src="article.authorAvatar || IMAGE.AVATAR_DEFAULT" class="w-h80 radius-circle mr24" />
          <view class="col space-between">
            <text style="font-size:26rpx;">{{ article.authorName || '-' }}</text>
            <text class="color-gray fs-mini">{{ article && article.createTime | formatDateStr("yyyy-MM-dd") }}</text>
          </view>
        </view>
        <!-- <view class="focus-btn-wrapper">
          <view class="before-focus" v-if="!isFocus" @click="onClick('focus')">关注</view>
          <view class="after-focus" v-if="isFocus" @click="onClick('focus')">已关注</view>
        </view> -->
      </view>

      <view v-if="article && article.content">
        <rich-text :nodes="article && article.content | formatRichTextImg"></rich-text>
      </view>
    </view>
    <!-- 评论列表 -->
    <view class="comment-container" id="after-article">
      <view class="pt54 pb40 fw600 fs-lg-num row space-between center-y">
        <text>最新评论</text>
        <text class="fs-normal fw400" @tap="goComment">查看全部({{ totalComments > 99 ? '99+' :  totalComments}})</text>
      </view>
      <view class="pb30" v-if="commentList.length">
        <block v-for="(item, index) in commentList" :key="item.articleId">
          <comment-item 
            v-if="index<2"
            :avatar="item.uAvatar || IMAGE.AVATAR_DEFAULT"
            :nick-name="item.uName"
            :content="item.content"
            :is-zan="item.isLike"
            :zan-count="item.likeNum"
            @click.native="onLikeComment(item)"
          />
        </block>
      </view>
      <view v-else class="ptb80 text-center color-onfo">
        <image :src="IMAGE.NULL_BOX" class="w386 h258 mb40" />
        <view class="color-gray-simple">快来夸夸TA～</view>
      </view>
      <view class="row center-y">
      <!-- 用户头像 -->
        <image 
          :src="userInfo && userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT" 
          class="w-h72 mr30 radius-circle" 
        />
        <input placeholder="对美有追求的人，都喜欢评论" class="flex-1 fs-normal placeholderStyle" disabled @click="onClickWithSession('comment')" />
      </view>
    </view>
    <!-- 推荐列表 -->
    <view class="recommend-container bg-white">
      <view class="pt58 pb40 plr40 fw600 fs-lg-num row space-between center-y">
        <text>为你推荐</text>
      </view>
      <view class="col plr40 mb20" v-for="(item,n) in recommendList" :key="n">
        <home-info-card 
          :article-id="item.id"
          :article-name="item.articleName"
          :jump-type="item.jumpType || 'null'"
          :jump-source-id="item.jumpSourceId || 'null'"
          :img-url="item.articleImgVoList.find(e => e.cover === 1).url"
          :is-video="item.type"
          @buy-tap="buyTap"
        >
        </home-info-card>
        <!-- <view style="margin-top:-10rpx;">
          <comment-item 
            :avatar="item.authorAvatar || IMAGE.AVATAR_DEFAULT"
            :nick-name="item.authorName"
            :content="item.articleName"
            :is-zan="true"
            :zan-count="item.likeNum"
          />
        </view> -->
        <!-- <navigator :url="`/pages/article/index?id=${item.id}`">
          <image :src="item.articleImgVoList[0].url" :lazy-load="lazyLoad" mode="widthFix" class="mauto" style="width:100%;border-radius:16rpx" />
          <image :src="IMAGE.HOME_ICON_PLAY" class="absolute translate-center w120 h120">
        </navigator> -->
      </view>
    </view>
    <view class="color-gray fs-mini text-center pb20">
      <text v-if="finished">我是有底线的</text>
      <text v-if="loading">加载中...</text>
      <text v-if="error" @click="onErrorClick">请求发生错误，点击重新加载</text>
    </view>
    <!-- 底部悬浮栏 -->
    <view class="bottom-bar-container row center-y space-between">
      <view class="row">
        <view class="col center-y mr40 ml50" @click="onClick('like')">
          <image :src="isLike ? IMAGE.ICON_HEART_ACTIVE : IMAGE.ICON_HEART" class="w48 h48 mb8" />
          <text class="fs-sm fw600">{{ article.likeNum || 0 }}</text>
        </view>
        <view class="col center-y mr40" @click="goComment">
          <image :src="IMAGE.ICON_PINGLUN" class="w48 h48 mb8" />
          <text class="fs-sm fw600">{{ article.commentNum || 0 }}</text>
        </view>
        <view class="col center-y" @click="onClickWithSession('share')">
          <image :src="IMAGE.ICON_SHARE" class="w48 h48 mb8" />
          <text class="fs-sm fw600">{{ article.shareNum || 0 }}</text>
        </view>
      </view>
      <view class="plr42 h68 l-h68 bg-pink mr30 fw600 color-white" style="border-radius:34rpx;" :class="{'filter-gray': spuInfoVo.salesStock == 0 || spuInfoVo.salesStock == null}" @click.stop="buyTap(spuInfoVo)">
        立即购买
      </view>
    </view>
    <!-- 评论弹窗 -->
    <van-popup
      :show="showPopup"
      position="bottom"
      close-on-click-overlay
      @close="closePopup('comment')"
      @touchmove.stop.prevent="() => {}">
      <view class="plr30" :style="{ paddingBottom: keyboardHeight + 'px' }">
        <view class="hairline-bottom row space-between center-y" style="height:50px;">
          <view class="color-info" @click="closePopup('comment')">取消</view>
          <view class="bg-pink fw600 ptb14 plr30 radius-round color-white" @click="onConfirm">发布</view>
        </view>
        <view style="height: 100px;" class="pt30 hairline-bottom">
          <textarea 
            v-model="commentValue"
            placeholder="请输入..."
            placeholder-class="color-gray fs-normal"
            :focus="autoFocusCommentInput"
            @focus="onCommentInputFocus"
            @blur="onCommentInputBlur"
            class="fs-normal w-h-full"
          />
        </view>
      </view>
    </van-popup>

    <!-- 弹窗 -->
    <block>
      <!-- 购买弹窗 -->
      <van-popup
        :show="buyPopup"
        round
        :close-on-click-overlay="true"
        @click-overlay="closePopup('buy')">
        <view>
          <view class="row relative" style="padding:30rpx 164rpx;">
            <view slot="platform-price-right" style="position:absolute; right: 28rpx; top: 30rpx; z-index: 2;" @tap="closePopup('buy')">
              <image class="w-h40" :src="IMAGE.HOME_SKU_CLOSE" mode="widthFix"/>
            </view>
            <view v-if="skuCarousel.length"><image :src="skuCarousel[0].imgUrl" class="w-h300 mr20" /></view>
          </view>
          <view class="pb22 mlr28" style="border-bottom:1rpx solid #EEF1F6;">
            <view class="fw600 mb24 ellipsis" style="max-width:600rpx;">
              {{spuInfoVo.spuName}}
            </view>
            <view class="row space-between center-y">
              <view class="row center-y">
                <view class="color-red fw600 mr10">
                  ¥{{salesPrice | formatMoney}}
                </view>
                <view v-if="userInfo&&userInfo.levelCode>0&&type== 0" class="row center-y h32 l-h32 plr8 radius-mini" 
                style="width:fit-content;" 
                :style="{'background': userInfo&&userInfo.levelCode==1?'linear-gradient(90deg, #DEDEDE 0%, #BCC1C7 100%)':'linear-gradient(90deg, #FFE0A2 0%, #F9D08C 100%)'}">
                <image
                  :src="userInfo.levelCode==1?IMAGE.GOODS_ICON_SILVER:IMAGE.GOODS_ICON_GOLD"
                  class="w-h28 mr4"
                />
                <view class="fs-18 mr4" :style="{color:userInfo.levelCode==1?'#586475':'#9E783A'}">
                  {{`${userInfo.levelName}价`}}：¥ {{userLevelSalesPrice | formatMoney}}
                </view>
              </view>
              </view>
              <view class="fs-mini color-gray fw600" >
                市场价<text class="delete-line">¥{{platformPrice | formatMoney}}</text>
              </view>
            </view>
          </view>
          <view style="max-height: 50vh;" class="col">
            <view class="flex-1 y-scroll">
              <view class="pb20 mlr28" style="border-bottom:1rpx solid #EEF1F6;">
                <view v-for="attr in attributeKeys" :key="attr.id">
                  <view class="fs-sm mtb24">{{ attr.attrName }}<text class="ml6 fw400 color-gray fs-mini">已选: {{ selectValues }}</text></view>
                  <view>
                    <sku 
                      v-for="(value, k) in attr.attributeValuePos" :key="k"
                      :sku-type="attr.attrType" 
                      :attr-value="value.attrValue"
                      :attr-img="value.attrImg" 
                      :active="isSkuActive(attr.attrName, value.attrValue)"
                      :disabled="isSkuDisabled(attr.attrName, value.attrValue)"
                      @click.native="onSkuClick(attr.attrName, value)"
                    />
                </view>
              </view>
              </view>
              <view class="row space-between center-y ptb24 plr28" style="border-bottom:1rpx solid #EEF1F6;">
                <view class="fs-sm">
                  <text>购买数量</text>
                  <text class="color-gray">(限购{{ limitBuyCount || 0 }}件)</text>
                </view>
                <view class="row center-y">
                  <view class="fs-sm mr10" v-if="currentSku.salesStock < 10">
                    <text>库存{{ currentSku.salesStock }}件</text>
                  </view>
                  <!-- #ifdef MP-WEIXIN -->
                  <van-stepper 
                    :value="buyCount"
                    @change="onBuyCountChange"
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
                    :value="buyCount"
                    @change="onBuyCountChange"
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
              <view class="bg-pink color-white fs-lg fw600 l-h88 text-center mlr28 mt24 mb30" :class="{'filter-gray':!currentSku.salesStock}" style="border-radius:44rpx;margin:auto 0;" @tap="onBuyTap(1)" >
                  购买
              </view>
            </view>
          </view>
        </view>
      </van-popup>
      <!-- 分享弹窗 -->
      <van-popup
        :show="sharePopup"
        position="bottom"
        close-on-click-overlay
        @close="closePopup('share')">
        <view class="hairline-bottom ptb40 col center bg-white" >
          <!-- <view v-if="integralShareConfig.obtainIntegral > 0" class="mb60" style="font-size:26rpx;">分享成功后可获得{{ integralShareConfig.obtainIntegral }}喵豆</view> -->
          <view class="flex w-full row space-around">
            <view class="text-center">
              <!-- #ifdef H5 -->
              <image :src="IMAGE.WECHAT_LOGO" class="text-center w64 h64 mauto mb10" @tap="onWxShare()" />
              <!-- #endif -->
              <!-- #ifdef MP-WEIXIN -->
              <button :style="{backgroundImage: 'url('+IMAGE.WECHAT_LOGO+')'}" class="share-btn" open-type='share' />
              <!-- #endif -->
              <view class="text-center fs-sm" style="color:#9D9FA3;">微信好友</view>
            </view>
          </view>
        </view>
        <view class="ptb30 text-center" style="font-size:26rpx;" @click="closePopup('share')">取消</view>
      </van-popup>
      <!-- 授权弹窗 -->
      <van-popup
        :show="authPopup"
        position="bottom"
        round
        :close-on-click-overlay="true"
        @click-overlay="closePopup()">
        <auth-popup @close-popup="closePopup" @reload="reload"/>
      </van-popup>
    </block>
    <!-- 获得喵豆提示 -->
    <view class="integral-tips" v-if="showIntgralPopup.show">{{ showIntgralPopup.text }}+{{ showIntgralPopup.integral }}喵豆</view>
  </view>
</template>

<script>
import HomeInfoCard from '_c/HomeInfoCard'
import CommentItem from './components/CommentItem'
import CartIcon from '_c/CartIcon'
import GoodsBox from '_c/GoodsBox'
import Sku from '_c/spu-info/Sku'
import AuthPopup from "_c/AuthPopup";
import PriceInfo from '_c/spu-info/PriceInfo'
import BottomBar from '_c/spu-info/BottomBar'
// import VipBar from '_c/spu-info/VipBar'
import CustomNav from "_c/CustomNav";

import { 
  getCommentList, 
  likeArticle, cancelLikeArticle, 
  focus, shareArticle,
  likeComment, cancelLikeComment,
  addComment, read,
  getRecommendArticle, getArticleDetail
} from '@/api/article'
import { getSpuToEs } from '@/api/goods'
import { getIntegralConfig } from '@/api/tools'
import { createSmallProgramCode } from '@/api/tools'
import { mapGetters } from 'vuex'
import { getCartList, addCart } from '@/api/order/cart'
import { formatMoney } from '@/common/filters'
import { GOODS_ICON_SILVER, GOODS_ICON_GOLD, HOME_SKU_CLOSE, AVATAR_DEFAULT, CART, ICON_HEART_ACTIVE, ICON_HEART, ICON_SHARE, ICON_PINGLUN, NULL_BOX, WECHAT_LOGO, GOODS_SPU_HOME, ICON_RETURN,ICON_RETURN_H5,HOME_ICON_PLAY, } from '@/imageConfig'
import { isObjectEqual, debounce, deepClone } from '@/utils'
import { shareTimeline } from "@/mixins/shareTimeline";
import { javascriptChannelName } from '@/config'
// #ifdef H5
import { Swiper as MySwiper, SwiperSlide as MySwiperItem } from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'
// #endif

export default {
  name: "Article",
  // #ifdef MP-WEIXIN
  components: { CommentItem, CartIcon, GoodsBox, Sku, PriceInfo, BottomBar, 
  // VipBar, 
  HomeInfoCard, CustomNav, AuthPopup },
  // #endif
  // #ifdef H5
  components: { CommentItem, CartIcon, GoodsBox, Sku, PriceInfo, BottomBar, 
  // VipBar,
   HomeInfoCard, CustomNav, AuthPopup, MySwiper, MySwiperItem },
  // #endif
  data() {
    return {
      IMAGE: {
        AVATAR_DEFAULT,
        CART,
        ICON_HEART_ACTIVE,
        ICON_HEART,
        ICON_SHARE,
        NULL_BOX,
        WECHAT_LOGO,
        ICON_PINGLUN,
        GOODS_SPU_HOME,
        HOME_SKU_CLOSE,
        ICON_RETURN,
        ICON_RETURN_H5,
        GOODS_ICON_SILVER,
        GOODS_ICON_GOLD,
        HOME_ICON_PLAY,
      },
      integralShareConfig: { // 分享喵豆配置
        enable: false,
        obtainIntegral: 0
      },
      // 93637722865930241
      id: null, // 文章id
      article: null, // 文章详情数据
      isLike: false, // 是否点赞
      isFocus: false, // 是否关注
      spuInfoVo: {},
      currentCarouselIndex: 0, // 当前轮播索引
      showPopup: false, // 评论剔除
      commentValue: '', // 评论输入值
      commentQuery: {
        pageNo: 1,
        pageSize: 20,
        articleId: null,
      },
      pagesDetail: 0, //页面信息
      spuName: '', // 商品名称
      status: 1, // 是否下架，0下架 1上架
      isVip: 0, // 0非达人 1达人
      skuCarousel:[], // sku轮播图
      commentList: [], // 评论列表
      totalComments: 0, // 评论总数
      cartCount: 0, // 购物车数量
      sharePopup: false,
      videoList:[],//视频列表
      autoFocusCommentInput: false, // 是否自动聚焦评论输入框
      keyboardHeight: 0, // 键盘高度
      stopPageScroll: false,
      offsetTop: 0, // 文章底部距离顶部距离
      // 显示获得+喵豆弹窗
      showIntgralPopup: {
        show: false,
        text: '',
        integral: 0
      }, 
      execBottomHeight:0, //评论栏高度
      recommendList:[], //推荐列表
      recommendParams: {
        pageNo: 0,
        pageSize: 10,
      },
      finished: false,
      loading: false,
      error: false,
      ownSpec: {}, // 当前规格
      buyPopup:false, //购买弹窗
      attributeKeys: [],  // 规格
      currentSku: {}, // 当前sku
      type: 0 , //是否跨境
      skuList: [], // sku列表
      buyCount: 1, // 购买数量
      spuId: '', // 页面参数spuId(必传)
      skuId:'', // 页面参数skuId(非必传)
      isAndroid: false,
      phoneW:0,
      phoneH:0,
      authPopup:false, //授权弹窗
      routeOptions:null, //当前页面配置
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          bulletActiveClass: 'swiper-dot',
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper 
        observeParents: true, //修改swiper的父元素时，自动初始化swiper 
        loop: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 50,
        slidesPerView: 'auto',
      },
      showPlayBtn:false,
      playing:false,
      isVideoFirst:false,
      vid: "vid", // 视频组件id
      videoContext: null, // 视频组件上下文对象
    }
  },
  computed: {
    // 轮播图 与视频
    carousel() {
      let result = []
      let data = this.article
      if (data && data.articleImgVoList && data.articleImgVoList.length) {
        result = data.articleImgVoList.filter( item => {
          return item.type  == 0
        })
        // 获取视频
        this.videoList =  data.articleImgVoList.filter( item => {
          return item.type  == 1
        })
        if(this.videoList.length > 0) {
          this.isVideoFirst = true;
          this.showPlayBtn = true;
          this.videoContext = uni.createVideoContext(this.vid)
        }
      }
      // console.log('轮播图', result)
      return result
    },
    // 轮播图 与视频
    carouselMaxHeight() {
      let data = this.article
      let resultHeight = 0;
      if (data && data.articleImgVoList && data.articleImgVoList.length) {
        data.articleImgVoList.forEach( item => {
          resultHeight = (resultHeight < item.height) ? (resultHeight = item.height) : resultHeight
        })
      }
      console.log('轮播图', resultHeight)
      return resultHeight
    },
    // 库存
    salesStock() {
      return this.currentSku.salesStock || 0
    },
     // 销售价
    salesPrice() {
      return this.currentSku.salesPrice || 0
    },
    // 会员价
    userLevelSalesPrice() {
      return this.currentSku.userLevelSalesPrice || 0;
    },
    // 市场价
    platformPrice() {
      return this.currentSku.platformPrice || 0
    },
    // 已选
    selectValues() {
      return Object.values(this.ownSpec).join(',')
    },
    // 限购买数量
    limitBuyCount() {
      let limit = this.currentSku.purchaseLimitNum || 0
      if (this.currentSku.salesStock >= limit) {
        return limit
      } else {
        return this.currentSku.salesStock
      }
    },
    // 返金额
    obtainAmount() {
      return this.currentSku.obtainAmount || 0
    },
    // 用户
    ...mapGetters(['userInfo', 'token', "navBarHeight", "menuTop"])
  },
  onLoad(options) {
    this.routeOptions = options
    console.log(options.id)
    // #ifdef H5
    window.wxShareArticleCallback = this.wxShareArticleCallback
    // #endif
    this.id = options.id
    this.commentQuery.articleId = options.id
    this.init()
    this.sysInfo()
    let pages = getCurrentPages();
    this.pagesDetail = pages.length
    console.log("pagesDetail",this.pagesDetail)
    // #ifdef H5
    window.getkeyboardHeight = this.getkeyboardHeight
    // #endif
    this.getPhoneH()
  },
  onShow() {
    if (!this.token) {
      // #ifdef MP-WEIXIN
      uni.hideShareMenu()
      // #endif
    }
    // 文章评论列表
    this.loadComments()
    setTimeout(() => {
      let query = uni.createSelectorQuery();
      query.select('#after-article').boundingClientRect(res => {
        this.offsetTop = res.top || 0
        // console.log(this.offsetTop)
      }).exec()
      query.select('.bottom-bar-container').boundingClientRect(res => {
        this.execBottomHeight = res.height + 60 || 0
        console.log("this.execBottomHeight",this.execBottomHeight)
      }).exec()
    }, 1000);
  },
  methods: {
    async init() {
      try {
        // 文章详情数据
        this.fetchArticleDetail()
        // 文章评论列表
        this.loadComments()
        // 购物车数量
        this.fetchCartCount()
        this.fetchRecommendArticle()
        // 页面如果只传spuId, 默认取规格的第一个属性，如果有传入skuId获取对应sku规格
        // let skuIndex = this.skuList.findIndex(e => e.id === this.skuId) 

        this.fetchIntegalConfig()
      } catch(error){
        //#ifdef MP-WEIXIN
        uni.navigateBack()
        // #endif

        // #ifdef H5
        this.$flutter({method:'BACK'})
        // #endif
      }
    },
    sysInfo() {
      const res = uni.getSystemInfoSync();
      this.isAndroid = res.platform === 'android'
    },
    getPhoneH(){
      let phoneData = uni.getSystemInfoSync();
      this.phoneH = phoneData.windowHeight;
      this.phoneW = phoneData.windowWidth;
      console.log("this.phoneW",this.phoneH,this.phoneW)
    },

    getkeyboardHeight(jsonStr) {
      console.log(JSON.parse(jsonStr).keyboardHeight)
      // this.keyboardHeight = this.platformInfo.isIOS ? 0 : Number(JSON.parse(jsonStr).keyboardHeight)
      this.keyboardHeight = Number(JSON.parse(jsonStr).keyboardHeight)
      console.log('我被執行力 ',this.keyboardHeight)
    },

    goPlay() {
      this.videoContext.play();
    },
    onPlay() {
      // 播放，同时隐藏自定义播放按钮
      this.playing = true;
      this.showPlayBtn = false;
      this.isVideoFirst = false;
    },
    onPause() {
      this.playing = false;
      this.showPlayBtn = true;
      this.isVideoFirst = false;
    },
    onEnded() {
      // 播放结束后重新显示播放按钮
      this.showPlayBtn = true;
      this.playing = false;
      this.isVideoFirst = false;
    },

    // 获取文章详情数据
    fetchArticleDetail() {
      uni.showLoading({mask: true})
      getArticleDetail(this.id).then(res => {
        console.log('文章详情数据', res.data)
        let data = res.data
        this.article = data
        this.isFocus = data.isFocus || false
        this.isLike = data.isLike || false
        this.spuInfoVo = data.spuInfoVo || {}
        if(this.spuInfoVo.spuId){
          this.spuId = this.spuInfoVo.spuId;
          this.fetchSpuToEs()
          console.log('sku列表', this.spuInfoVo)
        }
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 获取推荐文章
    fetchRecommendArticle() {
      if (this.finished || this.loading || this.error) return
      this.recommendParams['pageNo'] += 1
      this.loading = true;
      getRecommendArticle(this.recommendParams).then(res => {
        console.log('推荐文章', res.data)
        this.recommendList = this.recommendList.concat(res.data.list)
        this.error = false
        if(!res.data.hasNextPage){
          this.finished = true
          return;
        }
      }).catch(error => {
        this.error = true
        this.recommendParams['pageNo'] -= 1
      }).finally(() => {
        this.loading = false
      })
    },
    fetchSpuToEs(){
      return new Promise((resolve, reject) => {
        uni.showLoading({mask: true})
        getSpuToEs(this.spuInfoVo.spuId).then(res=>{
          if(res.data){
            let data = res.data
            console.log("data",data)
            this.type = data.type
            this.isVip = data.isVip
            this.status = data.status
            this.attributeKeys = data.attributeKeyVos || []
            this.skuList = data.skuVos || []
            this.currentSku = data.skuVos[0]
            console.log("this.skuList",this.skuList)
            this.currentSku = this.skuList[0];
            // if (skuIndex >= 0) {
            //   this.currentSku = this.skuList[skuIndex];
            // } else {
            //   this.currentSku = this.skuList[0];
            // }
            this.ownSpec = JSON.parse(this.currentSku.ownSpec);
            console.log(this.currentSku)
            this.getCarousel()
            resolve(res.data)
          }else{
            reject({resInfo: '商品不存在'})
          }
        }).catch((err)=>{
          console.log(err)
          //#ifdef MP-WEIXIN
          uni.navigateBack()
          // #endif

          // #ifdef H5
          this.$flutter({method:'BACK'})
          // #endif
        }).finally(()=>{
          uni.hideLoading()
        })
      })
    },
    goBack(){
      let pages = getCurrentPages()
      console.log("pages",pages)
      if (pages.length >= 2) {
        let prevpage = pages[pages.length - 2]
        console.log(prevpage.route)
        //#ifdef MP-WEIXIN
        uni.navigateBack()
        // #endif

        // #ifdef H5
        this.$flutter({method:'BACK'})
        // #endif
      }else{
        uni.reLaunch({
          url: '/pages/tabbar/Home'
        })
      }
    },
    buyTap(){
      this.buyPopup = true
    },
    // 跳转商品详情
    toSpuDetail(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${item.spuId}&skuId=${item.id}`
      })
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':item.spuId,'skuId':item.id}})
      // #endif
    },
    // 加载评论列表
    loadComments() {
      // this.commentQuery['pageNo'] += 1
      getCommentList(this.commentQuery).then(res => {
        console.log("getCommentList",res)
        let data = res.data
        this.commentList = data.list
        this.totalComments = Number(data.total)
        console.log('评论列表', this.commentList)
      }).catch(error => {
        this.commentQuery['pageNo'] -= 1
      })
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
    onErrorClick() {
      this.error = false
      this.fetchRecommendArticle()
    },
    // 跳转购物车
    onCartTap() {
      if (this.token) {
        uni.switchTab({
          url: `/pages/tabbar/ShoppingCart`
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
      }
    },
    // 加入购物车
    onAddCartTap(type) {
      if (this.token) {
        if (type == 0) {
          this.buyPopup = true
          this.disableScroll = true
        } else if (type == 1) {
          let quantity = this.buyCount
          let skuId = this.currentSku.id
          this.addCartLoading = true;
          addCart(quantity, skuId).then(res => {
            this.closePopup('buy')
            uni.showToast({ title: '已加入购物车', icon: 'none', duration: 2000 })
            // 弹窗购物车数量重置为1
            this.buyCount = 1
            // 更新购物车数量
            this.fetchCartCount()
          }).finally(res => {
            this.addCartLoading = false;
          })
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
      }
    },
    // 立即购买
    onBuyTap(type) {
      if (this.token) {
        if (type == 0) {
          this.buyPopup = true
          this.disableScroll = true
        } else if (type == 1) {
          if (this.buyCount > this.limitBuyCount) {
            this.closePopup('buy')
            uni.showToast({title: '购买数量大于限购数量', icon: 'none', duration: 2000})
            this.buyCount = 1
          } else {
            this.closePopup('buy')
            let orderParam = [{"skuId": this.currentSku.id,"quantity": this.buyCount}]
            let urlParam = `orderType=2&orderParam=` + encodeURIComponent(JSON.stringify(orderParam))

            // #ifdef H5
            this.$flutter({method: 'TO_CONFIRM_ORDER', data:{skuId:this.currentSku.id,quantity:this.buyCount,orderType:2}})
            // #endif
            // console.info(urlParam)
            // 进入确认订单页面
            // #ifdef MP-WEIXIN
            uni.navigateTo({
              url: `/pages/order/ConfirmOrder?${urlParam}`
            })
            // #endif
          }
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_LOGIN'})
        // #endif
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
    // 点击事件
    onClick(type) {
      if (this.$store.getters.token) {
        // 点赞类型
        if (type === 'like') {
          if (this.isLike) {
            console.log('取消点赞文章')
            this.isLike = false
            this.article.likeNum -= 1
            cancelLikeArticle(this.id).then(res => {
              // console.log(res)
              this.$store.commit('changeLikeArticleIds', { type: 'cancel', id: this.id })
            }).catch(() => {
              this.isLike = true
              this.article.likeNum += 1
            })
          } else {
            console.log('点赞文章')
            this.isLike = true
            this.article.likeNum += 1
            likeArticle(this.id).then(res => {
              // console.log(res)
              this.$store.commit('changeLikeArticleIds', { type: 'add', id: this.id })
            }).catch(() => {
              this.isLike = false
              this.article.likeNum -= 1
            })
          }
        }
        // 关注类型
        if (type === 'focus') {
          let flag = this.isFocus ? 0 : 1
          this.isFocus = !this.isFocus
          focus(this.id, flag).then(res => {
          }).catch(() => {
            this.isFocus = !this.isFocus
          })
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true;
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_LOGIN'})
        // #endif
      }
    },
    onCarouselChange(e) {
      // console.log(e)
      this.currentCarouselIndex = e.detail.current
    },
    onBuyCountChange(e) {
      // console.log(e.detail)
      this.buyCount = e.detail
    },
    // 点赞评论
    onLikeComment(item) {
      console.log(item)
      if (this.$store.getters.token) {
        if (item.isLike) {
          // 取消点赞
          item.isLike = false
          cancelLikeComment(item.id).then(res => {
            item.likeNum -= 1;
          }).catch(error => {
            item.isLike = true
          })
        } else {
          // 点赞
          item.isLike = true
          likeComment(item.id).then(res => {
            item.likeNum += 1;
          }).catch(error => {
            item.isLike = false
          })
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
      }
    },
    // 关闭评论弹窗
    closePopup(type) {
      if (type === 'comment') {
        this.showPopup = false
      } else if (type === 'share') {
        this.sharePopup = false
      } else if (type === 'spuDesc') {
        this.spuDescPopup['show'] = false
      } else if (type === 'buy') {
        this.disableScroll = false
        this.buyPopup = false
      } else if (type === 'auth') {
        this.disableScroll = false
        this.authPopup = false
      }
    },
    // 发布评论
    onConfirm() {
      console.log(this.commentValue)
      if (this.commentValue) {
        uni.showLoading({ mask: true })
        addComment({
          articleId: this.id,
          content: this.commentValue
        }).then(res => {
          console.log('评论', res.data)
          this.showPopup = false
          uni.showToast({title: '评论成功', duration: 1000, icon: 'none'})
          this.commentList.unshift(res.data)
          this.totalComments += 1
          this.commentValue = ''
          if (res.data.obtainIntegral > 0) {
            this.showIntgralPopup['show'] = true
            this.showIntgralPopup['text'] = '评论文章'
            this.showIntgralPopup['integral'] = res.data.obtainIntegral
            setTimeout(() => {
              this.showIntgralPopup['show'] = false
            }, 2000)
          }
        }).finally(() => {
          uni.hideLoading()
        })
      }
    },
    // 获取购物车数量
    fetchCartCount() {
      if (this.$store.getters.token) {
        getCartList().then(res => {
          console.log('购物车', res.data)
          this.cartCount = res.data.length
        })
      }
    },
    onClickWithSession(type, params) {
      if (this.$store.getters.token) {
        if (type === 'toCart') { // 跳转购物车列表
          // #ifdef MP-WEIXIN
          uni.switchTab({
            url: `/pages/tabbar/ShoppingCart`
          })
          // #endif
          // #ifdef H5
          this.$flutter({method:'TO_CART',data:{type:'true'}})
          // #endif 
        } else if (type === 'comment') { // 评论
          this.showPopup = true
          this.autoFocusCommentInput = false
          setTimeout(()=>{
            this.autoFocusCommentInput = true
          },100)
        } else if (type === 'share') {
          this.sharePopup = true
        } else if (type === 'addCart') { // 添加购物车
          let quantity = 1
          let skuId = params.id
          addCart(quantity, skuId).then(res => {
            uni.showToast({ title: '加入购物车成功', icon: 'none', duration: 1000 })
            if (res.data.quantity === 1) {
              this.cartCount += 1
            }
          })
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_LOGIN'})
        // #endif
      }
    },
    // 预览图片
    onPreviewImage(index) {
      let images = this.carousel.map(ele => ele.url)
      // #ifdef MP-WEIXIN
      uni.previewImage({
        urls: images
      })
      // #endif

      // #ifdef H5
      let param = { 
        method: 'PREVIEW_IMAGE',
        data: { 
          imgUrls: images,
          index: index
        }
      }
      this.$flutter(param)
      // #endif
    },
    // 评论输入框聚焦时触发，padding-bottom撑开键盘高度
    onCommentInputFocus(e) {
      console.log("this.isAndroid============================",this.isAndroid,this.keyboardHeight)
      if (this.isAndroid) {
        let { height } = e.detail
        console.log('height', height)
        this.keyboardHeight = height
      }
    },
    // 失焦时padding-bottom为0
    onCommentInputBlur(e) {
      this.keyboardHeight = 0
      // #ifdef H5
      this.$flutter({ method: 'CLOSE_KEYBOARD' })
      // #endif
    },
    goBack(){
      // #ifdef MP-WEIXIN
      let pages = getCurrentPages()
      console.log("pages",pages)
      if (pages.length >= 2) {
        let prevpage = pages[pages.length - 2]
        console.log(prevpage.route)
        //#ifdef MP-WEIXIN
        uni.navigateBack()
        // #endif

        // #ifdef H5
        this.$flutter({method:'BACK'})
        // #endif
      }else{
        uni.reLaunch({
          url: '/pages/tabbar/Home'
        })
      }
      // #endif
      // #ifdef H5
      this.$flutter({method:'BACK'})
      // #endif
    },
    //跳到全部评论
    goComment(){
      console.log("跳转评论")
      // #ifdef MP-WEIXIN
      if(this.token){
        uni.navigateTo({
          url:`/pages/article/Comment?id=${this.id}`
        })
      }else{
        this.authPopup = true;
      }
      // #endif
      // #ifdef H5
     	this.$flutter({method: 'TO_COMMENT',data:{comments:this.totalComments}})
      // #endif
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
    // 点击sku
    onSkuClick(attrName, value) {
      if (this.isSkuActive(attrName, value.attrValue) || this.isSkuDisabled(attrName, value.attrValue)) {
        return
      }
      let copy = deepClone(this.ownSpec)
      copy[attrName] = value.attrValue
      console.log(copy)
      let idx = this.skuList.findIndex(e => isObjectEqual(copy, JSON.parse(e.ownSpec)))
      if (idx >= 0) {
        this.currentSku = this.skuList.find(e => isObjectEqual(copy, JSON.parse(e.ownSpec)))
        console.log('currentSku', this.currentSku);
        this.ownSpec = JSON.parse(this.currentSku.ownSpec)
        this.getCarousel()
      }
    },
    getCarousel() {
      for(let j = 0; j < this.skuList.length; j++) {
        let value = this.skuList[j]
        if (value.attrValueId === this.currentSku.attrValueId) {
          if (value.skuImagesPos && value.skuImagesPos.length > 0) {
            // 0:缩略图,1：主图，2：详情图片,3 :视频封面图 4 ： 视频地址
            this.skuCarousel = value.skuImagesPos.filter(e => [1, 2].includes(e.type)) // 轮播图取1和2
            console.log('轮播图', this.skuCarousel)
            // let vUrl = value.skuImagesPos.filter(e => e.type === 4)
            // if (vUrl.length) {
            //   let vCover = value.skuImagesPos.filter(e => e.type === 3)
            //   vCover.length ? this.video[0] = vCover[0].imgUrl : this.video[0] = ''
            //   this.video[1] = vUrl[0].imgUrl
            //   this.videoContext = uni.createVideoContext(this.vid)
            //   this.isInVideo = true
            //   this.showPlayBtn = true
            // } else {
            //   this.video = []
            //   this.videoContext = null
            //   this.isInVideo = false
            //   this.showPlayBtn = false
            // }
            // console.log('视频', this.video)
            break
          }
        }
      } 
    },

    // H5分享
    onWxShare(){
      this.closePopup('share')
      try {
        uni.showLoading({ title: "正在打开微信", mask: true });
      let id = this.id;
        let title = this.article.articleName || '这篇文章超好看~' // 分享标题
        let description = this.article.articleName // 分享描述
        let thumbnail = this.carousel[0].url // 封面图
        this.$flutter({ method: 'WX_SHARE_ARTICLE', data: { id, title, description, thumbnail } })
      } catch (error) {
        console.log(error)
        uni.hideLoading();
      } finally {
        // uni.hideLoading();
      }
    },

    // 微信分享回调
    wxShareArticleCallback(jsonStr) {
      uni.hideLoading();
      if (JSON.parse(jsonStr).isSuccessful === 'true') {
        shareArticle(this.id).then(res => {
          this.article['shareNum'] += 1
          if (res.data&&res.data.obtainIntegral > 0) {
            uni.showToast({ title: `推荐文章+${res.data.obtainIntegral}喵豆` });
          }
        })
      }
    },
    //重新加载页面
    reload(){
      this.$mp.page.onLoad(this.routeOptions)
    }
  },

  onReachBottom() {
    this.fetchRecommendArticle()
  },


  // 自定义转发 
  onShareAppMessage(e) {
    this.closePopup('share')
    shareArticle(this.id).then(res => {
      console.log('转发', res)
      this.article['shareNum'] += 1
      if (res.data&&res.data.obtainIntegral > 0) {
        uni.showToast({ title: `推荐文章+${res.data.obtainIntegral}喵豆` });
      }
    })
    let obj = {
      title: this.article.articleName,
      path: `/pages/start/index?sharePage=article&id=${this.id}&shareUserId=${this.userInfo.id}`,
    }
    if (this.carousel.length) {
      // 当前轮播图的图片
      obj['imageUrl'] = this.carousel[this.currentCarouselIndex].url
    }
    return {
      ...obj
    }
  },
  onShareTimeline(){
    let obj = {
      title: "秒寻.好文章——"+this.article.articleName,
      query:`sharePage=article&id=${this.id}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.carousel[this.currentCarouselIndex].url
    }
    return {
      ...obj
    }
  },
  onPageScroll: debounce(function(e) {
    // console.log(e)
    if (!this.token || this.stopPageScroll) return
    if (e.scrollTop >= this.offsetTop - 500) {
      this.stopPageScroll = true
      read(this.id).then(res => {
        console.log('read', res.data)
        if (res.data > 0) {
          this.showIntgralPopup['show'] = true
          this.showIntgralPopup['text'] = '阅读文章'
          this.showIntgralPopup['integral'] = res.data
          setTimeout(() => {
            this.showIntgralPopup['show'] = false
          }, 1500)
        }
      })
    }

  }, 500)
}
</script>

<style lang="scss" scoped>
#article{
  .carousel-image{
    height: inherit;
    width: 100%;
  }
  .sku-swiper{
    height: 114px;
  }
  .article-container{
    background-color: #ffffff;
    padding: 38rpx 0 56rpx;
    margin: 0 40rpx;
    border-bottom: 1rpx solid #d7d7d7;
    .before-focus,
    .after-focus{
      font-size: 24rpx;
      width: 120rpx;
      height: 60rpx;
      text-align: center;
      line-height: 60rpx;
      border-radius: 30rpx;
      &.before-focus{
        background-color: $uni-color-theme;
        color: $uni-color-primary;
      }
      &.after-focus{
        background-color: #EBEBEB;
        color: #66686C;
      }
    }
  }
  .comment-container{
    border-bottom: 1rpx solid #d7d7d7;
    margin: 0 40rpx;
    padding-bottom: 60rpx;
  }
  .video-wrapper{
    video{
      width: 100vw;
      height: 100vw;
    }
  }
  .top-container{
    position: relative;
    .cart-btn-container{
      position: absolute;
      right: 40rpx;
    }
  }
  .bottom-bar-container{
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    z-index: 99;
    margin: 0 auto;
    width: 700rpx;
    background-color: #ffffff;
    height: 120rpx;
    box-shadow:0px 3px 35px 0px rgba(0, 0, 0, 0.1);
    border-radius: 100rpx;
  }
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
}
.video-image {
  position:absolute;
  top: 0;
  width: 100vw;
}
.play-btn {
  width: 60px !important;
  height: 60px !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.integral-tips{
  background-color: #F77F8C;
  font-weight: 600;
  text-align: center;
  color: white;
  width: 400rpx;
  border-radius: 30px;
  position: fixed;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  height: 88rpx;
  line-height: 88rpx;
  z-index: 9999;
}
.buy-btn{
  height:56rpx;
  line-height:56rpx;
  // background:rgba(255,209,0,1);
  border-radius:28rpx;
  padding: 0 46rpx;
  margin: auto 0;
}
.placeholderStyle{
  background:rgba(246,246,246,1);
  border-radius:34rpx;
  padding-left: 27rpx;
  height: 68rpx;
  line-height: 68rpx;
}
.placeholderStyle::-webkit-input-placeholder{
  font-size:28rpx;
  color:rgba(188,188,188,1);
}
.filter-gray {
  pointer-events: none;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
  opacity: 0.5;
}
/deep/ .stepper-icon-jia{
  width: 56rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .stepper-icon-jian{
  width: 56rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .stepper-icon-input{
  width: 90rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .van-icon-arrow-left{
  color: #000;
  font-size: 48rpx!important;
}
/deep/ .swiper-dot{
  background-color: #FF9EA8 !important;
  opacity: 1 !important;
}
</style>
