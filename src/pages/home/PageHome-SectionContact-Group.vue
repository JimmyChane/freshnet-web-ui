<script>
   import Item from "./PageHome-SectionContact-Group-Item.vue";

   export default {
      components: { Item },
      props: {
         isThin: { type: Boolean, default: false },
         group: { type: Object },
      },
      computed: {
         title: (c) => c.group.category.title,
         icon: (c) => c.group.category.icon,
         items: (c) => c.group.items,

         firstItem: (c) => (c.items.length > 0 ? c.items[0] : null),
         fisrtHref: (c) => c.firstItem?.href ?? "",
         fisrtTarget: (c) => c.firstItem?.target ?? undefined,
      },
   };
</script>

<template>
   <a
      :class="['ContactGroup', 'transition']"
      :isThin="`${isThin}`"
      :href="fisrtHref"
      :target="fisrtTarget"
   >
      <img class="ContactGroup-icon" :src="icon" />
      <div class="ContactGroup-main">
         <span class="ContactGroup-title">{{ title }}</span>
         <Item v-for="item of items" :key="item.title" :item="item" />
      </div>
   </a>
</template>

<style lang="scss" scoped>
   .ContactGroup {
      overflow: hidden;
      color: black;
      text-decoration: none;
      position: relative;

      width: 100%;
      height: 100%;
      padding: 1em;
      border-radius: 1em;
      gap: 1em;

      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;

      &:hover,
      &:focus {
         background: rgba(0, 0, 0, 0.1);
      }

      .ContactGroup-main {
         flex-grow: 1;
         height: 100%;
         gap: 0.5em;

         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .ContactGroup-title {
            font-weight: 600;
         }
      }
      .ContactGroup-icon { 
         --size: 5em;
         width: var(--size);
         height: var(--size);

         padding: 1.5em;

         background: white;
         border-radius: 1.2em;
      }
   }
</style>
