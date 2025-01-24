<script>
import { isString } from '@/U';
import Image from '@/items/Image';
import ServiceImage from '@/items/ServiceImage';

class Container {
  constructor(image) {
    this.image = image;
  }

  isString() {
    return isString(this.image);
  }
  isImage() {
    return this.image instanceof Image;
  }
  isServiceImage() {
    return this.image instanceof ServiceImage;
  }

  getKey() {
    if (this.isString()) {
      return this.image;
    }

    return this.image.toUrl();
  }

  async toValue(option) {
    if (this.isString()) return this.image;
    if (this.isImage()) return this.image.toUrl(option);
    if (this.isServiceImage()) return await this.image.toBlob(option);

    return '';
  }
}

export default {
  props: {
    src: { type: [String, Image, ServiceImage], defualt: '' },
    alt: { type: String, defualt: '' },
    resize: { type: Boolean, default: true },
    loading: { type: String, default: 'lazy' },
  },
  data: (c) => ({
    approximateSize: 100,

    state: '',
    requestValue: '',
  }),
  computed: {
    style: (c) => {
      return { opacity: c.state === 'loaded' ? '1' : '0.2' };
    },
    isValueEmpty: (c) => c.requestValue === '',
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
    async invalidateSrc() {
      this.state = '';

      const previousValue = this.requestValue;

      const option = await this.getDimension();
      const container = new Container(this.src);
      const value = await container.toValue(option);

      if (previousValue !== this.requestValue) return;

      this.requestValue = value;
      const { img } = this.$refs;
      if (img && img.complete) this.state = 'loaded';
    },

    onLoad(event) {
      this.state = 'loaded';
      this.$emit('load', event);
    },
    onError(event) {
      this.state = 'error';
      this.$emit('error', event);
    },
    onAbort(event) {
      this.state = 'aborted';
      this.$emit('abort', event);
    },
    onClick(event) {
      this.$emit('click', event);
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

    getApproximateSize(size) {
      const divide = size / this.approximateSize;
      return this.approximateSize * Math.max(Math.round(divide), 1);
    },
  },
};
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
