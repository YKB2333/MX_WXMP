<template>
  <view class="bg-primary col" style="height:100vh;">
    <view class="flex-1 y-scroll pb20">
      <!-- 物流公司 -->
      <!-- <view v-if="type === 0">
        <block>
          <view class="hairline-bottom plr30 ptb34 row center-y bg-white">
            <text>物流公司</text>
            <input 
              placeholder="请输入物流公司"
              placeholder-class="gray-color"
              class="flex-1 pl60"
              v-model="logisticsCompanyName"
            />
          </view>
          <view class="hairline-bottom plr30 ptb34 row center-y bg-white">
            <text>物流单号</text>
            <input 
              placeholder="请输入物流单号"
              placeholder-class="gray-color"
              class="flex-1 pl60"
              v-model="expressNo"
            />
          </view>
          <view class="mt20 plr30">
            <text class="fs-sm color-gray block">温馨提示:</text>
            <text class="fs-sm color-gray">为确保能够顺利退回且只能填写一次，请您务必填写准确的物流</text>
          </view>
        </block>
        <block v-if="false">
          <view class="mlr40 bg-white p30 radius-sm shadow">
            <view class="hairline-bottom fs-sm pb20">Dear 秒寻用户：</view>
            <view class="hairline-bottom fs-sm" style="line-height:60rpx;">
              我们的退货地址是：广东省惠州市博罗县嘉民物流园4号库 收货人：刘运 电话18922311278  请您尽快将货物寄出（到付拒签） ，寄出之后一定要填写快递底单，避免不能及时处理退款，非常感谢您配合。
            </view>
            <view class="row space-between center-y mt30">
              <button class="mlr0 radius-round fs-sm">点击复制</button>
              <text class="fs-sm">秒寻售后部</text>
            </view>
          </view>
          <view class="mlr40 bg-white plr30 radius-sm shadow mt24 relative" v-for="(item, index) in returnInfoList" :key="index">
            <image :src="IMAGE.ADDRESS_LINE" style="position:absolute;top:0;left:0;right:0;" class="w-full" mode="widthFix" />
            <view class="hairline-bottom ptb30 row center-y bg-white">
              <text class="fw600">物流公司：</text>
              <input 
                placeholder="请输入物流公司名称"
                placeholder-class="gray-color"
                class="flex-1 fw600"
                v-model="item.logisticsCompanyName"
              />
            </view>
            <view class="ptb30 row center-y bg-white">
              <text class="fw600">快递单号：</text>
              <input 
                placeholder="请输入快递单号"
                placeholder-class="gray-color"
                class="flex-1 fw600"
                v-model="item.expressNo"
              />
            </view>
          </view>
        </block>
      </view> -->
      <!-- 退换申请 -->
      <view class="plr30 ptb28 bg-white">
        <goods
          :img="list.skuPrimaryPic"
          :name="list.skuName"
          :attr-value="list.ownSpec"
          :spuId="item.spuId"
          :price="list.price"
          :quantity="list.quantity">
        </goods>
      </view>
      <view class="mt20">
        <picker :range="reasonList" range-key="reason" @change="onChangeReason">
          <view class="row space-between center-y bg-white plr30 ptb34">
            <view>
              <text class="color-red">*</text>
              <text class="fw600">申请原因</text>
            </view>
            <view>
              <text v-if="reasonIndex >= 0" class="pr20 color-gray">{{ reasonList[reasonIndex].reason }}</text>
              <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
            </view>
          </view>
        </picker>
        <view class="bg-white mt20 plr30 ptb34">
          <view>
            <text class="color-red">*</text>
            <text class="fw600">问题描述</text>
          </view>
          <view>
            <textarea 
              placeholder="请输入10~80个字的详细说明"
              placeholder-class="color-gray fs-normal"
              style="height:160rpx; "
              class="ptb30 pl10"
              :maxlength="80"
              @input="onQuestionInput"
              v-model="description"
            />
            <view class="row flex-end color-gray">
              <text>{{ currentInputLength }}/80</text>
            </view>
          </view>
        </view>
        <view class="bg-white mt20 plr30 ptb34">
          <view class="row center-y">
            <text class="fw600">上传照片</text>
            <text class="pl10 color-gray fs-sm">（有图片更容易通过哦）</text>
          </view>
          <view class="row wrap pt30">
            <view class="w-h120 mr20 mb20 relative" v-for="(url, index) in tempFilePaths" :key="index">
              <image :src="url" mode="aspectFill" class="w-h-full" style="max-heigth:120rpx;" />
              <image :src="IMAGE.ICON_CLOSE" class="w-h28 absolute" style="top:-10rpx;right:-10rpx;" @click="onDeleteFile(index)" />
            </view>
            <view class="w-h120">
              <image :src="IMAGE.UPLOAD_IMAGE" class="w-h-full" @click="onSelectImage" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- <view v-if="type === 0 && canCommit" class="submit-btn" @click="onSubmit">
      <text>保存</text>
    </view> -->
    <!-- <block v-if="type === 0">
      <view class="bottom-bar">
        <button class="ptb10 mlr0 radius-round bg-black fw600 color-white" style="width:46%;" @tap="addReturnItem">+退货单号</button>
        <button class="ptb10 mlr0 radius-round bg-theme fw600" style="width:46%;">确定保存</button>
      </view>
    </block> -->
    <view class="submit-btn" @click="onSubmit">
      <text >提交申请</text>
    </view>
  </view>
