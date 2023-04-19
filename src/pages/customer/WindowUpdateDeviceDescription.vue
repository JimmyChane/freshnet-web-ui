<script>
   import WindowAction from "@/components/window/WindowAction.vue";
   import WindowSection from "./WindowSection.vue";
   import CustomerModule from "@/items/data/Customer.js";
   import ItemSpecification from "./ItemSpecification.vue";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: { WindowAction, WindowSection, ItemSpecification, TextArea },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         isShowing: { type: Boolean, default: false },
         customer: { type: Object, default: null },
         device: { type: Object, default: () => null },
      },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,

         specifications: (c) => {
            const specifications = c.device ? c.device.specifications : [];
            return Array.isArray(specifications) ? specifications : [];
         },
      },
      watch: {
         isShowing() {
            if (!this.isShowing) return;
            const { Description } = this.$refs;
            if (Description) Description.focus();
         },
         device() {
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
            if (this.device) {
               const { description } = this.device;
               this.data.description = description;
            }
         },

         clickOk() {
            this.data.description = this.data.description.trim();
            this.customerStore
               .dispatch("updateDeviceDescription", {
                  _id: this.device.id,
                  description: this.data.description,
               })
               .then((device) => {
                  this.$emit("click-ok", { device });
                  this.resetDataOnDelay(700);
               });
         },
      },
   };
</script>

<template>
   <WindowAction
      class="WindowUpdateDeviceDescription"
      :title="`Update Device Description${customer ? ` for ${customer.name}` : ''}`"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="() => $emit('click-dismiss')"
      @click-cancel="
         () => {
            $emit('click-cancel');
            resetDataOnDelay(700);
         }
      "
      @click-ok="() => clickOk()"
   >
      <div class="WindowUpdateDeviceDescription-body">
         <div
            class="WindowUpdateDeviceDescription-specification"
            v-if="specifications.length"
         >
            <ItemSpecification
               v-for="specification of specifications"
               :key="`${specification.typeKey}${specification.content}`"
               :item="specification"
            />
         </div>

         <TextArea
            class="WindowUpdateDeviceDescription-description"
            ref="Description"
            type="text"
            label="Description"
            :bindValue="data.description"
            @input="(comp) => (data.description = comp.value)"
         />
      </div>
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateDeviceDescription-reuse-input {
      font-size: 1rem;
      border: none;
      background: hsla(0, 0%, 0%, 0.03);
      border-bottom: 1px solid hsl(0, 0%, 70%);
      border-radius: 0.2rem;
      padding: 0.2rem 0.4rem;
   }

   .WindowUpdateDeviceDescription {
      width: 100%;
      height: 100%;
      .WindowUpdateDeviceDescription-body {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 40px;

         .WindowUpdateDeviceDescription-specification {
            width: 100%;
            line-height: 1.1;
            font-size: 0.9rem;
            gap: 0.2rem;
            display: flex;
            flex-direction: column;
            padding: var(--padding);
            opacity: 0.4;
         }
         .WindowUpdateDeviceDescription-description {
            height: 6rem;
         }
      }
   }
</style>
