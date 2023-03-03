<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import TextArea from "@/components/InputTextArea.vue";
   export default {
      components: { PopupWindowAction, TextArea },
      props: {
         isShowing: { type: Boolean, default: false },
         input: { type: Object, default: () => null },
         action: { type: Object, default: null },
      },
      data: (c) => ({ data: null }),
      computed: {
         product: (c) => (c.input ? c.input.product : ""),
         description: (c) => (c.data ? c.data.description : ""),
      },
      watch: {
         input() {
            if (!this.input) {
               this.data = null;
               return;
            }

            this.data = {
               description: this.input.description,
            };
         },
      },
      methods: {
         clear() {
            this.data = { description: "" };
         },

         clickConfirm() {
            let output = {
               product: this.product,
               description: this.description,
            };

            this.$emit("click-confirm", output) && this.clear();
         },
      },
      mounted() {
         this.clear();
      },
   };
</script>

<template>
   <PopupWindowAction
      class="WindowUpdateDescription"
      title="Update Description"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss') && clear()"
      @click-cancel="$emit('click-cancel') && clear()"
      @click-ok="clickConfirm()"
   >
      <div class="WindowUpdateDescription-body">
         <TextArea
            type="text"
            label="Description"
            :bindValue="description"
            :isRequired="true"
            @input="(comp) => (data.description = comp.value)"
         />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateDescription-body {
      width: 26rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      & > * {
         background: hsla(0, 0%, 0%, 0.03);
         height: 18rem;
      }
   }
</style>