</template>

<script>
import Goods from '../components/Goods'
import { getReasionList, fillLogisticsInfo, applyForRefund } from '@/api/order/return.js'
import { ARROW_RIGHT, UPLOAD_IMAGE, ICON_CLOSE, ADDRESS_LINE } from '@/imageConfig'
import { uploadFile } from '@/api/tools/oss'

export default {
  name: "ReturnGoods",
  components: {Goods},
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT,
        UPLOAD_IMAGE,
        ICON_CLOSE,
        ADDRESS_LINE
      },
      list:{},
      reasonList: [], // 原因列表
      reasonIndex: -1, // 当前原因索引
      description: '', // 问题描述
      currentInputLength: 0, // 问题描述的当前输入长度
      // logisticsCompanyName: '', // 物流公司名称
      // expressNo: '', // 物流单号
      tempFilePaths: [],
      // returnType:'',//返回上一个页面的判断类型
      // canCommit: false, //填写退回信息，是否可提交
      source: 'returnList', //来源页面，用于回调刷新页面
      returnInfoList: []
    };
  },
  computed: {},
  onLoad(options) {
    this.source = options.source
    // this.returnType = options.returnType
    this.list = JSON.parse(decodeURIComponent(options.list))
    uni.setNavigationBarTitle({ title: '退换申请' })
    this.fetchReasonList()
  },
  methods: {
    // 获取申请原因列表
    fetchReasonList() {
      uni.showLoading({mask:true})
      getReasionList().then(res => {
        console.log(res.data)
        this.reasonList = res.data
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 选择原因
    onChangeReason(event) {
      let { value } = event.detail
      // console.log(value, event)
      this.reasonIndex = Number(value)
    },
    // 监听问题描述输入框
    onQuestionInput(event) {
      let { value } = event.detail
      this.currentInputLength = value.length
    },
    // 调用微信api选择图片
    onSelectImage() {
      uni.chooseImage({
        count: 9 - this.tempFilePaths.length,
        sizeType: ['compressed'],
        success: async (res) => {
          console.log(res)
          if (res.errMsg = "chooseImage:ok") {
            this.tempFilePaths = this.tempFilePaths.concat(res.tempFilePaths)
            // try {
            //   uni.showLoading({ title: '上传中', mask: true })
            //   let tempFilePaths = res.tempFilePaths
            //   for(let path of tempFilePaths) {
            //     let image = await uploadFile('mp-refund-images', path)
            //     // console.log(image)
            //     this.fileList.push(image)
            //   }
            // } catch (error) {
            //   console.log(error)
            // } finally {
            //   uni.hideLoading()
            // }
          }
        }
      })
    },
    // 提交
    onSubmit() {
        // if (!this.logisticsCompanyName) {
        //   uni.showToast({ title: '请输入物流公司名称', icon: 'none' })
        //   return
        // }
        // if (!this.logisticsCompanyName) {
        //   uni.showToast({ title: '请输入物流单号', icon: 'none' })
        //   return
        // }
        // uni.showModal({
        //   title: '确认提交？',
        //   success: t => {
        //     if (t.confirm) {
        //       uni.showLoading({ title: '提交中...', mask: true })
        //       fillLogisticsInfo({
        //         "id": this.orderId,
        //         "expressNo": this.expressNo,
        //         "logisticsCompanyName": this.logisticsCompanyName
        //       }).then(res => {
        //         console.log('提交成功')
        //         this.callback()
        //         uni.navigateBack()
        //       }).finally(() => {
        //         uni.hideLoading()
        //       })
        //     }
        //   }
        // })
        if (this.reasonIndex < 0) {
          uni.showToast({ title: '请选择申请原因', icon: 'none' })
          return
        }
        if (this.description.length < 10 || this.description.length > 80) {
          uni.showToast({ title: '请输入10~80个字的详细说明', icon: 'none' })
          return
        }
        uni.showModal({
          title: '确认提交申请？',
          success: async (t) => {
            if (t.confirm) {
              let urls = []
              uni.showLoading({ title: '提交中...', mask: true })
              try {
                for(let path of this.tempFilePaths) {
                  let file = await uploadFile('mp-refund-images', path)
                  urls.push(file.url)
                }
              } catch (error) {
                console.log(error)
              } finally {
                applyForRefund({
                  orderId: this.list.orderId,
                  orderDetailsId:this.list.id,
                  description: this.description,
                  reasonId: this.reasonList[this.reasonIndex].id,
                  images: urls.join(','),
                  reasonName: this.reasonList[this.reasonIndex].reason
                }).then(res => {
                  console.log('提交成功')
                  // 跳转到订单详情页
                  this.callback()
                  uni.navigateBack()
                }).finally(() => {
                  uni.hideLoading()
                })
              }
            }
          }
        })
    },
    // 删除文件
    onDeleteFile(index) {
      this.tempFilePaths.splice(index, 1)
    },
    callback() {
      if(this.source === 'orderList'){ //刷新订单列表
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
      }else if(this.source === 'orderDetail'){ //刷新订单详情
        this.$eventHub.$emit(this.$eventName.ORDER_LIST_REFLUSH, true)
        this.$eventHub.$emit(this.$eventName.ORDER_DETAIL_REFLUSH, true)
      }else if(this.source === 'returnList'){ //刷新退换单列表
        this.$eventHub.$emit(this.$eventName.RETURN_LIST_REFLUSH, true)
      }else if(this.source === 'returnDetail'){ //刷新退换单详情
        this.$eventHub.$emit(this.$eventName.RETURN_DETAIL_REFLUSH, true)
      }
    },
    // +退货单号
    // addReturnItem() {
    //   this.returnInfoList.push({logisticsCompanyName: '', expressNo: ''})
    // }
  }
};
</script>

<style lang="scss" scoped>
.submit-btn{
  position: fixed;
  bottom: 0;
  height: 100rpx;
  line-height: 100rpx;
  width: 100%;
  text-align: center;
  background:rgba(255,209,0,1);
  font-size: 28rpx;
  color: #121314;
  font-weight: 600;
}
.bottom-bar{
  // position: fixed;
  // bottom: 0;
  // right: 0;
  // left: 0;
  // ptb30 plr40 bg-white row space-between 
  padding: 30rpx 40rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
}
</style>
