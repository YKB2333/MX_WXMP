<template>
  <view class="min-h-full" :class="{ 'bg-primary': !showSearchView }">
    <view class="sticky">
      <view class="ptb20 plr30 bg-white" v-if="enableSearch">
        <view class="row center-y">
          <view class="flex-1 row center-y radius-round plr20" style="background-color: #f6f6f6;">
            <image :src="IMAGE.ICON_SEARCH" class="w-h40" />
            <input
              type="text"
              placeholder="输入关键字进行搜索"
              placeholder-class="fs-normal olory-gray"
              class="h60 fs-normal pl10 flex-1"
              confirm-type="search"
              @confirm="confirmSearch"
              v-model="query.keyword"
              :focus="focusSearch"
            />
            <!-- @focus="onFocusSearch" -->
          </view>
          <text class="pl20" @tap="onCancelSearch">取消</text>
        </view>
      </view>
    </view>
    <!-- 搜索界面 -->
    <view v-show="showSearchView">
      <view class="plr30 ptb20">
        <!-- 分类 -->
        <view>
          <view class="fw600 fs-lg mb20 pl10">
            全部分类
            <text class="pl20 color-gray fs-sm" v-if="loadingCategory">加载中...</text>
          </view>
          <view>
            <block v-for="(item, index) in categoryList" :key="index">
              <button
                class="cate-item"
                :class="{ 'active': item.id === query['parentCategoryId'] }"
                @tap="onClickCate(item)"
              >{{ item.categoryName }}</button>
            </block>
          </view>
        </view>
        <!-- 历史搜索 -->
        <view class="pt20" v-if="searchHistory.length">
          <view class="row space-between center-y mb20">
            <view class="fw600 fs-lg pl10">历史搜索</view>
            <view @tap="onClearHistory" class="row">
              <image :src="IMAGE.ICON_CLEAR" class="w-h40" />
              <text>清除</text>
            </view>
          </view>
          <view>
            <button
              class="cate-item"
              v-for="(val, i) in searchHistory"
              :key="i"
              @tap="onClickHistory(val)"
            >{{ val }}</button>
          </view>
        </view>
      </view>
    </view>
    <!-- 商品列表 -->
    <view v-show="!showSearchView" class="pb20">
      <view class="row wrap space-between pt20 plr40">
        <view @tap="onSpuClick(item.id)" v-for="(item, index) in goodsList" :key="index">
          <spu-card
            card-type="a"
            :spu-img="item.skuImage"
            :spu-name="item.spuName"
            :subTitle="item.title"
            :sell-price="item.salesPrice"
            :spu-activity-name="item.spuActivityName"
            :is-new-user-discount="item.isActivityNewUser"
            :origin-price="item.platformPrice"
            :is-label="item.labelName"
            :status="item.status"
            :replenish="item.salesStock == 0 || item.salesStock == null"
          />
        </view>
      </view>
      <view class="color-gray fs-mini text-center">
        <text v-if="searchEmpty">什么都没搜到~</text>
        <block v-else>
          <text v-if="loadMore.finished">我是有底线的</text>
          <text v-else-if="loadMore.loading">更多数据加载中...</text>
          <text v-else-if="loadMore.error" @click="onErrorClick">加载失败，点击重试</text>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import SpuCard from "_c/SpuCard";
import { getAllLevelOne, searchGoods, getAllGoods } from "@/api/goods";
import { mapGetters } from "vuex";
import { ICON_SEARCH, ICON_CLEAR, ICON_DELETE } from "@/imageConfig";
import { debounce } from "@/utils";

