import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from 'vue-router';

import { ServerIcon } from '@/entity/Server';

import { IconPack } from './app/IconPack';

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

const routes: RouteRecordRaw[] = [
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
  {
    path: '/print',
    name: 'print',
    component: () => import('@/pages/print/PagePrint.vue'),
  },
  {
    path: '/error/404',
    name: 'error/404',
    component: () => import('@/pages/error/Page404.vue'),
  },

  { path: '/', redirect: { path: '/home' } },
  { path: '/:pathMatch(.*)*', redirect: { path: '/error/404' } },
];

export const router = createRouter({ history: createWebHistory(), routes });
