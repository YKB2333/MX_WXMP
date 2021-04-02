<template>
  <view>
    <view class="custom-nav" v-if="showStatus" :style="{height:menuTop-4+'px', backgroundColor:bg, top:0}"></view>
    <view
      class="custom-nav"
      :style="{height:navBarHeight+'px', top:menuTop-4+'px', lineHeight:navBarHeight+'px', backgroundColor:bg}"
    >
      <slot></slot>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    bg:{
      type:String,
      default: "transparent"
    },
    showStatus:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      menuTop: "",
      navBarHeight: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getSystemInfo();
    },
    // 获取自定义导航栏配置
    getSystemInfo() {
      let systemInfo = uni.getSystemInfoSync();
      // 获取menu属性
      // #ifdef MP-WEIXIN
      let rect = uni.getMenuButtonBoundingClientRect(); //胶囊按钮位置信息
      this.menuTop = rect.top;
      this.navBarHeight = (function () {
        //导航栏高度
        let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
        return 2 * gap + rect.height;
      })();
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-nav {
  position: fixed;
  left: 0;
  z-index: 9999;
  width: 100%;
  background-color: transparent;
}
</style>