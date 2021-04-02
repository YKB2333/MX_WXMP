<template>
   <view style="background:white" @tap="link()">
      <view class=" row space-between wrap border-box" style="padding:4%">
        <view class="wpct48 like_son mb48 hidden"  v-for="(item,index) in list" :key="index" >
          <image :src="item.img" class="wpct100"  :style="'height:'+likeHeight+'px'" mode="scaleToFill"></image>
          <text>{{ item.name }}</text>
          <text>¥ {{ item.money }}</text>
        </view>
      </view>
    </view>

</template>

<script>
export default {
  name: "BaseGoodsList",
  props: {
    list: { 
     type: Array,
      default: () => {[]}
    },
  },
  data() {
    return {
      likeHeight:'', // 猜你喜欢高度
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.$nextTick(()=>{
      this.getLikeHeight()
    })
  },
  methods: {
    getLikeHeight(){
      const query = uni.createSelectorQuery().in(this);
      query.select(".like_son").boundingClientRect(data => {
          this.likeHeight = data.width
      }).exec();
    },
    link(){
      this.$emit('link')
    }
  }
};
</script>

<style lang="scss" scoped>
.like_son{
  text{
    display: block;
    text-align: center;
  }
  text:nth-child(2){
    font-size: 14px;
    margin-top: 24rpx;
  }
  text:nth-child(3){
    margin-top: 12rpx;
    font-size: 26rpx;
  }
}

</style>
