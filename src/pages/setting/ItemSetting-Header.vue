<script>
   export default {
      props: {
         title: { type: String, default: "" },
         actions: { type: Array, default: () => [] },
      },
   };
</script>

<template>
   <div class="ItemSetting-header" v-if="title.length || actions.length">
      <span class="ItemSetting-header-title" v-if="title.length">{{ title }}</span>

      <div class="ItemSetting-header-actions" v-if="actions.length">
         <button
            class="transition"
            v-for="action of actions"
            :key="action.title"
            @click="action.click"
         >
            <img class="transition" :src="action.icon" />
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting-header {
      width: 100%;
      padding: 0.5rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;

      background-color: hsla(0, 0%, 100%, 0.6);

      .ItemSetting-header-title {
         font-weight: 600;
         text-align: start;
         padding: 0.5rem;
      }
      .ItemSetting-header-actions {
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         flex-grow: 1;
         align-items: center;
         justify-content: flex-end;

         & > * {
            display: flex;

            background: none;
            border: none;
            cursor: pointer;
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
            }
         }
      }
   }
</style>
