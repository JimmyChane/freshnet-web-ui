<script setup lang="ts">
import chroma from 'chroma-js';
import { computed } from 'vue';

import { isColorDark } from '@/U';

import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    srcLight?: string;
    srcDark?: string;
    primaryColor?: any;
    alt?: string;
  }>(),
  { srcLight: '', srcDark: '', primaryColor: () => chroma('ffffff'), alt: '' },
);

const isDark = computed(() => isColorDark(props.primaryColor, 60));
</script>

<template>
  <Icon :src="isDark ? srcLight : srcDark" :alt="alt" />
</template>
