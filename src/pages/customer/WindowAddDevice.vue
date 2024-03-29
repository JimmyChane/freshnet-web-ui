<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import Customer from "@/items/Customer";
   import Selector3 from "@/components/selector/Selector3.vue";
   import WindowSection from "./WindowSection.vue";
   import SpecificationInputs from "./SpecificationInputs.vue";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: {
         PanelAction,
         WindowSection,
         Selector3,
         SpecificationInputs,
         TextArea,
      },
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({
         Requirement: Customer.Requirement,
         data: {
            description: "",
            categoryKey: "none",
            serialNumber: "",
            specifications: [],
         },
      }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         item: (c) => c.popupWindow.item,
         isLoading: (c) => c.$store.state.stores.customer.getters.isLoading,
         isClickable: (c) => !c.$store.state.stores.customer.getters.isLoading,
         categoryMenus: (c) =>
            [
               { key: "none", title: "None" },
               ...c.$store.state.stores.category.getters.items.map((item) => item),
            ].map((item) => ({
               key: item.key,
               title: item.title,
               icon: item.icon?.toUrl() ?? "",
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
      mounted() {
         this.bindData();
      },
      methods: {
         bindData() {
            this.$store.state.stores.category.dispatch("getItems");
            this.$store.state.stores.specification.dispatch("getItems");
         },

         clickOk() {
            this.data.ownerCustomerId = this.item?.id ?? "";
            this.data.description = this.data.description.trim();
            this.data.categoryKey = this.data.categoryKey.trim();
            this.data.serialNumber = this.data.serialNumber.trim();
            this.data.specifications.map((specification) => {
               specification.typeKey = specification.typeKey.trim();
               specification.content = specification.content.trim();
               return specification;
            });

            if (this.data.categoryKey === "none") {
               this.$store.dispatch("snackbarShow", "Category is Required");
            } else {
               this.$store.state.stores.customer
                  .dispatch("addDevice", this.data)
                  .then((item) => this.popupWindow.close())
                  .catch((error) => {
                     console.error(error);
                     this.$store.dispatch("snackbarShow", "Error Adding Device");
                  });
            }
         },
      },
   };
</script>

<template>
   <PanelAction
      class="WindowAddDevice"
      :title="`Add New Device${item ? ` for ${item.name}` : ''}`"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
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
               :selectedKey="data.categoryKey"
               @click-menu="(menu) => (data.categoryKey = menu.key)"
            />
         </WindowSection>

         <WindowSection title="Specification">
            <SpecificationInputs :items="dataSpecifications" />
         </WindowSection>
      </div>
   </PanelAction>
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
