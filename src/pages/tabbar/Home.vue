<template>
  <view id="home" class="bg-white pb50 min-h-full">
    <!-- #ifdef MP-WEIXIN -->
    <custom-nav class="relative" :bg="'white'" showStatus >
      <view class="plr20">
        <view class="text-center h-full fs-lg-add fw600">首页</view>
      </view>
    </custom-nav>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <view class="row space-between mb26 plr40" :style="{'margin-top':navBarHeight + menuTop + 'px'}">
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <view class="row space-between mb26 plr40" :style="{'margin-top':'20px'}">
    <!-- #endif -->
      <view class="col wpct80">
        <view class="l-h28" style="color:#8A9199;">{{formatDate}}</view>
        <view class="fw600 ellipsis" style="font-size:54rpx;">
          Hi{{userInfo && userInfo.nickName ? `，${userInfo.nickName}` : ""}}  
        </view>
      </view>
      <view>
        <image :src="userInfo && userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT" class="w-h96 radius-circle" />
      </view>
    </view>
    <view>
      <view class="plr40 row wrap space-between">
        <view class="column-1 w-full" v-for="(item, n) in articles.list" :key="n" >
          <view class="info-card hidden" @tap="onImgClick(item)" v-if="n<todayRecommendNum">
            <view class="relative" :id="'tiezibody'+item.id">
              <image :src="item.articleImgVoList.find(e => e.cover === 1).url" lazy-load mode="widthFix" class="w-full block" v-if="!item.type"/>
              <image :src="item.articleImgVoList.find(e => e.cover === 1).url" lazy-load mode="widthFix" class="w-full block" v-if="item.type && selectPlayId != item.id " :style="{height:item.type && selectPlayId != item.id? '502rpx':'','min-height':'502rpx'}" />
              <block v-if="item.type && selectPlayId==item.id">
                <video
                  :class="['w-full', 'block', 'videoHeight',item.spuInfoVo ? 'borderTop' : 'borderAll']" 
                  :id="'video'+item.id" 
                  :src="videoUrl(item)" 
                  :muted="!isSound" 
                  :show-center-play-btn="false" 
                  :controls="false"
                  object-fit="contain"
                  @ended="endedVideo"
                />
              </block>
              <image :src="IMAGE.HOME_ICON_PLAY" class="absolute translate-center w120 h120" v-if="item.type && isPlayId != item.id" @tap.stop="controlVideo('play',item.id)">
              <view class="absolute w88 h88" style="bottom:0;left:0;" v-if="item.type && isPlayId == item.id" @tap.stop="controlVideo('pause',item.id)"> 
                <image :src="IMAGE.HOME_ICON_PAUSE" class="absolute translate-left w64 h44"></view>
              <view class="absolute w88 h88" style="bottom:0;right:0;" v-if="item.type && isPlayId == item.id && isSound" @tap.stop="controlVideo('isSound',item.id)">
                <image :src="IMAGE.HOME_ICON_SOUND" class="absolute translate-right w64 h44"></view>
              <view class="absolute w88 h88" style="bottom:0;right:0;" v-if="item.type && isPlayId == item.id && !isSound" @tap.stop="controlVideo('noSound',item.id)">
                <image :src="IMAGE.HOME_ICON_MUTE" class="absolute translate-right w64 h44"></view>
            </view>
            <view class="content-wrapper row center-y" v-if="item.spuInfoVo">
              <view class="w-h96 mr20 ml40">
                <image :src="item.spuInfoVo.imageUrl || IMAGE.NULL_GOODS_IMG" class="w-h-full" />
              </view>
              <view class="user-wrapper ellipsis flex-1 l-h40 mr12 ptb30">
                <view class="ellipsis fw600">{{ item.spuInfoVo.spuName }}</view>
                <view class="ellipsis fs-sm color-red fw600">¥{{ item.spuInfoVo && item.spuInfoVo.salesPrice | formatMoney}}</view>
              </view>
              <view class="ptb30 pr40" @tap.stop="buyTap(item)">
                <view class="content-wrapper-buy h56 mt10 fw600" :class="{'filter-gray':item.spuInfoVo.salesStock <= 0}" >{{item.spuInfoVo.salesStock>0 ? "购买" : "补货中"}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="row space-between mt40 mb36 plr40">
        <view class="col">
          <view class="fs-lg-big-add-add fw600">往期推荐</view>
          <view class="" style="color:#8A9199;">探索更多美妙好物</view>
        </view>
      </view>
      <view class="plr40 row wrap space-between">
        <view class="column-1 w-full" v-for="(item, n) in articles.list" :key="n">
          <view class="info-card hidden" @tap="onImgClick(item)" v-if="n>=todayRecommendNum">
            <view class="relative" :id="'tiezibody'+item.id">
              <image :src="item.articleImgVoList.find(e => e.cover === 1).url" lazy-load mode="widthFix" class="w-full" v-if="!item.type"/>
              <image :src="item.articleImgVoList.find(e => e.cover === 1).url" lazy-load mode="widthFix" class="w-full" v-if="item.type && selectPlayId != item.id " :style="{height:item.type && selectPlayId != item.id? '502rpx':'','min-height':'502rpx'}" />
              <block v-if="item.type && selectPlayId==item.id">
                <video
                  :class="['w-full', 'block', 'videoHeight',item.spuInfoVo ? 'borderTop' : 'borderAll']" 
                  :id="'video'+item.id" 
                  :src="videoUrl(item)" 
                  :muted="!isSound" 
                  :show-center-play-btn="false" 
                  :controls="false"
                  object-fit="contain"
                  @ended="endedVideo"
                />
              </block>
              <image :src="IMAGE.HOME_ICON_PLAY" class="absolute translate-center w120 h120" v-if="item.type && isPlayId != item.id" @tap.stop="controlVideo('play',item.id)">
              <view class="absolute w88 h88" style="bottom:0;left:0;" v-if="item.type && isPlayId == item.id" @tap.stop="controlVideo('pause',item.id)"> 
                <image :src="IMAGE.HOME_ICON_PAUSE" class="absolute translate-left w64 h44"></view>
              <view class="absolute w88 h88" style="bottom:0;right:0;" v-if="item.type && isPlayId == item.id && isSound" @tap.stop="controlVideo('isSound',item.id)">
                <image :src="IMAGE.HOME_ICON_SOUND" class="absolute translate-right w64 h44"></view>
              <view class="absolute w88 h88" style="bottom:0;right:0;" v-if="item.type && isPlayId == item.id && !isSound" @tap.stop="controlVideo('noSound',item.id)">
                <image :src="IMAGE.HOME_ICON_MUTE" class="absolute translate-right w64 h44"></view>
            </view>
            <view class="content-wrapper row center-y" v-if="item.spuInfoVo">
              <view class="w-h96 mr20 ml40">
                <image :src="item.spuInfoVo.imageUrl || IMAGE.NULL_GOODS_IMG" class="w-h-full" />
              </view>
              <view class="user-wrapper ellipsis flex-1 l-h40 mr12 ptb30">
                <view class="ellipsis fw600">{{ item.spuInfoVo.spuName }}</view>
                <view class="ellipsis fs-sm color-red fw600">¥{{ item.spuInfoVo && item.spuInfoVo.salesPrice | formatMoney}}</view>
              </view>
              <view class="ptb30 pr40" @tap.stop="buyTap(item)">
                <view class="content-wrapper-buy h56 mt10 fw600" :class="{'filter-gray':item.spuInfoVo.salesStock <= 0}" >{{item.spuInfoVo.salesStock>0 ? "购买" : "补货中"}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="color-gray fs-mini text-center ptb20">
        <text v-if="articles && finished">我是有底线的</text>
        <text v-if="articles && loading">更多数据加载中...</text>
        <text v-if="articles && error" @click="onErrorClick">加载失败，点击重试</text>
      </view>
      <!-- fixed盒子 -->
      <scroll-view class='fixedScroll' style='width: 100%; height: 10rpx; position: fixed; top: 520rpx;z-index: -1;'></scroll-view>
    </view>
    <!-- 登录 -->
    <view class="login-bar" v-if="!token">
      <!-- #ifdef MP-WEIXIN -->
      <navigator url="/pages/login/Phone?from=home">
        <view style="background-color:#FF9EA8;"
        class="radius-round row space-between center-y plr30 ptb14">
          <text class="flex-1">首次登录即送500喵豆</text>
          <button class="w160 h48 l-h48 fs-normal color-primary bg-white radius-round text-center">登录</button>
        </view>
      </navigator>
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <view style="background-color:#FF9EA8;"
      class="radius-round row space-between center-y plr30 ptb14" @tap="toLogin()">
        <text class="flex-1">首次登录即送500喵豆</text>
        <button class="w160 h48 l-h48 fs-normal color-primary bg-white radius-round text-center">登录</button>
      </view>
      <!-- #endif -->
    </view>
    <!-- 新人礼弹窗 -->
    <van-popup :show="showPopup" custom-class="bg-opacity">
      <view>
        <image :src="popupImg" style="max-width:590rpx;" mode="widthFix" @tap="clickPopup" />
      </view>
      <view class="text-center mt50"><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h90" @tap="closePopup" /></view>
    </van-popup>
    <!-- 优惠券到账弹窗(单张) -->
    <van-popup :show="couponPopup === 1" custom-class="bg-opacity">
      <view @tap="clickCouponPopup">
        <image :src="IMAGE.COUPON_POPOVER" style="width:750rpx;height:778rpx;"  />
        <view class="coupon-text text-center absolute" v-if="couponResult.length">
          <view class="fs-48">¥<text class="fs-100">{{couponResult[0].couponAmount/100}}</text></view>
          <view class="fs-30">满{{couponResult[0].fullreduceAmount/100}}元可用</view>
          <view class="fs-30">{{couponResult[0] && couponResult[0].startTime | formatTime( 'Y/M/D')}}~{{couponResult[0] && couponResult[0].endTime | formatTime( 'Y/M/D')}}</view>
        </view>
      </view>
      <view class="text-center mt50"><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h90" @tap="closePopup('coupon')" /></view>
    </van-popup>
    <!-- 优惠券到账弹窗(多张) -->
    <van-popup :show="couponPopup === 2" custom-class="bg-opacity-more" @close="closePopup('coupon')">
      <view class="bg-red ptb60">
        <view class="text-center popup-title mb22" style="width:664rpx;">优惠券到账啦</view>
        <view class="text-center popup-msg mb42">已领取优惠券可在 秒寻小程序-个人中心 查看</view>
        <view  style="max-height:600rpx;overflow:auto;">
          <view class="relative mb24 last-coupon" v-for="(item,idx) in couponResult" :key="idx">
            <view class="h50 w24 bg-red radius absolute" :style="{left: couponLeftWidth+'px',top: '-18%'}"></view>
            <view class="coupon-card row ptb36 mauto space-around hidden">
              <view class="pl20 pr40 couponLeftWidth" style="border-right: 1px dashed rgba(157,160,164,1);">
                <view class="fw600 fs-lg mb10 ellipsis w350">{{item.title}}</view>
                <view class="fs-sm">除特价商品外，满{{ item.fullreduceAmount / 100 }}元可用</view>
                <view class="fs-sm">有效期:{{item.startTime | formatTime( 'Y/M/D')}}-{{item.endTime | formatTime( 'Y/M/D')}}</view>
              </view>
              <view class="fw600 l-h100 flex-1 text-center" style="font-size:38rpx;">¥<text style="font-size:60rpx;">{{ item.couponAmount / 100 }}</text></view>
            </view>
            <view class="h50 w24 bg-red radius absolute" :style="{left: couponLeftWidth+'px',bottom: '-18%'}"></view>
          </view>
        </view>
        <button
          class="mt40 home-button"
          @tap="clickCouponPopup"
        >去使用</button>
      </view>
      <!-- <view class="text-center mt50"><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h90" @tap="closePopup" /></view> -->
    </van-popup>
    <!-- 购买弹窗 -->
    <van-popup
      :show="buyPopup"
      round
      custom-class="bg-white"
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
            {{currentSpu.spuName}}
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
            <view class="bg-pink color-white fs-lg fw600 l-h88 text-center mlr28 mt24 mb30" :class="{'filter-gray':!currentSku.salesStock}" style="border-radius:44rpx;margin:auto 0;" @tap="buyClick(1)" >
                购买
            </view>
          </view>
        </view>
      </view>
    </van-popup>

    <!-- 新会员引导弹框 -->
    <van-popup
      :show="token && vipGuidePopup==1"
      :close-on-click-overlay="true">
      <view class="bg-white-12 hidden center-x" style="width:600rpx">
         <view>
           <image :src="IMAGE.HOME_VIP" mode="widthFix" class="w320"/>
         </view>
         <view class="fw600 fs-lg-add pt20 pb16 plr80">Hi{{userInfo && userInfo.nickName ? `，${userInfo.nickName}` : ""}}</view>
         <view class="color-gray fs-sm-add l-h44 plr48 text-left">秒寻会员体系升级，欢迎您成为{{userInfo&&userInfo.levelName}}会员。查看“会员专属”，专属助理和更多会员福利在等你~</view>
         <view class="bg-pink radius-sm color-white center mauto h80 l-h80 w256 mtb48" @tap="seeVipGuide">去查看</view>
      </view>
      <view class="text-center mt50"><image :src="IMAGE.ICON_CLOSE_WHITE" class="w-h90" @tap="closePopup('vipGuide')" /></view>
    </van-popup>
  </view>
</template>

<script>
import HomeInfoCard from '_c/HomeInfoCard'
import Sku from '_c/Sku'
import CustomNav from "_c/CustomNav";
import { getArticleList } from '@/api/article'
import { getSpuToEs } from '@/api/goods'
import { getFanInvitePopups, acceptOrRejectInvite } from '@/api/member'
import { mapGetters } from 'vuex'
import { HOME_VIP,HOME_ICON_MUTE,HOME_LOGIN_BOX,HOME_JIAO,HOME_DDD,HOME_CLOSE,SHARE_APP_COVER, ICON_CLOSE_WHITE, HOME_POPUP_NEW_USER ,COUPON_POPOVER, AVATAR_DEFAULT, HOME_SKU_CLOSE, ICON_HEART_ACTIVE, ICON_HEART, ICON_SHARE, HOME_ICON_PLAY,
  NULL_GOODS_IMG, HOME_ICON_SOUND, HOME_ICON_PAUSE,GOODS_ICON_SILVER,GOODS_ICON_GOLD} from '@/imageConfig'
import { isObjectEqual, complareToNowTime, debounce, deepClone } from '@/utils'
import { getReceivedCoupon} from "@/api/activity/coupon";
import { jumpLink } from "@/mixins";

export default {
  name: 'Home',
  components: { HomeInfoCard, Sku, CustomNav },
  mixins:[jumpLink],
  data() {
    return {
      // 资源：resourcesType => 1:文章；2：商品：3：邀请活动任务;4：限时限价活动商品列表5:SVIP;6:普通弹窗）
      IMAGE: {
        HOME_LOGIN_BOX,
        HOME_ICON_MUTE,
        SHARE_APP_COVER,
        ICON_CLOSE_WHITE, 
        HOME_POPUP_NEW_USER,
        COUPON_POPOVER,
        HOME_JIAO,
        HOME_DDD,
        HOME_CLOSE,
        AVATAR_DEFAULT,
        HOME_SKU_CLOSE,
        ICON_HEART_ACTIVE, 
        ICON_HEART, ICON_SHARE, 
        HOME_ICON_PLAY,
        NULL_GOODS_IMG, 
        HOME_ICON_SOUND, 
        HOME_ICON_PAUSE,
        HOME_VIP,
        GOODS_ICON_SILVER,
        GOODS_ICON_GOLD
      },
      showPopup: false,
      articles: {
        pageSize:20,
        pageNo:0,
        list:[]
      },
      popupImg: HOME_POPUP_NEW_USER,
      couponResult: [], // 收到的优惠券
      couponPopup: 0,
      couponLeftWidth:0,
      buyPopup: false, //购买弹窗
      ownSpec: {}, // 当前规格
      finished: false,
      error: false,
      loading: false,
      todayRecommendNum:0, //今日推荐条数
      currentSku: {}, // 当前sku
      buyCount: 1, // 购买数量
      currentSpu:{}, // 当前spu
      attributeKeys: [],  // 规格
      skuCarousel:[], // sku轮播图
      fullScreen:false, //是否全屏播放
      fullScreenStu:false,
      addfullScreen:[], //加载后更多视频id
      selectPlayId:"",//当前播放的视频
      isPlayId:"",//当前播放的视频
      secondVideoPlay:false,
      videoContext:"",//视频上下文
      isSound:false, //静音
      netWorkType:"", //当前网络
      type: 0 , //是否跨境
    }
  },
  computed: {
    formatDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let day = new Date().getDay();
      let arr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
      return  `${month}月${date}日，${arr[day]}`;
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
    // 已选
    selectValues() {
      return Object.values(this.ownSpec).join(',')
    },
    // 市场价
    platformPrice() {
      return this.currentSku.platformPrice || 0
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
    //视频
    videoUrl() {
      return (obj) => {
        // console.log('videoObj====', obj)
        let videoObj = obj.articleImgVoList.find(item => item.type === 1)
        return videoObj && videoObj.url
      }
    },
    ...mapGetters(['token', 'userInfo', "navBarHeight", "menuTop", "vipGuidePopup","shareUserId"])
  },
  onLoad() {
    this.init()
    console.log(this.vipGuidePopup)
  },
  onShow() {
    if(this.token){ //未登录不执行
      //获取粉比邀请
      // this.fetchFanInvitePopups()
      //优惠券弹窗（data不为null时）
      this.fetchReceivedCoupon()
    } else {
      // #ifdef MP-WEIXIN
      uni.hideShareMenu()
      // #endif
    }
  },
  methods: {
    init() {
      this.articles.pageSize = 20
      this.articles.pageNo = 0
      this.articles.list.length = 0 // 清空数组
      this.finished = false
      this.error = false
      this.loading = false
      this.loadArticleList()
      this.getNetworkStatus()
    },
    // fetchFanInvitePopups() {
    //   return getFanInvitePopups().then(res => {
    //     if(res.data){
    //       res = res.data
    //       if(complareToNowTime(res.latestTime)){
    //         this.popupImg = res.imgUrl
    //         let that = this
    //         this.clickPopup = () => {
    //           uni.navigateTo({
    //             url: `/pagesA/invitation/ReceiveUpdate?data=${JSON.stringify(res)}`,
    //             complete() {
    //               that.showPopup = false
    //             }
    //           })
    //         }
    //         this.closePopup = () => {
    //           uni.showModal({
    //             // title: '确定删除素材吗？',
    //             content: res.inviteContent,
    //             confirmText: '我再想想',
    //             cancelText: '残忍拒绝',
    //             success: (t) => {
    //               if(t.cancel){ // 残忍拒绝
    //                 acceptOrRejectInvite({
    //                   id: res.id,
    //                   status: 2
    //                 }).then(res=>{
    //                   that.showPopup = false
    //                 })
    //               }
    //             }
    //           })
    //         }
    //         this.showPopup = true
    //       }
    //     }
    //   })
    // },
    //优惠券
    fetchReceivedCoupon(){
      getReceivedCoupon().then(res => {
        if (res.data && res.data.length) {
          setTimeout(()=>{
            let query = uni.createSelectorQuery()
            query.select('.couponLeftWidth').boundingClientRect((res) => {
              console.log(res)
              this.couponLeftWidth = res.width + 10 || 0
            }).exec()
          },1000)
          console.log("优惠卷", res);
          this.couponResult = res.data;
          if (this.couponResult.length === 1) {
            this.couponPopup = 1
          } else if (this.couponResult.length > 1) {
            this.couponPopup = 2
          }
        }
      });
    },
    // 获取文章
    loadArticleList() {
      if (this.finished || this.loading || this.error) return
      this.articles.pageNo += 1
      let query = {
        pageSize: this.articles.pageSize,
        pageNo: this.articles.pageNo,
      }
      this.loading = true
      getArticleList(query).then(res => {
        let data = res.data
        this.todayRecommendNum = data.todayRecommendNum;
        if(data && data.pageInfo.list.length>0 ){
          this.articles.list = this.articles.list.concat(data.pageInfo.list)
          // console.log('articles.list', this.articles.list)
        }
        if (!data.pageInfo.hasNextPage) { // 是否还有下一页
          this.finished = true
        }
        this.error = false
        setTimeout(()=>{
          this.observeStart()
        },1000)
      }).catch(error => {
        this.error = true
        this.articles.pageNo -= 1
      }).finally(() => {
        this.loading = false
      })
    },
    fetchSpuToEs(spuId){
      console.log('当前spuId',spuId)
      return new Promise((resolve, reject) => {
        getSpuToEs(spuId).then(res=>{
          if(res.data){
            let data = res.data
            this.type = data.type
            this.attributeKeys = data.attributeKeyVos || []
            this.skuList = data.skuVos || []
            this.currentSku = data.skuVos[0]
          resolve(res.data)
          }else{
            reject({resInfo: '商品不存在'})
          }
        }).finally(()=>{
          uni.hideLoading()
        })
      })
    },
    // 关闭弹窗
    closePopup(type) {
      if (type === 'share') {
        this.sharePopup = false
      } else if (type === 'spuDesc') {
        this.spuDescPopup['show'] = false
      } else if (type === 'buy') {
        this.disableScroll = false
        this.buyPopup = false
      } else if (type === 'coupon') {
        this.couponPopup = 0
      }else if(type === 'vipGuide'){
        this.$store.commit("CLOSE_VIPGUIDE_STATE");
      } 
      else{
        console.info('默认弹窗关闭事件')
        this.showPopup = false
      }
    },

    toLogin(){
      this.$flutter({method:'TO_LOGIN'})
    },

    //跳到活动页
    clickCouponPopup(){
      console.info('默认弹窗关闭事件')
      this.closePopup('coupon')
      // #ifdef MP-WEIXIN
      uni.switchTab({
        url: `/pages/tabbar/Mall`
      })
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_HOME',data:{index:3}})
      // #endif
    },
    onErrorClick() {
      this.error = false
      this.loadArticleList()
    },
    // 不要删--by-laoji
    clickPopup() {
      console.info('默认弹窗事件')
    },
    //获得网络状态
    getNetworkStatus(){
      uni.getNetworkType({
        success: (res) => {
          this.netWorkType = res.networkType
          // console.log(this.netWorkType)
        }
      })
      uni.onNetworkStatusChange((res) => {
        this.netWorkType = res.networkType
        if(this.netWorkType == "wifi"){
          this.observeStart()
        }else{
          if(this.videoContext && this.videoContext.pause){
            this.controlVideo("pause")
          }
        }
        console.log(res.isConnected)
        console.log(res.networkType)
      })
    },
    onBuyCountChange(e) {
      // console.log(e.detail)
      this.buyCount = e.detail
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
          }
        }
      } 
    },
    //立即购买
    async buyTap(spu){
      console.log(spu)
      if (this.token) {
        if(!spu.spuInfoVo.salesStock) return;
        console.log("buyTap")
        uni.showLoading({mask:true})
        await this.fetchSpuToEs(spu.spuInfoVo.spuId)
        this.buyPopup = true;
        this.currentSpu = spu.spuInfoVo
        this.currentSku = this.skuList[0];
        // if (skuIndex >= 0) {
        //   this.currentSku = this.skuList[skuIndex];
        // } else {
        //   this.currentSku = this.skuList[0];
        // }
        this.ownSpec = JSON.parse(this.currentSku.ownSpec);
        console.log(this.currentSku)
        this.getCarousel()
      }else{
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
    // 立即购买
    buyClick(type) {

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
            // console.info(urlParam)
            // 进入确认订单页面
            // #ifdef MP-WEIXIN
            uni.navigateTo({
              url: `/pages/order/ConfirmOrder?${urlParam}`
            })
            // #endif

            // #ifdef H5
            this.$flutter({method: 'TO_CONFIRM_ORDER', data:{skuId:this.currentSku.id,quantity:this.buyCount,orderType:2}})
            // #endif
          }
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
    //监听视频是否与相对盒子交互
    observeStart(){
      let arr = [];
      // 拿到视频帖子id
      arr = this.articles.list.filter(item => item.type == 1)
      // console.log(arr)
      arr.map((item,idx) => {
        this._observer = this.createIntersectionObserver()
        this._observer
          .relativeTo('.fixedScroll')
          .observe(`#tiezibody${item.id}`, (res) => {
            console.log(res);
            console.log('进入触交监听');
            // 是否进入全屏，若是则不监听触交事件
            // if (this.fullScreen) {
            //   console.log('fullScreen', this.data.fullScreen + arr[s]);
              // 将加载更多后的视频id存入addfullScreen
            //   this.data.addfullScreen = arr[s];
            //   this.fullScreenStu = true;
            //   return;
            // }
            if (res.intersectionRatio > 0) {
              console.log(res.intersectionRatio)
              if (this.fullScreenStu) return;
              // 若加载更多后的视频id与当前id一致，则不监听触交事件
              setTimeout(()=>{
                this.isPlay = true
                this.videoContext = uni.createVideoContext(`video${item.id}`, this)
                if(this.netWorkType == "wifi"){
                  this.videoContext.play()
                  this.isPlayId = item.id
                  this.selectPlayId = item.id
                }
                // console.log('ispull', this.ispull);
              },0)
            }else{
              if(this.videoContext){
                this.videoContext.pause();
                this.isPlayId = ""
              }
            }
          })
      })
    },
    onImgClick(item) {
      if(item.jumpType || item.jumpSourceId){
        item.busId = item.jumpSourceId
        this.$_selectPath(item.jumpType,item)
      }else{
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `${this.$pageUrl.ARTICLE}?id=${item.id}`
        });
        // #endif

        // #ifdef H5
        this.$flutter({ 
          method: 'TO_ARTICLE', data: { id: item.id }
        })
        // #endif
      }
    },
    controlVideo(type,id){
      console.log(type)
      switch(type){
        case "play" : 
          // if(this.selectPlayId != id){
          //   uni.pageScrollTo({
          //     selector: `#tiezibody${id}`,
          //     duration: 300
          //   })
          // }
          // #ifdef MP-WEIXIN
          if(this.selectPlayId != id){
            this.videoContext = uni.createVideoContext(`video${id}`, this)
            this.selectPlayId = id
          }
          this.videoContext.play();
          this.isPlayId = id
          if (this.netWorkType != "wifi"){
            uni.showToast({
              title:`正在使用${this.netWorkType}网络播放`,
              icon:"none"
            })
          }
          // #endif
          // #ifdef H5
          this.$flutter({method:'TO_ARTICLE',data:{id:id}})
          // #endif
          break;
        case "pause" : 
          this.videoContext.pause();
          this.isPlayId = ""
          break;
        case "isSound" : 
          this.isSound = false
          break;
        case "noSound" : 
          this.isSound = true
          break;
        default : break;
      }
    },
    endedVideo(){
      console.log("ended")
      this.isPlayId = ""
    },
    seeVipGuide(){
      this.$store.commit("CLOSE_VIPGUIDE_STATE");
      // #ifdef MP-WEIXIN
      uni.switchTab({
        url: '/pages/tabbar/Mine'
      });
      // #endif
      // #ifdef H5
      this.$flutter({method:'TO_HOME',data:{index:3}})
      // #endif
   }
  },
  onUnload() {
    if (this._observer) this._observer.disconnect()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
    setTimeout(() => {
      console.log('下拉刷新') 
      uni.stopPullDownRefresh()
    }, 1000);
  },
  // 滚动加载
  onReachBottom() {
    console.log('滚动加载')
    this.loadArticleList()
  },
  onShareAppMessage(){
    return {
      title: this.$config.shareText,
      path: `/pages/start/index?sharePage=home&shareUserId=${this.userInfo.id}`,
      imageUrl: this.IMAGE.SHARE_APP_COVER
    }
  }
}
</script>

