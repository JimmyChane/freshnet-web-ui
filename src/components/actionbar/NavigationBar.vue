<script setup lang="ts">
import { computed } from 'vue';

import IconHamburgerMenuDark from '@/assets/icon/hamburgerMenu-000000.svg';
import IconHamburgerMenuLight from '@/assets/icon/hamburgerMenu-FFFFFF.svg';
import { useAppStore } from '@/stores/app.store';

import Actionbar from './Actionbar.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    leftMenus?: any[];
    rightMenus?: any[];
    iconTheme?: string;
  }>(),
  { title: '', leftMenus: () => [], rightMenus: () => [], iconTheme: 'black' },
);

const moreLeftMenus = computed(() => {
  if (!useAppStore().navigation.isDrawer()) return props.leftMenus;

  const hamburgerMenuIcon =
    props.iconTheme === 'white'
      ? IconHamburgerMenuLight
      : IconHamburgerMenuDark;
  return [
    {
      key: 'hamburgerMenu',
      title: 'Hamburger Menu',
      icon: hamburgerMenuIcon,
      click: () => useAppStore().navigation.openNavigationDrawer(),
    },
    ...props.leftMenus,
  ];
});
</script>

<template>
  <Actionbar :title="title" :leftMenus="moreLeftMenus" :rightMenus="rightMenus">
    <slot></slot>
  </Actionbar>
</template>
