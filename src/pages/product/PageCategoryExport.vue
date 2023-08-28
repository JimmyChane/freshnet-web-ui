<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import PrintContent from "@/components/PrintContent.vue";
  import Pixel from "@/objects/Pixel";
  import Layout from "./PageCategoryExport-Layout.vue";

  export default {
    components: { NavigationBar, PrintContent, Layout },
    computed: {
      user: (c) => c.$store.state.stores.login.getters.user,
      allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

      width: () => Pixel.cm(210),
      height: () => Pixel.cm(297),
    },
    data: () => ({ products: [] }),
    methods: {
      async invalidate() {
        const productStore = this.$store.state.stores.product;
        const { id } = this.$route.query;
        const groups = await $store.state.stores.product.dispatch("getGroupsByCategory");
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
          icon: host.icon('printer-000000').toUrl(),
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
