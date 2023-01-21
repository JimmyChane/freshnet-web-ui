<script>
   import Drawer from "@/components/Drawer.vue";
   import LeftNavGroup1 from "./LeftNav_Group1.vue";
   import LeftNavLogin from "./LeftNav_Login.vue";

   export default {
      components: { Drawer, LeftNavGroup1, LeftNavLogin },
      emits: ["click-collapse", "click-logout"],
      props: {
         isExpand: { type: Boolean, default: false },
         isDrawer: { type: Boolean, default: true },
         isWide: { type: Boolean, default: false },
         selectedPageKey: { type: String, default: "" },
         selectedViewKey: { type: String, default: "" },
      },
      data() {
         return {
            expandedPagey: "",

            isDragging: false,
            dragTrigger: 20,
            dragOpen: 80,
            dragWidth: 0,
         };
      },
      computed: {
         drawerMode() {
            if (this.isDrawer && this.isExpand)
               return Drawer.Mode.DRAWER_EXPAND;
            if (this.isDrawer && !this.isExpand)
               return Drawer.Mode.DRAWER_COLLAPSE;
            if (!this.isDrawer) return Drawer.Mode.FIXED;
            return 0;
         },
         drawerEdge: () => Drawer.Edge.LEFT,

         navigations() {
            const navigations = this.$root.pages;

            navigations.forEach((nav) => {
               nav.isExpanded = () => this.expandedPageKey === nav.key;
               nav.isSelected = () => this.selectedPageKey === nav.key;
               nav.isWide = () => this.isWide;
               nav.clickExpand = () => {
                  this.expandedPageKey =
                     this.expandedPageKey === nav.key ? "" : nav.key;
               };
               nav.click = () => this.emitCollapse();

               nav.groups.forEach((nav2) => {
                  nav2.isExpanded = () => false;
                  nav2.isWide = () => this.isWide;
                  nav2.getParent = () => nav;

                  nav2.groups.forEach((nav3) => {
                     nav3.isExpanded = () => false;
                     nav3.isSelected = () => {
                        if (nav2.isQuery) {
                           return this.getQueryValue(nav2.key) === nav3.key;
                        } else {
                           return this.selectedViewKey === nav3.key;
                        }
                     };
                     nav3.isWide = () => this.isWide;

                     nav3.getParent = () => nav2;
                     nav3.getLink = () => `/${nav.key}/${nav3.key}`;

                     nav3.click = () => {
                        if (nav2.isQuery) {
                           this.clickQuery(nav3);
                        }
                     };
                  });
               });
            });

            return navigations;
         },

         refDrawer() {
            return this.$refs.Drawer;
         },
         refBody() {
            return this.$refs.Body;
         },
      },
      mounted() {
         this.addTouchListeners();
      },
      unmounted() {
         this.removeTouchListeners();
      },
      methods: {
         addTouchListeners() {
            document.addEventListener("touchstart", this.onTouchStart);
            document.addEventListener("touchmove", this.onTouchMove);
            document.addEventListener("touchend", this.onTouchEnd);
         },
         removeTouchListeners() {
            document.removeEventListener("touchstart", this.onTouchStart);
            document.removeEventListener("touchmove", this.onTouchMove);
            document.removeEventListener("touchend", this.onTouchEnd);
         },

         onTouchStart(e) {
            if (!this.refDrawer) {
               this.removeTouchListeners();
               return;
            }
            if (!this.refBody) {
               this.removeTouchListeners();
               return;
            }

            this.dragWidth = this.refBody.offsetWidth;

            const touch = [...e.changedTouches][0];
            let x = touch.pageX;
            const y = touch.pageY;

            if (x > this.dragTrigger) return;
            if (x < this.dragTrigger) x = this.dragTrigger;
            this.refDrawer.onDragStart(x, y);
            this.isDragging = true;
         },
         onTouchMove(e) {
            if (!this.isDragging) return;
            const touch = [...e.changedTouches][0];
            const x =
               touch.pageX > this.dragWidth ? this.dragWidth : touch.pageX;
            const y = touch.pageY;
            this.refDrawer.onDragMove(x, y);
         },
         onTouchEnd(e) {
            if (!this.isDragging) return;
            const touch = [...e.changedTouches][0];
            const x =
               touch.pageX > this.dragWidth ? this.dragWidth : touch.pageX;
            const y = touch.pageY;
            this.refDrawer.onDragEnd(x, y);
            if (x > this.dragOpen) this.$root.navigation.openNavigationDrawer();
            this.isDragging = false;
         },

         emitCollapse() {
            this.$emit("click-collapse");
            this.expandedPageKey = "";
         },

         hasQueryKey(key) {
            const { query } = this.$route;
            return Object.keys(query).includes(key);
         },
         getQueryValue(key) {
            const { query } = this.$route;
            return query[key];
         },
         clickQuery(view) {
            const key = view.getParent().key;
            const nextValue = view.key;

            const currentValue = this.getQueryValue(key);
            if (currentValue === nextValue) return;

            console.log(this.hasQueryKey(""));

            if (
               (this.hasQueryKey("") && this.getQueryValue("") === undefined) ||
               (key === "" && nextValue === "")
            ) {
               this.$root.replaceRoute({});
               return;
            }

            const query = {};
            query[key] = nextValue;

            this.$root.replaceRoute({ query });
         },
      },
   };