<style lang="scss" scoped>
#home{
  /deep/ .van-tab{
    padding-left: 20rpx;
    padding-right: 20rpx;
  }
  /deep/ .van-tabs__line{
    background-color: $uni-color-theme !important;
  }
  /deep/ .van-tab--active view{
    font-size: 40rpx !important;
    color: $uni-color-primary !important;
    font-weight: 600 !important;
  }
  /deep/ .van-tab--complete view{
    font-size: 28rpx;
    color: $uni-color-gray;
    font-weight: 600;
  }
  /deep/ .van-tabs__scroll{
    background-color: $uni-bg-color-primary;
  }
  /deep/ .van-overlay{
    background-color: rgba(0,0,0,.5);
  }
  /deep/ .van-popup{
    background-color: transparent;
  }
  .jifen-task{
    position: fixed;
    right: 0;
    bottom: 300rpx;
  }
  .login-bar{
    position: fixed;
    right: 0;
    left: 0;
    padding: 0 40rpx;
    bottom: 40rpx;
    z-index: 99;
  }
}
.home-msg{
  right:32rpx;
  width:458rpx;
  padding: 26rpx 0 26rpx 26rpx;
  z-index: 100;
  font-size:28rpx;
  color:rgba(51,51,51,1);
  line-height:36rpx;
  box-shadow:0rpx 4rpx 10rpx 0rpx rgba(204,204,204,1);
  border-radius:8rpx;
  .home-jiao{
    top: -26rpx;
    right: 96rpx;
  }
}
.home-tab{
  min-height: 1000px;
  width: 100%;
  height: 100%;
}
.home_fixed{
  padding-top: 44px;
  /deep/ .van-sticky{
    position: fixed !important;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 100;
  }
  /deep/ .van-tab{
    background-color: #fff;
  }
  /deep/ .van-tabs__scroll{
    background-color: #fff !important;
  }
}
/deep/ .bg-opacity-more{
  background-color: transparent;
  z-index: 100;
}
/deep/ .van-tabs__nav{
  width: 76%;
}
/deep/ .bg-red{
  background-color: #FF3838 !important;
  border-radius: 32rpx;
}
/deep/ .bg-white{
  background-color: #FFFFFF !important;
  border-radius: 26rpx;
}
/deep/ .bg-white-12{
  background-color: #FFFFFF !important;
  border-radius: 12rpx;
}
/deep/ .overlay-index--van-overlay{
  z-index: 100;
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
.popup-title{
  font-size:36rpx;
  font-weight:600;
  color:rgba(255,255,255,1);
}
.popup-msg{
  font-size:24rpx;
  color:rgba(255,255,255,1);
  opacity:0.5;
}
.coupon-text{
  width: 100%;
  top:33%;
  left: 50%;
  transform: translate3d(-50%,-50%,0);
}
.coupon-card{
  width:599rpx;
  background:rgba(255,255,255,1);
  box-shadow:0px -3rpx 27rpx 0px rgba(0, 0, 0, 0.1);
  border-radius:10rpx;
}
.suXian{
  transform:rotate(90deg);
  font-size:16px;
  color:rgba(157,160,164,1);
  opacity:0.3;
  max-height: 100%;
}
.home-button{
  width:570rpx;
  background-color:white;
  color: black;
  box-shadow:0px -3rpx 27rpx 0rpx rgba(0, 0, 0, 0.23);
  border-radius:32rpx;
}
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
  background:#FF9EA8;
  border-radius:28rpx;
  font-weight:600;
  padding: 0 46rpx;
  text-align: center;
  color:#ffffff;
}
.videoHeight{
  height: 502rpx;
}
.borderTop{
  border-radius: 26rpx 26rpx 0 0 ;
  overflow: hidden;
}
.borderAll{
  border-radius: 26rpx ;
  overflow: hidden;
}
/deep/ .van-popup{
  margin-top: 10%;
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
.mb24{
  margin-bottom: 24rpx;
}
.last-coupon:last-child{
  margin-bottom: 0 !important;
}
</style>
