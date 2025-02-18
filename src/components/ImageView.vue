<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { Image } from '@/items/Image';
import { ServiceImage } from '@/items/ServiceImage';

class Container {
  constructor(readonly image: string | Image | ServiceImage) {}

  isString() {
    return typeof this.image === 'string';
  }
  isImage() {
    return this.image instanceof Image;
  }
  isServiceImage() {
    return this.image instanceof ServiceImage;
  }

  getKey() {
    if (typeof this.image === 'string') {
      return this.image;
    }

    return this.image.toUrl();
  }

  async toValue(option: { width?: number; height?: number } | undefined) {
    if (typeof this.image === 'string') return this.image;
    if (this.image instanceof Image) return this.image.toUrl(option);
    if (this.image instanceof ServiceImage)
      return await this.image.toBlob(option);

    return '';
  }
}

const emits = defineEmits<{
  load: [any];
  error: [any];
  abort: [any];
  click: [any];
}>();

const props = withDefaults(
  defineProps<{
    src?: string | Image | ServiceImage;
    alt?: string;
    resize?: boolean;
    loading?: 'lazy' | 'eager' | undefined;
  }>(),
  { src: '', alt: '', resize: true, loading: 'lazy' },
);

const selfRef = ref<HTMLElement>();

const approximateSize = ref(1000);
const state = ref('');
const requestValue = ref('');

const style = computed(() => {
  return { opacity: state.value === 'loaded' ? '1' : '0.2' };
});

const isValueEmpty = computed(() => requestValue.value === '');

watch([() => props.src], () => invalidateSrc());

onMounted(() => invalidateSrc());

async function invalidateSrc() {
  state.value = '';

  const previousValue = requestValue.value;

  const option = await getDimension();
  const container = new Container(props.src);
  const value = await container.toValue(option);

  if (previousValue !== requestValue.value) return;

  requestValue.value = value;
  const img = selfRef.value;
  if (img instanceof HTMLImageElement && img.complete) {
    state.value = 'loaded';
  }
}

function onLoad(event: any) {
  state.value = 'loaded';
  emits('load', event);
}
function onError(event: any) {
  state.value = 'error';
  emits('error', event);
}
function onAbort(event: any) {
  state.value = 'aborted';
  emits('abort', event);
}
function onClick(event: any) {
  emits('click', event);
}

async function getDimension(): Promise<
  { width?: number; height?: number } | undefined
> {
  if (!props.resize) return undefined;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selfRef.value) {
        const width = Math.max(selfRef.value.offsetWidth, 0);
        const height = Math.max(selfRef.value.offsetHeight, 0);

        resolve(parseDimension(width, height));
      } else {
        resolve(undefined);
      }
    }, 100);
  });
}
function parseDimension(
  width: any,
  height: any,
): { width?: number; height?: number } {
  if (width > height) {
    return { width: getApproximateSize(width) };
  }
  if (width < height) {
    return { height: getApproximateSize(height) };
  }
  return {
    width: getApproximateSize(width),
    height: getApproximateSize(height),
  };
}

function getApproximateSize(size: number) {
  const divide = size / approximateSize.value;
  return approximateSize.value * Math.max(Math.round(divide), 1);
}
</script>

<template>
  <span ref="selfRef" v-if="state === 'error'" class="ImageView-error">
    Error
  </span>
  <div ref="selfRef" class="ImageView-empty" v-else-if="isValueEmpty"></div>
  <img
    ref="selfRef"
    v-else
    class="ImageView-img"
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
