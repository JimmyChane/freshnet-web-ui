<script>
import IconEdit from '@/assets/icon/edit-000000.svg';
import { SpecificationKey } from '@/items/Specification';

import ItemProductSpecification from './ViewerProduct-Section-Specification-Item.vue';
import Section from './ViewerProduct-Section.vue';

export default {
  components: { Section, ItemProductSpecification },
  props: {
    primaryColor: { type: Object },
    allowEdit: { type: Boolean, default: false },
    product: { type: Object, default: () => null },
  },
  computed: {
    keys() {
      return Object.keys(SpecificationKey).map((objectKey) => {
        return SpecificationKey[objectKey];
      });
    },
    specifications() {
      if (!this.product) return [];
      if (!Array.isArray(this.product.specifications)) return [];

      return this.product.specifications
        .filter((spec) => spec && spec.type && spec.content)
        .sort((spec1, spec2) => {
          const key1 = this.obtainKeyOfSpecificationType(spec1.type);
          const key2 = this.obtainKeyOfSpecificationType(spec2.type);

          let index1 = this.keys.indexOf(key1);
          let index2 = this.keys.indexOf(key2);

          index1 = index1 >= 0 ? index1 : this.keys.length;
          index2 = index2 >= 0 ? index2 : this.keys.length;

          return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
        });
    },

    menu() {
      if (!this.allowEdit) return null;
      return {
        title: 'Edit',
        icon: IconEdit,
        click: () =>
          this.$emit('click-edit', {
            product: this.product,
            specifications: this.specifications,
          }),
      };
    },
  },
  methods: {
    obtainKeyOfSpecificationType(type) {
      if (typeof type === 'object') return type.key;
      if (typeof type === 'string') return type;
      return '';
    },
  },
};
</script>

<template>
  <Section
    v-if="allowEdit || specifications.length"
    :primaryColor="primaryColor"
    :menu="menu"
    :title="allowEdit ? 'Specification' : ''"
  >
    <div class="SectionSpecification">
      <div class="SectionSpecification-items" v-if="specifications.length">
        <ItemProductSpecification
          v-for="spec in specifications"
          :key="spec.name"
          :productSpecification="spec"
          :isVertical="true"
        />
      </div>

      <span class="SectionSpecification-noContent" v-else>
        No Specifications
      </span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionSpecification {
  grid-area: specification;
  width: 100%;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .SectionSpecification-items {
    width: 100%;
    gap: 3px;
    display: flex;
    flex-direction: column;
  }
  .SectionSpecification-noContent {
    width: 100%;
    padding: 1.2rem;
    font-style: italic;
    font-size: 0.8rem;
    color: hsla(0, 0%, 0%, 0.6);
    background: hsla(0, 0%, 100%, 0.6);
  }
}
</style>
