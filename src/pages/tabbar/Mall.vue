<template>
  <view id="mall" class="min-h-full" style="background: #F2F4FA;">
    <!-- #ifdef MP-WEIXIN -->
    <view class="plr30 pt18 bg-white title_fixed">
      <view style="position:relative; top:0; z-index:1;">
        <view class="text-center fs-lg-add mb26 fw600" :style="{'margin-top' : menuTop - 4 + 'px'}">商城</view>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view class="plr30 pt18 title_fixed bg-white" :style="{'opacity':qipaoTopStatus?1:0}">
      <view style="position:relative; top:0; z-index:1;">
        <view class="text-center fs-lg-add mb26 fw600" :style="{'margin-top' : menuTop - 4 + 'px',opacity:0}">商城</view>
      </view>
    </view>
    <!-- #endif -->
    <!-- 搜索框 -->
    <view class="h88 w-full ptb12 fixed mall-input-box" :class="{active:qipaoTopStatus}"  :style="{'top':navBoxHeight+'px'}">
      <input 
        type="text" 
        placeholder="搜索美好生活"
        placeholder-class="fs-normal olory-gray"
        :class="['h64', 'fs-normal', 'pl64', qipaoTopStatus?'ml32':'mauto', qipaoTopStatus?'active':'disactive']"
        disabled
        @click="onClickSearch"
      />
      <image :src="IMAGE.MALL_ICON_SEARCH" mode='widthFix' class="w-h48 absolute" style="top:20rpx;left:40rpx;"></image>
      <image v-if="qipaoTopStatus" :src="asisUrl" mode='widthFix' class="w-h64 absolute radius-circle" style="top:12rpx;right:32rpx;box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);" @tap="toChat"></image>
        <!-- :session-from="`ysf.config=${ysf.config}|groupid=398881453|staffid=3856743`" -->
      <!-- #ifdef MP-WEIXIN -->
      <button
        open-type="contact"
        :session-from="`ysf.config=${ysf.config}`"
        :send-message-title="ysf.title"
        style="opacity:0;z-index:1;top:12rpx;right:32rpx;"
        class="w-h64 absolute"
      >
      </button>
      <!-- #endif -->
    </view>
    <view class="relative">
      <!-- 轮播图 -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="relative  mb24 bg-white" :style="{'margin-top' : menuTop + bannerTop + 'px'}">
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <view class="relative mb24 bg-white">
      <!-- #endif -->

        <view v-if="carousel.length" class="hidden w-full" style="height:600rpx;">
          <!-- #ifdef MP-WEIXIN -->
          <swiper 
            :indicator-dots="false" 
            :autoplay="true" 
            :interval="5000" 
            style="height:600rpx; position:absolute;top:0;left:0;right:0;bottom:0;" 
            @change="bannerChange">
            <swiper-item v-for="(item, index) in carousel" :key="index">
              <image :src="item.bannerImgUrl" mode='widthFix' class="w-h-full" @click="$_onBannerClick(item)"></image>
            </swiper-item>
          </swiper>
          <!-- #endif -->


          <!-- #ifdef H5 -->
          <my-swiper
            style="height:600rpx;"
            :options="swiperOptions"
            ref="mySwiper">
            <my-swiper-item v-for="(item, index) in carousel" :key="index">
              <image :src="item.bannerImgUrl" mode='widthFix' class="w-h-full" @click="$_onBannerClick(item)"></image>
            </my-swiper-item>
          </my-swiper>
          <!-- #endif -->
          <view class="absolute swiper-dots row">
            <view :class="['bg-theme', 'w-h12', '',currentIndex==index?'active':'']" v-for="(item, index) in carousel" :key="index"></view>
          </view>
        </view>
      </view>
      <!-- 保障 -->
      <view class="plr32" @tap="jump2mx">
        <view class="row guaranteeBox space-around" >
          <view class="row center-y h48">
            <view class="guarantee h32 row center-y pr30">
              <image class="w-h32 mr4 radius-circle" :src="IMAGE.MALL_ICON_BRAND" />
              <view class="fs-22 ellipsis">品牌直供</view>
            </view>
            <view class="guarantee h32 row center-y plr30">
              <image class="w-h32 mr4 radius-circle" :src="IMAGE.MALL_ICON_GUARANTEE" />
              <view class="fs-22 ellipsis">正品保证</view>
            </view>
            <view class="guarantee h32 row center-y pl30">
              <image class="w-h32 mr4 radius-circle" :src="IMAGE.MALL_ICON_RETURN" />
              <view class="fs-22 ellipsis">破损包退</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 小运营位 -->
      <view class="plr48 pb36 mb20 pt40" v-if="smallGridList.length">
        <block v-if="smallDataLen" >
          <view class="row space-between">
            <block v-for="(item,idx) in smallGridList" :key="idx">
              <view class="col center-y" v-if="idx < smallDataLen" @click="$_onBannerClick(item)"> 
                <image :class="['radius-circle', 'mb8', smallDataLen == 4 ? 'w-h118' : 'w-h104']" :src="item.bannerImgUrl" />
                <text class="fs-22 l-h34 ellipsis w88 text-center">{{item.title}}</text>
              </view>
            </block>
          </view>
          <view class="row space-between mt38">
            <block v-for="(item,idx) in smallGridList" :key="idx">
              <view class="col center-y" v-if="idx > smallDataLen-1" @click="$_onBannerClick(item)"> 
                <image :class="['radius-circle', 'mb8', smallDataLen == 4 ? 'w-h118' : 'w-h104']" :src="item.bannerImgUrl" />
                <text class="fs-22 l-h34 ellipsis w88 text-center">{{item.title}}</text>
              </view>
            </block>
          </view>
        </block>
      </view>
      <!-- v2.1.0 start -->
      <!-- 五个栅格 -->
      <view class="mtb24" v-if="shopGridList && shopGridList.length">
        <block v-if="shopGridList.length==5">
          <view class="row center-x"> 
            <view class="col space-between h668 mr16">
              <image class="w334 h440 radius-12" :src="shopGridList[0].bannerImgUrl" @click="$_onBannerClick(shopGridList[0])" />
              <image class="w334 h212 radius-12" :src="shopGridList[1].bannerImgUrl" @click="$_onBannerClick(shopGridList[1])" />
            </view>
            <view class="col space-between h668">
              <image class="w334 h212 radius-12" :src="shopGridList[2].bannerImgUrl" @click="$_onBannerClick(shopGridList[2])" />
              <image class="w334 h212 radius-12" :src="shopGridList[3].bannerImgUrl" @click="$_onBannerClick(shopGridList[3])" />
              <image class="w334 h212 radius-12" :src="shopGridList[4].bannerImgUrl" @click="$_onBannerClick(shopGridList[4])" />
            </view>
          </view>
        </block>
        <block v-if="shopGridList.length==2">
          <view class="row center-x"> 
            <view class="row space-between">
              <image class="w334 h212 radius-12 mr16" :src="shopGridList[0].bannerImgUrl" @click="$_onBannerClick(shopGridList[0])" />
              <image class="w334 h212 radius-12" :src="shopGridList[1].bannerImgUrl" @click="$_onBannerClick(shopGridList[1])" />
            </view>
          </view>
        </block>
      </view>
      <!-- 类目 -->
      <view class="mt16" v-if="pageCategoryList && pageCategoryList.length">
        <view class="mt32" v-for="(x,y) in pageCategoryList" :key="y">
          <image class="mb32 w-full" mode="widthFix" :src="x.categoryImg" />
          <view class="row center-x wrap last-odd">
            <block v-for="(item,idx) in x.categoryVoList" :key="idx">
              <block v-if="idx<showMore('num',y)">
                <view :class="['mb16', 'w334', 'p24', 'radius-12', 'bg-white', idx%2==0?'mr16':'' ]" @tap="jump2mallSeconndlist(item)">
                  <view class="row space-between mb24 l-h26">
                    <view class="fs-26">
                      {{item.categoryName}}
                    </view>
                    <image class="w80 h32" :src="IMAGE.MALL_ICON_CATE_MORE" />
                  </view>
                  <view class="row space-between" >
                    <view class="relative" v-for="(m,n) in item.spuVos" :key="n">
                      <image class="w-h132 radius" :src="m.skuOssImage" />
                      <view class="w-h132 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
                    </view>
                  </view>
                </view>
              </block>
            </block>
            <!-- <view :class="['mb16', 'w334', 'p24', 'radius-12', idx%2==0?'mr16':'']" v-if="x.categoryVoList.length%2 != 0"></view> -->
          </view>
          <view v-if="x.categoryVoList.length>4" class="h80 l-h80 mauto mt8 fs-22" style="width:fit-content;color:#BFC2CC;" @tap="changeMoreBtnStatus(y)">
            <image class="w-h32 mr8" mode="widthFix" :src="showMore('btn',y) ? IMAGE.MALL_ICON_CATE_DOWN : IMAGE.MALL_ICON_CATE_UP" style="transform:translateY(-10%);" />
            {{showMore('btn',y) ?"点击展开更多分类":"收起分类"}}
          </view>
        </view>
      </view>
      <!-- v2.1.0 end -->
      <!-- 主题馆 -->
      <block v-if="themeGridList && themeGridList.list.length">
        <view class="pb20 pt40 mb20 bg-white" v-for="(item,idx) in themeGridList.list" :key="idx">
          <!-- 主题馆样式1 -->
          <block v-if="item.type==1">
            <image mode="widthFix" class="mlr40" :src="item.bannerImgUrl" style="border-radius:16rpx;width:calc(100% - 80rpx);"  @tap="moreGoods(item)" />
            <scroll-view  scroll-x="true" style="width:calc(100% - 40rpx);white-space: nowrap;" class="pt24 bg-white ml40">
              <block v-for="(n,m) in item.shopThemeSpuVos" :key="n.spu.id">
                <view class="mr22 inline-block" v-if="m<4">
                  <view @tap="onSpuClick(n.spu.id)">
                    <spu-card
                      card-type="a-sm"
                      :spu-img="n.spu.skuOssImage"
                      :spu-name="n.spu.spuName"
                      :subTitle="n.spu.title"
                      :sell-price="n.spu.salesPrice"
                      :spu-activity-name="n.spu.spuActivityName"
                      :origin-price="n.spu.platformPrice"
                      :is-label="n.spu.labelName"
                      :is-youxuan="n.spu.preferred"
                      :status="n.spu.status"
                      :replenish="n.spu.salesStock == 0 || n.spu.salesStock == null"
                    />
                  </view>
                </view>
              </block>
              <view class="inline-block w112 ml18 mr40 relative" style="height:526rpx">
                <view class="radius-circle w-h112 bg-white pos-center" style="top:26%;border: 1rpx solid #E1E3E8;" @tap="moreGoods(item,'theme')">
                  <image :src="IMAGE.MALL_ICON_MORE" class="w-h32 pos-center" >
                </view>
              </view>
            </scroll-view>
          </block>
          <!-- 主题馆样式2 -->
          <block v-if="item.type==2">
            <image mode="widthFix" class="mlr40" :src="item.bannerImgUrl" style="border-radius:16rpx;width:calc(100% - 80rpx);"  @tap="moreGoods(item)" />
            <view class="mt24 row space-between wrap bg-white mlr40">
              <block v-for="(n,m) in item.shopThemeSpuVos" :key="n.spu.id">
                <view @tap="onSpuClick(n.spu.id)" v-if="m<4">
                  <spu-card
                    card-type="a"
                    :spu-img="n.spu.skuOssImage"
                    :spu-name="n.spu.spuName"
                    :subTitle="n.spu.title"
                    :sell-price="n.spu.salesPrice"
                    :spu-activity-name="n.spu.spuActivityName"
                    :origin-price="n.spu.platformPrice"
                    :is-label="n.spu.labelName"
                    :is-youxuan="n.spu.preferred"
                    :status="n.spu.status"
                    :replenish="n.spu.salesStock == 0 || n.spu.salesStock == null"
                  />
                </view>
              </block>
            </view>
            <view class="fw600 fs-lg-add text-center moreBtn bg-white mb20 mlr40" @tap="moreGoods(item,'theme')">
              查看更多
            </view>
          </block>
          <block></block>
        </view>
      </block>
    </view>
    <view class="color-gray fs-mini text-center pb20">
      <text v-if="themeGridList && themeGridList.finished">我是有底线的</text>
      <text v-if="themeGridList && themeGridList.loading">更多数据加载中...</text>
      <text v-if="themeGridList && themeGridList.error" @click="onErrorClick">加载失败，点击重试</text>
    </view>
    <!-- 搜索界面弹窗 -->
    <van-popup :show="showSearchPopup" position="top" round>
      <view class="plr30 ptb20">
        <!-- 搜索 -->
        <view class="ptb20">
          <view class="row center-y radius-round plr20" style="background-color: #f6f6f6;">
            <image :src="IMAGE.ICON_SEARCH" class="w-h40" />
            <input 
              type="text" 
              placeholder="输入关键字进行搜索"
              placeholder-class="fs-normal olory-gray"
              class="h60 fs-normal pl10 flex-1"
              confirm-type="search"
              @confirm="confirmSearch"
            />
          </view>
        </view>
        <!-- 分类 -->
        <view class="ptb40">
          <view class="fw600 fs-lg mb20 pl10">全部分类<text class="pl20 color-gray fs-sm" v-if="loadingCategory">加载中...</text></view>
          <view>
            <block v-for="(item, index) in categoryList" :key="index">
              <button class="cate-item" @tap="searchCategory(item)">{{ item.categoryName }}</button>
            </block>
          </view>
        </view>
        <!-- 历史搜索 -->
        <view class="ptb40" v-if="searchHistory.length">
          <view class="row space-between center-y mb20">
            <view class="fw600 fs-lg pl10">历史搜索</view>
            <view @tap="onClearHistory">
              <image :src="IMAGE.ICON_CLEAR" class="w-h40" />
              <text>清除</text>
            </view>
          </view>
          <view>
            <button class="cate-item" v-for="(val, i) in searchHistory" :key="i">{{ val }}</button>
          </view>
        </view>
      </view>
    </van-popup>
    <!-- 小助理 -->
    <view v-if="!qipaoTopStatus"  class="radius-circle absolute w-h128 assistant-box bg-white mall-banner" :style="{top:menuTop + bannerTop + 260 +'px'}" @tap="toChat">
        <!-- :session-from="`ysf.config=${ysf.config}|groupid=398881453|staffid=3856743`" -->
      <button
        open-type="contact"
        :session-from="`ysf.config=${ysf.config}`"
        :send-message-title="ysf.title"
        style="opacity:0;z-index:1;"
        class="w-h-full relative"
      >
      </button>
      <view class="w-h-full pos-center">
        <image class="w-h-full mr4 radius-circle" :src="asisUrl" />
      </view>
      <view v-if="qipaoTopTitle" class="absolute assistant-box-content bg-white l-h48 plr24 fs-22">
        {{welcomeText}}
        <image :src="IMAGE.MALL_ICON_QIPAO" class="absolute assistant-box-content-qipao w24 h12" >
      </view>
    </view>

    <!-- 客服蒙版 -->
      <view
        v-if="token && kefuGuideShow == '1'"
        class="min-h-full w-full fixed"
        style="background:rgba(0, 0, 0, .6);top:0;z-index:9998;"
      ></view>
      <!-- 我的客服 -->
      <view v-if="token && kefuGuideShow == '1'" class="absolute w-h-full" style="top:160rpx;">
        <view 
          v-if="!qipaoTopStatus"  
          class="radius-circle absolute w-h128 assistant-box bg-white mall-banner" 
          :style="{top:menuTop + bannerTop + 260 - 80 +'px', zIndex:9999}"
          >
          <view class="w-h-full pos-center" style="z-index:9999;">
              <image class="w-h-full mr4 radius-circle bg-white" :src="asisUrl" />
          </view>
        </view>
          <image
            :src="IMAGE.CARD_KEFU" mode="widthFix" 
            class="w-full absolute"
            style="z-index:9999;top:226rpx;right:20rpx"
            @click="dismissGuide()"
          />
      </view>
    <!-- 返回顶部 -->
    <!-- <view class="go-top col text-center w-h96 fixed" v-if="goTopBtn" @click="goTop">
      <image :src="IMAGE.HOME_TOP" class="w-h40 mt14" />
      <view class="fs-mini fw600">回顶部</view>
    </view> -->

  </view>
