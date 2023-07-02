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

   export default {
      name: "App",

      _children() {
         return [PageHome, PageProduct, PagePrint, PageManage];
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
      }),
      computed: { isLogging: (c) => c.loginStore.getters.isLogging },
      watch: {
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
         this.invalidateUser();
      },
      methods: {
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
               this.store.dispatch(
                  "snackbarShow",
                  `${user.name} is now logged out`,
               );
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
            :style="{ 'grid-area': 'body', 'z-index': '1' }"
            ref="AppRouterView"
         />
         <NavigationBottom
            :style="{ 'grid-area': 'bottom', 'z-index': '2' }"
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
