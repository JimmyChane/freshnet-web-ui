<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { mapStores } from 'pinia';
// https://www.npmjs.com/package/print-html-element
import PHE from 'print-html-element';

import { isFunction, isPassed, optArray, parseGroup2s, replace } from '@/U';
import PopupWindow from '@/components/window/PopupWindow.vue';
import { HOME_ROUTE, MANAGE_ROUTE, PRINT_ROUTE, PRODUCT_ROUTE } from '@/router';
import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';
// tools
import { AppLayout } from '@/tools/AppLayout';
import { Navigation } from '@/tools/Navigation';

import { NavPage } from './NavPage';
import { NavView } from './NavView';
import { NavViewGroup as NavGroup } from './NavViewGroup';
import Snackbar from './Snackbar.vue';
import Status from './Status.vue';
import ViewerImage from './ViewerImage.vue';
import NavigationBottom from './bottomNavigationBar/BottomNavigationBar.vue';
import NavigationDrawer from './navigationDrawer/NavigationDrawer.vue';
import PopupMenu from './popupMenu/PopupMenu.vue';

export default {
  name: 'App',

  components: {
    NavigationDrawer,
    NavigationBottom,
    ViewerImage,
    Snackbar,
    PopupMenu,
    Status,
    PopupWindow,
  },
  data: (c) => ({
    layoutLoginIsShown: false,
    shouldShowStatus: false,

    console: {
      log(param1, param2) {
        param2 === undefined
          ? console.log(param1)
          : console.log(param1, param2);
      },
      error(param1, param2) {
        param2 === undefined
          ? console.error(param1)
          : console.error(param1, param2);
      },
    },
    window: { innerWidth: 0, innerHeight: 0 },

    appLayout: null,
    navigation: null,
  }),
  computed: {
    ...mapStores(useAppStore),

    user: (c) => useLoginStore().user,

    // pages
    pages() {
      const pages = [HOME_ROUTE, PRODUCT_ROUTE, PRINT_ROUTE, MANAGE_ROUTE];
      if (pages.length < 1) return [];

      const listGroup1 = pages.map((page) => {
        const navPage = new NavPage()
          .setKey(page.key)
          .setTitle(page.title)
          .setIcon(page.icon)
          .setUserPermissions(page.userPermissions);

        const children = isFunction(page.children) ? page.children() : [];
        const groups = isFunction(page.groups) ? page.groups() : [];
        const queries = isFunction(page._queries) ? page._queries() : [];

        const returnParsedGroups = [
          ...parseGroup2s([{ values: children }, ...groups]).map((obj) => {
            return obj.setIsLink(true).setIsQuery(false);
          }),
          ...parseGroup2s(queries).map((obj) => {
            return obj.setIsLink(true).setIsQuery(true);
          }),
        ]
          .filter((group) => {
            return isPassed(this.user, group.userPermissions);
          })
          .reduce((groups, group) => {
            const views = optArray(group.values)
              .filter((value) => {
                return isPassed(this.user, value.userPermissions);
              })
              .map((value) => {
                return new NavView()
                  .setKey(value.key)
                  .setTitle(value.title)
                  .setIcon(value.icon);
              });

            let found = groups.find((group) => group.key === navPage.key);
            if (!found) {
              found = new NavGroup()
                .setKey(group.key)
                .setTitle(group.title)
                .setIsLink(group.isLink)
                .setIsQuery(group.isQuery);

              groups.push(found);
            }
            found.groups.push(...views);

            return groups;
          }, []);

        return navPage.setGroups(returnParsedGroups);
      });

      listGroup1.forEach((group1) => {
        const listGroup2 = group1.groups;
        listGroup2.forEach((group2) => {
          const listGroup3 = group2.groups;
          if (listGroup3.length === 0) {
            listGroup2.splice(listGroup2.indexOf(group2), 1);
          }
        });
      });

      return listGroup1;
    },
    paths: (c) => c.$route.path.split('/').filter((path) => path),
    currentPaths() {
      let { fullPath } = this.$route;

      let questionMarkIndex = fullPath.indexOf('?');
      if (questionMarkIndex !== -1) {
        fullPath = fullPath.substring(0, questionMarkIndex);
      }

      return fullPath.split(/[/]/).filter((path) => path);
    },
    currentPageKey() {
      let paths = this.currentPaths;
      return paths.length > 0 ? paths[0] : '';
    },
    currentViewKey() {
      let paths = this.currentPaths;
      return paths.length > 1 ? paths[1] : '';
    },

    isLogging: (c) => useLoginStore().isLogging,
  },
  watch: {
    currentPaths() {
      this.navigation.closeNavigationDrawer();
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
    useAppStore().app = this;
    this.appLayout = new AppLayout(this);
    this.navigation = new Navigation(this);
    window.addEventListener('resize', this.invalidateWindow);

    this.invalidateUser();
  },
  mounted() {
    this.invalidateWindow();
  },
  methods: {
    // external interaction
    copyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style = { position: 'absolute', left: '-9999px' };
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    },
    openLink(link, target = '_blank') {
      let a = document.createElement('a');
      a.style = {
        position: 'absolute',
        opacity: '0',
        'pointer-events': 'none',
      };
      a.href = link;
      a.target = target;
      a.dispatchEvent(
        new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false,
        }),
      );
      a.remove();
    },
    pushDownload(filename, content) {
      const element = document.createElement('a');
      element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
        content,
      )}`;
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    print(element) {
      PHE.printElement(element);
    },

    // routes
    nextQuery(param = {}) {
      this.setQuery(param, true);
    },
    replaceQuery(param = {}) {
      this.setQuery(param, false);
    },
    setQuery(param = {}, isNext = true) {
      const query = replace(this.$route.query, param.query);

      if (!query) return;

      if (isNext) {
        this.$router.push({ query });
      } else {
        this.$router.replace({ query });
      }
    },

    // window
    invalidateWindow() {
      this.window.innerWidth = window.innerWidth;
      this.window.innerHeight = window.innerHeight;
    },

    async invalidateUser() {
      const user = await useLoginStore().getUser();

      if (user.isTypeAdmin() || user.isTypeStaff()) {
        this.shouldShowStatus = true;
        useAppStore().openSocket();
      } else {
        this.shouldShowStatus = false;
        useAppStore().closeSocket();
      }
    },
    logout() {
      useLoginStore()
        .logout()
        .then((user) => {
          useAppStore().snackbarShow(`${user.name} is now logged out`);
        });
    },
  },
};
</script>

<template>
  <div class="App" :isNormal="`${appLayout.isNormal()}`">
    <div class="App-background" style="z-index: 0"></div>

    <div
      class="App-body"
      :style="{ 'z-index': '1' }"
      :isDrawer="`${navigation.isDrawer()}`"
      :isFixed="`${!navigation.isDrawer()}`"
    >
      <NavigationDrawer
        class="App-NavigationDrawer"
        :style="{ 'grid-area': 'left' }"
        v-if="!navigation.isNone()"
        @click-logout="() => logout()"
      />
      <router-view
        class="App-routerView"
        :style="{ 'grid-area': 'body' }"
        ref="AppRouterView"
      />
      <NavigationBottom
        :style="{ 'grid-area': 'bottom', 'z-index': '1' }"
        v-if="!navigation.isNone() && navigation.isDrawer()"
      />
    </div>

    <ViewerImage style="z-index: auto" />
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
// initiate
:root {
  font-size: 16px;
}
@media (max-width: 320px) {
  :root {
    font-size: 14px;
  }
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  font-family: 'Roboto', sans-serif;
  word-break: break-word;
}
html {
  overscroll-behavior-x: none;
}
body {
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
  width: 100dvw;
  height: 100dvh;
  overscroll-behavior-x: none;
  overscroll-behavior-y: none;
}
p {
  white-space: pre-line;
}

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
