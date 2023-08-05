<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import SearchInput from "@/components/SearchInput.vue";
  import ItemCustomerSearch from "./ItemCustomerSearch.vue";
  import Searcher from "@/tools/Searcher";
  import TabLayout from "@/components/tabLayout/TabLayout.vue";
  import U from "@/U";

  export default {
    components: { NavigationBar, SearchInput, ItemCustomerSearch, TabLayout },
    props: {
      title: { type: String, default: "" },
      items: { type: Array, default: () => [] },
    },
    data: (c) => ({ results: [] }),
    computed: {
      filter: (c) => U.optString(c.$route.query.filter),
      list: (c) => {
        switch (c.filter) {
          case "service":
            return c.listService;
          case "order":
            return c.listOrder;
          default:
            return c.items;
        }
      },

      listService: (c) => c.items.filter((item) => item.services.length),
      listOrder: (c) => c.items.filter((item) => item.orders.length),

      navigationMenus: (c) => {
        return [
          {
            title: "Add",
            icon: c.host.icon("add-000000").toUrl(),
            click: () => c.$emit("click-item-add"),
          },
          {
            title: "Refresh",
            icon: c.host.icon("refresh-000000").toUrl(),
            click: () => c.$emit("click-refresh"),
          },
        ];
      },
      tabLayoutMenus: (c) => {
        return [
          { key: "", title: "All", count: c.items.length },
          {
            key: "service",
            title: "From Services",
            count: c.listService.length,
          },
          {
            key: "order",
            title: "From Orders",
            count: c.listOrder.length,
          },
        ].map((menu) => {
          menu.isSelected = (menu) => c.filter === menu.key;
          menu.click = (menu) => {
            c.store.getters.replaceQuery({ query: { filter: menu.key } });
          };
          return menu;
        });
      },
    },
    methods: {
      searchResults(str) {
        return Searcher.withItems(this.items).search(str);
      },

      itemKey(item) {
        return `${this.itemName(item)}${this.itemPhoneNumberValue(item)}`;
      },
      itemName(item) {
        return item?.name ?? "";
      },
      itemPhoneNumberValue(item) {
        return item?.phoneNumber?.value ?? "";
      },
      itemPhoneNumberStr(item) {
        return item?.phoneNumber?.toString();
      },
    },
  };
</script>

<template>
  <div class="PanelCustomers-Actionbar">
    <NavigationBar
      class="PanelCustomers-navigationbar"
      :title="items.length ? '' : title"
      :rightMenus="navigationMenus"
    >
      <SearchInput
        class="Actionbar-search"
        v-if="items.length"
        placeholder="Search customers & devices"
        :list="results"
        @callback-search="(str) => (results = searchResults(str))"
        v-slot="{ collapse }"
      >
        <router-link
          class="Actionbar-search-link transition"
          v-for="item in results"
          :key="itemKey(item)"
          :to="{
            query: {
              name: itemName(item),
              phoneNumber: itemPhoneNumberValue(item),
            },
          }"
          @click="() => collapse()"
        >
          <ItemCustomerSearch :item="item" />
        </router-link>
      </SearchInput>
    </NavigationBar>

    <TabLayout
      class="PanelCustomers-tabLayout"
      :isScreenWide="true"
      :menus="tabLayoutMenus"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PanelCustomers-Actionbar {
    height: max-content;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid hsl(0, 0%, 90%);

    .PanelCustomers-navigationbar {
      z-index: 2;
      border: none;

      .Actionbar-search {
        .Actionbar-search-link {
          text-decoration: none;
          color: inherit;
          text-align: start;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          border-radius: 0.6rem;
          background: none;
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
    .PanelCustomers-tabLayout {
      z-index: 1;
      padding: 0.3rem 1rem;
      padding-top: 0;
      padding-right: 2rem;
    }
  }
</style>
