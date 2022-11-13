<script>
   export default {
      props: {
         src: { type: String, defualt: "" },
         alt: { type: String, defualt: "" },
      },
      data() {
         return { hasError: false };
      },
      methods: {
         onLoad() {
            const { ImageViewImg } = this.$refs;
            if (ImageViewImg) {
               this.hasError = ImageViewImg.completed;
            }
         },
      },
   };
</script>

<template>
   <div class="ImageView">
      <div class="ImageView-body">
         <div class="ImageView-error" v-if="hasError">
            <span class="ImageView-error-text">Image Error</span>
         </div>
         <img
            class="ImageView-img"
            ref="ImageViewImg"
            v-if="src || !hasError"
            :src="src"
            :alt="alt"
            @load="onLoad"
            @error="hasError = true"
            @abort="hasError = true"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ImageView {
      width: 100%;
      height: 100%;
      min-width: max-content;
      min-height: max-content;
      max-width: max-content;
      max-height: max-content;
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      object-fit: inherit;
      transition: var(--animation-duration);
      border-radius: inherit;
      .ImageView-body {
         position: relative;
         width: 100%;
         height: 100%;
         min-width: 100%;
         min-height: max-content;
         max-width: max-content;
         max-height: max-content;
         display: flex;
         align-items: center;
         justify-content: center;
         object-fit: inherit;
         transition: var(--animation-duration);
         overflow: hidden;
         border-radius: inherit;
         .ImageView-error {
            background: hsl(0, 0%, 60%);
            color: hsl(0, 0%, 75%);

            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: stretch;
            .ImageView-error-text {
               font-size: 0.8em;
               width: 100%;
               height: 100%;
               min-width: 100%;
               min-height: 100%;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
            }
         }
         .ImageView-img {
            width: 100%;
            height: 100%;
            min-width: 100%;
            min-height: 100%;
            object-fit: inherit;
            display: flex;
            align-items: stretch;
            justify-content: stretch;
            border-radius: inherit;
            transition: var(--animation-duration);
         }
      }
   }
</style>
