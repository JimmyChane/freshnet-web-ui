<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
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
        style: { color: "", textColor: "" },
      };
    },
    computed: {
      cIcon(): string {
        if (this.iconActive) {
          if (this.focused || this.hovered) {
            return this.iconActive;
          }
        }

        return this.icon;
      },
      primaryColor(): string {
        return this.color;
      },
      cTextColor(): string {
        return this.textColor !== "" ? this.textColor : this.primaryColor;
      },
    },
  });
</script>

<template>
  <button
    class="ItemOrder-Action transition"
    :style="{ '--primary-color': primaryColor, color: cTextColor }"
    @blur="focused = false"
    @click="$emit('button-click')"
    @focus="focused = true"
    @mouseleave="hovered = false"
    @mouseover="hovered = true"
  >
    <img v-if="icon" class="ItemOrder-Action-icon" :src="cIcon" />
    <span v-if="text" class="ItemOrder-Action-text">{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
  .ItemOrder-Action {
    --primary-color: var(--primary-color);

    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
    border: 1px var(--primary-color) solid;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: 0.75rem;

    .ItemOrder-Action-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
    .ItemOrder-Action-text {
      color: inherit;
      font-size: 0.8rem;
    }

    &:hover,
    &:focus {
      background: var(--primary-color);

      .ItemOrder-Action-text {
        color: white;
      }
    }
  }
</style>
