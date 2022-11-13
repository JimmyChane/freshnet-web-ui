<script>
   import Toggle from "./ItemSetting_Toggle.vue";
   import TextArea from "./ItemSetting_TextArea.vue";

   export default {
      components: { Toggle, TextArea },
      props: { item: { type: Object, default: () => null } },
      computed: {
         isBoolean: (context) => context.item.type === "boolean",
         isTextArea: (context) => context.item.type === "textarea",
      },
   };
</script>

<template>
   <div class="ItemSetting">
      <Toggle v-if="isBoolean" :item="item" />
      <TextArea v-if="isTextArea" :item="item" />
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
   }
</style>
