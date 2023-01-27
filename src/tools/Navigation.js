class Navigation {
   static Visibility = { NONE: -1, EXPANDED: -2, COLLAPSED: -3 };
   static Layout = { WIDE: -1, THIN: -2 };

   // for quick checking arguments
   static #visibilities = Object.keys(this.Visibility).map(
      (key) => this.Visibility[key],
   );
   static #layouts = Object.keys(this.Layout).map((key) => this.Layout[key]);

   #context;
   #visibilityRequests = [];
   #layoutRequests = [];

   constructor(context) {
      this.#context = context;
   }

   #getCurrentPageKey() {
      return this.#context.currentPageKey;
   }
   #getCurrentViewKey() {
      return this.#context.currentViewKey;
   }

   #getVisibilityRequest(page = "", view = "") {
      return this.#visibilityRequests.find((request) => {
         return request.page === page && request.view === view;
      });
   }
   #getLayoutRequest(page = "", view = "") {
      return this.#layoutRequests.find((request) => {
         return request.page === page && request.view === view;
      });
   }

   setVisibility(visibility = 0) {
      if (!Navigation.#visibilities.includes(visibility)) return;

      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getVisibilityRequest(page, view);
      if (request) request.visibility = visibility;
      else this.#visibilityRequests.push({ page, view, visibility });
   }
   setLayout(layout = 0) {
      if (!Navigation.#layouts.includes(layout)) return;

      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getLayoutRequest(page, view);
      if (request) request.layout = layout;
      else this.#layoutRequests.push({ page, view, layout });
   }

   #getCurrentVisibilityRequest() {
      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getVisibilityRequest(page, view);

      return request ? request : null;
   }
   #getCurrentLayoutRequest() {
      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getLayoutRequest(page, view);

      return request ? request : null;
   }

   getCurrentVisibility() {
      const request = this.#getCurrentVisibilityRequest();
      if (request) return request.visibility;
      return Navigation.Visibility.COLLAPSED;
   }
   getCurrentLayout() {
      const request = this.#getCurrentLayoutRequest();
      if (request) return request.layout;
      return Navigation.Layout.WIDE;
   }

   isWide() {
      return !this.isThin();
   }
   isThin() {
      if (this.isDrawer()) return false;

      const { innerWidth } = this.#context.window;

      if (this.getCurrentLayout() === Navigation.Layout.WIDE) {
         return innerWidth <= 1000;
      }
      return this.getCurrentLayout() === Navigation.Layout.THIN;
   }

   isDrawer() {
      return this.#context.window.innerWidth <= 600;
   }

   isNone() {
      return this.getCurrentVisibility() === Navigation.Visibility.NONE;
   }
   isExpanded() {
      return this.getCurrentVisibility() === Navigation.Visibility.EXPANDED;
   }
   isCollapsed() {
      return this.getCurrentVisibility() === Navigation.Visibility.COLLAPSED;
   }

   openNavigationDrawer() {
      this.setVisibility(Navigation.Visibility.EXPANDED);
   }
   closeNavigationDrawer() {
      this.setVisibility(Navigation.Visibility.COLLAPSED);
   }
   disableNavigationDrawer() {
      this.setVisibility(Navigation.Visibility.NONE);
   }
}

export default Navigation;
