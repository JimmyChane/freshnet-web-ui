<script>
  import ButtonOption2 from "@/components/button/ButtonOption2.vue";
  import { format } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started

  export default {
    components: { ButtonOption2 },
    props: { item: { type: Object, default: null } },
    emits: ["callback-delete"],
    data() {
      return { nameOfUser: "loading...", isHovered: false, menuMode: "" };
    },
    computed: {
      timestampText() {
        if (!this.item.timestamp) return "";
        return format(this.item.timestamp.time, "hh:mmaaa");
      },

      description: (c) => c.item.description,
      methodPrimaryColor() {
        if (this.item.isInfo()) return "#0771d2"; // blue
        if (this.item.isQuotation()) return "#961d96"; // purple
        if (this.item.isPurchase()) return "#258915"; // green
        return "";
      },
      methodTitle() {
        if (this.item.isInfo()) return "Info";
        if (this.item.isQuotation()) return "Quotation";
        if (this.item.isPurchase()) return "Purchase";
        return "";
      },
      methodResult: (c) => {
        const result = c.item.toResult();
        return result ? result : "";
      },

      menuDirection: () => ButtonOption2.Directions.Left,
      isShowingMenu() {
        return (
          this.isHovered || this.menuMode === ButtonOption2.Visibility.Show
        );
      },
    },
    watch: {
      item() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        const { item } = this;

        if (!item) return (this.nameOfUser = "");

        const name = await this.item.fetchName().catch((error) => {
          this.$root.feedback("Error getting user for event");
          return "";
        });

        if (this.item !== item) return;
        if (name) this.nameOfUser = name;
      },
    },
  };
</script>

<template>
  <div
    class="ItemEvent"
    :style="{ '--primary-color': methodPrimaryColor, '--opacity': '1' }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="ItemEvent-left">
      <div class="ItemEvent-colorbar"></div>

      <div class="ItemEvent-middle">
        <span class="ItemEvent-description">{{ description }}</span>
        <div class="ItemEvent-header">
          <span class="ItemService-timestamp">{{ timestampText }}</span>
          <div
            class="ItemService-header-dot"
            v-if="timestampText && nameOfUser"
          ></div>
          <span class="ItemEvent-user" v-if="nameOfUser">{{ nameOfUser }}</span>
        </div>
      </div>
    </div>

    <div class="ItemEvent-right">
      <span
        class="ItemEvent-result"
        :style="{
          'z-index': isShowingMenu ? '1' : '2',
          'margin-right': isShowingMenu ? '0' : '-3.3rem',
        }"
        v-if="methodResult"
        >{{ methodResult }}</span
      >

      <ButtonOption2
        class="ItemEvent-menu"
        :style="{
          'z-index': isShowingMenu ? '100' : '1',
          'opacity': isShowingMenu ? '1' : '0',
        }"
        :menus="[
          {
            key: 'delete',
            title: 'Delete',
            icon: host.res('icon/page/service/rejected-color.svg'),
            click: () => $emit('callback-delete', item),
          },
        ]"
        :direction="menuDirection"
        @visibility-change="(mode) => (menuMode = mode)"
      >
        <img
          class="ItemEvent-menu-icon"
          :src="host.res('icon/option-black.svg')"
        />
      </ButtonOption2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ItemEvent {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    background-color: hsla(0, 0%, 100%, 0.6);
    border-radius: var(--border-radius);
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);

    .ItemEvent-left {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      flex-grow: 1;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      overflow: hidden;
      .ItemEvent-colorbar {
        background-color: var(--primary-color);
        height: 100%;
        width: 3px;
      }
      .ItemEvent-middle {
        padding: 0.6rem;
        gap: 0.2rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;

        .ItemEvent-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 0.5rem;
          font-size: 0.6rem;
          & > * {
            min-width: max-content;
            width: max-content;
          }
          .ItemService-header-dot {
            width: 3px;
            height: 3px;
            background: hsla(0, 0%, 0%, 0.5);
            border-radius: 50%;
          }
        }

        .ItemEvent-description {
          width: 100%;
          line-height: 1.1;
          font-size: 1rem;
          font-weight: 600;
          white-space: pre-line;
        }
      }
    }
    .ItemEvent-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0.4rem 0.8rem;
      gap: 0.8rem;
      border-radius: 0 var(--border-radius) var(--border-radius) 0;

      .ItemEvent-result {
        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--primary-color);
        color: white;
        text-align: center;
        font-size: 0.8rem;
        padding: 0.4rem;
        border-radius: 0.3rem;
        transition: var(--transition-duration);
      }

      .ItemEvent-menu {
        border-radius: 50%;
        .ItemEvent-menu-icon {
          z-index: 0;
          width: 1.2em;
          height: 1.2em;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
