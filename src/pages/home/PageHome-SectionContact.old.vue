<script>
   import Section from "./PageHome-Section.vue";
   import Group from "./PageHome-SectionContact-Group.vue";
   import Setting from "@/items/Setting";

   export default {
      components: { Section, Group },
      props: { isThin: { type: Boolean, default: false } },
      data: (c) => ({ groups: [] }),
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const contacts = await this.settingStore.dispatch(
               "findValueOfKey",
               { key: Setting.Key.Contacts, default: [] },
            );

            this.groups = contacts.reduce((groups, contact) => {
               const optGroup = (category) => {
                  let group = groups.find((group) => {
                     return group.category === category;
                  });
                  if (!group) groups.push((group = { category, items: [] }));
                  return group;
               };

               for (const link of contact.links) {
                  optGroup(link.category).items.push({
                     title: contact.title,
                     subtitle: link.id,
                     href: link.toHtmlHref(),
                     target: link.toHtmlTarget(),
                  });
               }

               return groups;
            }, []);
         },
      },
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
      background: white;
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
</style>
