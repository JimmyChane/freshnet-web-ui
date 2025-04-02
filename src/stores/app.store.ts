import { defineStore } from 'pinia';
import { Socket } from 'socket.io-client';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  POPUP_MENU_CORNER,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import { AppLayout } from '@/tools/AppLayout';
import { Navigation } from '@/tools/Navigation';
import { Snackbar } from '@/tools/Snackbar';
import { TimeNowGetter } from '@/tools/TimeNowGetter';

import { useLoginStore } from './login.store';

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

const keyGetter = new TimeNowGetter();

export const useAppStore = defineStore('app', () => {
  const route = useRoute();

  const socket = ref<Socket | null>(null);

  const popupMenus = ref<PopupMenu[]>([]);
  const snackbars = ref<Snackbar[]>([]);
  const popupWindows = ref<PopupWindow[]>([]);

  const appWindow = ref({ innerWidth: 0, innerHeight: 0 });
  const appLayout = ref(new AppLayout());
  const navigation = ref(new Navigation());

  const user = computed(() => useLoginStore().user);
  const paths = computed(() => route.path.split('/').filter((path) => path));
  const currentPaths = computed(() => {
    let fullPath = route.fullPath;

    let questionMarkIndex = fullPath.indexOf('?');
    if (questionMarkIndex !== -1) {
      fullPath = fullPath.substring(0, questionMarkIndex);
    }

    return fullPath.split(/[/]/).filter((path) => path);
  });
  const currentPageKey = computed(() => {
    let paths = currentPaths.value;
    return paths.length > 0 ? paths[0] : '';
  });
  const currentViewKey = computed(() => {
    let paths = currentPaths.value;
    return paths.length > 1 ? paths[1] : '';
  });

  // socket
  const isConnected = computed(() => {
    return socket.value && socket.value.connected;
  });

  // popupMenus
  const popupMenuShow = (
    arg: {
      anchor: any;
      menus: [];
      option: { width: number; corner: number; primaryColor: undefined };
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

  return {
    socket,
    popupMenus,
    snackbars,
    popupWindows,

    window: appWindow,
    appLayout,
    navigation,

    user,
    paths,
    currentPaths,
    currentPageKey,
    currentViewKey,

    isConnected,

    popupMenuShow,

    snackbarShow,
  };
});
