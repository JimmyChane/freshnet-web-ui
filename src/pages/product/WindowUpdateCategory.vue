<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import Selector4 from "@/components/selector/Selector4.vue";

   export default {
      components: { PanelAction, Selector4 },
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({ outputCategoryId: "" }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         input: (c) => c.popupWindow.input,
         product: (c) => c.input?.product ?? null,
         categoryId: (c) => c.input?.categoryId ?? "",
         categories: (c) => c.categoryStore.getters.items,
         items: (c) => [
            { key: "", title: "None" },
            ...c.categories.map((category) => {
               return {
                  key: category.id,
                  title: category.title,
                  icon: category.icon,
               };
            }),
         ],
         itemMenus: (c) =>
            c.items.map((item) => ({
               key: item.key,
               title: item.title,
               icon: item.icon?.toUrl() ?? "",
            })),
      },
      methods: {
         clickConfirm() {
            if (this.categoryId === this.outputCategoryId) {
               this.$store.dispatch("snackbarShow", "No Changes");
               return;
            }

            this.popupWindow.onConfirm({
               product: this.product,
               categoryId: this.outputCategoryId,
            });
         },
      },
      mounted() {
         this.outputCategoryId = this.categoryId;
      },
   };
</script>

<template>
   <PanelAction
      class="WindowUpdateCategory"
      title="Edit Category"
      :isShowing="isShowing"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => clickConfirm()"
   >
      <div class="WindowUpdateCategory-body">
         <Selector4
            :menus="itemMenus"
            :selectedKey="outputCategoryId"
            @click-menu="
               (menu) => {
                  let item = items.find(
                     (category) => category.key === menu.key,
                  );
                  outputCategoryId = item ? item.key : '';
               }
            "
         />
      </div>
   </PanelAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateCategory-body {
      width: 35rem;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
   }
</style>
