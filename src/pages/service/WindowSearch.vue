<script>
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import SearchInput from "@/components/SearchInput.vue";

   import ItemService from "./item-service/ItemService.vue";

   import WindowSearch from "@/components/WindowSearch.vue";

   export default {
      components: { WindowSearch, PopupWindow, Actionbar, SearchInput, ItemService },
      props: {
         isShowing: { type: Boolean, default: false },
         items: { type: Array, default: () => [] },
      },
      data: (c) => ({ search: "", results: [] }),
      watch: {
         search() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.results = [];
            this.results = this.inputText(this.search);
         },

         inputText(text) {
            const strs = text
               .toLowerCase()
               .split(/[\s,]+/)
               .filter((text) => text.trim().replace(" ", "").length);

            if (!strs.length) return [];

            let countHighest = 0;

            let filters = this.items.reduce((filters, item) => {
               try {
                  const count = item.toCount(strs);
                  if (count < 1) return filters;
                  if (countHighest < count) countHighest = count;
                  filters.push({ count, item });
               } catch (error) {
                  console.error(error);
               }

               return filters;
            }, []);

            if (filters.length > 10) {
               const valueToPass = countHighest / 2;
               filters = filters.filter((filter) => filter.count >= valueToPass);
            }

            return filters
               .sort((filter1, filter2) => filter2.count - filter1.count)
               .map((filter) => filter.item);
         },
         clickItem(item) {
            this.$emit("click-dismiss");
            this.$emit("click-item", item);
         },
         clickDismiss() {
            this.$emit("click-dismiss");
         },
      },
   };
</script>

<template>
   <WindowSearch
      class="WindowSearch"
      :isShowing="isShowing"
      placeholder="Search services"
      @input-text="(text) => (search = text)"
      @click-dismiss="() => clickDismiss()"
   >
      <ItemService
         v-for="item in results"
         :key="item.id"
         :item="item"
         @click="() => clickItem(item)"
      />
   </WindowSearch>
</template>
