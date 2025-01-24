<script>
import TextArea from '@/components/InputTextArea.vue';

export default {
  components: { TextArea },
  props: {
    description: { type: String, default: '' },
  },
  methods: {
    onInputDescription(value) {
      this.$emit('input-description', value);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<template>
  <div class="WindowUpdateService-description">
    <span class="WindowUpdateService-title">Description</span>
    <TextArea
      class="WindowUpdateService-input"
      ref="input"
      :isRequired="true"
      :bindValue="description"
      @input="(comp) => onInputDescription(comp.value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowUpdateService-description {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .WindowUpdateService-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowUpdateService-input {
    height: 8rem;
    font-size: 1rem;
    background: hsla(0, 0%, 0%, 0.03);
    border-radius: 0.2rem;
    padding: 0.6rem;
  }
}
</style>
