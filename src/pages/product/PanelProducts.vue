<script>
   import Empty from "@/components/Empty.vue";
   import LoadingDots from "@/components/LoadingDots.vue";
   import LabelMenus from "@/components/LabelMenus.vue";
   import Footer from "@/app/footer/Footer.vue";

   import ActionbarProduct from "./ActionBarProduct.vue";
   import ItemProduct from "./ItemProduct.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   import PageProduct from "@/pages/product/PageProduct.vue";

   class MenuGroup {
      context = null;
      key = "";
      title = "";
      menus = [];

      menu = null;

      constructor(context, key = "", title = "", menus = []) {
         this.context = context;
         this.key = key;
         this.title = title;
         this.menus = menus;

         for (const menu of this.menus) {
            menu.click = () => {
               this.menu = menu;
               const query = {};
               query[this.key] = menu.key;

               if (this.context.$route.query[this.key] !== menu.key) {
                  this.context.$root.replaceRoute({ query });
               }
            };

            if (this.context.$route.query[this.key] === menu.key) {
               this.menu = menu;
            }
         }

         if (this.menu === null) {
            this.menu = this.menus[0];
         }
      }
   }

   export default {
      emits: ["click-productAdd"],
      components: {
         ActionbarProduct,
         ItemProduct,
         LabelMenus,
         Empty,
         LoadingDots,
         Footer,
      },
      props: { products: { type: Array, default: () => [] } },
      data() {
         return {
            labelMenuPrimaryColor: chroma("000000"),

            scrollTop: 0,
            currentProductId: "",

            filterMenuGroups: [],
         };
      },
      computed: {
         iconEmpty: () => PageProduct.icon.dark.toUrl(),

         isLayoutThin() {
            return this.$root.window.innerWidth < 550;
         },
         layoutMode() {
            return this.isLayoutThin
               ? ItemProduct.Mode.List
               : ItemProduct.Mode.Grid;
         },

         isLoading: (context) => context.productStore.getters.isLoading,
         isEditable() {
            const { user } = this.loginStore.getters;
            return user.isTypeAdmin() || user.isTypeStaff();
         },
         categoryKey: (c) => c.$route.params.category,
         productId: (c) => c.$route.query.productId,

         initRightMenus() {
            if (!this.isEditable) return null;
            return {
               title: "Add",
               icon: this.host.icon("add-000000"),
               click: () => this.$emit("click-productAdd"),
            };
         },

         productFilters() {
            const queries = this.filterMenuGroups
               .map((menuGroup) => {
                  return {
                     key: menuGroup.key,
                     value: menuGroup.menu ? menuGroup.menu.key : "",
                  };
               })
               .reduce((queries, query) => {
                  queries[query.key] = query.value;
                  return queries;
               }, {});

            const { category, brand, stock } = queries;

            return this.products
               .filter((product) => {
                  return !category || product.categoryId === category;
               })
               .filter((product) => {
                  return !brand || product.brandId === brand;
               })
               .filter((product) => {
                  if (!this.isEditable) {
                     return product.isStockAvailable();
                  }
                  return stock === "all" || product.isStockAvailable();
               });
         },
      },
      watch: {
         productId() {
            if (!this.productId) {
               setTimeout(() => {
                  this.currentProductId = this.productId;
               }, 500);
            } else {
               this.currentProductId = this.productId;
            }
         },
         isEditable() {
            this.invalidate();
         },
         "categoryStore.getters.lastModified"() {
            this.invalidate();
         },
         "brandStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      created() {
         this.filterMenuGroups = [];
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const categoryGroups = await this.productStore.dispatch(
               "getGroupsByCategory",
            );
            const brandGroups = await this.productStore.dispatch(
               "getGroupsByBrand",
            );

            const categoryMenus = categoryGroups
               .filter((group) => {
                  return group.items.length > 0;
               })
               .sort((group1, group2) =>
                  group1.category.compare(group2.category),
               )
               .map((group) => {
                  return {
                     key: group.category.id,
                     title: group.category.title,
                     icon: group.category.icon
                        ? group.category.icon.toUrl()
                        : "",
                  };
               });
            const brandMenus = brandGroups
               .filter((group) => {
                  return group.brand && group.items.length > 0;
               })
               .map((group) => {
                  const { title, icon } = group.brand;

                  const iconUrl = icon ? icon.toUrl() : "";

                  if (iconUrl.length > 0) {
                     return { key: group.brand.id, icon: iconUrl };
                  } else {
                     return { key: group.brand.id, title };
                  }
               });

            const categoryMenuGroup = new MenuGroup(
               this,
               "category",
               "Category",
               [{ title: "All" }, ...categoryMenus],
            );
            const brandMenuGroup = new MenuGroup(this, "brand", "Brand", [
               { title: "All" },
               ...brandMenus,
            ]);

            this.filterMenuGroups = [];
            this.filterMenuGroups.push(categoryMenuGroup);
            this.filterMenuGroups.push(brandMenuGroup);
            if (this.isEditable) {
               this.filterMenuGroups.push(
                  new MenuGroup(this, "stock", "Stock", [
                     { key: "all", title: "All" },
                     { title: "Available" },
                  ]),
               );
            }

            // this.filterMenuGroups.push(
            // 	...[
            // 		new MenuGroup("Processor", [
            // 			{ title: "Intel Celeron" },
            // 			{ title: "Intel Pentium" },
            // 			{ title: "Intel Core i3" },
            // 			{ title: "Intel Core i5" },
            // 			{ title: "Intel Core i9" },
            // 			{ title: "AMD Althon Silver" },
            // 			{ title: "AMD Ryzen 3" },
            // 			{ title: "AMD Ryzen 5" },
            // 			{ title: "AMD Ryzen 7" },
            // 		]),
            // 		new MenuGroup("RAM", [
            // 			{ title: "16GB DDR4" },
            // 			{ title: "8GB DDR4" },
            // 			{ title: "4GB DDR4" },
            // 		]),
            // 		new MenuGroup("Storage", [
            // 			{ title: "All" },
            // 			{ title: "120GB SSD" },
            // 			{ title: "128GB SSD" },
            // 			{ title: "240GB SSD" },
            // 			{ title: "256GB SSD" },
            // 			{ title: "480GB SSD" },
            // 			{ title: "512GB SSD" },
            // 			{ title: "80GB HDD" },
            // 			{ title: "150GB HDD" },
            // 			{ title: "320GB HDD" },
            // 			{ title: "500GB HDD" },
            // 			{ title: "640GB HDD" },
            // 			{ title: "1TB HDD" },
            // 			{ title: "2TB HDD" },
            // 			{ title: "3TB HDD" },
            // 			{ title: "4TB HDD" },
            // 		]),
            // 		new MenuGroup("Size", [
            // 			{ title: "All" },
            // 			{ title: '12.5"' },
            // 			{ title: '13.1"' },
            // 			{ title: '14"' },
            // 			{ title: '15.6"' },
            // 		]),
            // 		new MenuGroup("Resolution & Display", [
            // 			{ title: "Full HD" },
            // 			{ title: "Full HD with Touch Screen" },
            // 			{ title: "HD" },
            // 			{ title: "HD with Touch Screen" },
            // 		]),
            // 		new MenuGroup("Graphic", [{ title: "RTX 3060" }]),
            // 	],
            // );
         },
      },
   };
