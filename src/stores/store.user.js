import Vuex from "vuex";
import ItemUser from "../items/User.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import UserRequest from "@/request/User";
const init = (Stores) => {
    const loginStore = Stores.login;
    const context = new StoreBuilder()
        .onFetchItems(async () => {
        const user = await loginStore.dispatch("getUser");
        if (!user.isTypeAdmin() && !user.isTypeStaff())
            throw new Error();
        const api = await UserRequest.list();
        const content = api.optArrayContent();
        return content.map((data) => new ItemUser(Stores).fromData(data));
    })
        .onGetStore(() => Stores.user)
        .action("refresh", async (context) => {
        context.state.dataLoader.doTimeout();
        await context.dispatch("getUsers");
    })
        .action("getUsers", async (context) => {
        return await context.state.dataLoader.data();
    })
        .action("getUserByUsername", async (context, username = "") => {
        const users = await context.dispatch("getUsers");
        return users.find((user) => user.username === username);
    })
        .action("updateTypeOfUserByUsername", async (context, arg) => {
        try {
            const user = await loginStore.dispatch("getUser");
            if (!user.isTypeAdmin())
                throw new Error();
            const { username, userType } = arg;
            const api = await UserRequest.update(username, userType);
            const content = api.optObjectContent();
            const userChange = new ItemUser(Stores).fromData(content);
            if (!userChange)
                throw new Error();
            context.state.list.updateItemById(userChange.username, (item) => {
                return userChange;
            });
            return userChange;
        }
        catch (error) {
            context.state.list.clear();
            throw error;
        }
    })
        .action("addUser", async (context, arg) => {
        const user = await loginStore.dispatch("getUser");
        if (!user.isTypeAdmin())
            throw new Error();
        const api = await UserRequest.add(arg.username, arg.name, arg.passwordNew, arg.passwordRepeat);
        const content = api.getObjectContent();
        const newUser = new ItemUser(Stores).fromData(content);
        context.state.list.addItem(newUser);
        return newUser;
    })
        .action("removeUserByUsername", async (context, arg) => {
        const user = await loginStore.dispatch("getUser");
        if (!user.isTypeAdmin())
            throw new Error();
        const api = await UserRequest.remove(arg.username);
        const content = api.getStringContent();
        if (content !== "ok")
            throw new Error();
        context.state.list.removeItemById(arg.username);
        return true;
    })
        .build();
    context.getters.token = () => loginStore.getters.token;
    return new Vuex.Store(context);
};
export default { init };
