<template>
  <view class="comment-item col plr30 mb20">
    <view class="row">
      <image :src="avatar" class="avatar-img w-h72" />
      <view class="flex-1">
        <view class="user-row">
          <view class="nick-name">{{ nickName }}</view>
          <view>
            <!-- <text class="zan-count" v-if="zanCount">{{ zanCount }}</text> -->
            <image :src="isZan ? IMAGE.ICON_HEART_ACTIVE : IMAGE.ICON_HEART" class="zan-icon" />
            <text class="zan-count ml14 fw600" >{{ zanCount }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="comment-text l-h44 ellipsis2">{{ formatContent }}</view>
    <view class="row space-between">
      <text class="fs-sm color-gray">{{ timestap | formatCommentTime }}</text>
      <text v-if="showReply" class="reply">回复</text>
    </view>
  </view>
</template>

<script>
import { ICON_ZAN_ACTIVE, ICON_ZAN, ICON_HEART_ACTIVE, ICON_HEART } from '@/imageConfig'

export default {
  name: "CommentItem",
  props: {
    // 头像
    avatar: {
      type: String,
      required: true,
    },
    // 昵称
    nickName: {
      type: String,
      required: true,
    },
    // 评论内容
    content: {
      type: String,
      required: true,
    },
    // 评论时间
    timestap: {
      type: String,
    },
    // 点赞数量
    zanCount: {
      type: Number
    },
    // 是否赞过
    isZan: {
      type: Boolean,
      default: false
    },
    // 显示回复按钮
    showReply: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    formatContent(){
      var reg_l = new RegExp("<p>","g")
      var reg_r = new RegExp("</p>","g")
      return this.content.replace(reg_l,"").replace(reg_r,"")
    }
  },
  data() {
    return {
      IMAGE: {
        ICON_ZAN_ACTIVE,
        ICON_ZAN,
        ICON_HEART_ACTIVE,
        ICON_HEART
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item{
  font-size: 24rpx;
  color: $uni-color-gray;
  padding: 30rpx 0;
  background:rgba(246,246,246,1);
  border-radius:16rpx;
  .avatar-img{
    margin-right: 20rpx;
    border-radius: 50%;
  }
  .user-row{
    display: flex;
    justify-content: space-between;
    height: 60rpx;
    align-items: center;
  }
  .zan-icon{
    width: 40rpx;
    height: 40rpx;
    margin-left: 8rpx;
    vertical-align: top;
  }
  .comment-text{
    font-size: 26rpx;
    color: $uni-color-primary;
    margin: 24rpx 0 0;
  } 
}
</style>