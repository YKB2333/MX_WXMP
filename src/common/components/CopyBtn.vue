<template>
  <text class="color-red fs-sm plr10" :class="customerClass" @click="onCopy">复制</text>
</template>

<script>
export default {
  name: "CopyBtn",
  props: {
    copyData: {
      type: String,
      required: true
    },
    customerClass: { // 自定义类名
      type: String
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onCopy() {
      if (!this.copyData) {
        console.error('亲爱的，记得把要复制的内容传给我')
      } else {
        wx.setClipboardData({
          data: this.copyData
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>