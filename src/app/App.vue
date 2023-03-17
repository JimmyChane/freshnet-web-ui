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
      },
      data: (c) => ({ layoutLoginIsShown: false }),
      computed: { isLogging: (c) => c.loginStore.getters.isLogging },
      watch: {
         isLogging() {
            if (!this.loginStore.getters.user && this.isLogging) {
               this.store.dispatch("snackbarShow", "User Logging");
            }
         },
      },
      methods: {
         logout() {
            this.loginStore.dispatch("logout").then((user) => {
               this.store.dispatch("snackbarShow", `${user.name} is now logged out`);
            });
         },
      },
   };
</script>

<template>
   <div
      class="App"
      :isNormal="`${$root.appLayout.isNormal()}`"
      :isFull="`${$root.appLayout.isFull()}`"
   >
      <div class="App-background" style="z-index: 1"></div>

      <div class="App-body" style="z-index: 2">
         <div class="App-layout">
            <Status style="z-index: 2" />

            <div
               class="App-layout-body"
               :isDrawer="`${$root.navigation.isDrawer()}`"
               :isFixed="`${!$root.navigation.isDrawer()}`"
               style="z-index: 1"
            >
               <NavigationLeft
                  class="App-NavigationLeft"
                  v-if="!$root.navigation.isNone()"
                  @click-logout="() => logout()"
               />
               <router-view class="App-routerView" ref="AppRouterView" />
            </div>

            <NavigationBottom v-if="$root.navigation.isDrawer()" />
         </div>
      </div>

      <ViewerImage style="z-index: auto" />
      <Snackbar
         style="z-index: 4"
         v-for="snackbar of store.getters.snackbars"
         :key="snackbar.key"
         :item="snackbar"
      />
      <PopupMenu
         style="z-index: 5"
         v-for="popupMenu of store.getters.popupMenus"
         :key="popupMenu.key"
         :popupMenu="popupMenu"
         class="App-PopupMenu"
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
            background-color: var(--scrollbar-thumb-color);
            &:hover {
               background-color: var(--scrollbar-thumb-color-hover);
            }
         }
         &-track {
            margin: var(--scrollbar-track-margin);
            background-color: var(--scrollbar-track-color);
            &:hover {
               background-color: var(--scrollbar-track-color-hover);
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
   }
   .App {
      position: relative;
      color: black;
      width: 100dvw;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      overflow-x: hidden;

      --navigation-bottom-height: 4rem;

      .App-background {
         position: absolute;
         width: 100dvw;
         height: 100dvh;
         pointer-events: none;
      }
      .App-body {
         width: 100dvw;
         height: 100dvh;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;

         .App-layout {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: stretch;

            .App-layout-body {
               width: 100%;
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: stretch;
               background-color: #e4e4e4;

               --background-color-light: var(--background-color);
               --background-color-dark: var(--background-color);
               .App-NavigationLeft {
                  flex-grow: 0;
               }
               .App-routerView {
                  width: 100%;
                  height: 100%;
               }
            }
            .App-layout-body[isDrawer="true"] {
               height: calc(100% - var(--navigation-bottom-height)); // todo testing
               .App-NavigationLeft {
                  z-index: 2;
               }
               .App-routerView {
                  flex-grow: 1;
                  z-index: 1;
               }
            }
            .App-layout-body[isFixed="true"] {
               height: 100%;
               .App-NavigationLeft {
                  z-index: 1;
               }
               .App-routerView {
                  flex-grow: 2;
                  z-index: 2;
               }
            }
         }
      }
   }
   .App[isNormal="true"] {
      @media (min-width: 1600px) {
         .App-body {
            padding: 1vh 4vw;
            .App-layout {
               max-width: 1800px;
               max-height: 2000px;
               box-shadow: 1px 1px 50px 0px hsla(0, 0%, 0%, 0.3);
               border-radius: 8px;
            }
         }
         .App-background {
            opacity: 0.5;
            background-image: linear-gradient(
               120deg,
               hsl(202, 61%, 33%) 4%,
               hsl(236, 66%, 24%) 95%
            );
         }
      }
   }
   .App[isFull="true"] {
      background: none;
      .App-background {
         opacity: 0;
      }
   }
</style>
