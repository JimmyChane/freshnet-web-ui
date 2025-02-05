<script>
import { SettingKey } from '@/items/Setting';
import { useSettingStore } from '@/stores/setting.store';

import Link from './PageHome-Link.vue';
import Section from './PageHome-Section.vue';

export default {
  components: { Section, Link },
  props: { isThin: { type: Boolean, default: false } },
  data: (c) => ({ callContacts: [], chatContacts: [] }),
  computed: {
    lastModified() {
      return useSettingStore().lastModified;
    },
  },
  watch: {
    lastModified() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      const contacts = await useSettingStore().findValueOfKey({
        key: SettingKey.Contacts,
        default: [],
      });

      this.callContacts = [];
      this.chatContacts = [];
      for (const contact of contacts) {
        for (const link of contact.links) {
          const categoryKey = link.category?.key ?? '';
          const categoryIcon = link.category?.icon ?? '';
          if (categoryKey === 'call' || categoryKey === 'telephone') {
            this.callContacts.push({
              title: contact.title,
              href: link.toHtmlHref(),
              target: link.toHtmlTarget(),
              icon: categoryIcon,
            });
          } else {
            const categoryTitle = link.category?.title ?? '';
            this.chatContacts.push({
              title: contact.title,
              title1: categoryTitle,
              href: link.toHtmlHref(),
              target: link.toHtmlTarget(),
              icon: categoryIcon,
            });
          }
        }
      }
    },
  },
};
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
