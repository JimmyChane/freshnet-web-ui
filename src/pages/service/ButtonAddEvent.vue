<script>
export default { emits: ['click'] };
</script>

<template>
  <button class="ButtonAddEvent transition" @click="$emit('click')">
    <img
      class="ButtonAddEvent-icon transition"
      src="@/assets/icon/add-gray.svg"
    />
  </button>
</template>

<style lang="scss" scoped>
.ButtonAddEvent {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border: none;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 1em;

  &:hover {
    background: hsla(201, 22%, 53%, 0.2);
  }
  .ButtonAddEvent-icon {
    width: 1em;
    height: 1em;
  }
}
</style>
