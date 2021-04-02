<template>
  <div class="row center-y">
    <view class="plr20 ptb10">
      <image v-show="!disabledMinus" :src="IMAGE.STEPPER_ICON_MINUS" style="width:20px;height:20px;" @tap="onClickMinus" />
      <image v-show="disabledMinus" :src="IMAGE.STEPPER_ICON_MINUS_DISABLED" style="width:20px;height:20px;" />
    </view>
    <view class="fs-sm" style="background:rgba(157,160,164,0.1);border-radius:4px;padding:8px 10px;">{{ value }}</view>
    <view class="plr20 ptb10">
      <image v-show="!disabledPlus" :src="IMAGE.STEPPER_ICON_PLUS" style="width:20px;height:20px;" @tap="onClickPlus" />
      <image v-show="disabledPlus" :src="IMAGE.STEPPER_ICON_PLUS_DISABLED" style="width:20px;height:20px;" />
    </view>
  </div>
</template>

<script>
import { STEPPER_ICON_MINUS, STEPPER_ICON_MINUS_DISABLED, STEPPER_ICON_PLUS, STEPPER_ICON_PLUS_DISABLED } from '@/imageConfig'
 
export default {
  name: 'MyStepper',
  props: {
    value: {
      type: Number
    },
    max: {
      type: Number
    },
    min: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      IMAGE: {
        STEPPER_ICON_MINUS,
        STEPPER_ICON_MINUS_DISABLED,
        STEPPER_ICON_PLUS,
        STEPPER_ICON_PLUS_DISABLED
      },
      copyValue: 0
    }
  },
  computed: {
    disabledMinus() {
      // return this.value < (this.min + this.step)
      return this.value <= this.min
    },
    disabledPlus() {
      // return (this.value + this.step) > this.max
      return this.value >= this.max
    }
  },
  created() {
    
  },
  methods: {
    onClickMinus() {
      // console.log('-')
      if (this.disabledMinus) return
      if (this.copyValue - this.step < this.min) {
        this.copyValue = this.min
      } else {
        this.copyValue -= this.step
      }
      this.$emit("iconChange")
      this.$emit('input', this.copyValue)
    },
    onClickPlus() {
      if (this.disabledPlus) return
      // console.log('+')
      if (this.copyValue + this.step > this.max) {
        this.copyValue = this.max
      } else {
        this.copyValue += this.step
      }
      this.$emit('input', this.copyValue)
      this.$emit("iconChange")
    },
  },
  watch: {
    value(val) {
      this.copyValue = val
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
