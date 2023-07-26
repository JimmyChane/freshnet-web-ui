import U from "@/U";
const isUndefinedOrNull = (value) => value === null || value === undefined;
export default class List {
    lastModified = 0;
    items = [];
    idProperty = "id";
    constructor(idProperty) {
        this.idProperty = idProperty;
    }
    clear() {
        this.items = [];
        this.lastModified = Date.now();
        return this;
    }
    addItems(...items) {
        const replacedItems = [];
        for (const item of items) {
            const found = this.items.find((found) => {
                return found[this.idProperty] === item[this.idProperty];
            });
            if (!found)
                continue;
            const index = this.items.indexOf(found);
            this.items[index] = item;
            replacedItems.push(item);
        }
        const filteredItems = items.filter((item) => {
            return !this.items.find((found) => {
                return found[this.idProperty] === item[this.idProperty];
            });
        });
        this.items.push(...filteredItems);
        if (replacedItems.length > 0 || filteredItems.length > 0) {
            this.lastModified = Date.now();
        }
        return [...replacedItems, ...filteredItems];
    }
    addItem(item) {
        const addedItems = this.addItems(item);
        return addedItems.length > 0 ? addedItems[0] : null;
    }
    removeItemsByIds(...ids) {
        const removedItems = [];
        for (const id of ids) {
            const item = this.items.find((item) => item[this.idProperty] === id);
            if (!item)
                continue;
            this.items.splice(this.items.indexOf(item), 1);
            removedItems.push(item);
        }
        if (removedItems.length > 0) {
            this.lastModified = Date.now();
        }
        return removedItems;
    }
    removeItemById(id) {
        const removedItems = this.removeItemsByIds(id);
        return removedItems.length > 0 ? removedItems[0] : null;
    }
    removeItemByItems(...items) {
        const ids = items.map((item) => item[this.idProperty]);
        const removedItems = this.removeItemsByIds(...ids);
        return items.map((item) => {
            const removedItem = removedItems.find((removedItem) => {
                return removedItem[this.idProperty] === item[this.idProperty];
            });
            return removedItem ?? item;
        });
    }
    removeItemByItem(item) {
        const removedItems = this.removeItemByItems(item);
        return removedItems.length > 0 ? removedItems[0] : null;
    }
    updateItemById(id, updater = (item) => { }) {
        const item = this.items.find((item) => item[this.idProperty] === id);
        const inputItem = updater(item);
        const isReadableObject = !isUndefinedOrNull(inputItem) && U.isObject(inputItem);
        const inputItemId = isReadableObject ? inputItem[this.idProperty] : "";
        if (isReadableObject &&
            inputItem !== item &&
            inputItemId === item[this.idProperty]) {
            const index = this.items.indexOf(item);
            if (index === -1)
                this.addItem(inputItem);
            else
                this.items[index] = inputItem;
        }
        this.lastModified = Date.now();
        return inputItem;
    }
}
