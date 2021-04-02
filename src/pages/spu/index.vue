<template>

  <scroll-view
    :scroll-y="!disableScroll"
    style="height:100vh;position:relative;"
  > 
    <!-- #ifdef MP-WEIXIN -->
    <custom-nav>
      <view class="plr20">
        <view
          v-if="pagesDetail >= 2"
          class="radius-circle w64 h64 relative"
          :style="{ 'background-color': 'rgba(0,0,0,.2)' }"
          @tap="goBack"
        >
          <image
            :src="IMAGE.ICON_RETURN"
            style="width:64rpx;height:64rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"
          />
        </view>
        <view v-else class="radius-circle w64 h64 relative" @tap="goBack">
          <image
            :src="IMAGE.GOODS_SPU_HOME"
            style="width:64rpx;height:64rpx;position: absolute; left: 0; top: 0; right: 0; bottom: 0;margin: auto;"
          />
        </view>
      </view>
    </custom-nav>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <custom-nav>
      <view class="plr40 pt80">
        <view class="radius-circle w64 h64 relative" :style="{'background-color':'rgba(0,0,0,.2)'}" @tap="goBack">
          <image :src="IMAGE.ICON_RETURN" style="width:64rpx;height:64rpx;position:absolute;left:0;top:0;right:0,bottom:0;margin:auto;"/>
        </view>
      </view>
    </custom-nav>
    <!-- #endif -->
    <view v-if="isEmpty" style="height:100vh;text-align:center;margin-top:200px;">
      <image :src="IMAGE.GOODS_SPU_EMPTY" style="width:50%;height:30%;"/>
      <view class="mt48 color-gray-simple">这个商品下架了哦～</view>
    </view>
    <view v-else
      id="spu-page"
      class="bg-primary"
      :class="{ 'scroll-disabled': scrollDisabledStatus }"
    >
      <view class="top-container">
        <!-- 轮播图 -->
        <view class="relative">
          <swiper
            style="height: 100vw; wdith: 100vw;"
            :indicator-dots="!playing"
            indicator-color="rgba(0, 0, 0, 0.32)"
            indicator-active-color="#FF9EA8"
            :autoplay="!isInVideo"
            interval="4000"
            @change="onSwiperChange"
          >
             <swiper-item v-if="video.length">
               <image :src="video[0]" lazy-load mode="aspectFill" class="w-h-full" v-if="isVideoFirst"/>
                <video
                  v-if="videoContext != null"
                  :id="vid"
                  :show-center-play-btn="false"
                  :show-play-btn="playing"
                  :src="video[1]"
                  :poster="video[0]"
                  style="width:100vw; height:100vw;"
                  :enable-progress-gesture="false"
                  @ended="onEnded"
                  @pause="onPause"
                  @play="onPlay"
                  :show-fullscreen-btn="false"
                />
              </swiper-item>
            <swiper-item v-for="(item, index) in carousel" :key="index">
              <image
                :src="item.imgUrl"
                mode="aspectFill"
                class="w-h-full"
                @tap="onPreviewImage(item.imgUrl)"
              ></image>
            </swiper-item>
          </swiper>
          <image
            :src="IMAGE['HOME_ICON_PLAY']"
            class="play-btn"
            @tap="goPlay"
            v-if="showPlayBtn"
          />
        </view>
        <!-- 按钮 -->
        <view
          class="btn-group"
          :style="{ '--top': menuTop + navBarHeight + 'px' }"
        >
          <!-- <navigator
            :url="
              `/pagesA/material/Goods?spuId=${spuId}&skuId=${currentSku.id}`
            "
            v-if="svip === 1"
          >
            <image :src="IMAGE.GOODS_ICON_SUCAI" class="w-h60 mr30" />
          </navigator> -->
          <!-- <view @tap="jump2qiyu" class="plr0 bg-opacity inline-block" style="overflow:unset;"> 
            <image :src="IMAGE.ICON_CUSTOMER" class="w-h60 mr30" />
          </view> -->
        </view>
      </view>
      <!-- <vip-bar
        :svip="svip"
        :borderStyle="false"
        :sales-price="salesPrice"
        :obtainAmount="obtainAmount"
      /> -->
      <!-- 价格 -->
      <view
        class="plr32"
        :style="{'background':`url(${IMAGE.GOODS_SPU_ACTBG})`,'background-size':'cover'}"
        v-if="currentSku && currentSku.activityDiscountSku"
      >
        <view class="row center-y h100">
          <view class="fs-lg-add fw600 flex-1" style="color:rgba(255, 255, 255, .87)">
            限时特惠
          </view>
          <view class="color-white h48 w2 mr28" style="background: rgba(255, 255, 255, .56);"></view>
          <view class="col center-x">
            <view class="color-white row col" v-if="!isTimeShow">
              <view class="color-white fs-22">距结束还剩:</view>
              <van-count-down
                use-slot
                :time="countDown"
                @change="onChangeCountDown"
                @finish="onTimeFinish"
              >
                <view v-if="!isOver2Days" class="color-white mt4">
                  <text class="count-item">{{
                    timeData.days
                      ? timeData.days * 0 + timeData.hours
                      : timeData.hours
                  }}</text
                  >: <text class="count-item">{{ timeData.minutes }}</text
                  >:
                  <text class="count-item">{{ timeData.seconds }}</text>
                </view>
                <view class="color-white fs-sm mt4" v-if="isOver2Days">
                  <text>{{ timeData.days }}天</text>
                  <text>{{ timeData.hours }}小时</text>
                </view>
              </van-count-down>
            </view>
            <view v-if="isTimeShow">
              <view class="mr10 l-h42 color-white fs-sm">活动已结束</view>
            </view>
          </view>
        </view>
      </view>
      <view class="pt30 bg-white">
        <!-- 标签 -->
        <view
          class="row plr32 bg-white"
          v-if="isYouxuan || isType == 1 || labelName"
        >
          <view class="row l-h40 bg-pink radius-mini mr16" v-if="isYouxuan">
            <view
              class="w-h32 radius-circle ml8 mr4"
              ><image :src="IMAGE.GOODS_SPU_YOUXUAN" class="w-h32" style="transform:translateY(-2rpx)"
            /></view>
            <view class="w2 h40 color-white mr8" style="font-size:16rpx;">|</view>
            <view
              class="pr10 fs-22 h40 color-white "
              >秒寻优选</view
            >
          </view>
          <view class="row l-h40 radius-mini mr16" style="background-color:#6E88D6;" v-if="isType == 1">
            <view
              class="w-h32 radius-circle ml8 mr4"
              ><image :src="IMAGE.GOODS_SPU_KUAJING" class="w-h32" style="transform:translateY(-2rpx)"
            /></view>
            <view class="w2 h40 color-white mr8" style="font-size:16rpx;">|</view>
            <view
              class="pr10 fs-22 h40 color-white"
              >跨境商品</view
            >
          </view>
          
          <view
            class="row l-h40 radius-mini"
            style="background-color:#88C8AA;" 
            v-if="
              labelName &&
                labelName != 'null' &&
                labelName != 'undefined' &&
                labelName != ''
            "
          >
            <view
              class="w-h32 radius-circle ml8 mr4"
              ><image :src="IMAGE.GOODS_SPU_TUIJIAN" class="w-h32" style="transform:translateY(-2rpx)"
            /></view>
            <view
              class="pr10 fs-22 h40 color-white"
              >{{ labelName }}</view
            >
          </view>
        </view>
        <!-- 价格 -->
        <view class="bg-white pt8 pb40 mb16 plr32">
          <view class="mb40" :class="{ mb26: currentSku && !currentSku.activityDiscountSku }">
            <view class="fs-lg-add fw600 ellipsis l-h48">{{ spuName }}</view>
            <view v-if="spuTitle" class="fs-normal ellipsis l-h40 mt8" style="color:#909399;">{{ spuTitle }}</view>
          </view>
          <price-info
            :platform-price="platformPrice"
            :sales-price="salesPrice"
            :sales="sales"
          >
            <!-- <text slot="sales-price-right" v-if="obtainIntegral > 0" class="color-gray fs-sm">下单返{{ obtainIntegral }}喵豆</text> -->
          </price-info>
          <view v-if="userInfo&&userInfo.levelCode>0&&type==0" class="row center-y h40 l-h40 plr8 radius-mini mt8" 
            style="width:fit-content;" 
            :style="{'background': userInfo&&userInfo.levelCode==1?'linear-gradient(90deg, #DEDEDE 0%, #BCC1C7 100%)':'linear-gradient(90deg, #FFE0A2 0%, #F9D08C 100%)'}">
            <image
              :src="userInfo.levelCode==1?IMAGE.GOODS_ICON_SILVER:IMAGE.GOODS_ICON_GOLD"
              class="w-h32 mr4"
            />
            <view class="fs-22 mr4" :style="{color:userInfo.levelCode==1?'#586475':'#9E783A'}">
              {{`${userInfo.levelName}价`}}：¥ {{userLevelSalesPrice | formatMoney}}
            </view>
          </view>
          <!-- <view class="mt20">
            <vip-bar :svip="1" :sales-price="salesPrice" :obtainAmount="obtainAmount" />
          </view> -->
        </view>
      </view>
      <view class="bg-white pl32">
        <view v-if="activityNames.length" class="row center-y fw600">
          <view class="fs-sm-add mr34">活动</view>
          <view class="flex-1 row ptb32" style="flex-wrap:wrap;border-bottom:1rpx solid #E1E2E8;">
            <activity-tag
              v-if="userInfo && userInfo.levelCode > 0"
              :tag-name="'会员' + (userLevelDiscount * 10).toFixed(2) + '折'"
            />
            <activity-tag
              v-if="obtainIntegral > 0"
              :tag-name="'下单返喵豆'"
            />
            <!-- :tag-name="'下单返' + obtainIntegral + '喵豆'" -->
            <!-- <activity-tag 
              v-if="integralShareConfig.obtainIntegral > 0"
              :tag-name="'分享立得' + integralShareConfig.obtainIntegral + '喵豆'"
              /> -->
            <activity-tag
              v-for="name in activityNames"
              :key="name"
              :tag-name="name"
            />
          </view>
        </view>
        <view class="row center-y fw600"  @tap="onTap">
          <view class="fs-sm-add mr34">已选</view>
          <view class="flex-1 ptb32 l-h40 fw400" style="flex-wrap:wrap;border-bottom:1rpx solid #E1E2E8;">{{ selectValues }}</view>
          <!-- <van-icon name="arrow" color="#BFC2CC" class="fs-normal ptb32 pr32 h40" /> -->
          <image :src="IMAGE.ARROW_RIGHT" class="w24 h32 pr32 ptb36" style="flex-wrap:wrap;border-bottom:1rpx solid #E1E2E8;"/>
        </view>
        <!-- <navigator
          :url="
            `/pages/postage/index?tpl=` +
              JSON.stringify(maxPriorityFreeShippingTpl)
          "
        > -->
          <view
            class="row center-y ptb30 fw600"
          >
            <view class="fs-sm-add mr34">运费</view>
            <view class="flex-1 fw400">
              <!-- <text>{{
                maxPriorityFreeShippingTpl.regionType == 1 ? "满" : "部分地区满"
              }}</text>
              <text class="color-red">{{
                maxPriorityFreeShippingTpl.remark
              }}</text> -->
              <text>会员包邮</text>
            </view>
            <!-- <van-icon name="arrow" color="#BFC2CC" class="pr32"/> -->
            <!-- <image :src="IMAGE.ARROW_RIGHT" class="w24 h32 pr32" /> -->
          </view>
        <!-- </navigator> -->
      </view>
      <!-- TA说 -->
      <view class="bg-white plr32 mt20 pb40" v-if="ta['list'].length">
        <cell
          :label="'查看更多('+ta['list'].length+')'"
          :url="`/pages/spu/TA?spuId=${spuId}&skuId=${currentSku.id}`"
        >
          <view slot="title" class="fw600 data-v-23c08a67">TA说</view>
        </cell>
        <!-- <view class="row space-between ptb32 center-y">
          <view class="fw600">TA说</view>
          <navigator
            :url="`/pages/spu/TA?spuId=${spuId}&skuId=${currentSku.id}`"
          >
            <view class="color-gray-simple">查看更多({{ ta["list"].length }}) </view>
          </navigator>
        </view> -->
        <view
          class="ta-list pl30"
          style="background: #F6F6F6;border-radius:16rpx;"
        >
          <talk :article="ta['list'][0]" />
        </view>
      </view>
      <!-- 介绍 -->
      <view class="bg-white mt20" v-if="parameterIntro || parameterDetails">
        <view class="fw600 plr32 ptb32">商品详情</view>
        <view class="hairline-bottom" v-if="parameterIntro">
          <rich-text :nodes="parameterIntro | formatRichTextImg"></rich-text>
        </view>
        <!-- <view class="plr32">
          <cell
            title="查看详情介绍"
            @click="showSpuDescPopop('intro')"
            v-if="parameterDetails"
          />
        </view> -->
      </view>
      <!-- 靓点 -->
      <view class="bg-white mt20" v-if="showpointIntro || showpointDetails">
        <view class="fs-lg-num fw600 plr32 ptb40">靓点</view>
        <view class="hairline-bottom" v-if="showpointIntro">
          <rich-text :nodes="showpointIntro | formatRichTextImg"></rich-text>
        </view>
        <view class="plr32">
          <cell
            title="查看更多"
            @click="showSpuDescPopop('showpoint')"
            v-if="showpointDetails"
          />
        </view>
      </view>
      <!-- 同品牌商品 -->
      <view class="bg-white plr32 mt20" v-if="brandGoods.list.length">
        <cell
          :label="brandGoods.total > 4 ? '查看更多' : ''"
          :arrow="brandGoods.total > 4"
          :url="
            `/pages/goods-list/Brand?brandId=${brandId}&brandName=${brandName}&spuId=${spuId}&brandLogo=${brandLogo}`
          "
        >
          <view slot="title" class="fw600 data-v-23c08a67">{{
            brandName
          }}</view>
        </cell>
        <view class="row wrap space-between ptb20">
          <block
            v-for="(item, index) in brandGoods.list"
            :key="index"
          >
            <view
              @tap="onSpuClick(item.id)"
              v-if="index<4"
            >
              <spu-card
                card-type="b"
                :spu-img="item.skuOssImage"
                :spu-name="item.spuName"
                :subTitle="item.title"
                :sell-price="item.salesPrice"
                :status="item.status"
                :replenish="
                  item.salesStock == 0 || item.salesStock == null
                "
                :is-label="item.labelName"
                :is-youxuan="item.preferred"
              />
            </view>
          </block>
        </view>
      </view>
      <!-- 小寻推荐 -->
      <view class="mt20">
        <guess-goods ref="guess-like" :guessGoods="guessGoods" isWhiteBg />
      </view>
      <view
        style="position: fixed; bottom: 0; left: 0; right: 0;"
        v-show="pageLoading == false"
      >
        <bottom-bar
          :cart-count="cartCount"
          :ysf="ysf"
          :share-integral="integralShareConfig.obtainIntegral"
          :obtain-amount="obtainAmount"
          :platform-price="platformPrice"
          :sales-price="salesPrice"
          :spu-status="status"
          :sales-stock="salesStock"
          :goods-title="spuName"
          :goods-img="carousel && carousel.length>0 && carousel[0].imgUrl || ''"
          :goods-desc="spuTitle"
          :asis-url="asisUrl"
          :asis-name="asisName"
          @onCartTap="onCartTap"
          @onAddCartTap="onAddCartTap(0)"
          @onBuyTap="onBuyTap(0)"
          @onShareTap="onShareTap(0)"
        >
        </bottom-bar>
      </view>
      <!-- 弹窗 -->
      <block>
        <!-- 购买弹窗 -->
        <van-popup
          :show="buyPopup"
          position="bottom"
          round
          :close-on-click-overlay="true"
          @click-overlay="closePopup('buy')"
        >
          <view>
            <!-- <vip-bar
              :svip="svip"
              :sales-price="salesPrice"
              :obtainAmount="obtainAmount"
            /> -->
            <view class="row plr32 ptb30 hairline-bottom relative">
              <view
                slot="platform-price-right"
                style="position:absolute; right: 32rpx; top: 30rpx; z-index: 2;"
                @tap="closePopup('buy')"
              >
                <van-icon name="close" color="#9DA0A4" size="28" />
              </view>
              <view v-if="carousel.length"
                ><image :src="carousel[0].imgUrl" class="w-h200 mr20" style="border-radius:12rpx;"
              /></view>
              <view class="flex-1 col ptb20 space-between">
                  <!-- :platform-price="platformPrice" -->
                <price-info
                  v-if="userInfo&&userInfo.levelCode>0"
                  :sales-price="salesPrice"
                  :platformPrice="platformPrice"
                ></price-info>
                <price-info
                  v-else
                  :sales-price="salesPrice"
                ></price-info>
                <view v-if="userInfo&&userInfo.levelCode>0&&type==0" class="row center-y h40 l-h40 plr8 radius-mini" 
                  style="width:fit-content;" 
                  :style="{'background': userInfo.levelCode==1?'linear-gradient(90deg, #DEDEDE 0%, #BCC1C7 100%)':'linear-gradient(90deg, #FFE0A2 0%, #F9D08C 100%)'}">
                  <image
                    :src="userInfo.levelCode==1?IMAGE.GOODS_ICON_SILVER:IMAGE.GOODS_ICON_GOLD"
                    class="w-h32 mr4"
                  />
                  <view class="fs-22 mr4" :style="{color:userInfo.levelCode==1?'#586475':'#9E783A'}">
                    {{`${userInfo.levelName}价`}}：¥ {{userLevelSalesPrice | formatMoney}}
                  </view>
                </view>
                <!-- <view v-else class="color-gray-simple">市场价: <text class="delete-line ml10"> ¥ {{ platformPrice | formatMoney }}</text></view> -->
                <view>
                  <text class="color-gray-simple">库存{{ salesStock }}件</text>
                  <text class="color-red" v-if="salesStock < 10"
                    >（库存紧张）</text
                  >
                </view>
                <!-- <view class="fs-sm">已选：{{ selectValues }}</view> -->
              </view>
            </view>
            <view style="max-height: 50vh;" class="col">
              <view class="flex-1 y-scroll">
                <view
                  class="hairline-bottom plr32 pb20"
                  v-for="attr in attributeKeys"
                  :key="attr.id"
                >
                  <view class="mb16 fw600 mt30">{{ attr.attrName }}</view>
                  <view>
                    <sku
                      v-for="(value, k) in attr.values"
                      :key="k"
                      :sku-type="attr.attrType"
                      :attr-value="value.attrValue"
                      :attr-img="value.attrImg"
                      :active="isSkuActive(value.attrName, value.attrValue)"
                      :disabled="isSkuDisabled(value.attrName, value.attrValue)"
                      @click.native="onSkuClick(value)"
                    />
                  </view>
                </view>
                <view class="row space-between center-y plr32 ptb32">
                  <view>
                    <text class="fw600">购买数量</text>
                    <text class="color-gray fs-22 ml8">(限购{{ limitBuyCount }}件)</text>
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
              <view class="mlr32 mt16 mb24 bottom-buy-container" >
                <!-- 加购 -->
                <view class="h80 l-h80 bg-pink fs-lg-add text-center color-white" style="border-radius:12rpx;"  @tap="onOperate">
                  确定
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
          @close="closePopup('share')"
        >
          <view class="hairline-bottom ptb40 col center bg-white">
            <!-- <view v-if="integralShareConfig.obtainIntegral > 0" class="mb60">分享成功后可获得{{ integralShareConfig.obtainIntegral }}喵豆</view > -->
            <!-- #ifdef H5 -->
            <view class="flex w-full row space-around">
              <view @tap="shareBottom(0)">
                  <image :src="IMAGE.WECHAT_LOGO" class="share-btn"/> 
                  <view class="text-center fs-sm" style="color:#909FA3;">微信好友</view>
              </view>
              <view @tap="shareBottom(1)">
                  <image :src="IMAGE.WECHAT_SHARE_PYQ" class="share-btn"/> 
                  <view class="text-center fs-sm" style="color:#909FA3;">朋友圈</view>
              </view>
              <view @tap="shareBottom(2)">
                  <image :src="IMAGE.WECHAT_POSTER" class="share-btn"/> 
                  <view class="text-center fs-sm" style="color:#909FA3;">保存海报</view>
              </view>
              <view @tap="shareBottom(3)">
                  <image :src="IMAGE.WECHAT_SHARE_LINK" class="share-btn"/> 
                  <view class="text-center fs-sm" style="color:#909FA3;">复制链接</view>
              </view>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <view class="flex w-full row space-around">
              <view>
                <button
                  :style="{ backgroundImage: 'url(' + IMAGE.WECHAT_LOGO + ')' }"
                  class="share-btn"
                  open-type="share"
                />
                <view class="text-center fs-sm" style="color:#9D9FA3;"
                  >微信好友</view
                >
              </view>
              <view>
                <button
                  :style="{
                    backgroundImage: 'url(' + IMAGE.WECHAT_POSTER + ')',
                  }"
                  @tap="createCanvasImageEvn"
                  class="share-btn"
                />
                <view class="text-center fs-sm" style="color:#9D9FA3;"
                  >保存海报</view
                >
              </view>
            </view>
            <!-- #endif -->
          </view>
          <view class="ptb30 text-center" @click="closePopup('share')"
            >取消</view
          >
        </van-popup>
        <!-- 查看详情图弹窗 -->
        <van-popup :show="spuDescPopup.show" position="bottom">
          <view class="bg-white plr40 ptb50 col" style="height: 100vh;">
            <view
              class="fs-lg-big fw600 pb50"
              v-if="spuDescPopup.type === 'intro'"
              >介绍</view
            >
            <view
              class="fs-lg-big fw600 pb50"
              v-if="spuDescPopup.type === 'showpoint'"
              >靓点</view
            >
            <view class="flex-1 y-scroll">
              <rich-text
                v-if="spuDescPopup.type === 'intro'"
                :nodes="parameterDetails | formatRichTextImg"
              ></rich-text>
              <rich-text
                v-if="spuDescPopup.type === 'showpoint'"
                :nodes="showpointDetails | formatRichTextImg"
              ></rich-text>
            </view>
            <view class="text-center mt30">
              <image
                :src="IMAGE.ICON_CLOSE"
                class="w-h60"
                @click.native="closePopup('spuDesc')"
              />
            </view>
          </view>
        </van-popup>
        <!-- 授权弹窗 -->
        <van-popup
          :show="authPopup"
          position="bottom"
          round
          :close-on-click-overlay="true"
          @click-overlay="closePopup('auth')"
        >
          <auth-popup @close-popup="closePopup" @reload="reload" />
        </van-popup>
        <!-- h5跳转小程序弹窗 -->
        <!-- #ifdef H5 -->
        <van-popup 
          :show="h5Popup" 
          close-on-click-overlay
          @close="closePopup('h5Popup')"
        >
          <view class="bg-white plr40 ptb50 col center-y">
            <!-- <image :src="IMAGE.MX_LOGO" class="w256" mode="widthFix"/> -->
            <image :src="h5miniCode" class="w256" mode="widthFix"/>
            <view class="text-center mt20">
              长按识别小程序码进入秒寻商城
            </view>
          </view>
        </van-popup>
        <!-- #endif -->
      </block>
    </view>
    <!-- 海报 -->
    <view
      v-show="!canvasFlag"
      class="absolute"
      style="width:100vw;height:100vh;background: rgba(0, 0, 0, 0.5);top:0;z-index:9999;"
    >
      <painter
        :customStyle="customStyle" @imgOK="onImgComplete" :palette="template"
      />
      <!-- 关闭 -->
      <view
        class="canvas_close_btn w-h48 absolute"
        @tap="canvasCancel"
        :style="{left:positionX + 288 + 8 + 'px',top: positionY + 'px'}"
      >
        <image :src="IMAGE.GOODS_POSTER_CLOSE_ICON" class="w-h-full">
      </view>
        <!-- 保存海报按钮 -->
      <view
        class="mauto absolute button-wrapper"
        :style="{
          top: positionY + 512 + 12 + 'px',
          left: 0 ,
          right: 0
        }"
      >
        <view class="save_btn" @tap="saveCanvasImage">保存图片</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import CartIcon from "_c/CartIcon";
