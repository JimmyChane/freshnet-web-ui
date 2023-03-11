<script>
   import Menus from "./Actionbar-Menus.vue";

   export default {
      components: { Menus },
      props: {
         title: { type: String, default: "" },
         leftMenus: { default: () => [] },
         rightMenus: { default: () => [] },
      },
      computed: {
         LeftMenus: (c) => c.parseMenus(c.leftMenus),
         RightMenus: (c) => c.parseMenus(c.rightMenus),
         hasSlot: (c) => !c.$slots.footer,
      },
      methods: {
         parseMenus(menus) {
            if (Array.isArray(menus))
               return menus.filter((menu) => typeof menu === "object" && menu);
            if (typeof menus === "object") return [menus];
            return [];
         },
      },
   };
</script>

<template>
   <div class="Actionbar transition">
      <Menus :style="{ 'justify-content': 'flex-start' }" :menus="LeftMenus" />
      <span class="Actionbar-title" v-if="title">{{ title }}</span>
      <slot v-if="hasSlot" />
      <Menus :style="{ 'justify-content': 'flex-end' }" :menus="RightMenus" />
   </div>
</template>

<style lang="scss" scoped>
   .Actionbar {
      --actionbar-background-color-translucent: var(--actionbar-background-color);
      --actionbar-background-color-light: var(--actionbar-color);
      --actionbar-background-color-dark: var(--actionbar-color);
      color: black;
      background-color: #f3f3f3;

      position: sticky;
      top: 0;

      --height: 3.8rem;

      width: 100%;
      min-height: var(--height);
      max-height: var(--height);
      padding: 0.4rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;

      .Actionbar-title {
         font-size: 1.3rem;
         font-weight: 600;
         white-space: nowrap;
         text-overflow: clip;
         color: inherit;

         margin: 0 0.8rem;
         overflow: hidden;

         display: flex;
         flex-direction: row;
         flex-grow: 1;
         align-items: center;
         justify-content: flex-start;
      }
   }
</style>
