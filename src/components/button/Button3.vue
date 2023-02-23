<script>
   export default {
      emits: ["click"],
      props: {
         isSelected: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <button
      :class="[
         'Button3',
         `Button3-${isSelected ? 'isSelected' : 'isDeselected'}`,
         'transition',
      ]"
      @click="$emit('click')"
      @focus="$emit('focus')"
   >
      <div class="Button3-background transition"></div>
      <div class="Button3-color transition"></div>

      <slot />
   </button>
</template>

<style lang="scss" scoped>
   .Button3 {
      position: relative;
      width: 100%;
      height: 100%;
      border: none;
      background: white;
      border-radius: 1rem;
      overflow: hidden;

      display: flex;
      flex-direction: row;
      align-items: center;

      .Button3-color {
         --width: 0.5rem;
         --width: 4px;

         --height: calc(100% + 0.1rem);

         width: var(--width);
         height: var(--height);
         min-width: var(--width);
         min-height: var(--height);
         display: flex;
         flex-direction: row;

         background: none;
         opacity: 0;
         pointer-events: none;
         background-color: var(--primary-color);
         border-top-left-radius: 0.3rem;
         border-bottom-left-radius: 0.3rem;
      }
      .Button3-background {
         position: absolute;
         min-width: 100%;
         min-height: 100%;
         background: none;
         border-radius: inherit;
         opacity: 0;
         pointer-events: none;
         background-color: var(--primary-color);
      }
   }

   .Button3-isSelected {
      border: 1px solid var(--primary-color);

      .Button3-color {
         opacity: 1;
      }
      .Button3-background {
         opacity: 0.1;
      }
   }
   .Button3-isDeselected {
      border: 1px solid #dcdcdc;
      cursor: pointer;

      &:hover,
      &:focus {
         .Button3-color {
            opacity: 0.3;
         }
         .Button3-background {
            opacity: 0.05;
         }
      }
   }
</style>
