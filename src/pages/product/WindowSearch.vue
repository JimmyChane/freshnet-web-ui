<script>
   import WindowSearch from "@/components/WindowSearch.vue";
   import ItemSearchProduct from "./ItemSearchProduct.vue";

   export default {
      components: { WindowSearch, ItemSearchProduct },
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
      ref="windowSearch"
      :isShowing="isShowing"
      placeholder="Search products"
      @input-text="(text) => (search = text)"
      @click-dismiss="() => clickDismiss()"
   >
      <ItemSearchProduct
         class="ActionbarProduct-search-item"
         v-for="item in results"
         :key="item.id"
         :item="item"
      />
   </WindowSearch>
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
