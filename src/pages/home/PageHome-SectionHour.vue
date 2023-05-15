<script>
   import Section from "./PageHome-Section.vue";
   import Item from "./PageHome-SectionHour-Item.vue";
   import Setting from "@/items/Setting";

   export default {
      components: { Section, Item },
      props: { isThin: { type: Boolean, default: false } },
      data: (c) => ({ items: [] }),
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      methods: {
         async invalidate() {
            this.items = await this.settingStore.dispatch("findValueOfKey", {
               key: Setting.Key.CompanyWorkingHours,
               default: [],
            });
         },
      },
      mounted() {
         this.invalidate();
      },
   };
</script>

<template>
   <Section title="Business Hours">
      <div class="HomeSectionHour" :isThin="`${isThin}`">
         <div class="HomeSectionHour-body">
            <Item v-for="item of items" :key="item.title" :item="item" />
         </div>
      </div>
   </Section>
</template>

<style lang="scss" scoped>
   .HomeSectionHour {
      background-color: white;
      overflow: hidden;
      color: black;

      border-radius: 1em;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .HomeSectionHour-body {
         padding: 1.8em 1.3em;
         gap: 0.5em;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
      }
   }
   .HomeSectionHour[isThin="true"] {
      width: 100%;
      height: 100%;
      font-size: 1rem;
   }
   .HomeSectionHour[isThin="false"] {
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
   }
</style>
