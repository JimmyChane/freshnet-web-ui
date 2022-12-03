import Host from "@/host/ApiHost";

export default class PaperSide {
	static Front = new PaperSide("1 Side", Host.res("icon/paper-1sided.svg"));
	static FrontBack = new PaperSide("2 Side", Host.res("icon/paper-2sided.svg"));
	static FrontIc = new PaperSide(
		"1 Side IC Full Copy",
		Host.res("icon/paper-a4-1sided-ic.svg"),
	);

	constructor(title, icon) {
		this.title = title;
		this.icon = icon;
	}
}
