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

            currentProductId: "",

            filterMenus: [],
            productGroups: [],
         };
      },
      computed: {
         iconEmpty: () => PageProduct.icon.dark.toString(),

         isLayoutThin: (context) => context.$root.window.innerWidth < 550,
         layoutMode: () => ItemProduct.Mode.Grid,

         queryProductId: (context) => context.$route.query.productId,
         queryBrandId: (context) => context.$route.query.brand,
         queryStock: (context) => context.$route.query.stock,

         isLoading: (context) => context.productStore.getters.isLoading,
         isEmpty: (context) =>
            !context.isLoading && !context.productGroups.length,
         isEditable() {
            const { user } = this.loginStore.getters;
            return user.isTypeAdmin() || user.isTypeStaff();
         },

         initRightMenus() {
            if (!this.isEditable) return null;
            const title = "Add";
            const icon = this.host.res("icon/add-000000.svg");
            const click = () => this.$emit("click-productAdd");
            return { title, icon, click };
         },
      },
      watch: {
         queryProductId() {
            if (!this.queryProductId) {
               setTimeout(() => {
                  this.currentProductId = this.queryProductId;
               }, 500);
            } else {
               this.currentProductId = this.queryProductId;
            }
         },
         queryBrandId() {
            this.invalidate();
         },
         queryStock() {
            this.invalidate();
         },
         isEditable() {
            this.invalidate();
         },
         "productStore.getters.lastModified"() {
            this.invalidate();
         },
         "categoryStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const categoryGroups = await this.productStore.dispatch(
               "getGroupsByCategory",
            );
            this.productGroups = categoryGroups
               .sort((group1, group2) =>
                  group1.category.compare(group2.category),
               )
               .map((group) => {
                  const items = group.items
                     .filter((item) => {
                        if (!this.isEditable) return item.isStockAvailable();
                        if (this.queryStock === "all") return true;
                        return item.isStockAvailable();
                     })
                     .filter((product) => {
                        if (!this.queryBrandId) return true;
                        return product.brandId === this.queryBrandId;
                     });
                  return {
                     key: group.category.id,
                     title: group.category.title,
                     icon: group.category.icon
                        ? group.category.icon.toUrl()
                        : "",
                     items,
                  };
               })
               .filter((group) => group.items.length > 0);

            const brandGroups = await this.productStore.dispatch(
               "getGroupsByBrand",
            );
            const brandMenus = brandGroups
               .filter((group) => group.brand && group.items.length > 0)
               .map((group) => {
                  const { title, icon } = group.brand;
                  const iconUrl = icon ? icon.toUrl() : "";
                  if (iconUrl.length > 0)
                     return { key: group.brand.id, icon: iconUrl };
                  return { key: group.brand.id, title };
               });

            const brandMenuGroup = new MenuGroup(this, "brand", "Brand", [
               { title: "All" },
               ...brandMenus,
            ]);

            this.filterMenus = [brandMenuGroup];
            if (this.isEditable) {
               this.filterMenus.push(
                  new MenuGroup(this, "stock", "Stock", [
                     { key: "all", title: "All" },
                     { title: "Available" },
                  ]),
               );
            }

            // this.filterMenus.push(
            //    new MenuGroup(this, "processor", "Processor", [
            //       { key: "Intel Celeron", title: "Intel Celeron" },
            //       { key: "Intel Pentium", title: "Intel Pentium" },
            //       { key: "Intel Core i3", title: "Intel Core i3" },
            //       { key: "Intel Core i5", title: "Intel Core i5" },
            //       { key: "Intel Core i9", title: "Intel Core i9" },
            //       { key: "AMD Althon Silver", title: "AMD Althon Silver" },
            //       { key: "AMD Ryzen 3", title: "AMD Ryzen 3" },
            //       { key: "AMD Ryzen 5", title: "AMD Ryzen 5" },
            //       { key: "AMD Ryzen 7", title: "AMD Ryzen 7" },
            //    ]),
            //    new MenuGroup(this, "ram", "RAM", [
            //       { key: "16GB DDR4", title: "16GB DDR4" },
            //       { key: "8GB DDR4", title: "8GB DDR4" },
            //       { key: "4GB DDR4", title: "4GB DDR4" },
            //    ]),
            //    new MenuGroup(this, "storage", "Storage", [
            //       { title: "All" },
            //       { key: "120GB SSD", title: "120GB SSD" },
            //       { key: "128GB SSD", title: "128GB SSD" },
            //       { key: "240GB SSD", title: "240GB SSD" },
            //       { key: "256GB SSD", title: "256GB SSD" },
            //       { key: "480GB SSD", title: "480GB SSD" },
            //       { key: "512GB SSD", title: "512GB SSD" },
            //       { key: "80GB HDD", title: "80GB HDD" },
            //       { key: "150GB HDD", title: "150GB HDD" },
            //       { key: "320GB HDD", title: "320GB HDD" },
            //       { key: "500GB HDD", title: "500GB HDD" },
            //       { key: "640GB HDD", title: "640GB HDD" },
            //       { key: "1TB HDD", title: "1TB HDD" },
            //       { key: "2TB HDD", title: "2TB HDD" },
            //       { key: "3TB HDD", title: "3TB HDD" },
            //       { key: "4TB HDD", title: "4TB HDD" },
            //    ]),
            //    new MenuGroup(this, "size", "Size", [
            //       { title: "All" },
            //       { key: '12.5"', title: '12.5"' },
            //       { key: '13.1"', title: '13.1"' },
            //       { key: '14"', title: '14"' },
            //       { key: '15.6"', title: '15.6"' },
            //    ]),
            //    new MenuGroup(this, "resdis", "Resolution & Display", [
            //       { key: "Full HD", title: "Full HD" },
            //       {
            //          key: "Full HD with Touch Screen",
            //          title: "Full HD with Touch Screen",
            //       },
            //       { key: "HD", title: "HD" },
            //       { key: "HD with Touch Screen", title: "HD with Touch Screen" },
            //    ]),
            //    new MenuGroup(this, "graphic", "Graphic", [
            //       { key: "RTX 3060", title: "RTX 3060" },
            //    ]),
            // );
         },
      },
   };
