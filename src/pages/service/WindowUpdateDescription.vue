<script>
   import WindowAction from "@/components/window/WindowAction.vue";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: { WindowAction, TextArea },
      emits: ["callback-cancel", "callback-change"],
      props: {
         isShowing: { type: Boolean, default: false },
         description: { type: String, default: "" },
      },
      data: (c) => ({ value: "" }),
      watch: {
         description() {
            this.value = this.description;
         },
      },
      methods: {
         onChange() {
            if (this.description === this.value) {
               this.store.dispatch("snackbarShow", "No Changes");
               return;
            }

            this.$emit("callback-change", this.value);
         },

         focus() {
            this.$refs.Input.focus();
         },
      },
   };
</script>

<template>
   <WindowAction
      title="Edit Description"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="onChange"
      @click-cancel="$emit('callback-cancel')"
      @click-dismiss="() => $emit('callback-dismiss')"
   >
      <div class="WindowDescription-main">
         <TextArea
            class="WindowDescription-input"
            ref="Input"
            type="text"
            label="Description"
            :isRequired="true"
            :bindValue="value"
            @input="(comp) => (value = comp.value)"
         />
      </div>
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowDescription-main {
      width: 35rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .WindowDescription-input {
         height: 7rem;
         background: hsla(0, 0%, 0%, 0.03);
         padding: 0.6rem 0.4rem;
      }
   }
</style>
