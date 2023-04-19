<script>
   import WindowAction from "@/components/window/WindowAction.vue";
   import WindowSection from "./WindowSection.vue";
   import TextArea from "@/components/InputTextArea.vue";
   import CustomerModule from "@/items/data/Customer.js";

   export default {
      components: { WindowAction, WindowSection, TextArea },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         isShowing: { type: Boolean, default: false },
         item: { type: Object, default: () => null },
      },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,
      },
      watch: {
         isShowing() {
            if (!this.isShowing) return;
            const { Description } = this.$refs;
            if (Description) Description.focus();
         },
         item() {
            this.bindData();
         },
      },
      created() {
         this.resetData();
      },
      mounted() {
         this.resetData();
      },
      methods: {
         resetData() {
            this.resetDataOnDelay(0);
         },
         resetDataOnDelay(delay = 0) {
            if (delay) {
               setTimeout(() => this.resetDataOnDelay(0), delay);
               return;
            }

            this.data = { description: "" };

            this.bindData();
         },
         bindData() {
            if (this.item) {
               const { description } = this.item;
               this.data.description = description;
            }
         },

         clickOk() {
            this.data.description = this.data.description.trim();

            if (this.Requirement.description.isRequired && !this.data.description) {
               this.store.dispatch("snackbarShow", 'You must specify the "Description"');
            } else {
               this.customerStore
                  .dispatch("updateDescriptionOfId", {
                     _id: this.item.id,
                     description: this.data.description,
                  })
                  .then((item) => {
                     this.$emit("click-ok", { item });
                     this.resetDataOnDelay(700);
                  });
            }
         },
      },
   };
</script>

<template>
   <WindowAction
      class="WindowUpdateDescription"
      :title="`Update Description${item ? ` for ${item.name}` : ''}`"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="
         $emit('click-cancel');
         resetDataOnDelay(700);
      "
      @click-ok="clickOk()"
   >
      <TextArea
         class="WindowUpdateDescription-description"
         ref="Description"
         type="text"
         label="Description"
         :bindValue="data.description"
         @input="(comp) => (data.description = comp.value)"
      />
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateDescription {
      width: 100%;
      height: 100%;
      .WindowUpdateDescription-description {
         width: 35rem;
         max-width: 100%;
         height: 6rem;
      }
   }
</style>
