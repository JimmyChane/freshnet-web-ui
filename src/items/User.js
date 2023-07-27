import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
export default class User {
    static Type = { None: -1, Admin: 0, Staff: 1, Customer: 2 };
    static ReservedUsername = { Admin: "admin", Staff: "staff" };
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    username = "";
    name = "";
    userType = User.Type.None;
    fromData(data) {
        this.username = U.trimId(data.username);
        this.name = U.trimText(data.name);
        this.userType = data.userType;
        return this;
    }
    toData() {
        return {
            username: U.trimId(this.username),
            name: U.trimText(this.name),
            userType: this.userType,
        };
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (ItemSearcher.textContains(this.username, str))
                count++;
            if (ItemSearcher.textContains(this.name, str))
                count++;
            return count;
        }, 0);
    }
    toTextUserType() {
        if (this.isTypeAdmin())
            return "Admin";
        if (this.isTypeStaff())
            return "Staff";
        if (this.isTypeCustomer())
            return "Customer";
        return "Other";
    }
    isTypeNone() {
        return (this.userType === User.Type.None ||
            (!this.isTypeAdmin() && !this.isTypeStaff() && !this.isTypeCustomer()));
    }
    isTypeAdmin() {
        return this.userType === User.Type.Admin;
    }
    isTypeStaff() {
        return this.userType === User.Type.Staff;
    }
    isTypeCustomer() {
        return this.userType === User.Type.Customer;
    }
    isDefault() {
        return (this.username === User.ReservedUsername.Admin ||
            this.username === User.ReservedUsername.Staff);
    }
    compare(item) {
        return 0;
    }
    getUnique() {
        return this.username;
    }
}
