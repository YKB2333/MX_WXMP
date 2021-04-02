<template>
  <view class="min-h-full bg-primary pt20">
    <view class="row space-between center-y h140 l-h140 plr30 bg-white hairline-bottom" @tap="chooseImage">
      <text>头像</text>
      <view>
        <image :src="userInfo && userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT" class="w-h100 mr30 radius-circle" />
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>
    </view>
    <view class="row space-between center-y h100 l-h100 plr30 bg-white hairline-bottom" @tap="$routerLink(`/pagesA/user-info/Update?nickName=${userInfo.nickName}`)">
      <text>用户名</text>
      <view>
        <text class="mr30">{{ userInfo && userInfo.nickName }}</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>
    </view>
    <view class="row space-between center-y h100 l-h100 plr30 bg-white" @tap="$routerLink(`/pagesA/user-info/Realname`)">
      <text>实名信息</text>
      <view>
        <text class="mr30" v-show="!hasRealname">未填写</text>
        <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" />
      </view>
    </view>
  </view>
</template>

<script>
import { AVATAR_DEFAULT, ARROW_RIGHT } from '@/imageConfig'
import { updateAvatarName } from '@/api/user'
import { uploadFile } from '@/api/tools/oss'
import { mapGetters } from 'vuex'
import { getRealnameList } from '@/api/user'

export default {
  name: "MyUserInfo",
  components: {},
  data() {
    return {
      IMAGE: {
        AVATAR_DEFAULT,
        ARROW_RIGHT
      },
      // 是否已有实名信息
      hasRealname: true
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onShow() {
    uni.showLoading()
    getRealnameList().then(res => {
      if (res.data.length) {
        this.hasRealname = true
      } else {
        this.hasRealname = false
      }
    }).finally(() => {
      uni.hideLoading()
    })
  },
  methods: {
    chooseImage() {
      // 上传头像
      uni.chooseImage({
        count: 1,
        success: async (choose) => {
          let tempFilePaths = choose.tempFilePaths
          try {
            uni.showLoading({ mask: true, title: '保存中...' })
            let file = await uploadFile('mp-avatar', tempFilePaths[0])
            console.log(file)
            await updateAvatarName({ headImgUrl: file.url })
            this.$store.commit('UPDATE_USER_INFO_VALUE', { headImgUrl: file.url })
            uni.showToast({ title: '保存成功', icon: 'none' })
          } catch (error) {
            console.log(error)
          } finally {
            uni.hideLoading()
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
