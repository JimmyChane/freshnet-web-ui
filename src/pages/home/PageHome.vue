<script>
import IconPack from '@/app/IconPack';
import Footer from '@/app/footer/Footer.vue';
import { iconServer } from '@/host/Server';

import Actionbar from './PageHome-Actionbar.vue';
import Header from './PageHome-Header.vue';
import SectionTitle from './PageHome-Section-Title.vue';
import SectionCategory from './PageHome-SectionCategory.vue';
import SectionContact from './PageHome-SectionContact.vue';
import SectionHour from './PageHome-SectionHour.vue';
import SectionLocation from './PageHome-SectionLocation.vue';
import SectionPrint from './PageHome-SectionPrint.vue';
import SectionProduct from './PageHome-SectionProduct.vue';
import SectionService from './PageHome-SectionService.vue';

export default {
  key: 'home',
  name: 'Home',
  title: 'Home',
  icon: new IconPack(iconServer('home-FFFFFF'), iconServer('home-000000')),

  components: {
    Footer,
    Actionbar,
    Header,
    SectionTitle,
    SectionProduct,
    SectionContact,
    SectionPrint,
    SectionLocation,
    SectionCategory,
    SectionHour,
    SectionService,
  },
  data: () => ({ scrollTop: 0 }),
  computed: {
    innerWidth: (c) => c.$store.getters.window.innerWidth,

    isWide: (c) => c.innerWidth > 800,
    isDrawer: (c) => c.$store.getters.navigation.isDrawer(),
    isThin: (c) => c.isWide || c.isDrawer,

    classes: (c) => (c.isWide ? 'Home-isOver800' : 'Home-isLess'),
  },
  mounted() {
    document.title = 'Freshnet Enterprise';
  },
};
</script>

<template>
  <div
    :class="['PageHome', classes]"
    @scroll="(e) => (scrollTop = e.target.scrollTop)"
  >
    <div class="PageHome-background"></div>

    <Actionbar
      class="Home-actionbar"
      :style="{ 'z-index': '2' }"
      :isThin="isDrawer"
      :isParentScrolledUp="scrollTop < 10"
    />

    <div class="Home-body">
      <div class="Home-grid">
        <SectionProduct :style="{ 'grid-area': 'product' }" :isThin="isThin" />
        <SectionCategory :style="{ 'grid-area': 'category' }" />

        <SectionTitle class="title" :style="{ 'grid-area': 'contact-title' }">
          Contact
        </SectionTitle>
        <SectionContact :style="{ 'grid-area': 'contact' }" :isThin="isThin" />

        <SectionTitle class="title" :style="{ 'grid-area': 'hour-title' }">
          Business Hours
        </SectionTitle>
        <SectionHour :style="{ 'grid-area': 'hour' }" :isThin="isThin" />

        <SectionTitle class="title" :style="{ 'grid-area': 'service-title' }">
          Services
        </SectionTitle>
        <SectionService :style="{ 'grid-area': 'service' }" :isThin="isThin" />

        <SectionTitle class="title" :style="{ 'grid-area': 'location-title' }">
          Location
        </SectionTitle>
        <SectionLocation
          :style="{ 'grid-area': 'location' }"
          :isThin="isThin"
        />
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

  .PageHome-background {
    position: absolute;
    min-height: 24rem;
    min-width: 100%;
    display: flex;
    background: linear-gradient(153deg, #49a6da 0%, #1636e1 100%);
  }

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
      margin-top: 2rem;

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
        'product'
        'category'
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
      }
    }
  }
}
.Home-isOver800 {
  .Home-body {
    .Home-grid {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas:
        'product product product'
        'category category category'
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
