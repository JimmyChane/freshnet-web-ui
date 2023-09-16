<script>
   export default {
      props: {
         title: { type: String, default: "" },
         content: { type: String, default: "" },
      },
   };
</script>
<template>
   <div class="PriceEditorItem">
      <span>{{ title }}</span>
      <span>{{ content }}</span>
   </div>
</template>
<style lang="scss" scoped>
   .PriceEditorItem {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 1rem;
      background: hsla(0, 0%, 100%, 0.6);
      padding: 1.2rem;

      & > * {
         min-height: 1rem;
      }

      :nth-child(1) {
         min-width: 5rem;
         font-weight: 400;
         font-size: 0.7rem;
      }
      :nth-child(2) {
         font-size: 1rem;
      }
   }
</style>
