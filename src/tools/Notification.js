import TimeNowGetter from "@/tools/TimeNowGetter.js";
const keyGetter = new TimeNowGetter();

class Notification {
   context;

   key;
   isShowing = false;

   icon;
   text;
   isLoading;
   actions;

   constructor(context, param = { text, isLoading, icon, actions }) {
      this.context = context;

      this.key = keyGetter.get();

      this.icon = param.icon;
      this.isLoading = param.isLoading;
      this.text = param.text;
      this.actions = param.actions;
   }

   get index() {
      return this.context.getters.snackbars.indexOf(this);
   }

   show(timeout = 3000) {
      setTimeout(() => (this.isShowing = true), 80);
      setTimeout(() => this.hide(), timeout);
      return this;
   }
   hide() {
      this.isShowing = false;

      setTimeout(() => {
         const index = this.context.state.snackbars.indexOf(this);
         this.context.state.snackbars.splice(index, 1);
         this.context.commit("snackbars", this.context.state.snackbars);
      }, 80);

      return this;
   }
}

export default Notification;
