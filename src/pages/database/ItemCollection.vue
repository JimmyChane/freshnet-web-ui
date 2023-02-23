<script>
   import ButtonIconText from "@/components/button/ButtonIconText.vue";
   import ItemObject from "./ItemObject.vue";

   export default {
      components: { ButtonIconText, ItemObject },
      props: {
         collection: { type: Object, default: () => null },
         isExpand: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <div class="ItemCollection">
      <div class="ItemCollection-header transition">
         <span class="ItemCollection-title">{{ collection.name }}</span>

         <ButtonIconText
            :src="
               isExpand
                  ? host.res('page/database/minus-black.svg')
                  : host.res('page/database/plus-black.svg')
            "
            :text="isExpand ? 'Collapse' : 'Expand'"
            @click="$emit('click-expand')"
         />
      </div>

      <div class="ItemCollection-body" v-if="isExpand">
         <ItemObject
            v-for="document in collection.documents"
            :key="document._id"
            :item="document"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemCollection {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      .ItemCollection-header {
         width: 100%;
         display: flex;
         flex-direction: row;
         align-items: center;
         gap: 0.2rem;
         padding-bottom: 0.3rem;
         border-width: 0 0 2px 0;
         border-style: solid;
         border-color: transparent;
         &:hover {
            border-color: hsla(0, 0%, 0%, 0.2);
         }
         .ItemCollection-title {
            flex-grow: 1;
            font-size: 1rem;
            color: hsl(0, 0%, 20%);
         }
      }
      .ItemCollection-body {
         width: 100%;
         display: flex;
         flex-direction: column;
         gap: 0.4rem;

         background: hsla(0, 0%, 0%, 0.025);
         border-left: 2px solid hsla(0, 0%, 0%, 0.2);
         border-radius: 0 0.2rem 0.2rem 0;
         padding: 1rem;
         padding-right: 0.4rem;
      }
   }
</style>
