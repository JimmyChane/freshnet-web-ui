<script>
   import Image from "@/items/Image";
   import ServiceImage from "@/items/ServiceImage";

   export default {
      props: {
         src: { type: [String, Image, ServiceImage], defualt: "" },
         alt: { type: String, defualt: "" },
      },
      data() {
         return {
            transitionDuration: 300,
            distance: 100,

            isShowing: false,
            isError: false,

            requestOption: null,
            requestUrl: "",

            isImageLoaded: false,
            isImageError: false,
            isImageAbort: false,
         };
      },
      computed: {
         url() {
            if (this.isSrcString()) return this.src;
            if (this.isSrcItem()) return this.src.toUrl(this.requestOption);
            return "";
         },
         style() {
            return {
               "var(--transition-duration)": `${this.transitionDuration}ms`,
               opacity: this.isShowing ? "1" : "0.2",
               // transform: this.isShowing ? "scale(1)" : "scale(0.98)",
            };
         },
      },
      watch: {
         src() {
            this.onSrc();
         },
      },
      mounted() {
         this.onSrc();
      },
      methods: {
         isSrcString() {
            return typeof this.src === "string";
         },
         isSrcItem() {
            return (
               this.src instanceof Image || this.src instanceof ServiceImage
            );
         },

         async onSrc() {
            if (this.isSrcString()) {
               this.requestOption = null;
               this.onUrl();
               return;
            }
            setTimeout(() => {
               const width = Math.max(this._self.$el.offsetWidth, 0);
               const height = Math.max(this._self.$el.offsetHeight, 0);

               if (width > height) {
                  this.requestOption = { width: this.extractValue(width) };
               } else if (width < height) {
                  this.requestOption = { height: this.extractValue(height) };
               } else {
                  this.requestOption = {
                     width: this.extractValue(width),
                     height: this.extractValue(height),
                  };
               }
               this.onUrl();
            }, 100);
         },
         async onUrl() {
            this.isShowing = false;
            this.isError = false;

            if (this.url === this.requestUrl && this.isImageLoaded) {
               this.isShowing = true;
               this.invalidateImageCompletion();
               return;
            }

            // bind if empty, else animate then bind
            if (this.requestUrl === "") {
               this.requestUrl = this.url;
            } else {
               const url = this.url;
               setTimeout(() => {
                  if (url !== this.url) return;
                  this.requestUrl = "";
                  this.requestUrl = this.url;
               }, this.transitionDuration);
            }
         },

         extractValue(size) {
            const divide = size / this.distance;
            return this.distance * Math.max(Math.round(divide), 1);
         },

         invalidateImageCompletion() {
            const { img } = this.$refs;
            if (img) {
               this.isError = img.completed;
            }
         },

         onLoad(event) {
            this.isImageLoaded = true;
            this.isImageError = false;
            this.isImageAbort = false;

            this.isShowing = true;
            this.invalidateImageCompletion();
            this.$emit("load", event);
         },
         onError(event) {
            this.isImageLoaded = false;
            this.isImageError = true;
            this.isImageAbort = false;

            this.isError = true;
            this.$emit("error", event);
         },
         onAbort(event) {
            this.isImageLoaded = false;
            this.isImageError = false;
            this.isImageAbort = true;

            this.isError = true;
            this.$emit("abort", event);
         },
      },
   };
</script>

<template>
   <span v-if="isError" class="ImageView2-error">Error</span>
   <div class="ImageView2-empty" v-else-if="requestUrl === ''"></div>
   <img
      v-else
      class="ImageView2-img"
      :style="style"
      ref="img"
      :src="requestUrl"
      :alt="alt"
      loading="lazy"
      @load="(event) => onLoad(event)"
      @error="(event) => onError(event)"
      @abort="(event) => onAbort(event)"
      @click="(event) => $emit('click', event)"
   />
</template>

<style lang="scss" scoped>
   .ImageView2-error {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      font-size: 0.8em;
      background-color: hsla(0, 0%, 0%, 0.1);
      color: hsla(0, 0%, 0%, 0.6);
   }
   .ImageView2-empty {
      background-color: hsla(0, 0%, 0%, 0.1);
   }
   .ImageView2-img {
      display: flex;
      transition: all var(--transition-duration);
   }
</style>
