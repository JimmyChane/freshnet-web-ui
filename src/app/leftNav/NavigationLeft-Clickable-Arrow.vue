<script>
  import ButtonIcon from "@/components/button/ButtonIcon.vue";

  export default {
    emits: ["click"],
    components: { ButtonIcon },
    props: {
      isExpand: { type: Boolean },
    },
    computed: {
      icon() {
        return this.isExpand
          ? this.host.icon("arrowDown-FFFFFF")
          : this.host.icon("arrowDown-000000");
      },
    },
  };
</script>

<template>
  <div class="Navigationleft-Clickable-Body" :isExpand="`${isExpand}`">
    <ButtonIcon
      class="Navigationleft-Clickable-Body-button"
      :src="icon.toUrl()"
      @click="() => $emit('click')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .Navigationleft-Clickable-Body {
    flex-grow: 0;
    position: absolute;
    right: 0.5rem;
    font-size: 0.6rem;
    pointer-events: none;

    .Navigationleft-Clickable-Body-button {
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
    }
  }

  .Navigationleft-Clickable-Body[isExpand="true"] {
    .Navigationleft-Clickable-Body-button {
      transform: rotate(0deg);
    }
  }
  .Navigationleft-Clickable-Body[isExpand="false"] {
    .Navigationleft-Clickable-Body-button {
      transform: rotate(-90deg);
    }
  }
</style>
