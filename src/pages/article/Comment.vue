<template>
  <view class="page" :style="{'padding-bottom':execBottomHeight + 'px'}">
    <!-- 评论列表 -->
    <view class="comment-container" id="after-article">
      <view class="pb30" v-if="commentList.length">
        <block v-for="(item, index) in commentList" :key="index">
          <comment-item 
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
        <view>快来夸夸TA～</view>
      </view>

    </view>
    <view class="color-gray fs-mini text-center pb20" v-if="commentList.length">
      <text v-if="finished">你已看完全部评论啦~</text>
      <text v-if="loading">加载中...</text>
      <text v-if="error" @click="onErrorClick">请求发生错误，点击重新加载</text>
    </view>
    <!-- 底部评论栏 -->
    <view class="bottom-bar-container row center-y space-between">
      <!-- 用户头像 -->
      <image 
        :src="userInfo && userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT" 
        class="w-h72 mr30 ml22 radius-circle" 
      />
      <input placeholder="对美有追求的人，都喜欢评论" class="flex-1 fs-normal placeholderStyle mr30" disabled @click="onClickWithSession('comment')" />
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
            :cursor-spacing="200"
            :focus="autoFocusCommentInput"
            @focus="onCommentInputFocus"
            @blur="onCommentInputBlur"
            class="fs-normal w-h-full"
          />
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import CommentItem from './components/CommentItem'
import { 
  getCommentList, 
  focus,
  likeComment, 
  cancelLikeComment,
  addComment
} from '@/api/article'
import { AVATAR_DEFAULT, ICON_HEART_ACTIVE, ICON_HEART, ICON_SHARE, ICON_PINGLUN, NULL_BOX } from '@/imageConfig'
import { mapGetters } from 'vuex'
import { javascriptChannelName } from '@/config'

