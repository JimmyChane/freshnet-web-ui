<script>
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  export default {
    components: { ButtonIcon },
    emits: ["input-content", "change-content", "click-remove"],
    props: { item: { type: Object, default: () => null } },
    computed: {
      specifications: (c) => {
        return [
          { key: "none", title: "None" },
          ...c.specificationStore.getters.items.map((item) => item),
        ].map((item) => ({
          key: item.key,
          title: item.title,
          icon: item.icon?.toUrl() ?? "",
        }));
      },

      specType: (c) => {
        return c.specifications.find((specType) => {
          return specType.key === c.item.typeKey;
        });
      },
      icon: (c) => c.specType?.icon ?? "",
      title: (c) => c.specType?.title ?? "",
    },
    mounted() {
      console.log(this.item);
      this.$refs.ItemSpecInput.focus();
    },
  };
</script>

<template>
  <div class="ItemSpec" @focus="$refs.ItemSpecInput.focus()">
    <textarea
      :class="['ItemSpec-input', 'transition']"
      :style="{ 'grid-area': 'input' }"
      ref="ItemSpecInput"
      type="text"
      v-model="item.content"
      autocapitalize="words"
      @input="(event) => $emit('input-content', event.target.value)"
      @change="(event) => $emit('change-content', event.target.value)"
    />
    <img
      class="ItemSpec-icon"
      :style="{ 'grid-area': 'icon' }"
      v-if="icon"
      :src="icon"
    />
    <span
      class="ItemSpec-title"
      :style="{ 'grid-area': 'title' }"
      v-if="title"
      >{{ title }}</span
    >
    <ButtonIcon
      class="ItemSpec-remove"
      :style="{ 'grid-area': 'remove' }"
      :src="host.icon('close-000000').toUrl()"
      @click="$emit('click-remove', item)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSpec {
    min-height: 4rem;
    width: 100%;

    border-radius: 0.5rem;
    background: hsla(0, 0%, 0%, 0.04);
    border: 1px solid hsla(0, 0%, 0%, 0.08);

    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: stretch;
    overflow: hidden;
    padding: 0.5rem;

    display: grid;
    grid-template-areas:
      "icon title remove"
      "icon input remove";
    grid-template-columns: 2.8rem 1fr 2.8rem;
    grid-template-rows: 1rem 1fr;

    .ItemSpec-input {
      flex-grow: 1;

      min-height: 2rem;
      height: max-content;

      padding: 0.25rem 0;
      font-size: 1rem;
      border: none;
      border-bottom: 2px solid hsla(0, 0%, 0%, 0.1);
      background: none;
      flex-grow: 1;

      display: flex;
      flex-direction: row;
      resize: vertical;

      &:hover,
      &:focus {
        border-color: hsla(0, 0%, 0%, 0.3);
      }
    }
    .ItemSpec-icon {
      padding: 0.7rem;
      width: 2.8rem;
      height: 2.8rem;
    }
    .ItemSpec-title {
      font-size: 0.7rem;
      color: black;
      flex-grow: 1;
      line-height: 0.8rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .ItemSpec-remove {
      padding: 0.7rem;
      width: 2.8rem;
      height: 2.8rem;
    }
  }
</style>
