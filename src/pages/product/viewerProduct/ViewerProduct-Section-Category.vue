<script>
import IconEdit from '@/assets/icon/edit-000000.svg';

import Section from './ViewerProduct-Section.vue';

export default {
  components: { Section },
  props: {
    primaryColor: { type: Object },
    allowEdit: { type: Boolean, default: false },
    product: { type: Object, default: () => null },
  },
  data: (c) => ({ IconEdit, category: null }),
  computed: {
    categoryId: (c) => c.product?.categoryId ?? '',
    categoryTitle: (c) => c.category?.title ?? '',
    categoryIconUrl: (c) => c.category?.icon?.toUrl() ?? '',
  },
  watch: {
    product() {
      this.invalidate();
    },
    categoryId() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      this.category = null;
      if (!this.product) return;
      this.category = await this.product.fetchCategory();
    },
  },
};
</script>

<template>
  <Section
    v-if="allowEdit"
    title="Category"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => {
        $emit('click-edit', {
          product,
          categoryId: categoryId,
        });
      },
    }"
  >
    <div class="SectionCategory">
      <div class="SectionCategory-item" v-if="category">
        <img
          class="SectionCategory-item-icon"
          v-if="categoryIconUrl"
          :src="categoryIconUrl"
        />
        <span class="SectionCategory-item-title" v-if="categoryTitle">
          {{ categoryTitle }}
        </span>
      </div>

      <span class="SectionCategory-noContent" v-else>No Category</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionCategory {
  grid-area: category;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  .SectionCategory-item {
    width: 100%;
    padding: 1.2rem;
    gap: 1.2rem;
    background: hsla(0, 0%, 100%, 0.6);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .SectionCategory-item-icon {
      width: 1.6rem;
      height: 1.6rem;
    }
    .SectionCategory-item-title {
      font-size: 1rem;
      font-weight: 600;
    }
  }
  .SectionCategory-noContent {
    opacity: 0.6;
    font-style: italic;
  }
}
</style>
