<template>
  <view class="bg-primary min-h-full">
    <view class="bg-white p30" v-if="noticeData">
      <view class="text-center pb20 hairline-bottom">
        <view class="fw600 fs-lg mb20">{{ noticeData.title }}</view>
        <view class="color-gray">发布时间：{{ noticeData.releasTime }}</view>
      </view>
      <view class="ptb20">
        <view>{{ noticeData.reciveName }}</view>
        <view>{{ noticeData.content }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Notice",
  data() {
    return {
      noticeData: null,
    }
  },
  onLoad(options) {
    this.noticeData = JSON.parse(options.notice)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>