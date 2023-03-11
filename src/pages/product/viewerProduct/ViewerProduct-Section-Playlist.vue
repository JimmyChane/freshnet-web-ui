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
         previousProductId: (c) => (c.previousProduct ? c.previousProduct.id : ""),
         nextProductId: (c) => (c.nextProduct ? c.nextProduct.id : ""),
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
   <div class="SectionPlaylist" v-if="nextProduct || previousProduct">
      <Section v-if="previousProduct" title="Previous" :primaryColor="primaryColor">
         <div class="SectionPlaylist-playlist">
            <router-link
               ref="keyprevious"
               :to="{ query: { productId: previousProductId } }"
               replace
            >
               <ItemProductSuggest :item="previousProduct" />
            </router-link>
         </div>
      </Section>

      <Section v-if="nextProduct" title="Next" :primaryColor="primaryColor">
         <div class="SectionPlaylist-playlist">
            <router-link
               ref="keynext"
               :to="{ query: { productId: nextProductId } }"
               replace
            >
               <ItemProductSuggest :item="nextProduct" />
            </router-link>
         </div>
      </Section>
   </div>
</template>

<style lang="scss" scoped>
   .SectionPlaylist {
      grid-area: playlist;
      width: 100%;
      max-width: 50rem;
      gap: 1rem;
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
         column-gap: 2rem;
         row-gap: 1rem;

         & > * {
            width: 100%;
            font-size: 1rem;
            text-decoration: none;
            color: inherit;
            & > * {
               margin: auto;
            }
         }
      }
   }
</style>
