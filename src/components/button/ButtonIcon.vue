<script setup lang="ts">
import Icon from '@/components/Icon.vue';

const emits = defineEmits<{
  click: [void];
  mouseover: [MouseEvent];
  mouseleave: [MouseEvent];
}>();

withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    href?: string;
    target?: string;
    to?: any;
  }>(),
  { src: '', alt: '', href: '', target: '' },
);
</script>

<template>
  <a
    class="ButtonIcon transition"
    v-if="href.length"
    :href="href"
    :target="target"
    @click="$emit('click')"
    @mouseover="(x) => $emit('mouseover', x)"
    @mouseleave="(x) => $emit('mouseleave', x)"
  >
    <Icon class="ButtonIcon-icon" :src="src" :alt="alt" />
  </a>

  <router-link
    class="ButtonIcon transition"
    v-else-if="to !== undefined"
    :to="to"
    @click="$emit('click')"
    @mouseover="(x: any) => emits('mouseover', x)"
    @mouseleave="(x: any) => emits('mouseleave', x)"
  >
    <Icon class="ButtonIcon-icon" :src="src" :alt="alt" />
  </router-link>

  <button
    class="ButtonIcon transition"
    v-else
    @click="$emit('click')"
    @mouseover="(x) => $emit('mouseover', x)"
    @mouseleave="(x) => $emit('mouseleave', x)"
  >
    <Icon class="ButtonIcon-icon" :src="src" :alt="alt" />
  </button>
</template>

<style lang="scss" scoped>
.ButtonIcon {
  font-size: 1rem;

  --size: 2.8em;
  width: var(--size);
  height: var(--size);
  min-width: var(--size);
  min-height: var(--size);
  max-width: var(--size);
  max-height: var(--size);
  border-radius: 50%;
  padding: 0.7em;
  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.1);
  }

  .ButtonIcon-icon {
    font-size: calc(var(--size) / 1.1);
  }
}
</style>
