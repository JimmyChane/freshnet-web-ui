import Vue from 'vue';
import VueRouter from 'vue-router';

import { PiniaVuePlugin, createPinia } from 'pinia';

import { router } from '@/router';

import App from './app/App.vue';

Vue.use(VueRouter);
Vue.use(PiniaVuePlugin);

const pinia = createPinia();

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
