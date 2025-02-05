<script>
import Input from '@/components/Input.vue';
import { useLoginStore } from '@/stores/login.store';

export default {
  components: { Input },
  props: { name: { type: String, default: '' } },
  data: (c) => ({ nameOfUser: '' }),
  computed: {
    user: (c) => useLoginStore().user,
    isUserDefault: (c) => c.user.isDefault(),
    nameUserType: (c) => {
      if (c.user.isTypeAdmin()) return 'Admin';
      if (c.user.isTypeStaff()) return 'Staff';
      return 'unknown';
    },
  },
  watch: {
    user() {
      this.onUser();
    },
  },
  mounted() {
    this.onUser();
  },
  methods: {
    onUser() {
      const user = this.user;
      if (!user.isTypeNone()) {
        this.nameOfUser = this.isUserDefault ? '' : user.name;
      }
    },
    onInputName(value) {
      this.$emit('input-name', value);
    },
  },
};
</script>

<template>
  <Input
    class="WindowServiceUpdate-input"
    v-if="isUserDefault"
    autocapitalize="words"
    :label="`${nameUserType}${name.trim() === '' ? ' (Your name here)' : ''}`"
    :isRequired="true"
    :bindValue="name"
    @input="(comp) => onInputName(comp.value)"
  />
  <span class="WindowServiceUpdate-user-user" v-else>
    {{ `${nameUserType} : ${nameOfUser}` }}
  </span>
</template>

<style lang="scss" scoped>
.WindowServiceUpdate-input {
  width: 12rem;
  padding: 0.6rem;
  background: hsla(0, 0%, 0%, 0.03);
  border-radius: 0.2rem;
}
.WindowServiceUpdate-user-user {
  width: max-content;
  padding: 0.4rem 1rem;
  background: hsla(0, 0%, 0%, 0.03);
  border: 1px solid hsla(0, 0%, 0%, 0.05);
  border-radius: 2rem;
  text-align: center;
}
</style>
