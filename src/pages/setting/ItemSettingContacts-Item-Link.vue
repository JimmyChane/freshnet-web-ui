<script lang="ts">
  import { ContactCategory, ContactLink } from "@/items/Contact";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      link: { type: ContactLink },
    },
    computed: {
      category(): ContactCategory | null {
        return this.link.category;
      },
      categoryTitle(): string {
        return this.category?.title ?? "";
      },
      categoryIcon(): string {
        return this.category?.icon ?? "";
      },
      id(): string {
        return this.link.id;
      },
    },
  });
</script>

<template>
  <div class="ItemSettingContacts-Item-Link">
    <div class="ItemSettingContacts-Item-Link-header">
      <img
        class="ItemSettingContacts-Item-Link-icon"
        :src="categoryIcon"
        alt=""
      />
      <span>{{ categoryTitle }}</span>
    </div>
    <span>{{ id }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSettingContacts-Item-Link {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1em;
    .ItemSettingContacts-Item-Link-header {
      display: flex;
      flex-direction: row;
      gap: 0.2em;

      :nth-child(1) {
        --size: 0.8rem;
        width: var(--size);
        height: var(--size);
      }
    }
  }
</style>
