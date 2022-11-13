class Navigation {
   static Visibility = { NONE: -1, EXPANDED: -2, COLLAPSED: -3 };
   static Layout = { WIDE: -1, THIN: -2 };

   context;

   requests = [];
   layoutRequests = [];

   constructor(context) {
      this.context = context;
   }

   setVisibility(visibility) {
      switch (visibility) {
         default:
            return;
         case Navigation.Visibility.NONE:
         case Navigation.Visibility.EXPANDED:
         case Navigation.Visibility.COLLAPSED:
      }

      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.requests.find((request) => {
         return request.page === page && request.view === view;
      });
      if (request) request.visibility = visibility;
      else this.requests.push({ page, view, visibility });
   }
   setLayout(layout) {
      switch (layout) {
         default:
            return;
         case Navigation.Layout.WIDE:
         case Navigation.Layout.THIN:
      }

      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.layoutRequests.find((request) => {
         return request.page === page && request.view === view;
      });
      if (request) request.layout = layout;
      else this.layoutRequests.push({ page, view, layout });
   }

   getCurrentRequest() {
      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.requests.find((request) => {
         return request.page === page && request.view === view;
      });

      return request ? request : null;
   }

   getCurrentLayoutRequest() {
      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.layoutRequests.find((request) => {
         return request.page === page && request.view === view;
      });

      return request ? request : null;
   }

   getCurrentVisibility() {
      const request = this.getCurrentRequest();
      return request ? request.visibility : Navigation.Visibility.COLLAPSED;
   }
   getCurrentLayout() {
      const request = this.getCurrentLayoutRequest();
      return request ? request.layout : Navigation.Layout.WIDE;
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

   isWide() {
      return !this.isThin();
   }
   isThin() {
      if (this.isDrawer()) return false;

      const { window } = this.context;
      const { innerWidth } = window;

      if (this.getCurrentLayout() === Navigation.Layout.WIDE) {
         return innerWidth <= 1000;
      }
      return this.getCurrentLayout() === Navigation.Layout.THIN;
   }

   isDrawer() {
      const { window } = this.context;
      const { innerWidth } = window;
      return innerWidth <= 600;
   }
}

export default Navigation;
