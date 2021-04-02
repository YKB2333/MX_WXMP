<template>
  <view>
    <lb-picker 
      ref="picker" 
      :list="list" 
      mode="multiSelector" 
      :level="3"
      @confirm="onConfirm"
      @cancel="onCancel"
      confirm-color="#1989fa"
      v-model="code"
    />
  </view>
</template>

<script>
import LbPicker from '_c/lb-picker'
// import { district } from '@/static/js/district.js'
import { deepClone } from '@/utils'
import { getOmsAddress } from '@/api/order';
export default {
  name: "AddressPicker",
  components: { LbPicker },
  props: {
    value: {
      type: Array,
      // default: () => ['440000', '440100', '440183']
    }
  },
  created(){
    this.init();
  },
  data() {
    return {
      // list: district,
      list:[]
    }
  },
  methods: {
    init() {
      getOmsAddress().then( res => {
        let data = JSON.parse(res.data);
        this.list = data;
      });
    },
    show() {
      this.$refs['picker'].show()
    },
    hide() {
      this.$refs['picker'].hide()
    },
    onConfirm(data) {
      console.log('onConfirm', data)
      let copy = deepClone(data)
      let code = copy.value
      let value = copy.item.map(ele => ele.label)
      // code: (3) ["110000", "110100", "110101"]
      // value: (3) ["北京市", "北京市", "东城区"]
      this.$emit('change', { code: code, value: value })
    },
    onCancel() {
      console.log('取消')
    },
    onChange(value) {
      console.log('onChange', value)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>