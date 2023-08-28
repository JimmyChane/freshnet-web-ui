<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import SearchInput from "@/components/SearchInput.vue";
  import LayoutViewSelector from "@/pages/service/PageService-LayoutViewSelector.vue";
  import LabelMenus from "@/components/LabelMenus.vue";

  import ItemService from "./item-service/ItemService.vue";
  import chroma from "chroma-js";
  import Searcher from "@/tools/Searcher";

  import TabLayout from "@/components/tabLayout/TabLayout.vue";

  export default {
    components: {
      NavigationBar,
      SearchInput,
      LayoutViewSelector,
      LabelMenus,
      ItemService,
      TabLayout,
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
      isOver350: (c) => c.$store.getters.window.innerWidth > 350,
      isOver550: (c) => c.$store.getters.window.innerWidth > 550,
      currentGroupMenu: (c) => c.groupMenus[c.groupMenuIndex],
      currentSortMenu: (c) => c.sortMenus[c.sortMenuIndex],

      tabLayoutMenus: (c) => {
        return c.stateMenus.map((stateMenu) => {
          return {
            title: stateMenu.title,
            icon: stateMenu.isSelected()
              ? stateMenu.iconSelected
              : stateMenu.icon,
            count: stateMenu.list.length,
            primaryColor: stateMenu.primaryColor,
            isSelected: (menu) => {
              return stateMenu.isSelected();
            },
            click: (menu) => {
              stateMenu.click();
            },
          };
        });
      },
    },
    methods: {
      searchResults(str) {
        return Searcher.withItems(this.services).search(str);
      },
    },
  };
</script>

<template>
  <div class="PanelServices-Actionbar">
    <NavigationBar
      class="PanelServices-Actionbar-top"
      :rightMenus="[
        isOver350
          ? null
          : {
              title: 'Search',
              icon: host.icon('search-000000').toUrl(),
              click: () => $emit('click-search'),
            },
        ...menus,
      ]"
    >
      <SearchInput
        class="PanelServices-Actionbar-SearchInput"
        v-if="isOver350 && services.length"
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

    <TabLayout
      class="PanelServices-Actionbar-tabs"
      :isScreenWide="isOver550"
      :menus="tabLayoutMenus"
    />

    <!-- <div class="PanelServices-Actionbar-toolbar scrollbar">
         <div>
            <LayoutViewSelector :menus="layoutMenus" :index="layoutMenuIndex" />
            <div class="PanelServices-Actionbar-toolbar-menus">
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
      </div> -->
  </div>
</template>

<style lang="scss" scoped>
  .PanelServices-Actionbar {
    height: max-content;
    background: #f3f3f3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .PanelServices-Actionbar-top {
      z-index: 3;
      max-width: var(--max-width);

      .PanelServices-Actionbar-SearchInput {
        z-index: 3;
        width: 100%;
        padding: 0;
        flex-grow: 2;
      }
    }
    .PanelServices-Actionbar-tabs {
      padding: 0.3rem 1rem;
      padding-right: 2rem;
    }
    .PanelServices-Actionbar-toolbar {
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
        justify-content: flex-start;
      }

      .PanelServices-Actionbar-toolbar-menus {
        gap: 0.5rem;

        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>
