<template>
  <view class="bg-primary min-h-full" style="padding-bottom:200rpx;">
    <!-- 顶部 -->
    <view class="relative">
      <image :src="IMAGE.TOP_BG" class="w-full" mode="widthFix" />
      <view class="pos-center">
        <view class="col center-y">
          <image :src="userInfo.headImgUrl || IMAGE.AVATAR_DEFAULT" class="w-h140 radius-circle" />
          <text class="color-white fs-lg-big mt40 fw600">{{ userInfo.nickName }}</text>
        </view>
      </view>
    </view>
    <!-- 统计数据 -->
    <view class="mb20 bg-white">
      <view class="row space-around ptb40">
        <view class="text-center">
          <text class="block fs-lg fw600">{{ statusCount && statusCount.publish || 0 }}</text>
          <text class="block fs-sm color-gray mt30">已发布</text>
        </view>
        <view class="text-center">
          <text class="fs-lg block fw600">{{ statusCount && statusCount.unChecked || 0 }}</text>
          <text class="block fs-sm color-gray mt30">待审核</text>
        </view>
        <view class="text-center">
          <text class="fs-lg block fw600 color-gray">{{ statusCount && statusCount.fail || 0 }}</text>
          <text class="block fs-sm color-gray mt30">未通过</text>
        </view>
        <view class="text-center">
          <text class="fs-lg block fw600 color-gray">{{ statusCount && statusCount.offline || 0  }}</text>
          <text class="block fs-sm color-gray mt30">已下线</text>
        </view>
      </view>
    </view>
    <block v-if="!isNull">
      <!-- 素材列表 -->
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
            :create-time="item.createTime"
            :show-edit="item.status === 2 && item.type === 0"
            :show-delete="item.status === 2"
            @delete="onDelete(item.id, index)"
            @edit="onEdit(item)">
            <!-- 审核状态 -->
            <block>
              <!-- 0草稿1待审核,2审核不通过,3已发布,4:下线 -->
              <view slot="status" class="fs-sm fw600" v-if="item.status === 0">草稿</view>
              <view slot="status" class="fs-sm fw600" v-if="item.status === 1">待审核</view>
              <view slot="status" class="fs-sm fw600 row center-y" v-if="item.status === 2" @tap="onDenialReason(item.denialReason)">
                <text class="color-gray mr10">审核不通过</text>
                <image :src="IMAGE.QUESTION" class="w-h30"  />
              </view>
              <view slot="status" class="fs-sm fw600" v-if="item.status === 3">已发布</view>
              <view slot="status" class="fs-sm fw600" v-if="item.status === 4">下线</view>
            </block>
            <!-- 商品 -->
            <view slot="after-file">
              <goods-box 
                :image="item.spuImg"
                :name="item.spuName"
                :price="item.spuPrice"
                @tap="$routerLink(`/pages/spu/index?spuId=${item.spuId}&skuId=${item.skuId}`)"
              />
            </view>
          </material-item>
        </block>
      </view>
      <view class="color-gray fs-mini text-center ptb20">
        <text v-if="loadMore.finished">我是有底线的</text>
        <text v-if="loadMore.loading">更多数据加载中...</text>
        <text v-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
      </view>
    </block>
    <view v-else class="text-center">
      <image :src="IMAGE.NULL_BOX_IMG" class="w386 h258" />
      <text class="block mt60 color-info">暂无素材哦</text>
    </view>
    <navigator url="/pagesA/material/Publish">
      <button class="add-button">新建素材</button>
    </navigator>
  </view>
</template>

<script>
import MaterialItem from '_c/MaterialItem'
import GoodsBox from '_c/GoodsBox'
import { QUESTION, TOP_BG, AVATAR_DEFAULT, NULL_BOX_IMG } from '@/imageConfig'
import { getStatusCount, getMaterialList, deleteMaterial } from '@/api/goods/material'
import { mapGetters } from 'vuex'

export default {
  name: "MaterialGoods",
  components: { MaterialItem, GoodsBox },
  data() {
    return {
      IMAGE: {
        QUESTION,
        TOP_BG,
        AVATAR_DEFAULT,
        NULL_BOX_IMG
      },
      isNull: false,
      loadMore: {
        finished: false,
        loading: false,
        error: false,
      },
      // 素材统计
      statusCount: null,
      query: {
        pageNo: 0,
        pageSize: 20,
        type: 2, // 1所有素材,2我的素材
        lastTime: ''
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad() {
    this.init()
    // 监听发布素材成功事件
    this.$eventHub.$on(this.$eventName.PUBLISH_MATERIAL_SUCCESS, () => {
      console.log('发布素材成功')
      // 重置状态
      this.isNull = false
      this.loadMore.finished = false
      this.loadMore.loading = false
      this.loadMore.error = false
      this.query.lastTime = ''
      this.query.pageNo = 0
      this.list = []
      this.init()
    })
  },
  methods: {
    init() {
      this.fetchStatusCount()
      this.loadList()
    },
    // 获取状态统计
    fetchStatusCount() {
      getStatusCount().then(res => {
        this.statusCount = res.data
      })
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
    // 查看审核不通过原因
    onDenialReason(denialReason) {
      uni.showToast({ title: denialReason, icon: 'none' })
    },
    // 删除素材
    onDelete(id, index) {
      console.log(id, index)
      uni.showModal({
        title: '确定删除素材吗？',
        content: '删除后无法找回该素材哦',
        confirmText: '确定',
        cancelText: '取消',
        success: (t) => {
          if (t.confirm) {
            deleteMaterial(id).then(res => {
              uni.showToast({ title: '删除成功', icon: 'none' })
              this.list.splice(index, 1)
              if (this.list.length === 0) {
                this.isNull = true
              }
            })
          }
        }
      })
    },
    // 重新编辑
    onEdit(item) {
      console.log(item)
      // let 
      uni.navigateTo({
        url: `/pagesA/material/Publish?data=${JSON.stringify(item)}`
      });
    }
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