<script>
   export default {
      props: { isRunning: { type: Boolean, default: false } },
   };
</script>

<template>
   <div :class="['Loading', isRunning ? 'Loading-running' : '']">
      <div class="Loading-body"><div class="Loading-bar"></div></div>
   </div>
</template>

<style lang="scss" scoped>
   .Loading {
      width: 100%;
      height: 10px;
      background-color: hsla(0, 0%, 0%, 0.2);
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: flex-start;
      pointer-events: none;
      opacity: 0;
      transition: 1s;
      overflow: hidden;

      .Loading-body {
         position: relative;
         min-width: 100%;
         min-height: 100%;
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
         overflow: hidden;
      }
   }

   .Loading-running {
      opacity: 1;
      .Loading-body {
         .Loading-bar {
            position: absolute;
            min-width: 0%;
            min-height: 100%;
            background-color: var(--primary-color);
            animation: Loadingv1Animation 1.4s linear infinite;
         }

         @keyframes Loadingv1Animation {
            from {
               transform: translateX(-50%);
            }
            to {
               min-width: 100%;
               transform: translateX(100%);
            }
         }
      }
   }
</style>
