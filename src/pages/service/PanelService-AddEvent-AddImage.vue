<script>
  export default { emits: ["callback-result"] };
</script>

<template>
  <button class="PanelService-AddEvent-AddImage transition">
    <img src="@/assets/icon/image-000000.svg" />
    <input
      type="file"
      accept=".jpeg, .jpg, .png, .webp"
      @change="(event) => $emit('change', event)"
      multiple
    />
  </button>
</template>

<style lang="scss" scoped>
  .PanelService-AddEvent-AddImage {
    position: relative;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: hsla(0, 0%, 0%, 0.05);
    }

    --size: 2.8em;
    width: var(--size);
    height: var(--size);
    min-width: var(--size);
    min-height: var(--size);
    max-width: var(--size);
    max-height: var(--size);

    & > * {
      --size: 2.8em;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
    }

    :nth-child(1) {
      z-index: 1;
      padding: 0.7em;
    }
    :nth-child(2) {
      z-index: 2;

      position: absolute;
      display: flex;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      opacity: 0;
      cursor: pointer;
    }
  }
</style>
