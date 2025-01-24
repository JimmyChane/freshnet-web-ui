<script>
export default {
  emits: ['click-dismiss'],
  mounted() {
    const elements = [];
    for (const child of this.$el.children) {
      elements.push(child);
    }

    elements.forEach((element, index) => {
      if (index === 0) return;
      element.addEventListener('click', () => {
        this.$emit('click-dismiss');
      });
    });
  },
};
</script>

<template>
  <div class="DismissableContainer transition">
    <div class="DismissableContainer-body">
      <slot />
    </div>

    <div
      :style="{
        'grid-area': 'top',
        'min-height': 'var(--default-size-top)',
      }"
    />
    <div
      :style="{
        'grid-area': 'left',
        'min-width': 'var(--default-size-left)',
      }"
    />
    <div
      :style="{
        'grid-area': 'right',
        'min-width': 'var(--default-size-right)',
      }"
    />
    <div
      :style="{
        'grid-area': 'bottom',
        'min-height': 'var(--default-size-bottom)',
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.DismissableContainer {
  width: 100dvw;
  height: 100dvh;
  z-index: 1;
  align-items: center;
  --transition-timing: cubic-bezier(1, 0, 0, 1);

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: grid;
  grid-template-areas:
    'top top top'
    'left body right'
    'bottom bottom bottom';
  grid-template-columns: 1fr minmax(100px, max-content) 1fr;
  grid-template-rows: 1fr minmax(100px, max-content) 1fr;

  --default-size-top: 3rem;
  --default-size-right: 3rem;
  --default-size-bottom: 3rem;
  --default-size-left: 3rem;

  & > * {
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .DismissableContainer-body {
    grid-area: body;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>
