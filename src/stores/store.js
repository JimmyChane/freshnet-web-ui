import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import HostApi from "../host/HostApi.js";

Vue.use(Vuex);

const init = (Stores) => {
   const context = { state: {}, mutations: {}, getters: {}, actions: {} };

   context.state.socket = null;
   context.mutations.socket = (state, socket) => (state.socket = socket);
   context.getters.isConnected = (state) => state.socket && state.socket.connected;

   context.actions.socketNotify = (context, body) => {
      const { manager, key, content } = body ? body : {};
      switch (manager) {
         case "service":
            Stores.service.dispatch("socketNotify", { key, content });
            break;
      }
   };
   context.actions.openSocket = (context) => {
      if (context.getters.isConnected) return;

      const socket = socketIo(HostApi.origin, {
         extraHeaders: { authorization: window.localStorage.getItem("userToken") },
      })
         // .on("connect", () => console.info("Socket", "Connected"))
         // .on("connect_error", () => console.info("Socket", "Connect Error"))
         // .on("disconnect", (reason) => console.info("Socket", "Disconnected"))
         .on("notify", (body) => context.dispatch("socketNotify", body));
      context.commit("socket", socket);
   };
   context.actions.closeSocket = (context) => {
      if (!context.getters.isConnected) return;
      const socket = context.state.socket;
      context.commit("socket", null);
      socket.close();
   };
   context.actions.restartSocket = (context) => {
      context.dispatch("closeSocket");
      context.dispatch("openSocket");
   };

   const store = new Vuex.Store(context);
   store.dispatch("openSocket");

   return store;
};

export default { init };
