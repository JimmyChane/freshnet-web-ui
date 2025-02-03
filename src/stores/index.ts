import Vue from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';

import socketIo, { Socket } from 'socket.io-client';

import { optArray } from '@/U';
import {
  POPUP_MENU_CORNER,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import { initBrand } from '@/stores/store.brand';
import { initCategory } from '@/stores/store.category';
import { initCustomer } from '@/stores/store.customer';
import { initDatabase } from '@/stores/store.database';
import { initLogin } from '@/stores/store.login';
import { initOrder } from '@/stores/store.order';
import { initProduct } from '@/stores/store.product';
import { initPs2 } from '@/stores/store.ps2';
import { initService } from '@/stores/store.service';
import { initSetting } from '@/stores/store.setting';
import { initSpecification } from '@/stores/store.specification';
import { initUser } from '@/stores/store.user';
import { Snackbar } from '@/tools/Snackbar';
import { TimeNowGetter } from '@/tools/TimeNowGetter';

import { originApiServer } from '../host/Server';

const keyGetter = new TimeNowGetter();

Vue.use(Vuex);

interface PopupMenu {
  key: number;
  anchor: HTMLElement;
  menus: any[];
  option: any;
  isShowing: boolean;
  isClosing: boolean;

  hide: () => void;
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
interface State {
  app: Vue | null;
  socket: Socket | null;
  imageViewer: ImageViewerContext;
  popupMenus: PopupMenu[];
  snackbars: Snackbar[];
  popupWindows: PopupWindow[];
  stores: Record<string, Store<any>>;
}
interface ImageViewerContext {
  isShowing: boolean;
  image: any;
  thumbnails: any[];
}

const Stores: Record<string, any> = {};

const context: StoreOptions<State> = {};
context.state = {
  app: null,
  socket: null,
  imageViewer: { isShowing: false, image: null, thumbnails: [] },
  popupMenus: [],
  snackbars: [],
  popupWindows: [],
  stores: {},
};
context.mutations = {};
context.getters = {
  console: (c: any) => c.app.console,
  window: (c: any) => c.app.window,
  appLayout: (c: any) => c.app.appLayout,
  navigation: (c: any) => c.app.navigation,

  user: (c: any) => c.app.user,
  pages: (c: any) => c.app.pages,
  paths: (c: any) => c.app.paths,
  currentPaths: (c: any) => c.app.currentPaths,
  currentPageKey: (c: any) => c.app.currentPageKey,
  currentViewKey: (c: any) => c.app.currentViewKey,

  copyText: (c: any) => c.app.copyText,
  openLink: (c: any) => c.app.openLink,
  pushDownload: (c: any) => c.app.pushDownload,

  print: (c: any) => c.app.print,
  nextQuery: (c: any) => c.app.nextQuery,
  replaceQuery: (c: any) => c.app.replaceQuery,
  setQuery: (c: any) => c.app.setQuery,
};
context.actions = {};

// socket
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
    case 'service':
      Stores.service.dispatch('socketNotify', { key, content });
      break;
  }
};
context.actions.openSocket = (context: any) => {
  if (context.getters.isConnected) return;

  const option: Record<string, any> = {
    extraHeaders: {
      authorization: window.localStorage.getItem('userToken'),
    },
  };
  const socket = socketIo(originApiServer(), option)
    .on('connect', () => console.info('Socket', 'Connected'))
    .on('connect_error', () => console.info('Socket', 'Connect Error'))
    .on('disconnect', (reason) => console.info('Socket', 'Disconnected'))
    .on('notify', (body) => context.dispatch('socketNotify', body));
  context.commit('socket', socket);
};
context.actions.closeSocket = (context: any) => {
  if (!context.getters.isConnected) return;
  const socket = context.state.socket;
  context.commit('socket', null);
  socket.close();
};
context.actions.restartSocket = (context: any) => {
  context.dispatch('closeSocket');
  context.dispatch('openSocket');
};

