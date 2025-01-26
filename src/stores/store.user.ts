import Vuex from 'vuex';

import { optArray } from '@/U';
import { addUser, getUserList, removeUser, updateUser } from '@/request/User';

import { User, UserData } from '../items/User';
import { StoreBuilder } from './tools/StoreBuilder';

export const initUser = (Stores: any) => {
  const loginStore = Stores.login;

  const context = new StoreBuilder<User>()
    .onFetchItems(async () => {
      const user = await loginStore.dispatch('getUser');
      if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();

      const api = await getUserList();
      const content = optArray(api.optArrayContent());
      return content.map((data) => new User(Stores).fromData(data));
    })
    .onGetStore(() => Stores.user)
    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getUsers');
    })
    .action('getUsers', async (context) => {
      return await context.state.dataLoader.data();
    })
    .action('getUserByUsername', async (context, username = '') => {
      const users: User[] = await context.dispatch('getUsers');
      return users.find((user) => user.username === username);
    })
    .action(
      'updateTypeOfUserByUsername',
      async (context, arg: { username: string; userType: string }) => {
        try {
          const user = await loginStore.dispatch('getUser');

          if (!user.isTypeAdmin()) throw new Error();

          const { username, userType } = arg;
          const api = await updateUser(username, userType);
          const content = api.optObjectContent() as UserData;
          const userChange = new User(Stores).fromData(content);
          if (!userChange) throw new Error();
          context.state.list.updateItemById(userChange.username, (item) => {
            return userChange;
          });

          return userChange;
        } catch (error) {
          context.state.list.clear();
          throw error;
        }
      },
    )
    .action(
      'addUser',
      async (
        context,
        arg: {
          username: string;
          name: string;
          passwordNew: string;
          passwordRepeat: string;
        },
      ) => {
        const user: User = await loginStore.dispatch('getUser');

        if (!user.isTypeAdmin()) throw new Error();

        const api = await addUser(
          arg.username,
          arg.name,
          arg.passwordNew,
          arg.passwordRepeat,
        );
        const content = api.getObjectContent() as UserData;
        const newUser = new User(Stores).fromData(content);
        context.state.list.addItem(newUser);
        return newUser;
      },
    )
    .action(
      'removeUserByUsername',
      async (context, arg: { username: string }) => {
        const user = await loginStore.dispatch('getUser');

        if (!user.isTypeAdmin()) throw new Error();

        const api = await removeUser(arg.username);
        const content = api.getStringContent();
        if (content !== 'ok') throw new Error();
        context.state.list.removeItemById(arg.username);
        return true;
      },
    )
    .build();
  context.getters.token = () => loginStore.getters.token;

  return new Vuex.Store(context);
};
