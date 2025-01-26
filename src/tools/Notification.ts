import { TimeNowGetter } from '@/tools/TimeNowGetter';

const keyGetter = new TimeNowGetter();

export class Notification {
  context: any;

  key: number;
  isShowing: boolean = false;

  icon: string | undefined;
  text: string | undefined;
  isLoading: boolean | undefined;
  actions: any[] | undefined;

  constructor(
    context: any,
    param: {
      text?: string;
      isLoading?: boolean;
      icon?: string;
      actions?: any[];
    } = {},
  ) {
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
