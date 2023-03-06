<template>
   <div class="ItemSetting-Card"> <slot /> </div>
</template>

<style lang="scss" scoped>
   .ItemSetting-Card {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      gap: 0.2rem;
      border-radius: 1rem;
   }
</style>
