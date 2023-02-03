<script>
   import ActionbarMenus from "@/components/actionbar/ActionbarMenus.vue";
   import SearchInput from "@/components/SearchInput.vue";
   import LayoutViewSelector from "@/pages/service/PageService-LayoutViewSelector.vue";
   import LabelMenus from "@/components/LabelMenus.vue";

   import ItemService from "./ItemService.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/
   import Searcher from "@/tools/Searcher";
   import Tab from "./PageService-Actionbar-Tab.vue";

   export default {
      components: {
         ActionbarMenus,
         SearchInput,
         LayoutViewSelector,
         LabelMenus,
         ItemService,
         Tab,
      },
      emits: ["click-drawer-expand", "click-service"],
      props: {
         title: { type: String, default: "" },
         menus: { type: Array, default: () => [] },

         services: { type: Array, default: () => [] },

         stateMenus: { type: Array, default: () => [] },

         layoutMenus: { type: Array, default: () => [] },
         layoutMenuIndex: { type: Number, default: -1 },

         groupMenus: { type: Array, default: () => [] },
         groupMenuIndex: { type: Number, default: -1 },

         sortMenus: { type: Array, default: () => [] },
         sortMenuIndex: { type: Number, default: -1 },
      },
      data() {
         return { results: [], primaryColorLabel: chroma("black") };
      },
      computed: {
         isWide: (c) => c.$root.window.innerWidth > 600,
         currentGroupMenu: (c) => c.groupMenus[c.sortMenuIndex],
         currentSortMenu: (c) => c.sortMenus[c.sortMenuIndex],
      },
      methods: {
         searchResults(str) {
            return Searcher.withItems(this.services).search(str);
         },
      },
   };
</script>

<template>
   <div class="Actionbar">
      <div class="Actionbar-top">
         <div>
            <ActionbarMenus
               class="Actionbar-leftMenus"
               v-if="$root.navigation.isDrawer()"
               :menus="[
                  {
                     key: 'hamburgerMenu',
                     title: 'Hamburger Menu',
                     icon: host.res('icon/hamburgerMenu-000000.svg'),
                     click: () => $emit('click-drawer-expand'),
                  },
               ]"
            />

            <SearchInput
               class="Actionbar-SearchInput"
               v-if="isWide && services.length"
               placeholder="Search services"
               :list="results"
               @callback-search="(strs) => (results = searchResults(strs))"
               v-slot="{ collapse }"
            >
               <ItemService
                  v-for="item in results"
                  :key="item.id"
                  :item="item"
                  @click="
                     () => {
                        collapse();
                        $emit('click-service', item);
                     }
                  "
               />
            </SearchInput>

            <ActionbarMenus
               class="Actionbar-rightMenus"
               v-if="menus.length"
               :menus="[
                  isWide
                     ? null
                     : {
                          title: 'Search',
                          icon: host.res('icon/search-000000.svg'),
                          click: () => $emit('click-search'),
                       },
                  ...menus,
               ]"
            />
         </div>
      </div>

      <div class="Actionbar-toolbar">
         <div>
            <LayoutViewSelector :menus="layoutMenus" :index="layoutMenuIndex" />
            <LabelMenus
               title="Group"
               :style="{ '--primary-color': primaryColorLabel.toString() }"
               :primaryColor="primaryColorLabel"
               :menu="currentGroupMenu ? currentGroupMenu : null"
               :menus="groupMenus"
            />
            <!-- <LabelMenus
               title="Sort"
               :style="{ '--primary-color': primaryColorLabel.toString() }"
               :primaryColor="primaryColorLabel"
               :menu="currentSortMenu ? currentSortMenu : null"
               :menus="sortMenus"
            /> -->
         </div>
      </div>

      <div class="Actionbar-tabs">
         <div>
            <Tab
               v-for="stateMenu of stateMenus"
               :key="stateMenu.title"
               :item="stateMenu"
               :isWide="isWide"
            />
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .Actionbar {
      height: max-content;
      background-color: #f3f3f3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .Actionbar-top {
         z-index: 3;
         width: 100%;

         padding: 0 1rem;

         display: flex;
         flex-direction: column;
         align-items: center;

         & > * {
            width: 100%;
            max-width: var(--max-width);
            padding: 0.3rem 0;
            gap: 0.5rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            .Actionbar-SearchInput {
               z-index: 3;
               width: 100%;
               padding: 0;
               flex-grow: 2;
            }
            .Actionbar-leftMenus {
               flex-grow: 0;
            }
            .Actionbar-rightMenus {
               flex-grow: 1;
            }
         }
      }

      .Actionbar-toolbar {
         width: 100%;
         padding: 0.3rem 1rem;

         z-index: 2;

         display: flex;
         flex-direction: column;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: center;

         & > * {
            width: 100%;
            max-width: var(--max-width);
            gap: 0.5rem;

            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            // justify-content: space-between;
            justify-content: flex-start;
         }
      }

      .Actionbar-tabs {
         z-index: 1;
         width: 100%;
         padding: 0 1rem;
         overflow-x: auto;

         --scrollbar-size: 0.2rem;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.05);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.1);
         --scrollbar-track-color: transparent;
         --scrollbar-track-color-hover: transparent;
         --scrollbar-track-margin: 1rem;

         display: flex;
         flex-direction: column;
         align-items: center;

         & > * {
            width: 100%;
            max-width: var(--max-width);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
         }
      }
   }
</style>
