import U from "@/U";

const Mixin = {
  created(this: any) {
    const getTitle = () => {
      let title = this.$options.title;
      if (U.isFunction(title)) {
        title = title.call(this);
      }
      return U.optString(title).trim();
    };

    const getColors = () => {
      let color = this.$options.color;
      if (U.isFunction(color)) {
        color = color.call(this);
      }
      color = U.isObjectOnly(color) ? color : {};

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
      icon = U.isObjectOnly(icon) ? icon : {};

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
