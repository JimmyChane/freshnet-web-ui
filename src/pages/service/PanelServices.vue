<script>
   import Actionbar from "./PanelServices-Actionbar.vue";
   import ListServices from "./ListServices.vue";
   import Empty from "@/components/Empty.vue";
   import PageService from "@/pages/service/PageService.vue";

   import U from "@/U";
   import ServiceState from "@/items/ServiceState";

   export default {
      emits: ["click-add", "click-import", "click-service"],
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

         items: (c) => c.stateMenus[c.stateMenuIndex]?.list ?? [],

         layoutMode: (c) => {
            if (c.currentLayoutIndex === 0) return ListServices.LayoutMode.Grid;
            if (c.currentLayoutIndex === 1) return ListServices.LayoutMode.List;
            if (c.currentLayoutIndex === 2)
               return ListServices.LayoutMode.Detail;
            return 0;
         },
         sortMode: (c) => {
            const menu = c.sortMenus.find((menu) => menu.isSelected());
            return menu?.key ?? ListServices.SortMode.DateCreated;
         },
         groupMode: (c) => {
            const menu = c.groupMenus.find((menu) => menu.isSelected());
            return menu?.key ?? ListServices.GroupMode.DateCreated;
         },

         currentUser: (c) => c.loginStore.getters.user,
         isCurrentUserAdmin: (c) => c.currentUser.isTypeAdmin(),
         isCurrentUserDefault: (c) => c.currentUser.isDefault(),

         currentState: (c) => U.optString(c.$route.query.state),
         isCurrentStatePending: (c) => c.currentState === "pending",
      },
      watch: {
         currentState(previous, next) {
            this.invalidateState();
         },
         services() {
            this.invalidateList();
         },
      },
      methods: {
         setPageSelected(state) {
            const menu = this.stateMenus.find((menu) => menu.key === state);

            const states = ServiceState.map((state) => state);
            if (!menu && this.stateMenus.length && states.length) {
               this.store.getters.replaceQuery({ query: { state: states[0].key } });
            }

            this.stateMenuIndex = this.stateMenus.indexOf(menu);

            if (this.currentState === state) return;

            this._self.$el.scrollTop = 0;
         },

         filterList(services, key) {
            const tab = this.stateMenus.find((tab) => tab.key === key);
            if (tab)
               tab.list = services.filter((service) => service.state === key);
         },

         invalidateList() {
            const services = Array.isArray(this.services) ? this.services : [];
            ServiceState.map((state) => {
               this.filterList(services, state.key);
            });

            this.invalidateState();

            setTimeout(() => {
               if (this.$refs.PanelGroupServiceTabs) {
                  this.$refs.PanelGroupServiceTabs.scrollLeft = 0;
               }
            }, 2000);
         },
         invalidateState() {
            this.setPageSelected(this.currentState);
         },
      },
      mounted() {
         this.stateMenus = ServiceState.map((state) => {
            return {
               key: state.key,
               title: state.title,
               icon: state.icon.color,
               iconSelected: state.icon.white,
               primaryColor: state.primaryColor,
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
               if (this.currentState === menu.key) return;
               this.store.getters.replaceQuery({ query: { state: menu.key } });
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
         :class="['PanelServices-actionbar', 'transition']"
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

      <div class="PanelServices-toolbar" v-if="isCurrentStatePending">
         <button @click="() => $emit('click-add')">Add Service</button>
         <button @click="() => $emit('click-import')" v-if="isCurrentUserAdmin"
            >Import Service</button
         >
      </div>

      <ListServices
         v-if="
            stateMenus[stateMenuIndex] && stateMenus[stateMenuIndex].list.length
         "
         :layoutMode="layoutMode"
         :sortMode="sortMode"
         :groupMode="groupMode"
         :items="items"
         :item="currentItem"
         @click-item="(item) => $emit('click-service', item)"
      />

      <Empty
         v-if="!items.length && !serviceStore.getters.isLoading"
         :icon="iconEmpty"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PanelServices {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
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
      .PanelServices-toolbar {
         width: 100%;
         max-width: 34rem;
         min-height: 4.5rem;
         padding: 1rem;
         gap: 0.2rem;

         display: flex;
         flex-direction: row;
         align-items: stretch;
         justify-content: space-between;

         & > * {
            border-radius: 1rem;
            background: none;
            background: hsl(0, 0%, 98%);
            border: 1px solid hsl(0, 0%, 75%);
            font-size: 0.7rem;

            cursor: pointer;

            flex-grow: 1;

            transition: all 0.2s;

            &:hover {
               background: white;
            }
         }
      }
   }
</style>
