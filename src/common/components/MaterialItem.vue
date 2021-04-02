<template>
  <view class="row p40 bg-white mb20">
    <view><image :src="avatar || IMAGE.AVATAR_DEFAULT" class="w-h80 mr24 radius-circle" /></view>
    <view class="flex-1 hidden">
      <view class="color-gray mb24 row space-between center-y">
        <view>{{ nickName }}</view>
        <slot name="status" />
      </view>
      <view class="mb40 hidden content-box" :style="{maxHeight: fold.maxContentHeight+'px', lineHeight:'20px'}">
        <text>{{ content }}</text>
      </view>
      <view v-if="fold.show" class="fw600 mb40" style="color: #3458A3;" @click="onFoldClick">{{ fold.flag ? '全文' : '收起' }}</view>
      <!-- 图片 -->
      <view class="layout-row gutter-12" v-if="type === 0">
        <view class="layout-col-8" v-for="(url, index) in images" :key="index">
          <image :src="url" class="w-h180 radius mb12" mode="aspectFill" @click="onPreviewImg(url)" />
        </view>
      </view>
      <!-- 视频 -->
      <view v-if="type === 1">
        <video 
          :src="imgList" 
          :poster="videoCover"
          show-mute-btn 
          muted
          class="w-full h360" 
        />
      </view>
      <slot name="after-file" />
      <view class="color-gray fs-sm ptb30 hairline-bottom">{{ createTime }}</view>
      <view class="row space-around center-y mt40">
        <view v-if="showSave" @tap="onSave">
          <image :src="IMAGE.MATERIAL_ICON_SAVE" class="w-h36 mr12" />
          <text class="fs-sm">保存本地</text>
        </view>
        <view v-if="showPyq">
          <image :src="IMAGE.MATERIAL_ICON_PYQ" class="w-h36 mr12" />
          <text class="fs-sm">一件发圈</text>
        </view>
        <view v-if="showWechat">
          <image :src="IMAGE.MATERIAL_ICON_WECHAT" class="w-h36 mr12" />
          <text class="fs-sm">微信好友</text>
        </view>
        <view v-if="showEdit" @tap="onBtnClick('edit')">
          <image :src="IMAGE.MATERIAL_ICON_EDIT" class="w-h36 mr12" />
          <text class="fs-sm">重新编辑</text>
        </view>
        <view v-if="showDelete" @tap="onBtnClick('delete')">
          <image :src="IMAGE.MATERIAL_ICON_DELETE" class="w-h36 mr12" />
          <text class="fs-sm">删除</text>
        </view>
      </view>
    </view>
    <!-- 保存成功后的弹窗 -->
    <van-popup :show="showSaveSuccessPopup" position="bottom">
      <view class="plr90 ">
        <view class="ptb50 hairline-bottom row space-around">
          <view class="row center-y">
            <image :src="IMAGE.MATERIAL_ICON_SUCCESS" class="w-h28 mr10" />
            <text class="fs-sm color-gray">已复制文案</text>
          </view>
          <view class="row center-y">
            <image :src="IMAGE.MATERIAL_ICON_SUCCESS" class="w-h28 mr10" />
            <text class="fs-sm color-gray">素材已保存至相册</text>
          </view>
        </view>
      </view>
      <view class="fw600 text-center ptb40">去分享</view>
      <view class="row space-between pb40 plr50">
        <view class="fs-sm color-gray">①打开微信</view>
        <view class="fs-sm color-gray">②粘贴文案&选择图片</view>
        <view class="fs-sm color-gray">③分享好友&发圈</view>
      </view>
      <view class="ptb40 fw600 text-center" style="border-top: 1px solid #EEF2F6;" @tap="closePopup">知道了</view>
    </van-popup>
  </view>
</template>

<script>
// 素材最大高度
const maxContentHeight = 4 * 20
import { 
  MATERIAL_ICON_DELETE,
  MATERIAL_ICON_EDIT,
  MATERIAL_ICON_PYQ,
  MATERIAL_ICON_SAVE,
  MATERIAL_ICON_WECHAT,
  MATERIAL_ICON_SUCCESS,
  AVATAR_DEFAULT
} from '@/imageConfig'
import vanPopup from '@/wxcomponents/vant/popup/index'
import { downloads } from '@/api/goods/material'

