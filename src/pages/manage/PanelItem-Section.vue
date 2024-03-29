<script>
  import { isArray, isObjectOnly } from "@/U";
  import ButtonIcon from "@/components/button/ButtonIcon.vue";

  export default {
    components: { ButtonIcon },
    props: {
      title: { type: String, default: "" },
      menus: { default: () => [] },
    },
    computed: {
      theMenus: (c) => {
        if (isArray(c.menus)) return c.menus;
        if (isObjectOnly(c.menus)) return [c.menus];
        return [];
      },

      hasTitle: (c) => c.title.length > 0,
      hasMenus: (c) => c.theMenus.length > 0,
    },
  };
</script>

<template>
  <div class="PanelItemSection">
    <div
      class="PanelItemSection-body"
      :isHorizontal="`${!hasTitle && hasMenus}`"
    >
      <div class="PanelItemSection-header" v-if="hasTitle || hasMenus">
        <div class="PanelItemSection-title" v-if="hasTitle">{{ title }}</div>

        <div class="PanelItemSection-menus" v-if="hasMenus">
          <ButtonIcon
            v-for="menu of theMenus"
            :key="menu.title"
            :src="menu.icon"
            @click="() => menu.click()"
          />
        </div>
      </div>

      <div class="PanelItemSection-main"><slot /></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelItemSection {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .PanelItemSection-body {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;

      background: hsla(0, 0%, 100%, 0.5);
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);

      .PanelItemSection-header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: flex-start;
        justify-content: space-between;
        min-height: 1.8rem;

        .PanelItemSection-title {
          text-align: start;
          font-weight: 600;
          flex-grow: 1;
          font-size: 0.9rem;
          color: black;
          padding: 1rem;
          padding-bottom: 0.4rem;
        }
        .PanelItemSection-menus {
          width: max-content;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          margin-top: 0.2rem;
          margin-right: 0.2rem;
        }
      }
      .PanelItemSection-main {
        width: 100%;
        padding: 1rem;
        padding-top: 0.4rem;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0.2rem;
      }
    }
    .PanelItemSection-body[isHorizontal="false"] {
      flex-direction: column;
      .PanelItemSection-header {
        width: 100%;
      }
    }
    .PanelItemSection-body[isHorizontal="true"] {
      flex-direction: row-reverse;
      .PanelItemSection-header {
        .PanelItemSection-menus {
          flex-direction: column;
          align-items: center;
        }
      }
      .PanelItemSection-main {
        flex-grow: 1;
        padding-top: 0.8rem;
      }
    }
  }
</style>
