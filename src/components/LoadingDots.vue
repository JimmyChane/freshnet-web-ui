<script setup lang="ts">
import { defineProps, onMounted, ref, watch, withDefaults } from 'vue';

import AnimDots from '@/assets/anim/ellipsis.svg';

const props = withDefaults(defineProps<{ isShowing?: boolean }>(), {
  isShowing: false,
});

const show = ref(false);
const animate = ref(false);

const invalidate = () => {
  show.value = true;
  animate.value = false;

  if (props.isShowing) {
    const isShowing = props.isShowing;
    setTimeout(() => {
      if (props.isShowing === isShowing) animate.value = true;
    }, 300);
  } else {
    const isShowing = props.isShowing;
    setTimeout(() => {
      if (props.isShowing === isShowing) show.value = false;
    }, 300);
  }
};

watch(() => props.isShowing, invalidate);
onMounted(invalidate);
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
