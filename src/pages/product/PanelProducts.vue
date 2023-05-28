<script>
   import Empty from "@/components/Empty.vue";
   import LoadingDots from "@/components/LoadingDots.vue";
   import LabelMenus from "@/components/LabelMenus.vue";
   import Footer from "@/app/footer/Footer.vue";

   import ActionbarProduct from "./ActionBarProduct.vue";
   import TabLayout from "@/components/tabLayout/TabLayout.vue";
   import ItemProduct from "./ItemProduct.vue";
   import Group from "./PanelProducts-Group.vue";
   import chroma from "chroma-js";

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
                  this.context.$root.replaceQuery({ query });
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
         TabLayout,
         ItemProduct,
         Group,
         LabelMenus,
         Empty,
         LoadingDots,
         Footer,
      },
      props: { products: { type: Array, default: () => [] } },
      data: (c) => ({
         labelMenuPrimaryColor: chroma("000000"),

         currentProductId: "",

         categoryFilter: null,

         filterMenus: [],
         productGroups: [],
      }),
      computed: {
         iconEmpty: () => PageProduct.icon.dark.toUrl(),

         isLayoutThin: (c) => c.$root.window.innerWidth < 550,
         layoutMode: () => ItemProduct.Mode.Grid,

         queryProductId: (c) => c.$route.query.productId,
         queryCategoryId: (c) => c.$route.query.category,
         queryBrandId: (c) => c.$route.query.brand,
         queryStock: (c) => c.$route.query.stock,

         isLoading: (c) => c.productStore.getters.isLoading,
         isEmpty: (c) => !c.isLoading && !c.productGroups.length,
         isEditable() {
            const { user } = this.loginStore.getters;
            return user.isTypeAdmin() || user.isTypeStaff();
         },

         initRightMenus() {
            if (!this.isEditable) return null;
            const title = "Add";
            const icon = this.host.icon("add-000000");
            const click = () => this.$emit("click-productAdd");
            return { title, icon, click };
         },

         tabLayoutCategories: (c) => {
            if (!c.categoryFilter) return [];
            return c.categoryFilter.menus.map((menu) => {
               return {
                  title: menu.title,
                  icon: menu.icon,
                  primaryColor: "black",
                  primaryColorTint: "hsla(0, 0%, 0%, 0.1)",
                  click: () => menu.click(menu),
                  isSelected: () => c.categoryFilter.menu === menu,
               };
            });
         },
      },
      watch: {
         queryProductId() {
            this.invalidateProductId();
         },
         queryCategoryId() {
            this.invalidate();
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
            this.scrollToTop();
            this.invalidateProductId();

            const categoryGroups = await this.productStore.dispatch(
               "getGroupsByCategory",
            );
            const brandGroups = await this.productStore.dispatch(
               "getGroupsByBrand",
            );

            this.productGroups = categoryGroups
               .sort((group1, group2) => {
                  return group1.category.compare(group2.category);
               })
               .map((group) => {
                  const items = group.items
                     .filter((item) => {
                        if (!this.isEditable) return item.isStockAvailable();
                        if (this.queryStock === "all") return true;
                        return item.isStockAvailable();
                     })
                     .filter((product) => {
                        if (!this.queryCategoryId) return true;
                        return product.categoryId === this.queryCategoryId;
                     })
                     .filter((product) => {
                        if (!this.queryBrandId) return true;
                        return product.brandId === this.queryBrandId;
                     })
                     .sort((product1, product2) => {
                        return product1.compare(product2);
                     });
                  return {
                     id: group.category.id,
                     key: group.category.key,
                     title: group.category.title,
                     icon: group.category.icon
                        ? group.category.icon.toUrl()
                        : "",
                     items,
                  };
               })
               .filter((group) => group.items.length > 0);

            this.categoryFilter = new MenuGroup(this, "category", "Category", [
               { title: "All" },
               ...categoryGroups.map((group) => {
                  return {
                     key: group.category.id,
                     title: group.category.title,
                     icon: group.category.icon?.toUrl() ?? "",
                  };
               }),
            ]);
            const brandMenuGroup = new MenuGroup(this, "brand", "Brand", [
               { title: "All" },
               ...brandGroups
                  .filter((group) => group.brand && group.items.length > 0)
                  .sort((group1, group2) => group1.brand.compare(group2.brand))
                  .map((group) => {
                     return { key: group.brand.id, title: group.brand.title };
                  }),
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
         invalidateProductId() {
            if (!this.queryProductId) {
               setTimeout(() => {
                  this.currentProductId = this.queryProductId;
               }, 500);
            } else {
               this.currentProductId = this.queryProductId;
            }
         },

         scrollToTop() {
            this._self.$el.scrollTo({ top: 0, behavior: "smooth" });
         },
      },
   };
</script>

<template>
   <div class="PanelProducts">
      <div class="PanelProducts-actionbar">
         <ActionbarProduct
            :style="{ 'z-index': '2' }"
            :products="products"
            :rightMenus="initRightMenus"
            @click-search="$emit('click-search')"
         />

         <TabLayout
            class="PanelProducts-tabLayout"
            :isScreenWide="true"
            :menus="tabLayoutCategories"
         />

         <div
            :style="{ 'z-index': '1' }"
            :class="['scrollbar', 'PanelProducts-filters']"
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
      </div>

      <div class="PanelProducts-body">
         <div class="PanelProducts-categories">
            <Group
               v-for="group of productGroups"
               :key="group.id"
               :group="group"
               :isWide="!(productGroups.length > 1 && isLayoutThin)"
               :layoutMode="layoutMode"
               :currentProductId="currentProductId"
               :queryBrandId="queryBrandId"
               :queryStock="queryStock"
               :queryGroupKey="queryCategoryId"
            />
         </div>

         <LoadingDots style="z-index: 3" :isShowing="isLoading" />
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

      .PanelProducts-actionbar {
         width: 100%;
         z-index: 2;
         position: sticky;
         top: 0;

         border-bottom: 1px solid hsl(0, 0%, 80%);
         background: var(--App-background-color);

         .PanelProducts-tabLayout {
            padding: 0.4rem 1rem;
            padding-right: 2rem;
         }

         .PanelProducts-filters {
            width: 100%;
            padding: 0.4rem 1rem;
            padding-top: 0.2rem;
            gap: 0.5rem;

            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;

            overflow-x: auto;
            z-index: 3;
         }
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

         .PanelProducts-categories {
            z-index: 2;
            width: 100%;
            gap: 0.5rem;
            margin-top: 0.5rem;
            display: flex;
            flex-direction: column;
         }
      }
   }
</style>
