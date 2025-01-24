<script>
export default {
  props: {
    link: { type: Object },
  },
  computed: {
    category: (c) => c.link.category,
    categoryTitle: (c) => c.category.title,
    categoryIcon: (c) => c.category.icon,
    id: (c) => c.link.id,
  },
};
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
