import Vue from "vue";
import VueRouter from "vue-router";
import PageHome from "@/pages/home/PageHome";
import PagePrint from "@/pages/print/PagePrint.vue";
import PageLogin from "@/pages/login/PageLogin";
import Page404 from "@/pages/error/Page404.vue";
import PageProduct from "@/pages/product/PageProduct.vue";
import PageProductView from "@/pages/product/PageProductView.vue";
import PageProductExport from "@/pages/product/PageProductExport.vue";
import PageManage from "@/pages/manage/PageManage";
import PageCustomer from "@/pages/customer/PageCustomer.vue";
import PageService from "@/pages/service/PageService.vue";
import PageOrder from "@/pages/order/PageOrder.vue";
import PageProfile from "@/pages/profile/PageProfile.vue";
import PageUsers from "@/pages/users/PageUsers.vue";
import PageDatabase from "@/pages/database/PageDatabase.vue";
import PageSetting from "@/pages/setting/PageSetting.vue";

Vue.use(VueRouter);

const routes = [
  // product id
  {
    path: "/item/id/:id",
    beforeEnter(to, from, next) {
      next({ path: "/product/view", query: { productId: to.params.id } });
    },
  },
  {
    path: "/product/id/:id",
    beforeEnter(to, from, next) {
      next({ path: "/product/view", query: { productId: to.params.id } });
    },
  },

  // product combo
  {
    path: "/product/combo",
    redirect: "/product/browse",
    children: [{ path: "*", redirect: "/product/browse" }],
  },

  // product
  {
    path: "/product",
    name: "product",
    component: PageProduct,
    children: [
      {
        path: "browse",
        redirect: "/product",
        children: [{ path: ":category", redirect: "/product" }],
      },
    ],
  },
  { path: "/product/view", component: PageProductView },
  { path: "/product/export", component: PageProductExport },

  // manage
  {
    path: "/manage",
    beforeEnter(to, from, next) {
      let { query } = to;
      let { view } = query;

      if (!view) {
        view = "service";
        delete query.view;
      }

      try {
        next({ path: `/manage/${view}`, query });
      } catch (error) {}
    },
  },
  {
    path: "/manage/product",
    beforeEnter(to, from, next) {
      let { query } = to;
      if (query) {
        let { item } = query;

        if (typeof item === "string") {
          query.productId = item;
          delete query.item;
        }
      }

      try {
        next({ path: "/product/browse", query });
      } catch (error) {}
    },
  },
  {
    path: `/manage`,
    name: `manage`,
    component: PageManage,
    children: [
      { path: "profile", component: PageProfile },
      { path: "customer", component: PageCustomer },
      { path: "service", component: PageService },
      { path: "order", component: PageOrder },
      { path: "users", component: PageUsers },
      { path: "database", component: PageDatabase },
      { path: "setting", component: PageSetting },
    ],
  },

  // home
  { path: "/home", name: "home", component: PageHome },
  // login
  { path: "/login", name: "login", component: PageLogin },
  // print
  { path: "/print", name: "print", component: PagePrint },
  // error
  { path: "/error/404", name: "error/404", component: Page404 },

  { path: "/", redirect: { path: "/home" } },
  { path: "*", redirect: { path: "/error/404" } },
];

export default new VueRouter({ mode: "hash", routes });
