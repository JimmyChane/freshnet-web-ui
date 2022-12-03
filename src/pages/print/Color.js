import Host from "@/host/ApiHost";

export default class Color {
	static BlackWhite = new Color(
		"Black & White",
		Host.res("icon/palette-bw.svg"),
	);
	static Colorful = new Color("Color", Host.res("icon/palette-cmyk.svg"));

	constructor(title, icon) {
		this.title = title;
		this.icon = icon;
	}
	toString() {
		return this.title;
	}
}
