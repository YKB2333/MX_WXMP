<template>
  <view class="min-h-full bg-primary">
    <view class="plr30 pt30">
      <view v-for="(item, i) in list" :key="i" class="bg-white radius plr20 ptb30 mb20">
        <view class="row space-between hairline-bottom mb30 pb30">
          <view class="col flex-end">
            <view>
              <text class="fw600 fs-sm">¥<text style="font-size:34rpx;">{{ item.amount | formatMoney }}</text></text>
              <text class="color-gray fs-mini">（含税费 ¥{{ item.tax | formatMoney }}）</text>
            </view>
          </view>
          <view>
            <view class="fs-sm color-blue text-right">提现至</view>
            <view class="fs-sm color-blue">银行卡(尾号{{ item.bankCardNo.substr(item.bankCardNo.length - 4) }})</view>
          </view>
        </view>
        <view class="row space-between">
          <view>
            <view class="color-gray fs-sm">{{ item.createTime.split(' ')[0].replace(/\-/g, '.') }}</view>
            <view class="color-gray text-center" style="font-size:22rpx;">申请时间</view>
          </view>
          <view class="flex-1 plr20 relative">
            <text class="color-gray fs-sm h40" style="display:block;overflow:hidden;opacity:0.3;">------------------------------------------------------------------------</text>
            <!-- 0未处理,1处理成功,2处理失败 -->
            <view class="withdrawl-status-btn ing" v-if="item.status === 0">处理中</view>
            <view class="withdrawl-status-btn success" v-else-if="item.status === 1">处理成功</view>
            <block v-else-if="item.status === 2">
              <view class="withdrawl-status-btn fail">提现失败</view>
              <view class="fs-mini color-red text-center mt10">{{ item.resInfo }}</view>
            </block>
          </view>
          <view>
            <!-- <view class="color-gray fs-sm">{{ item.updateTime.split(' ')[0] }}</view> -->
            <view class="color-gray fs-sm">{{ item.createTime | withdrawDealDayText(withdrawDealDay) }}</view>
            <view class="color-gray text-center" style="font-size:22rpx;">审核时间</view>
          </view>
        </view>
      </view>
    </view>
    <view class="color-gray fs-mini text-center pb20">
      <text v-if="isEmptyList">提现记录为空</text>
      <text v-else-if="loadMore.loading">更多数据加载中...</text>
      <text v-else-if="loadMore.finished">已经滑到页面底部啦</text>
      <text v-else-if="loadMore.error" @click="loadList">加载失败，点击重试</text>
    </view>
  </view>
</template>

<script>
import { getUserWithdrawRecords } from '@/api/member'
import { getSysdictQuery } from "@/api/tools"

export default {
  name: 'WithdrawalRecord',
  components: {},
  data() {
    return {
      list: [],
      query: {
        pageSize: 20,
        pageNo: 0
      },
      isEmptyList: false,
      loadMore: {
        loading: false,
        finished: false,
        error: false
      },
      withdrawDealDay: 0
    }
  },
  computed: {},
  onLoad() {
    this.init()
    getSysdictQuery({ dictType: "SYSTEM_CONFIG", dictKey: "WITHDRAW_AUDIT_DAY" }).then(res => {
      console.log('提现审核时间', res.data)
      this.withdrawDealDay = Number(res.data)
    })
  },
  filters: {
    withdrawDealDayText(createTime, withdrawDealDay) {
      if (withdrawDealDay === 0) return '-'
      try {
        let timestap = new Date(createTime)
        let year = timestap.getFullYear()
        let month = timestap.getMonth() + 1
        let day = timestap.getDate()
        // 如果创建时间的日期大于20号，显示下个月的20号，否则显示当月20号
        if (day > withdrawDealDay) {
          if (month === 12) {
            return `${year + 1}.01.${withdrawDealDay}`
          } else {
            return `${year}.${month+1 < 10 ? `0${month+1}` : month+1}.${withdrawDealDay}`
          }
        } else {
          return `${year}.${month < 10 ? `0${month}` : month}.${withdrawDealDay}`
        }
      } catch (error) {
        console.log(error)
        return '-'
      }
    }
  },
  methods: {
    init() {
      this.isEmptyList = false
      this.loadMore.loading = false
      this.loadMore.finished = false
      this.loadMore.error = false
      this.query.pageNo = 0
      this.list = []
      this.loadList()
    },
    loadList() {
      if (this.loadMore.loading || this.loadMore.finished || this.loadMore.error) return
      this.loadMore.loading = true
      this.query.pageNo += 1
      getUserWithdrawRecords(this.query).then(res => {
        // console.log(res.data)
        if (this.query.pageNo === 1 && res.data.list.length === 0) {
          this.isEmptyList = true
        } else {
          this.isEmptyList = false
        }
        if (!res.data.hasNextPage) {
          this.loadMore.finished = true
        }
        this.list = this.list.concat(res.data.list)
        this.loadMore.error = false
      }).catch(err => {
        this.loadMore.error = true
        this.query.pageNo -= 1
      }).finally(() => {
        this.loadMore.loading = false
      })
    }
  },
  onReachBottom() {
    // console.log('滚动加载')
    this.loadList()
  }
}
</script>

<style lang="scss" scoped>
.withdrawl-status-btn{
  display: inline-block;
  font-size: 24rpx;
  border-radius: 30px;
  width: 158rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  &.ing{
    background-color: #FFF6CE;
    color: #FFD100;
  }
  &.success{
    background-color: #C9EDCA;
    color: #278E29;
  }
  &.fail{
    background-color: #E7E7E7;
    color: #9DA0A4;
  }
}
</style>
