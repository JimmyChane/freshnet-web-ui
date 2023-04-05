<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import SearchInput from "@/components/SearchInput.vue";
   import LayoutViewSelector from "@/pages/service/PageService-LayoutViewSelector.vue";
   import LabelMenus from "@/components/LabelMenus.vue";

   import ItemService from "./item-service/ItemService.vue";
   import chroma from "chroma-js"; 
   import Searcher from "@/tools/Searcher";
   import Tab from "./PageService-Actionbar-Tab.vue";

   export default {
      components: {
         NavigationBar,
         SearchInput,
         LayoutViewSelector,
         LabelMenus,
         ItemService,
         Tab,
      },
      emits: ["click-service"],
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
      data: (c) => ({ results: [], primaryColorLabel: chroma("black") }),
      computed: {
         isWide: (c) => c.$root.window.innerWidth > 400,
         currentGroupMenu: (c) => c.groupMenus[c.groupMenuIndex],
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
   <div class="PageServiceActionbar">
      <NavigationBar
         class="PageServiceActionbar-top"
         :rightMenus="[
            isWide
               ? null
               : {
                    title: 'Search',
                    icon: host.icon('search-000000'),
                    click: () => $emit('click-search'),
                 },
            ...menus,
         ]"
      >
         <SearchInput
            class="PageServiceActionbar-SearchInput"
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
      </NavigationBar>

      <div class="PageServiceActionbar-toolbar scrollbar">
         <div>
            <LayoutViewSelector :menus="layoutMenus" :index="layoutMenuIndex" />
            <LabelMenus
               title="Group"
               :style="{ '--primary-color': primaryColorLabel.toString() }"
               :primaryColor="primaryColorLabel"
               :menu="currentGroupMenu ? currentGroupMenu : null"
               :menus="groupMenus"
            />
            <LabelMenus
               title="Sort"
               :style="{ '--primary-color': primaryColorLabel.toString() }"
               :primaryColor="primaryColorLabel"
               :menu="currentSortMenu ? currentSortMenu : null"
               :menus="sortMenus"
            />
         </div>
      </div>

      <div class="PageServiceActionbar-tabs">
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
   .PageServiceActionbar {
      height: max-content;
      background-color: #f3f3f3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .PageServiceActionbar-top {
         z-index: 3;
         max-width: var(--max-width);

         .PageServiceActionbar-SearchInput {
            z-index: 3;
            width: 100%;
            padding: 0;
            flex-grow: 2;
         }
      }

      .PageServiceActionbar-toolbar {
         width: 100%;
         padding: 0.3rem 1rem;

         z-index: 2;

         display: flex;
         flex-direction: column;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: center;
         overflow-x: auto;

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

      .PageServiceActionbar-tabs {
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
