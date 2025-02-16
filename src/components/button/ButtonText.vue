<script setup lang="ts">
const emits = defineEmits<{ click: [void] }>();

withDefaults(
  defineProps<{ text?: string; href?: string; target?: string; to?: any }>(),
  { text: '', href: '', target: '' },
);
</script>

<template>
  <a
    class="ButtonText transition"
    v-if="href.length"
    :href="href"
    :target="target"
    @click="emits('click')"
  >
    <span>{{ text }}</span>
  </a>

  <router-link
    class="ButtonText transition"
    v-else-if="to !== undefined"
    :to="to"
    @click="$emit('click')"
  >
    <span>{{ text }}</span>
  </router-link>

  <button class="ButtonText transition" v-else @click="$emit('click')">
    <span>{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
.ButtonText {
  font-size: 1rem;

  min-width: 2.5em;
  min-width: max-content;
  min-height: 2.5em;
  width: 2.5em;
  width: max-content;
  height: 2.5em;
  border-radius: 0.4rem;
  padding: 0.6em;
  background: none;
  border: none;
  cursor: pointer;
  color: black;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;
  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
