<script>
import { mapStores } from 'pinia';

import IconHamburgerMenu from '@/assets/icon/hamburgerMenu-000000.svg';
import Logo from '@/assets/logo/freshnet-enterprise-logo.svg';
import { useAppStore } from '@/stores/app.store';

import Footer from '@/app/footer/Footer.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';

export default {
  components: { Actionbar, Footer },
  data: (c) => ({
    Logo,
    IconHamburgerMenu,
    drawer: { isExpand: false },
    top: { shadow: false },
  }),
  computed: {
    ...mapStores(useAppStore),
  },
  created() {
    document.title = 'Page Not Found';
  },
};
</script>

<template>
  <div
    class="Page404"
    @scroll="(event) => (top.shadow = event.target.scrollTop > 0)"
  >
    <Actionbar
      :class="['Home-top', 'transition', top.shadow ? 'Home-top-shadow' : '']"
      v-if="appStore.navigation.isDrawer()"
      :leftMenus="[
        {
          key: 'home',
          title: 'Home',
          icon: Logo,
          click: () => this.$router.push('/home'),
        },
        {
          title: 'Hamburger Menu',
          icon: IconHamburgerMenu,
          click: () => appStore.navigation.openNavigationDrawer(),
        },
      ]"
    />

    <div class="Page404-main">
      <span class="Page404-title">404</span>
      <p class="Page404-description">Oops, no page found</p>

      <router-link class="Page404-goBack" :to="{ path: '/' }">
        Go Home
      </router-link>
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.Page404 {
  color: #000000;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  position: relative;

  .Page404-body {
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .Home-top {
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    position: sticky;
    flex-grow: 0;

    .Home-top-body {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      column-gap: 1rem;
    }
  }
  .Home-top-shadow {
    box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
  }

  .Page404-main {
    z-index: 1;
    width: 100%;
    max-width: 35rem;
    padding: 1.4rem;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;

    .Page404-title {
      font-size: 4rem;
      opacity: 0.6;
      line-height: 1.4;
    }
    .Page404-description {
      font-weight: 400;
      font-size: 1.2rem;
    }
    .Page404-goBack {
      color: inherit;
      margin-top: 2rem;
    }
  }
}
</style>
