<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

withDefaults(defineProps<{ title?: string; icon?: string; count?: number }>(), {
  title: '',
  icon: '',
  count: 0,
});
</script>

<template>
  <div class="LabelCount">
    <img class="LabelCount-icon" v-if="icon" :src="icon" />
    <span class="LabelCount-title" v-if="title">{{ title }}</span>
    <div class="LabelCount-line" v-if="(icon || title) && count"></div>
    <span class="LabelCount-count" v-if="count">{{ count }}</span>
  </div>
</template>

<style lang="scss" scoped>
.LabelCount {
  width: max-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  padding: 0.15em 0.3em;
  border-radius: 0.15em;
  line-height: 1;
  background: var(--primary-color);

  .LabelCount-icon {
    width: 1em;
    height: 1em;
  }
  .LabelCount-title {
    line-height: 1em;
    min-height: 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .LabelCount-count {
    line-height: 1em;
    min-height: 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .LabelCount-line {
    margin: 0 0.45em;
    min-width: 1px;
    min-height: 0.8em;
    background: hsla(0, 0%, 100%, 0.3);
  }
}
</style>
