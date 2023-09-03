<script lang="ts">
  import Specification, { Type } from "@/items/Specification";
  import ItemSpecification from "./PageProductExport-Layout-Two-Specification.vue";
  import ProductPrice from "@/items/ProductPrice";
  import U from "@/U";
  import User from "@/items/User";
  import Product from "@/items/Product";
  import Vue from "vue";
  import ProductPrices from "@/items/ProductPrices";

  export default Vue.extend({
    components: { ItemSpecification },
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
        initialSpecificationPadding: 14,

        fullTitle: "",
        paddingVertical: 40,
        paddingHorizontal: 0,
        gap: 0,
        specificationPadding: 0,
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
        if (!U.isArray(this.product.specifications)) return [];

        return this.product.specifications
          .filter((spec) => spec && spec.type && spec.content)
          .filter((spec) => {
            return [
              "processor",
              "ram",
              "storage",
              "display",
              "graphic",
              "os",
            ].includes(spec.typeKey);
          })
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
        return this.productPrice?.normal ?? new ProductPrice(undefined);
      },
      productPricePromotion(): ProductPrice {
        return this.productPrice?.promotion ?? new ProductPrice(undefined);
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

      gifts(): string[] {
        const gifts = this.product?.gifts ?? [];
        return gifts
          .map((gift) => U.optString(gift).trim())
          .filter((gift) => gift.length);
      },
      bundles(): string[] {
        const bundles = this.product?.bundles ?? [];
        return bundles
          .filter((bundle) => U.isObjectOnly(bundle))
          .map((bundle) => U.optString(bundle.title).trim())
          .filter((bundle) => bundle.length);
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
        this.paddingHorizontal = this.initialPadding;
        this.gap = this.initialGap;
        this.specificationPadding = this.initialSpecificationPadding;

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
          this.paddingHorizontal =
            this.paddingHorizontal - this.initialPadding / 10;
          this.gap = this.gap - this.initialGap / 10;
          this.specificationPadding =
            this.specificationPadding - this.initialSpecificationPadding / 10;
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
    class="ExportLayoutTwo"
    :style="{ '--width': `${width}px`, '--height': `${height}px` }"
  >
    <div
      class="ExportLayoutTwo-body"
      ref="body"
      :style="{
        padding: `${paddingHorizontal}px ${paddingVertical}px`,
        gap: `${gap}px`,
      }"
    >
      <div
        class="ExportLayoutTwo-header"
        :style="{
          padding: `0 ${specificationPadding}px`,
        }"
      >
        <div class="ExportLayoutTwo-header-left">
          <span class="ExportLayoutTwo-title">{{ fullTitle }}</span>
          <div class="ExportLayoutTwo-gifts">
            <span v-for="gift of gifts" :key="gift">{{ gift }}</span>
          </div>
        </div>

        <div class="ExportLayoutTwo-header-right">
          <span class="ExportLayoutTwo-price" v-if="price && price.to">{{
            price.to
          }}</span>
          <div class="ExportLayoutTwo-includes">
            <span v-for="bundle of bundles" :key="bundle">{{ bundle }}</span>
          </div>
        </div>
      </div>

      <div class="ExportLayoutTwo-items">
        <ItemSpecification
          v-for="(specification, index) in specifications"
          :key="specification.name"
          :item="specification"
          :padding="specificationPadding"
          :isLastItem="index === specifications.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ExportLayoutTwo {
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

    .ExportLayoutTwo-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .ExportLayoutTwo-header {
        width: 100%;
        gap: 50px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;

        --font-size-text-title: 30px;
        --font-size-text-hint: 12px;

        & > * {
          width: 100%;
          max-width: max-content;
        }

        .ExportLayoutTwo-header-left {
          flex-grow: 1;

          text-align: start;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          .ExportLayoutTwo-title {
            font-size: var(--font-size-text-title);
            font-weight: 600;
          }
          .ExportLayoutTwo-gifts {
            font-size: var(--font-size-text-hint);
            column-gap: 16px;
            row-gap: 4px;

            flex-wrap: wrap;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
        }
        .ExportLayoutTwo-header-right {
          flex-grow: 1;

          text-align: end;

          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;

          .ExportLayoutTwo-price {
            font-size: var(--font-size-text-title);
          }
          .ExportLayoutTwo-includes {
            font-size: var(--font-size-text-hint);
            column-gap: 16px;
            row-gap: 4px;

            flex-wrap: wrap;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
      .ExportLayoutTwo-items {
        width: 100%;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
      }
    }
  }
</style>
