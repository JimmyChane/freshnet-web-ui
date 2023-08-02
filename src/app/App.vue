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
  import AppLayout from "@/tools/AppLayout.js";
  import Navigation from "@/tools/Navigation.js";
  import HostApi from "@/host/HostApi.js";
  import U from "@/U";
  import HostIcon from "@/host/HostIcon";
  import PHE from "print-html-element"; // https://www.npmjs.com/package/print-html-element
  import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

  const objectToArray = (object = {}) => {
    return Object.keys(typeof object === "object" ? object : {}).map((key) => ({
      key,
      value: object[key],
    }));
  };
  const isPassed = (user, permissions) => {
    permissions = Array.isArray(permissions) ? permissions : [];

    if (permissions.length > 0) {
      if (user.isTypeAdmin() && !permissions.includes("admin")) return false;
      if (user.isTypeStaff() && !permissions.includes("staff")) return false;
    }

    return true;
  };
  const parseIcon = (icon) => {
    if (!U.isObjectOnly(icon)) return null;

    const light =
      icon.light instanceof HostIcon
        ? icon.light.toUrl()
        : HostApi.icon(icon.light);
    const dark =
      icon.dark instanceof HostIcon
        ? icon.dark.toUrl()
        : HostApi.icon(icon.dark);

    return { light, dark };
  };
  const parseKey = (str) => U.optString(str).trim().replace(" ", "");
  const parseGroup2s = (array) => {
    return U.optArray(array).map((obj) => {
      return {
        key: obj.key,
        title: obj.title,
        icon: obj.icon,
        values: obj.values,
        children: obj.children,
        userPermissions: obj.userPermissions,
      };
    });
  };

  class RouteQuery {
    static isValidKey(key) {
      return U.isString(key) && !key.includes(" ");
    }
    static isValidValue(value) {
      return value !== null && value !== undefined && value !== "";
    }
    static replace(currentQuery, pendingQuery) {
      const nextQueries = objectToArray(currentQuery);
      const pendingQueries = objectToArray(pendingQuery);
      let isChanged = false;

      for (const pendingQuery of pendingQueries) {
        if (!U.isObjectOnly(pendingQuery)) continue;

        const { key, value } = pendingQuery;
        if (!this.isValidKey(key)) continue;

        const nextQuery = nextQueries.find((nextQuery) => {
          return nextQuery.key === key;
        });

        if (!U.isObjectOnly(nextQuery)) {
          nextQueries.push({ key, value });
          isChanged = true;
          continue;
        }

        if (nextQuery.value !== pendingQuery.value) {
          nextQuery.value = pendingQuery.value;
          isChanged = true;
          continue;
        }

        if (!this.isValidValue(nextQuery.value)) {
          nextQueries.splice(nextQueries.indexOf(nextQuery), 1);
          isChanged = true;
          continue;
        }
      }

      if (!isChanged) return;

      return nextQueries
        .filter((nextQuery) => {
          return (
            this.isValidKey(nextQuery.key) && this.isValidValue(nextQuery.value)
          );
        })
        .reduce((query, nextQuery) => {
          query[nextQuery.key] = nextQuery.value;
          return query;
        }, {});
    }
  }

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

      layoutLoginIsShown: false,
      shouldShowStatus: false,
    }),
    computed: {
      user: (c) => c.loginStore.getters.user,

      // pages
      pages() {
        const pages = U.optArray(_children);
        if (pages.length < 1) return [];

        const listGroup1 = pages.map((page) => {
          // get property
          let { key, title, icon, userPermissions } = page;
          const { _children, _groups, _queries } = page;

          // get ready
          key = parseKey(page.key);
          title = U.optString(page.title).trim();
          icon = parseIcon(page.icon);
          const children = U.isFunction(_children) ? _children() : [];
          const groups = U.isFunction(_groups) ? _groups() : [];
          const queries = U.isFunction(_queries) ? _queries() : [];

          // parsing
          const parsedChildren = parseGroup2s([{ values: children }]).map(
            (obj) => {
              obj.isLink = true;
              obj.isQuery = false;
              return obj;
            },
          );
          const parsedGroups = parseGroup2s(groups).map((obj) => {
            obj.isLink = true;
            obj.isQuery = false;
            return obj;
          });
          const parsedQueries = parseGroup2s(queries).map((obj) => {
            obj.isLink = true;
            obj.isQuery = true;
            return obj;
          });

          const returnParsedGroups = [
            ...parsedChildren,
            ...parsedGroups,
            ...parsedQueries,
          ]
            .map((group) => {
              if (!isPassed(this.user, group.userPermissions)) return group;

              group.key = parseKey(group.key);
              group.title = U.optString(group.title);
              group.values = U.optArray(group.values);
              if (Array.isArray(group.children)) {
                group.values.unshift(...group.children);
              }

              return group;
            })
            .reduce((groups, group) => {
              if (!isPassed(this.user, group.userPermissions)) {
                return groups;
              }

              // get property
              let { key, title } = group;
              const { isLink, isQuery } = group;

              const views = U.optArray(group.values)
                .map((value) => {
                  if (!isPassed(this.user, value.userPermissions)) {
                    return null;
                  }
                  const key = parseKey(value.key);
                  const title = U.optString(value.title);
                  const icon = parseIcon(value.icon);
                  return { key, icon, title };
                })
                .filter((view) => view !== null);

              let found = groups.find((group) => group.key === key);
              if (!found) {
                groups.push(
                  (found = { key, title, isLink, isQuery, groups: [] }),
                );
              }
              found.groups.push(...views);

              return groups;
            }, []);

          return {
            key,
            title,
            icon,
            userPermissions,
            groups: returnParsedGroups,
          };
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
  <div class="App" :isNormal="`${$root.appLayout.isNormal()}`">
    <div class="App-background" style="z-index: 0"></div>

    <div
      class="App-body"
      :style="{ 'z-index': '1' }"
      :isDrawer="`${$root.navigation.isDrawer()}`"
      :isFixed="`${!$root.navigation.isDrawer()}`"
    >
      <NavigationLeft
        class="App-NavigationLeft"
        :style="{ 'grid-area': 'left', 'z-index': '3' }"
        v-if="!$root.navigation.isNone()"
        @click-logout="() => logout()"
      />
      <router-view
        class="App-routerView"
        :style="{ 'grid-area': 'body', 'z-index': '2' }"
        ref="AppRouterView"
      />
      <NavigationBottom
        :style="{ 'grid-area': 'bottom', 'z-index': '1' }"
        v-if="!$root.navigation.isNone() && $root.navigation.isDrawer()"
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
