import Vue from 'vue';
import VueRouter from 'vue-router';

import { PiniaVuePlugin, createPinia } from 'pinia';

import { router } from '@/router';
import { store } from '@/stores/index';

import App from './app/App.vue';

Vue.use(VueRouter);
Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

const pinia = createPinia();

new Vue({
  router,
  store,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
