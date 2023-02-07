<script>
   import AppHost from "@/host/AppHost.js";
   import ViewerProduct from "@/pages/product/viewerProduct/ViewerProduct.vue";

   export default {
      components: { ViewerProduct },
      emits: [
         "click-dismiss",
         "click-productRemove",
         "click-product-imageRemove",
         "click-product-titleBrandUpdate",
         "click-product-priceUpdate",
         "click-product-descriptionUpdate",
         "click-product-categoryUpdate",
         "click-product-specificationsUpdate",
      ],
      props: {
         product: { type: Object, default: () => null },
         productPrevious: { type: Object, default: () => null },
         productNext: { type: Object, default: () => null },

         isWide: { type: Boolean, default: false },
         isEditable: { type: Boolean, default: false },
         isBackable: { type: Boolean, default: true },
      },
      computed: {
         actionbarLeftMenus() {
            return {
               key: "close",
               title: "Close",
               icon: this.host.icon("close-000000"),
               click: () => this.$emit("click-dismiss"),
            };
         },
         actionbarRightMenus() {
            if (!this.product) return [];
            return [
               this.isEditable
                  ? {
                       key: "trash",
                       icon: this.host.icon("trash-000000"),
                       click: () =>
                          this.$emit("click-productRemove", {
                             product: this.product,
                          }),
                    }
                  : null,
               {
                  key: "view",
                  title: "View",
                  icon: this.host.icon("view-000000"),
                  click: () => this.clickView(),
               },
               {
                  key: "copy",
                  title: "Copy Link",
                  icon: this.host.icon("copy-000000"),
                  click: () => this.clickCopyLink(),
               },
               this.isEditable
                  ? {
                       key: "print",
                       title: "Print",
                       icon: this.host.icon("printer-000000"),
                       click: () =>
                          this.$router.push({
                             path: "/product/export",
                             query: { productId: this.product.id },
                          }),
                    }
                  : null,
            ];
         },
      },
      methods: {
         clickCopyLink() {
            if (!this.product) {
               this.$root.feedback("Cannot Copy");
               return;
            }
            const link = this.product.getLink();
            if (!link) {
               this.$root.feedback("Cannot Copy");
               return;
            }
            this.$root.copyText(link);
            this.$root.feedback({
               icon: this.host.icon("copy-FFFFFF"),
               text: "Copied to Clipboard",
               actions: [{ title: "Open", click: () => this.clickView() }],
            });
         },
         clickView() {
            let urlView = `${AppHost.path}/product/view`;

            if (!this.product) {
               this.$root.openLink(urlView);
            } else {
               this.$root.openLink(`${urlView}?productId=${this.product.id}`);
            }
         },
      },
   };
</script>

<template>
   <div class="PanelProduct">
      <ViewerProduct
         ref="Viewer"
         :isWide="isWide"
         :isEditable="isEditable"
         :leftMenus="actionbarLeftMenus"
         :rightMenus="actionbarRightMenus"
         :product="product"
         :productPrevious="productPrevious"
         :productNext="productNext"
         @click-product-imageRemove="
            (x) => $emit('click-product-imageRemove', x)
         "
         @click-product-titleBrandUpdate="
            (x) => $emit('click-product-titleBrandUpdate', x)
         "
         @click-product-priceUpdate="
            (x) => $emit('click-product-priceUpdate', x)
         "
         @click-product-descriptionUpdate="
            (x) => $emit('click-product-descriptionUpdate', x)
         "
         @click-product-categoryUpdate="
            (x) => $emit('click-product-categoryUpdate', x)
         "
         @click-product-specificationsUpdate="
            (x) => $emit('click-product-specificationsUpdate', x)
         "
      />
   </div>
</template>

<style lang="scss" scoped>
   .PanelProduct {
      width: 100%;
      height: 100%;

      font-size: 1.2rem;

      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
   }
</style>
