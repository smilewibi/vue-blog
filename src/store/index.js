import Vue from 'vue';
import Vuex from 'vuex';
import alert from './alert';
import dialog from './dialog';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alert,
    dialog
  },
});
