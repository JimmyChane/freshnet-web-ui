import Vue from "vue";
import App from "./app/App.vue";
import router from "@/routers/index";
import store from "@/stores/index";
import Mixin from "@/mixins/index";
import HostApi from "./host/HostApi";

Vue.config.productionTip = false;
Vue.prototype.host = HostApi;
Vue.mixin(Mixin);

new Vue({
  router,
  store: store.store,
  render: (h) => h(App),
}).$mount("#app");
