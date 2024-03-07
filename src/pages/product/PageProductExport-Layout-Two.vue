<script>
  import { Type } from "@/items/Specification";
  import ItemSpecification from "./PageProductExport-Layout-Two-Specification.vue";
  import ProductPrice from "@/items/ProductPrice";
  import { isArray, isObjectOnly, optString } from "@/U";

  export default {
    components: { ItemSpecification },
    props: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      product: { type: Object, default: () => null },
    },
    data: (c) => ({
      previousHeight: 0,
      initialPadding: 60,
      initialGap: 30,
      initialSpecificationPadding: 14,

      fullTitle: "",
      paddingVertical: 40,
      paddingHorizontal: 0,
      gap: 0,
      specificationPadding: 0,
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
        if (!isArray(c.product.specifications)) return [];

        return c.product.specifications
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

      productPrice: (c) => {
        if (!c.allowEdit) return null;
        if (!c.product) return null;
        return c.product.price;
      },
      productPriceNormal: (c) => {
        return c.productPrice?.normal ?? new ProductPrice();
      },
      productPricePromotion: (c) => {
        return c.productPrice?.promotion ?? new ProductPrice();
      },
      price: (c) => {
        if (!c.allowEdit) return null;

        let normal = c.productPriceNormal;
        let promotion = c.productPricePromotion;

        if (normal.value > 0 && promotion.value <= 0) return { to: normal };
        if (normal.value > 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        if (normal.value <= 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        return null;
      },

      gifts: (c) => {
        const gifts = c.product?.gifts ?? [];
        return gifts
          .map((gift) => optString(gift).trim())
          .filter((gift) => gift.length);
      },
      bundles: (c) => {
        const bundles = c.product?.bundles ?? [];
        return bundles
          .filter((bundle) => isObjectOnly(bundle))
          .map((bundle) => optString(bundle.title).trim())
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
        const parentHeight = this.$el.offsetHeight;
        const height = this.$refs.body.offsetHeight;

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
    class="ExportLayoutTwo"
    :style="{ '--width': `${width}px`, '--height': `${height}px` }"
  >
    <div
      class="ExportLayoutTwo-body"
      ref="body"
      :style="{
        'padding': `${paddingHorizontal}px ${paddingVertical}px`,
        'gap': `${gap}px`,
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