export default {
  name: "GoodsList",
  components: { SpuCard },
  data() {
    return {
      IMAGE: {
        ICON_SEARCH,
        ICON_CLEAR,
        ICON_DELETE
      },
      goodsList: [], // 商品列表
      query: {
        pageIndex: 0,
        pageSize: 10,
        keyword: "",
        parentCategoryId: ""
      },
      loadMore: {
        finished: false,
        loading: false,
        error: false
      },
      enableSearch: false, // 是否可搜索状态
      showSearchView: false,
      categoryList: [], // 分类列表
      loadingCategory: false,
      focusSearch: false,
      searchEmpty: false // 搜索结果是否为空
    };
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  onLoad(options) {
    console.log(options)
    if (options.enableSearch && (options.enableSearch != "false" ) && Boolean(options.enableSearch)) {
      uni.setNavigationBarTitle({
        title: "搜索商品"
      });
      this.enableSearch = true;
      setTimeout(() => {
        this.focusSearch = true;
      }, 200);
      if (!this.query["keyword"]) {
        this.showSearchView = true;
      }
      if (this.categoryList.length === 0) {
        this.loadingCategory = true;
        getAllLevelOne()
          .then(res => {
            console.log(res);
            this.categoryList = res.data;
          })
          .finally(() => {
            this.loadingCategory = false;
          });
      }
    } else if (options.type == "banner") {
      this.showSearchView = false;
      this.query["parentCategoryId"] = options.parentCategoryId;
      getAllLevelOne()
        .then(res => {
          console.log(res);
          this.categoryList = res.data;
          this.init();
        })
    } else {
      uni.setNavigationBarTitle({
        title: "全部商品"
      });
      this.enableSearch = false;
      this.init(options);
    }
    // if (options.keyword) {
    //   this.query['keyword'] = options.keyword
    // }
    // if (options.parentCategoryId) {
    //   this.query['parentCategoryId'] = options.parentCategoryId
    // }
  },
  methods: {
    init(options) {
      this.loadMore.finished = false;
      this.loadMore.loading = false;
      this.loadMore.error = false;
      this.query["pageIndex"] = 0;
      this.goodsList = [];
      this.loadList(options);
    },
    loadList(options) {
      if (
        this.loadMore.finished ||
        this.loadMore.loading ||
        this.loadMore.error
      ) {
        // 如果已结束或在加载中或发生错误，不触发
        return;
      }
      if (this.query["keyword"]) {
        uni.setNavigationBarTitle({
          title: "搜索商品"
        });
      } else if (this.query["parentCategoryId"]) {
        if (
          this.categoryList.find(
            ele => ele.id === this.query["parentCategoryId"]
          )
        ) {
          uni.setNavigationBarTitle({
            title: this.categoryList.find(
              ele => ele.id === this.query["parentCategoryId"]
            ).categoryName
          });
        }
      } else {
        uni.setNavigationBarTitle({
          title: "全部商品"
        });
      }
      this.query["pageIndex"] += 1;
      this.loadMore.loading = true;
      this.searchEmpty = false;
      if (options && options.type == "input") {
        getAllGoods(this.query)
          .then(res => {
            let data = res.data;
            if(!data){
              this.loadMore.finished = true;
              return;
            }
            console.log("商品列表", data);
            if (this.query["pageIndex"] === 1 && data.length === 0) {
              this.searchEmpty = true;
            }
            this.goodsList = this.goodsList.concat(data);
            if (data.length < this.pageSize) {
              this.loadMore.finished = true;
            }
            this.loadMore.error = false;
          })
          .catch(() => {
            this.loadMore.error = true;
            this.query["pageIndex"] -= 1;
          })
          .finally(() => {
            this.loadMore.loading = false;
          });
      } else {
        searchGoods(this.query)
          .then(res => {
            let data = res.data;
            if(!data){
              this.loadMore.finished = true;
              return;
            }
            console.log("商品列表", data);
            if (this.query["pageIndex"] === 1 && data.length === 0) {
              this.searchEmpty = true;
            }
            this.goodsList = this.goodsList.concat(data);
            if (data.length < this.pageSize) {
              this.loadMore.finished = true;
            }
            this.loadMore.error = false;
          })
          .catch(() => {
            this.loadMore.error = true;
            this.query["pageIndex"] -= 1;
          })
          .finally(() => {
            this.loadMore.loading = false;
          });
      }
    },
    onErrorClick() {
      this.loadMore.error = false;
      //to do ...
      if (!this.query["keyword"]) {
        this.loadList();
      }else{
        this.loadList({ type: "input" });
      }
    },
    // 搜索输入框聚焦时触发
    onFocusSearch() {
      // console.log("onFocusSearch");
      // if (!this.query["keyword"]) {
      //   this.showSearchView = true;
      // }
      // if (this.categoryList.length === 0) {
      //   this.loadingCategory = true;
      //   getAllLevelOne()
      //     .then(res => {
      //       console.log(res);
      //       this.categoryList = res.data;
      //     })
      //     .finally(() => {
      //       this.loadingCategory = false;
      //     });
      // }
    },
    // 触发键盘搜索
    confirmSearch(e) {
      let { value } = e.detail;
      console.log("键盘搜索", value);
      if (value.trim()) {
        this.handleSearch(value.trim());
        // 保存搜索历史记录
        this.$store.commit("SET_SEARCH_HISTORY", value.trim());
      }
    },
    // 搜索历史
    onClickHistory(val) {
      this.handleSearch(val);
    },
    // 执行搜索事件
    handleSearch(val) {
      this.showSearchView = false;
      this.query["keyword"] = val;
      this.query["parentCategoryId"] = "";
      this.init({ type: "input" });
    },
    // 点击分类
    onClickCate(item) {
      // console.log(item.categoryName)
      if (item.id === this.query["parentCategoryId"]) {
        this.query["parentCategoryId"] = "";
        return;
      }
      this.showSearchView = false;
      this.query["parentCategoryId"] = item.id;
      this.init();
    },
    // 清除历史记录
    onClearHistory() {
      uni.showModal({
        content: "确定删除历史记录？",
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.$store.commit("SET_SEARCH_HISTORY", ""); // 清空
          }
        }
      });
    },
    // 取消
    onCancelSearch() {
      // uni.navigateBack()
      console.log("onCancelSearch",this.query["keyword"])
      this.query["keyword"] = "";
      this.query["parentCategoryId"] = "";
      this.showSearchView = true;
      this.init();
    },
    onSpuClick(id){
      // #ifdef MP-WEIXIN
      uni.navigateTo({
         url: `/pages/spu/index?spuId=${id}`
      });
      // #endif
    }
  },
  onReachBottom() {
    console.log("滚动加载");
    this.loadList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    if (!this.query["keyword"]) {
      this.init();
    }else{
      this.init({ type: "input" });
    }
    setTimeout(() => {
      console.log("下拉刷新");
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.cate-item {
  font-size: 26rpx;
  color: $uni-color-primary;
  padding: 20rpx 26rpx;
  background-color: #f6f6f6;
  border-radius: 4px;
  display: inline-block;
  margin: 0 16rpx 16rpx 0;
  line-height: 1;
  &.active {
    background-color: $uni-color-theme;
    font-weight: 600;
  }
}
</style>
