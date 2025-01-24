<script>
export default {
  props: {
    value: { type: Object },
  },
  computed: {
    title: (c) => c.value.title,
    content: (c) => c.value.hours.toString(),
  },
};
</script>

<template>
  <div class="ItemSettingBusinessHours-Item">
    <span>{{ title }}</span>
    <span>{{ content }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemSettingBusinessHours-Item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  :nth-child(1) {
    text-align: start;
  }
  :nth-child(2) {
    text-align: end;
  }
}
</style>
