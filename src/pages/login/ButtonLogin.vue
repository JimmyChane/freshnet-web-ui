<template>
   <button class="ButtonLogin transition">Login</button>
</template>

<style lang="scss" scoped>
   .ButtonLogin {
      border-radius: 6px;
      border: 1px solid hsl(0, 0%, 90%);
      padding: 1em 1.5em;
      background: white;
      cursor: pointer;

      color: black;
      font-weight: 600;
      font-size: 0.8em;

      max-width: 200px;
      margin-top: 20px;

      &:hover,
      &:focus {
         background: black;
         color: white;
      }
   }
</style>
