import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import ApiHost from "../host/ApiHost.js";

Vue.use(Vuex);

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: { socket: null },
			mutations: { socket: (state, socket) => (state.socket = socket) },
			getters: { isConnected: (state) => state.socket && state.socket.connected },
			actions: {
				socketNotify: (context, body) => {
					const { manager, key, content } = body ? body : {};
					switch (manager) {
						case "service":
							Stores.service.dispatch("socketNotify", { key, content });
							break;
					}
				},
				openSocket: (context) => {
					if (context.getters.isConnected) return;

					const socket = socketIo(ApiHost.origin, {
						extraHeaders: {
							authorization: window.localStorage.getItem("userToken"),
						},
					})
					// .on("connect", () => console.info("Socket", "Connected"))
					// .on("connect_error", () => console.info("Socket", "Connect Error"))
					// .on("disconnect", (reason) => console.info("Socket", "Disconnected"))
					.on("notify", (body) => context.dispatch("socketNotify", body));
					context.commit("socket", socket);
				},
				closeSocket: (context) => {
					if (!context.getters.isConnected) return;
					const socket = context.state.socket;
					context.commit("socket", null);
					socket.close();
				},
				restartSocket: (context) => {
					context.dispatch("closeSocket");
					context.dispatch("openSocket");
				},
			},
		});

		store.dispatch("openSocket");

		return store;
	},
};
