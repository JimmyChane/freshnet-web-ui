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
      phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
      isPhoneNumber: (c) => !!c.phoneNumberStr,
    },
  };
</script>

<template>
  <div class="PanelItem-Customer">
    <div class="PanelItem-Customer-data">
      <span class="PanelItem-Customer-name" v-if="name.length">{{ name }}</span>
      <span
        class="PanelItem-Customer-phoneNumber"
        v-if="phoneNumberStr.length"
        >{{ phoneNumberStr }}</span
      >
    </div>

    <ButtonIcon
      :isEditable="`${isEditable}`"
      class="PanelItem-Customer-edit transition"
      :src="host.icon('edit-505050')"
      @click="() => $emit('click-edit', customer)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PanelItem-Customer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    text-align: start;

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
    .PanelItem-Customer-edit[isEditable="false"] {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