</template>

<script>
import SpuCard from '_c/SpuCard'
import { getSpuDetail } from '@/api/goods/spu'
import { getAllGoods, searchGoods, getHomePageCategory } from '@/api/goods'
import { getHomeResource } from '@/api/activity/resource'
import { getShopGridResources, getShopSmallResources, getShopThemeResources } from '@/api/activity'
import { getUserAsis } from '@/api/user'
import { MALL_ICON_MORE, MALL_ICON_CATE_DOWN, MALL_ICON_CATE_UP, MALL_ICON_CATE_MORE, MALL_ICON_RETURN, MALL_ICON_GUARANTEE, MALL_ICON_BRAND, MALL_ICON_QIPAO, HOME_TOP, MALL_ICON_SEARCH, MALL_ICON_NOTICE, MALL_ICON_CART, ARROW_RIGHT, SHARE_APP_COVER, ICON_TOTAL_GOODS, GOODS_YOUXUAN_1, ICON_SEARCH, ICON_CLEAR, ICON_CLOSE_WHITE, COUPON_POPOVER,CARD_KEFU } from '@/imageConfig'
import { isEmpty, formatTime } from '@/utils'
import { mapGetters } from 'vuex'
import { debounce, deepClone } from '@/utils'
import { javascriptChannelName } from '@/config'
// #ifdef H5
import { Swiper as MySwiper, SwiperSlide as MySwiperItem } from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'
// #endif
import { jumpLink } from "@/mixins";

