<script>
  import Vue from "vue";
  export default Vue.extend({
    props: {
      label: { type: Object },
    },
    computed: {
      hexColor() {
        return this.label.hexColor;
      },
      title() {
        return this.label.title;
      },
    },
  });
</script>

<template>
  <button
    class="Label"
    :style="{ '--primary-color': `#${hexColor}` }"
    @click="$emit('click')"
  >
    <span class="transition">{{ title }}</span>
    <img class="transition" :src="host.icon('close-FFFFFF')" />
  </button>
</template>

<style lang="scss" scoped>
  .Label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    background: var(--primary-color);
    color: white;
    font-size: 0.8em;
    padding: 0.2em 0.4em;
    border-radius: 0.2em;
    cursor: pointer;
    padding-left: 0.5em;
    border: none;

    :nth-child(2) {
      width: 0.8em;
      height: 0.8em;
      opacity: 0;
    }
    &:hover {
      :nth-child(1) {
        opacity: 0.5;
      }
      :nth-child(2) {
        opacity: 1;
      }
    }
  }
</style>
