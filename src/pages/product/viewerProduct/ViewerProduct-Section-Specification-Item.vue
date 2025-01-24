<script>
export default {
  props: {
    productSpecification: { type: Object, default: () => null },
    isVertical: { type: Boolean, default: false },
  },
  data: (c) => ({ title: '', icon: '', content: '' }),
  watch: {
    productSpecification() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      this.title = '';
      this.icon = '';
      this.content = '';

      const type = (await this.productSpecification?.fetchType()) ?? null;

      this.title = type
        ? type.title
        : this.parseKeyToTitle(this.productSpecification.typeKey);
      this.icon = type?.icon?.toUrl() ?? '';
      this.content = this.productSpecification.content;
    },
    parseKeyToTitle(key = '') {
      if (typeof key !== 'string') key = 'none';
      if (key === 'none') return '';

      return key.split(' ').reduce((title, text) => {
        let result = text.charAt(0).toUpperCase() + text.slice(1);
        return title === '' ? result : `${title} ${result}`;
      }, '');
    },
  },
};
</script>

<template>
  <div class="ItemProductSpecification" :isVertical="`${isVertical}`">
    <img
      class="ItemProductSpecification-icon"
      :style="{ opacity: icon ? '1' : '0' }"
      :src="icon"
    />
    <div class="ItemProductSpecification-main">
      <span>{{ title }}</span>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemProductSpecification {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.2rem;
  background: hsla(0, 0%, 100%, 0.6);

  .ItemProductSpecification-icon {
    width: 1.6rem;
    height: 1.6rem;
    padding: 0.2rem;
    object-fit: contain;
  }
  .ItemProductSpecification-main {
    width: 100%;
    gap: 0.2rem;
    flex-grow: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    :nth-child(1) {
      height: max-content;

      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: 400;
      font-size: 0.7rem;

      color: hsla(0, 0%, 0%, 0.8);
    }
    :nth-child(2) {
      height: max-content;
      min-height: 1.6rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  }
}

.ItemProductSpecification[isVertical='true'] {
  gap: 1.2rem;
  .ItemProductSpecification-icon {
    height: 2rem;
  }
  .ItemProductSpecification-main {
    flex-direction: column;
    min-height: 2rem;
  }
}
.ItemProductSpecification[isVertical='false'] {
  .ItemProductSpecification-main {
    width: 100%;
    flex-grow: 1;
    flex-direction: row;
    min-height: 1.6rem;

    :nth-child(1) {
      min-height: 1.6rem;
      min-width: 5rem;
      max-width: 5rem;
      padding: 0 0.6rem;
    }
    :nth-child(2) {
      width: 100%;
    }
  }
}
</style>
