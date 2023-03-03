<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import SpecificationInputs from "@/pages/customer/SpecificationInputs.vue";
   import SpecificationModule from "@/items/data/CustomerDeviceSpecification.js";

   export default {
      components: { PopupWindowAction, SpecificationInputs },
      props: {
         isShowing: { type: Boolean, default: false },
         input: { type: Object, default: () => null },
      },
      data: (c) => ({ data: null }),
      computed: {
         product: (c) => (c.input ? c.input.product : null),
         inputSpecifications: (c) =>
            c.input && Array.isArray(c.input.specifications)
               ? c.input.specifications
               : [],
         specifications: (c) => (c.data ? c.data.specifications : []),
      },
      watch: {
         input() {
            this.clear();

            this.data.specifications = this.inputSpecifications
               .map((specification) => {
                  specification.typeKey = specification.type
                     ? specification.type.key
                     : "";
                  return specification;
               })
               .map((specification) => SpecificationModule.trim(specification));
         },
      },
      methods: {
         clear() {
            this.data = { specifications: [] };
         },

         clickConfirm() {
            let output = {
               product: this.product,
               specifications: this.specifications,
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
      class="WindowUpdateSpecifications"
      title="Update Specifications"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss') && clear()"
      @click-cancel="$emit('click-cancel') && clear()"
      @click-ok="clickConfirm()"
   >
      <div class="WindowUpdateSpecifications-body">
         <SpecificationInputs :items="specifications" />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateSpecifications-body {
      width: 40rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      .WindowUpdateSpecifications-section {
         width: 100%;
         display: flex;
         flex-direction: column;
         gap: 20px;
         .WindowUpdateSpecifications-inputText {
            flex-grow: 1;
            font-size: 1rem;
            border: none;
            border-bottom: 1px solid hsl(0, 0%, 70%);
            background: none;
            padding: 4px 0;
         }
         .WindowUpdateSpecifications-required {
            color: hsl(0, 50%, 50%);
            font-size: 0.8rem;
         }
      }
   }
</style>
