<script lang="ts">
  import Vue from "vue";
  import FloatingButton from "./BottomActionbar-FloatingButton.vue";

  export default Vue.extend({
    props: { isHidden: { type: Boolean, default: false } },
    components: { FloatingButton },
  });
</script>

<template>
  <FloatingButton
    :class="['transition', 'ButtonTop']"
    :isHidden="`${isHidden}`"
    @click="() => $emit('click')"
  >
    <img class="ButtonTop-icon" src="@/assets/icon/arrow-left-000000.svg" />
  </FloatingButton>
</template>

<style lang="scss" scoped>
  .ButtonTop {
    height: 4rem;
    width: 4rem;
    transition-timing-function: cubic-bezier(1, 0, 0, 1);

    .ButtonTop-icon {
      --size: 1.2rem;
      width: var(--size);
      height: var(--size);
      transform: rotate(90deg);
    }

    &:hover,
    &:focus {
      background: hsl(0, 0%, 90%);
    }
  }

  .ButtonTop[isHidden="true"] {
    transform: scale(0);
    pointer-events: none;
    opacity: 0;
  }
</style>
