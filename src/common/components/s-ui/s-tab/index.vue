<template>
  <div class="s-tab-wrap">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 's-tab',
  inject: ['$tabs'],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 's-tab-id-' + Math.random().toString(36).substr(2)
    };
  },
  mounted () {
    const { id, title } = this;
    this.$tabs.navList = this.$tabs.navList.concat({ id, title });
  },
  beforeDestroy () {
    this.$tabs.navList = this.$tabs.navList.filter(item => item.id !== this.id);
  }
};
</script>

<style lang="scss">
.s-tab-wrap {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}
</style>
