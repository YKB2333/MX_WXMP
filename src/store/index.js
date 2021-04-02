import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import user from './modules/user';
import app from './modules/app';
import happiness from './modules/happiness';
import getters from './getters';

// 导出 store 对象
export default new Vuex.Store({
  getters,
  modules: {
    user,
    app,
    happiness
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
});
