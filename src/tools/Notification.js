class Notification {
   snackbars;

   key;
   isShowing = false;

   icon;
   text;
   isLoading;
   actions;

   constructor(context, param = { text, isLoading, icon, actions }) {
      this.snackbars = context.snackbars;

      this.key = context.keyGetter.get();

      this.icon = param.icon;
      this.isLoading = param.isLoading;
      this.text = param.text;
      this.actions = param.actions;
   }

   get index() {
      return this.snackbars.indexOf(this);
   }

   show(timeout = 3000) {
      setTimeout(() => (this.isShowing = true), 80);
      setTimeout(() => this.hide(), timeout);
      return this;
   }
   hide() {
      this.isShowing = false;

      setTimeout(() => {
         this.snackbars.splice(this.snackbars.indexOf(this), 1);
      }, 80);

      return this;
   }
}

export default Notification;
