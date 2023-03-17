<script>
   import Drawer from "@/components/Drawer.vue";
   import LeftNavHeader from "./NavigationLeft-Header.vue";
   import Search from "./NavigationLeft-Search.vue";
   import LeftNavGroup1 from "./NavigationLeft-Group1.vue";
   import LeftNavLogin from "./NavigationLeft-Login.vue";

   export default {
      components: { Drawer, LeftNavHeader, Search, LeftNavGroup1, LeftNavLogin },
      emits: ["click-logout"],
      data: (c) => ({
         isDragging: false,
         dragTrigger: 20,
         dragOpen: 80,
         dragWidth: 0,
      }),
      computed: {
         isWide: (c) => c.$root.navigation.isWide(),
         isDrawer: (c) => c.$root.navigation.isDrawer(),
         isExpand: (c) => c.$root.navigation.isExpanded(),
         selectedPageKey: (c) => c.$root.currentPageKey,
         selectedViewKey: (c) => c.$root.currentViewKey,

         drawerMode() {
            if (!this.isDrawer) return Drawer.Mode.FIXED;
            return this.isExpand
               ? Drawer.Mode.DRAWER_EXPAND
               : Drawer.Mode.DRAWER_COLLAPSE;
         },
         drawerEdge: () => Drawer.Edge.LEFT,

         navigations() {
            const navigations = this.$root.pages;

            navigations.forEach((nav) => {
               nav.isExpanded = () => this.expandedPageKey === nav.key;
               nav.isSelected = () => this.selectedPageKey === nav.key;
               nav.isWide = () => this.isWide;
               nav.clickExpand = () => {
                  this.expandedPageKey = this.expandedPageKey === nav.key ? "" : nav.key;
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

         refDrawer: (c) => c.$refs.Drawer,
         refBody: (c) => c.$refs.Body,
      },
      watch: {
         isExpand() {
            if (this.isExpand) this.focus();
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
            const x = touch.pageX > this.dragWidth ? this.dragWidth : touch.pageX;
            const y = touch.pageY;
            this.refDrawer.onDragMove(x, y);
         },
         onTouchEnd(e) {
            if (!this.isDragging) return;
            const touch = [...e.changedTouches][0];
            const x = touch.pageX > this.dragWidth ? this.dragWidth : touch.pageX;
            const y = touch.pageY;
            this.refDrawer.onDragEnd(x, y);
            if (x > this.dragOpen) {
               this.$root.navigation.openNavigationDrawer();
               this.focus();
            }
            this.isDragging = false;
         },

         emitCollapse() {
            this.$root.navigation.closeNavigationDrawer();
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

         focus() {
            this.$refs.search.focus();
         },
      },
   };
</script>

<template>
   <Drawer
      ref="Drawer"
      :class="[
         'NavigationLeft',
         !isWide ? 'NavigationLeft-isThin' : 'NavigationLeft-isWide',
      ]"
      :mode="drawerMode"
      :edge="drawerEdge"
      @click-collapse="() => emitCollapse()"
   >
      <div class="NavigationLeft-body scrollbar transition" ref="Body">
         <LeftNavHeader :isWide="isWide" />

         <Search ref="search" v-if="isWide" :isWide="isWide" />

         <div class="NavigationLeft-navigations" v-if="navigations.length">
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
   .NavigationLeft {
      .NavigationLeft-body {
         width: 18rem;
         height: 100%;
         max-width: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         overflow-y: auto;
         overflow-x: hidden;
         background-color: hsl(0, 0%, 84%);
         position: relative;

         .NavigationLeft-navigations {
            flex-grow: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 0.2em;
            padding-bottom: 4em;
         }
         .NavigationLeft-login {
            position: sticky;
            bottom: 0;
            width: 100%;
            box-shadow: 0px 0px 20px #49748940;
         }
      }

      .NavigationLeft-body {
         --scrollbar-size: 0.2rem;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.3);
         --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.2);
      }
   }

   .NavigationLeft-isWide {
      .NavigationLeft-body {
         .NavigationLeft-navigations {
            padding-top: 0.8em;
            align-items: flex-start;
         }
      }
   }
   .NavigationLeft-isThin {
      .NavigationLeft-body {
         width: fit-content;
         .NavigationLeft-navigations {
            align-items: center;
         }
      }
   }
</style>
