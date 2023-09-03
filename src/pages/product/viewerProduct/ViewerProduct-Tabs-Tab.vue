<script lang="ts">
  import Vue from "vue";
  import Tab from "./TabOption";

  export default Vue.extend({
    props: {
      item: { type: Object as () => Tab },
    },
    computed: {
      title(): string {
        return this.item.title;
      },
      isSelected(): boolean {
        return this.item.isSelected(this.item);
      },
    },
  });
</script>

<template>
  <button
    :class="[
      'Tabs-Tab',
      isSelected ? 'Tabs-Tab-isSelected' : 'Tabs-Tab-isDeselected',
      'transition',
    ]"
    @click="$emit('click', item)"
    >{{ title }}</button
  >
</template>

<style lang="scss" scoped>
  .Tabs-Tab {
    min-width: max-content;
    border: none;
    background: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.5rem 0.7rem;
  }
  .Tabs-Tab-isDeselected {
    transform: scale(0.8);
    color: hsla(0, 0%, 0%, 0.5);
    cursor: pointer;
  }
  .Tabs-Tab-isSelected {
    color: black;
  }
</style>
