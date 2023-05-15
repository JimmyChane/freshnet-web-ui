<script>
   export default {
      props: {
         item: { type: Object, default: () => null },
      },
      computed: {
         title: (c) => c.item.title,
         isSelected: (c) => c.item.isSelected(),
      },
   };
</script>

<template>
   <button
      :class="[
         'Tabs-Tab',
         isSelected ? 'Tabs-Tab-isSelected' : 'Tabs-Tab-isDeselected',
         'transition',
      ]"
      @click="
         () => {
            item.click(item);
            $emit('click', item);
         }
      "
      >{{ title }}</button
   >
</template>

<style lang="scss" scoped>
   .Tabs-Tab {
      min-width: max-content;
      border: none;
      background: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem 0.7rem;
   }
   .Tabs-Tab-isDeselected {
      transform: scale(0.8);
      color: hsla(0, 0%, 0%, 0.5);
      cursor: pointer;
   }
   .Tabs-Tab-isSelected {
      color: black;
   }
</style>
