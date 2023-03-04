<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import BelongingListEdit from "./BelongingListEdit.vue";

   export default {
      components: { PopupWindowAction, BelongingListEdit },
      emits: ["callback-cancel", "callback-change"],
      props: {
         isShowing: { type: Boolean, default: false },
         values: { type: Array, default: () => [] },
      },
      methods: {
         onChange() {
            const belongings = this.$refs.BelongingListEdit.getResults();
            this.$emit("callback-change", belongings);
         },
         focus() {
            this.$refs.BelongingListEdit.focus();
         },
      },
   };
</script>

<template>
   <PopupWindowAction
      title="Edit Belongings"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="onChange"
      @click-cancel="$emit('callback-cancel')"
      @click-dismiss="() => $emit('callback-dismiss')"
   >
      <BelongingListEdit
         class="WindowBelongings-list"
         :values="values"
         ref="BelongingListEdit"
      />
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowBelongings-list {
      width: 35rem;
      max-width: 100%;
   }
</style>
