<template>
  <view class="min-h-full bg-primary relative" style="padding-bottom:200rpx;">
    <block v-if="!isNull">
      <view>
        <block v-for="(item, index) in list" :key="index">
          <material-item 
            :material-id="item.id"
            :type="item.type"
            :avatar="item.userAvatar"
            :nick-name="item.nikeName"
            :content="item.content"
            :imgList="item.images"
            :video-cover="item.videoCover"
            :create-time="item.createTime">
          </material-item>
        </block>
      </view>
      <view class="color-gray fs-mini text-center ptb20">
        <text v-if="loadMore.finished">我是有底线的</text>
        <text v-if="loadMore.loading">更多数据加载中...</text>
        <text v-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
      </view>
    </block>
    <view class="pos-center" v-else>
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258" />
      <text class="block mt80 color-info text-center">暂无素材哦</text>
    </view>
    <navigator :url="`/pagesA/material/Publish?skuId=${skuId}`">
      <button class="add-button">新建素材</button>
    </navigator>
  </view>
</template>

<script>
import MaterialItem from '_c/MaterialItem'
import { getMaterialList } from '@/api/goods/material'
import { NULL_BOX_IMG } from '@/imageConfig'

export default {
  name: "Material",
  components: { MaterialItem },
  data() {
    return {
      IMAGE: {
        NULL_BOX_IMG
      },
      isNull: false, // 素材列表为空
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      query: {
        pageNo: 0,
        pageSize: 20,
        type: 1, // 1所有素材,2我的素材
        spuId: '',
        lastTime: ''
      },
      list: [],
      skuId: '', // 从商品详情页面里传入的skuId, 进入发布素材界面时需要传过去
    }
  },
  onLoad(options) {
    console.log(options.spuId)
    if (options.spuId) {
      this.query.spuId = options.spuId
      this.init()
    }
    if (options.skuId) {
      this.skuId = options.skuId
    }
  },
  methods: {
    init() {
      this.isNull = false
      this.loadMore.finished = false
      this.loadMore.loading = false
      this.loadMore.error = false
      this.pageNo = 0
      this.list = []
      this.loadList()
    },
    loadList() {
      if (this.loadMore.finished || this.loadMore.loading || this.loadMore.error) { // 如果已结束或在加载中或发生错误，不触发
        return
      }
      this.query['pageNo'] += 1
      this.loadMore.loading = true
      getMaterialList(this.query).then(res => {
        if (res.data.length === 0) {
          this.loadMore.finished = true
        } else {
          this.list = this.list.concat(res.data)
          this.query['lastTime'] = res.data[res.data.length - 1].createTime
        }
        this.loadMore.error = false
        console.log('素材列表', this.list)
        if (this.list.length === 0) {
          this.isNull = true
        } else {
          this.isNull = false
        }
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
  },
  // 触底加载
  onReachBottom() {
    this.loadList()
  }
}
</script>

<style lang="scss" scoped>
.add-button{
  width: 430rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-weight: 600;
  text-align: center;
  font-size: 28rpx;
  color: $uni-color-primary;
  background-color: $uni-color-theme;
  position: fixed;
  left: 50%;
  right: 50%;
  bottom: 80rpx;
  transform: translateX(-50%);
  border-radius: 60rpx;
  box-shadow: 0px 10rpx 25rpx 1px rgba(255,185,25,0.5);
}
</style>