export default {
  name: 'Mall',
  mixins:[jumpLink],
  // #ifdef MP-WEIXIN
  components: { SpuCard },
  // #endif
  // #ifdef H5
  components: { SpuCard, MySwiper, MySwiperItem },
  // #endif
  data() {
    return {
      IMAGE: {
        MALL_ICON_NOTICE,
        MALL_ICON_CART,
        ARROW_RIGHT,
        SHARE_APP_COVER,
        ICON_TOTAL_GOODS,
        GOODS_YOUXUAN_1,
        ICON_SEARCH,
        ICON_CLEAR,
        MALL_ICON_SEARCH,
        HOME_TOP,
        MALL_ICON_RETURN,
        MALL_ICON_GUARANTEE,
        MALL_ICON_BRAND,
        CARD_KEFU,
        MALL_ICON_QIPAO,
        MALL_ICON_MORE,
        MALL_ICON_CATE_MORE,
        MALL_ICON_CATE_UP,
        MALL_ICON_CATE_DOWN
      },
      active: "0", // 默认推荐
      menuTop: 0,//导航栏top + 状态栏Height
      bannerTop:40,// banner顶部
      qipaoTopStatus:false,//小助理显示状态
      qipaoTopTitle:true,//小助理文案状态
      welcomeText:"",//小助理文案
      asisUrl:"",//小助理图片
      asisAsis:"",//小助理
      qipaoTop:0,
      carousel: [],  // 轮播图
      noticeData: null, // 公告
      grids: [], // 九宫格数据
      goodsArea: [], // 商品专区
      goodsList: [],
      showSearchPopup: false,
      categoryList: [], // 分类列表
      loadingCategory: false,
      navBoxHeight:0,// 顶部固定区域高度
      loadGoodListStatus:true, //节流
      currentIndex:0, //当前轮播图索引
      smallGridList:[], //小运营位
      shopGridList:[], //栅格
      pageCategoryList:[], //分类版 v2.1.0
      themeGridList:{
        finished:false,
        error:false,
        loading:false,
        pageSize:6,
        pageNo:0,
        list:[]
      }, //主题馆列表
      goTopBtn: false, //回到顶部按钮
      phoneH:0,
      ysf:{
        config:""
      },//传给七鱼客服信息
      swiperOptions: {
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
        on: {
          slideChangeTransitionEnd: () => {
            let swiper = this.$refs['mySwiper'].$swiper;
            // console.log(swiper)
            // console.log(swiper.activeIndex)
            this.currentIndex = swiper.activeIndex
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'searchHistory','navBarHeight','kefuGuideShow']),
    smallDataLen(){
      if(this.smallGridList && this.smallGridList.length){
        if(this.smallGridList.length % 4 == 0){
          return 4
        }else if(this.smallGridList.length % 5 == 0){
          return 5
        }
      }else{
        return 0
      }
    },
    showMore(){
      return (type,idx)=>{
        if(type=="num"){
          return !this.pageCategoryList[idx].moreBtnStatus?4:99
        }else{
          return !this.pageCategoryList[idx].moreBtnStatus
        }
      }
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.init()
    this.getPhoneH()
  },
  onShow() {
    if(this.token){ //未登录不执行
    } else {
      // #ifdef MP-WEIXIN
      uni.hideShareMenu()
      // #endif
    }
    this.welcomeText = "";
    this.qipaoTopTitle = true;
    this.fetUserAsis()
  },
  methods: {
    init() {
      console.log("我重新加载了")
      this.welcomeText = "";
      this.qipaoTopTitle = true;
      this.themeGridList = {
        finished:false,
        error:false,
        loading:false,
        pageSize:2,
        pageNo:0,
        list:[]
      }
      this.fetchHomeResource()
      this.fetShopSmallResources()
      this.fetShopGridResources()
      this.fetchShopThemeResources()
      this.fetchHomePageCategory()
      this.fetUserAsis()
    },
    // 获取自定义导航栏配置
    getSystemInfo() {
      // #ifdef MP-WEIXIN
      const menu = uni.getMenuButtonBoundingClientRect();
      this.menuTop = menu.top 
      // #endif
      // #ifdef H5
      this.menuTop = 0;
      this.bannerTop = 0;
      // #endif
      setTimeout(() => {
        let query = uni.createSelectorQuery()
        query.select('.title_fixed').boundingClientRect((res) => {
          this.navBoxHeight = res.height
        }).exec()
      }, 300);
    },
    // 轮播图切换
    bannerChange(e) {
      this.currentIndex = e.detail.current
    },
    // 小助理
    fetUserAsis:debounce(function(){
      this.ysf.title = "商城";
      getUserAsis().then(res=>{
        console.log("小助理111111111111111111",res)
        let data = res.data;
        if(data){
          this.welcomeText = data.welcomeText;
          this.asisUrl = data.url;
          this.asisAsis = data.name;
          setTimeout(()=>{this.qipaoTopTitle = false},5000)
          if(this.userInfo && this.userInfo.id){
            this.ysf.config=JSON.stringify({
              "uid":this.userInfo.id,  // 用户唯一标识
              "level":data.name,  // vip等级
              "data": JSON.stringify([
                { key: "real_name", label: "昵称", value: `${data.name}-${this.userInfo.nickName}-${this.userInfo.levelName}` },
                { key: "mobile_phone", label: "手机号", value: this.userInfo.mobile },
                {
                  key: "reg_date",
                  label: "创建时间",
                  value: formatTime(this.userInfo.createdTime,'Y/M/D h:m:s'),
                },
                { key: "avatar", label: "头像", value: this.userInfo.headImgUrl },
              ])
            })
            console.log("已登录================================================ysf",this.ysf.config)
          }else{
            this.ysf.config=JSON.stringify({
              "uid":"0",  // 用户唯一标识
              "level":1,  // vip等级
              "data": JSON.stringify([
                { key: "real_name", label: "昵称", value: `未登录用户-${data.name}` },
                { key: "mobile_phone", label: "手机号", value: "" },
                {
                  key: "reg_date",
                  label: "创建时间",
                  value: "",
                },
              ])
            })
          }
        }
      })
    }),
    // 资源接口
    fetchHomeResource() {
      getHomeResource().then(res => {  // 跳转资源类型（0:不跳转; 1:商品; 2:类目; 3:限时购; 4:商品专题; 5:立购商品; 6:邀请新用户; 7:文章; 8:自定义链接; 9:自定义专题
        // console.log(res)
        if(res.data && res.data.length>0){
          this.carousel = res.data
        }
        // let showType = [1, 2, 3, 4, 5, 7,9] // 只显示这六种类型
        // this.carousel = arr.filter(ele => showType.includes(ele.type))
      })
    },
    //小运营位
    fetShopSmallResources(){
      getShopSmallResources().then(res=>{
        console.log(res)
        if(res.data && res.data.length){
          this.smallGridList = res.data
        }
      })
    },
    //分类模块v2.1.0
    fetchHomePageCategory(){
      getHomePageCategory().then(res=>{
        console.log(res)
        if(res.data){
          res.data.forEach(item=>{
            item.moreBtnStatus = false
          })
          this.pageCategoryList = res.data;
          console.log("this.pageCategoryList===================",this.pageCategoryList)
        }
      })
    },
    //运营两个坑位
    fetShopGridResources(){
      getShopGridResources().then(res=>{
        console.log(res)
        if(res.data){
          this.shopGridList = res.data;
        }
      })
    },      
    fetchShopThemeResources(){
      this.themeGridList.pageNo += 1;
      if(this.themeGridList.error || this.themeGridList.loading || this.themeGridList.finished ){
        return
      }
      this.themeGridList.loading = true
      let params = {
        pageSize: this.themeGridList.pageSize,
        pageNo: this.themeGridList.pageNo,
        channel: 2,
      }
      getShopThemeResources(params).then(res=>{
        let data = res.data
        if(data && data.list){
          this.themeGridList.list = this.themeGridList.list.concat(data.list);
        }
        if(!data.hasNextPage){
          this.themeGridList.finished = true
        }
      }).catch(err=>{
        this.themeGridList.error = true
      }).finally(()=>{
        this.themeGridList.loading = false
      })
    },
    // 获取商品详情
    fetchSpuDetail(id) {
      return new Promise((resolve, reject) => {
        getSpuDetail(id).then(res => {
          // console.log('获取spu详情', res.data)
          resolve(res.data)
        }).catch(error => {
          resolve({})
        })
      })
    },
    // 根据专区id获取专区商品
    getGoodsByAreaId(id) {
      let index = this.goodsList.findIndex(ele => ele.areaId === id)
      if (index === -1) return []
      // 过滤掉数据为空的商品
      let filters = this.goodsList[index].goods.filter(g => !isEmpty(g))
      // console.log('filters', filters)
      return filters
    },
    // 跳转商品详情页
    toSpuDetail(e) {
      console.log(e)
      let goods = e.currentTarget.dataset['goods']
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${goods.id}`
      })
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_GOODS_DETAIL',data:{spuId:goods.id}})
      // #endif
    },
    jump2mallSeconndlist(item){
      console.log(item)
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url:`/pagesA/goods-list/mall-second-list?categoryId=${item.id}&categoryName=${item.categoryName}`
      })
      // #endif
      // #ifdef H5
      this.$flutter({ method: 'TO_MALL_SECOND', data: { title: item.categoryName, categoryId: item.id } })
      // #endif
    },
    //分类类目更多v2.1.0
    changeMoreBtnStatus(index){
      console.log(index,this.pageCategoryList[index])
      this.pageCategoryList[index].moreBtnStatus = !this.pageCategoryList[index].moreBtnStatus
    },
    // 查看更多商品
    moreGoods(item,TYPE) {
      let type = item.busType ? item.busType : item.type;
      if(TYPE == "theme"){
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/activity/Goods?activityId=${item.id}&type=99`
        })
        // #endif
  
        // #ifdef H5
        this.$flutter({method:'SPECIAL_GOODS',data: {id:item.id,type:'new_api'}})  // 商品专题 （这里的查看更多用到了新接口）
        // #endif
      }else{
        if (item.busType == 0) {
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pagesA/activity/Goods?activityId=${item.id}&type=99`
          })
          // #endif
    
          // #ifdef H5
          this.$flutter({method:'SPECIAL_GOODS',data: {id:item.id,type:'new_api'}})  // 商品专题 （这里的查看更多用到了新接口）
          // #endif
        }else{
          this.$_selectPath(type,item)
        }
      }
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
    // 点击搜索框打开搜索界面
    onClickSearch() {
      console.log('click')
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/goods-list/index?enableSearch=${true}`
      });
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_SEARCH'})
      // #endif
      // this.showSearchPopup = true
      // this.loadingCategory = true
      // getCategoryOne().then(res => {
      //   this.categoryList = res.data
      // }).finally(() => {
      //   this.loadingCategory = false
      // })
    },
    // 
    searchCategory(item) {
      uni.navigateTo({
        url: `/pages/goods-list/index?categoryId=${item.id}`
      });
    },
    confirmSearch(e) {
      let { value } = e.detail
      console.log('搜索', value)
      if (value) {
        uni.navigateTo({
          url: `/pages/goods-list/index?spuName=${value}`
        });
        // 保存搜索历史记录
        this.$store.commit('SET_SEARCH_HISTORY', value)
      }
    },
    // 清除历史记录
    onClearHistory() {
      uni.showModal({
        content: '确定删除历史记录？',
        success: (res) => {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.$store.commit('SET_SEARCH_HISTORY', '') // 清空
          }
        }
      });
    },
    clickPopup() {
      console.info('默认弹窗事件')
    },
    // 点击全部分类
    clickAllTab(){
      this.onTabsChange({detail:{name:"0"}})
    },
    getPhoneH(){
      let phoneData = uni.getSystemInfoSync();
      this.phoneH = phoneData.windowHeight;
    },
    goTop(){
      uni.pageScrollTo({
        scrollTop: 0,
        duration:0
      })
    },
    onErrorClick() {
      console.log("onErrorClick")
      this.error = false
      this.fetchShopThemeResources()
    },
    jump2mx(){//跳转关于秒寻
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url:"/pagesA/activity/Goods?activityId=1308326208840200194&type=4"
      })
      //#endif
      // #ifdef H5
      this.$flutter({ method: 'SPECIAL_GOODS', data: { id: '1308326208840200194' } })  // 商品专题
      // #endif
    },

    toChat(){
      // #ifdef H5
      this.$flutter({method:'MY_CHAT',data: { nickName: this.asisAsis }});
      // #endif
    },

    // 隐藏引导
    dismissGuide() {
      this.$store.commit("CLOSE_KEFUGUIDE_STATE");
    }
  },
  // 监听滚动
  onPageScroll: function(data) { // 防抖
    if(this.qipaoTop == 0){
      let query = uni.createSelectorQuery()
      query.select('.mall-banner').boundingClientRect((res) => {
        this.qipaoTop = res.top || 0
      }).exec()
    }
      // console.log(data.scrollTop,this.qipaoTop)
    if(this.qipaoTop > 0 && data.scrollTop > this.qipaoTop - 40) {
      this.qipaoTopStatus = true
    }else{
      this.qipaoTopStatus = false
      // console.log(this.qipaoTopStatus)
    }
    if(data.scrollTop > this.phoneH*3) {
      this.goTopBtn = true
    } else {
      this.goTopBtn = false
    }
  },
  // 触底加载
  onReachBottom() {
    console.log('触底加载')
    this.fetchShopThemeResources()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
    setTimeout(() => {
      console.log('下拉刷新') 
      uni.stopPullDownRefresh()
    }, 1500);
  },
  onShareAppMessage() {
    return {
      title: this.$config.shareText,
      path: `pages/start/index?sharePage=mall&shareUserId=${this.userInfo.id}`,
      imageUrl: this.IMAGE.SHARE_APP_COVER
    }
  },
}
</script>

