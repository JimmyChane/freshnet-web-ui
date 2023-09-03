<script lang="ts">
  import Contact, { ContactLink } from "@/items/Contact";
  import Vue from "vue";
  import ContactLinkVue from "./ItemSettingContacts-Item-Link.vue";

  export default Vue.extend({
    components: { ContactLinkVue },
    props: {
      value: { type: Contact },
    },
    computed: {
      title(): string {
        return this.value.title;
      },
      links(): ContactLink[] {
        return this.value.links;
      },
    },
  });
</script>

<template>
  <div class="ItemSettingContacts-Item">
    <span class="ItemSettingContacts-Item-title">{{ title }}</span>

    <ContactLinkVue
      v-for="link of links"
      :key="`${title}${link.category.key}${link.id}`"
      :link="link"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSettingContacts-Item {
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    gap: 0.5rem;

    display: flex;
    flex-direction: column;

    .ItemSettingContacts-Item-title {
      font-weight: 600;
    }
  }
</style>
