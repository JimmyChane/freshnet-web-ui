<script>
import { useAppStore } from '@/stores/app.store';

export default {
  props: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  data: () => ({ parentWidth: 0, parentHeight: 0 }),
  computed: {
    scaleWidth: (c) => c.parentWidth / c.width,
    scaleHeight: (c) => c.parentHeight / c.height,
    scale: (c) => (c.scaleWidth > c.scaleHeight ? c.scaleHeight : c.scaleWidth),
  },
  methods: {
    invalidateCard(repeatTimeout = 300) {
      const { parent } = this.$refs;
      if (!parent) return;

      this.parentWidth = parent.offsetWidth;
      this.parentHeight = parent.offsetHeight;

      if (repeatTimeout) {
        setTimeout(() => this.invalidateCard(0), repeatTimeout);
      }
    },
    print() {
      const element = this.$refs.canvas;
      if (element) useAppStore().print(element);
    },
    listenerResize() {
      this.invalidateCard();
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.listenerResize);
  },
  mounted() {
    this.invalidateCard();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.listenerResize);
  },
};
</script>

<template>
  <div class="PrintContent" ref="parent">
    <div
      class="PrintContent-canvas"
      ref="canvas"
      :style="{
        '--width': `${width}px`,
        '--height': `${height}px`,
        '--scale': `${scale}`,
      }"
    >
      <slot :scale="scale" :width="width" :height="height" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PrintContent {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .PrintContent-canvas {
    width: var(--width);
    height: var(--height);
    min-width: var(--width);
    min-height: var(--height);
    max-width: var(--width);
    max-height: var(--height);

    background: white;
    box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
    transform: scale(var(--scale));
    position: absolute;
    top: calc(0 - var(--height) * var(--scale));
    left: calc(0 - var(--width) * var(--scale));
    overflow: hidden;
  }
}
</style>
