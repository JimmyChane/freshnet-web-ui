import Color from "./Color";

export default class Output {
	static BlackWhite = new Output("", Color.BlackWhite);
	static Colorful = new Output("", Color.Colorful);
	static BorderlessColorful = new Output("Borderless", Color.Colorful);

	constructor(title, color) {
		this.title = title;
		this.color = color;
	}

	toString() {
		if (!this.title) return `${this.color.title}`;
		return `${this.color.title} ${this.title}`;
	}
}
