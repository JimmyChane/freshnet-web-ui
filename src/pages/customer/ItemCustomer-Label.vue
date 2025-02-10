<script setup lang="ts">
withDefaults(defineProps<{ title?: string; icon?: string; count?: number }>(), {
  title: '',
  icon: '',
  count: 0,
});
</script>

<template>
  <div class="ItemCustomer-Label">
    <img class="ItemCustomer-Label-icon" v-if="icon" :src="icon" />
    <span class="ItemCustomer-Label-title" v-if="title">{{ title }}</span>

    <span class="ItemCustomer-Label-count" v-if="count">{{ count }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemCustomer-Label {
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

  position: relative;

  .ItemCustomer-Label-icon {
    --size: 1.3em;
    width: var(--size);
    height: var(--size);
  }
  .ItemCustomer-Label-title {
    line-height: 1em;
    min-height: 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ItemCustomer-Label-count {
    font-size: 0.8em;

    --size: 1.7em;
    --size: 18px;
    width: var(--size);
    min-width: var(--size);
    max-width: var(--size);
    height: var(--size);
    min-height: var(--size);
    max-height: var(--size);

    position: absolute;
    --offset: -0.3em;
    top: var(--offset);
    right: var(--offset);

    line-height: 1em;
    border-radius: 50%;
    padding-top: 1px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--primary-color);
    border: 2px solid white;
  }
}
</style>
