<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ContactModel } from '@/entity/model-v2/Contact.model';

import Link from '../PageHome-Link.vue';
import Section from './PageHome-Section.vue';

withDefaults(defineProps<{ isThin?: boolean }>(), { isThin: false });

const callContacts = ref<
  {
    title: string;
    title1?: string;
    href: string;
    target: string;
    icon: string;
  }[]
>([]);
const chatContacts = ref<
  {
    title: string;
    title1: string;
    href: string;
    target: string;
    icon: string;
  }[]
>([]);

onMounted(() => {
  const contacts = [
    new ContactModel({
      title: 'Beh Aik Keong',
      links: [
        { category: 'call', id: '0167959444' },
        { category: 'whatsapp', id: '0167959444' },
      ],
    }),
    new ContactModel({
      title: 'Office (Mobile)',
      links: [
        { category: 'call', id: '0146315353' },
        { category: 'whatsapp', id: '0146315353' },
        { category: 'telegram', id: 'FreshnetEnterprise' },
      ],
    }),
    new ContactModel({
      title: 'Office',
      links: [{ category: 'telephone', id: '0332897297' }],
    }),
  ];

  callContacts.value = [];
  chatContacts.value = [];
  for (const contact of contacts) {
    for (const link of contact.links) {
      const categoryKey = link.socialMedia?.key ?? '';
      const categoryIcon = link.socialMedia?.icon ?? '';
      if (categoryKey === 'call' || categoryKey === 'telephone') {
        callContacts.value.push({
          title: contact.title,
          href: link.toHtmlHref(),
          target: link.toHtmlTarget(),
          icon: categoryIcon,
        });
      } else {
        const categoryTitle = link.socialMedia?.title ?? '';
        chatContacts.value.push({
          title: contact.title,
          title1: categoryTitle,
          href: link.toHtmlHref(),
          target: link.toHtmlTarget(),
          icon: categoryIcon,
        });
      }
    }
  }
});
</script>

<template>
  <Section class="HomeSectionContact-Section">
    <div class="HomeSectionContact" :isThin="`${isThin}`">
      <div>
        <span>Call us</span>

        <div>
          <Link
            v-for="contact of callContacts"
            :key="`${contact.title}${contact.href}`"
            :target="contact.target"
            :href="contact.href"
            :icon="contact.icon"
          >
            <span v-if="contact.title">{{ contact.title }}</span>

            <span v-if="contact.title1">{{ contact.title1 }}</span>
          </Link>
        </div>
      </div>

      <div>
        <span>Start a chat with us</span>

        <div>
          <Link
            v-for="contact of chatContacts"
            :key="`${contact.title}${contact.href}`"
            :target="contact.target"
            :href="contact.href"
            :icon="contact.icon"
          >
            <span v-if="contact.title">{{ contact.title }}</span>

            <span v-if="contact.title1">{{ contact.title1 }}</span>
          </Link>
        </div>
      </div>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.HomeSectionContact {
  width: 100%;
  border-radius: 1em;
  overflow: hidden;
  gap: 1.5em 0.8em;

  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));

  justify-content: center;
  align-items: center;
  justify-items: center;
  align-content: center;

  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    gap: 1.5em;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      text-align: center;
    }

    & > * {
      width: 100%;
      gap: 0.5em;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12em, 1fr));

      & > * {
        flex-direction: column;
      }
    }
  }
}
</style>
