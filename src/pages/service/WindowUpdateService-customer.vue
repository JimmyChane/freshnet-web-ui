<script>
import Input from '@/components/Input.vue';

export default {
  components: { Input },
  props: {
    name: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
  },
  methods: {
    onInputName(value) {
      this.$emit('input-name', value);
    },
    onInputPhoneNumber(value) {
      this.$emit('input-phoneNumber', value);
    },
    focus() {
      this.$refs.Name.focus();
    },
  },
};
</script>

<template>
  <div class="WindowUpdateService-customer">
    <span class="WindowUpdateService-title">Customer</span>
    <Input
      class="WindowUpdateService-input"
      label="Name"
      ref="Name"
      autocapitalize="words"
      :isRequired="true"
      :bindValue="name"
      @input="(comp) => onInputName(comp.value)"
    />
    <Input
      class="WindowUpdateService-input"
      label="Phone Number"
      type="tel"
      :bindValue="phoneNumber"
      @input="(comp) => onInputPhoneNumber(comp.value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowUpdateService-customer {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  .WindowUpdateService-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowUpdateService-input {
    font-size: 1rem;
    background: hsla(0, 0%, 0%, 0.03);
    border-radius: 0.2rem;
    padding: 0.6rem;
  }
}
</style>
