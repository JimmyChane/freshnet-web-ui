<script lang="ts">
  import Specification, { Type } from "@/items/Specification";
  import Item from "./PageProductExport-Layout-One-Specification.vue";
  import ProductPrice from "@/items/ProductPrice";
  import Vue from "vue";
  import User from "@/items/User";
  import ProductPrices from "@/items/ProductPrices";
  import Product from "@/items/Product";

  export default Vue.extend({
    components: { Item },
    props: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      product: { type: Product },
    },
    data() {
      return {
        previousHeight: 0,
        initialPadding: 60,
        initialGap: 30,
        initialSpecificationGap: 14,

        fullTitle: "",
        padding: 0,
        gap: 0,
        specificationGap: 0,
      };
    },
    computed: {
      user(): User {
        return this.$store.state.stores.login.getters.user;
      },
      allowEdit(): boolean {
        return this.user.isTypeAdmin() || this.user.isTypeStaff();
      },

      brandId(): string {
        return this.product?.brandId ?? "";
      },

      specificationKeys(): string[] {
        return Object.keys(Type.Key).map((key) => {
          return (Type.Key as Record<string, any>)[key];
        });
      },
      specifications(): Specification[] {
        if (!this.product) return [];
        if (!Array.isArray(this.product.specifications)) return [];

        return this.product.specifications
          .filter((spec) => spec && spec.type && spec.content)
          .sort((spec1, spec2) => {
            const key1 = this.obtainKeyOfSpecificationType(spec1.type);
            const key2 = this.obtainKeyOfSpecificationType(spec2.type);

            let index1 = this.specificationKeys.indexOf(key1);
            let index2 = this.specificationKeys.indexOf(key2);

            index1 = index1 >= 0 ? index1 : this.specificationKeys.length;
            index2 = index2 >= 0 ? index2 : this.specificationKeys.length;

            return index1 !== index2
              ? index1 - index2
              : key1.localeCompare(key2);
          });
      },

      productPrice(): ProductPrices | null {
        if (!this.allowEdit) return null;
        if (!this.product) return null;
        return this.product.price;
      },
      productPriceNormal(): ProductPrice {
        if (!this.productPrice) return new ProductPrice(undefined);
        if (!this.productPrice.normal) return new ProductPrice(undefined);
        return this.productPrice.normal;
      },
      productPricePromotion(): ProductPrice {
        if (!this.productPrice) return new ProductPrice(undefined);
        if (!this.productPrice.promotion) return new ProductPrice(undefined);
        return this.productPrice.promotion;
      },
      price(): { from?: ProductPrice; to?: ProductPrice } | null {
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
        const selfElement = this.$el as HTMLElement;
        const bodyElement = this.$refs.body as HTMLElement;
        const parentHeight = selfElement.offsetHeight;
        const height = bodyElement.offsetHeight;

        if (height > parentHeight && this.previousHeight !== height) {
          this.previousHeight = height;
          this.padding = this.padding - this.initialPadding / 10;
          this.gap = this.gap - this.initialGap / 10;
          this.specificationGap =
            this.specificationGap - this.initialSpecificationGap / 10;
          setTimeout(() => this.invalidateHeight(), 100);
        }
      },

      obtainKeyOfSpecificationType(type: Object | string | any) {
        if (typeof type === "object") return type.key;
        if (typeof type === "string") return type;
        return "";
      },
    },
  });
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
        padding: `${padding}px ${initialPadding}px`,
        gap: `${gap}px`,
      }"
    >
      <span class="ExportLayoutOne-title">{{ fullTitle }}</span>

      <div
        class="ExportLayoutOne-items"
        :style="{ gap: `${specificationGap}px` }"
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
