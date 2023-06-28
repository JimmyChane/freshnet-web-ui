<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: { PanelAction, TextArea },
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({ description: "" }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         service: (c) => c.popupWindow.service,
         serviceEvent: (c) => c.popupWindow.serviceEvent,
      },
      methods: {
         onChange() {
            const { description } = this;
            if (description === this.serviceEvent.description) {
               this.store.dispatch("snackbarShow", "No changes were made");
               return;
            }

            console.log({ description });
            return;

            const accept = () => this.popupWindow.close();
            const reject = () => {};
            this.popupWindow.onConfirm(accept, reject, this.description);
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
      title="Edit Description"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
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
