import PaperType from "./PaperType";
import PaperSize from "./PaperSize";

export default class Paper {
	static Photo4R = new Paper(PaperType.Photo, PaperSize._4R);
	static PhotoA4 = new Paper(PaperType.Photo, PaperSize.A4);

	static PlainA4 = new Paper(PaperType.Plain, PaperSize.A4);
	static PlainA3 = new Paper(PaperType.Plain, PaperSize.A3);

	constructor(paperType, paperSize) {
		this.paperType = paperType;
		this.paperSize = paperSize;
	}

	toString() {
		return `${this.paperType.title} ${this.paperSize.title}`;
	}
}
