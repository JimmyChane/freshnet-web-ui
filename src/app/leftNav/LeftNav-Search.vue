<script>
   import SearchInput from "@/components/SearchInput.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import ItemSearchProduct from "@/pages/home/ItemSearchProduct.vue";
   import ItemSearchCategory from "@/pages/home/ItemSearchCategory.vue";
   import ItemSearchBrand from "@/pages/home/ItemSearchBrand.vue";
   import ItemSearchPs2Disc from "@/pages/home/ItemSearchPs2Disc.vue";
   import ItemSearchService from "@/pages/home/ItemSearchService.vue";
   export default {
      props: { isWide: { type: Boolean, default: false } },
      components: {
         SearchInput,
         ButtonIcon,
         ItemSearchProduct,
         ItemSearchCategory,
         ItemSearchBrand,
         ItemSearchPs2Disc,
         ItemSearchService,
      },
      data() {
         return { searchText: "", searches: [] };
      },
      computed: {
         user: (c) => c.loginStore.getters.user,

         categories: (c) => c.categoryStore.getters.items,
         products: (c) => {
            return c.productStore.getters.items.filter((product) => {
               return product.isStockAvailable();
            });
         },
         brands: (c) => c.brandStore.getters.items,
         ps2Discs: (c) => c.ps2Store.getters.items,
         services: (c) => {
            if (c.user.isTypeNone()) return [];
            return c.serviceStore.getters.items;
         },
      },
      watch: {
         user() {
            if (!this.user.isTypeNone()) this.serviceStore.dispatch("getItems");
            this.search(this.searchText);
         },
      },
      mounted() {
         this.ps2Store.dispatch("getItems");
         this.brandStore.dispatch("getItems");
         this.categoryStore.dispatch("getItems");
         this.categoryStore.dispatch("refresh");
         this.productStore.dispatch("refresh");
         if (this.user.isTypeAdmin() || this.user.isTypeStaff())
            this.serviceStore.dispatch("getItems");
      },
      methods: {
         search(text) {
            text = this.searchText = text.toLowerCase();
            let texts = text
               .split(/[\s,]+/)
               .filter((text) => text.trim().length);

            let productSearches = this.products.map((product) => {
               return {
                  dataType: "product",
                  item: product,
                  count: product.toCount(texts),
               };
            });
            let categorySearches = this.categories.map((category) => {
               return {
                  dataType: "category",
                  item: category,
                  count: category.toCount(texts),
               };
            });
            let brandSearches = this.brands.map((brand) => {
               return {
                  dataType: "brand",
                  item: brand,
                  count: brand.toCount(texts),
               };
            });
            let ps2DiscSearches = this.ps2Discs.map((ps2Disc) => {
               return {
                  dataType: "ps2Disc",
                  item: ps2Disc,
                  count: ps2Disc.toCount(texts),
               };
            });
            let serviceSearches = this.services.map((service) => {
               return {
                  dataType: "service",
                  item: service,
                  count: service.toCount(texts),
               };
            });

            const searches = [
               ...productSearches,
               ...categorySearches,
               ...brandSearches,
               ...ps2DiscSearches,
               ...serviceSearches,
            ];
            const highCount = searches.reduce((highCount, x) => {
               return highCount < x.count ? x.count : highCount;
            }, 0);
            const valueToAccept = highCount * 0.5;

            if (valueToAccept)
               this.searches = searches
                  .filter((x) => x.count >= valueToAccept)
                  .sort((x1, x2) => x2.count - x1.count);
            else this.searches = [];
         },
      },
   };
</script>

<template>
   <div :class="['LeftNav-Search', isWide ? 'LeftNav-Search-isWide' : '']">
      <ButtonIcon
         class="LeftNav-Search-button"
         v-if="!isWide"
         :src="host.res('icon/search-000000.svg')"
         @click="()=>{
            $root.navigation.openNavigationDrawer();
            $root.navigation.disableNavigationDrawer();
         }"
      />
      <SearchInput
         class="LeftNav-Search-comp"
         v-else
         :list="searches"
         @callback-search="(text) => search(text)"
         v-slot="{ collapse }"
      >
         <div
            class="Home-actionbar-search-item"
            v-for="x in searches"
            :key="x.item.id"
         >
            <router-link
               class="Home-actionbar-search-item-button"
               v-if="x.dataType === 'product'"
               :to="{ path: '/product', query: { productId: x.item.id } }"
               @click.native="() => collapse()"
            >
               <ItemSearchProduct :item="x.item" />
            </router-link>

            <router-link
               class="Home-actionbar-search-item-button"
               v-if="x.dataType === 'category'"
               :to="{ path: '/product', query: { category: x.item.id } }"
               @click.native="() => collapse()"
            >
               <ItemSearchCategory :item="x.item" />
            </router-link>

            <router-link
               class="Home-actionbar-search-item-button"
               v-if="x.dataType === 'brand'"
               :to="{ path: '/product', query: { brand: x.item.id } }"
               @click.native="() => collapse()"
            >
               <ItemSearchBrand :item="x.item" />
            </router-link>

            <router-link
               class="Home-actionbar-search-item-button"
               v-if="x.dataType === 'ps2Disc'"
               :to="{ path: '/ps2', query: { discCode: x.item.code } }"
               @click.native="() => collapse()"
            >
               <ItemSearchPs2Disc :item="x.item" />
            </router-link>

            <router-link
               class="Home-actionbar-search-item-button"
               v-if="x.dataType === 'service'"
               :to="{
                  path: '/manage/service',
                  query: { service: x.item.id },
               }"
               @click.native="() => collapse()"
            >
               <ItemSearchService :item="x.item" />
            </router-link>
         </div>
      </SearchInput>
   </div>
</template>

<style lang="scss" scoped>
   .LeftNav-Search {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: auto;
      .LeftNav-Search-comp {
         --background-color: hsl(0, 0%, 94%);
         --border-radius: 0.8rem;
         --border: 1px solid transparent;
         --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
         --dropdown-height: calc(100vh - 10rem);

         .Home-actionbar-search-item {
            width: 100%;
            display: flex;
            flex-direction: column;

            .Home-actionbar-search-item-button {
               width: 100%;
               display: flex;
               flex-direction: column;
               text-decoration: none;
               justify-content: center;
               align-items: flex-start;
               color: black;
               cursor: pointer;
               text-align: start;
               border: none;
               background: none;
               border-radius: 0.5em;
               transition: var(--transition-duration);

               &:hover {
                  background: rgba(255, 255, 255, 0.5);
               }
            }
         }
      }
   }
   .LeftNav-Search-isWide {
      margin: 0 1.2rem;
   }
</style>
