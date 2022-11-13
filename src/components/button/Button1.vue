<script>
   export default {
      emits: ["button-click"],
      props: {
         color: { type: String, default: "var(--primary-color)" },
         text: { type: String, default: "Click Me" },
         textColor: { type: String, default: "" },
         icon: { type: String },
         iconActive: { type: String },
      },
      data() {
         return {
            focused: false,
            hovered: false,
            style: { color: "", text: "", textColor: "", icon: "", iconActive: "" },
         };
      },
      mounted() {
         this.style.color = this.color;
         this.style.text = this.text;
         this.style.textColor = this.textColor !== "" ? this.textColor : this.color;
         this.style.icon = this.icon;
         this.style.iconActive = this.iconActive;
      },
   };
</script>

<template>
   <button
      class="Button1-root"
      :style="{
         '--propColor': style.color,
         '--propTextColor': style.textColor,
      }"
      @blur="focused = false"
      @click="$emit('button-click')"
      @focus="focused = true"
      @mouseleave="hovered = false"
      @mouseover="hovered = true"
   >
      <img
         v-if="icon"
         class="Button1-icon"
         :src="
            style.iconActive
               ? focused || hovered
                  ? style.iconActive
                  : style.icon
               : style.icon
         "
      />
      <span v-if="style.text" class="Button1-text">{{ style.text }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .Button1-root {
      --propColor: var(--primary-color);
      --propTextColor: var(--primary-color);

      padding: 4px 16px;
      border-radius: 6px;
      border: 2px var(--propColor) solid;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      transition: var(--animation-duration);
      cursor: pointer;
      gap: 12px;

      .Button1-icon {
         width: 18px;
         height: 18px;
      }

      .Button1-text {
         color: var(--propTextColor);
         font-weight: 800;
         font-size: 0.8rem;
      }

      &:hover,
      &:focus {
         background: var(--propColor);

         .Button1-text {
            color: white;
         }
      }
   }
</style>
