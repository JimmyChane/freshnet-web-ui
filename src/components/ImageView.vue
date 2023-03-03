<script>
   import Image from "@/items/Image";
   import ServiceImage from "@/items/ServiceImage";

   export default {
      props: {
         src: { type: [String, Image, ServiceImage], defualt: "" },
         alt: { type: String, defualt: "" },
         resize: { type: Boolean, default: true },
         loading: { type: String, default: "lazy" },
      },
      data() {
         return {
            transitionDuration: 300,
            distance: 100,

            isShowing: false,
            isError: false,
            isLoaded: false,
            isAbort: false,

            requestUrl: "",
            requestBlob: "",
            requestValue: "",
         };
      },
      computed: {
         style: (c) => {
            return {
               "--transition-duration": `${c.transitionDuration}ms`,
               opacity: c.isShowing ? "1" : "0.2",
               // transform: c.isShowing ? "scale(1)" : "scale(0.98)",
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
            await this.invalidateSrc();
         },
      },
      async mounted() {
         await this.invalidateSrc();
      },
      methods: {
         async loadString() {
            this.requestUrl = this.src;
            this.requestBlob = "";
         },
         async loadUrl() {
            const option = await this.getDimension();
            this.requestUrl = this.src.toUrl(option);
            this.requestBlob = "";
         },
         async loadBlob() {
            const option = await this.getDimension();
            this.requestUrl = "";
            this.requestBlob = await this.src.toBlob(option);
         },

         async invalidateSrc() {
            this.isShowing = false;
            this.isError = false;

            if (
               !this.isSrcString &&
               !this.isSrcItemImage &&
               !this.isSrcItemServiceImage
            ) {
               this.requestUrl = "";
               this.requestBlob = "";
               return;
            }

            if (this.isSrcString) await this.loadString();
            if (this.isSrcItemImage) await this.loadUrl();
            if (this.isSrcItemServiceImage) await this.loadBlob();

            if (
               !this.isSrcItemServiceImage &&
               this.requestUrl === this.requestValue &&
               this.isLoaded
            ) {
               this.isShowing = true;
               this.invalidateImageCompletion();
               return;
            }
            if (
               this.isSrcItemServiceImage &&
               this.requestBlob === this.requestValue &&
               this.isLoaded
            ) {
               this.isShowing = true;
               this.invalidateImageCompletion();
               return;
            }

            this.invalidateValue();
         },

         async invalidateValue() {
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

         async getDimension() {
            if (!this.resize) return undefined;

            return new Promise((resolve, reject) => {
               setTimeout(() => {
                  const width = Math.max(this._self.$el.offsetWidth, 0);
                  const height = Math.max(this._self.$el.offsetHeight, 0);
                  resolve(this.parseDimension(width, height));
               }, 100);
            });
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
            if (this.isSrcItemServiceImage) {
               this.isError = false;
               return;
            }

            const { img } = this.$refs;
            if (img) this.isError = !img.complete;
         },

         invalidateLoad(event) {
            this.isLoaded = true;
            this.isError = false;
            this.isAbort = false;

            this.isShowing = true;
            this.invalidateImageCompletion();
            this.$emit("load", event);
         },
         invalidateError(event) {
            this.isLoaded = false;
            this.isError = true;
            this.isAbort = false;

            this.$emit("error", event);
         },
         invalidateAbort(event) {
            this.isLoaded = false;
            this.isError = false;
            this.isAbort = true;

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
      ref="img"
      :style="style"
      :src="requestValue"
      :alt="alt"
      :loading="loading"
      @load="(event) => invalidateLoad(event)"
      @error="(event) => invalidateError(event)"
      @abort="(event) => invalidateAbort(event)"
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
