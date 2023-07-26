import U from "@/U";
export default class Label {
    static URGENT = new Label().fromData({
        title: "Urgent",
        hexColor: "d93f35",
    });
    static WARRANTY = new Label().fromData({
        title: "Warranty",
        hexColor: "db950c",
    });
    title = "";
    hexColor = "";
    fromData(data) {
        this.title = U.trimText(data.title);
        this.hexColor = U.trimId(data.hexColor);
        return this;
    }
    toData() {
        return {
            title: U.trimText(this.title),
            hexColor: U.trimId(this.hexColor),
        };
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
