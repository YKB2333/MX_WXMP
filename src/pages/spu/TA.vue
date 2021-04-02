<template>
  <view>
    <!-- #ifdef H5 -->
    <view class="plr30 pt28 bg-white title_fixed">
      <view
        class="col center-x mb16 bg-white"
        style="position: relative; top: 0; z-index: 1"
        :style="{ 'margin-top': menuTop - 4 + h5Height + 'px' }"
      >
        <view class="absolute" @tap="goBack">
          <image :src="IMAGE.ARROW_LEFT" class="w-h48" />
        </view>
        <view class="text-center">
          <text class="fs-lg-num fw600 l-h90">TA说</text>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <view class="plr40 mt32">
      <view 
        class="ta-list pl30 mb24"
        v-for="(item, index) in list" 
        :key="index"
        style="background: #F6F6F6;border-radius:16rpx;"
      >
        <talk 
          :article="item"
        />
      </view>
      <view class="color-gray fs-mini text-center pb20">
        <text v-if="loadMore.finished">我是有底线的</text>
        <text v-if="loadMore.loading">更多数据加载中...</text>
        <text v-if="loadMore.error" @click="onErrorClick">请求发生错误，点击重试</text>
      </view>
    </view>
  </view>
</template>

<script>
import InfoCard from '_c/InfoCard'
import Talk from './components/Talk'
import { TAList } from '@/api/article'
import { ARROW_LEFT } from "@/imageConfig";
import { mapGetters } from "vuex";

export default {
  name: "TA",
  components: { InfoCard, Talk },
  data() {
    return {
      IMAGE: {
        ARROW_LEFT
      },
      query: {
        pageNo: 1,
        pageSize: 20,
        flag: 0, // 第一次传0
        skuId: null,
        spuId: null
      },
      loadMore: {
        finished: false,
        loading: false,
        error: false
      },
      list: [],
      h5Height:0,
    }
  },
  computed: {
    ...mapGetters(["menuTop"]),
  },
  onLoad(options) {
    this.query.spuId = options.spuId
    this.query.skuId = options.skuId
    this.init()
  },
  methods: {
    init() {
      //#ifdef H5
      this.h5Height = 20;
      // #endif
      this.loadMore.finished = false
      this.loadMore.loading = false
      this.loadMore.error = false
      this.query['pageNo'] = 0
      this.list = []
      this.loadList()
    },
    loadList() {
      if (this.loadMore.finished || this.loadMore.loading || this.loadMore.error) return
      this.query['pageNo'] += 1
      this.loadMore.loading = true
      TAList(this.query).then(res => {
        let data = res.data
        this.list = this.list.concat(data.pageInfo.list)
        console.log(this.list)
        this.query['flag'] = data.flag
        if (!data.hasNextPage) {
          this.loadMore.finished = true
        }
        this.loadMore.error = false
      }).catch(() => {
        this.loadMore.error = true
        this.query['pageNo'] -= 1
      }).finally(() => {
        this.loadMore.loading = false
      })
    },
    onErrorClick() {
      this.loadMore.error = false
      this.loadList()
    },
    goBack(){
      uni.navigateBack();
    }
  },
  onReachBottom() {
    // console.log('滚动加载')
    this.loadList()
  },

}
</script>

<style lang="scss" scoped>

</style>