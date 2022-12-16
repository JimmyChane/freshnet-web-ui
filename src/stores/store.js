import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import ApiHost from "../host/ApiHost.js";

Vue.use(Vuex);

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: { socket: null },
			mutations: {
				socket: (state, socket) => (state.socket = socket),
			},
			getters: {
				isConnected: (state) => state.socket && state.socket.connected,
			},
			actions: {
				openSocket(context) {
					if (context.getters.isConnected) return;

					const socket = socketIo(ApiHost.origin, {
						extraHeaders: {
							authorization: window.localStorage.getItem("userToken"),
						},
					});
					// socket.on("connect_error", () => console.info("Socket", "Connect Error"));
					// socket.on("connect", () => console.info("Socket", "Connected"));
					// socket.on("disconnect", (reason) =>
					// 	console.info("Socket", "Disconnected"),
					// );
					// socket.on("notify", (body) => context.dispatch("socketNotify", body));

					context.commit("socket", socket);
				},
				closeSocket(context) {
					if (!context.getters.isConnected) return;

					let socket = context.state.socket;
					context.commit("socket", null);
					socket.close();
				},
				restartSocket(context) {
					context.dispatch("closeSocket");
					context.dispatch("openSocket");
				},
				// socketNotify(context, body) {
				// 	const { manager, key, content } = body ? body : {};
				// 	if (manager === "service") {
				// 		Stores.service.dispatch("socketNotify", { key, content });
				// 	}
				// },
			},
		});

		store.dispatch("openSocket");

		return store;
	},
};
