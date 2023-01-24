class AppLayout {
   static Layout = { NORMAL: -1, FULL: -2 };

   context;

   requests = [];

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
      return this.requests.find((request) => {
         return request.page === page && request.view === view;
      });
   }

   setLayout(mode = 0) {
      if (
         !Object.keys(AppLayout.Layout)
            .map((key) => AppLayout.Layout[key])
            .includes(mode)
      ) {
         return false;
      }

      const request = this.#getVisibilityRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );

      if (request) request.mode = mode;
      else this.requests.push({ page, view, mode });
   }

   #getCurrentVisibilityRequest() {
      const request = this.#getVisibilityRequest(
         this.#getCurrentPageKey(),
         this.#getCurrentViewKey(),
      );

      return request ? request : null;
   }
   getCurrentLayout() {
      const request = this.#getCurrentVisibilityRequest();
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
