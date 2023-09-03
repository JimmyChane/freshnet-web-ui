<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      text: { type: String, default: "" },
      isRequired: { type: Boolean, default: false },
    },
  });
</script>

<template>
  <div class="TextString">
    <span class="TextString-text">{{ text }}</span>
    <span class="TextString-isRequired" v-if="isRequired">Required</span>
  </div>
</template>

<style lang="scss" scoped>
  .TextString {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: center;

    .TextString-text {
      font-size: inherit;
      font-weight: inherit;
    }
    .TextString-isRequired {
      color: hsl(0, 50%, 50%);
      font-weight: 400;
      font-size: 0.7em;
    }
  }
</style>
