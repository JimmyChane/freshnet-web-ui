import { useAppStore } from '@/stores/app.store';
import { TimeNowGetter } from '@/tools/TimeNowGetter';

const keyGetter = new TimeNowGetter();

export interface SnackbarAction {
  key: string;
  title: string;
  click: () => void;
}

export interface SnackbarOption {
  text?: string;
  isLoading?: boolean;
  icon?: string;
  actions?: SnackbarAction[];
}

export class Snackbar {
  key: number;
  isShowing: boolean = false;

  icon: string | undefined;
  text: string | undefined;
  isLoading: boolean | undefined;
  actions: SnackbarAction[] | undefined;

  constructor(param: SnackbarOption = {}) {
    this.key = keyGetter.get();

    this.icon = param.icon;
    this.isLoading = param.isLoading;
    this.text = param.text;
    this.actions = param.actions;
  }

  get index(): number {
    return useAppStore().snackbars.indexOf(this);
  }

  show(timeout: number = 3000): this {
    setTimeout(() => (this.isShowing = true), 80);
    setTimeout(() => this.hide(), timeout);
    return this;
  }

  hide(): this {
    this.isShowing = false;

    setTimeout(() => {
      const index = useAppStore().snackbars.indexOf(this);
      useAppStore().snackbars.splice(index, 1);
      useAppStore().snackbars = useAppStore().snackbars;
    }, 80);

    return this;
  }
}
