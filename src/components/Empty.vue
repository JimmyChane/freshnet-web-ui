<template>
   <div class="Empty">
      <img class="Empty-background" :src="host.res('icon/empty-folder-505050.svg')" />
      <span class="Empty-text">Sorry, nothing here</span>
   </div>
</template>

<style lang="scss" scoped>
   .Empty {
      -webkit-touch-callout: none; // iOS Safari
      -webkit-user-select: none; // Safari
      -khtml-user-select: none; // Konqueror HTML
      -moz-user-select: none; // Old versions of Firefox
      -ms-user-select: none; // Internet Explorer/Edge
      user-select: none; // Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox
      pointer-events: none;

      width: 100%;
      height: 100%;
      text-align: start;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0.2;

      .Empty-background {
         width: 60vw;
         height: 60vh;
         max-width: 16em;
         max-height: 16em;
         padding: 1.5em;
      }
      .Empty-text {
         font-weight: 600;
      }
   }
</style>
