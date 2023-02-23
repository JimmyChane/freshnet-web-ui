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

            requestUrl: "",
            requestBlob: "",
            requestValue: "",

            isImageLoaded: false,
            isImageError: false,
            isImageAbort: false,
         };
      },
      computed: {
         style() {
            return {
               "--transition-duration": `${this.transitionDuration}ms`,
               opacity: this.isShowing ? "1" : "0.2",
               // transform: this.isShowing ? "scale(1)" : "scale(0.98)",
            };
         },

         isSrcString: (c) => typeof c.src === "string",
         isSrcItemImage: (c) => c.src instanceof Image,
         isSrcItemServiceImage: (c) => c.src instanceof ServiceImage,

         isValueEmpty: (c) =>
            c.isSrcItemServiceImage ? c.requestBlob === "" : c.requestValue === "",
      },
      watch: {
         async src() {
            await this.onSrc();
         },
      },
      async mounted() {
         await this.onSrc();
      },
      methods: {
         async onSrc() {
            if (this.isSrcString) {
               this.requestUrl = this.src;
               this.requestBlob = "";
               this.onUrl();
               return;
            }

            if (this.isSrcItemImage) {
               setTimeout(() => {
                  const width = Math.max(this._self.$el.offsetWidth, 0);
                  const height = Math.max(this._self.$el.offsetHeight, 0);
                  this.requestUrl = this.src.toUrl(this.parseDimension(width, height));
                  this.requestBlob = "";
                  this.onUrl();
               }, 100);
               return;
            }
            if (this.isSrcItemServiceImage) {
               setTimeout(async () => {
                  const width = Math.max(this._self.$el.offsetWidth, 0);
                  const height = Math.max(this._self.$el.offsetHeight, 0);
                  this.requestUrl = "";
                  this.requestBlob = await this.src.toBlob(
                     this.parseDimension(width, height),
                  );
                  this.onUrl();
               }, 100);
               return;
            }

            this.requestUrl = "";
            this.requestBlob = "";
         },
         async onUrl() {
            this.isShowing = false;
            this.isError = false;

            if (
               !this.isSrcItemServiceImage &&
               this.requestUrl === this.requestValue &&
               this.isImageLoaded
            ) {
               this.isShowing = true;
               this.invalidateImageCompletion();
               return;
            }
            if (
               this.isSrcItemServiceImage &&
               this.requestBlob === this.requestValue &&
               this.isImageLoaded
            ) {
               this.isShowing = true;
               this.invalidateImageCompletion();
               return;
            }

            // bind if empty, else animate then bind
            if (this.isValueEmpty) return this.loadValue();

            const previousValue = this.isSrcItemServiceImage
               ? this.requestBlob
               : this.requestUrl;
            setTimeout(async () => {
               if (!this.isSrcItemServiceImage && previousValue === this.requestUrl)
                  return this.loadValue();
               if (this.isSrcItemServiceImage && previousValue === this.requestBlob)
                  return this.loadValue();
            }, this.transitionDuration);
         },
         async loadValue() {
            this.requestValue = this.isSrcItemServiceImage
               ? this.requestBlob
               : this.requestUrl;
            this.invalidateImageCompletion();
         },

         parseDimension(width, height) {
            if (width > height) return { width: this.parseSize(width) };
            if (width < height) return { height: this.parseSize(height) };
            return { width: this.parseSize(width), height: this.parseSize(height) };
         },
         parseSize(size) {
            const divide = size / this.distance;
            return this.distance * Math.max(Math.round(divide), 1);
         },

         invalidateImageCompletion() {
            const { img } = this.$refs;
            if (img) this.isError = img.completed;
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
   <div class="ImageView2-empty" v-else-if="isValueEmpty"></div>
   <img
      v-else
      class="ImageView2-img"
      :style="style"
      ref="img"
      :src="requestValue"
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
