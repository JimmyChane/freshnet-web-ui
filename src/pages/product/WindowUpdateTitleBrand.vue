<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import Selector3 from "@/components/selector/Selector3.vue";
   import Input from "@/components/Input.vue";

   export default {
      components: { PopupWindowAction, Selector3, Input },
      props: {
         isShowing: { type: Boolean, default: false },
         input: { type: Object, default: () => null },
      },
      data: (c) => ({ data: null }),
      computed: {
         product: (c) => (c.input ? c.input.product : ""),
         title: (c) => (c.data ? c.data.title : ""),
         brandId: (c) => (c.data ? c.data.brandId : ""),
         brand: (c) =>
            c.brandStore.getters.items.find((brand) => brand.id === c.brandId),
         brandTitle: (c) => (c.brand ? c.brand.title : ""),
         parsedTitleBrand: (c) => {
            if (c.title && c.brandTitle) return `${c.brandTitle} ${c.title}`;
            if (c.title) return c.title;
            if (c.brandTitle) return c.brandTitle;
            return "";
         },

         brandMenus: (c) => {
            return [
               { _id: "", title: "None" },
               ...c.brandStore.getters.items,
            ].map((item) => {
               return {
                  key: item.id,
                  title: item.title,
                  icon: item.icon ? item.icon.toUrl() : "",
               };
            });
         },
      },
      watch: {
         input() {
            this.clear();
            if (!this.input) {
               this.data = null;
               return;
            }

            this.data = {
               title: this.input.title,
               brandId: this.input.brandId,
            };
         },
      },
      methods: {
         clear() {
            this.data = { title: "", brandId: "" };
         },
         clickConfirm() {
            let output = {
               product: this.product,
               title: this.title,
               brandId: this.brandId,
            };

            if (!output.title) {
               this.store.dispatch("snackbarShow", "You must specify title");
               return;
            }

            this.$emit("click-confirm", output) && this.clear();
         },
      },
      mounted() {
         this.clear();
      },
   };
</script>

<template>
   <PopupWindowAction
      class="WindowUpdateTitleBrand"
      title="Update Title &amp; Brand"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss') && clear()"
      @click-cancel="$emit('click-cancel') && clear()"
      @click-ok="clickConfirm()"
   >
      <div class="WindowUpdateTitleBrand-body">
         <Input
            class="WindowUpdateTitleBrand-input"
            autocapitalize="words"
            :bindValue="title"
            :isRequired="true"
            @input="(comp) => (data.title = comp.value)"
         />

         <Selector3
            :menus="brandMenus"
            :selectedKey="brandId"
            @click-menu="
               (menu) => {
                  if (data) data.brandId = menu.key;
               }
            "
         />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateTitleBrand-body {
      width: 26rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .WindowUpdateTitleBrand-input {
         padding-left: 0;
         padding-right: 0;
      }
   }
</style>
