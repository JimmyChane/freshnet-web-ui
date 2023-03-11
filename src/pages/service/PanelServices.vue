<script>
   import Actionbar from "./PageService-Actionbar.vue";
   import ListServices from "./ListServices.vue";

   import ModuleService from "@/items/data/Service.js";
   import ServiceStates from "@/objects/ServiceStates.js";
   import Empty from "@/components/Empty.vue";

   import U from "@/U.js";

   import PageService from "@/pages/service/PageService.vue";

   const { State } = ModuleService;

   export default {
      emits: ["click-service", "click-service-delete"],
      components: { Empty, Actionbar, ListServices },
      props: {
         menus: { type: Array, default: () => [] },
         services: { type: Array, default: () => [] },
         currentItem: { type: Object, default: () => null },
      },
      data: (c) => ({
         scrollTop: 0,

         stateMenuIndex: 0,
         currentLayoutIndex: 1,
         currentGroupIndex: 1,
         currentSortIndex: 0,

         stateMenus: [],
         layoutMenus: [],
         groupMenus: [],
         sortMenus: [],
      }),
      computed: {
         iconEmpty: () => PageService.icon.dark.toUrl(),

         items: (c) =>
            c.stateMenus[c.stateMenuIndex] ? c.stateMenus[c.stateMenuIndex].list : [],
         state: (c) => U.optString(c.$route.query.state),

         layoutMode: (c) => {
            if (c.currentLayoutIndex === 0) return ListServices.LayoutMode.Grid;
            if (c.currentLayoutIndex === 1) return ListServices.LayoutMode.List;
            if (c.currentLayoutIndex === 2) return ListServices.LayoutMode.Detail;
            return 0;
         },
         sortMode: (c) => {
            const menu = c.sortMenus.find((menu) => menu.isSelected());
            return menu ? menu.key : ListServices.SortMode.DateCreated;
         },
         groupMode: (c) => {
            const menu = c.groupMenus.find((menu) => menu.isSelected());
            return menu ? menu.key : ListServices.GroupMode.DateCreated;
         },
      },
      watch: {
         state() {
            this.invalidateState();
         },
         services() {
            this.invalidateList();
         },
      },
      methods: {
         setPageSelected(state) {
            const menu = this.stateMenus.find((menu) => menu.key === state);

            if (!menu && this.stateMenus.length && Object.keys(State).length) {
               this.$root.replaceRoute({
                  query: { state: State[Object.keys(State)[0]] },
               });
            }

            this.stateMenuIndex = this.stateMenus.indexOf(menu);
         },

         filterList(services, key) {
            const tab = this.stateMenus.find((tab) => tab.key === key);
            if (tab) tab.list = services.filter((service) => service.state === key);
         },

         invalidateList() {
            const services = Array.isArray(this.services) ? this.services : [];
            this.filterList(services, State.Pending);
            this.filterList(services, State.Waiting);
            this.filterList(services, State.Completed);
            this.filterList(services, State.Rejected);

            this.invalidateState();

            setTimeout(() => {
               if (this.$refs.PanelGroupServiceTabs) {
                  this.$refs.PanelGroupServiceTabs.scrollLeft = 0;
               }
            }, 2000);
         },
         invalidateState() {
            this.setPageSelected(this.state);
         },
      },
      mounted() {
         this.stateMenus = [
            State.Pending,
            State.Waiting,
            State.Completed,
            State.Rejected,
         ].map((stateKey) => {
            const resource = ServiceStates.findByKey(stateKey);
            const title = resource.title;
            const icon = resource.icon.color;
            const iconSelected = resource.icon.white;
            const primaryColor = resource.color;
            return {
               key: stateKey,
               title,
               icon,
               iconSelected,
               primaryColor,
               isPrimaryColorBright: true,
               list: [],
            };
         });
         this.layoutMenus = [
            {
               key: ListServices.LayoutMode.Grid,
               title: "Grid View",
               icon: this.host.icon("grid-000000"),
            },
            {
               key: ListServices.LayoutMode.List,
               title: "List View",
               icon: this.host.icon("list-000000"),
            },
            {
               key: ListServices.LayoutMode.Detail,
               title: "Detail View",
               icon: this.host.icon("detail-000000"),
            },
         ];
         this.groupMenus = [
            { key: ListServices.GroupMode.None, title: "None" },
            { key: ListServices.GroupMode.DateCreated, title: "Date" },
         ];
         this.sortMenus = [
            { key: ListServices.SortMode.DateCreated, title: "Date" },
            { key: ListServices.SortMode.Name, title: "Customer Name" },
            { key: ListServices.SortMode.PhoneNumber, title: "Phone Number" },
         ];

         for (const menu of this.stateMenus) {
            menu.isSelected = () => {
               const state = this.stateMenus[this.stateMenuIndex];
               if (!state) return false;
               return state.key === menu.key;
            };
            menu.click = () => {
               if (this.state === menu.key) return;
               this.$root.replaceRoute({ query: { state: menu.key } });
            };
         }
         for (const menu of this.layoutMenus) {
            menu.click = (menu) => {
               this.currentLayoutIndex = this.layoutMenus.indexOf(menu);
            };
         }
         for (const menu of this.groupMenus) {
            menu.click = () => {
               this.currentGroupIndex = this.groupMenus.indexOf(menu);
            };
            menu.isSelected = () => {
               return this.groupMenus.indexOf(menu) === this.currentGroupIndex;
            };
         }
         for (const menu of this.sortMenus) {
            menu.click = () => {
               this.currentSortIndex = this.sortMenus.indexOf(menu);
            };
            menu.isSelected = () => {
               return this.sortMenus.indexOf(menu) === this.currentSortIndex;
            };
         }

         this.invalidateList();
         this.invalidateState();
      },
   };
</script>

<template>
   <div class="PanelServices" @scroll="(e) => (scrollTop = e.target.scrollTop)">
      <Actionbar
         :class="[
            'PanelServices-actionbar',
            scrollTop > 0 ? 'PanelServices-actionbar-shadow' : '',
            'transition',
         ]"
         :menus="menus"
         :services="services"
         :stateMenus="stateMenus"
         :layoutMenus="layoutMenus"
         :layoutMenuIndex="currentLayoutIndex"
         :groupMenus="groupMenus"
         :groupMenuIndex="currentGroupIndex"
         :sortMenus="sortMenus"
         :sortMenuIndex="currentSortIndex"
         @click-service="(service) => $emit('click-service', service)"
         @click-search="() => $emit('click-search')"
      />

      <ListServices
         v-if="stateMenus[stateMenuIndex] && stateMenus[stateMenuIndex].list.length"
         :layoutMode="layoutMode"
         :sortMode="sortMode"
         :groupMode="groupMode"
         :items="items"
         :item="currentItem"
         @click-item="(item) => $emit('click-service', item)"
      />

      <Empty v-if="!items.length && !serviceStore.getters.isLoading" :icon="iconEmpty" />
   </div>
</template>

<style lang="scss" scoped>
   .PanelServices {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      overflow-y: auto;
      overflow-x: auto;
      padding-bottom: 4rem;

      --max-width: 60rem;

      .PanelServices-actionbar {
         z-index: 2;
         position: sticky;
         top: 0;
         left: 0;
         right: 0;
         width: 100%;
         flex-grow: 0;
         z-index: 2;
         border-bottom: 1px solid #e4e4e4;
      }
      .PanelServices-actionbar-shadow {
         border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
         border-bottom: 1px solid #acacac;
      }
   }
</style>
