<script>
   import FloatingButton from "./BottomActionbar-FloatingButton.vue";
   export default {
      components: { FloatingButton },
      props: {
         target: { type: String, default: "" },
         href: { type: String, default: "" },
         icon: { type: String, default: "" },
         titleHeader: { type: String, default: "" },
         titleContent: { type: String, default: "" },
         primaryColorHex: { type: String, default: "#000000" },

         toShrink: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <FloatingButton
      :class="['transition', 'ButtonContact']"
      :toShrink="`${toShrink}`"
      :target="target"
      :href="href"
      :style="{ '--primary-color': primaryColorHex }"
   >
      <img class="ButtonContact-icon" :src="icon" />
      <div class="ButtonContact-body">
         <span class="ButtonContact-title">{{ titleHeader }}</span>
         <span class="ButtonContact-content">{{ titleContent }}</span>
      </div>
   </FloatingButton>
</template>

<style lang="scss" scoped>
   .ButtonContact {
      --height: 4rem;
      --icon-size: 1.5rem;

      height: var(--height);

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      justify-content: center;

      border: none;
      cursor: pointer;
      border-radius: 1rem;
      overflow: hidden;

      text-decoration: none;
      color: var(--primary-color);
      font-size: 1rem;
      font-weight: 600;
      line-height: 0.9rem;
      padding: 0.8rem;

      overflow: hidden;

      background: white;
      box-shadow: 0 0 5rem hsla(0, 0%, 0%, 0.3);

      .ButtonContact-icon {
         width: var(--icon-size);
         height: var(--icon-size);
         padding: 0.15rem;
      }
      .ButtonContact-body {
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: center;
         .ButtonContact-title {
            grid-area: title;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
         }
         .ButtonContact-content {
            grid-area: content;
            font-size: 0.8rem;
         }
      }
   }

   .ButtonContact[toShrink="false"] {
      gap: 0.5rem;
   }
   .ButtonContact[toShrink="true"] {
      width: var(--height);
      gap: 0;
      .ButtonContact-body {
         opacity: 0;
         pointer-events: none;
         width: 0;
      }
   }
</style>
