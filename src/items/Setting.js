import U from "@/U";
export default class Setting {
    static Visibility = { Protected: "protected", Private: "private" };
    static Key = {
        PublicShowPrice: "public-showPrice",
        Location: "store-location",
        LocationLink: "store-location-link",
        Contacts: "store-contacts",
        CompanyName: "store-name",
        CompanyCategory: "store-category",
        CompanyWorkingHours: "store-working-hours",
    };
    stores;
    key = "";
    visibility = "";
    value;
    constructor(stores) {
        this.stores = stores;
    }
    fromData(data) {
        this.key = U.trimId(data.key);
        this.visibility = U.trimId(data.visibility);
        this.value = data.value;
        return this;
    }
    toData() {
        return {
            key: U.trimId(this.key),
            visibility: U.trimId(this.visibility),
            value: this.value,
        };
    }
}
