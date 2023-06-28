<script>
   import PanelSearch from "@/components/panel/PanelSearch.vue";
   import ItemSearchProduct from "./ItemSearchProduct.vue";

   export default {
      components: { PanelSearch, ItemSearchProduct },
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
            this.results = this.inputText(this.search);
         },
      },
      methods: {
         blur() {
            this.$refs.windowSearch.blur();
         },
         focus() {
            this.$refs.windowSearch.focus();
         },

         inputText(text) {
            const str = text;

            if (!str) return [];

            const strs = str
               .toLowerCase()
               .split(/[\s,]+/)
               .filter((text) => text);

            return this.items
               .reduce((results, product) => {
                  try {
                     const count = product.toCount(strs);
                     if (count > 0) results.push({ count, product });
                  } catch (error) {
                     console.error("one of search result failed");
                     console.error(error);
                  }
                  return results;
               }, [])
               .sort((result1, result2) => result2.count - result1.count)
               .map((result) => result.product);
         },
         clickDismiss() {
            this.blur();
            this.popupWindow.close();
         },
      },
      mounted() {
         this.results = this.inputText(this.search);
         this.focus();
      },
   };
</script>

<template>
   <PanelSearch
      class="WindowSearch"
      ref="windowSearch"
      placeholder="Search products"
      @input-text="(text) => (search = text)"
      @click-dismiss="() => clickDismiss()"
   >
      <ItemSearchProduct
         class="ActionbarProduct-search-item"
         v-for="item in results"
         :key="item.id"
         :item="item"
         @click="() => clickDismiss()"
      />
   </PanelSearch>
</template>

<style lang="scss" scoped>
   .ActionbarProduct-search-item-link {
      text-decoration: none;
      display: flex;
      width: 100%;
      .ActionbarProduct-search-item {
         width: 100%;
      }
   }
</style>
