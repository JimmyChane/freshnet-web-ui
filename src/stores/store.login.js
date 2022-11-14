import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
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

export default {
	init(Stores) {
		const { store } = Stores;

		const loginStore = new Vuex.Store({
			state: { lastModified: 0, user: null, loader: new Processor() },
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
				async refresh(context) {
					return context.state.loader.acquire("refresh", async () => {
						await context.dispatch("getUser");
					});
				},

				async getUser(context) {
					return context.state.loader.acquire("getUser", async () => {
						try {
							const token = getToken();
							if (!token) {
								context.commit("user", null);
								context.commit("lastModified", Date.now());
								deleteToken();
								return null;
							}

							const api = await ApiHost.request()
								.POST()
								.url("session/verifyToken/")
								.body({ token })
								.send();

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
								context.commit("user", null);
								context.commit("lastModified", Date.now());
								deleteToken();
								return null;
							}
							throw error;
						}
					});
				},
				async changePassword(context, arg = {}) {
					return context.state.loader.acquire("changePassword", async () => {
						let { user } = context.getters;
						if (!user || !user.username) {
							throw new Error("cannot find username with current user");
						}
						let username = user.username;
						let { passwordVerify, passwordNew } = arg;
						let api = await ApiHost.request()
							.POST()
							.url(`session/user/${username}/changePassword`)
							.body({ passwordVerify, passwordNew })
							.send();
						let content = api.getContent();
						let { token } = content;
						user = content;
						user = onNewCredentail(context, { token, user }, Stores);
						store.dispatch("restartSocket");

						return user;
					});
				},

				async login(context, arg = { username, password }) {
					return context.state.loader.acquire("login", async () => {
						try {
							deleteToken();
							let api = await ApiHost.request()
								.POST()
								.url("session/login/")
								.body({
									username: arg.username,
									password: arg.password,
								})
								.send();
							let error = api.getError();
							let content = api.getContent();
							if (error || !content) throw new Error();
							const { token, user } = content;
							const newUser = onNewCredentail(context, { token, user }, Stores);
							store.dispatch("restartSocket");
							return newUser;
						} catch (error) {
							deleteToken();
							context.commit("user", null);
							context.commit("lastModified", Date.now());
							throw error;
						}
					});
				},
				async logout(context) {
					return context.state.loader.acquire("logout", async () => {
						try {
							deleteToken();
							store.dispatch("restartSocket");
							let user = context.getters.user;
							context.commit("user", null);
							context.commit("lastModified", Date.now());
							return user;
						} catch (error) {
							deleteToken();
							context.commit("user", null);
							context.commit("lastModified", Date.now());
							throw error;
						}
					});
				},
			},
		});

		return loginStore;
	},
};