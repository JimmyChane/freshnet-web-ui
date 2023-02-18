<script>
   import MenuIcon from "@/components/MenuIcon.vue";

   export default {
      components: { MenuIcon },
      props: {
         menus: { default: undefined },
         icon: { type: String, default: "" },
      },
   };
</script>

<template>
   <MenuIcon
      :menus="menus"
      :src="host.icon('option-black')"
      @show="() => $emit('show')"
      @hide="() => $emit('hide')"
   />
</template>
