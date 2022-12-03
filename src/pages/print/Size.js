export default class Size {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	toString() {
		return `${this.width} x ${this.height}`;
	}
}
