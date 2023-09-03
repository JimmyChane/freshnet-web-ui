<script>
  import Actionbar from "./PanelService-Actionbar.vue";
  import Selector from "@/components/selector/Selector.vue";

  import ButtonAddImage from "./ButtonAddImage.vue";
  import ButtonImage from "./ButtonImage.vue";
  import Section from "@/pages/manage/PanelItem-Section.vue";
  import AddEvent from "./PanelService-AddEvent.vue";
  import Events from "./PanelEvents.vue";

  import State from "@/items/ServiceState";

  import chroma from "chroma-js";

  import Service from "@/items/Service";

  export default {
    components: {
      Actionbar,
      Selector,
      ButtonAddImage,
      ButtonImage,
      AddEvent,
      Events,
      Section,
    },
    props: {
      service: { type: Service, default: () => null },
      actions: { type: Object, default: () => null },
    },
    data: (c) => ({ nameOfUser: "", scrollTop: 0, isActionbarExpand: false }),
    computed: {
      windowWidth: (c) => c.$store.getters.window.innerWidth,

      isWide: (c) => c.windowWidth > 600,

      isUrgent: (c) => c.service.isUrgent(),
      isWarranty: (c) => c.service.isWarranty(),

      events: (c) => c.service?.events,

      customer: (c) => c.service.customer,
      name: (c) => c.customer.name,
      phoneNumber: (c) => c.customer.phoneNumber,
      phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
      isPhoneNumber: (c) => !!c.phoneNumberStr,

      description: (c) => c.service.description,
      belongings: (c) => c.service.belongings.map((belonging) => belonging),
      imageFiles: (c) => c.service.imageFiles,

      primaryColor: (c) => c.stateColor,
      stateColor: (c) => {
        if (!c.service) return;

        const state = State.findByKey(c.service.state);
        return chroma(state?.primaryColor ?? "white");
      },
      backgroundColor() {
        const { primaryColor } = this;

        if (!primaryColor) {
          return chroma("white");
        }
        return primaryColor.mix("e6e6e6", 0.9);
      },
      actionbarColor() {
        const { backgroundColor } = this;
        if (!backgroundColor) {
          return "inherit";
        }
        return backgroundColor.brighten(0.4).toString();
      },
      actionbarBorder() {
        const { actionbarColor } = this;
        if (!actionbarColor || !chroma.valid(actionbarColor)) {
          return "none";
        }
        return chroma(actionbarColor).darken(0.8).toString();
      },
    },
    watch: {
      service() {
        this.invalidate();
      },
      events() {
        setTimeout(() => {
          this.scrollDown();
        }, 200);
      },
    },
    methods: {
      async invalidate() {
        this.isActionbarExpand = false;
        this.nameOfUser = await this.getOwnerNameFromItem();

        this.scrollDown();
      },
      scrollDown() {
        const { scroll, addEvent } = this.$refs;
        if (!scroll || !addEvent) return;

        const element = addEvent.$el;
        const rect = element.getBoundingClientRect();

        scroll.scrollTop = rect.bottom;
      },
      async getOwnerNameFromItem() {
        const { service } = this;

        if (!service) {
          return "";
        }

        const name = await service.fetchName().catch((error) => {
          this.$store.dispatch(
            "snackbarShow",
            "Error getting user for service",
          );
          return "";
        });

        if (service !== this.service) {
          return;
        }
        if (name.length) {
          return name;
        }

        return "unknown";
      },
      onImageAdd(imageFiles) {
        this.$store.state.stores.service
          .dispatch("addImageToId", {
            serviceID: this.service.id,
            imageFiles,
          })
          .then((serivce) => {})
          .catch((error) => {
            this.$store.dispatch("snackbarShow", "Failed to Add Image");
          });
      },

      clickDeleteServiceImage(imageFile) {
        this.actions.onClickRemoveImage(imageFile);
      },
      clickEditServiceDescription(description) {
        this.actions.onClickUpdateDescription(description);
      },
    },
    mounted() {
      this.invalidate();
    },
  };
</script>

<template>
  <div class="PanelService">
    <div
      class="PanelService-block"
      :style="{ 'z-index': '2', 'grid-area': 'block' }"
      :isActionbarExpand="`${isActionbarExpand}`"
      @click="() => (isActionbarExpand = !isActionbarExpand)"
    >
    </div>

    <div
      ref="scroll"
      class="PanelService-scroll"
      :style="{ '--primary-color': backgroundColor }"
      @scroll="(e) => (scrollTop = e.target.scrollTop)"
    >
      <Actionbar
        :style="{ 'z-index': '2', 'grid-area': 'actionbar' }"
        :service="service"
        :actionbarColor="actionbarColor"
        :actionbarBorder="actionbarBorder"
        :actions="actions"
        :isExpand="isActionbarExpand"
        @toggle-expand="(isExpand) => (isActionbarExpand = isExpand)"
      />

      <div class="PanelService-body" :style="{ 'z-index': '1' }">
        <Events
          :style="{ 'z-index': '1' }"
          :service="service"
          :actions="actions"
          @click-remove-event="
            (event) => actions.onClickRemoveEvent({ service, event })
          "
        />
        <AddEvent
          ref="addEvent"
          :style="{ 'z-index': '2' }"
          @click-submit="(event) => actions.onClickToAddEvent(event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelService {
    position: relative;
    overflow: hidden;

    width: 100dvw;
    height: 100%;
    max-width: 100%;
    min-width: 100%;

    display: flex;
  }

  .PanelService-block[isActionbarExpand="false"] {
    background: transparent;
    pointer-events: none;
  }
  .PanelService-block[isActionbarExpand="true"] {
    background: hsla(0, 0%, 0%, 0.4);
  }
  .PanelService-block {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 200ms cubic-bezier(1, 0, 0, 1);
  }

  .PanelService-scroll {
    width: 100%;
    min-height: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    line-height: 1.2;
    overflow-y: auto;

    background: var(--primary-color);

    .PanelService-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-end;
      flex-grow: 1;
    }
  }
</style>
