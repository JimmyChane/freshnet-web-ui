import OrderCustomer from "./OrderCustomer";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
export default class Order {
    static Status = { Pending: 0, Completed: 1 };
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    id = "";
    customer = null;
    content = "";
    createdAt = "";
    status = Order.Status.Pending;
    fromData(data) {
        this.id = U.trimId(data._id);
        this.customer = new OrderCustomer(this.stores).fromData({
            name: U.trimText(data.customer_name),
            phoneNumber: U.trimText(data.phone_number),
        });
        this.content = U.trimText(data.content);
        this.createdAt = data.createdAt;
        this.status =
            data.status !== Order.Status.Completed
                ? Order.Status.Pending
                : Order.Status.Completed;
        return this;
    }
    toData() {
        const customer = this.customer?.toData();
        return {
            _id: this.id,
            content: this.content,
            customer_name: customer?.name,
            phone_number: customer?.phoneNumber,
            createdAt: this.createdAt,
            status: this.status,
        };
    }
    toCount(strs) {
        let count = strs.reduce((count, str) => {
            if (ItemSearcher.textContains("order", str))
                count++;
            if (ItemSearcher.textContains(this.content, str))
                count++;
            if (ItemSearcher.textContains(String(this.status), str))
                count++;
            return count;
        }, 0);
        if (this.customer)
            count += this.customer.toCount(strs);
        return count;
    }
    compare(item) {
        return 0;
    }
}
