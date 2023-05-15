import U from "@/U";

class PopupContext {
   context = null;
   isShowing = false;
   input = null;

   onShowCallback;
   onDismissCallback;
   onCancelCallback;
   onConfirmCallback;

   constructor(context) {
      this.context = context;
   }
   show(input) {
      const accept = () => {
         this.isShowing = true;
         this.input = input;
      };
      if (!U.isFunction(this.onShowCallback)) {
         accept();
         return;
      }
      const reject = (error, reason) => {
         if (typeof reason === "string" && reason.length) {
            this.context.store.dispatch("snackbarShow", reason);
         }
         if (error !== undefined) {
            console.error(error);
         }
      };
      this.onShowCallback(accept, reject, input);
   }
   dismiss() {
      const accept = () => {
         this.isShowing = false;
         this.input = null;
      };
      if (!U.isFunction(this.onDismissCallback)) {
         accept();
         return;
      }
      const reject = (error, reason) => {
         if (typeof reason === "string" && reason.length) {
            this.context.store.dispatch("snackbarShow", reason);
         }
         if (error !== undefined) {
            console.error(error);
         }
      };
      this.onDismissCallback(accept, reject);
   }
   cancel() {
      const accept = () => {
         this.isShowing = false;
         this.input = null;
      };
      if (!U.isFunction(this.onCancelCallback)) {
         accept();
         return;
      }
      const reject = (error, reason) => {
         if (typeof reason === "string" && reason.length) {
            this.context.store.dispatch("snackbarShow", reason);
         }
         if (error !== undefined) {
            console.error(error);
         }
      };
      this.onCancelCallback(accept, reject);
   }
   confirm(output) {
      const accept = () => {
         this.isShowing = false;
         this.input = null;
      };
      if (!U.isFunction(this.onConfirmCallback)) {
         accept();
         return;
      }
      const reject = (error, reason) => {
         if (typeof reason === "string" && reason.length) {
            this.context.store.dispatch("snackbarShow", reason);
         }
         if (error !== undefined) {
            console.error(error);
         }
      };
      this.onConfirmCallback(accept, reject, output);
   }

   onShow(fun) {
      this.onShowCallback = fun;
      return this;
   }
   onDismiss(fun) {
      this.onDismissCallback = fun;
      return this;
   }
   onCancel(fun) {
      this.onCancelCallback = fun;
      return this;
   }
   onConfirm(fun) {
      this.onConfirmCallback = fun;
      return this;
   }
}

export default PopupContext;
