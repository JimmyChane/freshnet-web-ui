<script>
   export default {
      props: {
         title: { type: String, default: "" },
         checked: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <button class="ItemProductStockCheckbox transition" @click="$emit('click')">
      <span class="ItemProductStockCheckbox-title">{{ title }}</span>
      <input
         class="ItemProductStockCheckbox-checkbox"
         type="checkbox"
         :checked="checked"
      />
   </button>
</template>

<style lang="scss" scoped>
   .ItemProductStockCheckbox {
      font-size: 1rem;
      background: var(--primary-color);
      border: none;
      padding: 0.8rem 1.2rem;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 1em;
      color: white;
      border-radius: 0.6rem;
      cursor: pointer;

      &:hover,
      &:focus {
         opacity: 0.7;
      }

      .ItemProductStockCheckbox-title {
         flex-grow: 1;
         text-align: start;
      }
      .ItemProductStockCheckbox-checkbox {
         width: 1rem;
         height: 1rem;
         border: white;
         background: var(--primary-color);
         pointer-events: none;
      }
   }
</style>
