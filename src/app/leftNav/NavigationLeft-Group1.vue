<script>
  import U from "@/U";
  import LeftNavGroup2 from "./NavigationLeft-Group2.vue";
  import NavigationLeftClickable from "./NavigationLeft-Clickable.vue";

  export default {
    components: { LeftNavGroup2, NavigationLeftClickable },
    props: {
      group1: { type: Object, default: () => null },
    },
    computed: {
      group2s: (c) => U.optArray(c.group1.groups),
      hasChildren: (c) => c.group2s.length > 0,

      isExpanded: (c) => c.group1.isExpanded(),
      isSelected: (c) => c.group1.isSelected(),
      isWide: (c) => c.group1.isWide(),

      style() {
        const style = {};

        if (this.isWide) {
          style["width"] = "100%";
          style["border-radius"] = "0.5rem";
          style["margin"] = "0";
          if (this.hasChildren) {
            style["border-radius"] = "0.5rem";
            style["width"] = "calc(100% - 1em)";
            style["margin"] = "0 0.5em";
          } else {
            style["gap"] = "0";
          }
        } else {
          if (!this.hasChildren) style["background"] = "none";
          if (!this.isSelected) {
            style["align-items"] = "center";
            style["justify-content"] = "center";
          }

          style["border-radius"] =
            this.hasChildren || !this.isSelected ? "0.5rem" : "0";
          style["width"] = this.isSelected ? "100%" : "min-content";
        }

        if (this.isSelected && this.hasChildren) {
          style["background"] = "white";
        }

        return style;
      },
      styleHeader() {
        const style = {};

        if (this.isWide) {
          if (this.isSelected) {
            style["border-radius"] = "0";
          }
        } else {
          style["border-radius"] = "0";
          if (this.hasChildren && this.isSelected) {
            style["width"] = "100%";
          }
        }
        if (this.hasChildren) {
          style["--primary-color"] = "#abbec9";
        }

        return style;
      },
      styleChildren() {
        const style = {};

        if (this.isWide && !this.hasChildren) {
          style["background"] = "none";
        }

        if (!this.isSelected) {
          style["background"] = "none";
          style["padding"] = "0.8em";
          style["display"] = "none";
        }

        if (!this.hasChildren || !this.isSelected) {
          style["display"] = "none";
        }

        return style;
      },
    },
  };
</script>

<template>
  <div :class="['LeftNavGroup1', 'transition']" :style="style">
    <NavigationLeftClickable
      class="LeftNavGroup1-header"
      :style="styleHeader"
      :item="group1"
      :href="`/${group1.key}`"
      :isSelectedDark="!hasChildren"
      :hasChildren="hasChildren"
      @click="() => group1.click()"
      @click-open="() => group1.clickExpand()"
    />

    <div
      class="LeftNavGroup1-children"
      v-if="hasChildren"
      :style="styleChildren"
    >
      <div
        class="LeftNavGroup1-sectionParent"
        v-for="(group2, index) in group2s"
        :key="group2.key"
      >
        <LeftNavGroup2 :group2="group2" />
        <div
          class="LeftNavGroup1-sectionParent-line"
          v-if="index < group2s.length - 1"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .LeftNavGroup1 {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .LeftNavGroup1-children {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      padding-top: 0.4em;
      padding-bottom: 0.4em;
      margin-inline: 0.4em;
      width: calc(100% - 0.8em);

      .LeftNavGroup1-sectionParent {
        display: flex;
        flex-direction: column;
        align-items: center;
        .LeftNavGroup1-sectionParent-line {
          width: calc(100% - 1.2rem);
          min-height: 1px;
          background: var(--primary-color);
          opacity: 0.2;
          margin: 0.8rem 0;
        }
      }
    }
  }
</style>
