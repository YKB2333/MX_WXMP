export const jumpLink = {
  methods: {
    // 点击运营图
    $_onBannerClick(item) {
      console.log(item)
      console.log(item.busType)
      // busId	string	资源Id
      // bannerImgUrl	string	banner图片地址
      // type 资源跳转类型（0:不跳转; 1:商品; 2:类目; 3:限时购; 4:商品专题; 5:立购商品; 6:邀请新用户; 7:文章; 8:自定义链接; 9:自定义专题）
      let type = (item.busType || item.busType==0) ? item.busType : item.type;
      this.$_selectPath(type, item)
    },
    // 选择路径
    // type  资源跳转类型（0:不跳转; 1:商品; 2:类目; 3:限时购; 4:商品专题; 5:立购商品; 6:邀请新用户; 7:文章; 8:自定义链接; 9:自定义专题）
    // item  包含跳转所需携带的参数(busId title)
    $_selectPath(type, item) {
      if(type == 0) return;
      if (type == 1 && item.busId) { // 商品详情
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/spu/index?spuId=${item.busId}`
        })
        // #endif
        // #ifdef H5
        this.$flutter({ method: 'TO_GOODS_DETAIL', data: { spuId: item.busId } })
        // #endif
      } else if (type == 2 && item.busId) { // 类目
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/goods-list/index?enableSearch=false&type=banner&parentCategoryId=${item.busId}`
        })
        // #endif
        // #ifdef H5
        this.$flutter({ method: 'TO_CATEGORY', data: { id: item.busId, title: item.title } })
        // #endif
      } else if ((type == 3 || type == 4) && item.busId) { // 限时限价活动商品列表
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/activity/Goods?activityId=${item.busId}&type=${type}`
        })
        // #endif
        // #ifdef H5
        if (type == 3) {
          this.$flutter({ method: 'ACTIVITY_GOODS', data: { id: item.busId } })  // 限时购
        } else {
          this.$flutter({ method: 'SPECIAL_GOODS', data: { id: item.busId } })  // 商品专题
        }
        // #endif
      } else if (type == 5 && item.busId) { // 立购商品
        uni.showToast({
          title: '更多功能敬请期待',
          duration: 2000,
          icon: 'none'
        })
      } else if (type == 6 && item.busId) { // 邀请新用户
        uni.showToast({
          title: '更多功能敬请期待',
          duration: 2000,
          icon: 'none'
        })

        // #ifdef H5
        this.$flutter({ method: 'TO_TASK', data: { id: item.busId } })
        // #endif
      } else if (type == 7 && item.busId) { // 文章
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pages/article/index?id=${item.busId}`
        })
        // #endif
        // #ifdef H5
        this.$flutter({ method: 'TO_ARTICLE', data: { id: item.busId } })
        // #endif
      } else if (type == 8 && item.busId) { // 自定义链接）
        uni.showToast({
          title: '更多功能敬请期待',
          duration: 2000,
          icon: 'none'
        })
      } else if (type == 9 && item.busId) { // 自定义专题
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/activity/Special?activityId=${item.busId}`
        })
        // #endif
        console.log({method:'TO_SPECIAL',data:{id:item.busId,title:item.title || item.articleName}})
        // #ifdef H5
        this.$flutter({method:'TO_SPECIAL',data:{id:item.busId,title:item.title || item.articleName}})
        // #endif
      } else {
        // #ifdef MP-WEIXIN
        uni.showToast({
          title: '更多功能敬请期待',
          duration: 2000,
          icon: 'none'
        })
        // #endif
      }
    },
  }
}
