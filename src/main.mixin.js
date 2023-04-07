import U from "./U";

const Mixin = {
   created() {
      const getTitle = () => {
         let title = this.$options.title;
         if (U.isFunction(title)) {
            title = title.call(this);
         }
         return typeof title === "string" ? title.trim() : "";
      };
      const getColors = () => {
         let color = this.$options.color;
         if (U.isFunction(color)) {
            color = color.call(this);
         }
         color = typeof color === "object" ? color : {};

         const {
            primary = "",
            primaryLight = "",
            primaryDark = "",
            accent = "",
         } = color;

         return { primary, primaryLight, primaryDark, accent };
      };
      const getIcons = () => {
         let icon = this.$options.icon;
         if (U.isFunction(icon)) {
            icon = icon.call(this);
         }
         icon = typeof icon === "object" ? icon : {};

         const { light = "", dark = "", color = "" } = icon;

         return { light, dark, color };
      };

      const title = getTitle();

      if (title) {
         document.title = title;
      }
   },
};

export default Mixin;
