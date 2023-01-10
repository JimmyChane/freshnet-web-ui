<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: { ButtonIcon },
      props: {
         title: { type: String, default: "" },
         menu: { type: Object, default: () => null },
         primaryColor: { type: chroma, default: () => null },
      },
      computed: {
         titleColor() {
            if (!this.primaryColor) return "#4E504D";
            return this.primaryColor.mix("000000", 0.9).toString();
         },
      },
   };
</script>

<template>
   <div class="ProductViewerSection">
      <div class="ProductViewerSection-header" v-if="title || menu">
         <span class="ProductViewerSection-title" v-if="title">{{ title }}</span>
         <ButtonIcon v-if="menu" :src="menu.icon" @click="() => menu.click()" />
      </div>
      <slot />
   </div>
</template>

<style lang="scss" scoped>
   .ProductViewerSection {
      width: 100%;
      gap: 1px;

      display: flex;
      flex-direction: column;

      border-radius: 1rem;
      overflow: hidden;

      .ProductViewerSection-header {
         width: 100%;

         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: space-between;

         gap: 0.5rem;
         padding: 0 1.2rem;
			padding-right: 0.5rem;
         background: hsla(0, 0%, 100%, 0.6);

         .ProductViewerSection-title {
            font-weight: 600;
            font-size: 1.2rem;
            padding: 1.2rem 0;
				padding-right: 1.2rem;
            color: black;
         }
      }
   }
</style>
