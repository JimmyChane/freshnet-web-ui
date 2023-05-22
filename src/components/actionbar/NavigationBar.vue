<script>
   import Actionbar from "./Actionbar.vue";

   export default {
      components: { Actionbar },
      props: {
         title: { type: String, default: "" },
         leftMenus: { type: Array, default: () => [] },
         rightMenus: { type: Array, default: () => [] },
      },
      computed: {
         moreLeftMenus: (c) => {
            if (!c.$root.navigation.isDrawer()) return c.leftMenus;
            return [
               {
                  key: "hamburgerMenu",
                  title: "Hamburger Menu",
                  icon: c.host.icon("hamburgerMenu-000000"),
                  click: () => c.$root.navigation.openNavigationDrawer(),
               },
               ...c.leftMenus,
            ];
         },
      },
   };
</script>

<template>
   <Actionbar
      :title="title"
      :leftMenus="moreLeftMenus"
      :rightMenus="rightMenus"
   >
      <slot />
   </Actionbar>
</template>
