<script setup lang="ts">
import SectionTitle from './PageHome-Section-Title.vue';
import Section from './PageHome-Section.vue';
</script>

<template>
  <Section>
    <SectionTitle>Feedback</SectionTitle>
    <textarea class="HomeSectionFeedback-input" type="text" placeholder="Write something..." />
  </Section>
</template>

<style lang="scss" scoped>
.HomeSectionFeedback-input {
  width: 100%;
  min-height: 16rem;
  height: max-content;
  text-align: start;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  padding-bottom: 2rem;
  resize: none;
  background: hsla(0, 0%, 0%, 0.06);

  scroll-padding-bottom: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: auto;
}
</style>
