import Vuex from "vuex";
import { Type } from "@/items/Specification";
import StoreBuilder from "./tools/StoreBuilder";
import SpecificationRequest from "@/request/Specification";
const init = (Stores) => {
    const context = new StoreBuilder()
        .onFetchItems(async () => {
        const api = await SpecificationRequest.list();
        const content = api.optArrayContent();
        return content.map((content) => {
            return new Type(Stores).fromData(content);
        });
    })
        .onGetStore(() => Stores.specification)
        .action("refresh", async (context) => {
        context.state.dataLoader.doTimeout();
        await context.dispatch("getItems");
    })
        .action("getItems", async (context) => {
        return context.state.dataLoader.data();
    })
        .action("getItemOfKey", async (context, key = "") => {
        const items = await context.dispatch("getItems");
        return items.find((item) => item.key === key);
    })
        .build();
    return new Vuex.Store(context);
};
export default { init };
