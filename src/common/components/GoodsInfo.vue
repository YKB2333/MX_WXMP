<template>
  <view>
    <view :class="BoxClass ? BoxClass : 'mt20'" style="background:white ">
      <!-- 订单号 -->
      <view :class="[TopClass ? TopClass :'row space-between wpct92 mauto h90 l-h90 bottom_border']" v-if="isTop">
        <slot name="TopLeft">
          <view>
            <text class="fs12 mr40" style="color:#9DA0A4">{{ TopLeft }}</text>
            <text class="fs12 color-red"  v-if="isCopy" @tap="getCopy()">复制</text>
          </view>
        </slot>
        <slot name="TopRight">
          <view :class="['fs14',TopRightClass]" >{{ TopRight }}</view>
        </slot>
      </view>
      <!-- 商品 -->
      <view class="bottom_border">
        <!-- 商品订单号 isIndent是否显示订单  -->
        <view class="row wpct92 mauto p20 mtb40 border-box" style="background:#F4F5F9;border-radius:5px" v-if="isIndent">
          <view class="row space-between flex-1" v-if="isIndent">
            <text class="fs12 block" style="color:#666C72">订单号：{{ orderNumber }}</text>
            <text class="fs12 block" style="color:#666C72">查询</text>
          </view>
          <text class="flex-1 fs12 l-h40" style="color:#9DA0A4" v-else>{{ information }}</text>
        </view>
        <view :class="[ goodsClass ? goodsClass :'row center-y ptb40 wpct92 mauto ']">
          <!-- 选择框 -->
          <van-checkbox
            v-if="isCheck"
            :value="checkFlag"
            @change="onChangeCheckAll"
            class="mr30"
            checked-color="#FFD100"
          ></van-checkbox>
          <!-- 商品信息 -->
          <slot name="goods">
            <view class="row flex-1 border-box hidden" style="margin-right:4%"  @tap="linkPage()">
              <image :src="goodsImg" mode :class="goodsImgClass ? goodsImgClass : 'w160 h160'" />
                <view class="shoppingCartList flex-1 ml30 relative">
                  <text class="ellipsis fs14">{{ goodsName }}</text>
                  <text class="block ellipsis2 fs12 l-h26" style="color: #9da0a4;">{{ goodsNote }}</text>
                  <view class="row  space-between absolute wpct100" style="bottom:0%">
                    <text class="mt4 fw500 ellipsis fs14" style="color: #ff3838;">{{ goodsMoney }}</text>
                    <text class="mt4  ellipsis fs12">{{ goodsCount }}</text>
                  </view>
                  <view class="row delete center-y">
                    <text @tap="onDelete()" v-if="isDelete">删除</text>
                    <van-stepper
                      v-if="isStepper"
                      :value="0"
                      @change="onChange"
                      plus-class="c-plus-class"
                      minus-class="c-minus-class"
                      input-class="c-input-class	"
                    />
                  </view>
                </view>
            </view>
          </slot>
        </view>
        <!-- 合计 -->
        <view class="row wpct92 mauto flex-end mb36" v-if="isTotal">
            <text class="fs12" style="color:#121314">合计：</text>
            <text class="fs16 fw500 mr10" style="color:#121314">¥{{ total }} </text>
            <text style="color:#9DA0A4" class="fs12 ">(含运费¥{{ freight }})</text>
          </view>
      </view>
      <!-- 按钮 -->
      <view class="row wpct92 mauto center-y space-between h100 l-h100" v-if="isBottom">
        <slot name="bottom">
          <slot name="bottomLeft">
            <text v-if="refund == false">{{ bottomLeft }}</text>
            <view v-else>
              <text class="fs12 mr10">退款金额 :</text>
              <text class="fs12" style="color: #ff3838;">{{ refundMoney }}</text>
            </view>
          </slot>
          <slot name="bottomRight">
            <!-- 双按钮 -->
            <view v-if="indentBottom">
              <text class="border-quit" @tap="indentL()">{{ indentLeft }}</text>
              <text class="border-pay" @tap="indentR()">{{ indentRight  }}</text>
            </view>
            <!-- 单按钮 -->
            <text class="border-quit" v-else-if="isBottomBorder">{{ bottomRight }}</text>
            <text class="fs12"  v-else>{{ bottomRight }}</text>
          </slot>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import vanCheckbox from "@/wxcomponents/vant/checkbox/index";
