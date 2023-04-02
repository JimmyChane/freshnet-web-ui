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
         nLeftMenus() {
            if (!this.$root.navigation.isDrawer()) return this.leftMenus;
            return [
               {
                  key: "hamburgerMenu",
                  title: "Hamburger Menu",
                  icon: this.host.icon("hamburgerMenu-000000"),
                  click: () => this.$root.navigation.openNavigationDrawer(),
               },
               ...this.leftMenus,
            ];
         },
      },
   };
</script>

<template>
   <Actionbar :title="title" :leftMenus="nLeftMenus" :rightMenus="rightMenus">
      <slot />
   </Actionbar>
</template>
