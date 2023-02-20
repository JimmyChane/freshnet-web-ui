<script>
   export default {
      props: {
         belonging: { type: Object, default: () => null },
      },
      computed: {
         title: (c) => c.belonging.title,
         quantity: (c) => c.belonging.quantity,
      },
   };
</script>

<template>
   <div class="ItemBelonging">
      <span class="ItemBelonging-title">{{ title }}</span>

      <span class="ItemBelonging-quantity" v-if="quantity > 1">{{ `x${quantity}` }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .ItemBelonging {
      gap: 1rem;
      padding: 0.5rem;
      background-color: hsla(0, 0%, 100%, 0.9);

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      & > * {
         min-height: 1.5rem;
         padding: 0 0.3rem;
         display: flex;
         text-align: start;
         align-items: center;
         justify-content: center;
      }

      .ItemBelonging-quantity {
         background: hsla(0, 0%, 0%, 0.05);
         border: 0.1rem solid hsla(0, 0%, 0%, 0.1);
         border-radius: 0.3rem;
         display: flex;
         align-items: center;
         justify-content: center;
      }
   }
</style>
