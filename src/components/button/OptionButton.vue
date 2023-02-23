<script>
   import Menu from "@/components/Menu.vue";

   export default {
      Mode: Menu.Mode,

      components: { Menu },
      props: {
         menus: { type: Array, default: () => [] },
         icon: { type: String, default: "" },
      },
   };
</script>

<template>
   <Menu
      class="OptionButton"
      :menus="menus"
      @mode-change="(mode) => $emit('mode-change', mode)"
   >
      <img
         class="OptionButton-icon"
         :src="icon ? icon : host.icon('option-black')"
      />
   </Menu>
</template>

<style lang="scss" scoped>
   .OptionButton {
      border-radius: 50%;

      .OptionButton-icon {
         width: 1.2em;
         height: 1.2em;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
      }
   }
</style>
