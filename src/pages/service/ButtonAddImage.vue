<script>
  export default { emits: ["callback-result"] };
</script>

<template>
  <button class="ButtonImageAdd transition">
    <img
      class="ButtonImageAdd-icon transition"
      src="@/assets/icon/image-000000.svg"
    />
    <input
      class="ButtonImageAdd-pick"
      type="file"
      accept=".jpeg, .jpg, .png, .webp"
      @change="
        (event) => {
          $emit('callback-result', event.target.files);
        }
      "
      multiple
    />
  </button>
</template>

<style lang="scss" scoped>
  .ButtonImageAdd {
    position: relative;
    border: none;
    background: white;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
      background: hsla(201, 35%, 25%, 0.2);
    }
    .ButtonImageAdd-icon {
      width: 20%;
      height: 20%;
      cursor: pointer;
    }
    .ButtonImageAdd-pick {
      position: absolute;
      display: flex;
      min-width: 100%;
      min-height: 100%;
      max-width: 100%;
      max-height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>
