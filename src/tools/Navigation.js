class Navigation {
   static Visibility = { NONE: -1, EXPANDED: -2, COLLAPSED: -3 };
   static Layout = { WIDE: -1, THIN: -2 };

   context;

   visibilityRequests = [];
   layoutRequests = [];

   constructor(context) {
      this.context = context;
   }

   #getCurrentPageKey() {
      return this.context.currentPageKey;
   }
   #getCurrentViewKey() {
      return this.context.currentViewKey;
   }
   #getVisibilityRequest(page = "", view = "") {
      return this.visibilityRequests.find((request) => {
         return request.page === page && request.view === view;
      });
   }
   #getLayoutRequest(page = "", view = "") {
      return this.layoutRequests.find((request) => {
         return request.page === page && request.view === view;
      });
   }

   setVisibility(visibility = 0) {
      if (
         !Object.keys(Navigation.Visibility)
            .map((key) => Navigation.Visibility[key])
            .includes(visibility)
      ) {
         return;
      }

      const request = this.#getVisibilityRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );
      if (request) request.visibility = visibility;
      else this.visibilityRequests.push({ page, view, visibility });
   }
   setLayout(layout = 0) {
      if (
         !Object.keys(Navigation.Layout)
            .map((key) => Navigation.Layout[key])
            .includes(layout)
      ) {
         return;
      }

      const request = this.#getLayoutRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );
      if (request) request.layout = layout;
      else this.layoutRequests.push({ page, view, layout });
   }

   #getCurrentVisibilityRequest() {
      const request = this.#getVisibilityRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );

      return request ? request : null;
   }
   #getCurrentLayoutRequest() {
      const request = this.#getLayoutRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );

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

      const { innerWidth } = this.context.window;

      if (this.getCurrentLayout() === Navigation.Layout.WIDE) {
         return innerWidth <= 1000;
      }
      return this.getCurrentLayout() === Navigation.Layout.THIN;
   }

   isDrawer() {
      return this.context.window.innerWidth <= 600;
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
