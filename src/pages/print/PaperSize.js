import Host from "@/host/ApiHost";
import Size from "./Size";

export default class PaperSize {
	static _4R = new PaperSize(
		"4R",
		Host.res("icon/paper-a4.svg"),
		new Size("10.2cm", "15.2cm"),
	);
	static A4 = new PaperSize(
		"A4",
		Host.res("icon/paper-a4.svg"),
		new Size("210mm", "297mm"),
	);
	static A3 = new PaperSize(
		"A3",
		Host.res("icon/paper-a3.svg"),
		new Size("297mm", "420mm"),
	);

	constructor(title, icon, size) {
		this.title = title;
		this.icon = icon;
		this.size = size;
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
