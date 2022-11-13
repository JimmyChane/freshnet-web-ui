<script>
   import TextString from "./TextString.vue";

   export default {
      components: { TextString },
      props: {
         title: { type: String, default: "" },
         isRequired: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <div class="WindowSection">
      <TextString
         class="WindowSection-header"
         v-if="title || isRequired"
         :text="title"
         :isRequired="isRequired"
      />

      <div class="WindowSection-main">
         <slot />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .WindowSection {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

      .WindowSection-header {
         width: 100%;
         font-size: 1.1rem;
         font-weight: 900;
      }
      .WindowSection-main {
         width: 100%;
         display: flex;
         flex-direction: column;
      }
   }
</style>
