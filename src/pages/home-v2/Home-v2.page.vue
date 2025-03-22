<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { computed, defineComponent, onMounted, ref } from 'vue';

import Footer from '@/app/footer-v2/AppFooter-v2.vue';

import Actionbar from './components/PageHome-Actionbar.vue';
import SectionTitle from './components/sections/PageHome-Section-Title.vue';
import SectionContact from './components/sections/PageHome-SectionContact.vue';
import SectionHour from './components/sections/PageHome-SectionHour.vue';
import SectionLocation from './components/sections/PageHome-SectionLocation.vue';
import SectionService from './components/sections/PageHome-SectionService.vue';

defineComponent({ key: 'home', name: 'PageHome', title: 'Home' });

const scrollTop = ref(0);

const { width } = useWindowSize();
const isWide = computed(() => width.value > 800);
const isDrawer = computed(() => false);
const isThin = computed(() => isWide.value || isDrawer.value);
const classes = computed(() => {
  return isWide.value ? 'Home-isOver800' : 'Home-isLess';
});

const onScroll = (e: Event) => {
  const div = e.target as HTMLDivElement;
  scrollTop.value = div.scrollTop;
};

onMounted(() => {
  document.title = 'Freshnet Enterprise';
});
</script>

<template>
  <div :class="['PageHome', classes]" @scroll="onScroll">
    <Actionbar class="Home-actionbar" style="z-index: 2" :isThin="isDrawer" />

    <div class="Home-body">
      <div class="Home-grid">
        <SectionTitle class="title" style="grid-area: contact-title">
          Contact
        </SectionTitle>

        <SectionContact style="grid-area: contact" :isThin="isThin" />

        <SectionTitle class="title" style="grid-area: hour-title">
          Business Hours
        </SectionTitle>

        <SectionHour style="grid-area: hour" :isThin="isThin" />

        <SectionTitle class="title" style="grid-area: service-title">
          Services
        </SectionTitle>

        <SectionService style="grid-area: service" :isThin="isThin" />

        <SectionTitle class="title" style="grid-area: location-title">
          Location
        </SectionTitle>

        <SectionLocation style="grid-area: location" :isThin="isThin" />
      </div>
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.PageHome {
  --primary-color: #1673e1;

  z-index: 1;
  width: 100%;
  height: 100%;

  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  color: black;

  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  .Home-body {
    z-index: 1;
    width: 100%;
    max-width: 50rem;
    min-height: max-content;
    padding: 2rem;

    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .Home-grid {
      width: 100%;
      gap: 0.5rem;
      display: grid;
      grid-auto-flow: row;
    }
  }
}

.Home-isLess {
  .Home-body {
    padding: 1.2rem;

    .Home-grid {
      grid-template-columns: 1fr;
      grid-template-areas:
        'contact-title'
        'contact'
        'hour-title'
        'hour'
        'service-title'
        'service'
        'location-title'
        'location';
      justify-content: center;
      align-items: center;
      justify-items: center;
      align-content: center;
      row-gap: 1em;

      & > .title {
        margin-top: 2rem;

        &:first-child {
          margin-top: 1rem;
        }
      }
    }
  }
}
.Home-isOver800 {
  .Home-body {
    .Home-grid {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas:
        'contact-title contact contact'
        'hour hour hour-title'
        'service-title service service'
        'location location location-title';
      row-gap: 5em;
      justify-items: center;
      align-items: center;

      & > .title {
        font-size: 3em;
      }
    }
  }
}
</style>
