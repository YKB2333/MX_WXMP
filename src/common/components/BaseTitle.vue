<template>
  <view :class="['row space-between ','center-y ','wpct100','mauto','plr40', parentClass ]" :style="parentStyle">
    <!-- 标题 -->
    <slot name="title">
      <text :class="title_Class ? title_Class :['fw600', 'fs18','flex-1']">{{title || '标题'}}</text>
    </slot>
    <!-- 右侧文本内容 -->
    <view v-if="isValue || value || this.$slots.value " @click="is_link ? getLink() : null" :class="['row','center-y',right_Class ? right_Class :['fs14']]" style="color:#afafaf">
      <slot name="value">
        {{ value  || '更多'}}
      </slot>
      <image :src="IMAGE.ARROW_RIGHT" class='w14 h24' />
    </view>
  </view>
</template>

<script>
import { ARROW_RIGHT } from '@/imageConfig'

export default {
  name: "BaseTitle",
  props: {
    title: { // 标题
      type: String,
      default: ""
    },
    value:{ //  右侧文本
      type: String,
      default: ""
    },
    isValue:{ //  是否显示右侧文本
      type: Boolean,
      default: false
    },
    icon: { // 是否显示 右侧箭头
      type: Boolean,
      default: false
    },
    is_link: { // 是否跳转开关
      type: Boolean,
      default: false
    },
    url:{ //跳转地址
      type: String,
      default: ""
    },
    to:{ //路由跳转地址
    },
    title_Class: { // 标题类格外类名
      type: String,
      default: ""
    },
    right_Class: { // 右侧格外类名
      type: Array,
      default: () => {[]}
    },
    parentClass: { // 总盒子类名
      type: String,
      default: ""
    },
    parentStyle: { // 总盒子样式
     type: Array,
      default: () => {[]}
    },
  },
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
    getLink() {
      if(this.url) window.location.href= this.url;
      if(this.to)  this.$router.push( this.to.hasOwnProperty('path') ? this.to :{ path: this.to  })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
