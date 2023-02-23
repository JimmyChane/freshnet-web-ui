<script>
   import Section from "./PageHome_Section.vue";
   export default {
      components: { Section },
      props: { isThin: { type: Boolean, default: false } },
   };
</script>

<template>
   <Section :isThin="isThin" title="Find Us">
      <a
         class="HomeSectionLocation-button"
         href="https://www.google.com/maps/dir//No.+14,+Ground+Floor,+Freshnet+Enterprise,+Jalan+Melati+3%2F3,+Bandar+Melawati,+45000+Kuala+Selangor,+Selangor/@3.329664,101.256548,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31ccf49e980c2d07:0xadf4850c7c433d0a!2m2!1d101.2565481!2d3.3296638"
         target="__blank"
         ><img :src="host.icon('map-FFFFFF')" /><span>Navigate</span></a
      >
   </Section>
</template>

<style lang="scss" scoped>
   .HomeSectionLocation-button {
      width: 14.5rem;
      height: 2.8rem;
      max-width: 100%;

      z-index: 2;
      background: #2a26d8;
      color: white;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      border-radius: 0.3rem;
      font-size: 1rem;
      gap: 0.5rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;

      img {
         width: 0.9rem;
         height: 0.9rem;
      }
   }
</style>
