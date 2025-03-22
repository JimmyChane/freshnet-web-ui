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

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home-v2/Home-v2.page.vue'),
  },

  { path: '/', redirect: { path: '/home' } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
];

export const router = createRouter({ history: createWebHistory(), routes });
