import { defineStore } from 'pinia';
import socketIo, { Socket } from 'socket.io-client';
import { computed, ref } from 'vue';

import { optArray } from '@/U';
import {
  POPUP_MENU_CORNER,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import { HOST_API } from '@/config';
import { Snackbar } from '@/tools/Snackbar';
import { TimeNowGetter } from '@/tools/TimeNowGetter';

import { useServiceStore } from './service.store';

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
interface ImageViewerContext {
  isShowing: boolean;
  image: any;
  thumbnails: any[];
}

const keyGetter = new TimeNowGetter();

export const useAppStore = defineStore('app', () => {
  // const app = ref<Vue | null>(null);

  const app = ref<any>(null);
  const socket = ref<Socket | null>(null);
  const imageViewer = ref<ImageViewerContext>({
    isShowing: false,
    image: null,
    thumbnails: [],
  });
  const popupMenus = ref<PopupMenu[]>([]);
  const snackbars = ref<Snackbar[]>([]);
  const popupWindows = ref<PopupWindow[]>([]);

  const console = computed(() => app.value.console);
  const appWindow = computed(() => app.value.window);
  const appLayout = computed(() => app.value.appLayout);
  const navigation = computed(() => app.value.navigation);

  const user = computed(() => app.value.user);
  const pages = computed(() => app.value.pages);
  const paths = computed(() => app.value.paths);
  const currentPaths = computed(() => app.value.currentPaths);
  const currentPageKey = computed(() => app.value.currentPageKey);
  const currentViewKey = computed(() => app.value.currentViewKey);

  const copyText = computed(() => app.value.copyText);
  const openLink = computed(() => app.value.openLink);
  const pushDownload = computed(() => app.value.pushDownload);

  const print = computed(() => app.value.print);
  const nextQuery = computed(() => app.value.nextQuery);
  const replaceQuery = computed(() => app.value.replaceQuery);
  const setQuery = computed(() => app.value.setQuery);

  // socket
  const isConnected = computed(() => {
    return socket.value && socket.value.connected;
  });
  const socketNotify = (body: {
    manager: string;
    key: string;
    content: any;
  }) => {
    const { manager, key, content } = body;
    switch (manager) {
      case 'service':
        useServiceStore().socketNotify({ key, content });
        break;
    }
  };
  const openSocket = () => {
    if (isConnected.value) return;

    const option: Record<string, any> = {
      extraHeaders: {
        authorization: window.localStorage.getItem('userToken'),
      },
    };
    socket.value = socketIo(HOST_API, option)
      .on('connect', () => console.value.info('Socket', 'Connected'))
      .on('connect_error', () => console.value.info('Socket', 'Connect Error'))
      .on('disconnect', (reason) =>
        console.value.info('Socket', 'Disconnected'),
      )
      .on('notify', (body) => socketNotify(body));
  };
  const closeSocket = () => {
    if (!isConnected.value) return;
    const oldSocket = socket.value;
    socket.value = null;
    oldSocket?.close();
  };
  const restartSocket = () => {
    closeSocket();
    openSocket();
  };

  // imageViewer
  const imageViewerShow = (option = { image: null, thumbnails: [] }) => {
    imageViewer.value.image = option.image;
    imageViewer.value.thumbnails = optArray(option.thumbnails);
    imageViewer.value.isShowing = true;
    imageViewer.value = imageViewer.value;
  };
  const imageViewerHide = () => {
    imageViewer.value.isShowing = false;
    imageViewer.value = imageViewer.value;
    setTimeout(() => {
      imageViewer.value.thumbnails = [];
      imageViewer.value.image = null;
      imageViewer.value = imageViewer.value;
    }, 300);
  };
  const imageViewerSelect = (image = null) => {
    imageViewer.value.image = image;
    imageViewer.value = imageViewer.value;
  };

  // popupMenus
  const popupMenuShow = (
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
            const index = popupMenus.value.indexOf(popupMenu);
            popupMenus.value.splice(index, 1);
            popupMenus.value = popupMenus.value;
          }, 300);
        }, 300);
      },
    };

    popupMenus.value.push(popupMenu);
    popupMenus.value = popupMenus.value;

    return popupMenu;
  };

  // snackbars
  const snackbarShow = (arg: any) => {
    if (typeof arg === 'string') arg = { text: arg };
    snackbars.value.push(new Snackbar(arg).show());
    snackbars.value = snackbars.value;
  };

  // popup windows
  const openPopupWindow = (
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
            const index = popupWindows.value.indexOf(popupWindow as any);
            popupWindows.value.splice(index, 1);
            popupWindows.value = popupWindows.value;
          }, 300);
        }, 300);
      },
    };

    Object.keys(arg).forEach((key) => {
      popupWindow[key] = arg[key];
    });

    popupWindows.value.push(popupWindow as any);
    popupWindows.value = popupWindows.value;

    setTimeout(() => popupWindow.open(), 300);

    return popupWindow;
  };

  return {
    app,
    socket,
    imageViewer,
    popupMenus,
    snackbars,
    popupWindows,

    console,
    window: appWindow,
    appLayout,
    navigation,

    user,
    pages,
    paths,
    currentPaths,
    currentPageKey,
    currentViewKey,

    copyText,
    openLink,
    pushDownload,

    print,
    nextQuery,
    replaceQuery,
    setQuery,

    isConnected,
    socketNotify,
    openSocket,
    closeSocket,
    restartSocket,

    imageViewerShow,
    imageViewerHide,
    imageViewerSelect,

    popupMenuShow,

    snackbarShow,

    openPopupWindow,
  };
});
