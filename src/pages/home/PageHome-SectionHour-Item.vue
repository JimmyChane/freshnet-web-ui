<script>
   export default {
      props: {
         item: { type: Object },
         isToday: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <div :class="['HourItem', isToday ? 'HourItem-isToday' : '']">
      <span class="HourItem-title">{{ item.title }}</span>
      <span class="HourItem-content">{{ item.content }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .HourItem {
      color: hsla(0, 0%, 0%, 0.8);

      width: 100%;

      display: flex;
      flex-direction: row;
      gap: 0.5em;

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
      font-weight: 500;
      color: black;
   }
</style>
