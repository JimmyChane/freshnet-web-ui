<script lang="ts">
  import Section from "./ViewerProduct-Section.vue";
  import ItemProductSuggest from "./ViewerProduct-Section-Playlist-Item.vue";
  import Vue from "vue";
  import Product from "@/items/Product";

  export default Vue.extend({
    components: { Section, ItemProductSuggest },
    props: {
      primaryColor: { type: Object },
      allowEdit: { type: Boolean, default: false },
      product: { type: Product },

      previousProduct: { type: Product, default: () => null },
      nextProduct: { type: Product, default: () => null },
    },
    computed: {
      previousProductId(): string {
        if (this.previousProduct instanceof Product) {
          return this.previousProduct.id;
        }
        return "";
      },
      nextProductId(): string {
        if (this.nextProduct instanceof Product) {
          return this.nextProduct.id;
        }
        return "";
      },
    },
    methods: {
      clickPreviousProduct() {
        const ref = this.$refs.keyprevious as Vue;
        if (!ref) return;
        const element = ref.$el as HTMLElement;
        element.click();
      },
      clickNextProduct() {
        const ref = this.$refs.keynext as Vue;
        if (!ref) return;
        const element = ref.$el as HTMLElement;
        element.click();
      },
    },
  });
</script>

<template>
  <Section
    class="SectionPlaylist"
    v-if="nextProduct || previousProduct"
    :primaryColor="primaryColor"
  >
    <div class="SectionPlaylist-playlist">
      <ItemProductSuggest
        v-if="previousProduct"
        ref="keyprevious"
        title="Previous"
        :item="previousProduct"
        :to="{ query: { productId: previousProductId } }"
      />
      <ItemProductSuggest
        v-if="nextProduct"
        ref="keynext"
        title="Next"
        :item="nextProduct"
        :to="{ query: { productId: nextProductId } }"
      />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .SectionPlaylist {
    grid-area: playlist;
    width: 100%;
    max-width: 50rem;
    margin-top: 4rem;

    display: flex;
    flex-direction: column;

    .SectionPlaylist-playlist {
      width: 100%;
      overflow: hidden;

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 3px;
    }
  }
</style>
