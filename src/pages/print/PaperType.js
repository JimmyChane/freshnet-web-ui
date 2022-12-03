export default class PaperType {
	static Plain = new PaperType("Plain Paper");
	static Photo = new PaperType("Photo Paper");

	constructor(title) {
		this.title = title;
	}
}
