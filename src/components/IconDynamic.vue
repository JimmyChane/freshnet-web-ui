<script>
import chroma from 'chroma-js';

import { isColorDark } from '@/U';

import Icon from './Icon.vue';

export default {
  components: { Icon },
  props: {
    srcLight: { type: String, default: '' },
    srcDark: { type: String, default: '' },
    primaryColor: { default: () => chroma('ffffff') },
    alt: { type: String, default: '' },
  },
  computed: { isDark: (c) => isColorDark(c.primaryColor, 60) },
};
</script>

<template>
  <Icon :src="isDark ? srcLight : srcDark" :alt="alt" />
</template>
