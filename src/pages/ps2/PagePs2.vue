<script>
import { mapStores } from 'pinia';

import { IconPack } from '@/app/IconPack';
import IconClose from '@/assets/icon/close-2A4858.svg';
import IconHamburgerMenu from '@/assets/icon/hamburgerMenu-000000.svg';
import IconSearch from '@/assets/icon/search-2A4858.svg';
import Logo from '@/assets/logo/freshnet-enterprise-logo.svg';
import { useAppStore } from '@/stores/app.store';
import { usePs2Store } from '@/stores/ps2.store';

import Footer from '@/app/footer/Footer.vue';
import Empty from '@/components/Empty.vue';
import LoadingDots from '@/components/LoadingDots.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import PopupWindow from '@/components/window/PopupWindow.vue';

import ItemPs2Disc from './ItemPs2Disc.vue';
import WindowItemPs2Disc from './WindowItemPs2Disc.vue';

export default {
  key: 'ps2',
  name: 'PagePs2',
  title: 'PS2 Disc',

  components: {
    Actionbar,
    LoadingDots,
    ButtonIcon,
    Empty,
    PopupWindow,
    Footer,
    WindowItemPs2Disc,
    ItemPs2Disc,
  },
  data: (c) => ({
    IconHamburgerMenu,
    IconClose,
    IconSearch,
    Logo,
    searchKeyword: '',
  }),
  computed: {
    ...mapStores(useAppStore),

    isLoading: (c) => usePs2Store().isLoading,
    ps2Discs: (c) => usePs2Store().items,
    ps2DiscSearches: (c) => {
      let searchKeywords = c.searchKeyword.toLowerCase().split(' ');
      if (searchKeywords.length == 0) return [];
      return c.ps2Discs.filter((disc) => disc.toCount(searchKeywords) > 0);
    },

    currentDiscCode: (c) => {
      return c.$route.query.discCode;
    },
    currentDisc: (c) => {
      let currentDiscCode =
        typeof c.currentDiscCode === 'string'
          ? c.currentDiscCode.trim().toLowerCase()
          : '';
      return c.ps2Discs.find((disc) => {
        return disc.code.toLowerCase() === currentDiscCode;
      });
    },
  },
  methods: {
    scrollToTop() {
      if (!this.$refs) return;
      const { pagePs2Root } = this.$refs;
      if (!pagePs2Root) return;
      pagePs2Root.scrollTo(0, 0);
    },
  },
  mounted() {
    usePs2Store()
      .getItems()
      .catch((error) => {
        useAppStore().snackbarShow('Failed to load');
        console.error(error);
      });
  },
};
</script>

