<script>
   export default {
      props: {
         belonging: { type: Object, default: () => null },
      },
      computed: {
         title: (c) => c.belonging.title,
         quantity: (c) => c.belonging.quantity,
         description: (c) => c.belonging.description,
      },
   };
</script>

<template>
   <div class="ItemBelonging">
      <span class="ItemBelonging-title" style="grid-area: title">{{
         title
      }}</span>
      <span
         class="ItemBelonging-quantity"
         style="grid-area: quantity"
         v-if="quantity > 1"
         >{{ `x${quantity}` }}</span
      >

      <p
         class="ItemBelonging-description"
         style="grid-area: description"
         v-if="description.length"
         >{{ description }}</p
      >
   </div>
</template>

<style lang="scss" scoped>
   .ItemBelonging {
      gap: 0 1rem;
      padding: 0.5rem;
      background: hsla(0, 0%, 100%, 0.9);

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      width: 100%;

      display: grid;
      grid-template-areas:
         "title quantity menu"
         "description description description";
      grid-template-columns: max-content 1fr max-content;
      grid-template-rows: max-content 1fr;
      justify-items: flex-start;

      & > * {
         min-height: 1.5rem;
         padding: 0 0.3rem;
         display: flex;
         text-align: start;
         align-items: center;
         justify-content: center;
         text-align: start;
      }

      .ItemBelonging-title {
         font-weight: 600;
      }
      .ItemBelonging-quantity {
         background: hsla(0, 0%, 0%, 0.05);
         border: 0.1rem solid hsla(0, 0%, 0%, 0.1);
         border-radius: 0.3rem;
      }
      .ItemBelonging-description {
         font-size: 0.8em;
      }
   }
</style>
