<script>
   import ItemSetting from "./ItemSetting.vue";
   export default {
      components: { ItemSetting },
      props: {
         group: { type: Object, default: () => null },
      },
      computed: {
         title() {
            if (typeof this.group.title !== "string") return "";
            return this.group.title;
         },
         actions() {
            if (!Array.isArray(this.group.actions)) return [];
            return this.group.actions;
         },
         items() {
            if (!Array.isArray(this.group.items)) return [];
            return this.group.items;
         },
      },
   };
</script>

<template>
   <div class="GroupSetting">
      <div class="GroupSetting-header">
         <span class="GroupSetting-title" v-if="title">{{ title }}</span>
         <div class="GroupSetting-actions" v-if="actions.length">
            <button v-for="action of actions" :key="action.title" @click="action.click">
               <img :src="action.icon" />
            </button>
         </div>
      </div>
      <div class="GroupSetting-settings" v-if="items.length">
         <ItemSetting v-for="item in items" :key="item.key" :item="item" />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .GroupSetting {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 0.2rem;
      border-radius: 0.5rem;
      overflow: hidden;

      .GroupSetting-header {
         width: 100%;
         padding: 0.8rem;

         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: space-between;

         background-color: hsla(0, 0%, 100%, 0.6);

         .GroupSetting-title {
            font-weight: 900;
            text-align: start;
            padding: 0.4rem 0;
         }
         .GroupSetting-actions {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            & > * {
               display: flex;

               background: none;
               border: none;
               cursor: pointer;
               transition: var(--animation-duration);
               border-radius: 50%;
               padding: 0.5rem;
               aspect-ratio: 1/1;
               &:hover {
                  background-color: hsla(0, 0%, 100%, 0.8);
               }
               &:focus {
                  img {
                     transform: scale(0.8);
                  }
               }
               img {
                  width: 1rem;
                  height: 1rem;
                  aspect-ratio: 1/1;
                  transition: var(--animation-duration);
               }
            }
         }
      }
      .GroupSetting-settings {
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: flex-start;
      }
   }
</style>
