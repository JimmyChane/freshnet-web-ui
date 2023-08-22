<script>
  import ButtonIcon from "@/components/button/ButtonIcon.vue";

  export default {
    components: { ButtonIcon },
    props: {
      item: { type: Object, default: () => null },
      isWide: { type: Boolean, default: true },
    },
    computed: {
      icon() {
        return this.item?.icon ?? null;
      },
      iconLight() {
        return this.icon?.light ?? "";
      },
      iconDark() {
        return this.icon?.dark ?? "";
      },
      iconUrl() {
        return this.isSelected ? this.iconLight : this.iconDark;
      },
      title() {
        const { title } = this.item;
        return this.isWide ? title : title.substring(0, 1);
      },

      isSelected() {
        return this.item.isSelected();
      },
    },
  };
</script>

<template>
  <div class="LeftNavItem" :isSelected="`${isSelected}`" :isWide="`${isWide}`">
    <img class="LeftNavItem-icon" v-if="iconUrl" :src="iconUrl" />
    <span
      class="LeftNavItem-title"
      v-if="iconUrl ? isWide && title.length : true"
      >{{ title }}</span
    >
  </div>
</template>

<style lang="scss" scoped>
  .LeftNavItem {
    border: none;
    text-align: center;
    font-size: 1em;
    background: none;
    display: flex;
    flex-direction: row;
    gap: 1em;

    .LeftNavItem-icon {
      --size: 1.2em;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      object-fit: scale-down;
    }
    .LeftNavItem-title {
      --size: 1.2em;
      flex-grow: 1;
      min-height: var(--size);
      text-align: start;
      font-size: 1em;
      font-weight: 600;
      line-height: 1.2;
      color: inherit;

      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .LeftNavItem[isSelected="true"] {
    color: white;
  }
  .LeftNavItem[isSelected="false"] {
    color: black;
  }

  .LeftNavItem[isWide="true"] {
    width: 100%;
    justify-content: space-between;
  }
  .LeftNavItem[isWide="false"] {
    align-items: center;
    justify-content: center;
    .LeftNavItem-title {
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      align-items: center;
      justify-content: center;
    }
  }
</style>
