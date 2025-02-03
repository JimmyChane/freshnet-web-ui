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
  context: any;

  key: number;
  isShowing: boolean = false;

  icon: string | undefined;
  text: string | undefined;
  isLoading: boolean | undefined;
  actions: SnackbarAction[] | undefined;

  constructor(context: any, param: SnackbarOption = {}) {
    this.context = context;

    this.key = keyGetter.get();

    this.icon = param.icon;
    this.isLoading = param.isLoading;
    this.text = param.text;
    this.actions = param.actions;
  }

  get index(): number {
    return this.context.getters.snackbars.indexOf(this);
  }

  show(timeout: number = 3000): this {
    setTimeout(() => (this.isShowing = true), 80);
    setTimeout(() => this.hide(), timeout);
    return this;
  }

  hide(): this {
    this.isShowing = false;

    setTimeout(() => {
      const index = this.context.state.snackbars.indexOf(this);
      this.context.state.snackbars.splice(index, 1);
      this.context.commit('snackbars', this.context.state.snackbars);
    }, 80);

    return this;
  }
}
