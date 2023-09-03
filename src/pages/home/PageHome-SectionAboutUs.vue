<script lang="ts">
  import Section from "./PageHome-Section.vue";
  import SectionTitle from "./PageHome-Section-Title.vue";
  import Vue from "vue";

  export default Vue.extend({
    components: { Section, SectionTitle },
  });
</script>

<template>
  <Section class="HomeSectionAboutUs">
    <SectionTitle>About Us</SectionTitle>
    <p
      >Since 2009, from teaching computer class to repair computer, printers,
      networking, cctv services.</p
    >
  </Section>
</template>
