<script>
import AnimDots from '@/assets/anim/ellipsis.svg';

export default {
  props: { isShowing: { type: Boolean, default: false } },
  data: (c) => ({ AnimDots, show: false, animate: false }),
  watch: {
    isShowing() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    invalidate() {
      this.show = true;
      this.animate = false;

      if (this.isShowing) {
        const isShowing = this.isShowing;

        setTimeout(() => {
          if (this.isShowing === isShowing) this.animate = true;
        }, 300);
      } else {
        const isShowing = this.isShowing;

        setTimeout(() => {
          if (this.isShowing === isShowing) this.show = false;
        }, 300);
      }
    },
  },
};
</script>

<template>
  <embed
    v-if="show"
    :class="[
      'LoadingDots',
      'transition',
      animate ? 'LoadingDots-isShowing' : 'LoadingDots-isHiding',
    ]"
    :src="AnimDots"
  />
</template>

<style lang="scss" scoped>
.LoadingDots {
  width: 6rem;
  height: 6rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  pointer-events: none;
}
.LoadingDots-isShowing {
  opacity: 1;
}
.LoadingDots-isHiding {
  opacity: 0;
}
</style>
