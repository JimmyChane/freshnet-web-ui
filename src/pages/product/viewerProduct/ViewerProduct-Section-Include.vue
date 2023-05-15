<script>
   import U from "@/U";
   import Section from "./ViewerProduct-Section.vue";

   export default {
      components: { Section },
      props: {
         primaryColor: { type: Object },
         allowEdit: { type: Boolean, default: false },
         product: { type: Object, default: () => null },
      },
      computed: {
         gifts: (c) => c.product?.gifts ?? [],
         bundles: (c) => c.product?.bundles ?? [],

         items: (c) => {
            return [
               ...c.gifts
                  .map((gift) => U.optString(gift).trim())
                  .filter((gift) => gift.length),
               ...c.bundles
                  .filter((bundle) => U.isObjectOnly(bundle))
                  .map((bundle) => U.optString(bundle.title).trim())
                  .filter((bundle) => bundle.length),
            ];
         },
      },
   };
</script>

<template>
   <!-- <Section 
      :title="allowEdit ? `What's Included` : ''" 
   > -->

   <Section
      v-if="allowEdit || items.length"
      :title="`What's Included`"
      :primaryColor="primaryColor"
   >
      <div class="SectionInclude">
         <div class="SectionInclude-items" v-if="items.length">
            <span
               class="SectionInclude-item"
               v-for="item of items"
               :key="item"
               >{{ item }}</span
            >
         </div>

         <span class="SectionInclude-noContent" v-else>Nothing Included</span>
      </div>
   </Section>
</template>

<style lang="scss" scoped>
   .SectionInclude {
      grid-area: gift;
      width: 100%;
      gap: 2px;
      font-size: 1rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      & > * {
         width: 100%;
         padding: 1.2rem;
         background: hsla(0, 0%, 100%, 0.6);
      }

      .SectionInclude-items {
         gap: 0.2rem;

         overflow: hidden;
         overflow-x: auto;

         display: flex;
         flex-direction: row;
         align-items: flex-start;

         .SectionInclude-item {
            --size: 8rem;
            width: var(--size);
            min-width: var(--size);
            height: var(--size);
            padding: 0.8rem;

            border-radius: 1rem;

            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border: 1px solid hsla(0, 0%, 0%, 0.2);
         }
      }
      .SectionInclude-noContent {
         font-style: italic;
         font-size: 0.8rem;
         color: hsla(0, 0%, 0%, 0.6);
      }
   }
</style>
