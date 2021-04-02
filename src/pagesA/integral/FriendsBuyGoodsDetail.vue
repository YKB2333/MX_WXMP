<template>
    <view class="col min-h-full" style="background: #F2F2F5;">

        <!-- 顶部卡片 -->
        <view class="mauto ptb32 col mt32 bg-white radius-12 wpct92">
            <view class="row plr32">
                <view class="relative" @tap.stop="onItemClick(spuInfo.spuId)">
                    <image class="w-h160 radius" :src="spuInfo.spuImage"/>
                    <view class="w-h160 radius pos-center" style="background: rgba(0, 0, 0, 0.03);"></view>
                </view>
                <view class="col pl32 flex-1">
                    <view class="ellipsis fs-normal w400" style="color:#303133;">{{ spuInfo.spuName}}</view>
                    <view class="row w-full space-between l-h50 flex-1">
                        <view class="fs-22 ellipsis" style="color:#909399;">{{ spuInfo.title }}</view>
                        <view class="fs-22" style="color:#909399;" @tap="onItemClick(spuInfo.spuId)">查看商品 > </view>
                    </view>
                    <view class="row" style="align-items:baseline;">
                        <view class="fs-sm-add">￥</view>
                        <view class="fs-lg-add ellipsis">{{ spuInfo.salesPrice / 100}}</view>
                    </view>
                </view>
            </view>
            <view class="h2 w-full bg-primary mt30 color-white">====</view>
            <view class="row w-full space-between mt30 h-full">
                <view class="col flex-1 text-center">
                    <view class="fs-lg-add ellipsis">{{ spuInfo.viewCount }}</view>
                    <view class="sub-font">累计浏览</view>
                </view>
                
                <view class="h60 w2 bg-primary mt20"></view>
                <view class="col flex-1 text-center">
                    <view class="fs-lg-add ellipsis">{{ spuInfo.purchaseCount }}</view>
                    <view class="sub-font">累计购买</view>
                </view>
                <view class="h60 w2 bg-primary mt20"></view>
                <view class="col flex-1 text-center relative">
                    <view class="radius absolute popover" v-if="(totalEarning / 100) > 1">可抵扣￥{{ totalEarning / 100 }}
                        <view class="sanjiao"> </view>
                        <view class="sanjiao red"> </view>
                    </view>
                    <view class="fs-lg-add ellipsis">{{ totalEarning }}</view>
                    <view class="sub-font">从中赚取喵豆</view>
                </view>
            </view>
        </view>
        <view class="row center l-h104" >
            <view class="divider-line"></view>
            <view v-if="userInfo.length" class="fs-normal mlr24" style="color:#303133;">  浏览/购买好友 </view>
            <view v-else class="fs-normal mlr24" style="color:#303133;">  还没好友浏览或购买 </view>
            <view class="divider-line"></view>
        </view>

        <!-- 列表内容 -->
        <view class="w-full bg-white radius-12 mlr32 wpct92">
            <view v-for="(item,index) in userInfo" :key="index" class="row">
                <image :src="item.headImgUrl" class="w-h96 radius-circle mlr32 mtb16"/>
                <view class="col l-h50 space-between w-full flex-1">
                    <view class="row space-between mtb12 w500">
                        <view class="col l-h50">
                            <view class="fs-normal" style="color: #303133;">{{ item.nickName || ''}}</view>
                            <view class="fs-22" style="color:#909399;">{{ item.date || ''}}</view>
                        </view>
                        <view class="w112 mt30">
                            <view v-if="item.state === 1 " class="status-dis-flag l-h48">
                                仅浏览
                            </view>
                            <view v-if="item.state === 2 " class="status-flag">
                                已购买
                            </view>
                        </view>
                    </view>
                    
                    <view class="h2 w-full bg-primary"></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    QUESTION,
    IC_BLACK_RETURN
} from "@/imageConfig";
import CustomNav from "_c/CustomNav";
import { getFriendsBuyDetail } from "@/api/goods"

