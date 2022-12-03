import Host from "@/host/ApiHost";
import Size from "./Size";

export default class PaperSize {
	static _4R = new PaperSize(
		new Size("10.2cm", "15.2cm"),
		"4R",
		Host.res("icon/paper-a4.svg"),
	);
	static A4 = new PaperSize(
		new Size("210mm", "297mm"),
		"A4",
		Host.res("icon/paper-a4.svg"),
	);
	static A3 = new PaperSize(
		new Size("297mm", "420mm"),
		"A3",
		Host.res("icon/paper-a3.svg"),
	);

	constructor(size, title, icon) {
		this.size = size;
		this.title = title;
		this.icon = icon;
	}

	get width() {
		return this.size.width;
	}
	get height() {
		return this.size.height;
	}
	toString() {
		return this.size.toString();
	}
}
