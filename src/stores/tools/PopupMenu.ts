export default interface PopupMenu {
  key: number;
  anchor: HTMLElement;
  menus: any[];
  option: any;
  isShowing: boolean;
  isClosing: boolean;

  hide: () => void;
}
