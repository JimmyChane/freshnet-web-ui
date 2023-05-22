<script>
   export default {
      name: "Button",
      props: {
         text: { type: String, default: "Click Me" },
         icon: { type: String },
         iconActive: { type: String },
      },
      data: (c) => ({ focused: false, hovered: false }),
      emits: ["callback-click"],
   };
</script>

<template>
   <button
      class="Button2-root transition"
      @blur="focused = false"
      @click="$emit('callback-click')"
      @focus="focused = true"
      @mouseleave="hovered = false"
      @mouseover="hovered = true"
   >
      <img
         v-if="icon"
         class="Button2-icon transition"
         :src="iconActive ? (focused || hovered ? iconActive : icon) : icon"
      />
      <span v-if="text" class="Button2-text transition">{{ text }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .Button2-root {
      --Button2-color: var(--primary-color);
      --Button2-color-text: var(--Button2-color);

      box-shadow: 0.5px 0.5px 4px hsla(0, 0%, 0%, 0.2);
      border-radius: 6px;
      border: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 0.25em 1em;
      background: white;
      cursor: pointer;

      .Button2-icon {
         width: 18px;
         height: 18px;
      }
      .Button2-text {
         color: var(--Button2-color-text);
         font-weight: 800;
         font-size: 1em;
      }

      &:hover,
      &:focus {
         background: var(--Button2-color);

         .Button2-text {
            color: white;
         }
      }
   }
</style>