import vanStepper from "@/wxcomponents/vant/stepper/index";
import vanCheckboxGroup from "@/wxcomponents/vant/checkbox-group/index";
export default {
  name: "BaseTitle",
  props: {
    BoxClass: { //总盒子样式
      type: String,
      default: ""
    },
    isTop:{
      type:Boolean, // 是否显示头部模块
      default:true,
    },
    TopClass: { //头部类名
      type: String,
      default: ""
    },
    TopLeft: { // 头部左的文字
      type: String,
      default: ""
    },
    TopRight: { // 头部右的文字
      type: String,
      default: ""
    },
    isCopy: { // 是否显示复制
      type: Boolean,
      default: false
    },
    isCheck: { // 是否显示选择框
      type: Boolean,
      default: false
    },
    checkFlag: { // 选择框判断值
      type: Boolean,
      default: false
    },
    goodsImg: { // 商品图片
      type: String,
      default: ''
    },
    goodsName: { // 商品名字
      type: String,
      default: ''
    },
    goodsNote: { // 商品备注
      type: String,
      default: ''
    },
    goodsMoney:{ // 商品价格
      type: String,
      default: ''
    },
    goodsCount:{ // 商品数量
      type: String,
      default: ''
    },
    isDelete: { // 是否删除
      type: Boolean,
      default: false
    },
    isStepper: { // 是否加减
      type: Boolean,
      default: false
    },
    isBottom: { // 是否按钮
      type: Boolean,
      default: false
    },
    isBottomBorder: { // 是否按钮边框
      type: Boolean,
      default: false
    },
    bottomRight: {
      //  按钮右侧文本
      type: String,
      default: ""
    },
    bottomLeft: {
      //  按钮左侧文本
      type: String,
      default: ''
    },
    TopRightClass: {
      // 头部右侧类名
      type: String,
      default: ''
    },
    goodsImgClass: {
      // 图片类名
      type: String,
      default: ''
    },
    refund: {
      // 是否显示退款
      type: Boolean,
      default: false
    },
    refundMoney: {
      // 退款金额
      type: String,
      default: ''
    },
    indentBottom: {
      // 底部按钮-双按钮
      type: Boolean,
      default: false
    },
    indentLeft: {
      // 底部按钮-左按钮
     type: String,
      default: ''
    },
    indentRight: {
      // 底部按钮-右按钮（黄色）
     type: String,
      default: ''
    },
    isTotal:{
      type: Boolean,
      default: false
    },
    total:{ // 合计金额
      type: String,
      default: ''
    },
    freight:{ // 包邮运费
      type: String,
      default: ''
    },
    isIndent:{ // 物流信息  订单
      type: Boolean,
      default: false
    },
    orderNumber:{ // 订单号
      type: String,
      default: ''
    },
    information:{ // 物流信息
      type: String,
      default: ''
    },
    goodsClass:{ // 商品总盒子类名
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  components: {
    vanCheckbox,
    vanCheckboxGroup,
    vanStepper
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    indentR(){
     this.$emit('indentR')
    },
    indentL(){
     this.$emit('indentL')
    },
    linkPage(){
     this.$emit('link')
    },
    getCopy(id) {
      this.$emit("copy", id);
    },
    onChangeCheckAll() {
      this.checkFlag = !this.checkFlag;
    },
    onDelete() {
    }
  }
};
</script>

<style lang="scss" scoped>
.shoppingCartList {
  display: block;
  text {
    display: block;
  }
  .delete {
    display: flex;
    justify-content: space-between;
    text {
      font-size: 12px;
      color: #9da0a4;
    }
  }
}
.bottom_border {
  border-bottom: 1px solid #eef2f6;
}
.border-quit,.border-pay{
  line-height: 60rpx;
  width:180rpx;
  height:60rpx;
  background:rgba(157,160,164,0);
  border:2rpx solid rgba(18, 19, 20, 1);
  border-radius:30rpx;
  text-align: center;
  font-size: 12px;
  display: inline-block;
  margin-left: 30rpx
}
.border-pay{
  border:none;
  background:#FFD100;
  font-weight: 500;
}
</style>
<style lang="scss">
//输入框样式类
.c-input-class{
  display: flex !important;;
  justify-content: center !important;;
  align-items: center !important;;
  height:40rpx!important;
  width:90rpx!important;
  line-height:40rpx!important;
  font-size: 12px !important;
  background:rgba(255,255,255,1)!important;
  border:1px solid rgba(18, 19, 20, 1)!important;
  border-radius:4px!important;
  box-sizing: border-box !important;
  margin-left: 5px !important;
  margin-right: 5px !important;
}	

//加号按钮样式类
.c-plus-class	,
.c-minus-class{
width:40rpx !important;
height:40rpx !important;;
background:rgba(255,255,255,1) !important;;
border:1px solid rgba(18, 19, 20, 1)!important;;
border-radius:4px !important;

}

</style>

