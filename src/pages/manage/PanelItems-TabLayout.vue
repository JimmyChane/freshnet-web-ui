<script>
   import Tab from "./PanelItems-TabLayout-Tab.vue";

   export default {
      components: { Tab },
      props: {
         menus: { type: Array, default: () => [] },
         isScreenWide: { type: Boolean, default: true },
      },
   };
</script>

<template>
   <div :class="['PanelItems-TabLayout', 'scrollbar']">
      <div>
         <Tab
            v-for="menu of menus"
            :key="menu.title"
            :menu="menu"
            :isScreenWide="isScreenWide"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelItems-TabLayout {
      z-index: 1;
      width: 100%;
      height: max-content;
      padding: 0.4rem;
      overflow-x: auto;

      --scrollbar-size: 0.2rem;
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.05);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.1);
      --scrollbar-track-color: transparent;
      --scrollbar-track-color-hover: transparent;
      --scrollbar-track-margin: 1rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      & > * {
         width: 100%;
         max-width: max-content;
         gap: 0.1rem;

         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
      }
   }
</style>
