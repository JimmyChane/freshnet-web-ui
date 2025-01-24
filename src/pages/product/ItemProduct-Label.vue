<script>
import chroma from 'chroma-js';

import { isColorDark } from '@/U';

export default {
  props: {
    title: { type: String, default: '' },
    primaryColor: { type: chroma.Color, default: () => chroma('#ffffff') },
  },
  computed: { isPrimaryColorDark: (c) => isColorDark(c.primaryColor) },
};
</script>

<template>
  <span
    class="ItemProduct-Label"
    :style="{
      '--primary-color': primaryColor.toString(),
      color: isPrimaryColorDark ? 'white' : 'black',
    }"
    :key="title"
  >
    {{ title }}
  </span>
</template>

<style lang="scss" scoped>
.ItemProduct-Label {
  min-width: max-content;
  width: max-content;
  padding: 0.45em 0.7em;
  background: var(--primary-color);
  border-radius: 1em;
  font-size: 0.6rem;
  font-weight: 400;
  line-height: 1em;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
