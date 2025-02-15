<script>
import { useAppStore } from '@/stores/app.store';
import { useBrandStore } from '@/stores/brand.store';

import Input from '@/components/Input.vue';
import PanelAction from '@/components/panel/PanelAction.vue';
import Selector3 from '@/components/selector/Selector3.vue';

export default {
  components: { PanelAction, Selector3, Input },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({ data: { title: '', brandId: '' } }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    input: (c) => c.popupWindow.input,
    product: (c) => c.input?.product ?? '',
    title: (c) => c.data?.title ?? '',
    brandId: (c) => c.data?.brandId ?? '',
    brand: (c) => useBrandStore().items.find((brand) => brand.id === c.brandId),
    brandTitle: (c) => c.brand?.title ?? '',
    parsedTitleBrand: (c) => {
      if (c.title && c.brandTitle) return `${c.brandTitle} ${c.title}`;
      if (c.title) return c.title;
      if (c.brandTitle) return c.brandTitle;
      return '';
    },

    brandMenus: (c) => {
      return [{ _id: '', title: 'None' }, ...useBrandStore().items].map(
        (item) => {
          return {
            key: item.id,
            title: item.title,
            icon: item.icon?.toUrl() ?? '',
          };
        },
      );
    },
  },
  methods: {
    clickConfirm() {
      const output = {
        product: this.product,
        title: this.title,
        brandId: this.brandId,
      };

      if (!output.title) {
        useAppStore().snackbarShow('You must specify title');
        return;
      }

      this.popupWindow.onConfirm(output);
    },
  },
  mounted() {
    this.data = {
      title: this.input.title,
      brandId: this.input.brandId,
    };
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateTitleBrand"
    title="Update Title &amp; Brand"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
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
  </PanelAction>
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
