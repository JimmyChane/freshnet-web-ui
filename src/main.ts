import Vue from 'vue';

import { Mixin } from '@/mixins/index';
import { router } from '@/routers/index';
import { store } from '@/stores/index';

import App from './app/App.vue';

Vue.config.productionTip = false;
Vue.mixin(Mixin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
