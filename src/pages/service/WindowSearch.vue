<script>
   import PanelSearch from "@/components/panel/PanelSearch.vue";
   import ItemService from "./item-service/ItemService.vue";

   export default {
      components: { PanelSearch, ItemService },
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({ search: "", results: [] }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         items: (c) => c.popupWindow.items,
      },
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
               filters = filters.filter(
                  (filter) => filter.count >= valueToPass,
               );
            }

            return filters
               .sort((filter1, filter2) => filter2.count - filter1.count)
               .map((filter) => filter.item);
         },
         clickItem(item) {
            this.popupWindow.close();
            this.popupWindow.clickItem(item);
         },
         clickDismiss() {
            this.popupWindow.close();
         },
      },
   };
</script>

<template>
   <PanelSearch
      :isShowing="isShowing"
      placeholder="Search services"
      @input-text="(text) => (search = text)"
      @click-dismiss="() => popupWindow.close()"
   >
      <ItemService
         v-for="item in results"
         :key="item.id"
         :item="item"
         @click="() => clickItem(item)"
      />
   </PanelSearch>
</template>
