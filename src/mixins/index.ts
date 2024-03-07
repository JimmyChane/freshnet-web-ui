import { isFunction, isObjectOnly, optString } from "@/U";

const Mixin = {
  created(this: any) {
    const getTitle = () => {
      let title = this.$options.title;
      if (isFunction(title)) {
        title = title.call(this);
      }
      return optString(title).trim();
    };

    const getColors = () => {
      let color = this.$options.color;
      if (isFunction(color)) {
        color = color.call(this);
      }
      color = isObjectOnly(color) ? color : {};

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
      if (isFunction(icon)) {
        icon = icon.call(this);
      }
      icon = isObjectOnly(icon) ? icon : {};

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
