<script>
import IconPrinter from '@/assets/icon/printer-000000.svg';
import PrintContent from '@/components/PrintContent.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import { cmToPixel } from '@/objects/Pixel';

import Layout from './PageCategoryExport-Layout.vue';

export default {
  components: { NavigationBar, PrintContent, Layout },
  computed: {
    user: (c) => c.$store.state.stores.login.getters.user,
    allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

    width: () => cmToPixel(210),
    height: () => cmToPixel(297),
  },
  data: () => ({ IconPrinter, products: [] }),
  methods: {
    async invalidate() {
      const productStore = this.$store.state.stores.product;
      const { id } = this.$route.query;
      const groups = await $store.state.stores.product.dispatch(
        'getGroupsByCategory',
      );
      const group = groups.find((group) => group.category.id === id);
      this.products = group?.items ?? [];
    },
  },
  mounted() {
    this.invalidate();
  },
};
</script>

<template>
  <div class="PageCategoryExport">
    <NavigationBar
      :rightMenus="[
        {
          title: 'Print',
          icon: IconPrinter,
          click: () => $refs.print.print(),
        },
      ]"
    />
    <PrintContent
      class="PageCategoryExport-print"
      ref="print"
      :width="width"
      :height="height"
    >
      <Layout :width="width" :height="height" :products="products" />
    </PrintContent>
  </div>
</template>

<style lang="scss" scoped>
.PageCategoryExport {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .PageCategoryExport-print {
    margin: 1rem;
    height: 100%;
  }
}
</style>
