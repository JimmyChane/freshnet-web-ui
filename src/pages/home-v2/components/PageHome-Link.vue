<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import IconExternalColor from '@/assets/icon/external-1673E1.svg';
import IconExternalWhite from '@/assets/icon/external-FFFFFF.svg';

const props = withDefaults(
  defineProps<{ to?: string; href?: string; target?: string; icon?: string }>(),
  { to: '', href: '', target: '' },
);

const isHover = ref(false);
const refExternal = ref<HTMLLinkElement>();

const iconExternalWhite = computed(() => props.icon ?? IconExternalWhite);
const iconExternalColor = computed(() => props.icon ?? IconExternalColor);

const mouseEnter = (): void => {
  isHover.value = true;
};
const mouseLeave = (): void => {
  isHover.value = false;
};
const listenElement = (element: HTMLElement): void => {
  element.addEventListener('mouseenter', mouseEnter);
  element.addEventListener('mouseleave', mouseLeave);
  element.addEventListener('touchstart', mouseEnter);
  element.addEventListener('touchend', mouseLeave);
};

onMounted(() => {
  const external = refExternal.value as HTMLLinkElement;

  if (external) listenElement(external);
});
</script>

<template>
  <a
    class="SectionWhatElse-Item"
    ref="refExternal"
    v-if="!!href"
    :href="href"
    :target="target"
  >
    <slot></slot>

    <div class="SectionWhatElse-Item-image">
      <img :src="isHover ? iconExternalWhite : iconExternalColor" />
    </div>
  </a>

  <span class="SectionWhatElse-Item" v-else>
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
.SectionWhatElse-Item {
  width: 100%;
  height: 100%;
  min-height: 4.5em;
  color: var(--primary-color);

  font-size: 0.9em;
  font-weight: 600;

  position: relative;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 400ms ease;
}
a.SectionWhatElse-Item {
  background-color: var(--primary-color);
  color: white;

  border-radius: 1.2em;
  text-decoration: none;

  &:hover {
    background: var(--primary-color);
    color: rgba(255, 255, 255, 0.8);
  }

  .SectionWhatElse-Item-image {
    width: 2em;
    height: 2em;

    position: absolute;
    right: 0.8em;

    display: grid;
    place-items: center;
    border-radius: 50%;

    background-color: #ffffffe6;
    color: var(--primary-color);

    & > img {
      width: 1.1em;
      height: 1.1em;
    }
  }
}
</style>
