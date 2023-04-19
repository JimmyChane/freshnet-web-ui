<script>
   import CustomerModule from "@/items/data/Customer.js";
   import WindowAction from "@/components/window/WindowAction.vue";
   import Selector3 from "@/components/selector/Selector3.vue";
   import WindowSection from "./WindowSection.vue";
   import SpecificationInputs from "./SpecificationInputs.vue";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: {
         WindowAction,
         WindowSection,
         Selector3,
         SpecificationInputs,
         TextArea,
      },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         isShowing: { type: Boolean, default: false },
         item: { type: Object, default: () => null },
      },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,
         categoryMenus: (c) =>
            [
               { key: "none", title: "None" },
               ...c.categoryStore.getters.items.map((item) => item),
            ].map((item) => ({
               key: item.key,
               title: item.title,
               icon: item.icon ? item.icon.toUrl() : "",
            })),

         dataSpecifications: (c) => c.data.specifications,
      },
      watch: {
         isShowing() {
            if (!this.isShowing) {
               return;
            }
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

            this.data = {
               description: "",
               categoryKey: "none",
               serialNumber: "",
               specifications: [],
            };

            this.bindData();
         },
         bindData() {
            this.categoryStore.dispatch("getItems");
            this.specificationStore.dispatch("getItems");
         },

         clickOk() {
            this.data.ownerCustomerId = this.item ? this.item.id : "";
            this.data.description = this.data.description.trim();
            this.data.categoryKey = this.data.categoryKey.trim();
            this.data.serialNumber = this.data.serialNumber.trim();
            this.data.specifications.map((specification) => {
               specification.typeKey = specification.typeKey.trim();
               specification.content = specification.content.trim();
               return specification;
            });

            if (this.data.categoryKey === "none") {
               this.store.dispatch("snackbarShow", "Category is Required");
            } else {
               this.customerStore
                  .dispatch("addDevice", this.data)
                  .then((item) => {
                     this.$emit("click-ok", { item });
                     this.resetDataOnDelay(700);
                  })
                  .catch((error) => {
                     console.error(error);
                     this.store.dispatch("snackbarShow", "Error Adding Device");
                  });
            }
         },
      },
   };
</script>

<template>
   <WindowAction
      class="WindowAddDevice"
      :title="`Add New Device${item ? ` for ${item.name}` : ''}`"
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
      <div class="WindowAddDevice-body">
         <TextArea
            class="WindowAddDevice-description"
            ref="Description"
            type="text"
            label="Description"
            :bindValue="data.description"
            @input="(comp) => (data.description = comp.value)"
         />

         <WindowSection title="Category" :isRequired="true">
            <Selector3
               :menus="categoryMenus"
               :selectedKey="this.data.categoryKey"
               @click-menu="(menu) => (this.data.categoryKey = menu.key)"
            />
         </WindowSection>

         <WindowSection title="Specification">
            <SpecificationInputs :items="dataSpecifications" />
         </WindowSection>
      </div>
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowAddDevice {
      width: 100%;
      .WindowAddDevice-body {
         width: 40rem;
         max-width: 100%;
         max-height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         align-items: stretch;
         gap: 2rem;
         .WindowAddDevice-description {
            height: 7rem;
         }
      }
   }
</style>
