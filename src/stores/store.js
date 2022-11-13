import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import ApiHost from "../host/ApiHost.js";
import SocketData from "@/items/data/SocketData.js";

Vue.use(Vuex);

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				socket: null,
				// listeners: [],
			},
			mutations: {
				socket: (state, socket) => (state.socket = socket),
			},
			getters: {
				isConnected: (state) => state.socket && state.socket.connected,
			},
			actions: {
				openSocket(context) {
					if (context.getters.isConnected) return;

					let socket = socketIo(ApiHost.origin, {
						extraHeaders: {
							authorization: window.localStorage.getItem("userToken"),
						},
					});
					// socket.on("connect_error", () => console.info("connect error"));
					// socket.on("connect", () => console.info("connected"));
					// socket.on("disconnect", (reason) => console.info("disconnected"));
					socket.on("emit", (body) => {
						const { content, key } = body ? body : {};
						const data = new SocketData(content, key);

						console.log(data);

						// for (let listener of store.state.listeners) {
						//    if (data.key === listener.key) {
						//       listener.tell(data.content);
						//       return;
						//    }
						//    if (!listener.key && !listener.key) {
						//       listener.tell(data.content);
						//       return;
						//    }
						// }
					});

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

				test(context) {
					return "hi";
				},
			},
		});

		store.dispatch("openSocket");

		return store;
	},
};
