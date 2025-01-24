<script>
import ImageView from '@/components/ImageView.vue';
import Product from '@/items/Product';

export default {
  components: { ImageView },
  props: { product: { type: Product } },
  data: () => ({ title: '', specifications: [], image: null, brand: null }),
  computed: {
    brandIcon: (c) => c.brand?.icon,
    threeSpecifications: (c) => {
      return c.specifications.reduce((list, spec, i) => {
        if (i < 3) list.push(spec);
        return list;
      }, []);
    },
  },
  async mounted() {
    this.title = await this.product.fetchFullTitle();
    this.specifications = this.product.specifications;
    this.image = this.product.toImageThumbnail();
    this.brand = await this.product.fetchBrand();
  },
};
</script>

<template>
  <div class="PCE-L-Product">
    <ImageView
      class="PCE-L-Product-brand"
      v-if="brandIcon"
      :src="brandIcon.toUrl()"
    />
    <span class="PCE-L-Product-title">{{ title }}</span>
    <span
      class="PCE-L-Product-specification"
      v-for="specification of threeSpecifications"
      :key="specification.key"
    >
      {{ specification.content }}
    </span>
    <ImageView class="PCE-L-Product-image" v-if="image" :src="image" />
  </div>
</template>

<style lang="scss" scoped>
.PCE-L-Product {
  border: 1px solid black;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  & > * {
    padding: 0.1rem;
  }

  .PCE-L-Product-brand {
    height: 1.6rem;
  }
  .PCE-L-Product-title {
    font-size: 1.4rem;
  }
  .PCE-L-Product-specification {
    height: 1.15em;
    line-height: 1em;
    overflow: hidden;
  }
  .PCE-L-Product-image {
    height: 4rem;
  }
}
</style>
