import VueRouter, { RouteConfig } from 'vue-router';

import PageLogin from '@/pages/login/PageLogin.vue';

import { IconPack } from './app/IconPack';
import { iconServer } from './host/Server';

export interface AppRoute {
  key: string;
  name?: string;
  title: string;
  icon: IconPack;
  children?: { key: string; title: string; icon: IconPack }[];
  groups?: { key: string; title: string; children: AppRoute[] }[];
  userPermissions?: string[];
}

export const HOME_ROUTE: AppRoute = {
  key: 'home',
  name: 'Home',
  title: 'Home',
  icon: new IconPack(iconServer('home-FFFFFF'), iconServer('home-000000')),
};
export const PRODUCT_ROUTE = {
  key: 'product',
  title: 'Search',
  icon: new IconPack(
    iconServer('magnifying-glass'),
    iconServer('magnifying-glass'),
  ),
};
export const PRINT_ROUTE: AppRoute = {
  key: 'print',
  title: 'Printing',
  icon: new IconPack(iconServer('paper-FFFFFF'), iconServer('paper-000000')),
};

export const PROFILE_ROUTE: AppRoute = {
  key: 'profile',
  title: 'Your Profile',
  icon: new IconPack(
    iconServer('profile-FFFFFF'),
    iconServer('profile-000000'),
  ),
};
export const CUSTOMER_ROUTE: AppRoute = {
  key: 'customer',
  title: 'Customers',
  icon: new IconPack(
    iconServer('customers-FFFFFF'),
    iconServer('customers-000000'),
  ),
  userPermissions: ['admin', 'staff'],
};
export const SERVICE_ROUTE: AppRoute = {
  key: 'service',
  title: 'Services',
  icon: new IconPack(
    iconServer('service-FFFFFF'),
    iconServer('service-000000'),
  ),
  userPermissions: ['admin', 'staff'],
};
export const ORDER_ROUTE: AppRoute = {
  key: 'order',
  name: 'ViewOrder',
  title: 'Orders',
  icon: new IconPack(iconServer('order-FFFFFF'), iconServer('order-000000')),
  userPermissions: ['admin', 'staff'],
};
export const USERS_ROUTE: AppRoute = {
  key: 'users',
  title: 'Other Users',
  icon: new IconPack(iconServer('users-FFFFFF'), iconServer('users-000000')),
  userPermissions: ['admin'],
};
export const DATABASE_ROUTE: AppRoute = {
  key: 'database',
  title: 'Database',
  icon: new IconPack(
    iconServer('database-FFFFFF'),
    iconServer('database-000000'),
  ),
  userPermissions: ['admin'],
};
export const SETTING_ROUTE: AppRoute = {
  key: 'setting',
  title: 'Settings',
  icon: new IconPack(
    iconServer('setting-FFFFFF'),
    iconServer('setting-000000'),
  ),
  userPermissions: ['admin'],
};
export const MANAGE_ROUTE: AppRoute = {
  key: 'manage',
  name: 'Manage',
  title: 'Manage',
  icon: new IconPack(iconServer('manage-FFFFFF'), iconServer('manage-000000')),

  children: [PROFILE_ROUTE],
  groups: [
    {
      key: 'record',
      title: 'Record',
      children: [CUSTOMER_ROUTE, SERVICE_ROUTE, ORDER_ROUTE],
    },
    {
      key: 'system',
      title: 'System',
      children: [USERS_ROUTE, DATABASE_ROUTE, SETTING_ROUTE],
    },
  ],
  userPermissions: ['admin', 'staff'],
};

const routes: RouteConfig[] = [
  {
    path: '/item/id/:id',
    beforeEnter(to, from, next) {
      next({ path: '/product/view', query: { productId: to.params.id } });
    },
  },
  {
    path: '/product/id/:id',
    beforeEnter(to, from, next) {
      next({ path: '/product/view', query: { productId: to.params.id } });
    },
  },

  // product combo
  {
    path: '/product/combo',
    redirect: '/product/browse',
    children: [{ path: '*', redirect: '/product/browse' }],
  },

  // product
  {
    path: '/product',
    name: 'product',
    component: () => import('@/pages/product/PageProduct.vue'),
    children: [
      {
        path: 'browse',
        redirect: '/product',
        children: [{ path: ':category', redirect: '/product' }],
      },
    ],
  },
  {
    path: '/product/view',
    component: () => import('@/pages/product/PageProductView.vue'),
  },
  {
    path: '/product/export',
    component: () => import('@/pages/product/PageProductExport.vue'),
  },

  // manage
  {
    path: '/manage',
    beforeEnter(to, from, next) {
      let { query } = to;
      let { view } = query;

      if (!view) {
        view = 'service';
        delete query.view;
      }

      try {
        next({ path: `/manage/${view}`, query });
      } catch (error) {}
    },
  },
  {
    path: '/manage/product',
    beforeEnter(to, from, next) {
      let { query } = to;
      if (query) {
        let { item } = query;

        if (typeof item === 'string') {
          query.productId = item;
          delete query.item;
        }
      }

      try {
        next({ path: '/product/browse', query });
      } catch (error) {}
    },
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/pages/manage/PageManage.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('@/pages/profile/PageProfile.vue'),
      },
      {
        path: 'customer',
        component: () => import('@/pages/customer/PageCustomer.vue'),
      },
      {
        path: 'service',
        component: () => import('@/pages/service/PageService.vue'),
      },
      {
        path: 'order',
        component: () => import('@/pages/order/PageOrder.vue'),
      },
      {
        path: 'users',
        component: () => import('@/pages/users/PageUsers.vue'),
      },
      {
        path: 'database',
        component: () => import('@/pages/database/PageDatabase.vue'),
      },
      {
        path: 'setting',
        component: () => import('@/pages/setting/PageSetting.vue'),
      },
    ],
  },

  // home
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home/PageHome.vue'),
    beforeEnter(to, from, next) {
      const { hash } = to;

      let legacyPath = to.redirectedFrom ?? '';
      if (legacyPath.startsWith('/#')) {
        legacyPath = hash.substring(2);

        if (!hash.startsWith('/')) {
          legacyPath = `/${legacyPath}`;
        }
        if (legacyPath.length) {
          next({ path: legacyPath, query: to.query });
        }
        return;
      }

      next();
    },
  },
  // login
  {
    path: '/login',
    name: 'login',
    component: PageLogin,
  },
  // print
  {
    path: '/print',
    name: 'print',
    component: () => import('@/pages/print/PagePrint.vue'),
  },
  // error
  {
    path: '/error/404',
    name: 'error/404',
    component: () => import('@/pages/error/Page404.vue'),
  },

  { path: '/', redirect: { path: '/home' } },
  { path: '*', redirect: { path: '/error/404' } },
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});
