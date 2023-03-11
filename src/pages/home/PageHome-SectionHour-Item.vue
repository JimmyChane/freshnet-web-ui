<script>
   export default {
      props: {
         item: { type: Object },
      },
      computed: {
         isToday: (c) => c.item.isSameDay(new Date()),
         title: (c) => c.item.title,
         content: (c) => c.item.hours.toString(),
      },
   };
</script>

<template>
   <div :class="['HourItem', isToday ? 'HourItem-isToday' : '']">
      <span class="HourItem-title">{{ title }}</span>
      <span class="HourItem-content">{{ content }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .HourItem {
      color: hsla(0, 0%, 0%, 0.8);
      font-weight: 400;

      width: 100%;

      display: flex;
      flex-direction: row;
      gap: 0.5em;
      padding: 0 0.5em;

      .HourItem-title {
         text-align: start;
         width: 6em;
      }
      .HourItem-content {
         flex-grow: 1;
         text-align: end;
      }
   }
   .HourItem-isToday {
      font-weight: 900;
      color: black;
      background-color: rgba(0, 0, 0, 0.03);
      background-color: black;
      color: white;
      padding: 0.3em 0.5em;
      border-radius: 0.5em;
   }
</style>
