import Vue from "vue";
import App from "./app/App.vue";
import router from "@/routers/index";
import store from "@/stores/index";
import Mixin from "@/mixins/index";
import Server from "./host/Server";

Vue.config.productionTip = false;
Vue.prototype.host = Server;
Vue.mixin(Mixin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
