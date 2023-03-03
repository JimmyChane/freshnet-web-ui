<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import SearchInput from "@/components/SearchInput.vue";
   import ItemCustomerSearch from "./ItemCustomerSearch.vue";
   import Searcher from "@/tools/Searcher";

   export default {
      components: { NavigationBar, SearchInput, ItemCustomerSearch },
      props: {
         title: { type: String, default: "" },
         items: { type: Array, default: () => [] },
      },
      data: (c) => ({ results: [] }),
      methods: {
         searchResults(str) {
            return Searcher.withItems(this.items).search(str);
         },

         itemKey(item) {
            return `${this.itemName(item)}${this.itemPhoneNumberValue(item)}`;
         },
         itemName(item) {
            if (item) return item.name;
            return "";
         },
         itemPhoneNumberValue(item) {
            if (item && item.phoneNumber) return item.phoneNumber.value;
            return "";
         },
         itemPhoneNumberStr(item) {
            if (item && item.phoneNumber) return item.phoneNumber.toString();
            return "";
         },
      },
   };
</script>

<template>
   <NavigationBar
      :title="items.length ? '' : title"
      :rightMenus="[
         {
            title: 'Add',
            icon: host.icon('add-000000'),
            click: () => $emit('click-item-add'),
         },
         {
            title: 'Refresh',
            icon: host.icon('refresh-000000'),
            click: () => $emit('click-refresh'),
         },
      ]"
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
</template>

<style lang="scss" scoped>
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
</style>
