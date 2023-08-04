export default class AppLayout {
  static Layout = { NORMAL: -1, FULL: -2 };

  private static LAYOUTS: number[] = Object.values(this.Layout);

  context: any;
  requests: { page: string; view: string; mode: number }[] = [];

  constructor(context: any) {
    this.context = context;
  }

  private getCurrentPageKey(): string {
    return this.context.currentPageKey;
  }

  private getCurrentViewKey(): string {
    return this.context.currentViewKey;
  }

  private getVisibilityRequest(
    page: string = "",
    view: string = "",
  ): { page: string; view: string; mode: number } | undefined {
    return this.requests.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  setLayout(mode: number = 0): void {
    if (!AppLayout.LAYOUTS.includes(mode)) return;

    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getVisibilityRequest(page, view);

    if (request) request.mode = mode;
    else this.requests.push({ page, view, mode });
  }

  private getCurrentVisibilityRequest(): {
    page: string;
    view: string;
    mode: number;
  } | null {
    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getVisibilityRequest(page, view);

    return request ?? null;
  }

  getCurrentLayout(): number {
    const request = this.getCurrentVisibilityRequest();
    return request?.mode ?? AppLayout.Layout.FULL;
  }

  isNormal(): boolean {
    return this.getCurrentLayout() === AppLayout.Layout.NORMAL;
  }

  isFull(): boolean {
    return this.getCurrentLayout() === AppLayout.Layout.FULL;
  }
}
