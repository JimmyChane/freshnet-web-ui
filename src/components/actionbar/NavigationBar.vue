<script>
import IconHamburgerMenuDark from '@/assets/icon/hamburgerMenu-000000.svg';
import IconHamburgerMenuLight from '@/assets/icon/hamburgerMenu-FFFFFF.svg';

import Actionbar from './Actionbar.vue';

export default {
  components: { Actionbar },
  props: {
    title: { type: String, default: '' },
    leftMenus: { type: Array, default: () => [] },
    rightMenus: { type: Array, default: () => [] },
    iconTheme: { type: String, default: 'black' },
  },
  computed: {
    moreLeftMenus: (c) => {
      if (!c.$store.getters.navigation.isDrawer()) return c.leftMenus;

      const hamburgerMenuIcon =
        c.iconTheme === 'white'
          ? IconHamburgerMenuLight
          : IconHamburgerMenuDark;
      return [
        {
          key: 'hamburgerMenu',
          title: 'Hamburger Menu',
          icon: hamburgerMenuIcon,
          click: () => c.$store.getters.navigation.openNavigationDrawer(),
        },
        ...c.leftMenus,
      ];
    },
  },
};
</script>

<template>
  <Actionbar :title="title" :leftMenus="moreLeftMenus" :rightMenus="rightMenus">
    <slot />
  </Actionbar>
</template>
