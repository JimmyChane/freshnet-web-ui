<script>
   export default {
      emits: ["click"],
      props: {
         isSelected: { type: Boolean, default: false },
         href: { type: String, default: "" },
         to: { default: undefined },
      },
   };
</script>

<template>
   <button
      class="PanelItems-ItemButton transition"
      :isSelected="`${isSelected}`"
      @click="$emit('click')"
      @focus="$emit('focus')"
   >
      <div class="PanelItems-ItemButton-overlay transition"></div>
      <div class="PanelItems-ItemButton-color transition"></div>

      <slot />
   </button>
</template>

<style lang="scss" scoped>
   .PanelItems-ItemButton {
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

      .PanelItems-ItemButton-color {
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
         background: var(--primary-color);
         border-top-left-radius: 0.3rem;
         border-bottom-left-radius: 0.3rem;
      }
      .PanelItems-ItemButton-overlay {
         position: absolute;
         min-width: 100%;
         min-height: 100%;
         background: none;
         border-radius: inherit;
         opacity: 0;
         pointer-events: none;
         background: var(--primary-color);
      }
   }

   .PanelItems-ItemButton[isSelected="true"] {
      border: 1px solid var(--primary-color);

      .PanelItems-ItemButton-color {
         opacity: 1;
      }
      .PanelItems-ItemButton-overlay {
         opacity: 0.1;
      }
   }
   .PanelItems-ItemButton[isSelected="false"] {
      border: 1px solid #dcdcdc;
      cursor: pointer;

      &:hover,
      &:focus {
         .PanelItems-ItemButton-color {
            opacity: 0.3;
         }
         .PanelItems-ItemButton-overlay {
            opacity: 0.05;
         }
      }
   }
</style>
