<script>
   import Actionbar from "@/components/navigation/actionbar2/Actionbar.vue";

   export default {
      emits: ["click-drawer-expand"],
      components: { Actionbar },
      props: {
         title: { type: String, default: "" },
         leftMenus: { type: Array, default: () => [] },
         rightMenus: { type: Array, default: () => [] },
         hasShadow: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <Actionbar
      class="ActionBarManage"
      :title="title"
      :leftMenus="[
         $root.navigation.isDrawer()
            ? {
                 key: 'hamburgerMenu',
                 title: 'Hamburger Menu',
                 icon: host.res('icon/hamburgerMenu-2A4858.svg'),
                 click: () => $emit('click-drawer-expand'),
              }
            : null,
         ...leftMenus,
      ]"
      :rightMenus="rightMenus"
      :hasShadow="hasShadow"
   >
      <slot />
   </Actionbar>
</template>
