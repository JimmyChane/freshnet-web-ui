<script>
   import WindowAction from "@/components/window/WindowAction.vue";
   import Input from "@/components/Input.vue";
   import U from "@/U";

   export default {
      components: { WindowAction, Input },
      props: {
         isShowing: { type: Boolean, default: false },
         input: { type: Object, default: () => null },
      },
      computed: {
         product: (c) => c.input?.product ?? null,
      },
      data: (c) => ({ normal: "", promotion: "" }),
      watch: {
         input() {
            this.clear();

            if (!this.input) return;

            const { normal, promotion } = this.input.price;
            const { value: normalValue } = normal;
            const { value: promotionValue } = promotion;

            this.normal = normalValue === 0 ? "" : normalValue.toString();
            this.promotion =
               promotionValue === 0 ? "" : promotionValue.toString();
         },
      },
      methods: {
         clear() {
            this.normal = "";
            this.promotion = "";
         },

         clickConfirm() {
            let output = {
               product: this.product,
               price: {
                  normal: this.normal,
                  promotion: this.promotion,
               },
            };

            this.$emit("click-confirm", output) && this.clear();
         },
      },
   };
</script>

<template>
   <WindowAction
      title="Add Price"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss') && clear()"
      @click-cancel="$emit('click-cancel') && clear()"
      @click-ok="clickConfirm()"
   >
      <div class="WindowUpdatePrice-body">
         <Input
            label="Normal (RM)"
            :isRequired="true"
            :bindValue="normal"
            type="number"
            @input="(comp) => (normal = comp.value)"
         />
         <Input
            label="Promotion (RM)"
            :isRequired="true"
            :bindValue="promotion"
            type="number"
            @input="(comp) => (promotion = comp.value)"
         />
      </div>
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdatePrice-body {
      width: 26rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      & > * {
         padding-left: 0;
         padding-right: 0;
         background: hsla(0, 0%, 0%, 0.03);
      }
   }
</style>
