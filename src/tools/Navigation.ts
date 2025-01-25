export const NAVIGATION_MIN_WIDTH: number = 1000;
export enum NavigationVisibility {
  NONE = -1,
  EXPANDED = -2,
  COLLAPSED = -3,
}
export enum NavigationLayout {
  WIDE = -1,
  THIN = -2,
}

export const NAVIGATION_VISIBILITIES = Object.values(NavigationVisibility);
export const NAVIGATION_LAYOUTS = Object.values(NavigationLayout);

export default class Navigation {
  context: any;
  defaultVisibility: number = NavigationVisibility.COLLAPSED;
  defaultLayout: number = NavigationLayout.WIDE;
  visibilityRequests: { page: string; view: string; visibility: number }[] = [];
  layoutRequests: { page: string; view: string; layout: number }[] = [];

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
    page: string = '',
    view: string = '',
  ): { page: string; view: string; visibility: number } | undefined {
    return this.visibilityRequests.find((request) => {
      return request.page === page && request.view === view;
    });
  }
  private getLayoutRequest(
    page: string = '',
    view: string = '',
  ): { page: string; view: string; layout: number } | undefined {
    return this.layoutRequests.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  setDefaultVisibility(visibility: number = 0): void {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;
    this.defaultVisibility = visibility;
  }
  setDefaultLayout(layout: number = 0): void {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;
    this.defaultLayout = layout;
  }

  setVisibility(visibility: number = 0): void {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;

    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getVisibilityRequest(page, view);
    if (request) request.visibility = visibility;
    else this.visibilityRequests.push({ page, view, visibility });
  }
  setLayout(layout: number = 0): void {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;

    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getLayoutRequest(page, view);
    if (request) request.layout = layout;
    else this.layoutRequests.push({ page, view, layout });
  }

  getCurrentVisibilityRequest(): {
    page: string;
    view: string;
    visibility: number;
  } | null {
    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getVisibilityRequest(page, view);

    return request ?? null;
  }
  getCurrentLayoutRequest(): {
    page: string;
    view: string;
    layout: number;
  } | null {
    const page = this.getCurrentPageKey();
    const view = this.getCurrentViewKey();
    const request = this.getLayoutRequest(page, view);

    return request ?? null;
  }

  getCurrentVisibility(): number {
    const request = this.getCurrentVisibilityRequest();
    if (request) return request.visibility;
    return this.defaultVisibility;
  }
  getCurrentLayout(): number {
    const request = this.getCurrentLayoutRequest();
    if (request) return request.layout;
    return this.defaultLayout;
  }

  isWide(): boolean {
    return !this.isThin();
  }
  isThin(): boolean {
    if (this.isDrawer()) return false;

    const { innerWidth } = this.context.window;

    if (this.getCurrentLayout() === NavigationLayout.WIDE) {
      return innerWidth <= NAVIGATION_MIN_WIDTH;
    }
    return this.getCurrentLayout() === NavigationLayout.THIN;
  }

  isDrawer(): boolean {
    return this.context.window.innerWidth <= 600;
  }

  isNone(): boolean {
    return this.getCurrentVisibility() === NavigationVisibility.NONE;
  }
  isExpanded(): boolean {
    return this.getCurrentVisibility() === NavigationVisibility.EXPANDED;
  }
  isCollapsed(): boolean {
    return this.getCurrentVisibility() === NavigationVisibility.COLLAPSED;
  }

  openNavigationDrawer(): void {
    this.setVisibility(NavigationVisibility.EXPANDED);
  }
  closeNavigationDrawer(): void {
    this.setVisibility(NavigationVisibility.COLLAPSED);
  }
  disableNavigationDrawer(): void {
    this.setVisibility(NavigationVisibility.NONE);
  }
}
