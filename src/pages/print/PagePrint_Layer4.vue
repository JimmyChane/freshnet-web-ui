<script>
export default { props: { item: { type: Object, default: () => null } } };
</script>

<template>
  <div class="PagePrint-Layer4">
    <div class="Layer4-header" v-if="item.icon || item.title">
      <img class="Layer4-icon" v-if="item.icon" :src="item.icon" />
      <span v-if="item.title">{{ item.title }}</span>
    </div>
    <span class="Layer4-price">{{ item.price }}</span>
  </div>
</template>

<style lang="scss" scoped>
.PagePrint-Layer4 {
  width: 100%;
  gap: 2rem;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  .Layer4-header {
    flex-grow: 0;
    gap: 0.8rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;

    font-weight: 600;

    .Layer4-icon {
      --size: 2.5rem;
      width: var(--size);
      height: var(--size);
      padding: 0.2rem;
      background: hsl(197, 23%, 40%);
      border-radius: 4px;
    }
  }
  .Layer4-price {
    min-width: max-content;
    flex-grow: 1;
    font-size: 1rem;
    text-align: end;
    font-weight: 600;
  }
}
</style>
