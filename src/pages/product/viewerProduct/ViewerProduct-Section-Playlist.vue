<script>
   import Section from "./ViewerProduct-Section.vue";
   import ItemProductSuggest from "./ViewerProduct-Section-Playlist-Item.vue";

   export default {
      components: { Section, ItemProductSuggest },
      props: {
         primaryColor: { type: Object },
         allowEdit: { type: Boolean, default: false },
         product: { type: Object, default: () => null },

         previousProduct: { type: Object, default: () => null },
         nextProduct: { type: Object, default: () => null },
      },
      computed: {
         previousProductId: (c) => c.previousProduct?.id ?? "",
         nextProductId: (c) => c.nextProduct?.id ?? "",
      },
      methods: {
         clickPreviousProduct() {
            const ref = this.$refs.keyprevious;
            if (!ref) return;
            ref.$el.click();
         },
         clickNextProduct() {
            const ref = this.$refs.keynext;
            if (!ref) return;
            ref.$el.click();
         },
      },
   };
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
         gap: 1px;
      }
   }
</style>
