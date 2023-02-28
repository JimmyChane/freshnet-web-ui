import U from "@/U.js";
import Vuex from "vuex";
import ItemUser from "../items/User.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import UserRequest from "@/request/User";

const init = (Stores) => {
   const loginStore = Stores.login;

   const context = new StoreBuilder().onFetchItems(async () => {
      const user = await loginStore.dispatch("getUser");
      if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();
      return (await UserRequest.list())
         .optArrayContent()
         .map((data) => new ItemUser(Stores).fromData(data));
   });
   context.onGetStore(() => Stores.user);
   context.onIdProperty("username");
   context.build();
   context.getters.token = () => loginStore.getters.token;
   context.action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getUsers");
   });
   context.action("getUsers", async (context) => {
      return await context.state.dataLoader.data();
   });
   context.action("getUserByUsername", async (context, username = "") => {
      const users = await context.dispatch("getUsers");
      return users.find((user) => user.username === username);
   });
   context.action(
      "updateTypeOfUserByUsername",
      async (context, arg = { username, userType }) => {
         try {
            const user = await loginStore.dispatch("getUser");

            if (!user.isTypeAdmin()) throw new Error();

            const { username, userType } = arg;
            const api = await UserRequest.update(username, userType);
            const content = api.optObjectContent();
            const userChange = new ItemUser(Stores).fromData(content);
            if (!userChange) throw new Error();
            context.state.list.updateItemById(userChange.username, (item) => userChange);

            return userChange;
         } catch (error) {
            context.state.list.clear();
            throw error;
         }
      },
   );
   context.action(
      "addUser",
      async (context, arg = { username, name, passwordNew, passwordRepeat }) => {
         const user = await loginStore.dispatch("getUser");

         if (!user.isTypeAdmin()) throw new Error();

         const api = await UserRequest.add(
            arg.username,
            arg.name,
            arg.passwordNew,
            arg.passwordRepeat,
         );
         const content = api.getObjectContent();
         const newUser = new ItemUser(Stores).fromData(content);
         context.state.list.addItem(newUser);
         return newUser;
      },
   );
   context.action("removeUserByUsername", async (context, arg = { username }) => {
      const user = await loginStore.dispatch("getUser");

      if (!user.isTypeAdmin()) throw new Error();

      const api = await UserRequest.remove(arg.username);
      const content = api.getStringContent();
      if (content !== "ok") throw new Error();
      context.state.list.removeItemById(arg.username);
      return true;
   });

   return new Vuex.Store(context);
};

export default { init };
