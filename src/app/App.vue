<script>
   import PageHome from "@/pages/home/PageHome.vue";
   import PageProduct from "@/pages/product/PageProduct.vue";
   import PagePrint from "@/pages/print/PagePrint.vue";
   import PageManage from "@/pages/manage/PageManage.vue";

   import LeftNav from "./leftNav/LeftNav.vue";
   import ViewerImage from "./ViewerImage.vue";
   import Snackbar from "./Snackbar.vue";

   export default {
      name: "App",

      _children() {
         return [PageHome, PageProduct, PagePrint, PageManage];
      },

      components: { LeftNav, ViewerImage, Snackbar },
      data() {
         return { statusIsShown: false, layoutLoginIsShown: false };
      },
      computed: {
         isLogging: (c) => c.loginStore.getters.isLogging,
         isConnected: (c) => c.store.getters.isConnected,
      },
      watch: {
         isLogging() {
            if (!this.loginStore.getters.user && this.isLogging)
               this.$root.feedback("User Logging");
         },
         isConnected() {
            this.onConnectionChange();
         },
      },
      mounted() {
         window.addEventListener("resize", () => this.invalidateHeight());
         this.invalidateHeight();

         setTimeout(() => this.onConnectionChange(), 3000);
      },
      unmounted() {
         window.removeEventListener("resize", this.invalidateHeight);
      },
      methods: {
         onConnectionChange() {
            if (!this.isConnected) {
               this.statusIsShown = true;
               return;
            }

            this.statusIsShown = true;
            setTimeout(() => (this.statusIsShown = false), 3000);
         },

         logout() {
            this.loginStore.dispatch("logout").then((user) => {
               this.$root.feedback(`${user.name} is now logged out`);
            });
         },

         invalidateHeight() {
            const { innerHeight } = window;
            const vh = innerHeight * 0.01;
            document.body.style.setProperty("--vh", `${vh}px`);
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'App',
         `App-${statusIsShown ? 'isShowingStatus' : 'isHidingStatus'}`,
         $root.appLayout.isNormal() ? 'App-isNormal' : '',
         $root.appLayout.isFull() ? 'App-isFull' : '',
         'transition',
      ]"
   >
      <div class="App-background transition"></div>

      <div class="App-body transition">
         <div class="App-layout">
            <div
               v-if="false"
               :class="[
                  'App-status',
                  `App-status-${
                     isConnected ? 'isConnected' : 'isDisconnected'
                  }`,
                  'transition',
               ]"
            >
               <span>{{ isConnected ? "Connected" : "Disconnected" }}</span>
            </div>

            <div
               :class="[
                  'App-layout-body',
                  `App-layout-body-${
                     $root.navigation.isDrawer() ? 'isDrawer' : 'isFixed'
                  }`,
                  'transition',
               ]"
            >
               <LeftNav
                  class="App-LeftNav"
                  v-if="!$root.navigation.isNone()"
                  @click-logout="() => logout()"
               />
               <router-view class="App-routerView" ref="AppRouterView" />
            </div>
         </div>
      </div>

      <div class="App-overflow">
         <div class="App-overflow-body">
            <ViewerImage class="App-imageViewer" />
         </div>
      </div>

      <Snackbar
         class="App-Snackbar"
         v-for="snackbar of $root.snackbars"
         :key="snackbar.key"
         :item="snackbar"
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
      --transition-duration: 300ms;
      --transition-delay: 0;
      --transition-timing: linear;
      transition: var(--transition-target) var(--transition-duration)
         var(--transition-timing);
      transition-delay: var(--transition-delay);
   }

   :root {
      font-size: 16px;
      @media (max-width: 320px) {
         font-size: 14px;
      }
   }

   html {
      // @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap");
      // @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
      // @import url("https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

      width: 100%;
      height: 100%;
      overflow: hidden;
      overscroll-behavior-x: none;

      body {
         width: 100%;
         height: 100%;
         overscroll-behavior-x: none;

         p {
            white-space: pre-line;
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

      // color schemas
      .App {
         --primary-color: #294656;
         --accent-color: #fc8237;
         --statusbar-color: #384a6a;
      }
   }

   .App {
      position: relative;
      color: black;
      width: 100%;
      height: 100%;
      height: 100vh;
      max-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      overflow: hidden;

      height: -webkit-fill-available; // fix for ios - test
      height: 100vh; /* Fallback for browsers that do not support Custom Properties */
      height: calc(var(--vh, 1vh) * 100);

      .App-background {
         z-index: 1;
         position: absolute;
         width: 100%;
         height: 100%;
         pointer-events: none;
      }
      .App-body {
         z-index: 2;
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         overflow: hidden;

         .App-layout {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: stretch;

            --status-height: 1.2em;

            .App-status {
               z-index: 2;
               font-size: 0.7em;
               display: flex;
               flex-direction: row;
               flex-grow: 0;
               align-items: center;
               justify-content: center;
               padding: 0 0.1em;
               width: 100%;
               color: white;
               pointer-events: none;
               background: var(--primary-color);
               --background-disconnected: #e73c2f;
               --background-connected: #0c8d0c;

               position: absolute;
               top: 0;
            }
            .App-status-isDisconnected {
               background: var(--background-disconnected);
            }
            .App-status-isConnected {
               background: var(--background-connected);
            }

            .App-layout-body {
               z-index: 1;
               width: 100%;
               height: 100%;
               display: flex;
               flex-direction: row;
               flex-grow: 1;
               align-items: center;
               justify-content: stretch;
               background-color: #e4e4e4;

               --background-color-light: var(--background-color);
               --background-color-dark: var(--background-color);
               .App-LeftNav {
                  flex-grow: 0;
               }
               .App-routerView {
                  width: 100%;
                  height: 100%;
               }
            }
            .App-layout-body-isDrawer {
               .App-LeftNav {
                  z-index: 2;
               }
               .App-routerView {
                  flex-grow: 1;
               }
            }
            .App-layout-body-isFixed {
               .App-LeftNav {
                  z-index: 1;
               }
               .App-routerView {
                  flex-grow: 2;
               }
            }
         }
      }
      .App-overflow {
         z-index: auto;
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         width: 100vw;
         height: 100vh;
         display: flex;
         overflow: hidden;

         height: 100vh; /* Fallback for browsers that do not support Custom Properties */
         height: calc(var(--vh, 1vh) * 100);

         .App-overflow-body {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            overflow: hidden;

            .App-imageViewer {
               z-index: 3;
            }
         }
      }
      .App-Snackbar {
         z-index: 4;
      }
   }

   .App-isNormal {
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
   .App-isFull {
      background: none;
      .App-background {
         opacity: 0;
      }
   }

   .App-isShowingStatus {
      .App-body {
         .App-layout {
            .App-status {
               height: var(--status-height);
               min-height: var(--status-height);
               max-height: var(--status-height);
               opacity: 1;
            }
         }
      }
   }
   .App-isHidingStatus {
      .App-body {
         .App-layout {
            .App-status {
               height: 0;
               min-height: 0;
               max-height: 0;
               opacity: 0;
            }
         }
      }
   }
</style>
