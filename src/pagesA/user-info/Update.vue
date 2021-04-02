<template>
  <view class="min-h-full bg-primary pt20 relative pb100">
    <view class="h100 l-h100 plr30 bg-white row center-y">
      <input 
        v-model="nickName"
        type="text" 
        placeholder="请输入新的昵称" 
        :maxlength="16"
        class="flex-1 ptb20"
        focus
      />
      <view v-show="nickName" class="plr20 ptb10" @tap="onClear">
        <image :src="IMAGE.ICON_DELETE" class="w-h28" />
      </view>
    </view>
    <!-- 保存按钮 -->
    <button class="save-btn" :loading="btnLoading" @tap="onSave">保存</button>
  </view>
</template>

<script>
import { updateAvatarName } from '@/api/user'
import { ICON_DELETE } from '@/imageConfig'

export default {
  name: "UpdateUserInfo",
  components: {},
  data() {
    return {
      IMAGE: { ICON_DELETE },
      btnLoading: false,
      nickName: '',
      type: 1, // 1修改用户昵称
    };
  },
  computed: {},
  onLoad(options) {
    if (options.nickName) {
      this.nickName = options.nickName
      this.type = 1
      uni.setNavigationBarTitle({
        title: '昵称'
      })
    } 
  },
  methods: {
    onSave() {
      if (this.type === 1) { // 修改用户昵称
        if (!this.nickName) {
          uni.showToast({ title: '请输入新的用户昵称', icon: 'none'})
          return 
        }
        if (this.btnLoading) return
        this.btnLoading = true
        updateAvatarName({ nickName: this.nickName }).then(res => {
          this.$store.commit('UPDATE_USER_INFO_VALUE', { nickName: this.nickName })
          uni.showToast({ title: '保存成功', icon: 'none'})
          setTimeout(() => {
            uni.navigateBack()
          }, 1000);
        }).finally(() => {
          this.btnLoading = false
        })
      }
    },
    onClear() {
      this.nickName = ''
    }
  }
};
</script>

<style lang="scss" scoped>
.save-btn{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  line-height: 100rpx;
  font-weight: 600;
  font-size: 28rpx;
  color: white;
  background-color: $uni-color-pink;
}
</style>