export default {
    name:"FriendsBuyGoodsDetail",
    components: {
        CustomNav
    },
    data() {
        return {
            IMAGE: {
                QUESTION,
                IC_BLACK_RETURN,
            },
            userName:'订单详情内容',
            userHead:'https://nowpic.gtimg.com/hy_personal_room/1211068335/12110683351603144984/640?tp=webp',
            qipaoTopStatus:false,
            mList:[1,2,4,5,6,4,5,6],
            totalEarning: 0,
            spuInfo:{},
            userInfo:[],
        }
    },
    onLoad(options) {
        console.log('当前options ==== ',options)
        if(options.spuId && options.params) {
            console.log(options.params);
            this.spuInfo = JSON.parse(decodeURIComponent(options.params))
            // this.spuInfo = JSON.parse(options.params);
            this.fetchBuyFriends(options.spuId);
        }
    },
    methods:{
        goBack() {
          uni.navigateBack();
        },
        
        fetchBuyFriends(spuId) {
            uni.showLoading({ title: "加载中", mask: true });
            getFriendsBuyDetail(spuId).then( res => {
                console.log('当前浏览好友列表=== ',res.data);
                this.userInfo = res.data;
                if(this.userInfo){
                    this.userInfo.forEach( (v) => {
                        this.totalEarning += v.shareObtainIntegral;
                    });
                }

            }).finally( () => {
                uni.hideLoading();
            });
        },
        onItemClick(id) {
            // #ifdef MP-WEIXIN
            uni.navigateTo({
                url: `/pages/spu/index?spuId=${id}`,
            });
            // #endif
            // #ifdef H5
            this.$flutter({method:'TO_GOODS_DETAIL',data:{'spuId':id}});
            // #endif
         },
    },

     // 监听滚动
    onPageScroll: function(data) { // 防抖
        console.log('当前滚动监听===== ',data.scrollTop);
        if(data.scrollTop > 100) {
        this.qipaoTopStatus = true;
        }else {
        this.qipaoTopStatus = false;
        }

    },
}
</script>

<style lang="scss" scoped>
.c-normal {
    color: #303133;
}
.divider {
    height: 1px;
    background-color: #E1E2E8;
    width: 100%;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
}
.status-flag {
    background-color: white;
    border: 1px solid #F77F8C;
    font-size: 26rpx;
    color: #F77F8C;
    justify-content: center !important;
    text-align: center;
    border-radius: 24rpx;
    height: 48rpx;
    width: 112rpx;
    line-height: 48rpx;
    text-align: center !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.status-dis-flag {
    background-color: white;
    border: 1px solid rgba(247, 127, 140, 0.5);
    font-size: 26rpx;
    color:rgba(247, 127, 140, 0.5);
    justify-content: center !important;
    text-align: center;
    border-radius: 24rpx;
    height: 48rpx;
    width: 112rpx;
    line-height: 48rpx;
    text-align: center !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.divider-line {
  width: 64rpx;
  height: 2rpx;
  background-color: #BFC2CC;
}

.top-font {
  color: #303133;
  font-weight: 600;
  font-size: 20rpx;
}
.sub-font {
    color: #909399;
    margin-top: 8rpx;
    font-size: 22rpx;
}
.popover {
    top:-70%;
    margin: 0 auto;
    right: 26%;
    background-color: white;
    border: 1px solid #F77F8C;
    font-size: 20rpx;
    color: #F77F8C;
    text-align: center;
    justify-content: center;
    padding: 0 16rpx;
    border-radius: 24rpx;
    line-height: 48rpx;
    white-space: nowrap;
}
.sanjiao{
  position: absolute;
  border: 8rpx solid transparent;
  border-top-color: white;
  right: 26%;
  bottom: -15rpx;
  transform: translateX(-50%);
  margin: 0 auto;
  width: 16rpx;
  z-index: 2;
  &.red{
    border-top-color: #F77F8C;
    // bottom: 0;
    bottom: -16rpx;
    z-index: 1;
  }
}
.title_fixed{
  position: fixed;
  width: 100%;
  top:0;
  z-index: 9999;
}

</style>