import AuthPopup from "_c/AuthPopup";
import Tag from "_c/Tag";
import Talk from "./components/Talk";
import Cell from "./components/Cell";
import SpuCard from "_c/SpuCard";
import CustomNav from "_c/CustomNav";
import GuessGoods from "@/pages/guess-goods/index";
import { getSpuDetail, shareGoods, guessLike } from "@/api/goods/spu";
import { getBrands, getAllGoods } from "@/api/goods";
import { getWxPhone, createSmallProgramCode, getIntegralConfig } from "@/api/tools";
import { TAList } from "@/api/article";
import { isObjectEqual, debounce, deepClone, formatTime } from "@/utils";
import { getCartList, addCart } from "@/api/order/cart";
import { getUserAsis } from '@/api/user'
import {
  ICON_CUSTOMER,
  WECHAT_LOGO,
  WECHAT_POSTER,
  ICON_CLOSE,
  GOODS_POSTER_CLOSE_ICON,
  ARROW_RIGHT,
  MINE_RED_SVIP,
  GOODS_ICON_SUCAI,
  GOODS_YOUXUAN_2,
  MX_LOGO,
  GOODS_SPU_YOUXUAN,
  GOODS_SPU_KUAJING,
  GOODS_SPU_HOME,
  GOODS_SPU_TUIJIAN,
  GOODS_POSTER_LEFT_LOGO,
  GOODS_SPU_ACTBG,
  GOODS_ICON_SILVER,
  GOODS_ICON_GOLD,
  TEST,
  HOME_ICON_PLAY,
  ICON_RETURN,
  WECHAT_SHARE_LINK,
  WECHAT_SHARE_PYQ,
  GOODS_SPU_EMPTY,
} from "@/imageConfig";
import { mapGetters } from "vuex";
import Sku from "_c/spu-info/Sku";
import PriceInfo from "_c/spu-info/PriceInfo";
import BottomBar from "_c/spu-info/BottomBar";
// import VipBar from "_c/spu-info/VipBar";
import ActivityTag from "./components/ActivityTag";
import { formatMoney } from "@/common/filters";
import { shareTimeline } from "@/mixins/shareTimeline";
import Card from "./components/card";
import { baseURL } from '@/config'
export default {
  name: "Spu",
  components: {
    CartIcon,
    Tag,
    Sku,
    Talk,
    Cell,
    SpuCard,
    GuessGoods,
    PriceInfo,
    // VipBar,
    ActivityTag,
    BottomBar,
    CustomNav,
    AuthPopup
  },
  mixins: [shareTimeline],
  data() {
    return {
      IMAGE: {
        ICON_CUSTOMER,
        WECHAT_LOGO,
        WECHAT_POSTER,
        ICON_CLOSE,
        GOODS_POSTER_CLOSE_ICON,
        ARROW_RIGHT,
        MINE_RED_SVIP,
        GOODS_ICON_SUCAI,
        GOODS_YOUXUAN_2,
        MX_LOGO,
        GOODS_SPU_YOUXUAN,
        GOODS_SPU_KUAJING,
        GOODS_SPU_TUIJIAN,
        GOODS_POSTER_LEFT_LOGO,
        GOODS_SPU_HOME,
        GOODS_ICON_SILVER,
        GOODS_ICON_GOLD,
        TEST,
        HOME_ICON_PLAY,
        ICON_RETURN,
        GOODS_SPU_ACTBG,
        WECHAT_SHARE_LINK,
        WECHAT_SHARE_PYQ,
        GOODS_SPU_EMPTY  
      },
      menuTop: 0, //菜单高度
      spuId: "", // 页面参数spuId(必传)
      skuId: "", // 页面参数skuId(非必传)
      pageLoading: false,
      spuName: "", // 主商品名称
      spuTitle:"",//副
      brandId: "", // 品牌ID
      brandName: "", // 品牌名称
      brandLogo: "", // 品牌logo
      status: 1, // 是否下架，0下架 1上架
      type: 0, // 是否跨境
      parameterIntro: "", // 介绍
      parameterDetails: "", // 介绍详情
      showpointIntro: "", // 靓点
      showpointDetails: "", // 靓点详情
      isYouxuan: false, // 是否优选
      isType: false, //是否跨境
      labelName: "", //标签名(必传)
      sales:0,//销量
      attributeKeys: [], // 规格
      skuVoList: [], // sku列表
      deliverFee: "", // 邮费
      maxPriorityFreeShippingTpl: {},
      // 详情弹窗
      spuDescPopup: {
        show: false,
        type: "intro", // intro:介绍，showpoint：亮点
      },
      // 同品牌商品
      brandGoods: {
        list: [],
        total: 0,
      },
      // TA说
      ta: {
        list: [],
        total: 0,
        flag: 0, // 第一次传0
      },
      currentSku: {}, // 当前sku
      ownSpec: {}, // 当前规格
      carousel: [], // 轮播图
      cartCount: 0, // 购物车数量
      integralShareConfig: {
        // 分享喵豆配置
        enable: false,
        obtainIntegral: 0,
      },
      buyPopup: false, // 购买弹窗
      sharePopup: false, // 分享弹窗
      h5Popup:false,
      buyCount: 1, // 购买数量
      disableScroll: false, // 是否禁止滚动，当显示弹窗时禁止页面滚动，防止弹窗滚动穿透
      addCartLoading: false, // 加入购物车loading
      canvasFlag: true,
      posterPath:"",
      timeData: {},
      isTimeShow: false, //限时活动定时器
      endTime: null,
      startTime: null,
      isOver2Days: true,
      scrollDisabledStatus: false, //打开海报滚动状态
      pagesDetail: 0, //页面信息
      video: [], // 视频：['封面', '视频地址'], 封面可能为空
      showPlayBtn: false, // 自定义播放按钮
      vid: "vid", // 视频组件id
      videoContext: null, // 视频组件上下文对象
      isInVideo: false, // 是否在视频界面
      isVideoFirst:false,
      playing: false, // 视频是否播放中
      authPopup: false, //授权弹窗
      routeOptions: null, //当前页面配置
      customStyle:
        "position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;",
      template: new Card().palette(),
      positionX:'',//海报定位X坐标
      positionY:'',//海报定位Y坐标
      createPosterNum:0, //海报生成次数
      ysf:{
        config:""
      },//传给七鱼客服信息
      guessGoods:[], //猜你喜欢
      operateType:0, //购物弹窗确认按钮功能
      asisUrl:"",
      asisName:"",
      isEmpty:false,
      h5miniCode:'',
      shareUserId:'',
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo", "navBarHeight"]),
    // 购买省钱显示
    buyText() {
      let type = 0,
        value = 0; // type: 1喵豆，2省%，3省多少元。value：值
      let buyPrice = 0; //
      if (this.platformPrice === this.salesPrice) {
        if (this.obtainIntegral > 0) {
          type = 1;
          value = this.obtainIntegral;
        }
      } else {
        if (this.svip === 1) {
          // vip
          buyPrice =
            this.salesPrice - this.obtainAmount <= 0
              ? 0
              : this.salesPrice - this.obtainAmount;
        } else {
          buyPrice = this.salesPrice;
        }
        if (buyPrice === 0) {
          // 省100%
          type = 2;
          value = 100;
        } else {
          if (this.platformPrice < 5000) {
            // platformPrice小于50元时显示：省%
            if (this.platformPrice !== 0 && this.salesPrice !== 0) {
              type = 2;
              value =
                Math.floor(
                  ((this.platformPrice - buyPrice) / this.platformPrice) *
                    100 *
                    100
                ) / 100; // 保留2位小数，向下取整
            }
          } else {
            // 省多少元
            type = 3;
            value = this.platformPrice - buyPrice;
          }
        }
      }
      console.log({ type, value });
      return { type, value };
    },
    // 销售价
    salesPrice() {
      return this.currentSku.salesPrice || 0;
    },
    // 市场价
    platformPrice() {
      return this.currentSku.platformPrice || 0;
    },
    // 会员价
    userLevelSalesPrice() {
      return this.currentSku.userLevelSalesPrice || 0;
    },
    // 会员折扣
    userLevelDiscount() {
      return this.currentSku.userLevelDiscount || 0;
    },
    // 返金额
    obtainAmount() {
      return this.currentSku.obtainAmount || 0;
    },
    // 库存
    salesStock() {
      return this.currentSku.salesStock || 0;
    },
    // 限购买数量
    limitBuyCount() {
      let limit = this.currentSku.purchaseLimitNum || 0;
      if (this.salesStock >= limit) {
        return limit;
      } else {
        return this.salesStock;
      }
    },
    // 重量
    weight() {
      return this.currentSku.weight || 0;
    },
    // 返多少喵豆
    obtainIntegral() {
      return this.currentSku.obtainIntegral || 0;
    },
    // 抵扣喵豆
    deductionIntegral() {
      return this.currentSku.deductionIntegral || 0;
    },
    // 活动标签
    activityNames() {
      let arr = [];
      // if (this.integralDeductionEnable && this.deductionIntegral > 0) {
      //   arr.push('喵豆抵扣')
      // }
      if (
        this.currentSku.activityDiscountSku &&
        this.currentSku.activityDiscountSku.activityName
      ) {
        arr.push(this.currentSku.activityDiscountSku.activityName);
      }
      if (
        this.currentSku &&
        this.currentSku.couponCanUseStatus == 1 &&
        this.isType == 0
      ) {
        arr.push("可用优惠券");
      }
      console.log("activityNames", arr);
      return arr;
    },
    // 已选
    selectValues() {
      return Object.values(this.ownSpec).join(",");
    },
    //倒计时
    countDown() {
      let nowDate = new Date().getTime();
      let endTime = this.endTime || 0;
      console.log("endTime", endTime);
      let endDate = new Date(endTime).getTime();

      let offsetTime = endDate - nowDate;
      console.log("计算限时够时间============================");

      console.log("nowDate", nowDate);
      console.log("endDate", endDate);

      console.log("offsetTime", offsetTime);

      //展示倒计时还剩超过2天显示：X天N小时结束
      if (offsetTime > 48 * 3600 * 1000) {
        this.isOver2Days = true;
      } else {
        //还剩2天以内显示成倒计时：41：55：33.9
        this.isOver2Days = false;
      }
      return offsetTime;
    },
  },
  onLoad(options) {
    this.routeOptions = options;
    if (options.spuId) {
      this.spuId = options.spuId;
      // this.spuId = '173746620730560512';
      if(options.shareUserId){
        this.shareUserId = options.shareUserId;
      }
      this.init();
      let pages = getCurrentPages();
      this.pagesDetail = pages.length;
      console.log("pagesDetail", this.pagesDetail);
    // #ifdef H5
    window.wxShareArticleCallback = this.wxShareArticleCallback
    // #endif      
    }
    //#ifdef H5
    // if(this.$config.userAgent!=navigator.userAgent){
    //   this.createQRcode()
    // }
    //#endif
  },
  onShow() {
        // console.log(baseURL+'uniapp/index.html#/pages/spu/index?spuId='+this.spuId)

    if (!this.token) {
      // #ifdef MP-WEIXIN
      uni.hideShareMenu();
      // #endif
    }
  },
  methods: {
    async init() {
      try {
        uni.showLoading({ title: "加载中", mask: true });
        this.pageLoading = true;
        await this.fetchSpuDetail();
        // 喵豆配置
        this.fetchIntegalConfig();
        // 页面如果只传spuId, 默认取规格的第一个属性，如果有传入skuId获取对应sku规格
        let skuIndex = this.skuVoList.findIndex((e) => e.id === this.skuId);

        if (skuIndex >= 0) {
          this.currentSku = this.skuVoList[skuIndex];
        } else {
          this.currentSku = this.skuVoList[0] || {};
          if(this.skuVoList[0].salesStock === 0) {
            for (let i = 0; i < this.skuVoList.length; i++) {
              let sku = this.skuVoList[i];
              if(sku.salesStock !==0) {
                this.currentSku = this.skuVoList[i];
                break;
              }
            }  
          }
        }
        this.ownSpec = JSON.parse(this.currentSku.ownSpec);
        console.log(this.currentSku);
        this.getCarousel();
        // 购物车数量
        this.fetchCartCount();
        // TA说
        this.fetchTAList();
        // 品牌商品
        this.fetchBrandGoods();

        // 猜你喜欢
        // this.$refs["guess-like"].init(this.spuId);
        let params = {
          pageIndex: 1,
          pageSize: 6,
          id:this.spuId
        }

        guessLike(params).then(res => {
          let data = res.data
          if(data){
            this.guessGoods = data
            console.log('猜你喜欢', this.guessGoods)
          }
        })
      } catch (error) {
        console.log('当前错误信息', this.isEmpty, error)
        console.log(error);
        uni.showToast({
          title: error.resInfo || error.toString(),
          icon: "none",
          duration: 1500,
        });
        // setTimeout(() => {
        //   uni.navigateBack();
        // }, 1500);
      } finally {
        uni.hideLoading();
        this.pageLoading = false;
      }
      this.getSystemInfo();
    },
    // 获取自定义导航栏配置
    getSystemInfo() {
      // 获取menu属性
      // #ifdef MP-WEIXIN
      const menu = uni.getMenuButtonBoundingClientRect();
      // 将其赋值给this
      this.menuTop = menu.top;
      // #endif
      console.log(this.menuTop);
    },
    // 获取商品详情
    fetchSpuDetail() {
      return new Promise((resolve, reject) => {
        // this.spuId = '173746620730560512'
        let shareUid = this.$store.getters.shareUserId;
        getSpuDetail(this.spuId, shareUid)
          .then((res) => {
            console.log("下架商品", res);
            if (res.data) {
              let data = res.data;
              this.attributeKeys = data.attributeKeys || [];
              this.skuVoList = data.skuVoList || [];
              this.spuName = data.spuName;
              this.spuTitle = data.title;
              this.brandLogo = data.brandLogo;
              this.brandName = data.brandName;
              this.brandId = data.brandId;
              this.status = data.status;
              this.sales = data.sales;
              this.endTime = data.endTime;
              this.startTime = data.startTime;
              this.type = data.type;
              // this.maxPriorityFreeShippingTpl = data.maxPriorityFreeShippingTpl;
              this.getDeliverFee(data.deliverRegionTpl);
              // this.integralDeductionEnable = data.integralDeductionEnable;
              if (data.spuDesc) {
                let spuDesc = data.spuDesc;
                this.parameterIntro = spuDesc.parameterIntro; // 介绍
                this.parameterDetails = spuDesc.parameterDetails; // 介绍详情
                this.showpointIntro = spuDesc.showpointIntro; // 靓点
                this.showpointDetails = spuDesc.showpointDetails; // 靓点详情
              }
              this.isYouxuan = data.preferred;
              this.isType = data.type;
              this.labelName = data.labelName;
              // 小助理
              getUserAsis().then(res=>{
                let data = res.data;
                if(data){
                  this.asisUrl = data.url;
                  this.asisName = data.name;
                  if(this.userInfo && this.userInfo.id){
                    this.ysf={
                      title: this.spuName,
                      config: JSON.stringify({
                        "uid":this.userInfo.id,  // 用户唯一标识
                        "level":1,  // vip等级
                        "data": JSON.stringify([
                          { key: "real_name", label: "昵称", value: `${this.asisName}-${this.userInfo.nickName}-${this.userInfo.levelName}` },
                          { key: "mobile_phone", label: "手机号", value: this.userInfo.mobile },
                          { key: "email", label: "邮箱", value: "" },
                          {
                            key: "reg_date",
                            label: "创建时间",
                            value: formatTime(this.userInfo.createdTime,'Y/M/D h:m:s'),
                          },
                          { key: "avatar", label: "头像", value: this.userInfo.headImgUrl },
                        ])
                      })
                    }
                  }
                }
              })
              this.isEmpty = false;
              resolve(res.data);
            } else {
              reject({ resInfo: "商品不存在" });
              this.isEmpty = true;
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    isSkuActive(attrName, attrValue) {
      if (this.ownSpec[attrName] === attrValue) {
        return true;
      }
      return false;
    },
    isSkuDisabled(attrName, attrValue) {
      let copy = deepClone(this.ownSpec);
      if (copy.hasOwnProperty(attrName) && copy[attrName] !== attrValue) {
        copy[attrName] = attrValue;
        let exist = this.skuVoList.some((e) => isObjectEqual(JSON.parse(e.ownSpec), copy) );
        return !exist;
      }
      return false;
    },
    getCarousel() {
      for (let i = 0; i < this.attributeKeys.length; i++) {
        let attr = this.attributeKeys[i];
        for (let j = 0; j < attr.values.length; j++) {
          let value = attr.values[j];
          if (value.id === this.currentSku.attrValueId) {
            if (value.skuImages && value.skuImages.length > 0) {
              // 0:缩略图,1：主图，2：详情图片,4 :视频封面图 5：视频地址
              this.carousel = value.skuImages.filter((e) =>
                [1, 2].includes(e.type)
              ); // 轮播图取1和2
              console.log("轮播图", this.carousel);
              let vUrl = value.skuImages.filter((e) => e.type === 5);
              if (vUrl.length) {
                if (this.videoContext !== null) {
                  this.videoContext.stop();
                }
                let vCover = value.skuImages.filter((e) => e.type === 4);
                vCover.length
                  ? (this.video[0] = vCover[0].imgUrl)
                  : (this.video[0] = "");
                this.video[1] = vUrl[0].imgUrl;
                this.isInVideo = true;
                this.isVideoFirst = true;
                this.showPlayBtn = true;
                // 修复sku切换时视频封面失效问题
                this.videoContext = null;
                setTimeout(() => {
                  this.videoContext = uni.createVideoContext(this.vid);
                }, 50);
              } else {
                this.video = [];
                this.videoContext = null;
                this.isInVideo = false;
                this.showPlayBtn = false;
              }
              console.log("视频", this.video);
              break;
            }
          }
        }
      }
    },
    // 获取同品牌商品（最多显示4个商品，超过显示查看更多）
    fetchBrandGoods() {
      getAllGoods({
        pageIndex: 0,
        pageSize: 10,
        brandId: this.brandId,
        status:1
      }).then((res) => {
        let data = res.data;
        if(data&&data.length>0){
          this.brandGoods["list"] = data;
          this.brandGoods["total"] = Number(data.length);
          console.log("品牌商品", data.list);
        }
      });
    },
    // 获取TA说列表
    fetchTAList() {
      TAList({
        flag: this.ta.flag,
        pageNo: 1,
        pageSize: 1,
        skuId: this.currentSku.id,
        spuId: this.spuId,
      }).then((res) => {
        let data = res.data;
        this.ta["list"] = data.pageInfo.list;
        this.ta["flag"] = data.flag;
        this.ta["total"] = Number(data.pageInfo.total);
        console.log("TA", this.ta["list"]);
      });
    },
    // 获取喵豆配置
    fetchIntegalConfig() {
      getIntegralConfig().then((res) => {
        // console.log('喵豆配置', res.data)
        let shareIntegral = res.data.filter(
          (item) =>
            item.dictType === "GOODS_CONFIG" &&
            item.dictKey === "SHARE_THE_INTEGRAL"
        );
        if (shareIntegral.length) {
          let target = shareIntegral[0];
          if (target.dictValue) {
            let json = JSON.parse(target.dictValue);
            if (json.enable) this.integralShareConfig = json;
          }
        }
      });
    },
    // 打开介绍/亮点弹出
    showSpuDescPopop(type) {
      this.spuDescPopup["type"] = type;
      this.spuDescPopup["show"] = true;
    },
    closePopup(type) {
      if (type === "share") {
        this.sharePopup = false;
      } else if (type === "spuDesc") {
        this.spuDescPopup["show"] = false;
      } else if (type === "buy") {
        this.disableScroll = false;
        this.buyPopup = false;
      } else if (type === "auth") {
        this.disableScroll = false;
        this.authPopup = false;
      } else if (type === "h5Popup") {
        this.disableScroll = false;
        this.h5Popup = false;
      }
    },
    // 点击sku
    onSkuClick(value) {
      if (
        this.isSkuActive(value.attrName, value.attrValue) ||
        this.isSkuDisabled(value.attrName, value.attrValue)
      ) {
        return;
      }
      let copy = deepClone(this.ownSpec);
      copy[value.attrName] = value.attrValue;
      console.log(copy);
      let idx = this.skuVoList.findIndex((e) =>
        isObjectEqual(copy, JSON.parse(e.ownSpec))
      );
      if (idx >= 0) {
        this.currentSku = this.skuVoList.find((e) =>
          isObjectEqual(copy, JSON.parse(e.ownSpec))
        );
        console.log("currentSku", this.currentSku);
        this.ownSpec = JSON.parse(this.currentSku.ownSpec);
        this.getCarousel();
      }
    },
    // 获取购物车数量
    fetchCartCount() {
      if (this.token) {
        getCartList().then((res) => {
          console.log("购物车", res);
          this.cartCount = res.data.length;
        });
      }
    },
    onBuyCountChange(e) {
      // console.log(e.detail)
      this.buyCount = e.detail;
    },
    onTap() {
      console.log("onTap     ==========================")
      this.buyPopup = true;
      this.disableScroll = true;
    },
    // 跳转购物车
    onCartTap() {
      if (this.token) {
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/shopping-cart/ShoppingCart`,
        });
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_CART',data:{type:'true'}})
        // #endif
      } else {
        // this.$config.userAgent==navigator.userAgent
        //#ifdef H5
        console.log(window.navigator.userAgent,this.$config.userAgent)
        console.log('当前头信息  ',window.navigator.userAgent)
        if(this.$config.userAgent!=navigator.userAgent){
          this.createQRcode(); // TODO
          // this.h5Popup = true;
        }else {
         this.$flutter({method:'TO_LOGIN'});
        }
        //#endif
        // #ifdef MP-WEIXIN
        this.authPopup = true;
        // #endif
      }
    },
    //购物弹窗确认按钮功能 1:加购 2:立购
    onOperate(type){
      if(this.operateType==2){
        this.onBuyTap(1)
      }else{
        this.onAddCartTap(1)
      }
      this.operateType=0
    },
    // 加入购物车
    onAddCartTap(type) {
      console.log("当前type ===== ",type);
      if (this.token) {
        if (type == 0) {
          this.buyPopup = true;
          this.disableScroll = true;
          this.operateType=1
        } else if (type == 1) {
          let quantity = this.buyCount;
          let skuId = this.currentSku.id;
          this.addCartLoading = true;
          addCart(quantity, skuId)
            .then((res) => {
              this.closePopup("buy");
              // #ifdef H5
              this.$eventHub.$emit(this.$eventName.ADD_CART_SUCCESS)
              this.$flutter({method:"ADD_CART_EVENT"});
              // #endif
              uni.showToast({
                title: "已加入购物车",
                icon: "none",
                duration: 2000, 
              });
              // 弹窗购物车数量重置为1
              this.buyCount = 1;
              // 更新购物车数量
              this.fetchCartCount();
            })
            .finally((res) => {
              this.addCartLoading = false;
            });
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true;
        // #endif
        // #ifdef H5
        if(this.$config.userAgent==navigator.userAgent){
          this.$flutter({method:"TO_LOGIN"});
        }else{
          console.log('当前头信息',navigator.userAgent)
          // this.h5Popup = true;
          this.createQRcode(); // TODO
        }
        // #endif
      }
    },
    // 立即购买
    onBuyTap(type) {
      if (this.token) {
        if (type == 0) {
          this.buyPopup = true;
          this.disableScroll = true;
          this.operateType=2
        } else if (type == 1) {
          if (this.buyCount > this.limitBuyCount) {
            this.closePopup("buy");
            uni.showToast({
              title: "购买数量大于限购数量",
              icon: "none",
              duration: 2000,
            });
            this.buyCount = 1;
          } else {
            this.closePopup("buy");
            let orderParam = [
              { skuId: this.currentSku.id, quantity: this.buyCount },
            ];
            let urlParam =
              `orderType=2&orderParam=` +
              encodeURIComponent(JSON.stringify(orderParam));
            // console.info(urlParam)
            // 进入确认订单页面
            // #ifdef MP-WEIXIN
            uni.navigateTo({
              url: `/pages/order/ConfirmOrder?${urlParam}`,
            });
            // #endif
            // #ifdef H5
            this.$flutter({
              method: "TO_CONFIRM_ORDER",
              data: { orders: orderParam },
            });
            // #endif
          }
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true;
        // #endif
        // #ifdef H5
        if(this.$config.userAgent==navigator.userAgent){
          this.$flutter({method:"TO_LOGIN"});
        }else{
          // this.h5Popup = true;
          this.createQRcode(); // TODO
        }
        // #endif
      }
    },
    // 立即分享
    onShareTap(type) {
      if (this.token) {
        if (type == 0) {
          this.sharePopup = true;
        } else if (type == 1) {
          this.closePopup("buy");
          this.sharePopup = true;
        }
      } else {
        // #ifdef MP-WEIXIN
        this.authPopup = true;
        // #endif
        // #ifdef H5
        if(this.$config.userAgent==navigator.userAgent){
          this.$flutter({method:"TO_LOGIN"});
        }else{
          // this.h5Popup = true;
          this.createQRcode(); // TODO
        }
        // #endif
      }
    },
    onAddCart() {
      let quantity = this.buyCount;
      let skuId = this.currentSku.id;
      this.closePopup("buy");
      this.addCartLoading = true;
      addCart(quantity, skuId)
        .then((res) => {
          uni.showToast({
            title: "加入购物车成功",
            icon: "none",
            duration: 2000,
          });
          // 弹窗购物车数量重置为1
          this.buyCount = 1;
          // 更新购物车数量
          this.fetchCartCount();
        })
        .finally((res) => {
          this.addCartLoading = false;
        });
    },
    toBuy() {
      if (this.buyCount > this.currentSku.purchaseLimitNum) {
        uni.showToast({
          title: "购买数量大于限购数量",
          icon: "none",
          duration: 2000,
        });
        this.closePopup("buy");
        this.buyCount = 1;
      } else {
        let orderParam = [{ skuId: this.currentSku.id, number: this.buyCount }];
        let urlParam =
          `orderType=2&orderParam=` +
          encodeURIComponent(JSON.stringify(orderParam));
        // console.info(urlParam)
        // 进入确认订单页面
        uni.navigateTo({
          url: `/pages/order/ConfirmOrder?${urlParam}`,
        });
        this.closePopup("buy");
      }
    },
    // 预览图片
    onPreviewImage(current) {
      let images = this.carousel.map((ele) => ele.imgUrl);
      uni.previewImage({
        urls: images,
        current: current,
      });
    },
    // 显示邮费，如果最大值=最小值，显示一个就好
    getDeliverFee(deliverRegionTpl) {
      if (deliverRegionTpl && deliverRegionTpl.remark) {
        let str = deliverRegionTpl.remark.replace("元", "");
        let arr = str.split("-");
        if (arr.length === 2) {
          if (arr[0] === arr[1]) {
            this.deliverFee = `${arr[0]}元`;
            return;
          }
        }
        this.deliverFee = deliverRegionTpl.remark;
        console.log(this.deliverFee);
      }
    },
    //生成海报
    createCanvasImageEvn() {
      if(this.status == 0) {
        uni.showToast({
          title: '商品已下架，暂时无法保存海报',
          duration: 2000,
          icon:'none'
        });
        return;
      }
      uni.showLoading({ title: "海报生成中...", mask: true });
      let phoneData = uni.getSystemInfoSync();
      this.phoneH = phoneData.windowHeight;
      this.phoneW = phoneData.windowWidth;
      this.positionX = (this.phoneW - 288)/2; //海报定位X坐标
      this.positionY = (this.phoneH - 512)/2; //海报定位Y坐标
      if(this.createPosterNum>0){
          this.canvasFlag = false; //显示canvas海报
          this.sharePopup = false; //关闭分享弹窗
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          });
          this.scrollDisabledStatus = true;
          uni.hideLoading();
      }
      let params = {}
      params['type'] = 'spu';
      params['busId'] = this.spuId;
      if(this.userInfo){
        params['userId'] = this.userInfo.id;
      }
      
      createSmallProgramCode(params)
        .then((res) => {
          this.createPosterNum += 1 ;
          // this.posterData.code = res.data
          // this.posterData = {
          //   url: this.carousel[0].imgUrl, //商品主图
          //   title: this.spuName, //标题
          //   discountPrice: formatMoney(this.salesPrice), //折后价格
          //   orignPrice: formatMoney(this.platformPrice), //原价
          //   code: res.data, //小程序码
          // };
          console.log("poster", res.data, this.template);
          this.template.views[0].url = this.carousel[0].imgUrl;
          this.template.views[1].text = this.spuName;
          this.template.views[2].text = `￥${formatMoney(this.salesPrice)}`;
          this.template.views[3].text = `￥${formatMoney(this.platformPrice)}`;
          this.template.views[7].url = res.data;
          console.log("海报操作", this.template.views);
          this.canvasFlag = false; //显示canvas海报
          this.sharePopup = false; //关闭分享弹窗
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          });
          this.scrollDisabledStatus = true;
        })
        .catch((res) => {
          this.createPosterNum = 0
        });
    },
    //保存海报
    saveCanvasImage(){
      // 2-保存图片至相册
      uni.saveImageToPhotosAlbum({
        filePath: this.posterPath,
        success:()=> {
          uni.hideLoading();
          uni.showToast({
            title: "图片保存成功",
            duration: 2000
          });
          shareGoods(this.spuId).then((res) => {
          });
          this.canvasCancel();
        },
        fail:()=> {
          uni.showToast({
            title: "保存失败，稍后再试",
            duration: 2000,
            icon: "none"
          });
          uni.hideLoading();
        }
      });
    },
    //海报加载完
    onImgComplete(e) {
      console.log("海报加载完",e);
      this.posterPath = e.detail.path;
      uni.hideLoading();
    },
    goBack() {
      // #ifdef MP-WEIXIN
      let pages = getCurrentPages();
      console.log("pages", pages);
      if (pages.length >= 2) {
        let prevpage = pages[pages.length - 2];
        console.log(prevpage.route);
        uni.navigateBack();
      } else {
        uni.reLaunch({
          url: this.$pageUrl.HOME,
        });
      }
      // #endif
      // #ifdef H5
      this.$flutter({method:"BACK"});
      // #endif
    },
    //生成小程序码
    createQRcode(){
      let params = {}
      params['type'] = 'spu';
      params['busId'] = this.spuId;
      if(this.shareUserId){
        params['userId'] = this.shareUserId;
      }
      createSmallProgramCode(params)
        .then((res) => {
          this.template.views[7].url = res.data;
          console.log(this.template.views[7].url);
          console.log('当前小程序码返回  =====  ',res.data)
          this.h5miniCode = res.data
          if(this.$config.userAgent!=navigator.userAgent){
            this.h5Popup = true;  
          }
        })
    },
    // 取消海报
    canvasCancel(val) {
      this.canvasFlag = val;
      this.scrollDisabledStatus = false;
    },
    //定时器变化时
    onChangeCountDown(e) {
      this.timeData = e.detail;
    },
    //定时器结束
    onTimeFinish() {
      console.log("定时器结束");
      this.isTimeShow = true;
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
    // 轮播切换时
    onSwiperChange({ detail }) {
      // console.log(detail)
      if (this.video.length) {
        if (detail.current == 0) {
          this.isInVideo = true;
          this.showPlayBtn = true;
        } else {
          this.isInVideo = false;
          this.showPlayBtn = false;
          this.videoContext.pause();
        }
      }
    },
    onSpuClick(id) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/spu/index?spuId=${id}`,
      });
      // #endif
      // #ifdef H5
      if(this.$config.userAgent==navigator.userAgent){
        this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':id}});
      }else{
        this.h5Popup = true;
      }
      // #endif
    },
    //重新加载页面
    reload() {
      this.$mp.page.onLoad(this.routeOptions);
    },
    // APP 端分享
    shareBottom(index){ 
      if(this.status == 0) {
        uni.showToast({
          title: '商品已下架，暂时无法分享',
          duration: 2000,
          icon: 'none'
        });
        return;
      }
      try {
        uni.showLoading({ title: "加载中...", mask: true });
        console.log('当前价格   ',this.salesPrice,this.userLevelSalesPrice)
        let param = {
          'spuId':this.spuId,
          // 'shareUrl':'https://mx.gz-zhongshang.com/uniapp/index.html#/#pages/spu/index?spuId='+this.spuId,
          'shareUrl':baseURL+'uniapp/index.html#/pages/spu/index?spuId='+this.spuId + '&shareUserId='+this.userInfo.id,
          'spuName':this.spuName,
          'goodsImageUrl':this.carousel[0].imgUrl,
          'salesPrice':this.salesPrice,
          'platPrice':this.platformPrice,
        };
          // 分享海报
        if(index == 3){
            // this.$flutter({method:"GOODS_SHARE",data:{ 'index':index,'params':'https://mx.gz-zhongshang.com/uniapp/index.html#/#pages/spu/index?spuId='+this.spuId}});
            this.$flutter({method:"GOODS_SHARE",data:{ 'index':index,'params':baseURL+'uniapp/index.html#/pages/spu/index?spuId='+this.spuId+'&shareUserId='+this.userInfo.id}});
          }else {
            this.$flutter({method:"GOODS_SHARE",data:{ 'index':index,'params':param}});
          }
      } catch(error) {
        console.log(error)
      }
    },

    // 微信分享回调
    wxShareArticleCallback(jsonStr) {
      uni.hideLoading();
      if (JSON.parse(jsonStr).isSuccessful === 'true') {
         shareGoods(this.spuId).then((res) => {
            console.log("分享喵豆", res.data);
            if (res.data > 0) {
              uni.showToast({ title: `推荐商品+${res.data}喵豆` });
            }
          });
      }
    },
  },
  // 自定义转发
  onShareAppMessage(e) {
    this.closePopup("share");
    shareGoods(this.spuId).then((res) => {
      console.log("分享喵豆", res.data);
      if (res.data > 0) {
        uni.showToast({ title: `推荐商品+${res.data}喵豆` });
      }
    });
    let obj = {
      title: this.spuName,
      path: `/pages/start/index?sharePage=spu&spuId=${this.spuId}&shareUserId=${this.userInfo.id}`,
      // imageUrl: this.IMAGE.TEST
      imageUrl: this.carousel[0].imgUrl || '',
    };
    return {
      ...obj,
    };
  },
  onShareTimeline() {
    let obj = {
      title: this.spuName,
      query: `sharePage=spu&spuId=${this.spuId}&shareUserId=${this.userInfo.id}`,
      imageUrl: this.carousel[0].imgUrl || '',
    };
    return {
      ...obj,
    };
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "font_family"; /* project id 1065286 */
  src: url("//at.alicdn.com/t/font_1065286_3bsye5aijur.eot");
  src: url("//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_1065286_3bsye5aijur.woff") format("woff"),
    url("//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family")
      format("svg");
}
.font_family {
  font-family: "font_family" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
/* 按钮去掉边框 */
.content button::after {
  border: none;
}
.content button {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
  color: #1c1c1c;
  font-size: 28rpx;
  background: none;
}
.button-hover {
  color: #1c1c1c;
  background: none;
}
/*每个页面公共css */
.content {
  position: relative;
  z-index: 9999;
  text-align: center;
  // height: 100%;
}
.share-btn {
  padding: 30upx 60upx;
  /* background-color: $uni-btn-color;
  color: $uni-text-color-inverse; */
}
.share-pro {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  z-index: 5;
  line-height: 1;
  box-sizing: border-box;
}
.share-pro .share-pro-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.share-pro .share-pro-dialog {
  width: 750rpx;
  height: 310rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0px 0px;
  position: relative;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
}
.share-pro .share-pro-dialog .close-btn {
  padding: 20rpx 15rpx;
  position: absolute;
  top: 0rpx;
  right: 29rpx;
}
.share-pro .share-pro-dialog .share-pro-title {
  font-size: 28rpx;
  color: #1c1c1c;
  padding: 28rpx 41rpx;
  background-color: #f7f7f7;
}
.share-pro .share-pro-dialog .share-pro-body {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 28rpx;
  color: #1c1c1c;
}
.share-pro .share-pro-dialog .share-pro-body .share-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-content: space-around;
}
.share-pro .share-pro-dialog .share-pro-body .share-item .share-icon {
  text-align: center;
  font-size: 70rpx;
  margin-top: 39rpx;
  margin-bottom: 16rpx;
  color: #42ae3c;
}
/* .share-pro
  .share-pro-dialog
  .share-pro-body
  .share-item
  .share-icon:nth-child(2) {
  .share-icon {
    color: #ff5f33;
  }
} */
/* 显示或关闭内容时动画 */

.share-pro .open {
  transition: all 0.3s ease-out;
  transform: translateY(0);
}

.share-pro .close {
  transition: all 0.3s ease-out;
  transform: translateY(310rpx);
}
.canvas {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  // margin-top:0;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 10;
}
#spu-page {
  padding-bottom: 130rpx;
  .carousel-image {
    height: inherit;
    width: 100%;
  }
  .top-container {
    position: relative;
    .btn-group {
      position: absolute;
      right: 10rpx;
      top: var(--top);
      display: flex;
      align-items: center;
    }
  }
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
  }
  .share-btn {
    width: 100rpx;
    height: 100rpx;
    margin-bottom: 20rpx;
    background-size: 100% 100%;
    padding: 0;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .bg-gray {
    pointer-events: none;
  }
  @media screen and(min-width: 375px) and(max-height: 812px) {
    #spu-page {
      padding-bottom: 170rpx !important;
    }
  }
}
.vip-tag {
  background: rgba(255, 209, 0, 1);
  border-radius: 15rpx;
  padding: 0 14rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: rgba(49, 42, 12, 1);
  line-height: 30rpx;
}
.vip-text {
  font-size: 24rpx;
  font-weight: 600;
  color: rgba(255, 209, 0, 1);
  line-height: 30rpx;
  text {
    color: #ff3838;
  }
}
.fs-30 {
  font-size: 30rpx;
}
.count-item {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  margin: 0 6rpx;
  color: #303133;
  font-size: 22rpx;
  text-align: center;
  background-color: #ffffff;
  border-radius: 6rpx;
  line-height: 40rpx;
  &:last-child {
    margin-right: 0;
  }
  &:first-child {
    margin-left: 0;
  }
}
.discount-icon {
  min-width: 128rpx;
  bottom: 30rpx;
  right: 30rpx;
  background: rgba(255, 56, 56, 1);
  border: 4rpx solid rgba(255, 255, 255, 1);
  box-shadow: 0px -3rpx 29rpx 0px rgba(0, 0, 0, 0.3);
}
.scroll-disabled {
  overflow: hidden;
  height: 100vh;
}
.canvas_close_btn {
  z-index: 9999;
}
.button-wrapper {
  width: 256rpx;
  position: fixed;
  height: 80rpx;
  z-index: 9999;
  background: #FF9EA8;
  border-radius: 40rpx;
}
.save_btn {
  font-size: 30rpx;
  line-height: 80rpx;
  color: white;
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 40rpx;
  z-index: 9999;
}
/deep/ .stepper-icon-jia {
  width: 56rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .stepper-icon-jian {
  width: 56rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .stepper-icon-input {
  width: 90rpx;
  height: 56rpx;
  border: none !important;
}
/deep/ .van-nav-bar {
  background-color: transparent;
}
/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 48rpx !important;
}
/deep/ .van-count-down {
  color: #fff !important;
  font-size: 24rpx;
}
/deep/ .van-hairline--bottom:after {
  border: none;
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
.bottom-buy-container {
  height: 80rpx;
}
@media screen and(min-width: 375px) and(max-height: 812px) {
  .bottom-buy-container {
    height: 80 + 40rpx;
    padding-bottom: 40rpx !important;
  }
}
</style>
