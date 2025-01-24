<script>
export default {
  props: {
    item: { type: Object },
  },
  computed: {
    isToday: (c) => c.item.isToday(),
    title: (c) => c.item.title,
    content: (c) => c.item.hours.toString(),
  },
};
</script>

<template>
  <div class="HourItem" :isToday="`${isToday}`">
    <span class="HourItem-title">{{ title }}</span>
    <span class="HourItem-content">{{ content }}</span>
  </div>
</template>

<style lang="scss" scoped>
.HourItem {
  color: white;
  font-weight: 400;

  width: 100%;

  display: flex;
  flex-direction: row;
  gap: 0.5em;
  line-height: 1em;

  .HourItem-title {
    text-align: start;
    width: 6em;
  }
  .HourItem-content {
    flex-grow: 1;
    text-align: end;
  }
}
.HourItem[isToday='true'] {
  background: white;
  color: var(--primary-color);
  padding: 0.5em 0.5em;
  border-radius: 0.5em;
}
</style>
