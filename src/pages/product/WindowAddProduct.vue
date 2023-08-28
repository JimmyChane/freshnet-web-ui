<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import Category from "@/items/Category";
   import Input from "@/components/Input.vue";
   import LabelMenus from "@/components/LabelMenus.vue";

   export default {
      components: { PanelAction, Input, LabelMenus },
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({
         categoryMenus: [],
         brandMenus: [],

         titleError: "",

         brandMenu: { key: "none", title: "None" },
         categoryMenu: null,
         title: "",
      }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         input: (c) => c.popupWindow.input,
      },
      watch: {
         isShowing() {
            if (this.isShowing) {
               this.invalidate();
            } else {
               this.categoryMenus = [];
               this.brandMenus = [];
            }
         },
      },
      mounted() {
         this.invalidate();
         this.$store.state.stores.brand.dispatch("getItems");
         this.$store.state.stores.category.dispatch("getItems");
         this.$store.state.stores.product.dispatch("getItems");
      },
      methods: {
         async invalidate() {
            const brands = await this.$store.state.stores.brand.dispatch("getItems");
            const categories = await this.$store.state.stores.category.dispatch("getItems");

            this.brandMenus = [
               { key: "none", title: "None" },
               ...brands
                  .sort((brand1, brand2) => brand1.compare(brand2))
                  .map((brand) => {
                     return {
                        key: brand.id,
                        title: brand.title,
                        click: (menu) => (this.brandMenu = menu),
                     };
                  }),
            ];
            this.categoryMenus = categories
               .sort((category1, category2) => category1.compare(category2))
               .map((category) => {
                  return {
                     key: category.id,
                     title: category.title,
                     click: (menu) => (this.categoryMenu = menu),
                  };
               });

            if (!this.brandMenu) {
               this.brandMenu = this.brandMenus.find(
                  (menu) => menu.key === "none",
               );
            }

            const categoryOther = categories.find((category) => {
               return category.key === Category.Key.Other;
            });
            if (!this.categoryMenu && categoryOther) {
               this.categoryMenu = this.categoryMenus.find((menu) => {
                  return menu.key === categoryOther.id;
               });
            }
         },
         clickConfirm() {
            const title = this.title.trim();
            const brandId = this.brandMenu?.key ?? "";
            const categoryId = this.categoryMenu?.key ?? "";

            if (!title) {
               this.titleError = "Title Missing";
               this.$store.dispatch("snackbarShow", "Title Missing");
               return;
            }

            const output = { title, brandId, categoryId };
            this.popupWindow.onConfirm(output);
         },
      },
   };
</script>

<template>
   <PanelAction
      class="WindowAddProduct"
      title="New Product"
      :isShowing="isShowing"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => clickConfirm()"
   >
      <div class="WindowAddProduct-body">
         <div class="WindowAddProduct-menus">
            <LabelMenus title="Brand" :menus="brandMenus" :menu="brandMenu" />
            <LabelMenus
               title="Category"
               :menus="categoryMenus"
               :menu="categoryMenu"
            />
         </div>

         <Input
            class="WindowAddProduct-title"
            label="Title"
            autocapitalize="words"
            :isRequired="true"
            :bindValue="title"
            :error="titleError"
            @input="(comp) => (title = comp.value)"
         />
      </div>
   </PanelAction>
</template>

<style lang="scss" scoped>
   .WindowAddProduct-reuse-title {
      font-size: 1.1rem;
      font-weight: 600;
   }
   .WindowAddProduct-reuse-required {
      color: hsl(0, 50%, 50%);
      font-size: 0.8rem;
   }

   .WindowAddProduct {
      .WindowAddProduct-body {
         width: 26rem;
         max-width: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 3em;

         .WindowAddProduct-menus {
            z-index: 2;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
         }

         .WindowAddProduct-title {
            z-index: 1;
            padding-left: 0;
            padding-right: 0;
         }
      }
   }
</style>
