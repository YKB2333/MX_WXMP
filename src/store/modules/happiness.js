
export default {
    state: {
        skuList: []
    },
    mutations: {
        //设置购物车默认选中
        SET_FROM_SKU_ID(state, skuId) {
            state.skuList.push(skuId)
        },
        //清空购物车默认选中
        CLEAR_FROM_SKU_ID(state) {
            state.skuList = [];
        },
    },
    actions: {}
}