import ModuleLabel from "./data/ServiceLabel.js";

class Label {
	title = "";
	hexColor = "";

	fromData(data) {
		data = new ModuleLabel(data);
		this.title = data.title;
		this.hexColor = data.hexColor;
		return this;
	}
	toData() {
		return new ModuleLabel({ title: this.title, hexColor: this.hexColor });
	}
	toCount(strs) {
		return 0;
	}

	isEqual(label) {
		return this.title === label.title && this.hexColor === label.hexColor;
	}

	compare(item) {
		return 0;
	}
}

export default Label;
