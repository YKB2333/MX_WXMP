<template>
  <view class="page">
    <van-cell-group>
      <van-cell title="收货地址管理" is-link :border="false" url="/pages/address/AddressList" custom-class="mb20" />
      <!-- <van-cell title="账号密码" is-link :border="false" url="/pagesA/settings/Password" custom-class="mb20"	/> -->
      <!-- <van-cell title="永久注销" is-link :border="false" url="/pagesA/settings/Cancellation" /> -->
      <van-cell title="关于我们" is-link  :border="false" :url="`/pagesA/H5/index?name=aboutUs&title=关于我们`" custom-class="mb20"	/>
    </van-cell-group>
    <view class="Copyright col">
      <text>Copyright © 2021</text>
      <text>广州秒寻网络科技有限公司 版权所有</text>
    </view>
    <view class="quitLogin" @click="onLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script>

export default {
  name: 'SettingsMine',
  components: {  },
  data() {
    return {
    }
  },
  computed: {},
  onLoad() {
  },
  methods: {
    // 退出登录
    onLogout() {
      uni.showModal({
        title: '确定退出登录？', 
        success: (t) => {
          if (t.confirm) {
            uni.showLoading({ mask: true })
            this.$store.dispatch('userLogout').then(res => {
              uni.reLaunch({
                url: '/pages/tabbar/Mall'
              })
            }).finally(() => {
              uni.hideLoading()
            })
          }
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background: #F2F4FA;
}
.Copyright{
  position: fixed;
  width: 100%;
  bottom: 100rpx;
  height:100rpx;
  color: #9DA0A4;
  font-size: 20rpx;
  text-align: center;
}
.quitLogin{
  position: fixed;
  bottom: 0;
  height:100rpx;
  line-height: 100rpx;
  width: 100%;
  text-align: center;
  // background:rgba(255,209,0,1);
  background:#fff;
  font-size: 14px;
  color: #121314;
  font-weight: 600;
}
</style>