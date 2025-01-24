<script>
export default {
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' },
  },
};
</script>

<template>
  <div class="ItemUser-Row">
    <span>{{ title }}</span>
    <span>{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemUser-Row {
  display: flex;
  flex-direction: row;

  :nth-child(1) {
    width: 6rem;
  }
  :nth-child(2) {
    flex-grow: 1;
  }
}
</style>
