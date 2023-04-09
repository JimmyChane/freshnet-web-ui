<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   export default {
      components: { ButtonIcon },
      emits: ["click-edit"],
      props: {
         customer: { type: Object },
         isEditable: { type: Boolean, default: true },
      },
      computed: {
         name: (c) => c.customer.name,
         phoneNumber: (c) => c.customer.phoneNumber,
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         isPhoneNumber: (c) => !!c.phoneNumberStr,
      },
   };
</script>

<template>
   <div class="PanelItem-Customer">
      <div class="PanelItem-Customer-data">
         <span class="PanelItem-Customer-name" v-if="name.length">{{
            name
         }}</span>
         <span
            class="PanelItem-Customer-phoneNumber"
            v-if="phoneNumberStr.length"
            >{{ phoneNumberStr }}</span
         >
      </div>

      <ButtonIcon
         v-if="isEditable"
         class="PanelItem-Customer-edit"
         :src="host.icon('edit-505050')"
         @click="() => $emit('click-edit', customer)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PanelItem-Customer {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem;

      .PanelItem-Customer-data {
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: center;
         line-height: 1rem;

         .PanelItem-Customer-name {
            font-weight: 500;
         }
         .PanelItem-Customer-phoneNumber {
            font-size: 0.8em;
         }
      }
      .PanelItem-Customer-edit {
         font-size: 0.8rem;
      }
   }
</style>
