<script>
export default {
  props: { item: { type: Object, default: () => null } },
  computed: {
    content: (c) => c.item.content,
    name: (c) => c.item.customer.name,
    phoneNumber: (c) => c.item.customer.phoneNumber,
    status: (c) => c.item.status,
  },
};
</script>

<template>
  <div class="ItemOrderSearch">
    <span>{{ content }}</span>
    <span>{{ name }}</span>
    <span>{{ phoneNumber }}</span>
    <span>{{ status }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemOrderSearch {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
}
</style>
