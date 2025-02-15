<script>
import { User } from '@/items/User';

import MenuOption from '@/components/button/MenuOption.vue';

import Row from './ItemUser-Row.vue';

export default {
  components: { MenuOption, Row },
  props: {
    item: { type: User },
    isEditable: { type: Boolean, default: false },
    isCurrentUser: { type: Boolean, default: false },
  },
};
</script>

<template>
  <div class="ItemUser" :isCurrentUser="`${isCurrentUser}`">
    <div class="ItemUser-body">
      <span>{{ item.name }}</span>

      <div class="ItemUser-content">
        <Row title="Username" :text="`@${item.username}`" />
        <Row title="User Type" :text="item.toTextUserType()" />
      </div>

      <span class="ItemUser-using" v-if="isCurrentUser">Currently Login</span>
    </div>

    <MenuOption
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

  background: white;
  padding: 1rem;
  border-radius: 1rem;

  .ItemUser-body {
    width: 100%;
    gap: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .ItemUser-content {
      display: flex;
      flex-direction: row;
      flex-direction: column;
      justify-content: center;
      font-size: 0.8rem;
      color: hsl(0, 0%, 30%);
      line-height: 1.2;
    }
    .ItemUser-using {
      font-size: 0.8rem;
    }
  }
}
.ItemUser[isCurrentUser='true'] {
  margin-bottom: 2rem;
}
</style>
