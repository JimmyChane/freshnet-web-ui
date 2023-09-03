<script lang="ts">
  import Image from "@/items/Image";
  import ServiceImage from "@/items/ServiceImage";
  import U from "@/U";
  import Vue from "vue";

  interface Dimension {
    width?: number;
    height?: number;
  }
  class Container {
    image: String | Image | ServiceImage;
    constructor(image: String | Image | ServiceImage) {
      this.image = image;
    }

    isString(): boolean {
      return U.isString(this.image);
    }
    isImage(): boolean {
      return this.image instanceof Image;
    }
    isServiceImage(): boolean {
      return this.image instanceof ServiceImage;
    }

    getKey(): string {
      if (this.image instanceof Image || this.image instanceof ServiceImage) {
        return this.image.toUrl();
      }
      if (typeof this.image === "string") {
        return this.image;
      }

      return "";
    }

    async toValue(option?: {
      width?: number;
      height?: number;
    }): Promise<string> {
      if (typeof this.image === "string") return this.image;
      if (this.image instanceof Image) return this.image.toUrl(option);
      if (this.image instanceof ServiceImage)
        return await this.image.toBlob(option);

      return "";
    }
  }

  export default Vue.extend({
    props: {
      src: {
        validator(value) {
          return (
            typeof value === "string" ||
            value instanceof Image ||
            value instanceof ServiceImage
          );
        },
        default: "",
      },
      alt: { type: String, default: "" },
      resize: { type: Boolean, default: true },
      loading: { type: String, default: "lazy" },
    },
    data() {
      return {
        approximateSize: 100,

        state: "",
        requestValue: "",
      };
    },
    computed: {
      style(): Record<string, string> {
        return { opacity: this.state === "loaded" ? "1" : "0.2" };
      },
      isValueEmpty(): boolean {
        return this.requestValue === "";
      },
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
      async invalidateSrc(): Promise<undefined> {
        this.state = "";

        const previousValue = this.requestValue;

        const option = await this.getDimension();
        const container = new Container(this.src);
        const value = await container.toValue(option);

        if (previousValue !== this.requestValue) return;

        this.requestValue = value;
        const img = this.$refs.img as HTMLImageElement;
        if (img && img.complete) {
          this.state = "loaded";
        }
      },

      onLoad(event: Event): void {
        this.state = "loaded";
        this.$emit("load", event);
      },
      onError(event: Event): void {
        this.state = "error";
        this.$emit("error", event);
      },
      onAbort(event: Event) {
        this.state = "aborted";
        this.$emit("abort", event);
      },
      onClick(event: Event) {
        this.$emit("click", event);
      },

      async getDimension(): Promise<Dimension | undefined> {
        if (!this.resize) return undefined;

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const element = this.$el as HTMLElement;
            const width = Math.max(element.offsetWidth, 0);
            const height = Math.max(element.offsetHeight, 0);

            resolve(this.parseDimension(width, height));
          }, 100);
        });
      },
      parseDimension(width: number, height: number): Dimension {
        if (width > height) {
          return { width: this.getApproximateSize(width) };
        }
        if (width < height) {
          return { height: this.getApproximateSize(height) };
        }
        return {
          width: this.getApproximateSize(width),
          height: this.getApproximateSize(height),
        };
      },

      getApproximateSize(size: number): number {
        const divide = size / this.approximateSize;
        return this.approximateSize * Math.max(Math.round(divide), 1);
      },
    },
  });
</script>

<template>
  <span v-if="state === 'error'" class="ImageView-error">Error</span>
  <div class="ImageView-empty" v-else-if="isValueEmpty"></div>
  <img
    v-else
    class="ImageView-img"
    ref="img"
    :style="style"
    :src="requestValue"
    :alt="alt"
    :loading="loading"
    @load="(event) => onLoad(event)"
    @error="(event) => onError(event)"
    @abort="(event) => onAbort(event)"
    @click="(event) => onClick(event)"
  />
</template>

<style lang="scss" scoped>
  .ImageView-error {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    font-size: 0.8em;
    background: hsla(0, 0%, 0%, 0.1);
    color: hsla(0, 0%, 0%, 0.6);
  }
  .ImageView-empty {
    background: hsla(0, 0%, 0%, 0.1);
  }
  .ImageView-img {
    display: flex;
    transition: all var(--transition-duration);
  }
</style>
