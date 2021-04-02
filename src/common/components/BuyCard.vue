<template>
    <view class="col h492 w332 mb20">
        <view class="radius-12 bg-white w-h-full relative">
            <!-- <image :src="userHead" class="w-h332 absolute" style="border-radius: 6px 6px 0px 0px;"/>
            <view class="w-h332 absolute" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.87) 0%, #FFFFFF 100%);"></view> -->
            <view class="absolute w-h332 col">
                <view class="w-full center-x mt48 mb24 ellipsis"><image class="w-h160 radius-circle" :src="userHead"/></view>
                <view class="fs-lg-add ellipsis fw600 center-x w-full mb4" style="color:#303133;">{{userName}}</view>
                <view class="fs-22 center-x color-sub-gray mt4">最后下单：{{ placeTimes }}</view>
            </view>
            <view class="absolute mt348">
                <view class="divider bg-primary"></view>
                <view class="row flex-1 w-full">
                    <block>
                        <view
                        class="w166 h140 center-x text-center mt4">
                            <text class="block fs-lg-add l-h48 mb8 mt30">{{ placeTotal }}</text>
                            <view class="fs-sm color-sub-gray l-h32">累计下单</view>
                        </view>
                        <view class="h40 w2 bg-primary mt46"></view>
                        <view
                            class="w166 h140 center-x text-center"
                            >
                            <view class="row mb8 mt30 l-h48 center-x">
                                <text class="block fs-sm-add l-h48 mt4">￥</text>
                                <text class="block fs-lg-add l-h48">{{ placeConsume }}</text>
                            </view>
                            <view class="fs-sm color-sub-gray l-h32">累计消费</view>
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { NULL_GOODS_IMG } from "@/imageConfig";

export default {
    name:'BuyCard',
    props: {
        userHead: {
            type: String,
            required: true,
        },
        userName: {
            type:String,
            required:true,
        },
        placeTimes: {
            type:[Number,String],
            required:true,
        },
        placeTotal: {
            type:Number,
            required:true,
        },
        placeConsume: {
            type:Number,
            required:true,
        }
    },
    data() {
        return {
            IMAGE: {
                NULL_GOODS_IMG,
            }
        }
    }
}
</script>

<style>
.buy-times {
    color: #909399;
    font-size: 11;
}
.blur {
    -moz-filter: blur(15px);
    -webkit-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(5px);
}
.divider {
    width: 100%;
    height: 2rpx;
}
</style>