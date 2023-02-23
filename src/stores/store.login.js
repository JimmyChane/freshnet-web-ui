import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import ItemUser from "../items/User.js";
import Processor from "./tools/Processor.js";

const storageTokenKey = "userToken";
const getToken = () => window.localStorage.getItem(storageTokenKey);
const setToken = (token) => window.localStorage.setItem(storageTokenKey, token);
const deleteToken = () => window.localStorage.removeItem(storageTokenKey);
const onNewCredentail = (context, arg = { token, user }, Stores) => {
   const { token, user } = arg;
   const newUser = new ItemUser(Stores).fromData(user);
   setToken(token);
   context.commit("user", newUser);
   context.commit("lastModified", Date.now());
   return newUser;
};
const noneUser = new ItemUser().fromData({
   username: "",
   name: "",
   userType: ItemUser.Type.None,
});

const requestLogin = async (body) => {
   return HostApi.request().POST().url("session/login/").body(body).send();
};
const requestUser = async (token) => {
   return HostApi.request().POST().url("session/verifyToken/").body({ token }).send();
};
const requestUpdatePassword = async (username, passwordVerify, passwordNew) => {
   return HostApi.request()
      .POST()
      .url(`session/user/${username}/changePassword`)
      .body({ passwordVerify, passwordNew })
      .send();
};

const init = (Stores) => {
   const { store } = Stores;

   const loginStore = new Vuex.Store({
      state: {
         lastModified: Date.now(),
         user: noneUser,
         loader: new Processor(),
      },
      mutations: {
         lastModified: (state, time) => (state.lastModified = time),
         user: (state, user) => (state.user = user),
      },
      getters: {
         lastModified: (state) => state.lastModified,
         isLoading: (state) => state.loader.isLoading(),
         user: (state) => state.user,
         token: () => getToken(),
      },
      actions: {
         refresh: async (context) => {
            return context.state.loader.acquire("refresh", async () => {
               await context.dispatch("getUser");
            });
         },
         login: async (context, arg = { username, password }) => {
            return context.state.loader.acquire("login", async () => {
               try {
                  deleteToken();
                  const api = await requestLogin({
                     username: arg.username,
                     password: arg.password,
                  });
                  const error = api.getError();
                  const content = api.getContent();
                  if (error || !content) throw new Error();
                  const { token, user } = content;
                  const newUser = onNewCredentail(context, { token, user }, Stores);
                  store.dispatch("restartSocket");
                  return newUser;
               } catch (error) {
                  deleteToken();
                  context.commit("user", noneUser);
                  context.commit("lastModified", Date.now());
                  throw error;
               }
            });
         },
         logout: async (context) => {
            return context.state.loader.acquire("logout", async () => {
               try {
                  deleteToken();
                  store.dispatch("restartSocket");
                  let user = context.getters.user;
                  context.commit("user", noneUser);
                  context.commit("lastModified", Date.now());
                  return context.state.user;
               } catch (error) {
                  deleteToken();
                  context.commit("user", noneUser);
                  context.commit("lastModified", Date.now());
                  throw error;
               }
            });
         },

         getUser: async (context) => {
            return context.state.loader.acquire("getUser", async () => {
               try {
                  const token = getToken();
                  if (!token) {
                     if (context.state.user !== noneUser) {
                        context.commit("user", noneUser);
                        context.commit("lastModified", Date.now());
                     }
                     deleteToken();
                     return context.state.user;
                  }

                  const api = await requestUser(token);
                  const content = api.getContent();
                  const user = new ItemUser().fromData(content.user);

                  const userNow = context.state.user;
                  if (userNow) {
                     const isUsernameSame = userNow.username === user.username;
                     const isNameSame = userNow.name === user.name;
                     const isUserTypeSame = userNow.userType === user.userType;
                     if (isUsernameSame && isNameSame && isUserTypeSame) {
                        return userNow;
                     }
                  }

                  setToken(token);
                  context.commit("user", user);
                  context.commit("lastModified", Date.now());

                  return user;
               } catch (error) {
                  if (error.message === "not signed in") {
                     if (context.state.user !== noneUser) {
                        context.commit("user", noneUser);
                        context.commit("lastModified", Date.now());
                     }
                     deleteToken();
                     return context.state.user;
                  }
                  throw error;
               }
            });
         },
         changePassword: async (context, arg = {}) => {
            return context.state.loader.acquire("changePassword", async () => {
               const { user } = context.getters;
               if (!user || !user.username) {
                  throw new Error("cannot find username with current user");
               }
               const username = user.username;
               const { passwordVerify, passwordNew } = arg;
               const api = await requestUpdatePassword(
                  username,
                  passwordVerify,
                  passwordNew,
               );
               const content = api.getContent();
               const { token } = content;
               const outputUser = onNewCredentail(
                  context,
                  { token, user: content },
                  Stores,
               );
               store.dispatch("restartSocket");

               return outputUser;
            });
         },
      },
   });

   return loginStore;
};

export default { init };
