import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from 'vue-router';

import { ServerIcon } from '@/entity/Server';

import { IconPack } from './app/IconPack';

import LoginPage from '@/pages/login/PageLogin.vue';

export interface AppRouteOption {
  readonly key: string;
  readonly name?: string;
  readonly title: string;
  readonly icon: IconPack;
  readonly children?: {
    readonly key: string;
    readonly title: string;
    readonly icon: IconPack;
  }[];
  readonly groups?: {
    readonly key: string;
    readonly title: string;
    readonly children: AppRouteOption[];
  }[];
  readonly userPermissions?: string[];
}
export class AppRoute {
  readonly key: string;
  readonly name?: string;
  readonly title: string;
  readonly icon: IconPack;
  readonly children?: {
    readonly key: string;
    readonly title: string;
    readonly icon: IconPack;
  }[];
  readonly groups?: {
    readonly key: string;
    readonly title: string;
    readonly children: AppRouteOption[];
  }[];
  readonly userPermissions?: string[];

  constructor(option: AppRouteOption) {
    this.key = option.key;
    this.name = option.name;
    this.title = option.title;
    this.icon = option.icon;
    this.children = option.children;
    this.groups = option.groups;
    this.userPermissions = option.userPermissions;
  }
}

export const HOME_ROUTE = new AppRoute({
  key: 'home',
  name: 'Home',
  title: 'Home',
  icon: new IconPack(
    new ServerIcon('home-FFFFFF'),
    new ServerIcon('home-000000'),
  ),
});
export const PRODUCT_ROUTE = new AppRoute({
  key: 'product',
  title: 'Search',
  icon: new IconPack(
    new ServerIcon('magnifying-glass'),
    new ServerIcon('magnifying-glass'),
  ),
});
export const PRINT_ROUTE = new AppRoute({
  key: 'print',
  title: 'Printing',
  icon: new IconPack(
    new ServerIcon('paper-FFFFFF'),
    new ServerIcon('paper-000000'),
  ),
});
export const PS2_ROUTE = new AppRoute({
  key: 'ps2',
  name: 'PagePs2',
  title: 'PS2 Disc',
  icon: new IconPack(
    new ServerIcon('playstation-FFFFFF'),
    new ServerIcon('playstation-000000'),
  ),
});

export const PROFILE_ROUTE = new AppRoute({
  key: 'profile',
  title: 'Your Profile',
  icon: new IconPack(
    new ServerIcon('profile-FFFFFF'),
    new ServerIcon('profile-000000'),
  ),
});
export const CUSTOMER_ROUTE = new AppRoute({
  key: 'customer',
  title: 'Customers',
  icon: new IconPack(
    new ServerIcon('customers-FFFFFF'),
    new ServerIcon('customers-000000'),
  ),
  userPermissions: ['admin', 'staff'],
});
export const SERVICE_ROUTE = new AppRoute({
  key: 'service',
  title: 'Services',
  icon: new IconPack(
    new ServerIcon('service-FFFFFF'),
    new ServerIcon('service-000000'),
  ),
  userPermissions: ['admin', 'staff'],
});
export const ORDER_ROUTE = new AppRoute({
  key: 'order',
  name: 'ViewOrder',
  title: 'Orders',
  icon: new IconPack(
    new ServerIcon('order-FFFFFF'),
    new ServerIcon('order-000000'),
  ),
  userPermissions: ['admin', 'staff'],
});
export const USERS_ROUTE = new AppRoute({
  key: 'users',
  title: 'Other Users',
  icon: new IconPack(
    new ServerIcon('users-FFFFFF'),
    new ServerIcon('users-000000'),
  ),
  userPermissions: ['admin'],
});
export const DATABASE_ROUTE = new AppRoute({
  key: 'database',
  title: 'Database',
  icon: new IconPack(
    new ServerIcon('database-FFFFFF'),
    new ServerIcon('database-000000'),
  ),
  userPermissions: ['admin'],
});
export const SETTING_ROUTE = new AppRoute({
  key: 'setting',
  title: 'Settings',
  icon: new IconPack(
    new ServerIcon('setting-FFFFFF'),
    new ServerIcon('setting-000000'),
  ),
  userPermissions: ['admin'],
});
export const MANAGE_ROUTE = new AppRoute({
  key: 'manage',
  name: 'Manage',
  title: 'Manage',
  icon: new IconPack(
    new ServerIcon('manage-FFFFFF'),
    new ServerIcon('manage-000000'),
  ),

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
});

const routes: RouteRecordRaw[] = [
  {
    path: '/item/id/:id',
    redirect(to) {
      return { path: '/product/view', query: { productId: to.params.id } };
    },
  },
  {
    path: '/product/id/:id',
    redirect(to) {
      return { path: '/product/view', query: { productId: to.params.id } };
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
    redirect(to) {
      let { query } = to;
      let { view } = query;

      if (!view) {
        view = 'service';
        delete query.view;
      }

      try {
        return { path: `/manage/${view}`, query };
      } catch (error) {
        return to;
      }
    },
  },
  {
    path: '/manage/product',
    redirect(to) {
      let { query } = to;
      if (query) {
        let { item } = query;

        if (typeof item === 'string') {
          query.productId = item;
          delete query.item;
        }
      }

      try {
        return { path: '/product/browse', query };
      } catch (error) {
        return to;
      }
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
      { path: 'order', component: () => import('@/pages/order/PageOrder.vue') },
      { path: 'users', component: () => import('@/pages/users/PageUsers.vue') },
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

      let legacyPath = to.redirectedFrom?.toString() ?? '';
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
  { path: '/login', name: 'login', component: LoginPage },
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
  { path: '/:pathMatch(.*)*', redirect: { path: '/error/404' } },
];

export const router = createRouter({ history: createWebHistory(), routes });
