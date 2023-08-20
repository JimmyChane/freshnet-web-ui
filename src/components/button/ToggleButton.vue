<script>
   export default {
      emits: ["click-toggle"],
      props: {
         isToggled: { type: Boolean, default: false },
         isSelectable: { type: Boolean, default: true },
      },
   };
</script>

<template>
   <button
      class="ToggleButton"
      :class="[
         isToggled ? 'ToggleButton-isToggled' : '',
         isSelectable ? 'ToggleButton-isSelectable' : '',
      ]"
      @click="$emit('click-toggle', !isToggled)"
   >
      <div class="ToggleButton-object"></div>
   </button>
</template>

<style lang="scss" scoped>
   .ToggleButton {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 44px;
      min-width: 44px;
      border-radius: 22px;
      padding: 2px 3px;
      cursor: pointer;
      transition-duration: 200ms;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);

      .ToggleButton-object {
         --size: 14px;
         width: var(--size);
         height: var(--size);
         min-width: var(--size);
         min-height: var(--size);
         max-width: var(--size);
         max-height: var(--size);
         border-radius: 50%;
         transition-duration: 200ms;
         transition-timing-function: cubic-bezier(1, 0, 0, 1);
      }

      --color-selected: hsl(112, 30%, 54%);
      --color-selected-background: hsla(112, 30%, 54%, 0.2);
      --color-selected-hover: hsl(112, 40%, 40%);
      --color-unselected: hsl(0, 30%, 54%);
      --color-unselected-background: hsla(0, 30%, 54%, 0.2);
      --color-unselected-hover: hsl(0, 40%, 40%);

      border: 2px solid var(--color-unselected);
      background: var(--color-unselected-background);
      .ToggleButton-object {
         background: var(--color-unselected);
         transform: translateX(0%);
      }
      &:hover {
         border: 2px solid var(--color-unselected-hover);
         .ToggleButton-object {
            background: var(--color-unselected-hover);
         }
      }
   }

   .ToggleButton-isToggled {
      border: 2px solid var(--color-selected);
      background: var(--color-selected-background);
      .ToggleButton-object {
         background: var(--color-selected);
         transform: translateX(20px);
      }
      &:hover {
         border: 2px solid var(--color-selected-hover);
         .ToggleButton-object {
            background: var(--color-selected-hover);
         }
      }
   }

   .ToggleButton {
      opacity: 0.5;
      pointer-events: none;
   }
   .ToggleButton-isSelectable {
      opacity: 1;
      pointer-events: initial;
   }
</style>
