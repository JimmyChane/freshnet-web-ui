const Mixin = {
	created() {
		const onTitle = (title) => {
			title = typeof title === "function" ? title.call(this) : title;
			title = typeof title === "string" ? title.trim() : "";
			return title;
		};
		const onColor = (color = {}) => {
			color = typeof color === "function" ? color.call(this) : color;
			color = typeof color === "object" ? color : {};

			let {
				primary = "",
				primaryLight = "",
				primaryDark = "",
				accent = "",
			} = color;

			return { primary, primaryLight, primaryDark, accent };
		};
		const onIcon = (icon) => {
			icon = typeof icon === "function" ? icon.call(this) : icon;
			icon = typeof icon === "object" ? icon : {};

			let { light = "", dark = "", color = "" } = icon;

			return { light, dark, color };
		};

		const title = onTitle(this.$options.title);

		if (title) {
			document.title = title;
		}
	},
};

export default Mixin;
