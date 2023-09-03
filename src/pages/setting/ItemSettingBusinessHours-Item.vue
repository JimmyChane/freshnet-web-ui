<script lang="ts">
  import WorkingDay from "@/items/WorkingDay";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      value: { type: WorkingDay },
    },
    computed: {
      title(): string {
        return this.value.title;
      },
      content(): string {
        return this.value.hours.toString();
      },
    },
  });
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
