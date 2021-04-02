<template>
  <view class="page">
   <!-- /物流 -->
   <view v-for="(item,index) in stepsList" :key="index">
    <view class="head">
      <!-- 物流信息 -->
      <view class="row space-between">
        <view>
          <text class="gray">订单号：</text>
          <text>{{ item.orderNumber }}</text>
        </view>
        <text class="red" @tap="setClipboardData(123)">复制</text>
      </view>
      <view class="mt30">
        <text class="gray">物流（快递）公司：</text>
        <text>{{ item.logistics }}</text>
      </view>
    </view>
    <!-- 物流流程 -->
    <view>
      <view v-if="item.isShow" >
        <van-steps
          :steps="item.steps"
          :active="active"
          active-color="#FFD100"	
          inactive-color="#D7D7D7"
          direction="vertical"
          desc-class="c-desc-class"
          active-icon="stop-circle"
        />
      </view>
      <view class="row center h100 solidBottomPx" @tap="showLogistics(item)">
        <text style="color:#666C72 " class="fs12 mr20 block" v-if="!item.isShow">展开物流信息</text>
        <text style="color:#666C72 " class="fs12 mr20 block" v-else>收起物流信息</text>
        <van-icon name="arrow-down" color="#666C72" class="w10 h10 " v-if="!item.isShow"/>
        <van-icon name="arrow-up" color="#666C72" class="w10 h10 " v-else />
      </view>
    </view>
   </view>
  </view> 
</template>

<script>
export default {
  name: 'Logistics',
  components: {  },
  data() {
    return {
      stepsList:[
        {
          orderNumber:2444144311344344,
          logistics:'圆通物流',
          isShow:false,
          steps: [
            {
              text: '湖南省长沙市岳麓区公司 已签收 签收人:陈晓磊',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            }
          ],
        },
        {
          orderNumber:2444144311344344,
          logistics:'圆通物流',
          isShow:false,
          steps: [
            {
              text: '湖南省长沙市岳麓区公司 已签收 签收人:陈晓磊',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            },
            {
              text: '【长沙市】湖南省长沙市岳麓区派件员 李雷 123123123 正在为你派件...',
              desc: '2019-02-02 11:00:00'
            }
          ],
        }
      ],
      active:0,
      isShow:false,
    }
  },
  computed: {},
  created() {},
  methods: {
    showLogistics(item){
      item.isShow = !item.isShow;
    },
    setClipboardData(data) {
      uni.setClipboardData({
        data: data,
        success: function () {
            console.log('success');
        }
      });
      uni.getClipboardData({
        success: function (res) {
            console.log(res.data);
        }
      });
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .van-step--vertical:after {
  border: none;
}
.head{
  padding: 0 4% 0 4%;
  font-size: 14px;
  height:170rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:rgba(255,255,255,1);
  box-shadow:0px 10px 10px 0px rgba(203,209,227,0.1); 
  margin-bottom: 2px;
  .gray{
    color: #9DA0A4;
  }
  .red{
    color: #FF3838;
    font-size: 12px;
  }
}
/deep/ .van-step--vertical {
  padding: 10px 10px 0px 0;
}
/deep/ .van-step__circle-container{
  height: 22rpx;
}
/deep/ .van-step__circle{
  position: relative;
}
/deep/ .van-step__circle::after{
  content: '';
  position: absolute;
  width: 22rpx;
  height: 22rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #D7D7D7;
  z-index: 1;
  border-radius: 50%;
}
/deep/ .van-step__circle::before{
  content: '';
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #9DA0A4;
  z-index: 9;
  border-radius: 50%;
}
/deep/ .van-step__title{
  color: #121314 !important;
  font-size: 14px;
}

/deep/ .van-icon-stop-circle::after{
  content: '';
  position: absolute;
  width: 22rpx;
  height: 22rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background:rgb(254, 229, 128);
  z-index: 0;
  border-radius: 50%;
}
/deep/ .van-icon-stop-circle::before{
  content: '';
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #FFD100;
  z-index: 9;
  border-radius: 50%;
}
.solidBottomPx{
  border-top: 1px solid #EEF2F6;
  border-bottom: 10px solid #F2F4FA;
}

</style>

<style lang="scss" >
.c-desc-class{
  color: #9DA0A4 ;
  font-size: 12px;
  margin-top:20rpx;
}
</style>