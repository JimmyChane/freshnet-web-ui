<script>
import FloatingButton from './BottomActionbar-FloatingButton.vue';

export default {
  components: { FloatingButton },
  props: {
    target: { type: String, default: '' },
    href: { type: String, default: '' },
    icon: { type: String, default: '' },
    titleHeader: { type: String, default: '' },
    titleContent: { type: String, default: '' },
    primaryColorHex: { type: String, default: '#000000' },

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
      <span>{{ titleHeader }}</span>
      <span>{{ titleContent }}</span>
    </div>
  </FloatingButton>
</template>

<style lang="scss" scoped>
.ButtonContact {
  --height: 4rem;
  --icon-size: 1.5rem;

  height: var(--height);
  color: var(--primary-color);
  transition-timing-function: cubic-bezier(1, 0, 0, 1);

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
    :nth-child(1) {
      grid-area: title;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }
    :nth-child(2) {
      grid-area: content;
      font-size: 0.8rem;
    }
  }

  &:hover,
  &:focus {
    background: hsl(0, 0%, 90%);
  }
}

.ButtonContact[toShrink='false'] {
  gap: 0.5rem;
}
.ButtonContact[toShrink='true'] {
  width: var(--height);
  .ButtonContact-body {
    opacity: 0;
    pointer-events: none;
    width: 0;
  }
}
</style>
