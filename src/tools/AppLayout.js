class AppLayout {
   static Layout = { NORMAL: -1, FULL: -2 };

   // for quick checking arguments
   static #layouts = Object.keys(this.Layout).map((key) => this.Layout[key]);

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
      if (!AppLayout.#layouts.includes(mode)) return false;

      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getVisibilityRequest(page, view);

      if (request) request.mode = mode;
      else this.requests.push({ page, view, mode });
   }

   #getCurrentVisibilityRequest() {
      const page = this.#getCurrentPageKey();
      const view = this.#getCurrentViewKey();
      const request = this.#getVisibilityRequest(page, view);

      return request ?? null;
   }
   getCurrentLayout() {
      const request = this.#getCurrentVisibilityRequest();
      return request?.mode ?? AppLayout.Layout.FULL;
   }

   isNormal() {
      return this.getCurrentLayout() === AppLayout.Layout.NORMAL;
   }
   isFull() {
      return this.getCurrentLayout() === AppLayout.Layout.FULL;
   }
}

export default AppLayout;