export default {
  name: "MaterialItem",
  components: { vanPopup }, 
  props: {
    materialId: {
      type: String,
      required: true
    },
    type: { //0图片，1视频
      type: Number,
      default: 0
    },
    avatar: { // 头像
      type: String
    },
    nickName: { // 昵称
      type: String
    },
    content: { // 素材内容
      type: String
    },
    imgList: { // 逗号隔开，如果是视频类型时值为视频url
      type: String,
    },
    createTime: { // 创建时间
      type: String
    },
    showSave: { // 是否显示保存按钮
      type: Boolean,
      default: true
    },
    showEdit: { // 是否显示编辑按钮
      type: Boolean,
      default: false
    },
    showDelete: { // 是否显示删除按钮
      type: Boolean,
      default: false
    },
    showPyq: { // 是否显示朋友圈按钮
      type: Boolean,
      default: false
    },
    showWechat: { // 是否显示微信好友按钮
      type: Boolean,
      default: false
    },
    videoCover: { // 视频封面
      type: String
    }
  },
  data() {
    return {
      IMAGE: {
        MATERIAL_ICON_DELETE,
        MATERIAL_ICON_EDIT,
        MATERIAL_ICON_PYQ,
        MATERIAL_ICON_SAVE,
        MATERIAL_ICON_WECHAT,
        AVATAR_DEFAULT,
        MATERIAL_ICON_SUCCESS
      },
      fold: {
        show: false,
        maxContentHeight: 9999999,
        flag: true, // true全文，false收起
      },
      images: [], // 图片url数组
      showSaveSuccessPopup: false, // 保存成功后的弹窗
    }
  },
  computed: {
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query.select('.content-box').boundingClientRect((data) => {
      let height = data.height
      if (height > 80) {
        this.fold.show = true
        this.fold.maxContentHeight = maxContentHeight
      }
　　}).exec()
  },
  methods: {
    onFoldClick() {
      console.log(this.fold['flag'])
      if (this.fold['flag']) {
        this.fold.maxContentHeight = 99999
      } else {
        this.fold.maxContentHeight = maxContentHeight
      }
      this.fold['flag'] = !this.fold['flag']
    },
    onBtnClick(type) {
      this.$emit(type)
    },
    // 预览图片
    onPreviewImg(current) {
      wx.previewImage({
        urls: this.images,
        current: current
      })
    },
    onSave() {
      wx.getSetting({
        success: async (res) => {
          console.log(res.authSetting)
          if (res.authSetting['scope.writePhotosAlbum']) { // 有保存权限
            this.startSave()
          } else { // 没有保存权限
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => { // 授权成功
                this.startSave()
              },
              fail: () => { // 未授权
                this.errorAuth()
              }
            })
          }
        }
      })
    },
    errorAuth() {
      wx.showModal({
        title: '未开启保存权限',
        content: '开启保存权限才可以保存素材哦',
        confirmText: '去开启',
        success: t => {
          if (t.confirm) {
            wx.openSetting({
              success(settingData) {
                if (settingData.authSetting['scope.writePhotosAlbum']) {
                  uni.showToast({ title: '开启权限成功，再次保存图片即可', icon: 'none' })
                } else {
                  uni.showToast({ title: '未开启权限', icon: 'none' })
                }
              }
            })
          }
        }
      })
    },
    // 保存操作
    async startSave() {
      try {
        if (this.type === 1 && this.imgList.substring(this.imgList.lastIndexOf('.') + 1).toLowerCase() !== 'mp4') {
          uni.showToast({title: '只支持保存mp4格式的视频',icon: 'none',duration: 2000})
          return
        }
        uni.showLoading({ title: '保存中', mask: true })
        if (this.type === 0) { // 图片
          for(let url of this.images) {
            let tempFilePathImg = await this.downloadFile(url)
            await this.saveImg(tempFilePathImg)
          }
        } else if (this.type === 1) { // 视频
          let tempFilePathVideo = await this.downloadFile(this.imgList)
          await this.saveVideo(tempFilePathVideo)
        }
        await this.copyContent()
        this.showSaveSuccessPopup = true
        // 下载次数统计
        downloads(this.materialId)
      } catch (error) {
        console.log(error)
        uni.showToast({ title: `${error}`, icon: 'none', duration: 2000 })
      } finally {
        uni.hideLoading()
      }
    },
    // 复制文案
    copyContent() {
      return new Promise((resolve, reject) => {
        wx.setClipboardData({
          data: this.content,
          success: () => {
            resolve()
          },
          fail: () => {
            reject('复制文案失败')
          }
        })
      })
    },
    // 下载文件，获得保存本地需要的临时文件路径
    downloadFile(url) {
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: url,
          success: res => {
            // console.log('下载', res)
            if (res.statusCode === 200) {
              resolve(res.tempFilePath)
            } else {
              reject('下载失败')
            }
          },
          fail: (error) => {
            reject(error.errMsg)
          }
        })
      })
    },
    // 保存图片到本地
    saveImg(tempFilePath) {
      return new Promise((resolve, reject) => {
        uni.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: () => {
            resolve()
          },
          fail: (error) => {
            reject(error.errMsg)
          }
        })
      })
    },
    // 保存视频到本地
    saveVideo(tempFilePath) {
      wx.saveVideoToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          resolve()
        },
        fail: (error) => {
          reject(error.errMsg)
        }
      })
    },
    // 关闭弹窗
    closePopup() {
      this.showSaveSuccessPopup = false
    }
  },
  watch: {
    imgList: {
      handler: function(val) {
        // console.log(val.split(','))
        if (this.type === 0) { // 如果是图片，将逗号切割为数组
          this.images = val.split(',')
        }
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>