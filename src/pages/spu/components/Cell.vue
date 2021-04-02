<template>
    <view class="row space-between center-y ptb36" @click="onClick">
      <view class="fs-sm color-gray">
        <text v-if="!$slots.title">{{ title }}</text>
        <block v-else>
          <slot name="title" />
        </block>
      </view>
      <view class="row center-y">
        <text class="fs-sm color-gray" v-if="label">{{ label }}</text>
        <image v-if="arrow" :src="IMAGE.ARROW_RIGHT" class="w24 h32" style="position: relative;" />
      </view>
    </view>
</template>

<script>
import { ARROW_RIGHT } from '@/imageConfig'
export default {
  name: "Cell",
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String
    },
    label: {
      type: String
    },
    arrow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      IMAGE: {
        ARROW_RIGHT
      }
    }
  },
  methods: {
    onClick() {
      if (this.url && this.arrow) {
        uni.navigateTo({
          url: this.url
        })
      } else {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>