<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import type { Category } from '@/items/Category';
import { useCategoryStore } from '@/stores/category.store';

import Label from './ItemCustomer-Label.vue';

const props = withDefaults(
  defineProps<{ categoryKey?: string; count?: number }>(),
  { categoryKey: '', count: 0 },
);

const category = ref<Category | null>(null);
const icon = computed(() => category.value?.icon?.toUrl() ?? '');

watch([() => props.categoryKey], () => invalidate());

async function invalidate() {
  category.value = null;
  category.value =
    (await useCategoryStore().getItemOfKey(props.categoryKey)) ?? null;
}

onMounted(() => invalidate());
</script>

<template>
  <Label :icon="icon" :count="count"></Label>
</template>
