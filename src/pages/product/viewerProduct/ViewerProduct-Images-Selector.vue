<script>
export default { emits: ['click-file'] };
</script>

<template>
  <dir class="ProductViewerImageSelector">
    <div class="ProductViewerImageSelector-body transition">
      <div class="ProductViewerImageSelector-button">
        <img
          class="ProductViewerImageSelector-icon"
          src="@/assets/icon/image-000000.svg"
        />
      </div>

      <input
        class="ProductViewerImageSelector-input"
        type="file"
        accept=".jpeg, .jpg, .png, .webp"
        @change="(event) => $emit('click-file', event.target.files)"
        multiple
      />
    </div>
  </dir>
</template>

<style lang="scss" scoped>
.ProductViewerImageSelector {
  --width: 5rem;
  --height: 3rem;
  @media (max-width: 480px) {
    --height: 2.9rem;
  }

  --box-padding: 0.18rem;

  width: calc(var(--width) + var(--box-padding) + var(--box-padding));
  height: calc(var(--width) + var(--box-padding) + var(--box-padding));
  min-width: calc(var(--height) + var(--box-padding) + var(--box-padding));
  min-height: calc(var(--height) + var(--box-padding) + var(--box-padding));

  display: flex;
  align-items: center;
  justify-content: center;

  .ProductViewerImageSelector-body {
    width: var(--width);
    height: var(--height);
    min-width: var(--width);
    min-height: var(--height);

    position: relative;
    background: hsla(0, 0%, 100%, 0.6);
    border-radius: 0.4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: hsla(0, 0%, 100%, 0.8);
    }

    .ProductViewerImageSelector-button {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      width: var(--width);
      height: var(--height);
      min-width: var(--width);
      min-height: var(--height);
      pointer-events: none;

      display: flex;
      align-content: center;
      justify-content: center;

      .ProductViewerImageSelector-icon {
        --size: 1em;
        @media (max-width: 480px) {
          --size: 0.8em;
        }
        width: var(--size);
        height: var(--size);

        opacity: 0.6;
        margin: auto;

        display: flex;
        align-content: center;
        justify-content: center;
      }
    }

    .ProductViewerImageSelector-input {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;

      width: var(--width);
      height: var(--height);
      min-width: var(--width);
      min-height: var(--height);
      cursor: pointer;
      border: none;
    }
  }
}
</style>
