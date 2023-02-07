<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import SearchInput from "@/components/SearchInput.vue";
   import ItemSearchProduct from "./ItemSearchProduct.vue";
   import Searcher from "@/tools/Searcher";

   export default {
      components: { Actionbar, SearchInput, ItemSearchProduct },
      props: {
         products: { type: Array, default: () => [] },
         leftMenus: { default: () => null },
         rightMenus: { default: () => null },
      },
      data() {
         return { searchText: "" };
      },
      computed: {
         isOver550px: (c) => c.$root.window.innerWidth > 550,

         paths: (c) => c.$root.paths,
         lastPath() {
            let { paths } = this;
            if (!paths.length) return "";
            return paths[paths.length - 1];
         },
         productSearches() {
            return Searcher.withItems(this.products).search(this.searchText);

            const str = this.searchText;

            if (!str) return [];

            const strs = str
               .toLowerCase()
               .split(/[\s,]+/)
               .filter((text) => text);

            return this.products
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

         initLeftMenus() {
            const menus = [];

            if (Array.isArray(this.leftMenus)) menus.push(...this.leftMenus);
            if (
               !Array.isArray(this.leftMenus) &&
               this.leftMenus !== null &&
               this.leftMenus !== undefined
            ) {
               menus.push(this.leftMenus);
            }

            if (this.$root.navigation.isDrawer()) {
               menus.push({
                  key: "hamburgerMenu",
                  title: "Hamburger Menu",
                  icon: this.host.icon("hamburgerMenu-000000"),
                  click: () => this.$root.navigation.openNavigationDrawer(),
               });
               menus.push({
                  key: "home",
                  title: "Home",
                  icon: this.host.res("img/freshnet-enterprise-logo.svg"),
                  click: () => this.$router.push("/home"),
               });
            }

            return menus;
         },
         initRightMenus() {
            const menus = [];

            if (!this.isOver550px) {
               menus.push({
                  title: "Search",
                  icon: this.host.icon("search-000000"),
                  click: () => this.$emit("click-search"),
               });
            }
            if (Array.isArray(this.rightMenus)) menus.push(...this.rightMenus);
            if (
               !Array.isArray(this.rightMenus) &&
               this.rightMenus !== null &&
               this.rightMenus !== undefined
            ) {
               menus.push(this.rightMenus);
            }

            menus.push({
               key: "refresh",
               title: "Refresh",
               icon: this.host.icon("refresh-000000"),
               click: () => {
                  this.categoryStore.dispatch("refresh");
                  this.productStore.dispatch("refresh");
               },
            });

            return menus;
         },
      },
   };
</script>

<template>
   <Actionbar
      class="ActionbarProduct"
      :leftMenus="initLeftMenus"
      :rightMenus="initRightMenus"
   >
      <SearchInput
         v-if="isOver550px"
         class="ActionbarProduct-search"
         placeholder="Search products"
         :list="productSearches"
         @callback-search="(text) => (searchText = text)"
         v-slot="{ list }"
      >
         <router-link
            class="ActionbarProduct-search-item-link"
            v-for="product in list"
            :key="product.id"
            :to="{ query: { productId: product.id } }"
         >
            <ItemSearchProduct
               class="ActionbarProduct-search-item"
               :item="product"
            />
         </router-link>
      </SearchInput>
   </Actionbar>
</template>

<style lang="scss" scoped>
   .ActionbarProduct {
      .ActionbarProduct-search {
         flex-grow: 1;
         z-index: 1;
         max-width: 30rem;
         border: none;
         margin: auto;
         --border-radius: 2rem;

         .ActionbarProduct-search-item-link {
            text-decoration: none;
            display: flex;
            width: 100%;
            .ActionbarProduct-search-item {
               width: 100%;
            }
         }
      }
   }
</style>
