import { createRouter, createWebHistory } from 'vue-router';

import { IconPackModel } from './entity/IconPack.model';
import { ServerIconModel } from './entity/ServerIcon.model';

export interface AppRouteOption {
  readonly key: string;
  readonly name?: string;
  readonly title: string;
  readonly icon: IconPackModel;
}
export class AppRouteModel {
  readonly key: string;
  readonly name?: string;
  readonly title: string;
  readonly icon: IconPackModel;

  constructor(option: AppRouteOption) {
    this.key = option.key;
    this.name = option.name;
    this.title = option.title;
    this.icon = option.icon;
  }
}

export const HOME_ROUTE = new AppRouteModel({
  key: 'home',
  name: 'Home',
  title: 'Home',
  icon: new IconPackModel(
    new ServerIconModel('home-FFFFFF'),
    new ServerIconModel('home-000000'),
  ),
});

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home-v2/Home-v2.page.vue'),
    },

    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
});
