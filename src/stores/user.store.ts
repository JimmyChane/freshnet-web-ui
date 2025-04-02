import { optArray } from '@chanzor/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getUserList } from '@/entity/api/User';
import { User } from '@/entity/model/User';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

import { useLoginStore } from './login.store';

export const useUserStore = defineStore('user', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const user = await useLoginStore().getUser();
      if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();

      const api = await getUserList();
      const content = optArray(api.optArrayContent());
      return content.map((data) => new User().fromData(data));
    });

  const processor = ref(new Processor());
  const list = ref(new List<User>());

  async function refresh() {
    dataLoader.doTimeout();
    await getUsers();
  }
  async function getUsers() {
    return await dataLoader.data();
  }
  async function getUserByUsername(username: string) {
    const users: User[] = await getUsers();
    return users.find((user) => user.username === username);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getUsers,
    getUserByUsername,
  };
});
