<script>
   import WindowTitle from "./WindowTitle.vue";
   import WindowBottom from "./WindowBottom.vue";

   export default {
      components: { WindowTitle, WindowBottom },
      emits: ["click-ok", "click-cancel"],
      props: {
         title: { type: String, default: "" },
         message: { type: String, default: "" },
         value: { type: Object, default: null },
      },
   };
</script>

<template>
   <div class="WindowRemove-root">
      <div class="WindowRemove-main">
         <div class="WindowRemove-header">
            <WindowTitle :title="title" />
         </div>

         <span class="WindowRemove-body">{{ message }}</span>
      </div>

      <WindowBottom
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok', value)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .WindowRemove-root {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 40px;

      .WindowRemove-main {
         width: 100%;
         display: flex;
         flex-direction: column;
         gap: 40px;
         padding: 30px 40px;

         .WindowRemove-header {
            display: flex;
            flex-direction: row;
            justify-content: stretch;
            flex-wrap: wrap;
            column-gap: 80px;
            row-gap: 20px;
            font-weight: 900;
            font-size: 1.4rem;
         }
      }
   }
</style>
