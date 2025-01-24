<script>
import IconClose from '@/assets/icon/close-000000.svg';
import IconCopyDark from '@/assets/icon/copy-000000.svg';
import IconCopyLight from '@/assets/icon/copy-FFFFFF.svg';
import IconPrinter from '@/assets/icon/printer-000000.svg';
import IconTrash from '@/assets/icon/trash-000000.svg';
import IconView from '@/assets/icon/view-000000.svg';
import AppHost from '@/host/AppHost';
import ViewerProduct from '@/pages/product/viewerProduct/ViewerProduct.vue';

export default {
  components: { ViewerProduct },
  emits: [
    'click-dismiss',
    'click-productRemove',
    'click-product-imageRemove',
    'click-product-titleBrandUpdate',
    'click-product-priceUpdate',
    'click-product-descriptionUpdate',
    'click-product-categoryUpdate',
    'click-product-specificationsUpdate',
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
    openedWindowCount: (c) => c.$store.getters.popupWindows.length,
    actionbarLeftMenus() {
      return {
        key: 'close',
        title: 'Close',
        icon: IconClose,
        click: () => this.$emit('click-dismiss'),
      };
    },
    actionbarRightMenus() {
      if (!this.product) return [];
      return [
        {
          key: 'view',
          title: 'View Product in Display',
          icon: IconView,
          isHidden: true,
          click: () => this.clickView(),
        },
        {
          key: 'copy',
          title: 'Copy Product Link',
          icon: IconCopyDark,
          click: () => this.clickCopyLink(),
        },
        this.isEditable
          ? {
              key: 'print',
              title: 'Print Product Catalog',
              icon: IconPrinter,
              isHidden: true,
              click: () => {
                this.$router.push({
                  path: '/product/export',
                  query: { productId: this.product.id },
                });
              },
            }
          : null,
        this.isEditable
          ? {
              key: 'delete',
              title: 'Delete Product',
              icon: IconTrash,
              isHidden: true,
              click: () => {
                this.$emit('click-productRemove', {
                  product: this.product,
                });
              },
            }
          : null,
      ];
    },
  },
  methods: {
    clickCopyLink() {
      if (!this.product) {
        this.$store.dispatch('snackbarShow', 'Cannot Copy');
        return;
      }
      const link = this.product.getLink();
      if (!link) {
        this.$store.dispatch('snackbarShow', 'Cannot Copy');
        return;
      }
      this.$store.getters.copyText(link);
      this.$store.dispatch('snackbarShow', {
        icon: IconCopyLight,
        text: 'Copied to Clipboard',
        actions: [{ title: 'Open', click: () => this.clickView() }],
      });
    },
    clickView() {
      let urlView = `${AppHost.path}/product/view`;

      if (!this.product) {
        this.$store.getters.openLink(urlView);
      } else {
        this.$store.getters.openLink(`${urlView}?productId=${this.product.id}`);
      }
    },
  },
};
</script>

<template>
  <div class="PanelProduct">
    <ViewerProduct
      ref="Viewer"
      :openedWindowCount="openedWindowCount"
      :isWide="isWide"
      :isEditable="isEditable"
      :leftMenus="actionbarLeftMenus"
      :rightMenus="actionbarRightMenus"
      :product="product"
      :productPrevious="productPrevious"
      :productNext="productNext"
      @click-product-imageRemove="(x) => $emit('click-product-imageRemove', x)"
      @click-product-titleBrandUpdate="
        (x) => $emit('click-product-titleBrandUpdate', x)
      "
      @click-product-priceUpdate="(x) => $emit('click-product-priceUpdate', x)"
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
  width: 100dvw;
  max-width: 100%;

  font-size: 1.2rem;

  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
</style>
