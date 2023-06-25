<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import BelongingListEdit from "./BelongingListEdit.vue";

   export default {
      components: { PanelAction, BelongingListEdit },
      props: {
         popupWindow: { type: Object },
      },
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         values: (c) => c.popupWindow.values,
      },
      methods: {
         onChange() {
            const belongings = this.$refs.BelongingListEdit.getResults();

            const accept = () => this.popupWindow.close();
            const reject = () => {};
            this.popupWindow.onConfirm(accept, reject, belongings);
         },
         focus() {
            this.$refs.BelongingListEdit.focus();
         },
      },
      mounted() {
         this.focus();
      },
   };
</script>

<template>
   <PanelAction
      title="Edit Belongings"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="() => onChange()"
      @click-cancel="() => popupWindow.close()"
      @click-dismiss="() => popupWindow.close()"
   >
      <BelongingListEdit
         class="WindowBelongings-list"
         :values="values"
         ref="BelongingListEdit"
      />
   </PanelAction>
</template>

<style lang="scss" scoped>
   .WindowBelongings-list {
      width: 35rem;
      max-width: 100%;
   }
</style>
