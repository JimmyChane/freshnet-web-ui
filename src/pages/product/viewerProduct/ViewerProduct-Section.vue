<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import chroma from "chroma-js";

   export default {
      components: { ButtonIcon },
      props: {
         title: { type: String, default: "" },
         menu: { type: Object, default: () => null },
         primaryColor: { type: chroma, default: () => null },
      },
      computed: {
         titleColor: (c) => {
            return c.primaryColor?.mix("000000", 0.9).toString() ?? "#4E504D";
         },
      },
   };
</script>

<template>
   <div class="ProductViewerSection">
      <div class="ProductViewerSection-header" v-if="title || menu">
         <span class="ProductViewerSection-title" v-if="title">{{
            title
         }}</span>
         <ButtonIcon v-if="menu" :src="menu.icon" @click="() => menu.click()" />
      </div>
      <div class="ProductViewerSection-body">
         <slot />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ProductViewerSection {
      width: 100%;
      gap: 2px;
      border-radius: 1rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow: hidden;

      .ProductViewerSection-header {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: space-between;

         background: hsla(0, 0%, 100%, 0.6);

         gap: 0.5rem;
         padding-right: 0.6rem;

         .ProductViewerSection-title {
            font-weight: 600;
            font-size: 1rem;
            padding: 1.2rem;
            padding-right: 1.2rem;
            color: black;
         }
      }
      .ProductViewerSection-body {
         display: flex;
         flex-direction: column;
      }
   }
</style>
