import Vuex from "vuex";
import ApiHost from "../host/ApiHost.js";
import ItemUser from "../items/User.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

export default {
	init(Stores) {
		const loginStore = Stores.login;

		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 5 }) // 5sec
					.processor(() => store.state.processor)
					.loadData(async () => {
						const user = await loginStore.dispatch("getUser");
						if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();
						const api = await ApiHost.request().url("users").send();
						const contents = api.getContent();
						return contents.map((data) => new ItemUser(Stores).fromData(data));
					})
					.setData((data) => {
						store.commit("items", Array.isArray(data) ? data : []);
						store.commit("lastModified", Date.now());
					})
					.getData(() => store.getters.items),
				items: [],
				processor: new Processor(),
			},
			mutations: {
				lastModified: (state, time) => (state.lastModified = time),
				items: (state, items) => {
					state.items = Array.isArray(items) ? items : [];
				},
			},
			getters: {
				lastModified: (state) => state.lastModified,
				isLoading: (state) => state.processor.isLoading(),
				token: () => loginStore.getters.token,
				items: (state) => state.items.map((user) => user),
			},
			actions: {
				refresh: async (context) => {
					return context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("getUsers");
					});
				},

				getUsers: async (context) => {
					return context.state.processor.acquire("getUsers", async () => {
						return await context.state.dataLoader.data();
					});
				},
				getUserByUsername: async (context, username = "") => {
					return context.state.processor.acquire(
						"getUserByUsername",
						async () => {
							const users = await context.dispatch("getUsers");
							return users.find((user) => user.username === username);
						},
					);
				},
				addUser: async (
					context,
					arg = { username, name, passwordNew, passwordRepeat },
				) => {
					return context.state.processor.acquire("addUser", async () => {
						let user = await loginStore.dispatch("getUser");

						if (!user.isTypeAdmin()) throw new Error();

						let api = await ApiHost.request()
							.url("users/user")
							.POST()
							.body({
								username: arg.username,
								name: arg.name,
								passwordNew: arg.passwordNew,
								passwordRepeat: arg.passwordRepeat,
							})
							.send();

						let content = api.getContent();
						if (!content) throw new Error();
						const newUser = new ItemUser(Stores).fromData(content);
						const users = context.getters.items;
						users.push(newUser);
						context.commit("items", users);
						context.commit("lastModified", Date.now());
						return newUser;
					});
				},
				removeUserByUsername: async (context, arg = { username }) => {
					return context.state.processor.acquire(
						"removeUserByUsername",
						async () => {
							let user = await loginStore.dispatch("getUser");

							if (!user.isTypeAdmin()) throw new Error();

							let api = await ApiHost.request()
								.DELETE()
								.url("users/user")
								.body({ username: arg.username })
								.send();

							let content = api.getContent();
							if (content !== "ok") throw new Error();
							let users = context.getters.items.filter((user) => {
								return user.username !== arg.username;
							});
							context.commit("items", users);
							context.commit("lastModified", Date.now());
							return true;
						},
					);
				},
				updateTypeOfUserByUsername: async (
					context,
					arg = { username, userType },
				) => {
					return context.state.processor.acquire(
						"updateTypeOfUserByUsername",
						async () => {
							try {
								let user = await loginStore.dispatch("getUser");

								if (!user.isTypeAdmin()) throw new Error();

								let { username, userType } = arg;

								let api = await ApiHost.request()
									.url("users/user")
									.PUT()
									.body({ username, userType })
									.send();

								let content = api.getContent();
								let userChange = new ItemUser(Stores).fromData(content);
								if (!userChange) throw new Error();
								let users = context.getters.items.map((user) => {
									return user.username === userChange.username
										? userChange
										: user;
								});
								context.commit("items", users);
								context.commit("lastModified", Date.now());
								return userChange;
							} catch (error) {
								context.commit("items", []);
								context.commit("lastModified", Date.now());
								throw error;
							}
						},
					);
				},
			},
		});

		return store;
	},
};
