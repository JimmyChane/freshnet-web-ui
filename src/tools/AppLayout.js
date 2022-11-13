class AppLayout {
   static Layout = { NORMAL: -1, FULL: -2 };

   context;

   requests = [];

   constructor(context) {
      this.context = context;
   }

   setLayout(mode) {
      switch (mode) {
         default:
            return;
         case AppLayout.Layout.NORMAL:
         case AppLayout.Layout.FULL:
      }

      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.requests.find((request) => {
         return request.page === page && request.view === view;
      });
      if (request) request.mode = mode;
      else this.requests.push({ page, view, mode });
   }

   getCurrentRequest() {
      const page = this.context.currentPageKey;
      const view = this.context.currentViewKey;

      const request = this.requests.find((request) => {
         return request.page === page && request.view === view;
      });

      return request ? request : null;
   }
   getCurrentLayout() {
      const request = this.getCurrentRequest();
      return request ? request.mode : AppLayout.Layout.FULL;
   }

   isNormal() {
      return this.getCurrentLayout() === AppLayout.Layout.NORMAL;
   }
   isFull() {
      return this.getCurrentLayout() === AppLayout.Layout.FULL;
   }
}

export default AppLayout;
