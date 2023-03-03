<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import SearchInput from "@/components/SearchInput.vue";
   import ItemSearch from "./ItemOrderSearch.vue";
   import Searcher from "@/tools/Searcher";

   export default {
      components: { NavigationBar, SearchInput, ItemSearch },
      props: {
         title: { type: String, default: "" },
         items: { type: Array, default: () => [] },
      },
      data: (c) => ({ results: [] }),
      methods: {
         searchResults(str) {
            return Searcher.withItems(this.items).search(str);
         },
      },
   };
</script>

<template>
   <NavigationBar
      :title="items.length ? '' : title"
      :rightMenus="[
         {
            key: 'appendOrder',
            title: 'Append Order',
            icon: host.icon('add-000000'),
            click: () => $emit('click-item-add'),
         },
         {
            key: 'refresh',
            title: 'Refresh',
            icon: host.icon('refresh-000000'),
            click: () => $emit('click-refresh'),
         },
      ]"
   >
      <SearchInput
         class="Actionbar-search"
         v-if="items.length"
         placeholder="Search orders"
         :list="results"
         @callback-search="(str) => (results = searchResults(str))"
         v-slot="{ collapse }"
      >
         <button
            class="Actionbar-search-button transition"
            v-for="item in results"
            :key="item.id"
            @click="
               () => {
                  collapse();
                  $emit('click-item', item);
               }
            "
         >
            <ItemSearch :item="item" />
         </button>
      </SearchInput>
   </NavigationBar>
</template>

<style lang="scss" scoped>
   .Actionbar-search {
      .Actionbar-search-button {
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
</style>
