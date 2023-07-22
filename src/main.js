import Vue from "vue";
import Router from "@/routers/index.js";
import Stores from "@/stores/index.js";
import Mixin from "@/mixins/index.js";
import HostApi from "./host/HostApi.js";
import App from "./app/App.vue";

Vue.config.productionTip = false;
Vue.prototype.host = HostApi;
Vue.mixin(Mixin);

new Vue({
  host: HostApi,
  router: Router,
  store: Stores.store,

  computed: {
    console: (c) => c.app.console,
    window: (c) => c.app.window,
    appLayout: (c) => c.app.appLayout,
    navigation: (c) => c.app.navigation,

    app: (c) => (c.$children.length ? c.$children[0] : null),
    user: (c) => c.app.user,
    pages: (c) => c.app.pages,
    paths: (c) => c.app.paths,
    currentPaths: (c) => c.app.currentPaths,
    currentPageKey: (c) => c.app.currentPageKey,
    currentViewKey: (c) => c.app.currentViewKey,
  },
  methods: {
    copyText(text) {
      return this.app.copyText(text);
    },
    openLink(link, target = "_blank") {
      return this.app.openLink(link, target);
    },
    pushDownload(filename, content) {
      return this.app.pushDownload(filename, content);
    },
    print(element) {
      return this.app.print(element);
    },

    // routes
    nextQuery(param = {}) {
      return this.app.nextQuery(param);
    },
    replaceQuery(param = {}) {
      return this.app.replaceQuery(param);
    },
    setQuery(param = {}, isNext = true) {
      return this.app.setQuery(param, isNext);
    },
  },

  render: (createElement) => createElement(App),
}).$mount("#app");
