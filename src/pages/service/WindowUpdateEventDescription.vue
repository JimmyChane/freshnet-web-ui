<script>
import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, TextArea },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({ description: '' }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    service: (c) => c.popupWindow.service,
    serviceEvent: (c) => c.popupWindow.serviceEvent,
  },
  methods: {
    onChange() {
      const { description } = this;
      if (description === this.serviceEvent.description) {
        this.$store.dispatch('snackbarShow', 'No changes were made');
        return;
      }

      this.$store.state.stores.service
        .dispatch('updateEventDescription', {
          serviceID: this.service.id,
          time: this.serviceEvent.timestamp.time,
          description,
        })
        .then(() => {
          this.popupWindow.close();
        });
    },

    focus() {
      this.$refs.Input.focus();
    },
  },
  mounted() {
    this.focus();
    this.description = this.serviceEvent.description;
  },
};
</script>

<template>
  <PanelAction
    title="Edit Event Description"
    :isShowing="isShowing"
    :isLoading="$store.state.stores.service.getters.isFetching"
    :isClickable="!$store.state.stores.service.getters.isFetching"
    @click-ok="() => onChange()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowDescription-main">
      <TextArea
        ref="Input"
        type="text"
        label="Description"
        :isRequired="true"
        :bindValue="description"
        @input="(comp) => (description = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowDescription-main {
  width: 35rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > * {
    height: 7rem;
    background: hsla(0, 0%, 0%, 0.03);
    padding: 0.6rem 0.4rem;
  }
}
</style>
