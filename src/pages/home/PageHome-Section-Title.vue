<template>
  <h4 class="PageHomeSection-title">
    <slot />
  </h4>
</template>

<style lang="scss" scoped>
  .PageHomeSection-title {
    font-size: 2rem;
    font-weight: 500;

    color: black;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
