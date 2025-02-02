import Vue from 'vue';
import VueRouter from 'vue-router';

import { Mixin } from '@/mixin';
import { router } from '@/router';
import { store } from '@/stores/index';

import App from './app/App.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;
Vue.mixin(Mixin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
