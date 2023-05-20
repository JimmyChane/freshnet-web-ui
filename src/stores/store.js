import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import HostApi from "../host/HostApi.js";
import TimeNowGetter from "@/tools/TimeNowGetter.js";
import Notification from "@/tools/Notification.js";
import PopupMenu from "@/app/PopupMenu.vue";

const keyGetter = new TimeNowGetter();

Vue.use(Vuex);

const init = (Stores) => {
   const context = { state: {}, mutations: {}, getters: {}, actions: {} };

   // socket
   context.state.socket = null;
   context.mutations.socket = (state, socket) => (state.socket = socket);
   context.getters.isConnected = (state) =>
      state.socket && state.socket.connected;
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

      const socket = socketIo(HostApi.originApi, {
         extraHeaders: {
            authorization: window.localStorage.getItem("userToken"),
         },
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

   // imageViewer
   context.state.imageViewer = {
      isShowing: false,
      image: null,
      thumbnails: [],
   };
   context.mutations.imageViewer = (state, imageViewer) =>
      (state.imageViewer = imageViewer);
   context.getters.imageViewer = (state) => state.imageViewer;
   context.actions.imageViewerShow = (
      context,
      option = { image: null, thumbnails: [] },
   ) => {
      context.state.imageViewer.image = option.image;
      context.state.imageViewer.thumbnails = option.thumbnails;
      context.state.imageViewer.isShowing = true;
      context.commit("imageViewer", context.state.imageViewer);
   };
   context.actions.imageViewerHide = (context) => {
      context.state.imageViewer.isShowing = false;
      context.commit("imageViewer", context.state.imageViewer);
      setTimeout(() => {
         context.state.imageViewer.thumbnails = [];
         context.state.imageViewer.image = null;
         context.commit("imageViewer", context.state.imageViewer);
      }, 300);
   };
   context.actions.imageViewerSelect = (context, image = null) => {
      context.state.imageViewer.image = image;
      context.commit("imageViewer", context.state.imageViewer);
   };

   // popupMenus
   context.state.popupMenus = [];
   context.mutations.popupMenus = (state, popupMenus) =>
      (state.popupMenus = popupMenus);
   context.getters.popupMenus = (state) => state.popupMenus;
   context.actions.popupMenuShow = (
      context,
      arg = {
         anchor,
         menus: [],
         option: {
            width: PopupMenu.Width.AUTO,
            corner: PopupMenu.Corner.AUTO,
            primaryColor: undefined,
         },
      },
   ) => {
      const { anchor, menus = [], option = {} } = arg;

      const popupMenu = {
         key: keyGetter.get(),
         anchor,
         menus,
         option,
         isShowing: true,
         isClosing: false,

         hide: () => {
            if (popupMenu.isClosing) return;
            popupMenu.isClosing = true;

            setTimeout(() => {
               popupMenu.isShowing = false;
               setTimeout(() => {
                  const index = context.state.popupMenus.indexOf(popupMenu);
                  context.state.popupMenus.splice(index, 1);
                  context.commit("popupMenus", context.state.popupMenus);
               }, 300);
            }, 300);
         },
      };

      context.state.popupMenus.push(popupMenu);
      context.commit("popupMenus", context.state.popupMenus);

      return popupMenu;
   };

   // snackbars
   context.state.snackbars = [];
   context.mutations.snackbars = (state, snackbars) =>
      (state.snackbars = snackbars);
   context.getters.snackbars = (state) => state.snackbars;
   context.actions.snackbarShow = (context, arg) => {
      if (typeof arg === "string") arg = { text: arg };
      context.state.snackbars.push(new Notification(context, arg).show());
      context.commit("snackbars", context.state.snackbars);
   };

   const store = new Vuex.Store(context);
   store.dispatch("openSocket");

   return store;
};

export default { init };
