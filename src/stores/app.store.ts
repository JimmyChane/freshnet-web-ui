import { defineStore } from 'pinia';
import { Socket } from 'socket.io-client';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { isPassed, optArray, parseGroup2s, replace } from '@/U';
import { NavPage } from '@/app/NavPage';
import { NavView } from '@/app/NavView';
import { NavViewGroup } from '@/app/NavViewGroup';
import {
  POPUP_MENU_CORNER,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import { HOME_ROUTE } from '@/router';
import { AppLayout } from '@/tools/AppLayout';
import { Navigation } from '@/tools/Navigation';
import { Snackbar } from '@/tools/Snackbar';
import { TimeNowGetter } from '@/tools/TimeNowGetter';

import { useLoginStore } from './login.store';
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

const keyGetter = new TimeNowGetter();

export const useAppStore = defineStore('app', () => {
  // const app = ref<Vue | null>(null);

  const router = useRouter();
  const route = useRoute();

  const app = ref<any>(null);
  const socket = ref<Socket | null>(null);

  const popupMenus = ref<PopupMenu[]>([]);
  const snackbars = ref<Snackbar[]>([]);
  const popupWindows = ref<PopupWindow[]>([]);

  const appConsole = ref({
    log(param1: any, param2: any) {
      param2 === undefined ? console.log(param1) : console.log(param1, param2);
    },
    error(param1: any, param2: any) {
      param2 === undefined
        ? console.error(param1)
        : console.error(param1, param2);
    },
  });
  const appWindow = ref({ innerWidth: 0, innerHeight: 0 });
  const appLayout = ref(new AppLayout());
  const navigation = ref(new Navigation());

  const user = computed(() => useLoginStore().user);
  const appPages = computed(() => {
    const pages = [HOME_ROUTE];
    if (pages.length < 1) return [];

    const listGroup1 = pages.map((page) => {
      const navPage = new NavPage()
        .setKey(page.key)
        .setTitle(page.title)
        .setIcon(page.icon)
        .setUserPermissions(page.userPermissions);

      const children =
        typeof page.children === 'function' ? page.children() : [];
      const groups = typeof page.groups === 'function' ? page.groups() : [];
      const queries =
        typeof page._queries === 'function' ? page._queries() : [];

      const returnParsedGroups = [
        ...parseGroup2s([{ values: children }, ...groups]).map((obj) => {
          return obj.setIsLink(true).setIsQuery(false);
        }),
        ...parseGroup2s(queries).map((obj) => {
          return obj.setIsLink(true).setIsQuery(true);
        }),
      ]
        .filter((group) => {
          return isPassed(useLoginStore().user, group.userPermissions);
        })
        .reduce((groups: NavViewGroup[], group) => {
          const views = optArray(group.values)
            .filter((value) => {
              return isPassed(useLoginStore().user, value.userPermissions);
            })
            .map((value) => {
              return new NavView()
                .setKey(value.key)
                .setTitle(value.title)
                .setIcon(value.icon);
            });

          let found: NavViewGroup | undefined = groups.find(
            (group) => group.key === navPage.key,
          );
          if (!found) {
            found = new NavViewGroup()
              .setKey(group.key)
              .setTitle(group.title)
              .setIsLink(group.isLink)
              .setIsQuery(group.isQuery);

            groups.push(found);
          }
          found.groups.push(...views);

          return groups;
        }, []);

      return navPage.setGroups(returnParsedGroups);
    });

    listGroup1.forEach((group1) => {
      const listGroup2 = group1.groups;
      listGroup2.forEach((group2) => {
        const listGroup3 = group2.groups;
        if (listGroup3.length === 0) {
          listGroup2.splice(listGroup2.indexOf(group2), 1);
        }
      });
    });

    return listGroup1;
  });
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

  function nextQuery(param = {}) {
    setQuery(param, true);
  }
  function replaceQuery(param = {}) {
    setQuery(param, false);
  }
  function setQuery(param: any = {}, isNext = true) {
    const query = replace(route.query, param.query);

    if (!query) return;

    if (isNext) {
      router.push({ query });
    } else {
      router.replace({ query });
    }
  }

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
    app,
    socket,
    popupMenus,
    snackbars,
    popupWindows,

    console: appConsole,
    window: appWindow,
    appLayout,
    navigation,

    user,
    pages: appPages,
    paths,
    currentPaths,
    currentPageKey,
    currentViewKey,

    nextQuery,
    replaceQuery,
    setQuery,

    isConnected,
    socketNotify,

    popupMenuShow,

    snackbarShow,
  };
});
