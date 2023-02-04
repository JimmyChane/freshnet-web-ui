<script>
   export default {
      props: {
         menus: { type: Array, default: () => [] },
      },
   };
</script>

<template>
   <button
      @click="(e) => $root.popupMenuShow(e.target, menus)"
      @blur="() => $root.popupMenuHide()"
   >
      <slot />
   </button>
</template>