</script>

<template>
   <div class="PanelProducts">
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
               v-for="filterMenu of filterMenus"
               :key="filterMenu.title"
               :title="filterMenu.title"
               :menu="filterMenu.menu"
               :menus="filterMenu.menus"
            />
         </div>

         <div
            :class="[
               'PanelProducts-categories',
               `PanelProducts-categories-${isLayoutThin ? 'isThin' : 'isWide'}`,
            ]"
         >
            <div
               class="PanelProducts-category"
               v-for="group of productGroups"
               :key="group.key"
            >
               <div class="PanelProducts-category-header">
                  <span class="PanelProducts-category-title">{{
                     group.title
                  }}</span>
                  <img
                     class="PanelProducts-category-icon"
                     v-if="group.icon"
                     :src="group.icon"
                     :alt="`${group.title} Icon`"
                  />
               </div>
               <div class="PanelProducts-category-items scrollbar">
                  <router-link
                     v-for="item of group.items"
                     :key="item.id"
                     :to="{
                        query: {
                           productId: item.id,
                           brand: queryBrandId,
                           stock: queryStock,
                        },
                     }"
                  >
                     <ItemProduct
                        :mode="layoutMode"
                        :item="item"
                        :isSelected="item.id === currentProductId"
                     />
                  </router-link>
               </div>
            </div>
         </div>

         <LoadingDots class="PanelProducts-loading" v-if="isLoading" />
         <Empty v-if="isEmpty" :icon="iconEmpty" />
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

         .PanelProducts-categories {
            z-index: 2;
            width: 100%;
            gap: 2rem;
            padding: 2rem 0;
            display: flex;
            flex-direction: column;

            .PanelProducts-category {
               display: flex;
               flex-direction: column;
               align-items: stretch;
               padding: 1rem 0;

               .PanelProducts-category-header {
                  display: flex;
                  flex-direction: row;
                  align-items: center;

                  font-size: 2.5rem;
                  font-weight: 500;
                  gap: 0.5em;

                  .PanelProducts-category-icon {
                     width: 1em;
                     height: 1em;
                  }
               }

               .PanelProducts-category-items {
                  & > * {
                     text-decoration: none;
                     & > * {
                        width: 100%;
                        height: 100%;
                     }
                  }
               }
            }
         }
         .PanelProducts-categories-isThin {
            .PanelProducts-category-header {
               padding: 0 0.9rem;
            }
            .PanelProducts-category-items {
               padding: 0 0.7rem;

               display: flex;
               flex-direction: row;
               overflow-x: auto;
               overflow-y: hidden;

               --scrollbar-size: 0.4em;
               --scrollbar-thumb-radius: 0.4em;
               --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
               --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
               --scrollbar-track-margin: 1.3rem;

               & > * {
                  width: 10rem;
                  min-width: 10rem;
                  max-width: 10rem;
               }
            }
         }
         .PanelProducts-categories-isWide {
            .PanelProducts-category-header {
               padding: 0 0.8rem;
            }
            .PanelProducts-category-items {
               padding: 0 0.5rem;

               display: grid;
               grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
            }
         }

         .PanelProducts-loading {
            z-index: 1;
            position: static;
         }
      }
   }
</style>
