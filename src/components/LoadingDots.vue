<script>
   export default {};
</script>

<template>
   <embed class="LoadingDots transition" :src="host.res('anim/ellipsis.svg')" />
</template>

<style lang="scss" scoped>
   .LoadingDots {
      width: 6rem;
      height: 6rem;
      position: absolute;
      top: 0;
      bottom: 22%;
      left: 0;
      right: 0;
      margin: auto;
      pointer-events: none;
   }
</style>