</script>

<template>
   <Drawer
      ref="Drawer"
      :class="['LeftNav', !isWide ? 'LeftNav-isThin' : 'LeftNav-isWide']"
      :mode="drawerMode"
      :edge="drawerEdge"
      @click-collapse="emitCollapse()"
   >
      <div class="LeftNav-body" ref="Body">
         <div class="LeftNav-header">
            <router-link class="LeftNav-logo" :to="{ path: '/' }">
               <img
                  class="LeftNav-icon"
                  :src="
                     host.cloudinary({
                        url: 'logo/svg/freshnet-enterprise-logo.svg',
                     })
                  "
               />
               <span class="LeftNav-title">Freshnet Enterprise</span>
            </router-link>

            <button
               class="LeftNav-collapse"
               v-if="$root.navigation.isDrawer()"
               @click="() => $root.navigation.closeNavigationDrawer()"
            >
               <img :src="host.res('icon/arrowDown-000000.svg')" />
            </button>
         </div>

         <div class="LeftNav-navigations" v-if="navigations.length">
            <LeftNavGroup1
               v-for="group1 of navigations"
               :key="group1.key"
               :group1="group1"
               @click-group3="() => emitCollapse()"
            />
         </div>

         <LeftNavLogin
            v-if="$root.currentPageKey !== 'login'"
            @click-logout="$emit('click-logout')"
            :isWide="isWide"
         />
      </div>
   </Drawer>
</template>

<style lang="scss" scoped>
   .LeftNav {
      .LeftNav-body {
         width: 16rem;
         height: 100%;
         max-width: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         overflow-y: auto;
         overflow-x: hidden;
         background-color: #dfe8ee;
         background-color: hsl(0, 0%, 84%);
         position: relative;
         transition: var(--transition-duration);

         .LeftNav-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0.4rem;

            .LeftNav-logo {
               gap: 0.5rem;
               padding: 1rem;

               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;

               cursor: pointer;
               text-decoration: none;
               color: var(--primary-color);
               transition: var(--transition-duration);
               background: none;

               &:hover {
                  text-decoration: underline;
               }

               .LeftNav-icon {
                  transition: var(--transition-duration);
               }
               .LeftNav-title {
                  font-weight: 600;
                  line-height: 1;
                  color: black;
               }
            }
            .LeftNav-collapse {
               background: none;
               border: none;
               border-radius: 50%;
               padding: 0.8rem;
               display: flex;
               align-items: center;
               justify-content: center;
               cursor: pointer;
               img {
                  padding: 0.5rem;
                  width: 2rem;
                  height: 2rem;
                  transition: var(--transition-duration);
               }
               img {
                  transform: rotate(90deg);
               }
               &:hover {
                  img {
                     transform: scale(0.9) rotate(90deg);
                  }
               }
            }
         }

         .LeftNav-navigations {
            flex-grow: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 0.4em 0;
            padding-bottom: 4em;
         }
         .LeftNav-login {
            position: sticky;
            bottom: 0;
            width: 100%;
            box-shadow: 0px 0px 20px #49748940;
         }
      }

      .LeftNav-body {
         --scrollbar-size: 0.2rem;
         --scrollbar-thumb-radius: 0;
         --scrollbar-track-margin: 0;

         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.3);
         --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.2);

         scrollbar-width: var(--scrollbar-size);
         scrollbar-color: var(--scrollbar-thumb-color)
            var(--scrollbar-track-color);
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
   }

   .LeftNav-isWide {
      .LeftNav-body {
         .LeftNav-header {
            .LeftNav-logo {
               .LeftNav-icon {
                  width: 2rem;
                  height: 2rem;

                  width: 1.8rem;
                  height: 1.8rem;
               }
            }
         }
         .LeftNav-navigations {
            padding: 0.8em;
            padding-top: 0.8em;
            padding-bottom: 4em;
            align-items: flex-start;
         }
      }
   }
   .LeftNav-isThin {
      .LeftNav-body {
         width: fit-content;
         .LeftNav-header {
            gap: 0.5rem;
            .LeftNav-logo {
               .LeftNav-icon {
                  width: 1.3rem;
                  height: 1.3rem;
               }
               .LeftNav-title {
                  display: none;
               }
            }
         }
         .LeftNav-navigations {
            align-items: center;
            padding: 0.3em;
         }
      }
   }
</style>
