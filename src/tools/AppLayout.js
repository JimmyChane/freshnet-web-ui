export default class AppLayout {
    static Layout = { NORMAL: -1, FULL: -2 };
    // for quick checking arguments
    static LAYOUTS = Object.values(this.Layout);
    context; // Replace 'any' with the actual type of 'context' if possible.
    requests = [];
    constructor(context) {
        this.context = context;
    }
    getCurrentPageKey() {
        return this.context.currentPageKey;
    }
    getCurrentViewKey() {
        return this.context.currentViewKey;
    }
    getVisibilityRequest(page = "", view = "") {
        return this.requests.find((request) => {
            return request.page === page && request.view === view;
        });
    }
    setLayout(mode = 0) {
        if (!AppLayout.LAYOUTS.includes(mode))
            return;
        const page = this.getCurrentPageKey();
        const view = this.getCurrentViewKey();
        const request = this.getVisibilityRequest(page, view);
        if (request)
            request.mode = mode;
        else
            this.requests.push({ page, view, mode });
    }
    getCurrentVisibilityRequest() {
        const page = this.getCurrentPageKey();
        const view = this.getCurrentViewKey();
        const request = this.getVisibilityRequest(page, view);
        return request ?? null;
    }
    getCurrentLayout() {
        const request = this.getCurrentVisibilityRequest();
        return request?.mode ?? AppLayout.Layout.FULL;
    }
    isNormal() {
        return this.getCurrentLayout() === AppLayout.Layout.NORMAL;
    }
    isFull() {
        return this.getCurrentLayout() === AppLayout.Layout.FULL;
    }
}
