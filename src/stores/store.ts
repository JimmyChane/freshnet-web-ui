import Vue from "vue";
import Vuex from "vuex";
import socketIo from "socket.io-client";
import HostApi from "../host/HostApi.js";
import TimeNowGetter from "@/tools/TimeNowGetter.js";
import Notification from "@/tools/Notification.js";
import PopupMenu from "@/app/PopupMenuOption.js";

const keyGetter = new TimeNowGetter();

Vue.use(Vuex);

interface Context {
  state: Record<string, any>;
  mutations: Record<string, any>;
  getters: Record<string, any>;
  actions: Record<string, any>;
}
interface PopupWindow {
  key: number;
  isShowing: boolean;
  isClosing: boolean;
  component: any;

  open: () => void;
  close: () => void;

  onOpened?: ((popupWindow: PopupWindow) => void) | undefined;
  onClosed?: ((popupWindow: PopupWindow) => void) | undefined;
}

const init = (Stores: any) => {
  const context: Context = {
    state: {},
    mutations: {},
    getters: {},
    actions: {},
  };

  // socket
  context.state.socket = null;
  context.mutations.socket = (state: any, socket: any) => {
    return (state.socket = socket);
  };
  context.getters.isConnected = (state: any) => {
    return state.socket && state.socket.connected;
  };
  context.actions.socketNotify = (
    context: any,
    body: {
      manager: string;
      key: string;
      content: any;
    },
  ) => {
    const { manager, key, content } = body;
    switch (manager) {
      case "service":
        Stores.service.dispatch("socketNotify", { key, content });
        break;
    }
  };
  context.actions.openSocket = (context: any) => {
    if (context.getters.isConnected) return;

    const option: Record<string, any> = {
      extraHeaders: {
        authorization: window.localStorage.getItem("userToken"),
      },
    };
    const socket = socketIo(HostApi.originApi, option)
      .on("connect", () => console.info("Socket", "Connected"))
      .on("connect_error", () => console.info("Socket", "Connect Error"))
      .on("disconnect", (reason) => console.info("Socket", "Disconnected"))
      .on("notify", (body) => context.dispatch("socketNotify", body));
    context.commit("socket", socket);
  };
  context.actions.closeSocket = (context: any) => {
    if (!context.getters.isConnected) return;
    const socket = context.state.socket;
    context.commit("socket", null);
    socket.close();
  };
  context.actions.restartSocket = (context: any) => {
    context.dispatch("closeSocket");
    context.dispatch("openSocket");
  };

  // imageViewer
  context.state.imageViewer = {
    isShowing: false,
    image: null,
    thumbnails: [],
  };
  context.mutations.imageViewer = (state: any, imageViewer: any) =>
    (state.imageViewer = imageViewer);
  context.getters.imageViewer = (state: any) => state.imageViewer;
  context.actions.imageViewerShow = (
    context: any,
    option = { image: null, thumbnails: [] },
  ) => {
    context.state.imageViewer.image = option.image;
    context.state.imageViewer.thumbnails = option.thumbnails;
    context.state.imageViewer.isShowing = true;
    context.commit("imageViewer", context.state.imageViewer);
  };
  context.actions.imageViewerHide = (context: any) => {
    context.state.imageViewer.isShowing = false;
    context.commit("imageViewer", context.state.imageViewer);
    setTimeout(() => {
      context.state.imageViewer.thumbnails = [];
      context.state.imageViewer.image = null;
      context.commit("imageViewer", context.state.imageViewer);
    }, 300);
  };
  context.actions.imageViewerSelect = (context: any, image = null) => {
    context.state.imageViewer.image = image;
    context.commit("imageViewer", context.state.imageViewer);
  };

  // popupMenus
  context.state.popupMenus = [];
  context.mutations.popupMenus = (state: any, popupMenus: any[]) =>
    (state.popupMenus = popupMenus);
  context.getters.popupMenus = (state: any) => state.popupMenus;
  context.actions.popupMenuShow = (
    context: any,
    arg: {
      anchor: any;
      menus: [];
      option: {
        width: number;
        corner: number;
        primaryColor: undefined;
      };
    } = {
      anchor: null,
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
  context.mutations.snackbars = (state: any, snackbars: any) =>
    (state.snackbars = snackbars);
  context.getters.snackbars = (state: any) => state.snackbars;
  context.actions.snackbarShow = (context: any, arg: any) => {
    if (typeof arg === "string") arg = { text: arg };
    context.state.snackbars.push(new Notification(context, arg).show());
    context.commit("snackbars", context.state.snackbars);
  };

  // popup windows
  context.state.popupWindows = [];
  context.mutations.popupWindows = (state: any, popupWindows: PopupWindow) => {
    state.popupWindows = popupWindows;
  };
  context.getters.popupWindows = (state: any) => state.popupWindows;
  context.actions.openPopupWindow = (
    context: any,
    arg:
      | {
          component: any;
          onOpened?: ((popupWindow: PopupWindow) => void) | undefined;
          onClosed?: ((popupWindow: PopupWindow) => void) | undefined;
        }
      | Record<string, any>
      | any,
  ) => {
    const popupWindow: PopupWindow | Record<string, any> = {
      key: keyGetter.get(),
      isShowing: false,
      isClosing: false,

      open: () => {
        if (popupWindow.isShowing) return;
        if (popupWindow.isClosing) return;
        popupWindow.isShowing = true;

        if (popupWindow.onOpened) {
          popupWindow.onOpened(popupWindow);
        }
      },
      close: () => {
        if (!popupWindow.isShowing) return;
        if (popupWindow.isClosing) return;
        popupWindow.isClosing = true;

        setTimeout(() => {
          popupWindow.isShowing = false;
          if (popupWindow.onClosed) {
            popupWindow.onClosed(popupWindow);
          }
          setTimeout(() => {
            const index = context.state.popupWindows.indexOf(popupWindow);
            context.state.popupWindows.splice(index, 1);
            context.commit("popupWindows", context.state.popupWindows);
          }, 300);
        }, 300);
      },
    };

    Object.keys(arg).forEach((key) => {
      popupWindow[key] = arg[key];
    });

    context.state.popupWindows.push(popupWindow);
    context.commit("popupWindows", context.state.popupWindows);

    setTimeout(() => popupWindow.open(), 300);

    return popupWindow;
  };

  return new Vuex.Store(context);
};

export default { init };
