<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import IconExternalColor from '@/assets/icon/external-1673E1.svg';
import IconExternalWhite from '@/assets/icon/external-FFFFFF.svg';
import IconLinkColor from '@/assets/icon/link-1673E1.svg';
import IconLinkWhite from '@/assets/icon/link-FFFFFF.svg';

const props = withDefaults(
  defineProps<{ to?: any; href?: string; target?: string; icon: string }>(),
  { to: '', href: '', target: '' },
);

const isHover = ref(false);

const iconLinkWhite = computed(() => props.icon ?? IconLinkWhite);
const iconLinkColor = computed(() => props.icon ?? IconLinkColor);
const iconExternalWhite = computed(() => props.icon ?? IconExternalWhite);
const iconExternalColor = computed(() => props.icon ?? IconExternalColor);

function listenElement(element: any) {
  element.addEventListener('mouseenter', mouseEnter);
  element.addEventListener('mouseleave', mouseLeave);
  element.addEventListener('touchstart', mouseEnter);
  element.addEventListener('touchend', mouseLeave);
}
function mouseEnter() {
  isHover.value = true;
}
function mouseLeave() {
  isHover.value = false;
}

const link = ref();
const external = ref();

onMounted(() => {
  if (link.value) listenElement(link.value.$el);
  if (external.value) listenElement(external.value);
});
</script>

<template>
  <a
    class="SectionWhatElse-Item"
    ref="external"
    v-if="!!href"
    :href="href"
    :target="target"
  >
    <slot></slot>
    <img :src="isHover ? iconExternalWhite : iconExternalColor" />
  </a>

  <router-link
    class="SectionWhatElse-Item"
    ref="link"
    v-else-if="!!to"
    :to="to"
  >
    <slot></slot>
    <img :src="isHover ? iconLinkWhite : iconLinkColor" />
  </router-link>

  <span class="SectionWhatElse-Item" v-else>
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
.SectionWhatElse-Item {
  width: 100%;
  height: 100%;
  min-height: 3.5em;
  color: var(--primary-color);

  font-size: 0.9em;
  font-weight: 600;

  position: relative;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
a.SectionWhatElse-Item {
  border: 2px solid var(--primary-color);
  border-radius: 1em;
  text-decoration: none;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
  img {
    position: absolute;
    pointer-events: none;
    right: 0.8em;

    width: 0.8em;
    height: 0.8em;
  }
}
</style>
