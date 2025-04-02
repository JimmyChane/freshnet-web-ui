<script>
import { mapStores } from 'pinia';

import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';

import PopupWindow from '@/components/window/PopupWindow.vue';

import Snackbar from './Snackbar.vue';
import Status from './Status.vue';
import PopupMenu from './popupMenu/PopupMenu.vue';

export default {
  components: { Snackbar, PopupMenu, Status, PopupWindow },
  data: (c) => ({ shouldShowStatus: false }),
  computed: {
    ...mapStores(useAppStore),

    user: (c) => useLoginStore().user,

    currentPaths() {
      return useAppStore().currentPaths;
    },

    isLogging: (c) => useLoginStore().isLogging,
  },
  watch: {
    currentPaths() {
      this.appStore.navigation.closeNavigationDrawer();
    },
    isLogging() {
      if (!useLoginStore().user && this.isLogging) {
        useAppStore().snackbarShow('User Logging');
      }
    },
    user() {
      this.invalidateUser();
    },
  },
  async created() {
    window.addEventListener('resize', this.invalidateWindow);

    this.invalidateUser();
  },
  mounted() {
    this.invalidateWindow();
  },
  methods: {
    // window
    invalidateWindow() {
      useAppStore().window.innerWidth = window.innerWidth;
      useAppStore().window.innerHeight = window.innerHeight;
    },

    async invalidateUser() {
      const user = await useLoginStore().getUser();

      if (user.isTypeAdmin() || user.isTypeStaff()) {
        this.shouldShowStatus = true;
      } else {
        this.shouldShowStatus = false;
      }
    },
  },
};
</script>

<template>
  <div class="App" :isNormal="`${appStore.appLayout.isNormal()}`">
    <div class="App-background" style="z-index: 0"></div>

    <div
      class="App-body"
      :style="{ 'z-index': '1' }"
      :isDrawer="`${appStore.navigation.isDrawer()}`"
      :isFixed="`${!appStore.navigation.isDrawer()}`"
    >
      <router-view
        class="App-routerView"
        :style="{ 'grid-area': 'body' }"
        ref="AppRouterView"
      />
    </div>

    <PopupWindow
      v-for="(popupWindow, index) in appStore.popupWindows"
      :style="{ 'z-index': 6 + index }"
      :key="popupWindow.key"
      :isShowing="popupWindow.isShowing"
      @click-dismiss="() => popupWindow.close()"
    >
      <component
        :is="popupWindow.component"
        :popupWindow="popupWindow"
      ></component>
    </PopupWindow>

    <PopupMenu
      :style="{ 'z-index': 7 + appStore.popupWindows.length }"
      v-for="popupMenu of appStore.popupMenus"
      :key="popupMenu.key"
      :popupMenu="popupMenu"
      class="App-PopupMenu"
    />
    <Snackbar
      :style="{ 'z-index': 8 + appStore.popupWindows.length }"
      v-for="snackbar of appStore.snackbars"
      :key="snackbar.key"
      :item="snackbar"
    />
    <Status
      v-if="shouldShowStatus"
      :style="{ 'z-index': 9 + appStore.popupWindows.length }"
    />
  </div>
</template>

<style lang="scss">
.scrollbar {
  --scrollbar-size: 0;

  --scrollbar-thumb-radius: 0;
  --scrollbar-thumb-color: none;
  --scrollbar-thumb-color-hover: none;

  --scrollbar-track-margin: 0;
  --scrollbar-track-color: none;
  --scrollbar-track-color-hover: none;

  scrollbar-width: var(--scrollbar-size);
  scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
  &::-webkit-scrollbar {
    height: var(--scrollbar-size);
    width: var(--scrollbar-size);
    &-thumb {
      border-radius: var(--scrollbar-thumb-radius);
      background: var(--scrollbar-thumb-color);
      &:hover {
        background: var(--scrollbar-thumb-color-hover);
      }
    }
    &-track {
      margin: var(--scrollbar-track-margin);
      background: var(--scrollbar-track-color);
      &:hover {
        background: var(--scrollbar-track-color-hover);
      }
    }
  }
}
.transition {
  --transition-target: all;
  --transition-duration: 200ms;
  --transition-delay: 0;
  --transition-timing: linear;
  transition: var(--transition-target) var(--transition-duration)
    var(--transition-timing);
  transition-delay: var(--transition-delay);
}

// color schemas
.App {
  --primary-color: #294656;
  --accent-color: #fc8237;
  --accent-color-hover: #c45815;
  --statusbar-color: #384a6a;
  --App-background-color: white;
}
.App {
  color: black;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  overflow-x: hidden;
  overflow: hidden;

  --navigation-bottom-height: 4rem;

  .App-background {
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    opacity: 0.5;
    pointer-events: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(
      120deg,
      hsl(202, 61%, 33%) 4%,
      hsl(236, 66%, 24%) 95%
    );
    display: none;
  }
  .App-body {
    width: 100dvw;
    height: 100dvh;

    background: var(--App-background-color);
    --background-color-light: var(--background-color);
    --background-color-dark: var(--background-color);

    display: grid;
    grid-template-areas:
      'left body'
      'bottom bottom';
    grid-template-rows: minmax(
      calc(100% - var(--navigation-bottom-height)),
      1fr
    );
    grid-template-columns: max-content 1fr;

    .App-routerView {
      background: #f1f1f1;
    }
  }
  .App-body[isDrawer='true'] {
    .App-NavigationDrawer {
      z-index: 3;
    }
    .App-routerView {
      z-index: 2;
    }
  }
  .App-body[isDrawer='false'] {
    .App-NavigationDrawer {
      z-index: 2;
    }
    .App-routerView {
      z-index: 3;
      border-radius: 1.2rem 0 0 1.2rem;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
    }
  }
}
.App[isNormal='true'] {
  @media (min-width: 1600px) {
    .App-body {
      width: calc(100% - 8vw);
      height: calc(100% - 2vh);
      max-width: calc(1800px - 8vw);
      max-height: calc(2000px - 2vh);

      margin: auto;
      overflow: hidden;
      display: initial;

      box-shadow: 1px 1px 50px 0px hsla(0, 0%, 0%, 0.3);
      border-radius: 1.5rem;
    }
  }
}
</style>
