<script>
  import IconEmptyFolder from "@/assets/icon/empty-folder-505050.svg";

  export default {
    props: {
      icon: { type: String, default: IconEmptyFolder },
      title: { type: String, default: "Sorry, nothing here" },
    },
  };
</script>

<template>
  <div class="Empty">
    <img class="Empty-background" :src="icon" />
    <span class="Empty-text">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .Empty {
    -webkit-touch-callout: none; // iOS Safari
    -webkit-user-select: none; // Safari
    -khtml-user-select: none; // Konqueror HTML
    -moz-user-select: none; // Old versions of Firefox
    -ms-user-select: none; // Internet Explorer/Edge
    user-select: none; // Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox
    pointer-events: none;

    width: 100%;
    height: max-content;
    text-align: start;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #00000033;

    .Empty-background {
      width: 60%;
      height: 60%;
      max-width: 16em;
      max-height: 16em;
      padding: 1.5em;
      opacity: 0.1;
    }
    .Empty-text {
      font-weight: 600;
    }
  }
</style>
