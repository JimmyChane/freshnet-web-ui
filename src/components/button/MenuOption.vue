<script setup lang="ts">
import chroma from 'chroma-js';
import { computed } from 'vue';

import { isColorDark } from '@/U';
import IconOptionDark from '@/assets/icon/option-000000.svg';
import IconOptionLight from '@/assets/icon/option-FFFFFF.svg';

import MenuIcon from '@/components/MenuIcon.vue';

const props = defineProps({
  menus: { default: undefined },
  primaryColor: { default: () => chroma('ffffff') },
});

const isDark = computed(() => isColorDark(props.primaryColor, 60));
</script>

<template>
  <MenuIcon
    :menus="menus"
    :src="isDark ? IconOptionLight : IconOptionDark"
    @show="() => $emit('show')"
    @hide="() => $emit('hide')"
  />
</template>