</script>

<template>
   <div
      class="PanelProducts"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <ActionbarProduct
         class="PanelProducts-actionbar transition"
         :products="products"
         :rightMenus="initRightMenus"
         @click-search="$emit('click-search')"
      />

      <div class="PanelProducts-body">
         <div
            :class="[
               'PanelProducts-filters',
               `PanelProducts-filters-${isLayoutThin ? 'isThin' : 'isWide'}`,
            ]"
         >
            <LabelMenus
               :primaryColor="labelMenuPrimaryColor"
               v-for="filterMenuGroup of filterMenuGroups"
               :key="filterMenuGroup.title"
               :title="filterMenuGroup.title"
               :menu="filterMenuGroup.menu"
               :menus="filterMenuGroup.menus"
            />
         </div>

         <div
            :class="[
               'PanelProducts-products',
               `PanelProducts-products-${isLayoutThin ? 'isThin' : 'isWide'}`,
            ]"
            v-if="productFilters.length"
         >
            <router-link
               v-for="product of productFilters"
               :key="product.id"
               :to="{ query: { productId: product.id } }"
            >
               <ItemProduct
                  :mode="layoutMode"
                  :item="product"
                  :isSelected="product.id === currentProductId"
               />
            </router-link>
         </div>

         <LoadingDots style="z-index: 3" :isShowing="isLoading" />
         <Empty
            v-if="!isLoading && !categoryKey && !productFilters.length"
            :icon="iconEmpty"
         />
      </div>

      <Footer />
   </div>
</template>

<style lang="scss" scoped>
   .PanelProducts {
      z-index: 1;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      overflow-y: auto;

      background-color: #dddddd;

      .PanelProducts-actionbar {
         z-index: 2;
         border-bottom: 1px solid hsl(0, 0%, 80%);
         background-color: #eeeeee;
      }
      .PanelProducts-body {
         z-index: 1;
         width: 100%;
         padding-bottom: 10vh;
         flex-grow: 1;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;

         .PanelProducts-filters {
            z-index: 3;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
         }
         .PanelProducts-filters-isThin {
            padding: 1rem;
            padding-top: 1.3rem;
            gap: 0.2rem;
         }
         .PanelProducts-filters-isWide {
            padding: 0.8rem 1rem 0 1rem;
            gap: 0.5rem;
         }

         .PanelProducts-products {
            z-index: 2;
            width: 100%;

            & > * {
               text-decoration: none;
               & > * {
                  width: 100%;
                  height: 100%;
               }
            }
         }
         .PanelProducts-products-isThin {
            display: flex;
            flex-direction: column;
            padding: 0.7rem;
         }
         .PanelProducts-products-isWide {
            padding: 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
         }
      }
   }
</style>
