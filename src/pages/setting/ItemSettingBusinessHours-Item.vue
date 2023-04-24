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
      <span class="ItemSettingBusinessHours-Item-day">{{ title }}</span>
      <span class="ItemSettingBusinessHours-Item-hours">{{ content }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .ItemSettingBusinessHours-Item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .ItemSettingBusinessHours-Item-day {
         text-align: start;
      }
      .ItemSettingBusinessHours-Item-hours {
         text-align: end;
      }
   }
</style>
