<script>
   import LeftNavGroup3 from "./NavigationLeft-Group3.vue";

   export default {
      components: { LeftNavGroup3 },
      props: {
         group2: { type: Object, default: () => null },
      },
      computed: {
         title: (c) => c.group2.title,
         group3s: (c) => c.group2.groups,
         isWide: (c) => c.group2.isWide(),
      },
   };
</script>

<template>
   <div class="LeftNavGroup2" :isWide="`${isWide}`">
      <span class="LeftNavGroup2-title" v-if="isWide && title">{{
         title
      }}</span>

      <div class="LeftNavGroup2-groups" v-if="group3s">
         <LeftNavGroup3
            v-for="group3 of group3s"
            :key="group3.key"
            :group3="group3"
            :isWide="isWide"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .LeftNavGroup2 {
      display: flex;
      flex-direction: column;

      .LeftNavGroup2-title {
         width: fit-content;
         margin-left: 0.4em;
         padding: 0.6rem 1rem;

         font-size: 0.7em;
         font-weight: 600;
         opacity: 1;
         letter-spacing: 0.3em;
         color: var(--primary-color);
         color: hsla(0, 0%, 0%, 0.7);
      }

      .LeftNavGroup2-groups {
         display: flex;
         flex-direction: column;
         align-items: stretch;
      }
   }

   .LeftNavGroup2[isWide="true"] {
      width: 100%;
      .LeftNavGroup2-group3s {
         width: 100%;
      }
   }
</style>
