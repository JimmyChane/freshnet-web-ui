<script>
  import PageHome from "@/pages/home/PageHome.vue";
  import PageProduct from "@/pages/product/PageProduct.vue";
  import PagePrint from "@/pages/print/PagePrint.vue";
  import PageManage from "@/pages/manage/PageManage.vue";

  import NavigationLeft from "./leftNav/NavigationLeft.vue";
  import NavigationBottom from "./NavigationBottom.vue";
  import ViewerImage from "./ViewerImage.vue";
  import Snackbar from "./Snackbar.vue";
  import PopupMenu from "./PopupMenu.vue";
  import Status from "./Status.vue";
  import PopupWindow from "@/components/window/PopupWindow.vue";

  // tools
  import AppLayout from "@/tools/AppLayout";
  import Navigation from "@/tools/Navigation";
  import U from "@/U";
  import PHE from "print-html-element"; // https://www.npmjs.com/package/print-html-element
  import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

  import NavPage from "./NavPage";
  import NavGroup from "./NavViewGroup";
  import NavView from "./NavView";

  import {
    objectToArray,
    isPassed,
    parseIcon,
    parseKey,
    parseGroup2s,
  } from "./AppTool";
  import RouteQuery from "./RouteQuery";

  const _children = [PageHome, PageProduct, PagePrint, PageManage];

  export default {
    name: "App",

    _children() {
      return _children;
    },

    components: {
      NavigationLeft,
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
      user: (c) => c.loginStore.getters.user,

      // pages
      pages() {
        const pages = U.optArray(_children);
        if (pages.length < 1) return [];

        const listGroup1 = pages.map((page) => {
          const navPage = new NavPage()
            .setKey(page.key)
            .setTitle(page.title)
            .setIcon(page.icon)
            .setUserPermissions(page.userPermissions);

          const children = U.isFunction(page._children) ? page._children() : [];
          const groups = U.isFunction(page._groups) ? page._groups() : [];
          const queries = U.isFunction(page._queries) ? page._queries() : [];

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
              const views = U.optArray(group.values)
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
      paths: (c) => c.$route.path.split("/").filter((path) => path),
      currentPaths() {
        let { fullPath } = this.$route;

        let questionMarkIndex = fullPath.indexOf("?");
        if (questionMarkIndex !== -1) {
          fullPath = fullPath.substring(0, questionMarkIndex);
        }

        return fullPath.split(/[/]/).filter((path) => path);
      },
      currentPageKey() {
        let paths = this.currentPaths;
        return paths.length > 0 ? paths[0] : "";
      },
      currentViewKey() {
        let paths = this.currentPaths;
        return paths.length > 1 ? paths[1] : "";
      },

      isLogging: (c) => c.loginStore.getters.isLogging,
    },
    watch: {
      currentPaths() {
        this.navigation.closeNavigationDrawer();
      },
      isLogging() {
        if (!this.loginStore.getters.user && this.isLogging) {
          this.store.dispatch("snackbarShow", "User Logging");
        }
      },
      user() {
        this.invalidateUser();
      },
    },
    async created() {
      this.store.state.app = this;
      this.appLayout = new AppLayout(this);
      this.navigation = new Navigation(this);
      window.addEventListener("resize", this.invalidateWindow);

      this.invalidateUser();
    },
    mounted() {
      this.invalidateWindow();
    },
    methods: {
      // external interaction
      copyText(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style = { position: "absolute", left: "-9999px" };
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      },
      openLink(link, target = "_blank") {
        let a = document.createElement("a");
        a.style = {
          position: "absolute",
          opacity: "0",
          "pointer-events": "none",
        };
        a.href = link;
        a.target = target;
        a.dispatchEvent(
          new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: false,
          }),
        );
        a.remove();
      },
      pushDownload(filename, content) {
        const element = document.createElement("a");
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
        const query = RouteQuery.replace(this.$route.query, param.query);

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
        const user = await this.loginStore.dispatch("getUser");

        if (user.isTypeAdmin() || user.isTypeStaff()) {
          this.shouldShowStatus = true;
          this.store.dispatch("openSocket");
        } else {
          this.shouldShowStatus = false;
          this.store.dispatch("closeSocket");
        }
      },
      logout() {
        this.loginStore.dispatch("logout").then((user) => {
          this.store.dispatch("snackbarShow", `${user.name} is now logged out`);
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
      <NavigationLeft
        class="App-NavigationLeft"
        :style="{ 'grid-area': 'left', 'z-index': '3' }"
        v-if="!navigation.isNone()"
        @click-logout="() => logout()"
      />
      <router-view
        class="App-routerView"
        :style="{ 'grid-area': 'body', 'z-index': '2' }"
        ref="AppRouterView"
      />
      <NavigationBottom
        :style="{ 'grid-area': 'bottom', 'z-index': '1' }"
        v-if="!navigation.isNone() && navigation.isDrawer()"
      />
    </div>

    <ViewerImage style="z-index: auto" />
    <PopupWindow
      v-for="(popupWindow, index) in store.getters.popupWindows"
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
      :style="{ 'z-index': 7 + store.getters.popupWindows.length }"
      v-for="popupMenu of store.getters.popupMenus"
      :key="popupMenu.key"
      :popupMenu="popupMenu"
      class="App-PopupMenu"
    />
    <Snackbar
      :style="{ 'z-index': 8 + store.getters.popupWindows.length }"
      v-for="snackbar of store.getters.snackbars"
      :key="snackbar.key"
      :item="snackbar"
    />
    <Status
      v-if="shouldShowStatus"
      :style="{ 'z-index': 9 + store.getters.popupWindows.length }"
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
    font-family: "Roboto", sans-serif;
    word-break: break-word;
  }
  html {
    overscroll-behavior-x: none;
  }
  body {
    @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
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
    --App-background-color: #f1f1f1;
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
        "left body"
        "bottom bottom";
      grid-template-rows: minmax(
        calc(100% - var(--navigation-bottom-height)),
        1fr
      );
      grid-template-columns: max-content 1fr;
    }
  }
  .App[isNormal="true"] {
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
