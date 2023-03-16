<script>
   import FloatingButton from "./BottomActionbar-FloatingButton.vue";
   export default {
      props: { isHidden: { type: Boolean, default: false } },
      components: { FloatingButton },
   };
</script>

<template>
   <FloatingButton
      :class="['transition', 'ButtonTop']"
      :isHidden="`${isHidden}`"
      @click="() => $emit('click')"
   >
      <img class="ButtonTop-icon" :src="host.icon('arrow-left-000000')" />
   </FloatingButton>
</template>

<style lang="scss" scoped>
   .ButtonTop {
      height: 4rem;
      width: 4rem;

      .ButtonTop-icon {
         --size: 1.2rem;
         width: var(--size);
         height: var(--size);
         transform: rotate(90deg);
      }

      transition-timing-function: cubic-bezier(1, 0, 0, 1);
   }

   .ButtonTop[isHidden="true"] {
      transform: scale(0);
      pointer-events: none;
      opacity: 0;
      margin-left: -4.3rem;
   }
</style>