// imageViewer
context.mutations.imageViewer = (state: any, imageViewer: any) => {
  return (state.imageViewer = imageViewer);
};
context.getters.imageViewer = (state: any) => {
  return state.imageViewer;
};
context.actions.imageViewerShow = (
  context: any,
  option = { image: null, thumbnails: [] },
) => {
  context.state.imageViewer.image = option.image;
  context.state.imageViewer.thumbnails = optArray(option.thumbnails);
  context.state.imageViewer.isShowing = true;
  context.commit('imageViewer', context.state.imageViewer);
};
context.actions.imageViewerHide = (context: any) => {
  context.state.imageViewer.isShowing = false;
  context.commit('imageViewer', context.state.imageViewer);
  setTimeout(() => {
    context.state.imageViewer.thumbnails = [];
    context.state.imageViewer.image = null;
    context.commit('imageViewer', context.state.imageViewer);
  }, 300);
};
context.actions.imageViewerSelect = (context: any, image = null) => {
  context.state.imageViewer.image = image;
  context.commit('imageViewer', context.state.imageViewer);
};

// popupMenus
context.mutations.popupMenus = (state: any, popupMenus: any[]) => {
  return (state.popupMenus = popupMenus);
};
context.getters.popupMenus = (state: any) => {
  return state.popupMenus;
};
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
      width: POPUP_MENU_WIDTH.AUTO,
      corner: POPUP_MENU_CORNER.AUTO,
      primaryColor: undefined,
    },
  },
) => {
  const { anchor, menus = [], option = {} } = arg;

  const popupMenu: PopupMenu = {
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
          context.commit('popupMenus', context.state.popupMenus);
        }, 300);
      }, 300);
    },
  };

  context.state.popupMenus.push(popupMenu);
  context.commit('popupMenus', context.state.popupMenus);

  return popupMenu;
};

// snackbars
context.mutations.snackbars = (state: any, snackbars: any) => {
  return (state.snackbars = snackbars);
};
context.getters.snackbars = (state: any) => {
  return state.snackbars;
};
context.actions.snackbarShow = (context: any, arg: any) => {
  if (typeof arg === 'string') arg = { text: arg };
  context.state.snackbars.push(new Snackbar(context, arg).show());
  context.commit('snackbars', context.state.snackbars);
};

// popup windows
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
          context.commit('popupWindows', context.state.popupWindows);
        }, 300);
      }, 300);
    },
  };

  Object.keys(arg).forEach((key) => {
    popupWindow[key] = arg[key];
  });

  context.state.popupWindows.push(popupWindow);
  context.commit('popupWindows', context.state.popupWindows);

  setTimeout(() => popupWindow.open(), 300);

  return popupWindow;
};

export const store = new Vuex.Store(context);

// modules
Stores.store = store;
Stores.database = initDatabase(Stores);
Stores.login = initLogin(Stores);
Stores.user = initUser(Stores);
Stores.setting = initSetting(Stores);
Stores.customer = initCustomer(Stores);
Stores.order = initOrder(Stores);
Stores.brand = initBrand(Stores);
Stores.specification = initSpecification(Stores);
Stores.category = initCategory(Stores);
Stores.service = initService(Stores);
Stores.product = initProduct(Stores);
Stores.ps2 = initPs2(Stores);

context.modules = {
  database: Stores.database,
  login: Stores.login,
  user: Stores.user,
  setting: Stores.setting,
  customer: Stores.customer,
  order: Stores.order,
  brand: Stores.brand,
  specification: Stores.specification,
  category: Stores.category,
  service: Stores.service,
  product: Stores.product,
  ps2: Stores.ps2,
};

context.state.stores['database'] = Stores.database;
context.state.stores['login'] = Stores.login;
context.state.stores['user'] = Stores.user;
context.state.stores['setting'] = Stores.setting;
context.state.stores['customer'] = Stores.customer;
context.state.stores['order'] = Stores.order;
context.state.stores['brand'] = Stores.brand;
context.state.stores['specification'] = Stores.specification;
context.state.stores['category'] = Stores.category;
context.state.stores['service'] = Stores.service;
context.state.stores['product'] = Stores.product;
context.state.stores['ps2'] = Stores.ps2;
