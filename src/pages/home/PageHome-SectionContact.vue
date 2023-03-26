<script>
   import Section from "./PageHome-Section.vue";
   import Group from "./PageHome-SectionContact-Group.vue";
   import Company from "@/host/Company";

   export default {
      components: { Section, Group },
      props: { isThin: { type: Boolean, default: false } },
      data: (c) => ({
         items: [
            {
               title: "Beh Aik Keong",
               callNumber: "0167959444",
               whatsappNumber: "0167959444",
            },
            {
               title: "Office (Mobile)",
               callNumber: "0146315353",
               whatsappNumber: "0146315353",
               telegramName: "FreshnetEnterprise",
            },
            {
               title: "Office",
               phoneNumber: "0332897297",
               telephoneNumber: "0332897297",
            },
         ],
      }),
      computed: { groups: () => Company.Contacts.toGroupsByCategory() },
   };
</script>

<template>
   <Section>
      <div class="HomeSectionContact" :isThin="`${isThin}`">
         <Group
            v-for="group of groups"
            :key="group.title"
            :style="{
               'grid-column': 'auto / span 1',
               'grid-row': 'auto / span 2',
            }"
            :isThin="isThin"
            :group="group"
         />
      </div>
   </Section>
</template>

<style lang="scss" scoped>
   .HomeSectionContact {
      width: 100%;
      background-color: white;
      border-radius: 1em;
      overflow: hidden;

      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));

      justify-content: center;
      align-items: center;
      justify-items: center;
      align-content: center;
   }
   .HomeSectionContact[isThin="true"] {
      font-size: 1rem;
   }
   .HomeSectionContact[isThin="false"] {
      font-size: 1.3rem;
   }
</style>