<style lang="scss" scoped>
#mall{
  /deep/.van-notice-bar{
    padding: 0;
    height: unset;
    // background-color: transparent !important;
  }
  .title_fixed{
    position: fixed;
    width: 100%;
    top:0;
    z-index: 9999;
  }
  .mall-input-box{
    z-index:2;
    input{
      border-radius:12rpx;
      &.active{
        background: rgba(242, 242, 245, 1);
        width:536rpx;
      }
      &.disactive{
        width:622rpx;
        background: rgba(255, 255, 255, 0.72);
      }
    }
    &.active{
      background: #FFFFFF;
    }
  }
  // /deep/ .van-tabs{
  //   // height: 176rpx!important;
  //   width: calc(100% - var(--all-tab-width));
  //   margin-left:var(--all-tab-width);
  // }
  /deep/ .van-tabs__wrap{
    height: auto!important;
  }
  /deep/ .van-tabs__scroll{
    background: rgba(255,209,0,1) !important;
  }
  /deep/ .home-tabs .van-tab--complete:nth-of-type(2){
    opacity: 0;
  }
  /deep/ .van-tab{
    padding: 0;
    view{
      display: flex;
      flex-direction: column;
      font-size: 30rpx;
      line-height: 46rpx;
      padding-bottom: 14rpx;
    }
    text:first-child{
      padding: 0 24rpx;
      font-weight: 600;
    }
    text:last-child{
      font-size: 24rpx;
      color: #9DA0A4;
    }
  }
  /deep/ .van-tab--active view{
    text:first-child{
      border-radius:24rpx;
      background:rgba(255,209,0,1);
    }
  }
  .all-tab{
    position: absolute;
    z-index: 999;
    top: 0;
    left: 20rpx;
    background-color: #F3F4FD;
    padding: 0 10rpx;
    padding-bottom: 14rpx;
    line-height: 46rpx;
    &>view:first-child{
      border-radius: 24rpx;
      padding: 0 24rpx;
      font-weight: 600;
      font-size: 30rpx;
    }
    &>view:last-child{
      font-size: 24rpx;
      color: #9DA0A4;
    }
    &::after{
      content: "";
      position: absolute;
      right: 0;
      top: 36rpx;
      width: 2rpx;
      height: 30rpx;
      background: #9da0a4;
      opacity: .2;
    }
    &.active{
      &>view:first-child{
        background: #ffd100;
      }
    }
  }
  /deep/ .home-tabs{
    background-color: #F3F4FD;
  }
  .home-tab{
    min-height: 1000px;
    width: 100%;
    height: 100%;
  }
  /deep/ .van-tab{
    position: relative;
    background-color: #F3F4FD;
    padding: 0 10rpx;
    &::after{
      content: "";
      position: absolute;
      right: 0;
      top: 36rpx;
      width: 2rpx;
      height: 30rpx;
      background:rgba(157,160,164,1);
      opacity:.2;
    }
    &:last-of-type::after{
      display: none;
    }
  }
  /deep/ .van-tabs__line {
    background-color:transparent!important;
  }
  .cate-item{
    font-size: 26rpx;
    color: $uni-color-primary;
    padding: 20rpx 26rpx;
    background-color: #f6f6f6;
    border-radius: 4px;
    display: inline-block;
    margin: 0 16rpx 16rpx 0;
    line-height: 1;
  }
  .login-bar{
    position: fixed;
    right: 0;
    left: 0;
    padding: 0 40rpx;
    bottom: 40rpx;
  }
  .coupon-text{
    width: 100%;
    top:33%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
  }
  .swiper-dots{
    left: 32rpx;
    bottom: 32rpx;
    z-index: 2;
    view{
      border-radius: 50%;
      margin-right: 16rpx;
      background: #FFFFFF;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.16);
      opacity: 0.4;
    }
    view:last-of-type{
      margin-right: 0;
    }
    view.active{
      opacity: 1;
    }
  }
  .moreBtn{
    line-height: 88rpx;
    border: 1rpx solid #E1E2E8;
    border-radius: 8rpx;
    margin: 0 auto;
  }
  .go-top{
    bottom: 134rpx;
    right: 30rpx;
    align-items: center;
    background:rgba(255,255,255,0.7);
    border:2rpx solid rgba(230,230,230,1);
    border-radius:50%;
  }
  .guaranteeBox{
    width: 542rpx;
    border-radius: 12rpx;
    background: #E1E2E8;
    .guarantee{
      view{
        color: #606266;
      }
      &:nth-of-type(2){
        border-right:2rpx solid #D1D1D1;
        border-left:2rpx solid #D1D1D1;
      }
    }
  }
  .last-odd:after{
    content: "";
    display: block;
    width: 334rpx;
    height: 0;
  }
  .h668{
    height: 668rpx;
  }
  .assistant-box{
    z-index: 1;
    // background-color: #bc58bc;
    right: 32rpx;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.12);
    .assistant-box-content{
      top: 0;
      right: 114%;
      white-space: nowrap;
      background: #FFFFFF;
      opacity: 0.72;
      border-radius: 12rpx;
      .assistant-box-content-qipao{
        bottom:-12rpx;
        right: 24rpx;
      }
    }
  }
  .radius-12{
    border-radius: 12rpx;
  }
  .fs-100{
    font-size: 100rpx;
    font-weight: 500;
  }
  .fs-48{
    font-size: 48rpx;
    font-weight: 500;
  }
  .fs-30{
    font-size: 30rpx;
    color:#9EA0A4;
  }
  .fs-26{
    font-size: 26rpx;
  }
  .mb24{
    margin-bottom: 24rpx;
  }
  /*隐藏滚动条*/
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
}
</style>
