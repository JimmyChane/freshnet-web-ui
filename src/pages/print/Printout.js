import Color from "./Color";

export default class Printout {
	static BlackWhite = new Printout("", Color.BlackWhite);
	static Colorful = new Printout("", Color.Colorful);
	static BorderlessColorful = new Printout("Borderless", Color.Colorful);

	constructor(title, color) {
		this.title = title;
		this.color = color;
	}

	toString() {
		if (!this.title) return `${this.color.title}`;
		return `${this.color.title} ${this.title}`;
	}
}