// #ifdef H5
let vm = null
// #endif
export default {
  components: { CommentItem },
  data(){
    return {
      IMAGE: {
        AVATAR_DEFAULT,
        ICON_HEART_ACTIVE,
        ICON_HEART,
        ICON_SHARE,
        NULL_BOX,
        ICON_PINGLUN
      },
      commentQuery: {
        pageNo: 0,
        pageSize: 20,
        articleId: null,
      },
      finished: false,
      loading: false,
      error: false,
      commentList: [], // 评论列表
      totalComments: 0, // 评论总数
      showPopup:false,
      execBottomHeight:0,
      keyboardHeight: 0, // 键盘高度
      commentValue: '', // 评论输入值
      autoFocusCommentInput: false, // 是否自动聚焦评论输入框
      isAndroid: false,
      id:null,
      // 显示获得+喵豆弹窗
      showIntgralPopup: {
        show: false,
        text: '',
        integral: 0
      }, 
    }
  },
  onReady() {
    setTimeout(() => {
      let query = uni.createSelectorQuery();
      query.select('.bottom-bar-container').boundingClientRect(res => {
        this.execBottomHeight = res.height + 60 || 0
        console.log("this.execBottomHeight",this.execBottomHeight)
      }).exec()
    }, 1000);
  },
  onLoad(options) {
    console.log('我在onLoad方法  =========== ',options.id)
    console.log(options.id)
    this.id = options.id
    this.commentQuery.articleId = options.id
    // #ifdef H5
    window.getkeyboardHeight = this.getkeyboardHeight
    // #endif
    this.init()
    this.sysInfo()
  },
  computed: {
    // 用户
    ...mapGetters(['userInfo', 'token'])
  },
  methods:{
    init(){
      // 文章评论列表
      this.loadComments()
    },
    // 加载评论列表
    loadComments() {
      if (this.finished || this.loading || this.error) return
      this.commentQuery['pageNo'] += 1
      this.loading = true
      getCommentList(this.commentQuery).then(res => {
        // console.log(res)
        let data = res.data
        if(data){
          if(data.total>99){
            uni.setNavigationBarTitle({
              title: `全部评论 (99+)`
            });
          }else{
            uni.setNavigationBarTitle({
              title: `全部评论 (${data.total})`
            });
          }
        }
        if (!data.hasNextPage) {
          this.finished = true
        }
        this.commentList = this.commentList.concat(data.list)
        this.totalComments = Number(data.total)
        this.error = false
        console.log('评论列表', this.commentList)
      }).catch(error => {
        this.error = true
        this.commentQuery['pageNo'] -= 1
      }).finally(() => {
        this.loading = false
        // #ifdef H5
        this.$flutter({methods:'HIDE_LOADING'})
        // #endif
      })
    },
    onErrorClick() {
      this.error = false
      this.loadComments()
    },
    onClickWithSession(type, params) {
      if (this.$store.getters.token) {
        if (type === 'toCart') { // 跳转购物车列表
          uni.switchTab({
            url: `/pages/tabbar/ShoppingCart`
          })
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
        uni.navigateTo({
          url: `/pages/login/Phone`
        })
        // #endif
        // #ifdef H5
        this.$flutter({method:'TO_LOGIN'})
        // #endif
      }
    },
    // 关闭评论弹窗
    closePopup(type) {
      if (type === 'comment') {

        this.showPopup = false
        console.log("this.showPopup=====================================================",this.showPopup)
        // #ifdef H5
        this.keyboardHeight = 0
        this.$flutter({ method: 'CLOSE_KEYBOARD' })
        // #endif
      } else if (type === 'share') {
        this.sharePopup = false
      }
    },
    sysInfo() {
      const res = uni.getSystemInfoSync();
      this.isAndroid = res.platform === 'android'
    },
    // 点赞评论
    onLikeComment(item) {
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
    
    getkeyboardHeight(jsonStr) {
      console.log(JSON.parse(jsonStr).keyboardHeight)
      // this.keyboardHeight = this.platformInfo.isIOS ? 0 : Number(JSON.parse(jsonStr).keyboardHeight) 
      this.keyboardHeight = Number(JSON.parse(jsonStr).keyboardHeight)
      console.log('我被執行力 ',this.keyboardHeight)
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
          // #ifdef H5
          this.keyboardHeight = 0
          this.$flutter({ method: 'CLOSE_KEYBOARD' })
          // #endif
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
    // 评论输入框聚焦时触发，padding-bottom撑开键盘高度
    onCommentInputFocus(e) {
      if (this.isAndroid) {
        let { height } = e.detail
        console.log('height', height)
        this.keyboardHeight = height
      }
      // #ifdef H5
      this.keyboardHeight = 340
      // #endif
    },
    // 失焦时padding-bottom为0
    onCommentInputBlur(e) {
      this.keyboardHeight = 0
      // #ifdef H5
      this.$flutter({ method: 'CLOSE_KEYBOARD' })
      // #endif
    },
  },
  onReachBottom() {
    this.loadComments()
  },
  
}
</script>

<style scoped>
.comment-container{
  margin: 0 40rpx;
}
.bottom-bar-container{
  position: fixed;
  bottom: 34rpx;
  left: 0;
  right: 0;
  z-index: 2;
  margin: 0 auto;
  width: 700rpx;
  background-color: #FFFFFF;
  height: 120rpx;
  box-shadow:0px 3px 35px 0px rgba(0, 0, 0, 0.1);
  border-radius: 60rpx;
}
.placeholderStyle{
  background:rgba(245,245,245,1);
  border-radius:34rpx;
  padding-left: 27rpx;
  height: 68rpx;
  line-height: 68rpx;
}
.placeholderStyle::-webkit-input-placeholder{
  font-size:28rpx;
  color:rgba(187,187,187,1);
}
@media  screen and(min-width: 375px)and(max-height: 812px){
  .bottom-bar-container{
    height: 140rpx !important;
    margin-bottom:  40rpx !important;
  }
}
</style>