<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      primaryColor: { default: "black" },
      title: { type: String, default: "" },
      icon: { type: String, default: "" },
      isSelected: { type: Boolean, default: false },
    },
  });
</script>

<template>
  <button
    class="Selector4-Item transition"
    :class="[`Selector4-Item-${isSelected ? 'isSelected' : 'isDeselected'}`]"
    :style="{ '--primary-color': primaryColor }"
    @click="$emit('click')"
  >
    <img class="Selector4-Item-icon" v-if="icon" :src="icon" />
    <span class="Selector4-Item-title" v-if="title">{{ title }}</span>
  </button>
</template>

<style lang="scss" scoped>
  .Selector4-Item {
    width: 100%;
    height: 100%;
    padding: 1rem;
    gap: 0.5rem;

    border: 1px solid var(--primary-color);
    border-radius: 0.4rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .Selector4-Item-icon {
      height: 1rem;
    }
    .Selector4-Item-title {
      flex-grow: 1;
      text-align: start;
    }
  }
  .Selector4-Item-isSelected {
    background: var(--primary-color);
    color: white;
  }
  .Selector4-Item-isDeselected {
    background: white;
    color: var(--primary-color);
    cursor: pointer;
    &:hover,
    &:focus {
      background: var(--primary-color);
      color: white;
    }
  }
</style>
