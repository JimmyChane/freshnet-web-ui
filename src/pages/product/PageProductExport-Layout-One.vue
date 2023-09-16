<script>
  import { Type } from "@/items/Specification";
  import Item from "./PageProductExport-Layout-One-Specification.vue";
  import ProductPrice from "@/items/ProductPrice";

  export default {
    components: { Item },
    props: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      product: { type: Object, default: () => null },
    },
    data: (c) => ({
      previousHeight: 0,
      initialPadding: 60,
      initialGap: 30,
      initialSpecificationGap: 14,

      fullTitle: "",
      padding: 0,
      gap: 0,
      specificationGap: 0,
    }),
    computed: {
      user: (c) => c.$store.state.stores.login.getters.user,
      allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

      brandId: (c) => c.product?.brandId ?? "",

      specificationKeys: () => {
        return Object.keys(Type.Key).map((key) => {
          return Type.Key[key];
        });
      },
      specifications: (c) => {
        if (!c.product) return [];
        if (!Array.isArray(c.product.specifications)) return [];

        return c.product.specifications
          .filter((spec) => spec && spec.type && spec.content)
          .sort((spec1, spec2) => {
            const key1 = c.obtainKeyOfSpecificationType(spec1.type);
            const key2 = c.obtainKeyOfSpecificationType(spec2.type);

            let index1 = c.specificationKeys.indexOf(key1);
            let index2 = c.specificationKeys.indexOf(key2);

            index1 = index1 >= 0 ? index1 : c.specificationKeys.length;
            index2 = index2 >= 0 ? index2 : c.specificationKeys.length;

            return index1 !== index2
              ? index1 - index2
              : key1.localeCompare(key2);
          });
      },

      productPrice() {
        if (!this.allowEdit) return null;
        if (!this.product) return null;
        return this.product.price;
      },
      productPriceNormal() {
        if (!this.productPrice) return new ProductPrice();
        if (!this.productPrice.normal) return new ProductPrice();
        return this.productPrice.normal;
      },
      productPricePromotion() {
        if (!this.productPrice) return new ProductPrice();
        if (!this.productPrice.promotion) return new ProductPrice();
        return this.productPrice.promotion;
      },
      price() {
        if (!this.allowEdit) return null;

        let normal = this.productPriceNormal;
        let promotion = this.productPricePromotion;

        if (normal.value > 0 && promotion.value <= 0) return { to: normal };
        if (normal.value > 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        if (normal.value <= 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        return null;
      },
    },
    watch: {
      product() {
        this.invalidate();
      },
      brandId() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        this.previousHeight = 0;
        this.fullTitle = "";
        this.padding = this.initialPadding;
        this.gap = this.initialGap;
        this.specificationGap = this.initialSpecificationGap;

        if (!this.product) return;

        this.fullTitle = await this.product.fetchFullTitle();
        this.invalidateHeight();
      },
      invalidateHeight() {
        const parentHeight = this.$el.offsetHeight;
        const height = this.$refs.body.offsetHeight;

        if (height > parentHeight && this.previousHeight !== height) {
          this.previousHeight = height;
          this.padding = this.padding - this.initialPadding / 10;
          this.gap = this.gap - this.initialGap / 10;
          this.specificationGap =
            this.specificationGap - this.initialSpecificationGap / 10;
          setTimeout(() => this.invalidateHeight(), 100);
        }
      },

      obtainKeyOfSpecificationType(type) {
        if (typeof type === "object") return type.key;
        if (typeof type === "string") return type;
        return "";
      },
    },
  };
</script>

<template>
  <div
    class="ExportLayoutOne"
    :style="{ '--width': `${width}px`, '--height': `${height}px` }"
  >
    <div
      class="ExportLayoutOne-body"
      ref="body"
      :style="{
        'padding': `${padding}px ${initialPadding}px`,
        'gap': `${gap}px`,
      }"
    >
      <span class="ExportLayoutOne-title">{{ fullTitle }}</span>

      <div
        class="ExportLayoutOne-items"
        :style="{ 'gap': `${specificationGap}px` }"
      >
        <Item
          v-for="specification in specifications"
          :key="specification.name"
          :item="specification"
        />
      </div>

      <span class="ExportLayoutOne-price" v-if="price && price.to">
        {{ price.to }}</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ExportLayoutOne {
    width: var(--width);
    height: var(--height);
    min-width: var(--width);
    min-height: var(--height);
    max-width: var(--width);
    max-height: var(--height);

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .ExportLayoutOne-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .ExportLayoutOne-title {
        font-size: 30px;
        font-weight: 600;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ExportLayoutOne-items {
        gap: 14px;

        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      .ExportLayoutOne-price {
        font-size: 30px;
        font-weight: 600;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