<template>
  <div class="PagePs2" ref="pagePs2Root">
    <div class="PagePs2-body">
      <Actionbar
        class="PagePs2-header transition"
        :leftMenus="
          appStore.navigation.isDrawer()
            ? [
                {
                  title: 'Hamburger Menu',
                  icon: IconHamburgerMenu,
                  click: () => appStore.navigation.openNavigationDrawer(),
                },
                {
                  title: 'Home',
                  icon: Logo,
                  click: () => $router.push({ name: 'home' }),
                },
              ]
            : []
        "
      >
        <div class="PagePs2-header-body">
          <div class="PagePs2-header-search transition">
            <input
              class="PagePs2-header-search-input"
              v-model="searchKeyword"
              placeholder="Search PS2 disc"
              @input="(event) => scrollToTop()"
            />

            <ButtonIcon
              v-if="searchKeyword"
              :src="IconClose"
              alt="Clear"
              @click="searchKeyword = ''"
            />
            <ButtonIcon :src="IconSearch" alt="Search" />
          </div>
        </div>
      </Actionbar>

      <div class="PagePs2-main" v-if="ps2Discs.length">
        <div class="PagePs2-section transition" v-if="searchKeyword">
          <div class="PagePs2-section-title-body">
            <h2 class="PagePs2-section-title">Search Results</h2>
            <h2 class="PagePs2-section-count">
              {{ `(${ps2DiscSearches.length})` }}
            </h2>
          </div>
          <p v-if="!ps2DiscSearches.length" class="PagePs2-section-description">
            No Search Results
          </p>
          <div class="PagePs2-item-list">
            <div
              v-for="ps2DiscSearch in ps2DiscSearches"
              :key="ps2DiscSearch.code"
              class="PagePs2-item-body"
            >
              <div class="PagePs2-line-seperator-horizontal"></div>
              <router-link
                class="PagePs2-itemLink"
                :to="{ query: { discCode: ps2DiscSearch.code } }"
              >
                <ItemPs2Disc :ps2Disc="ps2DiscSearch" />
              </router-link>
            </div>
          </div>
        </div>

        <div class="PagePs2-section transition">
          <p v-if="!ps2Discs.length" class="PagePs2-section-description">
            No Item
          </p>
          <div class="PagePs2-item-list">
            <div
              v-for="ps2Disc in ps2Discs"
              :key="ps2Disc.code"
              class="PagePs2-item-body"
            >
              <div class="PagePs2-line-seperator-horizontal" />
              <router-link
                class="PagePs2-itemLink transition"
                :to="{ query: { discCode: ps2Disc.code } }"
              >
                <ItemPs2Disc :ps2Disc="ps2Disc" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <Empty
        v-if="!ps2Discs.length && !isLoading"
        :icon="$options.icon.dark.toUrl()"
      />

      <Footer />
    </div>

    <PopupWindow
      class="PagePs2-window"
      :isShowing="!!currentDisc"
      @click-dismiss="
        () => {
          if ($route.fullPath !== '/ps2') {
            appStore.replaceQuery({ query: { discCode: null } });
          }
        }
      "
    >
      <WindowItemPs2Disc :item="currentDisc" />
    </PopupWindow>

    <LoadingDots style="z-index: 3" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PagePs2 {
  --shadow-light: hsla(0, 0%, 0%, 0.2);
  --shadow-dark: hsla(0, 0%, 0%, 0.4);

  --width-max: 1000px;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  position: relative;

  .PagePs2-body {
    flex-grow: 1;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;

    .PagePs2-header {
      z-index: 2;
      width: 100%;
      border-bottom: 1px solid hsl(0, 0%, 80%);
      overflow: initial;
      .PagePs2-header-body {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        gap: 0.8rem;

        .PagePs2-header-search {
          width: 100%;
          color: #5c5c5c;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 8px;
          padding: 0.2rem 0.5rem;
          padding-top: 0.4rem;

          background: hsla(0, 0%, 100%, 0.3);
          border: 1px solid hsla(0, 0%, 0%, 0.15);

          .PagePs2-header-search-input {
            outline: none;
            border: none;
            padding: 0.5rem;
            background: none;
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            align-items: center;
          }
        }
      }
    }

    .PagePs2-main {
      z-index: 1;
      width: 100%;
      max-width: var(--width-max);
      text-align: start;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-bottom: 4em;
      .PagePs2-section {
        width: 100%;
        padding: 1.6rem;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        padding-bottom: 2rem;

        .PagePs2-section-title-body {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          padding: 4px;
          column-gap: 10px;

          .PagePs2-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0.75rem 0;
          }

          .PagePs2-section-count {
            font-size: 0.8rem;
            color: hsla(0, 0%, 0%, 0.8);
            margin: 1rem 0;
            font-style: normal;
            font-weight: 400;
          }
        }

        .PagePs2-section-description {
          display: flex;
          padding: 4px;
          color: rgb(75, 75, 75);
          font-size: 0.8rem;
        }

        .PagePs2-item-list {
          padding: 4px;
          display: flex;
          flex-direction: column;

          .PagePs2-item-body {
            display: flex;
            flex-direction: column;

            .PagePs2-line-seperator-horizontal {
              width: 100%;
              height: 0.5px;
              background: hsla(0, 0%, 0%, 0.1);
              margin: px;
            }
            .PagePs2-itemLink {
              color: black;
              text-decoration: none;
              text-align: start;
              border: none;
              background: none;
              cursor: pointer;

              &:hover,
              &:focus {
                background: hsla(0, 0%, 0%, 0.1);
              }
            }
          }
        }
      }
    }
  }

  .PagePs2-window {
    z-index: 2;
    width: 100%;
    height: 100%;
  }
}
</style>
