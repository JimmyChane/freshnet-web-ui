<script setup lang="ts">
import { computed } from 'vue';

import type { ContactModel } from '@/entity/model-v2/Contact.model';

const props = defineProps<{ contact: ContactModel }>();

const title = computed(() => props.contact.title);
const subtitle = computed(() => props.contact.subtitle);
const links = computed(() => props.contact.links);

const parsedLinks = computed(() => {
  return links.value.map((link) => {
    return { icon: link.socialMedia?.icon, href: link.toHtmlHref(), target: link.toHtmlTarget() };
  });
});
const primaryLink = computed(() => {
  return parsedLinks.value.length ? parsedLinks.value[0] : null;
});
</script>

<template>
  <div class="Footer-Contact">
    <div class="Footer-Contact-header">
      <span class="Footer-Contact-title" v-if="title">{{ title }}</span>

      <a class="Footer-Contact-primaryLink" v-if="primaryLink" :href="primaryLink.href" :target="primaryLink.target">
        <span class="Footer-Contact-subtitle">{{ subtitle }}</span>
      </a>

      <span class="Footer-Contact-subtitle" v-else>{{ subtitle }}</span>
    </div>

    <div class="Footer-Contact-links">
      <a
        class="Footer-Contact-link"
        v-for="link of links"
        :key="link.toHtmlHref()"
        :href="link.toHtmlHref()"
        :target="link.toHtmlTarget()"
      >
        <img class="Footer-Contact-icon" :src="link.socialMedia?.icon" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Footer-Contact {
  width: 100%;
  gap: 1rem;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;

  .Footer-Contact-header {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: center;

    font-weight: 400;
    text-align: start;
    .Footer-Contact-title {
      font-size: 0.9rem;
    }

    .Footer-Contact-primaryLink {
      color: inherit;
      text-decoration: inherit;
      font-size: inherit;

      &:hover {
        text-decoration: underline;
      }
    }
    .Footer-Contact-subtitle {
      font-size: 1rem;
      opacity: 1;
    }
  }

  .Footer-Contact-links {
    gap: 0.1rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    .Footer-Contact-link {
      --size: 2.5rem;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;

      display: flex;
      align-items: center;
      justify-content: center;
      .Footer-Contact-icon {
        --size: 1.2rem;
        width: var(--size);
        height: var(--size);
      }

      &:hover {
        background: hsla(0, 0%, 0%, 0.1);
      }
    }
  }
}
</style>
