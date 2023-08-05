<script>
  import U from "@/U";
  import ButtonIcon from "@/components/button/ButtonIcon.vue";

  export default {
    components: { ButtonIcon },
    props: {
      primaryColor: { type: Object },
      allowEdit: { type: Boolean, default: false },
      product: { type: Object, default: () => null },
    },
    data: (c) => ({ fullTitle: "" }),
    computed: {
      titleColor: (c) =>
        U.isColorDark(c.primaryColor)
          ? "white"
          : c.primaryColor.mix("000000", 0.98),

      title: (c) => c.product?.title ?? "",
      brandId: (c) => c.product?.brandId ?? "",
    },
    watch: {
      product() {
        this.invalidateProduct();
      },
    },
    mounted() {
      this.invalidateProduct();
    },
    methods: {
      async invalidateProduct() {
        this.fullTitle = "";
        if (this.product) {
          this.fullTitle = await this.product.fetchFullTitle();
        }
      },
    },
  };
</script>

<template>
  <div class="ViewerProduct-Title">
    <span :style="{ color: titleColor }">{{ fullTitle }}</span>
    <ButtonIcon
      class="ViewerProduct-button"
      v-if="allowEdit"
      :src="host.icon('edit-000000').toUrl()"
      @click="
        () => $emit('click-edit', { product, title: title, brandId: brandId })
      "
    />
  </div>
</template>

<style lang="scss" scoped>
  .ViewerProduct-Title {
    padding: 2rem;
    margin-top: -1rem;

    font-size: 2.2rem;
    font-weight: 600;
    text-align: center;
    color: white;
    transition: color var(--color-transition-duration);

    position: relative;

    @media (max-width: 480px) {
      font-size: 1.6rem;
    }

    .ViewerProduct-button {
      position: absolute;
      top: 0.5em;
      right: 0;
    }
  }
</style>
