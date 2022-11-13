<script>
   import ButtonIcon from "../../button/ButtonIcon.vue";
   import ButtonText from "../../button/ButtonText.vue";
   export default {
      components: { ButtonIcon, ButtonText },
      props: {
         menus: { type: Array, default: () => [] },
      },
      computed: {
         Menus: (c) => {
            return (Array.isArray(c.menus) ? c.menus : []).filter((menu) => {
               return typeof menu === "object" && menu !== null;
            });
         },
      },
   };
</script>

<template>
   <div class="ActionBar2Menus">
      <div class="ActionBar2Menus-menu" v-for="menu in Menus" :key="menu.key">
         <ButtonIcon
            class="ActionBar2Menus-menu-icon"
            v-if="menu.icon !== undefined"
            :src="menu.icon"
            :alt="menu.title"
            @click="menu.click()"
         />
         <ButtonText
            v-else-if="menu.title !== undefined"
            class="ActionBar2Menus-menu-textButton"
            :text="menu.title"
            @click="menu.click()"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ActionBar2Menus {
      width: max-content;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: end;
      gap: 0.2rem;
      .ActionBar2Menus-menu {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
         .ActionBar2Menus-menu-icon {
            font-size: 1.2rem;
         }
         .ActionBar2Menus-menu-textButton {
            color: inherit;
         }
      }
   }
</style>
