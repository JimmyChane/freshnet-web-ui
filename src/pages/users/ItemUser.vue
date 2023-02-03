<script>
   import MenuButton from "@/components/button/MenuButton.vue";
   import User from "@/items/User";

   export default {
      components: { MenuButton },
      props: {
         item: { type: User },
         isEditable: { type: Boolean, default: false },
         isCurrentUser: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <div class="ItemUser">
      <div class="ItemUser-header">
         <span class="ItemUser-title">{{ item.name }}</span>
         <span class="ItemUser-using" v-if="isCurrentUser"
            >Currently Using</span
         >
      </div>
      <div class="ItemUser-content">
         <span class="ItemUser-username">{{ item.username }}</span>
         <span class="ItemUser-type">{{ item.toTextUserType() }}</span>
      </div>
      <MenuButton
         v-if="isEditable"
         :menus="[
            {
               key: 'changeUserType',
               title: 'Change User Type',
               interact: () => $emit('click-changeUserType', item),
            },
            {
               key: 'removeUser',
               title: 'Remove User',
               interact: () => $emit('click-remove', item),
            },
         ]"
      />
   </div>
</template>

<style lang="scss" scoped>
   .ItemUser {
      display: flex;
      flex-direction: column;
      flex-direction: row;
      align-items: stretch;
      column-gap: 2rem;

      background-color: white;
      padding: 1rem;
      border-radius: 1rem;

      .ItemUser-header {
         flex-grow: 1;
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: center;
         .ItemUser-title {
            font-size: 1rem;
         }
         .ItemUser-using {
            font-size: 0.8rem;
         }
      }
      .ItemUser-content {
         display: flex;
         flex-direction: row;
         flex-direction: column;
         justify-content: center;
         font-size: 0.8rem;
         color: hsl(0, 0%, 30%);
         line-height: 1.2;
      }
   }
</style>
