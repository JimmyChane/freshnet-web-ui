<script setup lang="ts">
  import IconArrowDown from "@/icon/IconArrowDown.vue";

  defineProps({
    isExpand: { type: Boolean },
  });
</script>

<template>
  <div class="Navigationleft-Clickable-Body" :isExpand="`${isExpand}`">
    <button
      class="Navigationleft-Clickable-Body-button transition"
      @click="$emit('click')"
    >
      <IconArrowDown class="Navigationleft-Clickable-Body-button-icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .Navigationleft-Clickable-Body {
    flex-grow: 0;
    position: absolute;
    right: 0.5rem;
    font-size: 0.6rem;
    pointer-events: none;

    .Navigationleft-Clickable-Body-button {
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
      font-size: 1rem;

      --size: 2.4em;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      border-radius: 50%;
      padding: 0.7em;
      background: none;
      border: none;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &:focus {
        background: rgba(0, 0, 0, 0.1);
      }

      .Navigationleft-Clickable-Body-button-icon {
        font-size: calc(var(--size) / 1.1);
      }
    }
  }

  .Navigationleft-Clickable-Body[isExpand="true"] {
    .Navigationleft-Clickable-Body-button {
      transform: rotate(0deg);
    }
  }
  .Navigationleft-Clickable-Body[isExpand="false"] {
    .Navigationleft-Clickable-Body-button {
      transform: rotate(-90deg);
    }
  }
</style>
