import U from "@/U.js";
import Vuex from "vuex";
import HostApi from "../host/HostApi.js";
import ItemUser from "../items/User.js";
import StoreBuilder from "./tools/StoreBuilder.js";

const requestList = async () => {
   return HostApi.request().url("users").send();
};
const requestAdd = async (username, name, passwordNew, passwordRepeat) => {
   return HostApi.request()
      .url("users/user")
      .POST()
      .body({ username, name, passwordNew, passwordRepeat })
      .send();
};
const requestRemove = async (username) => {
   return HostApi.request().DELETE().url("users/user").body({ username }).send();
};
const requestUpdate = async (username, userType) => {
   return HostApi.request().url("users/user").PUT().body({ username, userType }).send();
};

const init = (Stores) => {
   const loginStore = Stores.login;

   const context = new StoreBuilder().onFetchItems(async () => {
      const user = await loginStore.dispatch("getUser");
      if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();
      const api = await requestList();
      return U.optArray(api.getContent()).map((data) => {
         return new ItemUser(Stores).fromData(data);
      });
   });
   context.onGetStore(() => Stores.user);
   context.onIdProperty("username");
   context.build();
   context.getters.token = () => loginStore.getters.token;
   context.actions.refresh = async (context) => {
      return context.state.processor.acquire("refresh", async () => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getUsers");
      });
   };
   context.actions.getUsers = async (context) => {
      return context.state.processor.acquire("getUsers", async () => {
         return await context.state.dataLoader.data();
      });
   };
   context.actions.getUserByUsername = async (context, username = "") => {
      return context.state.processor.acquire("getUserByUsername", async () => {
         const users = await context.dispatch("getUsers");
         return users.find((user) => user.username === username);
      });
   };
   context.actions.updateTypeOfUserByUsername = async (
      context,
      arg = { username, userType },
   ) => {
      return context.state.processor.acquire("updateTypeOfUserByUsername", async () => {
         try {
            const user = await loginStore.dispatch("getUser");

            if (!user.isTypeAdmin()) throw new Error();

            const { username, userType } = arg;
            const api = await requestUpdate(username, userType);
            const content = api.getContent();
            const userChange = new ItemUser(Stores).fromData(content);
            if (!userChange) throw new Error();
            context.state.list.updateItemById(userChange.username, (item) => userChange);

            return userChange;
         } catch (error) {
            context.state.list.clear();
            throw error;
         }
      });
   };
   context.actions.addUser = async (
      context,
      arg = { username, name, passwordNew, passwordRepeat },
   ) => {
      return context.state.processor.acquire("addUser", async () => {
         const user = await loginStore.dispatch("getUser");

         if (!user.isTypeAdmin()) throw new Error();

         const api = await requestAdd(
            arg.username,
            arg.name,
            arg.passwordNew,
            arg.passwordRepeat,
         );

         const content = api.getContent();
         if (!content) throw new Error();
         const newUser = new ItemUser(Stores).fromData(content);
         context.state.list.addItem(newUser);
         return newUser;
      });
   };
   context.actions.removeUserByUsername = async (context, arg = { username }) => {
      return context.state.processor.acquire("removeUserByUsername", async () => {
         const user = await loginStore.dispatch("getUser");

         if (!user.isTypeAdmin()) throw new Error();

         const api = await requestRemove(arg.username);
         const content = api.getContent();
         if (content !== "ok") throw new Error();
         context.state.list.removeItemById(arg.username);
         return true;
      });
   };

   return new Vuex.Store(context);
};

export default { init };
