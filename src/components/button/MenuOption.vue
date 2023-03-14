<script>
   import MenuIcon from "@/components/MenuIcon.vue";
   import U from "@/U";
   import chroma from "chroma-js";

   export default {
      components: { MenuIcon },
      props: {
         menus: { default: undefined },
         primaryColor: { default: () => chroma("ffffff") },
      },
      computed: { isDark: (c) => U.isColorDark(c.primaryColor, 60) },
   };
</script>

<template>
   <MenuIcon
      :menus="menus"
      :src="host.icon(isDark ? 'option-ffffff' : 'option-000000')"
      @show="() => $emit('show')"
      @hide="() => $emit('hide')"
   />
</template>
