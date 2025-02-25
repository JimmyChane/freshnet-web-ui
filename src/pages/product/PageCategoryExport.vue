<script>
import IconPrinter from '@/assets/icon/printer-000000.svg';
import { cmToPixel } from '@/entity/Pixel';
import { useLoginStore } from '@/stores/login.store';
import { useProductStore } from '@/stores/product.store';

import PrintContent from '@/components/PrintContent.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';

import Layout from './PageCategoryExport-Layout.vue';

export default {
  components: { NavigationBar, PrintContent, Layout },
  computed: {
    user: (c) => useLoginStore().user,
    allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

    width: () => cmToPixel(210),
    height: () => cmToPixel(297),
  },
  data: () => ({ IconPrinter, products: [] }),
  methods: {
    async invalidate() {
      const { id } = this.$route.query;
      const groups = await useProductStore().getGroupsByCategory();
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
        { title: 'Print', icon: IconPrinter, click: () => $refs.print.print() },
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
