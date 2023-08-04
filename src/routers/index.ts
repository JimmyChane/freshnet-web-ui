import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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
    component: () => import("@/pages/product/PageProduct.vue"),
    children: [
      {
        path: "browse",
        redirect: "/product",
        children: [{ path: ":category", redirect: "/product" }],
      },
    ],
  },
  {
    path: "/product/view",
    component: () => import("@/pages/product/PageProductView.vue"),
  },
  {
    path: "/product/export",
    component: () => import("@/pages/product/PageProductExport.vue"),
  },

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
    path: "/manage",
    name: "manage",
    component: () => import("@/pages/manage/PageManage.vue"),
    children: [
      {
        path: "profile",
        component: () => import("@/pages/profile/PageProfile.vue"),
      },
      {
        path: "customer",
        component: () => import("@/pages/customer/PageCustomer.vue"),
      },
      {
        path: "service",
        component: () => import("@/pages/service/PageService.vue"),
      },
      { path: "order", component: () => import("@/pages/order/PageOrder.vue") },
      { path: "users", component: () => import("@/pages/users/PageUsers.vue") },
      {
        path: "database",
        component: () => import("@/pages/database/PageDatabase.vue"),
      },
      {
        path: "setting",
        component: () => import("@/pages/setting/PageSetting.vue"),
      },
    ],
  },

  // home
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/PageHome.vue"),
  },
  // login
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/PageLogin.vue"),
  },
  // print
  {
    path: "/print",
    name: "print",
    component: () => import("@/pages/print/PagePrint.vue"),
  },
  // error
  {
    path: "/error/404",
    name: "error/404",
    component: () => import("@/pages/error/Page404.vue"),
  },

  { path: "/", redirect: { path: "/home" } },
  { path: "*", redirect: { path: "/error/404" } },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
